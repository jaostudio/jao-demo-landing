"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIndustry } from "../industry/IndustryController";
import { ThemeToggle } from "./ThemeToggle";
import { transitions } from "@/lib/motion-tokens";

export function Navbar() {
  const { activeProfile } = useIndustry();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = !activeProfile;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all ${
          scrolled
            ? "border-b border-neutral-200/50 bg-white/80 backdrop-blur-md dark:border-neutral-800/50 dark:bg-neutral-950/80"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Brand */}
          <Link
            href="/"
            className="text-sm font-semibold text-neutral-900 dark:text-neutral-50"
          >
            {isHome ? "jaostudio" : activeProfile.company.name}
          </Link>

          {/* Desktop: nav links + CTA + theme toggle */}
          <div className="hidden items-center gap-1 sm:flex">
            {!isHome && activeProfile.navigation.map((nav) => (
              <Link
                key={nav.href}
                href={nav.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                {nav.label}
              </Link>
            ))}
            {!isHome && (
              <Link
                href={activeProfile.company.cta.href}
                className="ml-2 rounded-xl bg-[var(--theme-primary)] px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110"
              >
                {activeProfile.company.cta.label}
              </Link>
            )}
            <div className="ml-1">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 sm:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.normal}
            className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-neutral-950"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm font-medium text-neutral-500">
                {isHome ? "Navigation" : activeProfile.company.name}
              </span>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center gap-6">
              {!isHome && activeProfile.navigation.map((nav) => (
                <Link
                  key={nav.href}
                  href={nav.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-semibold text-neutral-800 transition-colors hover:text-neutral-500 dark:text-neutral-200"
                >
                  {nav.label}
                </Link>
              ))}
              {!isHome && (
                <Link
                  href={activeProfile.company.cta.href}
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 rounded-xl bg-[var(--theme-primary)] px-6 py-3 text-lg font-medium text-white transition-all hover:brightness-110"
                >
                  {activeProfile.company.cta.label}
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
