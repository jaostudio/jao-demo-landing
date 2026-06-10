import { Project, SyntaxKind, Node } from "ts-morph";
import path from "path";
import type { MotionProfile } from "../core/types";

const ROOT = path.resolve(__dirname, "../../..");
const SITES_DIR = path.resolve(ROOT, "src/sites");
const LIB_DIR = path.resolve(ROOT, "src/lib");

const VERTICAL_FILES: Record<string, string> = {
  "summit-ridge": path.join(SITES_DIR, "SummitRidgeSite.tsx"),
  brightsmile: path.join(SITES_DIR, "BrightSmileSite.tsx"),
  "harrison-cole": path.join(SITES_DIR, "HarrisonColeSite.tsx"),
};

const MOTION_TOKENS_PATH = path.join(LIB_DIR, "motion-tokens.ts");

function extractNumber(node: Node): number | null {
  if (Node.isNumericLiteral(node)) return Number(node.getText());
  if (Node.isPrefixUnaryExpression(node) && node.getOperator() === SyntaxKind.MinusToken) {
    const operand = node.getOperand();
    if (Node.isNumericLiteral(operand)) return -Number(operand.getText());
  }
  return null;
}

function extractArrayNumbers(node: Node): number[] | null {
  if (!Node.isArrayLiteralExpression(node)) return null;
  const elements = node.getElements();
  const nums: number[] = [];
  for (const el of elements) {
    const n = extractNumber(el);
    if (n === null) return null;
    nums.push(n);
  }
  return nums;
}

export function extractMotion(vertical: string): MotionProfile[] {
  const filePath = VERTICAL_FILES[vertical];
  if (!filePath) return [];

  const project = new Project({
    compilerOptions: {
      baseUrl: ROOT,
      paths: { "@/*": ["src/*"] },
      jsx: "preserve",
      strictNullChecks: true,
    },
  });

  const siteSource = project.addSourceFileAtPath(filePath);

  const motionTokensSource: ReturnType<typeof project.addSourceFileAtPath> | null =
    (() => {
      try {
        return project.addSourceFileAtPath(MOTION_TOKENS_PATH);
      } catch {
        return null;
      }
    })();

  // Build a lookup of all exported declarations from motion-tokens
  const sharedLookup = new Map<string, string>();
  if (motionTokensSource) {
    for (const decl of motionTokensSource.getVariableDeclarations()) {
      const name = decl.getName();
      const init = decl.getInitializer();
      if (init) sharedLookup.set(name, init.getText());
    }
  }

  // Unwrap `as const` expressions to get the inner expression
  function unwrap(node: Node): Node {
    return node.getKind() === SyntaxKind.AsExpression
      ? (node as any).getExpression()
      : node;
  }

  // Resolve a node to its stable string representation
  function resolveToText(node: Node): string {
    if (Node.isPropertyAccessExpression(node)) {
      const obj = node.getExpression();
      const prop = node.getName();
      if (Node.isIdentifier(obj)) {
        const full = `${obj.getText()}.${prop}`;
        return full;
      }
      return node.getText();
    }
    return node.getText();
  }

  const profiles: MotionProfile[] = [];
  const seen = new Set<string>();

  // Walk all variable declarations in the site file
  for (const decl of siteSource.getVariableDeclarations()) {
    const name = decl.getName();
    const rawInit = decl.getInitializer();
    if (!rawInit) continue;
    const init = unwrap(rawInit);

    // ── Variant: object with hidden/visible ──
    if (Node.isObjectLiteralExpression(init)) {
      const props = init.getProperties();
      const propNames = props.map((p) => {
        if (Node.isPropertyAssignment(p)) {
          const n = p.getName();
          return typeof n === "string" ? n : n.getText();
        }
        if (Node.isShorthandPropertyAssignment(p)) return p.getName();
        if (Node.isSpreadAssignment(p)) return "__spread";
        return "";
      });

      if (propNames.includes("hidden") && propNames.includes("visible")) {
        if (!seen.has(name)) {
          seen.add(name);
          const stagger = extractStaggerFromVariant(init);
          profiles.push({
            variantName: name,
            stagger,
            duration: null,
            ease: null,
            sectionMapping: [],
          });
        }
        continue;
      }

      // ── Transition: object with duration/ease ──
      if (propNames.includes("duration") || propNames.includes("ease")) {
        if (!seen.has(name)) {
          seen.add(name);
          let duration: number | null = null;
          let easeArr: number[] | null = null;

          for (const prop of props) {
            if (!Node.isPropertyAssignment(prop)) continue;
            const propName =
              typeof prop.getName() === "string"
                ? prop.getName()
                : prop.getName().getText();
            const initializer = prop.getInitializer();
            if (!initializer) continue;

            if (propName === "duration") {
              if (Node.isNumericLiteral(initializer)) {
                duration = Number(initializer.getText());
              } else if (Node.isPropertyAccessExpression(initializer)) {
                const resolved = resolveToText(initializer);
                const cached = sharedLookup.get(resolved);
                if (cached) {
                  const n = parseFloat(cached);
                  if (!isNaN(n)) duration = n;
                }
              }
            } else if (propName === "ease") {
              if (Node.isIdentifier(initializer)) {
                const vName = initializer.getText();
                // Check local declarations
                for (const d2 of siteSource.getVariableDeclarations()) {
                  if (d2.getName() === vName) {
                    const d2Raw = d2.getInitializer();
                    if (d2Raw) {
                      easeArr = extractArrayNumbers(unwrap(d2Raw));
                    }
                    break;
                  }
                }
                if (!easeArr) {
                  const cached = sharedLookup.get(vName);
                  if (cached && cached.startsWith("[")) {
                    easeArr = safeParseArray(cached);
                  }
                }
              } else {
                easeArr = extractArrayNumbers(initializer);
              }
            }
          }

          profiles.push({
            variantName: name,
            stagger: null,
            duration,
            ease: easeArr,
            sectionMapping: [],
          });
        }
        continue;
      }
    }

    // ── Easing array: [a, b, c, d] ──
    if (Node.isArrayLiteralExpression(init)) {
      const nums = extractArrayNumbers(init);
      if (nums && nums.length === 4) {
        if (!seen.has(name)) {
          seen.add(name);
          profiles.push({
            variantName: name,
            stagger: null,
            duration: null,
            ease: nums,
            sectionMapping: [],
          });
        }
        continue;
      }
    }

    // ── Stagger: plain number ──
    if (Node.isNumericLiteral(init)) {
      if (!seen.has(name)) {
        seen.add(name);
        profiles.push({
          variantName: name,
          stagger: Number(init.getText()),
          duration: null,
          ease: null,
          sectionMapping: [],
        });
      }
      continue;
    }
  }

  // ── Resolve imported motion-tokens ──
  for (const imp of siteSource.getImportDeclarations()) {
    const modSpec = imp.getModuleSpecifierValue();
    if (modSpec !== "@/lib/motion-tokens") continue;

    for (const named of imp.getNamedImports()) {
      const localName = named.getName();
      const bindingName = named.getAliasNode()?.getText() ?? localName;

      if (seen.has(bindingName)) continue;
      const cached = sharedLookup.get(localName);
      if (!cached) continue;

      seen.add(bindingName);

      if (cached.startsWith("{")) {
        // Object like durations, easing, staggers, transitions
        profiles.push({
          variantName: bindingName,
          stagger: null,
          duration: null,
          ease: null,
          sectionMapping: [],
        });
      } else if (cached.startsWith("[")) {
        const nums = safeParseArray(cached);
        profiles.push({
          variantName: bindingName,
          stagger: null,
          duration: null,
          ease: nums && nums.length === 4 ? nums : null,
          sectionMapping: [],
        });
      } else if (cached.startsWith("{")) {
        // Variant: has hidden/visible
        if (cached.includes("hidden") && cached.includes("visible")) {
          profiles.push({
            variantName: bindingName,
            stagger: null,
            duration: null,
            ease: null,
            sectionMapping: [],
          });
        }
      }
    }
  }

  // ── Count variant usage in JSX (separate entrance vs transition) ──
  const entranceCount = new Map<string, number>();
  const transitionCount = new Map<string, number>();
  const sourceText = siteSource.getText();

  const variantPattern = /\bvariants=\{(\w+)\}/g;
  let vm: RegExpExecArray | null;
  while ((vm = variantPattern.exec(sourceText)) !== null) {
    entranceCount.set(vm[1], (entranceCount.get(vm[1]) ?? 0) + 1);
  }

  const transitionPattern = /\btransition=\{([\w.]+)\}/g;
  while ((vm = transitionPattern.exec(sourceText)) !== null) {
    transitionCount.set(vm[1], (transitionCount.get(vm[1]) ?? 0) + 1);
  }

  // Classify profiles and attach usage
  let entranceCountTotal = 0;
  let transitionCountTotal = 0;
  let microCount = 0;

  for (const profile of profiles) {
    const eCount = entranceCount.get(profile.variantName) ?? 0;
    const tCount = transitionCount.get(profile.variantName) ?? 0;
    const total = eCount + tCount;
    profile.sectionMapping = [`used:${total}x`];

    if (eCount > 0) entranceCountTotal++;
    else if (tCount > 0) transitionCountTotal++;
    else microCount++;
  }

  const declaredVariants = profiles.length;
  const appliedPatterns = entranceCountTotal + transitionCountTotal;

  return {
    profiles,
    declaredVariants,
    appliedPatterns,
    motionRoles: {
      entrance: entranceCountTotal,
      transition: transitionCountTotal,
      microInteraction: microCount,
    },
  };
}

