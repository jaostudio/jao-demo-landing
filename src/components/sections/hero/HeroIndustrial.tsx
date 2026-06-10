"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HeroData } from "@jaostudio/engine/types";
import { fadeUp, fadeUpBlur, transitions, durations, easing } from "@/lib/motion-tokens";

type Props = {
  data: HeroData;
  image: string;
  sectors?: string[];
  capabilities?: string[];
};

export function HeroIndustrial({ data, image, sectors, capabilities }: Props) {
  return (
    <>
      <link rel="preload" as="image" href={image} fetchPriority="high" />
      <section data-testid="hero" className="relative overflow-hidden bg-stone-50 py-16 dark:bg-slate-950 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        <div className="relative z-10">
          <motion.span
            data-testid="sector-label"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ ...transitions.fast, delay: 0.05 }}
            className="mb-4 block text-sm font-bold uppercase tracking-widest text-[var(--theme-primary)]"
          >
            Commercial Construction
          </motion.span>

          <motion.h1
            data-testid="hero-heading"
            variants={fadeUpBlur}
            initial="hidden"
            animate="visible"
            transition={transitions.hero}
            className="text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-5xl"
          >
            {data.title}
          </motion.h1>

          <motion.p
            data-testid="hero-subtitle"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ ...transitions.normal, delay: 0.1 }}
            className="mt-4 text-lg text-slate-700 dark:text-slate-300 md:text-xl"
          >
            {data.subtitle}
          </motion.p>

          {sectors && sectors.length > 0 && (
            <motion.div
              data-testid="sectors-strip"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ ...transitions.normal, delay: 0.15 }}
              className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              {sectors.map((s, i) => (
                <span key={s}>
                  {i > 0 && <span className="mx-1 text-slate-400 dark:text-slate-600">•</span>}
                  {s}
                </span>
              ))}
            </motion.div>
          )}

          {capabilities && capabilities.length > 0 && (
            <motion.div
              data-testid="capabilities-strip"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ ...transitions.normal, delay: 0.2 }}
              className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400"
            >
              {capabilities.map((c, i) => (
                <span key={c}>
                  {i > 0 && <span className="mr-1 text-slate-400 dark:text-slate-600">•</span>}
                  {c}
                </span>
              ))}
            </motion.div>
          )}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ ...transitions.normal, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              data-testid="hero-cta"
              href={data.cta.href}
              className="rounded-lg bg-[var(--theme-primary-600)] px-6 py-3 font-bold text-white transition-all hover:brightness-110 dark:bg-[var(--theme-primary)] dark:text-slate-950"
            >
              {data.cta.label}
            </Link>

            {data.secondaryCta && (
              <Link
                data-testid="hero-secondary-cta"
                href={data.secondaryCta.href}
                className="rounded-lg border border-slate-300 px-6 py-3 font-bold text-slate-700 transition-colors hover:border-slate-500 hover:text-slate-950 dark:border-slate-500 dark:text-slate-300 dark:hover:border-slate-400 dark:hover:text-slate-100"
              >
                {data.secondaryCta.label}
              </Link>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: durations.xl, ease: easing.out, delay: 0.15 }}
          className="relative aspect-[4/3] overflow-hidden rounded-lg md:aspect-[3/4]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 to-transparent dark:from-slate-950/60" />
        </motion.div>
      </div>
    </section>
    </>
  );
}
