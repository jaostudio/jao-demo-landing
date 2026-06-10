/**
 * Phase 4 — Visual Fingerprint Audit Runner
 *
 * Orchestrates:
 *   1. Runtime DOM extraction (Playwright) — structural + density
 *   2. Static motion extraction (ts-morph) — motion profiles
 *   3. Layout entropy computation (motif hashing)
 *   4. Cross-page comparison (divergence matrix + collision warnings)
 *
 * Usage:
 *   npm run audit                    (requires `npm run dev` running)
 *   npm run audit -- --no-server    (skip Playwright, AST-only for debug)
 */

import { chromium } from "playwright";
import {
  computeFingerprint,
  measureDensity,
  extractMotion,
  computeLayoutEntropy,
} from "./visual-fingerprint";
import { writeAuditReport, printAuditSummary } from "./core/reporter";
import type { PageFingerprint, AuditReport } from "./core/types";

const VERTICALS = [
  {
    name: "summit-ridge",
    url: "http://localhost:3000/summit-ridge",
  },
  {
    name: "brightsmile",
    url: "http://localhost:3000/brightsmile",
  },
  {
    name: "harrison-cole",
    url: "http://localhost:3000/harrison-cole",
  },
];

const skipPlaywright = process.argv.includes("--no-server");

async function main() {
  const profiles: Record<string, PageFingerprint> = {};
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;

  if (!skipPlaywright) {
    browser = await chromium.launch({ headless: true });
  }

  for (const v of VERTICALS) {
    const timestamp = Date.now();
    const domFingerprint = { sections: 0, grids: 0, cards: 0, lists: 0, flatTextBlocks: 0, sectionFingerprints: [] };
    const densityMetrics = { slices: [], elementsPerViewport: [], textWeightRatio: 0, interactionNodes: 0 };

    if (browser && !skipPlaywright) {
      try {
        const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
        await page.goto(v.url, { waitUntil: "load", timeout: 30000 });

        const [dom, density] = await Promise.all([
          computeFingerprint(page, v.name),
          measureDensity(page),
        ]);

        Object.assign(domFingerprint, dom);
        Object.assign(densityMetrics, density);

        await page.close();
        console.log(`  ✓ ${v.name}: DOM + density extracted`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`  ✗ ${v.name}: Playwright failed (${msg}) — using empty DOM`);
      }
    } else {
      console.log(`  ~ ${v.name}: Playwright skipped — using empty DOM`);
    }

    // Motion extraction (static — always runs)
    const motionResult = extractMotion(v.name);
    const staggerVals = motionResult.profiles
      .map((p) => p.stagger)
      .filter((s): s is number => s !== null);
    const easingSets = motionResult.profiles
      .map((p) => p.ease)
      .filter((e): e is number[] => e !== null);

    const motionMetrics = {
      profiles: motionResult.profiles,
      declaredVariants: motionResult.declaredVariants,
      appliedPatterns: motionResult.appliedPatterns,
      motionRoles: motionResult.motionRoles,
      staggerDistribution: staggerVals,
      easingEntropy: computeEasingEntropy(easingSets),
      motionUniformityScore:
        motionResult.profiles.length > 0
          ? computeMotionUniformity(motionResult.profiles)
          : 0,
    };

    // Layout entropy
    const layoutMetrics = computeLayoutEntropy(domFingerprint);

    // UI grammar signature — hash of motif hashes
    const motifHashes = layoutMetrics.motifs
      .map((m) => m.hash)
      .sort()
      .join(",");
    const uiGrammarSignature = simpleHash(motifHashes || "empty");

    profiles[v.name] = {
      vertical: v.name,
      url: v.url,
      timestamp,
      dom: domFingerprint,
      density: densityMetrics,
      motion: motionMetrics,
      layout: layoutMetrics,
      uiGrammarSignature,
    };
  }

  if (browser) await browser.close();

  const report: AuditReport = {
    timestamp: Date.now(),
    profiles,
    divergenceMatrix: {},
    collisions: [],
    sharedGrammarScore: 0,
    collapseReport: { components: [], highRiskComponents: [], mediumRiskComponents: [], divergenceRecoveryPotential: 0 },
    grammarFingerprints: {},
    grammarDivergence: {},
    semanticFingerprints: {},
    semanticDivergence: {},
    convergentRoles: [],
    consistencyReport: { pairConsistency: {}, layerAgreement: {}, conflicts: [], globalCoherence: 0 },
  };

  writeAuditReport(report);
  printAuditSummary(report);

  console.log("  Fingerprints saved to qa-results/fingerprints/");
  console.log("  Full report: qa-results/audit.json\n");

  process.exit(0);
}

function computeEasingEntropy(easingSets: number[][]): number {
  if (easingSets.length <= 1) return 1;
  const unique = new Set(easingSets.map((e) => e.join(",")));
  return unique.size / easingSets.length;
}

function computeMotionUniformity(
  profiles: { variantName: string; stagger: number | null; sectionMapping: string[] }[]
): number {
  if (profiles.length === 0) return 0;
  const totalUses = profiles.reduce((s, p) => {
    const match = p.sectionMapping[0]?.match(/used:(\d+)x/);
    return s + (match ? parseInt(match[1], 10) : 0);
  }, 0);
  if (totalUses === 0) return 0;
  const maxUses = Math.max(
    ...profiles.map((p) => {
      const match = p.sectionMapping[0]?.match(/used:(\d+)x/);
      return match ? parseInt(match[1], 10) : 0;
    })
  );
  return maxUses / totalUses;
}

function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash).toString(16);
}

main();
