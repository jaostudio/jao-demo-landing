import type { ComponentType } from "react";
import type { SiteComposition } from "@jaostudio/engine/types";
import { SummitRidgeSite } from "./SummitRidgeSite";
import { BrightSmileSite } from "./BrightSmileSite";
import { HarrisonColeSite } from "./HarrisonColeSite";

export const SITE_REGISTRY: Record<string, ComponentType<{ composition: SiteComposition }>> = {
  "summit-ridge": SummitRidgeSite,
  "brightsmile": BrightSmileSite,
  "harrison-cole": HarrisonColeSite,
};

export function getSiteComponent(slug: string): ComponentType<{ composition: SiteComposition }> {
  const Component = SITE_REGISTRY[slug];
  if (!Component) throw new Error(`No site component registered for slug: ${slug}`);
  return Component;
}
