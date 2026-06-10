export type QAStatus = "pass" | "fail";
export type CheckCategory = "structural" | "content" | "interaction" | "layout";

export interface FailureSnapshot {
  html: string;
  viewportScreenshot: string;
}

export interface BaselineDiff {
  diffPixels: number;
  diffPercent: number;
  diffImage: string;
}

export interface QACheck {
  id: string;
  category: CheckCategory;
  status: QAStatus;
  message?: string;
  failureSnapshot?: FailureSnapshot;
}

export interface QAResult {
  suite: string;
  url: string;
  status: QAStatus;
  checks: QACheck[];
  screenshots: string[];
  durationMs: number;
  timestamp: number;
  baselineDiff?: BaselineDiff | null;
}

export interface QASpecCheck {
  id: string;
  category: CheckCategory;
  type: "visible" | "text" | "count" | "hierarchy" | "viewport" | "href-valid";
  selector: string;
  text?: string | RegExp;
  minLength?: number;
  minCount?: number;
  expected?: number;
}

export interface QASpec {
  url: string;
  baselineId: string;
  checks: QASpecCheck[];
}

// ──────────────────────────────────────────
// Phase 4 — Visual Fingerprint & Audit types
// ──────────────────────────────────────────

export interface SectionFingerprint {
  id: string;
  tag: string;
  childCount: number;
  hasGrid: boolean;
  gridCols: number | null;
  hasFlex: boolean;
  hasCard: boolean;
  cardCount: number;
  hasList: boolean;
  listItemCount: number;
  isFlatText: boolean;
  spacingClasses: string[];
  nestingDepth: number;
  interactionCount: number;
}

export interface DensitySlice {
  viewportStart: number;
  viewportEnd: number;
  textNodes: number;
  uiNodes: number;
  interactionNodes: number;
}

export interface MotionProfile {
  variantName: string;
  stagger: number | null;
  duration: number | null;
  ease: number[] | null;
  sectionMapping: string[];
}

export interface MotifHash {
  hash: string;
  sectionType: string;
  containerPattern: string;
  spacingPattern: string;
  childShapeSignature: string;
  count: number;
}

export interface DomFingerprint {
  sections: number;
  grids: number;
  cards: number;
  lists: number;
  flatTextBlocks: number;
  sectionFingerprints: SectionFingerprint[];
}

export interface DensityMetrics {
  slices: DensitySlice[];
  elementsPerViewport: number[];
  textWeightRatio: number;
  interactionNodes: number;
}

export interface MotionMetrics {
  profiles: MotionProfile[];
  declaredVariants: number;
  appliedPatterns: number;
  motionRoles: { entrance: number; transition: number; microInteraction: number };
  staggerDistribution: number[];
  easingEntropy: number;
  motionUniformityScore: number;
}

export interface LayoutMetrics {
  entropyScore: number;
  motifs: MotifHash[];
  uniqueMotifs: number;
  motifRepetitionRate: number;
}

export interface PageFingerprint {
  vertical: string;
  url?: string;
  timestamp: number;
  dom: DomFingerprint;
  density: DensityMetrics;
  motion: MotionMetrics;
  layout: LayoutMetrics;
  uiGrammarSignature: string;
}

export interface DivergenceMetric {
  structural: number;
  density: number;
  motion: number;
  entropy: number;
  combined: number;
}

export interface CollisionWarning {
  type: "motion" | "structure" | "density" | "entropy";
  severity: "low" | "medium" | "high";
  description: string;
  verticals: [string, string];
  metric?: number;
}

export type LayoutGrammar =
  | "CARD_GRID"
  | "NARRATIVE_STACK"
  | "ALTERNATING_SPLIT"
  | "LIST_DOMINANT"
  | "HYBRID_EDITORIAL"
  | "FORM_INTENSIVE"
  | "TIMELINE_FLOW"
  | "HERO_COMPOSITE";

export interface SectionGrammarFeatures {
  gridDensity: number;
  cardDensity: number;
  textBlockRatio: number;
  interactionDensity: number;
  layoutSymmetry: number;
  verticalRhythm: number;
}

export interface SectionGrammarProfile {
  sectionId: string;
  grammar: LayoutGrammar;
  confidence: number;
  features: SectionGrammarFeatures;
}

export type SectionRole =
  | "HERO_ENTRY"
  | "CAPABILITY_LAYER"
  | "PROOF_LAYER"
  | "TRUST_LAYER"
  | "PROCESS_LAYER"
  | "CONVERSION_LAYER"
  | "TEAM_LAYER"
  | "EDUCATION_LAYER"
  | "DISCLOSURE_LAYER";

export interface SectionSemanticProfile {
  sectionId: string;
  role: SectionRole;
  confidence: number;
}

export interface SemanticFingerprint {
  vertical: string;
  sections: SectionSemanticProfile[];
  distribution: Record<SectionRole, number>;
  roleSequence: SectionRole[];
  roleEntropy: number;
  convergentRoles: SectionRole[];
}

export interface GrammarFingerprint {
  vertical: string;
  sections: SectionGrammarProfile[];
  distribution: Record<LayoutGrammar, number>;
  entropy: number;
  dominantGrammar: LayoutGrammar;
}

export interface ConsistencyCell {
  layerA: string;
  layerB: string;
  similarity: number;
}

export interface ConflictRecord {
  pair: string;
  layerA: string;
  layerB: string;
  divergenceA: number;
  divergenceB: number;
  delta: number;
}

export interface ConsistencyEngineReport {
  pairConsistency: Record<string, number>;
  layerAgreement: Record<string, number>;
  conflicts: ConflictRecord[];
  globalCoherence: number;
}

export interface ComponentImpactReport {
  component: string;
  presence: Record<string, boolean>;
  structuralContribution: number;
  densityContribution: number;
  entropyContribution: number;
  collapseRisk: number;
}

export interface CollapseReport {
  components: ComponentImpactReport[];
  highRiskComponents: string[];
  mediumRiskComponents: string[];
  divergenceRecoveryPotential: number;
}

export interface AuditReport {
  timestamp: number;
  profiles: Record<string, PageFingerprint>;
  divergenceMatrix: Record<string, DivergenceMetric>;
  collisions: CollisionWarning[];
  sharedGrammarScore: number;
  collapseReport: CollapseReport;
  grammarFingerprints: Record<string, GrammarFingerprint>;
  grammarDivergence: Record<string, number>;
  semanticFingerprints: Record<string, SemanticFingerprint>;
  semanticDivergence: Record<string, number>;
  convergentRoles: SectionRole[];
  consistencyReport: ConsistencyEngineReport;
}
