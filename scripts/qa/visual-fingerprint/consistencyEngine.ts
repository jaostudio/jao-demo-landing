import type {
  DivergenceMetric,
  ConsistencyEngineReport,
  ConflictRecord,
} from "../core/types";

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────

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
  return denom === 0 ? 0 : dot / denom;
}

function stddev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

// ──────────────────────────────────────────
// Layer definitions
// Each layer's divergence vector: [SR-BS, SR-HC, BS-HC]
// ──────────────────────────────────────────

const PAIR_ORDER = [
  "summit-ridge-vs-brightsmile",
  "summit-ridge-vs-harrison-cole",
  "brightsmile-vs-harrison-cole",
];

const CONFLICT_DELTA_THRESHOLD = 0.25;

// ──────────────────────────────────────────
// Main computation
// ──────────────────────────────────────────

export function computeConsistency(
  divergenceMatrix: Record<string, DivergenceMetric>,
  grammarDivergence: Record<string, number>,
  semanticDivergence: Record<string, number>
): ConsistencyEngineReport {
  // 1. Extract all layer vectors
  const layerNames = ["structural", "density", "motion", "entropy", "grammar", "role"];
  const vectors: Record<string, number[]> = {
    structural: PAIR_ORDER.map((p) => divergenceMatrix[p]?.structural ?? 0),
    density:    PAIR_ORDER.map((p) => divergenceMatrix[p]?.density ?? 0),
    motion:     PAIR_ORDER.map((p) => divergenceMatrix[p]?.motion ?? 0),
    entropy:    PAIR_ORDER.map((p) => divergenceMatrix[p]?.entropy ?? 0),
    grammar:    PAIR_ORDER.map((p) => grammarDivergence[p] ?? 0),
    role:       PAIR_ORDER.map((p) => semanticDivergence[p] ?? 0),
  };

  // 2. Layer agreement: cosine similarity between each pair of divergence vectors
  //    High = layers see the same pattern of which pairs diverge
  const layerAgreement: Record<string, number> = {};
  for (let i = 0; i < layerNames.length; i++) {
    for (let j = i + 1; j < layerNames.length; j++) {
      const key = `${layerNames[i]}-${layerNames[j]}`;
      const sim = cosineSimilarity(vectors[layerNames[i]], vectors[layerNames[j]]);
      layerAgreement[key] = Math.round(sim * 1000) / 1000;
    }
  }

  // 3. Pair consistency: for each pair, how much variation across layers
  //    Low stddev = all layers agree on this pair's divergence level
  const pairConsistency: Record<string, number> = {};
  for (let p = 0; p < PAIR_ORDER.length; p++) {
    const pairKey = PAIR_ORDER[p];
    const values = layerNames.map((ln) => vectors[ln][p]);
    const sd = stddev(values);
    // Normalize: consistency = 1 - (stddev / 0.5)
    // 0.5 is max plausible range for divergences (0–0.5 typical)
    pairConsistency[pairKey] = Math.round(
      Math.max(0, Math.min(1, 1 - sd / 0.5)) * 1000
    ) / 1000;
  }

  // 4. Conflict detection: per pair, per layer pair, divergence delta > threshold
  const conflicts: ConflictRecord[] = [];
  for (let p = 0; p < PAIR_ORDER.length; p++) {
    const pairKey = PAIR_ORDER[p];
    for (let i = 0; i < layerNames.length; i++) {
      for (let j = i + 1; j < layerNames.length; j++) {
        const a = vectors[layerNames[i]][p];
        const b = vectors[layerNames[j]][p];
        const delta = Math.abs(a - b);
        if (delta > CONFLICT_DELTA_THRESHOLD) {
          conflicts.push({
            pair: pairKey,
            layerA: layerNames[i],
            layerB: layerNames[j],
            divergenceA: Math.round(a * 1000) / 1000,
            divergenceB: Math.round(b * 1000) / 1000,
            delta: Math.round(delta * 1000) / 1000,
          });
        }
      }
    }
  }

  // 5. Global coherence: mean pair consistency
  const pairValues = Object.values(pairConsistency);
  const globalCoherence =
    pairValues.length > 0
      ? Math.round(
          (pairValues.reduce((s, v) => s + v, 0) / pairValues.length) * 1000
        ) / 1000
      : 0;

  return {
    pairConsistency,
    layerAgreement,
    conflicts,
    globalCoherence,
  };
}
