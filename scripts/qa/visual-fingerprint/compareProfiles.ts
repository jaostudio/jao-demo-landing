import type {
  PageFingerprint,
  DivergenceMetric,
  CollisionWarning,
} from "../core/types";

const ROLES = ["hero", "content", "utility", "footer"] as const;
const ROLE_WEIGHTS: Record<string, number> = {
  hero: 3.0,
  content: 2.0,
  utility: 1.5,
  footer: 0.5,
};

function classifyRole(id: string): string {
  const lower = id.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (lower.includes("hero")) return "hero";
  if (lower.includes("contact") || lower.includes("booking")) return "utility";
  if (lower.includes("testimonial") || lower.includes("review")) return "utility";
  if (lower.includes("safety") || lower.includes("compliance")) return "utility";
  if (lower.includes("disclosure") || lower.includes("footer")) return "footer";
  return "content";
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 1;
  const intersection = new Set([...a].filter((x) => b.has(x)));
  return intersection.size / union.size;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.max(a.length, b.length);
  let dot = 0, magA = 0, magB = 0;
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

function normalizedDiff(a: number, b: number): number {
  const max = Math.max(a, b);
  return max === 0 ? 0 : Math.abs(a - b) / max;
}

function computeStructuralDivergence(a: PageFingerprint, b: PageFingerprint): number {
  const aRoles = a.dom.sectionFingerprints.map((s) => classifyRole(s.id));
  const bRoles = b.dom.sectionFingerprints.map((s) => classifyRole(s.id));

  // Role presence mismatch (weighted)
  let presencePenalty = 0;
  let totalWeight = 0;
  for (const role of ROLES) {
    const aHas = aRoles.includes(role);
    const bHas = bRoles.includes(role);
    if (aHas !== bHas) presencePenalty += ROLE_WEIGHTS[role];
    totalWeight += ROLE_WEIGHTS[role];
  }
  const rolePresenceDiv = totalWeight > 0 ? presencePenalty / totalWeight : 0;

  // Role proportion divergence (chi-squared-like)
  const aRoleCounts = new Map<string, number>();
  const bRoleCounts = new Map<string, number>();
  for (const r of aRoles) aRoleCounts.set(r, (aRoleCounts.get(r) ?? 0) + 1);
  for (const r of bRoles) bRoleCounts.set(r, (bRoleCounts.get(r) ?? 0) + 1);

  let rolePropDiv = 0;
  for (const role of ROLES) {
    const aProp = (aRoleCounts.get(role) ?? 0) / Math.max(1, aRoles.length);
    const bProp = (bRoleCounts.get(role) ?? 0) / Math.max(1, bRoles.length);
    rolePropDiv += Math.abs(aProp - bProp);
  }
  rolePropDiv = rolePropDiv / ROLES.length;

  // Weighted component comparison
  const compKeys: (keyof typeof a.dom)[] = ["grids", "cards", "lists"];
  let compSum = 0;
  for (const k of compKeys) {
    const av = a.dom[k] as number;
    const bv = b.dom[k] as number;
    // Normalize by section count so 6 grids in 8 sections ≈ 3 grids in 4 sections
    const aNorm = av / Math.max(1, a.dom.sections);
    const bNorm = bv / Math.max(1, b.dom.sections);
    compSum += normalizedDiff(aNorm, bNorm);
  }
  const compDiv = compSum / compKeys.length;

  return 0.45 * rolePresenceDiv + 0.3 * rolePropDiv + 0.25 * compDiv;
}

function computeDensityDivergence(a: PageFingerprint, b: PageFingerprint): number {
  const curveSim = cosineSimilarity(
    a.density.elementsPerViewport,
    b.density.elementsPerViewport
  );
  const weightDiff = normalizedDiff(a.density.textWeightRatio, b.density.textWeightRatio);
  const interDiff = normalizedDiff(a.density.interactionNodes, b.density.interactionNodes);
  return 0.5 * (1 - curveSim) + 0.25 * weightDiff + 0.25 * interDiff;
}

function getAppliedEaseSets(profiles: {
  ease: number[] | null;
  sectionMapping: string[];
}[]): Set<string> {
  const sets = new Set<string>();
  for (const p of profiles) {
    if (!p.ease) continue;
    const countMatch = p.sectionMapping[0]?.match(/used:(\d+)x/);
    const uses = countMatch ? parseInt(countMatch[1], 10) : 0;
    if (uses > 0) sets.add(p.ease.join(","));
  }
  return sets;
}

function computeMotionDivergence(a: PageFingerprint, b: PageFingerprint): number {
  // Applied patterns count divergence
  const appliedDiff = normalizedDiff(a.motion.appliedPatterns, b.motion.appliedPatterns);

  // Compare actual easing curves of applied profiles (Jaccard)
  const aEases = getAppliedEaseSets(a.motion.profiles);
  const bEases = getAppliedEaseSets(b.motion.profiles);
  const easeDiv = 1 - jaccardSimilarity(aEases, bEases);

  // Uniformity difference
  const uniformDiff = Math.abs(a.motion.motionUniformityScore - b.motion.motionUniformityScore);

  return 0.4 * appliedDiff + 0.4 * easeDiv + 0.2 * uniformDiff;
}

function computeEntropyDivergence(a: PageFingerprint, b: PageFingerprint): number {
  const scoreDiff = Math.abs(a.layout.entropyScore - b.layout.entropyScore);
  const repDiff = Math.abs(a.layout.motifRepetitionRate - b.layout.motifRepetitionRate);
  return 0.5 * scoreDiff + 0.5 * repDiff;
}

export function compareProfiles(profiles: Record<string, PageFingerprint>): {
  divergenceMatrix: Record<string, DivergenceMetric>;
  collisions: CollisionWarning[];
} {
  const verticals = Object.keys(profiles);
  const divergenceMatrix: Record<string, DivergenceMetric> = {};
  const collisions: CollisionWarning[] = [];

  for (let i = 0; i < verticals.length; i++) {
    for (let j = i + 1; j < verticals.length; j++) {
      const a = profiles[verticals[i]];
      const b = profiles[verticals[j]];
      const key = `${verticals[i]}-vs-${verticals[j]}`;

      const structural = computeStructuralDivergence(a, b);
      const density = computeDensityDivergence(a, b);
      const motion = computeMotionDivergence(a, b);
      const entropy = computeEntropyDivergence(a, b);
      const combined = 0.35 * structural + 0.25 * density + 0.25 * motion + 0.15 * entropy;

      divergenceMatrix[key] = {
        structural: Math.round(structural * 1000) / 1000,
        density: Math.round(density * 1000) / 1000,
        motion: Math.round(motion * 1000) / 1000,
        entropy: Math.round(entropy * 1000) / 1000,
        combined: Math.round(combined * 1000) / 1000,
      };

      const dims: [string, number, string][] = [
        ["structure", structural, "Role-weighted structure"],
        ["density", density, "Viewport density curve"],
        ["motion", motion, "Motion applied patterns"],
        ["entropy", entropy, "Hierarchical role entropy"],
      ];
      for (const [dim, val, desc] of dims) {
        if (val < 0.15) {
          collisions.push({
            type: dim as CollisionWarning["type"],
            severity: "high",
            description: `Near-identical ${desc} between ${verticals[i]} and ${verticals[j]} (diff=${val})`,
            verticals: [verticals[i], verticals[j]],
            metric: val,
          });
        } else if (val < 0.3) {
          collisions.push({
            type: dim as CollisionWarning["type"],
            severity: "medium",
            description: `Low ${desc} divergence between ${verticals[i]} and ${verticals[j]} (diff=${val})`,
            verticals: [verticals[i], verticals[j]],
            metric: val,
          });
        }
      }
    }
  }

  // Structural motif collision detection (cross-page)
  for (let i = 0; i < verticals.length; i++) {
    for (let j = i + 1; j < verticals.length; j++) {
      const a = profiles[verticals[i]];
      const b = profiles[verticals[j]];
      const aHashes = new Set(a.layout.motifs.map((m) => m.hash));
      const bHashes = new Set(b.layout.motifs.map((m) => m.hash));
      const shared = [...aHashes].filter((h) => bHashes.has(h));

      if (shared.length > 0) {
        collisions.push({
          type: "structure",
          severity: shared.length > 2 ? "high" : "medium",
          description: `${shared.length} shared motif(s) between ${verticals[i]} and ${verticals[j]} — possible UI grammar leakage`,
          verticals: [verticals[i], verticals[j]],
          metric: shared.length,
        });
      }
    }
  }

  return { divergenceMatrix, collisions };
}

export function computeSharedGrammarScore(profiles: Record<string, PageFingerprint>): number {
  const verticals = Object.keys(profiles);
  let totalShared = 0;
  let pairCount = 0;

  for (let i = 0; i < verticals.length; i++) {
    for (let j = i + 1; j < verticals.length; j++) {
      const a = profiles[verticals[i]];
      const b = profiles[verticals[j]];
      const aHashes = new Set(a.layout.motifs.map((m) => m.hash));
      const bHashes = new Set(b.layout.motifs.map((m) => m.hash));
      const inter = [...aHashes].filter((h) => bHashes.has(h)).length;
      const union = new Set([...aHashes, ...bHashes]).size;
      totalShared += union > 0 ? inter / union : 0;
      pairCount++;
    }
  }

  return pairCount > 0 ? Math.round((totalShared / pairCount) * 1000) / 1000 : 0;
}