function extractStaggerFromVariant(node: Node): number | null {
  if (!Node.isObjectLiteralExpression(node)) return null;
  const visibleProp = node.getProperties().find((p) => {
    const name = Node.isPropertyAssignment(p) ? p.getName() : null;
    return name === "visible";
  });
  if (!visibleProp || !Node.isPropertyAssignment(visibleProp)) return null;
  const init = visibleProp.getInitializer();
  if (!init || !Node.isObjectLiteralExpression(init)) return null;
  const transitionProp = init
    .getProperties()
    .find((p) => {
      const name = Node.isPropertyAssignment(p) ? p.getName() : null;
      return name === "transition";
    });
  if (!transitionProp || !Node.isPropertyAssignment(transitionProp)) return null;
  const transInit = transitionProp.getInitializer();
  if (!transInit || !Node.isObjectLiteralExpression(transInit)) return null;
  const staggerProp = transInit
    .getProperties()
    .find((p) => {
      const name = Node.isPropertyAssignment(p) ? p.getName() : null;
      return name === "staggerChildren";
    });
  if (!staggerProp || !Node.isPropertyAssignment(staggerProp)) return null;
  const staggerInit = staggerProp.getInitializer();
  if (!staggerInit) return null;
  const val = extractNumber(staggerInit);
  return val;
}

function safeParseArray(text: string): number[] | null {
  try {
    const cleaned = text.replace(/\s+/g, "");
    const match = cleaned.match(/^\[([\d.,-]+)\]$/);
    if (!match) return null;
    const parts = match[1].split(",").map(Number);
    if (parts.some(isNaN)) return null;
    return parts;
  } catch {
    return null;
  }
}
