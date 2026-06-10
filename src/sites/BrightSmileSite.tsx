"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { SiteComposition } from "@jaostudio/engine/types";
import { HeroMedical } from "../components/sections/hero/HeroMedical";
import { BeforeAfterSlider } from "../components/sections/gallery/BeforeAfterSlider";
import { TestimonialsAdapter } from "../components/sections/testimonials/TestimonialsAdapter";
import { FooterAdapter } from "../components/sections/footer/FooterAdapter";

const softReveal = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};
const softEase = [0.16, 1, 0.3, 1] as const;
const softTransition = { duration: 0.55, ease: softEase };

const treatmentGroups = [
  { title: "Preventive Care", items: ["Cleanings", "Exams", "Oral Health Assessments"] },
  { title: "Restorative Care", items: ["Crowns", "Bridges", "Dental Implants"] },
  { title: "Cosmetic Dentistry", items: ["Whitening", "Veneers", "Smile Design"] },
  { title: "Orthodontics", items: ["Invisalign Clear Aligners"] },
  { title: "Periodontal Health", items: ["Scaling & Root Planing", "Laser Therapy"] },
  { title: "Emergency Dentistry", items: ["Same-Day Emergency Care"] },
];

type Props = {
  composition: SiteComposition;
};

const serviceOptions = [
  "Preventive Care / Cleaning",
  "Restorative / Fillings",
  "Cosmetic Dentistry",
  "Orthodontics",
  "Periodontal Treatment",
  "Emergency Care",
  "Other",
];

function DentalContactForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Required";
    if (!email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email";
    if (!message.trim()) errs.message = "Required";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    const payload = {
      name: name.trim(), email: email.trim(), phone: phone.trim(),
      serviceInterest: service, message: message.trim(),
      source: "brightsmile", vertical: "dental",
      timestamp: new Date().toISOString(),
    };
    console.log("[BrightSmile Appointment]", payload);
    setTimeout(() => { setSubmitting(false); onSuccess(); }, 400);
  };

  const inputClass = "w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-[var(--theme-primary)] focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]/40 dark:border-neutral-500 dark:bg-neutral-800 dark:text-neutral-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Name <span className="text-[var(--theme-primary)]">*</span></label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputClass} />
          {errors.name && <p className="mt-1 text-xs text-[var(--theme-primary)]">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Email <span className="text-[var(--theme-primary)]">*</span></label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputClass} />
          {errors.email && <p className="mt-1 text-xs text-[var(--theme-primary)]">{errors.email}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Service Interest</label>
          <select value={service} onChange={(e) => setService(e.target.value)} className={inputClass}>
            <option value="">Select a service</option>
            {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Message <span className="text-[var(--theme-primary)]">*</span></label>
        <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass + " resize-y"} />
        {errors.message && <p className="mt-1 text-xs text-[var(--theme-primary)]">{errors.message}</p>}
      </div>
      <button type="submit" disabled={submitting} className="w-full rounded-xl bg-[var(--theme-primary)] px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60">
        {submitting ? "Booking..." : "Book Online"}
      </button>
    </form>
  );
}

