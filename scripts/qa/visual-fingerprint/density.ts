import type { Page } from "playwright";
import type { DensityMetrics, DensitySlice } from "../core/types";

const MEASURE_DENSITY_SCRIPT = () => {
  const vh = 720;
  const pageHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  const sliceCount = Math.max(1, Math.ceil(pageHeight / vh));

  const slices: DensitySlice[] = [];
  let totalTextNodes = 0;
  let totalUiNodes = 0;
  let totalInteractionNodes = 0;

  for (let i = 0; i < sliceCount; i++) {
    const sliceTop = i * vh;
    const sliceBottom = sliceTop + vh;

    let textNodes = 0;
    let uiNodes = 0;
    let interactionNodes = 0;

    const allElements = document.querySelectorAll(
      "p, h1, h2, h3, h4, h5, h6, li, span, div, section, button, a, input, select, textarea, label"
    );

    allElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const absTop = rect.top + window.scrollY;
      const absBottom = absTop + rect.height;

      if (absBottom <= sliceTop || absTop >= sliceBottom) return;

      const tag = el.tagName.toLowerCase();

      if (
        tag === "p" ||
        tag === "h1" ||
        tag === "h2" ||
        tag === "h3" ||
        tag === "h4" ||
        tag === "li" ||
        tag === "label"
      ) {
        textNodes++;
      }

      const cls = (el as HTMLElement).className || "";
      if (
        typeof cls === "string" &&
        (/rounded-(xl|2xl)/.test(cls) ||
          /grid-cols-\d/.test(cls) ||
          (cls.includes("border") && cls.includes("bg-")))
      ) {
        uiNodes++;
      }

      if (
        tag === "button" ||
        tag === "a" ||
        tag === "input" ||
        tag === "select" ||
        tag === "textarea"
      ) {
        interactionNodes++;
      }
    });

    slices.push({
      viewportStart: sliceTop,
      viewportEnd: sliceBottom,
      textNodes,
      uiNodes,
      interactionNodes,
    });

    totalTextNodes += textNodes;
    totalInteractionNodes += interactionNodes;
    totalUiNodes += uiNodes;
  }

  const totalNodes = totalTextNodes + totalUiNodes + totalInteractionNodes;

  return {
    slices,
    elementsPerViewport: slices.map((s) => s.textNodes + s.uiNodes + s.interactionNodes),
    textWeightRatio: totalNodes > 0 ? totalTextNodes / totalNodes : 0,
    interactionNodes: totalInteractionNodes,
  };
};

export async function measureDensity(page: Page): Promise<DensityMetrics> {
  const density: DensityMetrics = await page.evaluate(MEASURE_DENSITY_SCRIPT);
  return density;
}
