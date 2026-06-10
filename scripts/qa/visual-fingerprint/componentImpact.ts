import type { PageFingerprint, SectionFingerprint, ComponentImpactReport, CollapseReport } from "../core/types";

// ──────────────────────────────────────────
// Component Signatures (v0.5 registry)
// ──────────────────────────────────────────

interface ComponentSignature {
  name: string;
  matchers: {
    classIncludes: string[];
    textHints: string[];
    structuralHints: {
      hasCards?: boolean;
      gridCols?: number;
    };
  };
}

const COMPONENT_SIGNATURES: ComponentSignature[] = [
  {
    name: "TestimonialsAdapter",
    matchers: {
      classIncludes: ["p-6", "gap-6"],
      textHints: ["section-"],
      structuralHints: { hasCards: true },
    },
  },
  {
    name: "ServicesAdapter",
    matchers: {
      classIncludes: ["p-6", "p-3"],
      textHints: ["services", "practice"],
      structuralHints: { hasCards: true, gridCols: 2 },
    },
  },
  {
    name: "ProcessSteps",
    matchers: {
      classIncludes: ["pb-8", "mt-1"],
      textHints: ["process", "step"],
      structuralHints: { hasCards: false },
    },
  },
  {
    name: "ContactForm",
    matchers: {
      classIncludes: ["px-3", "py-2"],
      textHints: ["contact", "booking", "consultation"],
      structuralHints: { hasCards: false },
    },
  },
];

// ──────────────────────────────────────────
// Match scoring
// score = classSimilarity (0–0.4)
//       + structuralHints (0–0.4)
//       + textHintMatch (0–0.2)
// threshold: > 0.65 => present
// ──────────────────────────────────────────

function matchScore(section: SectionFingerprint, sig: ComponentSignature): number {
  let score = 0;

  // Class similarity (0–0.4)
  const matched = sig.matchers.classIncludes.filter((cls) =>
    section.spacingClasses.some((sc) => sc.includes(cls))
  );
  const classPart =
    sig.matchers.classIncludes.length > 0
      ? (matched.length / sig.matchers.classIncludes.length) * 0.4
      : 0;
  score += classPart;

  // Structural hints (0–0.4)
  let structScore = 0;
  let hintCount = 0;
  if (sig.matchers.structuralHints.hasCards !== undefined) {
    if (section.hasCard === sig.matchers.structuralHints.hasCards) structScore++;
    hintCount++;
  }
  if (sig.matchers.structuralHints.gridCols !== undefined) {
    if (section.gridCols === sig.matchers.structuralHints.gridCols) structScore++;
    hintCount++;
  }
  if (hintCount > 0) score += (structScore / hintCount) * 0.4;

  // Text hint match (0–0.2)
  const lowerId = section.id.toLowerCase();
  if (sig.matchers.textHints.some((h) => lowerId.includes(h))) score += 0.2;

  return score;
}

function findMatchingSections(
  profile: PageFingerprint,
  sig: ComponentSignature,
  threshold: number
): SectionFingerprint[] {
  return profile.dom.sectionFingerprints.filter(
    (s) => matchScore(s, sig) >= threshold
  );
}

// ──────────────────────────────────────────
// Contribution computation
// ──────────────────────────────────────────

function computeContributions(
  profileA: PageFingerprint,
  profileB: PageFingerprint,
  matchedA: SectionFingerprint[],
  matchedB: SectionFingerprint[]
) {
  const sectionCountA = profileA.dom.sectionFingerprints.length;
  const sectionCountB = profileB.dom.sectionFingerprints.length;

  // structuralContribution: proportion of grids+cards+lists from matched sections
  const totalComponents =
    profileA.dom.grids + profileA.dom.cards + profileA.dom.lists +
    profileB.dom.grids + profileB.dom.cards + profileB.dom.lists;
  const matchedComponents =
    matchedA.filter((s) => s.hasGrid || s.hasCard || s.hasList).length +
    matchedB.filter((s) => s.hasGrid || s.hasCard || s.hasList).length;
  const structuralContribution =
    totalComponents > 0 ? matchedComponents / totalComponents : 0;

  // densityContribution: proportion of interaction nodes from matched sections
  const totalInteraction =
    profileA.density.interactionNodes + profileB.density.interactionNodes;
  const matchedInteraction =
    matchedA.reduce((s, sec) => s + sec.interactionCount, 0) +
    matchedB.reduce((s, sec) => s + sec.interactionCount, 0);
  const densityContribution =
    totalInteraction > 0 ? matchedInteraction / totalInteraction : 0;

  // entropyContribution: proportion of sections matched
  const totalSections = sectionCountA + sectionCountB;
  const matchedSections = matchedA.length + matchedB.length;
  const entropyContribution =
    totalSections > 0 ? matchedSections / totalSections : 0;

  return { structuralContribution, densityContribution, entropyContribution };
}

