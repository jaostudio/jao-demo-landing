import type { QASpec } from "../core/types";

export const constructionQA: QASpec = {
  url: "http://localhost:3000/summit-ridge",
  baselineId: "construction",

  checks: [
    // Structural
    { id: "page-loads", category: "structural", type: "visible", selector: "body" },
    { id: "hero-visible", category: "structural", type: "visible", selector: "[data-testid='hero']" },
    { id: "single-h1", category: "structural", type: "hierarchy", selector: "[data-testid='hero-heading']", expected: 1 },
    { id: "sector-label-visible", category: "structural", type: "visible", selector: "[data-testid='sector-label']" },
    { id: "sectors-strip-visible", category: "structural", type: "visible", selector: "[data-testid='sectors-strip']" },
    { id: "work-section-visible", category: "structural", type: "visible", selector: "[data-testid='work-section']" },
    { id: "services-section-visible", category: "structural", type: "visible", selector: "[data-testid='services-section']" },
    { id: "safety-section-visible", category: "structural", type: "visible", selector: "[data-testid='safety-section']" },
    { id: "contact-section-visible", category: "structural", type: "visible", selector: "[data-testid='contact-section']" },

    // Content
    { id: "hero-heading-text", category: "content", type: "text", selector: "[data-testid='hero-heading']", minLength: 10 },
    { id: "hero-subtitle-text", category: "content", type: "text", selector: "[data-testid='hero-subtitle']", minLength: 20 },
    { id: "work-projects-count", category: "content", type: "count", selector: "[data-testid^='work-project-']", minCount: 1 },
    { id: "disclosure-present", category: "content", type: "visible", selector: "[data-testid='disclosure']" },

    // Interaction
    { id: "hero-cta-valid", category: "interaction", type: "href-valid", selector: "[data-testid='hero-cta']" },
    { id: "contact-cta-valid", category: "interaction", type: "href-valid", selector: "[data-testid='contact-cta']" },
  ],
};
