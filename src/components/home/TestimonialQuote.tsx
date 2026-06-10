"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, transitions } from "@/lib/motion-tokens";

export function TestimonialQuote() {
  const shouldReduceMotion = useReducedMotion();
  const trans = shouldReduceMotion ? { duration: 0 } : transitions.normal;

  return (
    <section className="bg-white py-16 dark:bg-neutral-950 md:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={trans}
          className="text-xl italic leading-relaxed text-neutral-700 dark:text-neutral-300 md:text-2xl"
        >
          &ldquo;The budget estimator on our new site has increased qualified leads by 40%. It&apos;s
          become our most valuable sales tool.&rdquo;
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ ...trans, delay: shouldReduceMotion ? 0 : 0.1 }}
          className="mt-6 font-semibold text-neutral-900 dark:text-neutral-50"
        >
          &mdash; Founder, Summit Ridge Construction
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ ...trans, delay: shouldReduceMotion ? 0 : 0.15 }}
          className="mt-1 text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-500"
        >
          Summit Ridge Launch · 2026
        </motion.p>
      </div>
    </section>
  );
}