// ──────────────────────────────────────────
// Collapse risk
// collapseRisk = (sharedPresenceRatio * 0.5)
//              + (structuralContribution * 0.5)
// ──────────────────────────────────────────

function computeCollapseRisk(
  presence: Record<string, boolean>,
  structuralContribution: number
): number {
  const verticals = Object.keys(presence);
  const present = Object.values(presence).filter(Boolean).length;
  const totalPairs = (verticals.length * (verticals.length - 1)) / 2;
  const presentPairs = (present * (present - 1)) / 2;
  const sharedPresenceRatio = totalPairs > 0 ? presentPairs / totalPairs : 0;
  return sharedPresenceRatio * 0.5 + structuralContribution * 0.5;
}

// ──────────────────────────────────────────
// Orchestrator
// ──────────────────────────────────────────

const MATCH_THRESHOLD = 0.65;

export function detectComponentImpacts(
  profiles: Record<string, PageFingerprint>
): CollapseReport {
  const components: ComponentImpactReport[] = [];

  for (const sig of COMPONENT_SIGNATURES) {
    const presence: Record<string, boolean> = {};
    const matchedSections: Record<string, SectionFingerprint[]> = {};

    for (const [vertical, profile] of Object.entries(profiles)) {
      const matched = findMatchingSections(profile, sig, MATCH_THRESHOLD);
      presence[vertical] = matched.length > 0;
      matchedSections[vertical] = matched;
    }

    const presentVerticals = Object.entries(presence)
      .filter(([, p]) => p)
      .map(([v]) => v);

    let structuralContribution = 0;
    let densityContribution = 0;
    let entropyContribution = 0;
    let pairCount = 0;

    // Average contributions across all pairs of verticals that share this component
    for (let i = 0; i < presentVerticals.length; i++) {
      for (let j = i + 1; j < presentVerticals.length; j++) {
        const a = presentVerticals[i];
        const b = presentVerticals[j];
        const contrib = computeContributions(
          profiles[a],
          profiles[b],
          matchedSections[a],
          matchedSections[b]
        );
        structuralContribution += contrib.structuralContribution;
        densityContribution += contrib.densityContribution;
        entropyContribution += contrib.entropyContribution;
        pairCount++;
      }
    }

    if (pairCount > 0) {
      structuralContribution /= pairCount;
      densityContribution /= pairCount;
      entropyContribution /= pairCount;
    }

    const collapseRisk = computeCollapseRisk(presence, structuralContribution);

    components.push({
      component: sig.name,
      presence,
      structuralContribution: Math.round(structuralContribution * 1000) / 1000,
      densityContribution: Math.round(densityContribution * 1000) / 1000,
      entropyContribution: Math.round(entropyContribution * 1000) / 1000,
      collapseRisk: Math.round(collapseRisk * 1000) / 1000,
    });
  }

  const highRiskComponents = components
    .filter((c) => c.collapseRisk > 0.65)
    .map((c) => c.component);

  const mediumRiskComponents = components
    .filter((c) => c.collapseRisk > 0.35 && c.collapseRisk <= 0.65)
    .map((c) => c.component);

  const divergenceRecoveryPotential =
    components.length > 0
      ? Math.round(
          (components.reduce((s, c) => s + c.collapseRisk, 0) /
            components.length) *
            1000
        ) / 1000
      : 0;

  return {
    components,
    highRiskComponents,
    mediumRiskComponents,
    divergenceRecoveryPotential,
  };
}
