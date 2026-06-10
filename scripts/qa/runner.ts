/* eslint-disable @typescript-eslint/no-explicit-any */
import { runQA } from "./core/executor";
import { writeReport, printSummary } from "./core/reporter";
import { constructionQA } from "./specs/construction.qa";
import { dentalQA } from "./specs/dental.qa";
import { legalQA } from "./specs/legal.qa";

const target = process.argv[2] || "all";
const args = process.argv.slice(3);

const captureBaseline = args.includes("--baseline");
const skipDiff = args.includes("--no-diff");

const specs: Record<string, { url: string; baselineId: string }> = {
  construction: constructionQA,
  dental: dentalQA,
  legal: legalQA,
};

async function main() {
  if (target === "all") {
    let allPassed = true;
    for (const [key, spec] of Object.entries(specs)) {
      if (captureBaseline) {
        console.log(`Capturing golden baseline: ${key}`);
        console.log(`URL: ${spec.url}`);
        await runQA(spec as any, { captureBaseline: true });
        console.log("Baseline captured successfully.\n");
      } else {
        console.log(`Running QA: ${key}`);
        console.log(`URL: ${spec.url}\n`);
        const result = await runQA(spec as any, { skipDiff });
        writeReport(result);
        printSummary(result);
        if (result.status !== "pass") allPassed = false;
      }
    }
    process.exit(allPassed ? 0 : 1);
    return;
  }

  const spec = specs[target];

  if (!spec) {
    console.error(`Unknown QA target: "${target}"`);
    console.error(`Available targets: ${Object.keys(specs).join(", ")}, all`);
    process.exit(1);
  }

  if (captureBaseline) {
    console.log(`Capturing golden baseline: ${target}`);
    console.log(`URL: ${spec.url}`);
    await runQA(spec as any, { captureBaseline: true });
    console.log("Baseline captured successfully.\n");
    return;
  }

  console.log(`Running QA: ${target}`);
  console.log(`URL: ${spec.url}\n`);

  const result = await runQA(spec as any, { skipDiff });

  writeReport(result);
  printSummary(result);

  process.exit(result.status === "pass" ? 0 : 1);
}

main();
