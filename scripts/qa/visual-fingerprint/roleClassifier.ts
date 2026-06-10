import type {
  PageFingerprint,
  SectionFingerprint,
  SectionRole,
  SectionSemanticProfile,
  SemanticFingerprint,
} from "../core/types";

// ──────────────────────────────────────────
// Role ontology — keyword mapping
// ──────────────────────────────────────────

const ROLE_KEYWORDS: Record<SectionRole, string[]> = {
  HERO_ENTRY: ["hero"],
  CAPABILITY_LAYER: ["services", "practice", "treatment", "capability", "offerings"],
  PROOF_LAYER: ["results", "testimonial", "review", "outcomes", "case", "success"],
  TRUST_LAYER: ["insurance", "safety", "compliance", "credential", "certif", "accredit"],
  PROCESS_LAYER: ["process", "how", "methodology", "timeline", "approach", "steps"],
  CONVERSION_LAYER: ["contact", "booking", "consultation", "appointment", "schedule", "inquiry"],
  TEAM_LAYER: ["attorney", "doctor", "staff", "team", "provider", "professional"],
  EDUCATION_LAYER: ["visit", "expect", "faq", "education", "preparation", "guide"],
  DISCLOSURE_LAYER: ["disclosure", "footer", "disclaimer", "privacy", "legal"],
};

const ALL_ROLES: SectionRole[] = [
  "HERO_ENTRY",
  "CAPABILITY_LAYER",
  "PROOF_LAYER",
  "TRUST_LAYER",
  "PROCESS_LAYER",
  "CONVERSION_LAYER",
  "TEAM_LAYER",
  "EDUCATION_LAYER",
  "DISCLOSURE_LAYER",
];

// ──────────────────────────────────────────
// Keyword match
// ──────────────────────────────────────────

function keywordScore(id: string, role: SectionRole): number {
  const lower = id.toLowerCase().replace(/[^a-z0-9]/g, "");
  const keywords = ROLE_KEYWORDS[role];
  return keywords.some((k) => lower.includes(k)) ? 1 : 0;
}

// ──────────────────────────────────────────
// Position match
// ──────────────────────────────────────────

function positionScore(
  index: number,
  total: number,
  role: SectionRole
): number {
  if (role === "HERO_ENTRY" && index === 0) return 1;
  if (role === "HERO_ENTRY" && index <= 1) return 0.5;
  if (role === "DISCLOSURE_LAYER" && index === total - 1) return 0.8;
  if (role === "DISCLOSURE_LAYER" && index >= total - 2) return 0.5;
  if (role === "CONVERSION_LAYER" && index >= total - 3) return 0.4;
  if (role === "CAPABILITY_LAYER" && index >= 1 && index <= 3) return 0.3;
  if (role === "PROOF_LAYER" && index >= 2 && index <= 4) return 0.3;
  return 0;
}

// ──────────────────────────────────────────
// Structural hint match
// ──────────────────────────────────────────

function structuralScore(
  section: SectionFingerprint,
  role: SectionRole
): number {
  switch (role) {
    case "HERO_ENTRY":
      // Has grid + flex (mixed layout), some interaction (CTAs), low card density
      return score(
        section.hasGrid && section.hasFlex,
        section.interactionCount >= 1 && section.interactionCount <= 4,
        !section.hasCard || section.cardCount <= 1
      );

    case "CAPABILITY_LAYER":
      // Grid-based, cards or list, low interaction
      return score(
        section.hasGrid,
        section.hasCard || section.hasList,
        section.interactionCount <= 2
      );

    case "PROOF_LAYER":
      // Card-dominant, possibly no grid (stacked cards), low interaction
      return score(
        section.hasCard && section.cardCount >= 2,
        !section.hasList,
        section.interactionCount <= 1
      );

    case "TRUST_LAYER":
      // Text-heavy, flex layout, no cards, moderate interaction
      return score(
        !section.hasGrid,
        section.hasFlex,
        !section.hasCard,
        section.interactionCount <= 1
      );

    case "PROCESS_LAYER":
      // Structured layout (gridCols <= 2), deep nesting, low interaction
      return score(
        section.hasGrid && (section.gridCols ?? 3) <= 2,
        section.nestingDepth >= 5,
        section.interactionCount <= 1
      );

    case "CONVERSION_LAYER":
      // High interaction (forms), deep nesting, grid often present
      return score(
        section.interactionCount >= 4,
        section.nestingDepth >= 7,
        section.hasGrid
      );

    case "TEAM_LAYER":
      // Flex-based, no grid, person entries with borders
      return score(
        !section.hasGrid && section.hasFlex,
        !section.hasCard,
        section.hasList
      );

    case "EDUCATION_LAYER":
      // Content-heavy, flex layout, moderate interaction
      return score(
        !section.hasGrid,
        section.hasFlex,
        section.interactionCount >= 1 && section.interactionCount <= 3
      );

    case "DISCLOSURE_LAYER":
      // Minimal layout, flat text, low interaction
      return score(
        section.childCount <= 3,
        section.interactionCount <= 1,
        section.isFlatText
      );

    default:
      return 0;
  }
}

