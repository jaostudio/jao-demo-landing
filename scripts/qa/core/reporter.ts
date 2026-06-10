import fs from "fs";
import path from "path";
import type { QAResult, CheckCategory, AuditReport } from "./types";

const RESULTS_DIR = "qa-results";
const LATEST_FILE = path.join(RESULTS_DIR, "latest.json");

const CATEGORY_LABELS: Record<CheckCategory, string> = {
  structural: "Structural",
  content: "Content",
  interaction: "Interaction",
  layout: "Layout",
};

export function writeReport(result: QAResult): void {
  const json = JSON.stringify(result, null, 2);

  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  fs.writeFileSync(LATEST_FILE, json);
}

export function printSummary(result: QAResult): void {
  const passed = result.checks.filter((c) => c.status === "pass").length;
  const failed = result.checks.filter((c) => c.status === "fail").length;

  const total = result.checks.length;

  console.log(`\n=== QA Report: ${result.suite} ===`);
  console.log(`Status: ${result.status === "pass" ? "PASS" : "FAIL"}`);
  console.log(`Duration: ${result.durationMs}ms`);
  console.log(`Checks: ${passed}/${total} passed, ${failed} failed`);
  console.log(`Screenshots: ${result.screenshots.length}`);

  // Categorized breakdown
  const categories: CheckCategory[] = ["structural", "content", "interaction", "layout"];
  for (const cat of categories) {
    const catChecks = result.checks.filter((c) => c.category === cat);
    if (catChecks.length === 0) continue;
    const catPassed = catChecks.filter((c) => c.status === "pass").length;
    const catFailed = catChecks.filter((c) => c.status === "fail").length;
    const icon = catFailed > 0 ? "✗" : "✓";
    console.log(`  ${icon} ${CATEGORY_LABELS[cat]}: ${catPassed}/${catChecks.length}`);
  }

  // Baseline diff
  if (result.baselineDiff) {
    console.log(`\nBaseline diff:`);
    console.log(`  Changed pixels: ${result.baselineDiff.diffPixels}`);
    console.log(`  Diff percent: ${result.baselineDiff.diffPercent}%`);
    console.log(`  Diff image: ${result.baselineDiff.diffImage}`);
  }

  // Failures
  if (failed > 0) {
    console.log("\nFailures:");
    for (const check of result.checks) {
      if (check.status === "fail") {
        const catLabel = CATEGORY_LABELS[check.category];
        console.log(`  ✗ [${catLabel}] ${check.id}: ${check.message}`);
        if (check.failureSnapshot) {
          console.log(`    DOM: ${check.failureSnapshot.html.slice(0, 200)}...`);
          console.log(`    Screenshot: ${check.failureSnapshot.viewportScreenshot}`);
        }
      }
    }
  }

  console.log(`\nFull report: ${LATEST_FILE}\n`);
}

// ──────────────────────────────────────────
// Phase 4 — Audit report functions
// ──────────────────────────────────────────

const FINGERPRINT_DIR = path.join(RESULTS_DIR, "fingerprints");
const AUDIT_FILE = path.join(RESULTS_DIR, "audit.json");
const AUDIT_MD_FILE = path.join(RESULTS_DIR, "audit.md");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function writeAuditReport(report: AuditReport): void {
  ensureDir(RESULTS_DIR);
  ensureDir(FINGERPRINT_DIR);

  for (const [vertical, profile] of Object.entries(report.profiles)) {
    const fp = path.join(FINGERPRINT_DIR, `${vertical}.json`);
    fs.writeFileSync(fp, JSON.stringify(profile, null, 2));
  }

  fs.writeFileSync(AUDIT_FILE, JSON.stringify(report, null, 2));
  fs.writeFileSync(AUDIT_MD_FILE, generateAuditMarkdown(report));
}

function generateAuditMarkdown(report: AuditReport): string {
  const lines: string[] = [];
  lines.push("# Visual Fingerprint Audit Report");
  lines.push(`Generated: ${new Date(report.timestamp).toISOString()}\n`);

  // Per-vertical summary
  lines.push("## Fingerprint Summary\n");
  lines.push("| Vertical | Sections | Grids | Cards | Lists | Declared/Applied | E/T/M Roles | Entropy |");
  lines.push("|----------|----------|-------|-------|------|-----------------|-------------|---------|");
  for (const [v, p] of Object.entries(report.profiles)) {
    const motionStr = `${p.motion.declaredVariants}/${p.motion.appliedPatterns}`;
    const rolesStr = `${p.motion.motionRoles.entrance}/${p.motion.motionRoles.transition}/${p.motion.motionRoles.microInteraction}`;
    lines.push(
      `| ${v} | ${p.dom.sections} | ${p.dom.grids} | ${p.dom.cards} | ${p.dom.lists} | ${motionStr} | ${rolesStr} | ${p.layout.entropyScore.toFixed(3)} |`
    );
  }
  lines.push("");

  return lines.join("\n");
}

export function printAuditSummary(report: AuditReport): void {
  console.log("\n========================================");
  console.log("   VISUAL FINGERPRINT AUDIT REPORT");
  console.log("========================================\n");

  // Per-vertical
  for (const [v, p] of Object.entries(report.profiles)) {
    console.log(`  ${v}:`);
    console.log(`    Sections: ${p.dom.sections} | Grids: ${p.dom.grids} | Cards: ${p.dom.cards} | Lists: ${p.dom.lists} | FlatText: ${p.dom.flatTextBlocks}`);
    console.log(`    Density curve: [${p.density.elementsPerViewport.join(", ")}]`);
    console.log(`    Text ratio: ${(p.density.textWeightRatio * 100).toFixed(0)}% | Interaction nodes: ${p.density.interactionNodes}`);
    console.log(`    Motion: ${p.motion.declaredVariants} declared, ${p.motion.appliedPatterns} applied | Roles: E=${p.motion.motionRoles.entrance} T=${p.motion.motionRoles.transition} M=${p.motion.motionRoles.microInteraction}`);
    console.log(`    Easing entropy: ${p.motion.easingEntropy.toFixed(3)} | Uniformity: ${p.motion.motionUniformityScore.toFixed(3)}`);
    console.log(`    Entropy score: ${p.layout.entropyScore.toFixed(3)} | Unique motifs: ${p.layout.uniqueMotifs}/${p.layout.motifs.length}\n`);
  }

  console.log(`  Reports: ${AUDIT_FILE}`);
  console.log(`  Fingerprints: ${FINGERPRINT_DIR}/`);
  console.log(`  Markdown: ${AUDIT_MD_FILE}\n`);
}


