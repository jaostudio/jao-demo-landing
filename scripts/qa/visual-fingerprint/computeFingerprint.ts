import type { Page } from "playwright";
import type { DomFingerprint, SectionFingerprint } from "../core/types";

const EXTRACT_DOM_SCRIPT = () => {
  const sections = document.querySelectorAll("section");

  const sectionFingerprints: SectionFingerprint[] = Array.from(sections).map(
    (section, index) => {
      const id =
        section.id ||
        section.getAttribute("data-testid") ||
        `section-${index}`;
      const childCount = section.children.length;

      const allElements = section.querySelectorAll("*");

      const gridEl = section.querySelector('[class*="grid-cols-"]');
      const hasGrid = !!gridEl;
      let gridCols: number | null = null;
      if (gridEl) {
        const cls = gridEl.className;
        const match =
          typeof cls === "string" ? cls.match(/grid-cols-(\d+)/) : null;
        if (match) gridCols = parseInt(match[1], 10);
      }

      const flexEl = section.querySelector('[class*="flex"]');
      const hasFlex = !!flexEl;

      let cardCount = 0;
      allElements.forEach((el) => {
        const cls = (el as HTMLElement).className || "";
        if (
          typeof cls === "string" &&
          (cls.includes("rounded-xl") || cls.includes("rounded-2xl")) &&
          cls.includes("border")
        ) {
          cardCount++;
        }
      });

      const uls = section.querySelectorAll("ul");
      let listItemCount = 0;
      uls.forEach((ul) => {
        listItemCount += ul.children.length;
      });
      const hasList = listItemCount > 0;

      const textChildren = Array.from(section.children).filter((el) =>
        /^(P|H[1-4])$/.test(el.tagName)
      );
      const isFlatText =
        section.children.length > 0 &&
        textChildren.length / section.children.length > 0.7;

      const spacingClasses: string[] = [];
      allElements.forEach((el) => {
        const cls = (el as HTMLElement).className || "";
        if (typeof cls === "string") {
          const spacings = cls.match(
            /\b(p[yxtbl]?|m[yxtbl]?)-(\d+\.?\d*)/g
          );
          if (spacings) spacingClasses.push(...spacings);
        }
      });

      let nestingDepth = 0;
      const childStack = [{ el: section, depth: 1 }];
      while (childStack.length > 0) {
        const item = childStack.pop()!;
        if (item.depth > nestingDepth) nestingDepth = item.depth;
        for (let i = 0; i < item.el.children.length; i++) {
          childStack.push({ el: item.el.children[i], depth: item.depth + 1 });
        }
      }

      // Interaction count within section
      let interactionCount = 0;
      const interactiveTags = new Set(["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"]);
      allElements.forEach((el) => {
        if (interactiveTags.has(el.tagName)) interactionCount++;
      });

      return {
        id,
        tag: section.tagName,
        childCount,
        hasGrid,
        gridCols,
        hasFlex,
        hasCard: cardCount > 0,
        cardCount,
        hasList,
        listItemCount,
        isFlatText,
        spacingClasses,
        nestingDepth,
        interactionCount,
      };
    }
  );

  const allCardEls = document.querySelectorAll(
    '[class*="rounded-xl"],[class*="rounded-2xl"]'
  );
  let cardCount = 0;
  allCardEls.forEach((el) => {
    const cls = (el as HTMLElement).className || "";
    if (typeof cls === "string" && cls.includes("border")) cardCount++;
  });

  return {
    sections: sections.length,
    grids: document.querySelectorAll('[class*="grid-cols-"]').length,
    cards: cardCount,
    lists: document.querySelectorAll("ul").length,
    flatTextBlocks: sectionFingerprints.filter((s) => s.isFlatText).length,
    sectionFingerprints,
  };
};

export async function computeFingerprint(
  page: Page,
  vertical: string
): Promise<DomFingerprint> {
  const dom: DomFingerprint = await page.evaluate(EXTRACT_DOM_SCRIPT);
  return dom;
}