function score(...conditions: boolean[]): number {
  const met = conditions.filter(Boolean).length;
  return conditions.length > 0 ? met / conditions.length : 0;
}

// ──────────────────────────────────────────
// Full classification
// ──────────────────────────────────────────

const KEYWORD_WEIGHT = 0.5;
const POSITION_WEIGHT = 0.25;
const STRUCTURAL_WEIGHT = 0.25;
const CONFIDENCE_THRESHOLD = 0.5;

function classifySection(
  section: SectionFingerprint,
  index: number,
  total: number
): { role: SectionRole; confidence: number } {
  let best: SectionRole = "EDUCATION_LAYER";
  let bestScore = 0;

  for (const role of ALL_ROLES) {
    const kw = keywordScore(section.id, role) * KEYWORD_WEIGHT;
    const pos = positionScore(index, total, role) * POSITION_WEIGHT;
    const struct = structuralScore(section, role) * STRUCTURAL_WEIGHT;
    const totalScore = kw + pos + struct;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      best = role;
    }
  }

  return {
    role: bestScore >= CONFIDENCE_THRESHOLD ? best : "EDUCATION_LAYER",
    confidence: bestScore,
  };
}

// ──────────────────────────────────────────
// Fingerprint computation
// ──────────────────────────────────────────

function shannonEntropy(distribution: Record<string, number>): number {
  const probs = Object.values(distribution).filter((p) => p > 0);
  if (probs.length <= 1) return probs.length > 0 ? 0 : 0;
  let h = 0;
  for (const p of probs) h -= p * Math.log2(p);
  return h / Math.log2(probs.length);
}

export function computeSemanticFingerprint(
  vertical: string,
  profile: PageFingerprint
): SemanticFingerprint {
  const sections: SectionSemanticProfile[] = [];
  const roleSequence: SectionRole[] = [];
  const counts: Record<string, number> = {};

  for (const r of ALL_ROLES) counts[r] = 0;

  const fingerprints = profile.dom.sectionFingerprints;
  const total = fingerprints.length;

  for (let i = 0; i < fingerprints.length; i++) {
    const { role, confidence } = classifySection(fingerprints[i], i, total);
    sections.push({ sectionId: fingerprints[i].id, role, confidence });
    roleSequence.push(role);
    counts[role]++;
  }

  const distribution: Record<string, number> = {};
  let convergentRoles: SectionRole[] = [];

  for (const r of ALL_ROLES) {
    const p = total > 0 ? counts[r] / total : 0;
    distribution[r] = Math.round(p * 1000) / 1000;
  }

  return {
    vertical,
    sections,
    distribution: distribution as Record<SectionRole, number>,
    roleSequence,
    roleEntropy: total > 0 ? shannonEntropy(distribution) : 0,
    convergentRoles: [],
  };
}

// ──────────────────────────────────────────
// Semantic divergence + convergence detection
// ──────────────────────────────────────────

export function computeSemanticDivergence(
  fingerprints: Record<string, SemanticFingerprint>
): {
  semanticDivergence: Record<string, number>;
  convergentRoles: SectionRole[];
} {
  const verticals = Object.keys(fingerprints);
  const semanticDivergence: Record<string, number> = {};

  // Compute pairwise divergence (cosine)
  for (let i = 0; i < verticals.length; i++) {
    for (let j = i + 1; j < verticals.length; j++) {
      const key = `${verticals[i]}-vs-${verticals[j]}`;
      const a = fingerprints[verticals[i]].distribution;
      const b = fingerprints[verticals[j]].distribution;
      const aVec = ALL_ROLES.map((r) => a[r] ?? 0);
      const bVec = ALL_ROLES.map((r) => b[r] ?? 0);

      let dot = 0,
        magA = 0,
        magB = 0;
      for (let k = 0; k < ALL_ROLES.length; k++) {
        dot += aVec[k] * bVec[k];
        magA += aVec[k] * aVec[k];
        magB += bVec[k] * bVec[k];
      }
      const denom = Math.sqrt(magA) * Math.sqrt(magB);
      const sim = denom === 0 ? 1 : dot / denom;
      semanticDivergence[key] = Math.round((1 - sim) * 1000) / 1000;
    }
  }

  // Detect convergent roles (present in >= 2 verticals)
  const rolePresence = new Map<SectionRole, Set<string>>();
  for (const r of ALL_ROLES) rolePresence.set(r, new Set());
  for (const [v, fp] of Object.entries(fingerprints)) {
    for (const [role, prop] of Object.entries(fp.distribution)) {
      if (prop > 0) rolePresence.get(role as SectionRole)!.add(v);
    }
  }
  const convergentRoles: SectionRole[] = [];
  for (const [role, verts] of rolePresence) {
    if (verts.size >= 2) convergentRoles.push(role);
  }

  return { semanticDivergence, convergentRoles };
}
