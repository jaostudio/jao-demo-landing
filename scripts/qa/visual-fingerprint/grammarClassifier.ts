import type {
  PageFingerprint,
  SectionFingerprint,
  LayoutGrammar,
  SectionGrammarFeatures,
  SectionGrammarProfile,
  GrammarFingerprint,
} from "../core/types";

// ──────────────────────────────────────────
// Step 1 — Feature extraction
// ──────────────────────────────────────────

function computeVerticalRhythm(spacingClasses: string[]): number {
  const values = spacingClasses
    .filter((c) => /^(p[yb]|m[tb])-\d+/.test(c))
    .map((c) => {
      const m = c.match(/-(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    });
  if (values.length < 3) return 0.3;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  if (mean === 0) return 0.3;
  const variance =
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.min(Math.sqrt(variance) / mean, 1);
}

function extractSectionFeatures(
  section: SectionFingerprint
): SectionGrammarFeatures {
  const gridDensity = section.hasGrid
    ? Math.min((section.gridCols ?? 2) / 5, 1)
    : 0;

  const cardDensity = section.hasCard
    ? Math.min(section.cardCount / Math.max(section.childCount, 2), 1)
    : 0;

  const textBlockRatio = section.isFlatText
    ? 0.85
    : section.hasCard
      ? 0.15
      : section.hasList
        ? 0.5
        : 0.35;

  const interactionDensity = Math.min(section.interactionCount / 8, 1);

  const layoutSymmetry = !section.hasGrid
    ? 0.5
    : (section.gridCols ?? 1) % 2 === 0
      ? 0.8
      : (section.gridCols ?? 1) >= 3
        ? 0.5
        : 0.3;

  const verticalRhythm = computeVerticalRhythm(section.spacingClasses);

  return {
    gridDensity,
    cardDensity,
    textBlockRatio,
    interactionDensity,
    layoutSymmetry,
    verticalRhythm,
  };
}

// ──────────────────────────────────────────
// Step 2 — Rule-based classification
// ──────────────────────────────────────────

interface RuleCondition {
  feature: keyof SectionGrammarFeatures;
  min?: number;
  max?: number;
  weight: number;
}

interface Rule {
  grammar: LayoutGrammar;
  conditions: RuleCondition[];
}

const RULES: Rule[] = [
  {
    grammar: "CARD_GRID",
    conditions: [
      { feature: "gridDensity", min: 0.4, weight: 0.30 },
      { feature: "cardDensity", min: 0.3, weight: 0.35 },
      { feature: "interactionDensity", max: 0.4, weight: 0.20 },
      { feature: "textBlockRatio", max: 0.4, weight: 0.15 },
    ],
  },
  {
    grammar: "NARRATIVE_STACK",
    conditions: [
      { feature: "gridDensity", max: 0.3, weight: 0.25 },
      { feature: "textBlockRatio", min: 0.5, weight: 0.30 },
      { feature: "cardDensity", max: 0.3, weight: 0.20 },
      { feature: "interactionDensity", max: 0.3, weight: 0.25 },
    ],
  },
  {
    grammar: "ALTERNATING_SPLIT",
    conditions: [
      { feature: "gridDensity", min: 0.3, weight: 0.20 },
      { feature: "gridDensity", max: 0.7, weight: 0.20 },
      { feature: "layoutSymmetry", min: 0.3, weight: 0.20 },
      { feature: "layoutSymmetry", max: 0.7, weight: 0.15 },
      { feature: "cardDensity", min: 0.1, weight: 0.15 },
      { feature: "cardDensity", max: 0.6, weight: 0.10 },
    ],
  },
  {
    grammar: "LIST_DOMINANT",
    conditions: [
      { feature: "gridDensity", max: 0.3, weight: 0.25 },
      { feature: "textBlockRatio", min: 0.5, weight: 0.30 },
      { feature: "cardDensity", max: 0.2, weight: 0.20 },
      { feature: "verticalRhythm", min: 0.4, weight: 0.25 },
    ],
  },
  {
    grammar: "HYBRID_EDITORIAL",
    conditions: [
      { feature: "gridDensity", min: 0.2, weight: 0.15 },
      { feature: "gridDensity", max: 0.7, weight: 0.20 },
      { feature: "textBlockRatio", min: 0.35, weight: 0.20 },
      { feature: "cardDensity", min: 0.1, weight: 0.15 },
      { feature: "cardDensity", max: 0.6, weight: 0.15 },
      { feature: "interactionDensity", min: 0.1, weight: 0.15 },
    ],
  },
  {
    grammar: "FORM_INTENSIVE",
    conditions: [
      { feature: "interactionDensity", min: 0.5, weight: 0.50 },
      { feature: "cardDensity", max: 0.2, weight: 0.20 },
      { feature: "textBlockRatio", max: 0.5, weight: 0.15 },
      { feature: "layoutSymmetry", min: 0.4, weight: 0.15 },
    ],
  },
  {
    grammar: "TIMELINE_FLOW",
    conditions: [
      { feature: "gridDensity", min: 0.1, weight: 0.20 },
      { feature: "gridDensity", max: 0.5, weight: 0.20 },
      { feature: "verticalRhythm", min: 0.5, weight: 0.30 },
      { feature: "cardDensity", max: 0.2, weight: 0.15 },
      { feature: "interactionDensity", max: 0.3, weight: 0.15 },
    ],
  },
  {
    grammar: "HERO_COMPOSITE",
    conditions: [
      { feature: "gridDensity", min: 0.3, weight: 0.20 },
      { feature: "textBlockRatio", min: 0.3, weight: 0.20 },
      { feature: "cardDensity", max: 0.3, weight: 0.15 },
      { feature: "interactionDensity", min: 0.1, weight: 0.20 },
      { feature: "interactionDensity", max: 0.5, weight: 0.10 },
      { feature: "layoutSymmetry", min: 0.5, weight: 0.15 },
    ],
  },
];

const CONFIDENCE_THRESHOLD = 0.6;

function scoreRule(features: SectionGrammarFeatures, rule: Rule): number {
  let score = 0;
  let total = 0;
  for (const c of rule.conditions) {
    const v = features[c.feature];
    const ok =
      (c.min === undefined || v >= c.min) &&
      (c.max === undefined || v <= c.max);
    if (ok) score += c.weight;
    total += c.weight;
  }
  return total > 0 ? score / total : 0;
}

function classifySectionGrammar(
  section: SectionFingerprint,
  features: SectionGrammarFeatures
): { grammar: LayoutGrammar; confidence: number } {
  let best: LayoutGrammar = "HYBRID_EDITORIAL";
  let bestScore = 0;

  for (const rule of RULES) {
    const s = scoreRule(features, rule);
    if (s > bestScore) {
      bestScore = s;
      best = rule.grammar;
    }
  }

  return {
    grammar: bestScore >= CONFIDENCE_THRESHOLD ? best : "HYBRID_EDITORIAL",
    confidence: bestScore,
  };
}

// ──────────────────────────────────────────
// Step 3 — Grammar fingerprint per vertical
// ──────────────────────────────────────────

function shannonEntropy(distribution: Record<string, number>): number {
  const probs = Object.values(distribution).filter((p) => p > 0);
  if (probs.length <= 1) return probs.length > 0 ? 0 : 0;
  let h = 0;
  for (const p of probs) h -= p * Math.log2(p);
  return h / Math.log2(probs.length);
}

export function computeGrammarFingerprint(
  vertical: string,
  profile: PageFingerprint
): GrammarFingerprint {
  const sections: SectionGrammarProfile[] = [];
  const counts: Record<string, number> = {};

  const allGrammars: LayoutGrammar[] = [
    "CARD_GRID",
    "NARRATIVE_STACK",
    "ALTERNATING_SPLIT",
    "LIST_DOMINANT",
    "HYBRID_EDITORIAL",
    "FORM_INTENSIVE",
    "TIMELINE_FLOW",
    "HERO_COMPOSITE",
  ];
  for (const g of allGrammars) counts[g] = 0;

  for (const sec of profile.dom.sectionFingerprints) {
    const features = extractSectionFeatures(sec);
    const { grammar, confidence } = classifySectionGrammar(sec, features);
    sections.push({ sectionId: sec.id, grammar, confidence, features });
    counts[grammar]++;
  }

  const total = sections.length;
  const distribution: Record<string, number> = {};
  let dominantGrammar: LayoutGrammar = "HYBRID_EDITORIAL";
  let dominantCount = 0;
  for (const g of allGrammars) {
    const p = total > 0 ? counts[g] / total : 0;
    distribution[g] = Math.round(p * 1000) / 1000;
    if (counts[g] > dominantCount) {
      dominantCount = counts[g];
      dominantGrammar = g;
    }
  }

  return {
    vertical,
    sections,
    distribution: distribution as Record<LayoutGrammar, number>,
    entropy: total > 0 ? shannonEntropy(distribution) : 0,
    dominantGrammar,
  };
}

// ──────────────────────────────────────────
// Step 4 — Grammar divergence (cosine)
// ──────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.max(a.length, b.length);
  let dot = 0,
    magA = 0,
    magB = 0;
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    dot += av * bv;
    magA += av * av;
    magB += bv * bv;
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 1 : dot / denom;
}

export function computeGrammarDivergence(
  fingerprints: Record<string, GrammarFingerprint>
): Record<string, number> {
  const verticals = Object.keys(fingerprints);
  const allGrammars: LayoutGrammar[] = [
    "CARD_GRID",
    "NARRATIVE_STACK",
    "ALTERNATING_SPLIT",
    "LIST_DOMINANT",
    "HYBRID_EDITORIAL",
    "FORM_INTENSIVE",
    "TIMELINE_FLOW",
    "HERO_COMPOSITE",
  ];
  const result: Record<string, number> = {};

  for (let i = 0; i < verticals.length; i++) {
    for (let j = i + 1; j < verticals.length; j++) {
      const key = `${verticals[i]}-vs-${verticals[j]}`;
      const a = fingerprints[verticals[i]].distribution;
      const b = fingerprints[verticals[j]].distribution;
      const aVec = allGrammars.map((g) => a[g] ?? 0);
      const bVec = allGrammars.map((g) => b[g] ?? 0);
      const sim = cosineSimilarity(aVec, bVec);
      result[key] = Math.round((1 - sim) * 1000) / 1000;
    }
  }

  return result;
}
