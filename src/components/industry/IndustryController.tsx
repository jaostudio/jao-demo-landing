"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { IndustryProfile } from "@jaostudio/engine/types";
import type { Theme } from "@jaostudio/engine/theme";
import { resolveTheme } from "@jaostudio/engine/theme";
import { industryList } from "@/industry";

type IndustryContextType = {
  activeSlug: string | null;
  activeProfile: IndustryProfile | null;
  profiles: IndustryProfile[];
  setActive: (slug: string) => void;
};

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

export function IndustryController({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const value = useMemo(() => {
    const activeSlug = pathname === "/" ? null : pathname.split("/")[1] ?? null;
    const activeProfile = activeSlug
      ? industryList.find((p) => p.slug === activeSlug) ?? null
      : null;

    return {
      activeSlug,
      activeProfile,
      profiles: industryList,
      setActive: (slug: string) => router.push(`/${slug}`),
    };
  }, [pathname, router]);

  const themeStyle = useMemo(() => {
    if (!value.activeProfile) return undefined;
    const t = resolveTheme(value.activeProfile.theme as Theme);
    return {
      "--theme-primary": t.primary[500],
      "--theme-primary-600": t.primary[600],
      "--theme-accent": t.accent[500],
      "--theme-accent-600": t.accent[600],
    } as React.CSSProperties;
  }, [value.activeProfile]);

  return (
    <IndustryContext.Provider value={value}>
      <div style={themeStyle}>{children}</div>
    </IndustryContext.Provider>
  );
}

export function useIndustry(): IndustryContextType {
  const ctx = useContext(IndustryContext);
  if (!ctx) throw new Error("useIndustry must be used within IndustryController");
  return ctx;
}
