"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { IndustryProfile, ServiceData, CaseStudyData, HeroData } from "@jaostudio/engine/types";
import { resolveTheme } from "@jaostudio/engine/theme";
import { fadeUp, transitions } from "@/lib/motion-tokens";

type Props = {
  profile: IndustryProfile;
  tone?: "default" | "elevated";
};

function getServices(profile: IndustryProfile): { title: string }[] {
  const section = profile.sections.find((s) => s.type === "services")?.data as
    | ServiceData
    | undefined;
  if (!section) return [];
  return section.items.slice(0, 3);
}

function getStats(profile: IndustryProfile): { title: string }[] {
  const section = profile.sections.find((s) => s.type === "case-studies")?.data as
    | CaseStudyData
    | undefined;
  if (!section) return [];
  return section.studies.slice(0, 2);
}

function getSubtitle(profile: IndustryProfile): string {
  const section = profile.sections.find((s) => s.type === "hero")?.data as
    | HeroData
    | undefined;
  return section?.subtitle ?? "";
}

export function VerticalShowcase({ profile, tone = "default" }: Props) {
  const t = resolveTheme(profile.theme);
  const style = {
    "--theme-primary": t.primary[500],
    "--theme-primary-600": t.primary[600],
  } as React.CSSProperties;

  const bullets = getServices(profile);
  const stats = getStats(profile);
  const subtitle = getSubtitle(profile);

  const shouldReduceMotion = useReducedMotion();
  const trans = shouldReduceMotion ? { duration: 0 } : transitions.slow;

  const sectionBg =
    tone === "elevated"
      ? "bg-neutral-50 dark:bg-neutral-950"
      : "bg-white dark:bg-neutral-900";

  return (
    <section
      id={profile.slug === "summit-ridge" ? "work" : undefined}
      style={style}
      className={`${sectionBg} py-20 md:py-24`}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        {/* Image (always left) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={trans}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800"
        >
          <Image
            src={profile.imagery.hero}
            alt={`${profile.company.name} preview`}
            width={1200}
            height={900}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </motion.div>

        {/* Content (always right) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...trans, delay: shouldReduceMotion ? 0 : 0.1 }}
        >
          <span className="text-sm font-medium uppercase tracking-widest text-[var(--theme-primary)]">
            {profile.company.category}
          </span>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
            {profile.company.tagline}
          </h2>

          <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {subtitle}
          </p>

          {bullets.length > 0 && (
            <ul className="mt-6 space-y-2">
              {bullets.map((b) => (
                <li
                  key={b.title}
                  className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--theme-primary)]" />
                  {b.title}
                </li>
              ))}
            </ul>
          )}

          {stats.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-neutral-200 pt-4 text-xs uppercase tracking-widest text-neutral-500 dark:border-neutral-800 dark:text-neutral-500">
              {stats.map((s) => (
                <span key={s.title}>{s.title}</span>
              ))}
            </div>
          )}

          <Link
            href={`/${profile.slug}`}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--theme-primary-600)] px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 dark:bg-[var(--theme-primary)]"
          >
            View Project
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