export function BrightSmileSite({ composition }: Props) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main>
      <HeroMedical data={composition.hero} image={composition.assets.hero} stats={composition.heroStats} />

      <section id="services" className="border-t border-slate-100 bg-white py-24 dark:border-neutral-900 dark:bg-neutral-950 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <span className="mb-2 block text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--theme-primary)]">
            01 · Care
          </span>
          <motion.h2 variants={softReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={softTransition} className="text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Featured Treatments
          </motion.h2>
          <div className="mt-12 grid gap-10 md:grid-cols-5 md:gap-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ staggerChildren: 0.09 }} className="md:col-span-3 space-y-10">
              {treatmentGroups.slice(0, 3).map((group) => (
                <motion.div key={group.title} variants={softReveal} transition={softTransition}>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{group.title}</h3>
                  <ul className="mt-2 space-y-1">
                    {group.items.map((item) => (
                      <li key={item} className="text-sm text-neutral-600 dark:text-neutral-400">{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ staggerChildren: 0.09, delayChildren: 0.27 }} className="md:col-span-2 space-y-10">
              {treatmentGroups.slice(3).map((group) => (
                <motion.div key={group.title} variants={softReveal} transition={softTransition}>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{group.title}</h3>
                  <ul className="mt-2 space-y-1">
                    {group.items.map((item) => (
                      <li key={item} className="text-sm text-neutral-600 dark:text-neutral-400">{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="results" className="border-t border-slate-100 bg-neutral-50 py-16 dark:border-neutral-900 dark:bg-neutral-900 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <span className="mb-2 block text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--theme-primary)]">
            02 · Results
          </span>
          <motion.h2 variants={softReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={softTransition} className="text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            {composition.caseStudies?.headline || "Patient Outcomes"}
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ staggerChildren: 0.09 }} className="mt-12 space-y-10">
            {(composition.caseStudies?.studies ?? []).map((study, i) =>
              i === 0 ? (
                <motion.div key={study.title} variants={softReveal} transition={softTransition} className="overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                  {study.image && (
                    <div className="aspect-[5/2] w-full bg-neutral-100 dark:bg-neutral-800">
                      <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${study.image})` }} />
                    </div>
                  )}
                    <div className="p-8">
                    <span className="inline-block rounded-full bg-[var(--theme-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--theme-primary)] dark:bg-[var(--theme-primary)]/20 dark:text-[var(--theme-primary)]">{study.title}</span>
                    <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">{study.outcome}</p>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400 dark:text-neutral-500">{study.challenge}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key={study.title} variants={softReveal} transition={softTransition} className="ml-auto w-full overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-neutral-700 dark:bg-neutral-800 md:w-2/5">
                  {study.image && (
                    <div className="aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-800">
                      <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${study.image})` }} />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="inline-block rounded-full bg-[var(--theme-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--theme-primary)] dark:bg-[var(--theme-primary)]/20 dark:text-[var(--theme-primary)]">{study.title}</span>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{study.outcome}</p>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">{study.challenge}</p>
                  </div>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </section>

      <BeforeAfterSlider />

      {/* Insurance & Payment — inline for BrightSmile */}
      <section id="insurance" className="border-t border-slate-100 bg-white py-12 dark:border-neutral-900 dark:bg-neutral-900 md:py-16">
        <div className="mx-auto max-w-2xl px-6">
          <span className="mb-2 block text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--theme-primary)]">
            03 · Coverage
          </span>
          <motion.h2 variants={softReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={softTransition} className="text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Accepted Insurance Plans
          </motion.h2>
          <motion.p variants={softReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ ...softTransition, delay: 0.05 }} className="mt-4 text-center text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            We accept most major PPO insurance plans. Our team verifies your benefits before your first visit so you know exactly what&apos;s covered.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ staggerChildren: 0.09 }} className="mt-10 space-y-4">
            {[
              { name: "Delta Dental", network: "Premier, PPO+, Managed Fee-For-Service" },
              { name: "Cigna", network: "PPO, Dental Health Plus" },
              { name: "MetLife", network: "PPO, PDP Plus" },
              { name: "Aetna", network: "PPO, Vital Savings" },
            ].map((plan) => (
              <motion.div key={plan.name} variants={softReveal} transition={softTransition} className="flex items-baseline justify-between border-b border-slate-100 pb-3 dark:border-neutral-800">
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{plan.name}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{plan.network}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.p variants={softReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ ...softTransition, delay: 0.15 }} className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-neutral-500 dark:border-slate-700 dark:text-neutral-400">
            Out-of-network support available &middot; Interest-free financing available
          </motion.p>
        </div>
      </section>

      <section className="bg-neutral-50 py-20 dark:bg-neutral-900 md:py-28">
        {composition.testimonials && <TestimonialsAdapter data={composition.testimonials} />}
      </section>

      {/* Contact — inline appointment booking form */}
      <section id="contact" className="border-t border-neutral-200 bg-white py-24 dark:border-neutral-900 dark:bg-neutral-950 md:py-32">
        <div className="mx-auto max-w-2xl px-6">
          {!submitted && (
            <>
              <span className="mb-2 block text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--theme-primary)]/60">
                05 · Booking
              </span>
              <motion.h2 variants={softReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={softTransition} className="text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                {composition.contact.headline}
              </motion.h2>
              <motion.p variants={softReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ ...softTransition, delay: 0.05 }} className="mt-4 text-center text-lg text-neutral-600 dark:text-neutral-400">
                {composition.contact.subtitle}
              </motion.p>
              <div className="mx-auto mt-10 max-w-xl">
                <DentalContactForm onSuccess={() => setSubmitted(true)} />
                <div className="mt-6 text-center">
                  {composition.contact.email && <p className="text-sm text-neutral-500">{composition.contact.email}</p>}
                  {composition.contact.phone && <p className="text-sm text-neutral-500">{composition.contact.phone}</p>}
                </div>
              </div>
            </>
          )}
          {submitted && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Appointment Requested</h2>
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">We&apos;ll confirm your appointment within 24 hours. You can also reach us directly.</p>
              <div className="mt-8 space-y-1 text-sm text-neutral-500">
                {composition.contact.email && <p>{composition.contact.email}</p>}
                {composition.contact.phone && <p>{composition.contact.phone}</p>}
              </div>
              <button onClick={() => setSubmitted(false)} className="mt-8 rounded-xl bg-[var(--theme-primary)] px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110">
                Book Another Appointment
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <FooterAdapter
        name="BrightSmile Dental Studio"
        email={composition.contact.email}
        phone={composition.contact.phone}
      />
    </main>
  );
}
