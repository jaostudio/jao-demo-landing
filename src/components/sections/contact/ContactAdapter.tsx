"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ContactData } from "@jaostudio/engine/types";
import { fadeUp, transitions } from "@/lib/motion-tokens";

type Props = {
  data: ContactData;
};

export function ContactAdapter({ data }: Props) {
  return (
    <section className="border-t border-neutral-200 bg-neutral-900 py-20 dark:border-neutral-800 dark:bg-neutral-950 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={transitions.normal}
          className="text-3xl font-semibold tracking-tight text-neutral-50"
        >
          {data.headline}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ ...transitions.normal, delay: 0.05 }}
          className="mt-4 text-lg text-neutral-400"
        >
          {data.subtitle}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ ...transitions.normal, delay: 0.1 }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          {data.email ? (
            <a
              href={`mailto:${data.email}`}
              className="inline-block rounded-xl bg-[var(--theme-primary)] px-6 py-3 font-medium text-white transition-all hover:brightness-110"
            >
              {data.cta}
            </a>
          ) : (
            <button className="rounded-xl bg-[var(--theme-primary)] px-6 py-3 font-medium text-white transition-all hover:brightness-110">
              {data.cta}
            </button>
          )}

          {data.phone && (
            <Link
              href={`tel:${data.phone}`}
              className="text-sm text-neutral-400 underline underline-offset-2 transition-colors hover:text-neutral-300"
            >
              {data.phone}
            </Link>
          )}
        </motion.div>

        {data.email && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ ...transitions.normal, delay: 0.15 }}
            className="mt-6 text-sm text-neutral-500"
          >
            {data.email}
          </motion.p>
        )}
      </div>
    </section>
  );
}
