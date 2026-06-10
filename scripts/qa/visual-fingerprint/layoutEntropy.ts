import type { DomFingerprint, MotifHash, LayoutMetrics } from "../core/types";

type SectionRole = "hero" | "content" | "utility" | "footer";
type LayoutType = "grid" | "flex" | "stack" | "mixed";
type DepthBin = "shallow" | "medium" | "deep";
type DensityBin = "sparse" | "moderate" | "dense";
type VisualWeight = "none" | "light" | "heavy";

function classifyRole(id: string): SectionRole {
  const lower = id.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (lower.includes("hero")) return "hero";
  if (lower.includes("contact") || lower.includes("booking")) return "utility";
  if (lower.includes("testimonial") || lower.includes("review")) return "utility";
  if (lower.includes("safety") || lower.includes("compliance")) return "utility";
  if (lower.includes("disclosure") || lower.includes("footer")) return "footer";
  return "content";
}

function determineLayout(
  hasGrid: boolean,
  hasFlex: boolean,
  childCount: number
): LayoutType {
  if (hasGrid && hasFlex) return "mixed";
  if (hasGrid) return "grid";
  if (hasFlex) return "flex";
  return "stack";
}

function binDepth(depth: number): DepthBin {
  if (depth <= 3) return "shallow";
  if (depth <= 6) return "medium";
  return "deep";
}

function binInteraction(n: number): DensityBin {
  if (n <= 2) return "sparse";
  if (n <= 5) return "moderate";
  return "dense";
}

function categorizeWeight(cardCount: number, childCount: number): VisualWeight {
  if (cardCount === 0) return "none";
  const ratio = cardCount / Math.max(1, childCount);
  if (ratio < 0.3) return "light";
  return "heavy";
}

function shannonEntropy(proportions: number[]): number {
  let h = 0;
  for (const p of proportions) {
    if (p > 0) h -= p * Math.log2(p);
  }
  return proportions.length > 1 ? h / Math.log2(proportions.length) : h;
}

export function computeLayoutEntropy(dom: DomFingerprint): LayoutMetrics {
  if (dom.sectionFingerprints.length === 0) {
    return { entropyScore: 0, motifs: [], uniqueMotifs: 0, motifRepetitionRate: 0 };
  }

  // 1. Build role distribution + per-section descriptors
  const roleCounts = new Map<SectionRole, number>();
  const roleLayouts = new Map<SectionRole, Set<LayoutType>>();
  const roleDepths = new Map<SectionRole, Set<DepthBin>>();
  const roleDensities = new Map<SectionRole, Set<DensityBin>>();
  const motifs: MotifHash[] = [];

  for (const section of dom.sectionFingerprints) {
    const role = classifyRole(section.id);
    const layout = determineLayout(section.hasGrid, section.hasFlex, section.childCount);
    const depth = binDepth(section.nestingDepth);
    const density = binInteraction(section.interactionCount);
    const weight = categorizeWeight(section.cardCount, section.childCount);

    roleCounts.set(role, (roleCounts.get(role) ?? 0) + 1);
    if (!roleLayouts.has(role)) roleLayouts.set(role, new Set());
    roleLayouts.get(role)!.add(layout);
    if (!roleDepths.has(role)) roleDepths.set(role, new Set());
    roleDepths.get(role)!.add(depth);
    if (!roleDensities.has(role)) roleDensities.set(role, new Set());
    roleDensities.get(role)!.add(density);

    // Build motif hash for backward compat + cross-page motif detection
    const containerPattern = `l:${layout}-c:${section.cardCount}-iw:${weight}`;
    const childShape = `d:${depth}-i:${density}`;
    const spacingPattern = "hierarchical";
    const raw = `${role}|${containerPattern}|${spacingPattern}|${childShape}`;

    // Simple string hash
    let h = 5381;
    for (let i = 0; i < raw.length; i++) {
      h = ((h << 5) + h + raw.charCodeAt(i)) & 0xffffffff;
    }
    const hash = Math.abs(h).toString(16);

    const existing = motifs.find((m) => m.hash === hash);
    if (existing) {
      existing.count++;
    } else {
      motifs.push({
        hash,
        sectionType: role,
        containerPattern,
        spacingPattern,
        childShapeSignature: childShape,
        count: 1,
      });
    }
  }

  const total = dom.sectionFingerprints.length;

  // 2. Role entropy: how evenly distributed across roles
  const roleProportions = [...roleCounts.values()].map((c) => c / total);
  const roleEntropy = shannonEntropy(roleProportions);

  // 3. Within-role layout diversity: avg unique layout types per role
  let layoutDiversitySum = 0;
  let roleWithLayoutCount = 0;
  for (const [role, layouts] of roleLayouts) {
    const count = roleCounts.get(role)!;
    layoutDiversitySum += layouts.size / count;
    roleWithLayoutCount++;
  }
  const avgLayoutDiversity =
    roleWithLayoutCount > 0 ? layoutDiversitySum / roleWithLayoutCount : 0;

  // 4. Within-role depth diversity
  let depthDiversitySum = 0;
  let roleWithDepthCount = 0;
  for (const [role, depths] of roleDepths) {
    const count = roleCounts.get(role)!;
    depthDiversitySum += depths.size / count;
    roleWithDepthCount++;
  }
  const avgDepthDiversity =
    roleWithDepthCount > 0 ? depthDiversitySum / roleWithDepthCount : 0;

  // 5. Within-role interaction density diversity
  let densityDiversitySum = 0;
  let roleWithDensityCount = 0;
  for (const [role, densities] of roleDensities) {
    const count = roleCounts.get(role)!;
    densityDiversitySum += densities.size / count;
    roleWithDensityCount++;
  }
  const avgDensityDiversity =
    roleWithDensityCount > 0 ? densityDiversitySum / roleWithDensityCount : 0;

  // 6. Combined entropy: weighted hierarchical score
  const entropyScore = Math.max(
    0,
    Math.min(
      1,
      0.45 * roleEntropy +
        0.25 * avgLayoutDiversity +
        0.15 * avgDepthDiversity +
        0.15 * avgDensityDiversity
    )
  );

  // Motif repetition (identity + cross-type)
  const uniqueMotifs = motifs.length;
  const identityDelta = motifs
    .filter((m) => m.count > 1)
    .reduce((sum, m) => sum + (m.count - 1), 0);
  const motifRepetitionRate = total > 0 ? identityDelta / total : 0;

  return {
    entropyScore,
    motifs,
    uniqueMotifs,
    motifRepetitionRate,
  };
}
