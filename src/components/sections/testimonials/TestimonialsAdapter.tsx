"use client";

import { motion } from "framer-motion";
import type { TestimonialData } from "@jaostudio/engine/types";
import { fadeUp, transitions, staggers } from "@/lib/motion-tokens";

type Props = {
  data: TestimonialData;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggers.normal },
  },
};

export function TestimonialsAdapter({ data }: Props) {
  return (
    <section className="bg-neutral-50 py-20 dark:bg-neutral-900 md:py-28">
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
          viewport={{ once: true }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {data.items.map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="mt-6">
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {item.author}
                </div>
                {(item.role || item.company) && (
                  <div className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                    {item.role}
                    {item.role && item.company ? " \u00B7 " : ""}
                    {item.company}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
