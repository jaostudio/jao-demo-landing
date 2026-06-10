"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, transitions } from "@/lib/motion-tokens";

interface CaseResult {
  category: string;
  amount: string;
  description: string;
}

interface Props {
  items?: CaseResult[];
}

const defaultItems: CaseResult[] = [
  { category: "Business Litigation", amount: "$4.2M", description: "Jury verdict for breach of contract" },
  { category: "Personal Injury", amount: "$2.8M", description: "Settlement for motor vehicle accident" },
  { category: "Family Law", amount: "$1.5M", description: "Complex asset division and spousal support" },
  { category: "Criminal Defense", amount: "Dismissed", description: "All charges dropped after pretrial motion" },
  { category: "Real Estate Law", amount: "$3.1M", description: "Favorable resolution of property dispute" },
  { category: "Estate Planning", amount: "$5.0M", description: "Multi-generational trust and tax strategy" },
  { category: "Business Litigation", amount: "$1.8M", description: "Partnership dissolution settlement" },
  { category: "Personal Injury", amount: "$950K", description: "Premises liability claim resolution" },
];

const TICKER_SPEED = 0.4;

export function CaseTicker({ items = defaultItems }: Props) {
  const tickRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const el = tickRef.current;
    if (!el) return;

    let rafId: number;
    let pos = 0;

    const animate = () => {
      if (!isPaused) {
        pos -= TICKER_SPEED;
        const scrollWidth = el.scrollWidth / 2;
        if (Math.abs(pos) >= scrollWidth) {
          pos = 0;
        }
        el.style.transform = `translateX(${pos}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused, reducedMotion]);

  const duplicated = reducedMotion ? items : [...items, ...items];

  return (
    <section className="border-t border-neutral-200 bg-white py-16 dark:border-neutral-800 dark:bg-neutral-950 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={transitions.normal}
          className="text-center text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
        >
          Case Results
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ ...transitions.normal, delay: 0.05 }}
          className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
        >
          Every case is unique. Past results do not guarantee future outcomes.
        </motion.p>
      </div>

      <div
        className="mt-10 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={tickRef}
          className="flex gap-6 will-change-transform"
          style={{ width: "max-content" }}
        >
          {duplicated.map((item, i) => (
            <div
              key={i}
              className="flex w-64 shrink-0 flex-col rounded-xl border border-[var(--theme-primary)]/30 bg-[var(--theme-primary)]/5 p-5 dark:border-[var(--theme-primary)]/30 dark:bg-[var(--theme-primary)]/10"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--theme-primary)]">
                  {item.category}
                </span>
                <span className="text-lg font-bold text-[var(--theme-primary)]">
                  {item.amount}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
