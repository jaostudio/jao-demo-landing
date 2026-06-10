"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUpBlur, fadeUp, transitions } from "@/lib/motion-tokens";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-neutral-900 blur-3xl dark:bg-white" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.h1
          variants={fadeUpBlur}
          initial="hidden"
          animate="visible"
          transition={transitions.hero}
          className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-6xl"
        >
          Websites that work<br />
          for your business.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...transitions.normal, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300 md:text-xl"
        >
          Performance-focused, conversion-optimised, and built for real results.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...transitions.normal, delay: 0.2 }}
          className="mt-10"
        >
          <Link
            href="#work"
            className="inline-block rounded-xl bg-neutral-900 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            View Our Work
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
