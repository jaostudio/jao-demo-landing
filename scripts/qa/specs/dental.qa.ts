import type { QASpec } from "../core/types";

export const dentalQA: QASpec = {
  url: "http://localhost:3000/brightsmile",
  baselineId: "dental",

  checks: [
    // Structural
    { id: "page-loads", category: "structural", type: "visible", selector: "body" },
    { id: "hero-visible", category: "structural", type: "visible", selector: "[data-testid='hero']" },
    { id: "single-h1", category: "structural", type: "hierarchy", selector: "[data-testid='hero-heading']", expected: 1 },
    { id: "services-section-visible", category: "structural", type: "visible", selector: "#services" },
    { id: "results-section-visible", category: "structural", type: "visible", selector: "#results" },
    { id: "insurance-section-visible", category: "structural", type: "visible", selector: "#insurance" },
    { id: "contact-section-visible", category: "structural", type: "visible", selector: "#contact" },

    // Content
    { id: "hero-heading-text", category: "content", type: "text", selector: "[data-testid='hero-heading']", minLength: 10 },
    { id: "hero-subtitle-text", category: "content", type: "text", selector: "[data-testid='hero-subtitle']", minLength: 20 },

    // Interaction
    { id: "hero-cta-valid", category: "interaction", type: "href-valid", selector: "[data-testid='hero-cta']" },
    { id: "hero-cta-viewport", category: "interaction", type: "viewport", selector: "[data-testid='hero-cta']" },
  ],
};
