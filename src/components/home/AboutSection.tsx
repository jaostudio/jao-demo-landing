"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Zap, Target, Search } from "lucide-react";
import { transitions, staggers } from "@/lib/motion-tokens";

const principles = [
  {
    icon: Zap,
    title: "Fast by default",
    desc: "Every page targets 90+ Lighthouse scores. Static generation, optimized images, minimal JavaScript — performance is not an afterthought.",
  },
  {
    icon: Target,
    title: "Built for conversion",
    desc: "Section order, CTA placement, and trust signals follow industry-specific buying psychology — not a generic template.",
  },
  {
    icon: Search,
    title: "SEO without plugins",
    desc: "Unique meta tags, structured data, semantic HTML, and canonical URLs. No WordPress plugins needed.",
  },
];

export function AboutSection() {
  const shouldReduceMotion = useReducedMotion();
  const trans = shouldReduceMotion ? { duration: 0 } : transitions.normal;

  return (
    <section className="bg-white py-20 dark:bg-neutral-950 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={trans}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            How We Build
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            Every site starts with the same question: what does this business need to convert? From
            there, we design the UX flow, choose the motion language, and build the interaction
            patterns unique to that industry.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: shouldReduceMotion ? 0 : staggers.slow,
              },
            },
          }}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <Icon className="h-8 w-8 text-neutral-700 dark:text-neutral-300" />
                <h3 className="mt-4 font-semibold text-neutral-900 dark:text-neutral-50">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {p.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
