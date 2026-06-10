"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HeroData } from "@jaostudio/engine/types";
import { fadeUp, fadeUpBlur, transitions, durations, easing } from "@/lib/motion-tokens";

type Props = {
  data: HeroData;
  image: string;
  stats?: { value: string; label: string }[];
};

export function HeroMedical({ data, image, stats }: Props) {
  return (
    <>
      <link rel="preload" as="image" href={image} fetchPriority="high" />
      <section data-testid="hero" className="relative overflow-hidden bg-gradient-to-b from-white to-neutral-50 py-20 dark:from-neutral-950 dark:to-neutral-900 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        <div className="relative z-10">
          <motion.h1
            data-testid="hero-heading"
            variants={fadeUpBlur}
            initial="hidden"
            animate="visible"
            transition={transitions.hero}
            className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-5xl"
          >
            {data.title}
          </motion.h1>

          <motion.p
            data-testid="hero-subtitle"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ ...transitions.normal, delay: 0.1 }}
            className="mt-6 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400"
          >
            {data.subtitle}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ ...transitions.normal, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              data-testid="hero-cta"
              href={data.cta.href}
              className="rounded-xl bg-[var(--theme-primary)] px-6 py-3 font-medium text-white shadow-lg shadow-[var(--theme-primary)]/25 transition-all hover:brightness-110"
            >
              {data.cta.label}
            </Link>

            {data.secondaryCta && (
              <Link
                href={data.secondaryCta.href}
                className="rounded-xl border border-neutral-300 px-6 py-3 font-medium text-neutral-700 transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600"
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
          className="relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-square"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/30 to-transparent" />
        </motion.div>
      </div>

      {stats && stats.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: durations.slow, ease: easing.out, delay: 0.35 }}
          className="mx-auto mt-16 max-w-6xl px-6"
        >
          <div className="grid grid-cols-2 gap-6 rounded-2xl border border-neutral-200 bg-white/5 p-8 backdrop-blur-sm md:grid-cols-4 md:gap-8 dark:border-neutral-800">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-[var(--theme-primary)] md:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
    </>
  );
}
