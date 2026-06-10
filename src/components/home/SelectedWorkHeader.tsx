"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, transitions } from "@/lib/motion-tokens";

export function SelectedWorkHeader() {
  const shouldReduceMotion = useReducedMotion();
  const trans = shouldReduceMotion ? { duration: 0 } : transitions.normal;

  return (
    <section className="bg-white py-16 dark:bg-neutral-950 md:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={trans}
          className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-4xl"
        >
          Selected Work
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ ...trans, delay: shouldReduceMotion ? 0 : 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 dark:text-neutral-400"
        >
          Three industry verticals — each a complete, themed, production-ready site. Built with the
          same performance and accessibility standards, but designed around how that industry
          actually converts.
        </motion.p>
      </div>
    </section>
  );
}
