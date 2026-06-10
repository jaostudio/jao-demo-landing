"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { transitions } from "@/lib/motion-tokens";

export function ContactSection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const shouldReduceMotion = useReducedMotion();
  const trans = shouldReduceMotion ? { duration: 0 } : transitions.normal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:hello@jaostudio.com?subject=Portfolio Inquiry&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
  };

  return (
    <section className="border-t border-neutral-200 bg-white py-20 dark:border-neutral-800 dark:bg-neutral-950 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={trans}
          className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
        >
          Let&apos;s build something together.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...trans, delay: shouldReduceMotion ? 0 : 0.05 }}
          className="mt-4 text-lg text-neutral-600 dark:text-neutral-400"
        >
          Have a project in mind? Reach out and let us discuss what your business needs.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...trans, delay: shouldReduceMotion ? 0 : 0.1 }}
          className="mt-8"
        >
          <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 text-left">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Email
              </span>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Your email"
                autoComplete="email"
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-[var(--theme-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/40 dark:border-neutral-500 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Message
              </span>
              <textarea
                placeholder="Tell us about your project"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                aria-label="Your message"
                autoComplete="off"
                className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-[var(--theme-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/40 dark:border-neutral-500 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--theme-primary-600)] px-8 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              Send message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
