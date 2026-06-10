"use client";

import { motion } from "framer-motion";
import type { ProcessData } from "@jaostudio/engine/types";
import { fadeUp, transitions, staggers } from "@/lib/motion-tokens";

type Props = {
  data: ProcessData;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggers.normal },
  },
};

export function ProcessSteps({ data }: Props) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={transitions.normal}
          className="text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
        >
          {data.headline}
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 space-y-8"
        >
          {data.steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={{
                hidden: { opacity: 0, x: -8 },
                visible: { opacity: 1, x: 0 },
              }}
              className="flex gap-5"
            >
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--theme-primary)] text-sm font-bold text-white">
                  {i + 1}
                </div>
                {i < data.steps.length - 1 && (
                  <div className="mt-1 w-0.5 flex-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                )}
              </div>

              <div className="pb-8">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
