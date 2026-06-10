"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HeroData } from "@jaostudio/engine/types";
import { fadeUpBlur, fadeUp, transitions } from "@/lib/motion-tokens";

type Props = {
  data: HeroData;
  image?: string;
};

export function HeroAdapter({ data, image }: Props) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {image && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-white/60 dark:bg-neutral-950/60" />
        </>
      )}
      <div className={`pointer-events-none absolute inset-0 ${image ? 'opacity-5' : 'opacity-10'}`}>
        <div className="absolute inset-0 bg-[var(--theme-primary)] blur-3xl" />
        <div className="absolute inset-0 bg-[var(--theme-accent)] blur-3xl mix-blend-multiply" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.h1
          variants={fadeUpBlur}
          initial="hidden"
          animate="visible"
          transition={transitions.hero}
          className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-6xl"
        >
          {data.title}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...transitions.normal, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300 md:text-xl"
        >
          {data.subtitle}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...transitions.normal, delay: 0.2 }}
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link
            href={data.cta.href}
            className="rounded-xl bg-[var(--theme-primary)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--theme-primary-600)]"
          >
            {data.cta.label}
          </Link>

          {data.secondaryCta && (
            <Link
              href={data.secondaryCta.href}
              className="rounded-xl border border-[var(--theme-accent)] px-6 py-3 font-medium text-[var(--theme-accent)] transition-colors hover:bg-[var(--theme-accent)] hover:text-white"
            >
              {data.secondaryCta.label}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
