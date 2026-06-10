"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useIndustry } from "./IndustryController";
import { ICON_MAP } from "@/lib/icon-map";
import { durations, easing, staggers } from "@/lib/motion-tokens";

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

type SwitcherProps = {
  embedded?: boolean;
};

export function IndustrySwitcher({ embedded }: SwitcherProps = {}) {
  const { activeProfile, profiles, setActive } = useIndustry();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);

  const dismissHint = useCallback(() => {
    setHintDismissed(true);
    try {
      localStorage.setItem("portfolio-hint-dismissed", "true");
    } catch {}
  }, []);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem("portfolio-hint-dismissed") === "true") {
        setHintDismissed(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        if (mounted) dismissHint();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dismissHint, mounted]);

  const remainingCount = activeProfile
    ? Math.max(0, profiles.length - 1)
    : profiles.length;

  const exploreText = activeProfile
    ? `View ${remainingCount} more project${remainingCount === 1 ? "" : "s"}`
    : `View ${remainingCount} project${remainingCount === 1 ? "" : "s"}`;

  const companyName = activeProfile?.company.name ?? "Select an Experience";
  const category = activeProfile?.company.category;

  const showHint = mounted && !hintDismissed && !open;

  const handlePillClick = () => {
    setOpen((o) => !o);
    dismissHint();
  };

  const handleSelect = (slug: string) => {
    setActive(slug);
    setOpen(false);
    dismissHint();
  };

  return (
    <div ref={ref} className={`${embedded ? 'relative' : 'fixed bottom-6 left-6'} z-[1000]`}>
      {/* First-visit hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: durations.normal, ease: easing.out }}
            className="absolute bottom-full left-0 mb-3 w-[280px] rounded-2xl border border-black/10 bg-white/92 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-[16px] max-sm:w-[calc(100vw-32px)]"
          >
            <div className="absolute -bottom-1.5 left-8 h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-white/92" />
            <h4 className="text-sm font-semibold text-neutral-800">
              Browse our portfolio
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-neutral-500">
              View the projects we have built.
            </p>
            <button
              onClick={() => {
                setOpen(true);
                dismissHint();
              }}
              className="mt-3 w-full rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Show Me
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed pill */}
      <button
        onClick={handlePillClick}
        aria-expanded={open}
        aria-label="Switch industry experience"
        className="flex w-[280px] flex-col gap-0.5 rounded-2xl border border-black/10 bg-white/92 px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-[16px] transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] max-sm:w-[calc(100vw-32px)]"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
          More Work
        </span>
        <span className="text-sm font-semibold text-neutral-800">
          {companyName}
        </span>
        {category && (
          <span className="text-xs text-neutral-400">{category}</span>
        )}
        <div className="flex items-center gap-1 text-xs text-neutral-400">
          <span>{exploreText}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: durations.fast }}
          >
            <ChevronDown className="h-3 w-3" />
          </motion.span>
        </div>
      </button>

      {/* Expanded panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Select industry experience"
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={{ duration: durations.fast, ease: easing.out }}
            className="absolute bottom-full left-0 mb-2 w-[280px] overflow-hidden rounded-2xl border border-black/10 bg-white/92 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-[16px] max-sm:w-[calc(100vw-32px)]"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: staggers.fast } },
              }}
              className="p-2"
            >
              <div className="px-3 pb-1 pt-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  More Work
                </span>
                <h3 className="mt-0.5 text-sm font-semibold text-neutral-800">
                  Selected Projects
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">
                  Explore our recent work across different sectors.
                </p>
              </div>

              {profiles.map((p) => {
                const isActive = p.slug === activeProfile?.slug;
                const thumbnail = p.imagery.thumbnail;
                const previewType = p.switcher?.previewType ?? "icon";
                const IconComp = p.switcher?.icon
                  ? ICON_MAP[p.switcher.icon]
                  : null;

                return (
                  <motion.div key={p.slug} variants={itemVariants}>
                    <button
                      onClick={() => handleSelect(p.slug)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                        {previewType === "photo" && thumbnail ? (
                          <Image
                            src={thumbnail}
                            alt=""
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        ) : IconComp ? (
                          <div className="flex h-full w-full items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                            <IconComp className="h-5 w-5 text-neutral-500" />
                          </div>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                            <span className="text-sm font-bold text-neutral-400">
                              {p.company.name[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span
                          className={`text-sm ${
                            isActive
                              ? "font-semibold text-neutral-800"
                              : "font-medium text-neutral-600"
                          }`}
                        >
                          {p.company.name}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {p.company.category}
                        </span>
                      </div>
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          isActive ? "bg-neutral-800" : "bg-neutral-300"
                        }`}
                      />
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
