"use client";

import { motion } from "framer-motion";
import type { ServiceData } from "@jaostudio/engine/types";
import { ServiceCard } from "./ServiceCard";
import { fadeUp, transitions, staggers } from "@/lib/motion-tokens";

type Props = {
  data: ServiceData;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggers.normal },
  },
};

export function ServicesAdapter({ data }: Props) {
  return (
    <section className="py-20 md:py-28">
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
          {data.items.map((item) => (
            <ServiceCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
