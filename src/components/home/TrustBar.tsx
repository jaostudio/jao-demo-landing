"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useCountUp } from "@/components/sections/proof/useCountUp";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
};

const stats: Stat[] = [
  { label: "Verticals Shipped", value: 3 },
  { label: "Lighthouse Score", value: 90, suffix: "+" },
  { label: "Static Routes", value: 7 },
  { label: "Console Errors", value: 0 },
];

function Counter({ value, suffix, decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCountUp({
    end: value,
    decimals,
    enabled: inView && !shouldReduceMotion,
  });
  const display = !inView || shouldReduceMotion ? value : count;
  return (
    <span ref={ref}>
      {display}
      {suffix ?? ""}
    </span>
  );
}

export function TrustBar() {
  const shouldReduceMotion = useReducedMotion();
  const trans = shouldReduceMotion ? { duration: 0 } : { duration: 0.4 };

  return (
    <section className="bg-neutral-50 py-12 dark:bg-neutral-900 md:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={trans}
          className="text-center text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400"
        >
          Build metrics
        </motion.p>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-4xl">
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
