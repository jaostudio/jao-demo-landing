"use client";

import { motion } from "framer-motion";
import type { ProcessData } from "@jaostudio/engine/types";
import { fadeUp, transitions, staggers, durations, easing } from "@/lib/motion-tokens";

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

export function ProcessTimeline({ data }: Props) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
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
          viewport={{ once: true, margin: "-50px" }}
          className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-5"
        >
          {/* Background connector line */}
          <div className="absolute left-[18px] top-0 hidden h-full w-0.5 bg-neutral-200 dark:bg-neutral-800 md:left-1/2 md:-translate-x-px md:block" />

          {data.steps.map((step, i) => {
            const label = step.title.replace(/^\d+\s*/, "");
            return (
              <motion.div
                key={step.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: durations.normal,
                      ease: easing.out,
                    },
                  },
                }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number circle */}
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--theme-primary)] text-sm font-bold text-white transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Connector line to next step */}
                {i < data.steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: durations.slow,
                      ease: easing.out,
                      delay: staggers.normal * i,
                    }}
                    className="absolute left-[calc(50%+20px)] top-5 hidden h-0.5 origin-left bg-neutral-300 dark:bg-neutral-700 md:block"
                    style={{ width: "calc(100% - 40px)" }}
                  />
                )}

                <h3 className="mt-4 font-semibold text-neutral-900 dark:text-neutral-50">
                  {label}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
