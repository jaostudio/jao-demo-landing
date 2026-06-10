"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useCountUp } from "./useCountUp";
import { statItem, transitions } from "@/lib/motion-tokens";

type Props = {
  value: string;
  label: string;
  index: number;
  reducedMotion: boolean;
};

function parseValue(raw: string): { target: number; decimals: number; suffix: string } {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const decimals = cleaned.includes(".") ? 1 : 0;
  return {
    target: parseFloat(cleaned),
    decimals,
    suffix: raw.replace(/[\d.]/g, ""),
  };
}

export function StatItem({ value, label, index, reducedMotion }: Props) {
  const { target, decimals, suffix } = parseValue(value);
  const scopeRef = useRef(null);
  const inView = useInView(scopeRef, { once: true });
  const count = useCountUp({
    end: target,
    decimals,
    enabled: inView && !reducedMotion,
  });

  const displayValue = !inView || reducedMotion ? target : count;

  return (
    <motion.div
      ref={scopeRef}
      variants={statItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ ...transitions.normal, delay: index * 0.08 }}
      className="flex flex-col items-center"
    >
      <div className="text-4xl font-semibold text-[var(--theme-primary)] md:text-5xl">
        {displayValue}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
        {label}
      </div>
    </motion.div>
  );
}
