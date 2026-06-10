"use client";

import { motion } from "framer-motion";
import type { IconKey } from "@jaostudio/engine/types";
import { ICON_MAP } from "@/lib/icon-map";

type Props = {
  title: string;
  description: string;
  icon?: IconKey;
};

export function ServiceCard({ title, description, icon }: Props) {
  const IconComponent = icon ? ICON_MAP[icon] : null;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div
        className="mb-4 inline-flex rounded-xl p-3"
        style={{
          backgroundColor: `color-mix(in srgb, var(--theme-primary) 10%, transparent)`,
        }}
      >
        {IconComponent && (
          <IconComponent
            className="h-5 w-5"
            style={{ color: "var(--theme-primary)" }}
          />
        )}
      </div>

      <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
    </motion.div>
  );
}
