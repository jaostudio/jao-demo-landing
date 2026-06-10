"use client";

import { motion } from "framer-motion";
import type { ProofData } from "@jaostudio/engine/types";
import { StatItem } from "./StatItem";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { fadeUp, transitions } from "@/lib/motion-tokens";

type Props = {
  data: ProofData;
};

export function ProofAdapter({ data }: Props) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="border-y border-neutral-200 py-20 dark:border-neutral-800 md:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={transitions.normal}
          className="text-sm font-medium uppercase tracking-wider text-neutral-500"
        >
          {data.headline}
        </motion.p>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {data.items.map((item, idx) => (
            <StatItem
              key={idx}
              value={item.value}
              label={item.label}
              index={idx}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
