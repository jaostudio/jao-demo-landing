"use client";

import Link from "next/link";
import { useIndustry } from "../industry/IndustryController";

type Props = {
  children: React.ReactNode;
};

export function MobileBottomDock({ children }: Props) {
  const { activeProfile } = useIndustry();
  const isHome = !activeProfile;

  return (
    <div className="fixed bottom-6 left-6 z-[1000] flex flex-col items-start gap-3 pointer-events-none">
      {!isHome && (
        <div className="md:hidden pointer-events-auto">
          <Link
            href={activeProfile.company.cta.href}
            className="flex w-[280px] items-center justify-center rounded-xl bg-[var(--theme-primary)] px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98] max-sm:w-[calc(100vw-32px)]"
          >
            {activeProfile.company.cta.label}
          </Link>
        </div>
      )}
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
