/* eslint-disable @typescript-eslint/no-explicit-any */
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import fs from "fs";
import path from "path";
import type { QAResult, QASpec, FailureSnapshot, BaselineDiff } from "./types";

const BASELINES_DIR = "qa-results/baselines";
const SCREENSHOTS_DIR = "qa-results/screenshots";

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function baselinePath(baselineId: string): string {
  return path.join(BASELINES_DIR, `${baselineId}.png`);
}

function diffPath(baselineId: string): string {
  return path.join(SCREENSHOTS_DIR, `${baselineId}-diff-${Date.now()}.png`);
}

interface RunOptions {
  captureBaseline?: boolean;
  skipDiff?: boolean;
}

export async function runQA(spec: QASpec, options?: RunOptions): Promise<QAResult> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  const start = Date.now();

  const result: QAResult = {
    suite: spec.baselineId,
    url: spec.url,
    status: "pass",
    checks: [],
    screenshots: [],
    durationMs: 0,
    timestamp: Date.now(),
  };

  try {
    await page.goto(spec.url, { waitUntil: "load", timeout: 20000 });

    // Golden baseline mode: capture screenshot, skip checks
    if (options?.captureBaseline) {
      ensureDir(BASELINES_DIR);
      const ssPath = baselinePath(spec.baselineId);
      await page.screenshot({ path: ssPath, fullPage: true });
      console.log(`Baseline captured: ${ssPath}`);
      await browser.close();
      result.durationMs = Date.now() - start;
      return result;
    }

    // Run checks
    for (const check of spec.checks) {
      try {
        await runCheck(page, result, check);
      } catch (err: any) {
        result.checks.push({
          id: check.id,
          category: check.category,
          status: "fail",
          message: `Error: ${err.message}`,
        });
        result.status = "fail";
      }
    }

    // Full-page screenshot
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${Date.now()}-full.png`);
    ensureDir(SCREENSHOTS_DIR);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    result.screenshots.push(screenshotPath);

    // Baseline diff
    if (!options?.skipDiff) {
      const diff = await computeBaselineDiff(spec.baselineId, page);
      result.baselineDiff = diff;
    }
  } catch (err: any) {
    result.status = "fail";
    result.checks.push({
      id: "page-load",
      category: "structural",
      status: "fail",
      message: `Failed to load ${spec.url}: ${err.message}`,
    });
  } finally {
    await browser.close();
    result.durationMs = Date.now() - start;
  }

  return result;
}

async function runCheck(page: any, result: QAResult, check: any): Promise<void> {
  switch (check.type) {
    case "visible": {
      const isVisible = await page.locator(check.selector).first().isVisible();
      if (!isVisible) {
        const snap = await captureFailure(page, check.selector);
        result.checks.push({
          id: check.id, category: check.category, status: "fail",
          message: `Element not visible: ${check.selector}`, failureSnapshot: snap,
        });
        result.status = "fail";
      } else {
        result.checks.push({ id: check.id, category: check.category, status: "pass" });
      }
      return;
    }

    case "text": {
      const el = page.locator(check.selector).first();
      const text = await el.textContent();
      if (text === null) {
        result.checks.push({
          id: check.id, category: check.category, status: "fail",
          message: `No text content for: ${check.selector}`,
        });
        result.status = "fail";
      } else if (check.minLength && text.trim().length < check.minLength) {
        result.checks.push({
          id: check.id, category: check.category, status: "fail",
          message: `Text too short (${text.trim().length} < ${check.minLength}): ${check.selector}`,
        });
        result.status = "fail";
      } else {
        result.checks.push({ id: check.id, category: check.category, status: "pass" });
      }
      return;
    }

    case "count": {
      const count = await page.locator(check.selector).count();
      if (check.minCount !== undefined && count < check.minCount) {
        result.checks.push({
          id: check.id, category: check.category, status: "fail",
          message: `Expected at least ${check.minCount} of "${check.selector}", found ${count}`,
        });
        result.status = "fail";
      } else {
        result.checks.push({ id: check.id, category: check.category, status: "pass" });
      }
      return;
    }

    case "hierarchy": {
      const count = await page.locator(check.selector).count();
      if (check.expected !== undefined && count !== check.expected) {
        result.checks.push({
          id: check.id, category: check.category, status: "fail",
          message: `Expected ${check.expected} of "${check.selector}", found ${count}`,
        });
        result.status = "fail";
      } else {
        result.checks.push({ id: check.id, category: check.category, status: "pass" });
      }
      return;
    }

    case "viewport": {
      const el = page.locator(check.selector).first();
      const isVisible = await el.isVisible();
      if (!isVisible) {
        result.checks.push({
          id: check.id, category: check.category, status: "fail",
          message: `Element not in viewport: ${check.selector}`,
        });
        result.status = "fail";
        return;
      }
      const box = await el.boundingBox();
      if (!box) {
        result.checks.push({
          id: check.id, category: check.category, status: "fail",
          message: `Element has no bounding box: ${check.selector}`,
        });
        result.status = "fail";
        return;
      }
      const vp = page.viewportSize();
      if (box.y + box.height > (vp?.height || 720)) {
        result.checks.push({
          id: check.id, category: check.category, status: "fail",
          message: `Element below viewport fold: ${check.selector}`,
        });
        result.status = "fail";
      } else {
        result.checks.push({ id: check.id, category: check.category, status: "pass" });
      }
      return;
    }

    case "href-valid": {
      const el = page.locator(check.selector).first();
      const href = await el.getAttribute("href");
      if (!href || href === "#" || href.trim() === "") {
        result.checks.push({
          id: check.id, category: check.category, status: "fail",
          message: `Invalid href (${href || "empty"}) for: ${check.selector}`,
        });
        result.status = "fail";
      } else {
        result.checks.push({ id: check.id, category: check.category, status: "pass" });
      }
      return;
    }
  }
}

async function captureFailure(page: any, selector: string): Promise<FailureSnapshot> {
  const ssDir = path.join(SCREENSHOTS_DIR, "failures");
  ensureDir(ssDir);

  const viewportScreenshot = path.join(ssDir, `${Date.now()}-${selector.replace(/[^a-zA-Z0-9]/g, "-")}.png`);
  await page.screenshot({ path: viewportScreenshot });

  let html = "";
  try {
    html = await page.locator(selector).first().evaluate((el: Element) => el.outerHTML);
  } catch {
    html = `[unable to capture DOM for ${selector}]`;
  }

  return { html, viewportScreenshot };
}

async function computeBaselineDiff(baselineId: string, page: any): Promise<BaselineDiff | null> {
  const basePath = baselinePath(baselineId);
  if (!fs.existsSync(basePath)) return null;

  const currentPath = path.join(SCREENSHOTS_DIR, `${Date.now()}-baseline-compare.png`);
  await page.screenshot({ path: currentPath, fullPage: true });

  const img1 = PNG.sync.read(fs.readFileSync(basePath));
  const img2 = PNG.sync.read(fs.readFileSync(currentPath));

  if (img1.width !== img2.width || img1.height !== img2.height) {
    const maxW = Math.max(img1.width, img2.width);
    const maxH = Math.max(img1.height, img2.height);
    const diff = new PNG({ width: maxW, height: maxH });
    const diffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {
      threshold: 0.1,
      includeAA: true,
    });
    const totalPixels = maxW * maxH;
    const diffImage = diffPath(baselineId);
    fs.writeFileSync(diffImage, PNG.sync.write(diff));
    return {
      diffPixels,
      diffPercent: Math.round((diffPixels / totalPixels) * 10000) / 100,
      diffImage,
    };
  }

  const diff = new PNG({ width: img1.width, height: img1.height });
  const diffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {
    threshold: 0.1,
    includeAA: true,
  });
  const totalPixels = img1.width * img1.height;
  const diffImage = diffPath(baselineId);
  fs.writeFileSync(diffImage, PNG.sync.write(diff));

  return {
    diffPixels,
    diffPercent: Math.round((diffPixels / totalPixels) * 10000) / 100,
    diffImage,
  };
}
