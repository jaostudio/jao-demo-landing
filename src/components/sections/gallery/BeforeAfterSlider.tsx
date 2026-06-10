"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, transitions } from "@/lib/motion-tokens";

interface BeforeAfterImage {
  before: string;
  after: string;
  title: string;
  description: string;
}

interface Props {
  items?: BeforeAfterImage[];
}

const defaultItems: BeforeAfterImage[] = [
  {
    before: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80",
    after: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80",
    title: "Full Smile Makeover",
    description: "Composite veneers and teeth whitening for a complete smile transformation.",
  },
  {
    before: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&q=80",
    after: "https://images.unsplash.com/photo-1598257006452-50d1660e5c10?w=800&q=80",
    title: "Invisalign Alignment",
    description: "Clear aligner treatment correcting crowding and bite alignment over 14 months.",
  },
  {
    before: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80",
    after: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80",
    title: "Dental Implant Restoration",
    description: "Single-tooth implant with custom crown restoring function and aesthetics.",
  },
];

export function BeforeAfterSlider({ items = defaultItems }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const active = items[activeIndex];
  const shouldReduceMotion = useReducedMotion();
  const trans = shouldReduceMotion ? { duration: 0 } : transitions.normal;

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseDown = () => { isDragging.current = true; };
  const onMouseMove = (e: React.MouseEvent) => { if (isDragging.current) handleMove(e.clientX); };
  const onMouseUp = () => { isDragging.current = false; };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = 5;
    if (e.key === "ArrowLeft") {
      setSliderPos((prev) => Math.max(0, prev - step));
    } else if (e.key === "ArrowRight") {
      setSliderPos((prev) => Math.min(100, prev + step));
    }
  };

  return (
    <section className="border-t border-slate-100 bg-white py-20 dark:border-neutral-900 dark:bg-neutral-950 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={trans}
          className="text-center text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
        >
          Before & After
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ ...trans, delay: 0.05 }}
          className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
        >
          Real patient transformations at BrightSmile Dental.
        </motion.p>

        {/* Thumbnail selector */}
        <div className="mt-10 flex justify-center gap-3">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { setActiveIndex(i); setSliderPos(50); }}
              className={`rounded-lg border-2 px-4 py-2 text-xs font-semibold transition-all ${
                  i === activeIndex
                  ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:border-[var(--theme-primary)] dark:bg-[var(--theme-primary)]/20 dark:text-[var(--theme-primary)]"
                  : "border-slate-200 text-slate-600 hover:border-[var(--theme-primary)]/50 dark:border-neutral-700 dark:text-neutral-400"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div
          ref={containerRef}
          tabIndex={0}
          role="slider"
          aria-label="Before and after comparison"
          aria-valuenow={Math.round(sliderPos)}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchMove={onTouchMove}
          onKeyDown={handleKeyDown}
          className="relative mx-auto mt-8 aspect-[4/3] w-full max-w-3xl cursor-ew-resize overflow-hidden rounded-2xl border border-slate-200 select-none dark:border-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950"
        >
          {/* After image (full) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${active.after})` }}
          />
          {/* Before image (clipped) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${active.before})`,
              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            }}
          />
          {/* Divider handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-900/60 shadow-lg backdrop-blur-sm flex items-center justify-center">
              <svg className="h-4 w-4 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 3L5 8l6 5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="mx-auto mt-6 max-w-2xl text-center">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{active.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{active.description}</p>
        </div>
      </div>
    </section>
  );
}
