"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import type { SiteComposition } from "@jaostudio/engine/types";
import { HeroLegal } from "../components/sections/hero/HeroLegal";
import { ServicesAdapter } from "../components/sections/services/ServicesAdapter";
import { CaseTicker } from "../components/sections/ticker/CaseTicker";
import { TestimonialsAdapter } from "../components/sections/testimonials/TestimonialsAdapter";
import { FooterAdapter } from "../components/sections/footer/FooterAdapter";

const fadeOnly = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
const fadeEase = [0.25, 0.46, 0.45, 0.94] as const;
const fadeTransition = { duration: 0.45, ease: fadeEase };

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  composition: SiteComposition;
};

const practiceAreaOptions = [
  "Business Litigation",
  "Family Law",
  "Criminal Defense",
  "Estate Planning",
  "Real Estate Law",
  "Personal Injury",
  "Other",
];

function LegalContactForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Required";
    if (!email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email";
    if (!caseDescription.trim()) errs.caseDescription = "Required";
    return errs;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    const payload = {
      name: name.trim(), email: email.trim(), phone: phone.trim(),
      practiceArea, caseDescription: caseDescription.trim(),
      files: files.map((f) => f.name),
      source: "harrison-cole", vertical: "legal",
      timestamp: new Date().toISOString(),
    };
    console.log("[Harrison & Cole Consultation]", payload);
    setTimeout(() => { setSubmitting(false); onSuccess(); }, 400);
  };

  const inputClass = "w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-[var(--theme-primary)] focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]/40 dark:border-neutral-500 dark:bg-neutral-800 dark:text-neutral-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Name <span className="text-[var(--theme-primary)]">*</span></label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputClass} />
              {errors.name && <p className="mt-1 text-xs text-[var(--theme-primary)]">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Email <span className="text-[var(--theme-primary)]">*</span></label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputClass} />
              {errors.email && <p className="mt-1 text-xs text-[var(--theme-primary)]">{errors.email}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Practice Area</label>
          <select value={practiceArea} onChange={(e) => setPracticeArea(e.target.value)} className={inputClass}>
            <option value="">Select area of law</option>
            {practiceAreaOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>
      <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Case Description <span className="text-[var(--theme-primary)]">*</span></label>
        <textarea rows={4} value={caseDescription} onChange={(e) => setCaseDescription(e.target.value)} className={inputClass + " resize-y"} placeholder="Briefly describe your legal matter..." />
          {errors.caseDescription && <p className="mt-1 text-xs text-[var(--theme-primary)]">{errors.caseDescription}</p>}
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Supporting Documents</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-dashed border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-500 transition-colors hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-[var(--theme-primary)] dark:hover:text-[var(--theme-primary)]"
          >
            + Attach Files
          </button>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">PDF, DOC, JPG up to 10MB</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
        {files.length > 0 && (
          <ul className="mt-3 space-y-1">
            {files.map((file, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <svg className="h-3.5 w-3.5 shrink-0 text-[var(--theme-primary)]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 10v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2M12 6l-4-4-4 4M8 2v9" />
                </svg>
                <span className="truncate">{file.name}</span>
                <span className="text-neutral-300 dark:text-neutral-600">({(file.size / 1024).toFixed(0)} KB)</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="ml-auto text-neutral-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="submit" disabled={submitting} className="w-full rounded-xl bg-[var(--theme-primary-600)] px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-60">
        {submitting ? "Submitting..." : "Free Case Evaluation"}
      </button>
    </form>
  );
}

export function HarrisonColeSite({ composition }: Props) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main>
      <HeroLegal
        data={composition.hero}
        image={composition.assets.hero}
        stats={composition.heroStats}
        playfairClassName={playfair.className}
      />

      <section id="practice-areas">
        <ServicesAdapter data={composition.services} />
      </section>

      <section id="results" className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-900 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
              <motion.h2 variants={fadeOnly} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeTransition} className={`text-center text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 ${playfair.className}`}>
                {composition.caseStudies?.headline || "Notable Case Results"}
              </motion.h2>
              <div className="mt-16 space-y-16">
                {(composition.caseStudies?.studies ?? []).map((study, i) => (
                  <motion.div
                    key={study.title}
                    variants={fadeOnly}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ ...fadeTransition, delay: 0.1 }}
                    className={i > 0 ? "border-t border-slate-200 pt-16 dark:border-slate-700" : ""}
                  >
                    <h3 className={`text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 ${playfair.className}`}>
                  {study.title}
                </h3>
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Context</h4>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Approach</h4>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{study.solution}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--theme-accent)]">Outcome</h4>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-neutral-900 dark:text-neutral-100">{study.outcome}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CaseTicker />

      {/* Attorney Profiles — inline for Harrison & Cole */}
      <section id="attorneys" className="bg-neutral-50 py-16 dark:bg-neutral-900 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className={`text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 ${playfair.className}`}>
              Our Attorneys
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              Seasoned advocates with decades of combined experience across state and federal courts.
            </p>
          </div>
          <div className="mt-12 space-y-8">
            {[
              {
                name: "Robert Harrison",
                credentials: "Partner — 30+ Years | Former Federal Prosecutor",
                bio: "Harvard Law graduate with extensive trial experience in complex civil litigation and white-collar criminal defense. Recognized in Super Lawyers since 2012.",
              },
              {
                name: "Sarah Cole",
                credentials: "Partner — 20+ Years | Certified Family Law Specialist",
                bio: "Dedicated to family law and estate planning. Known for compassionate client advocacy and meticulous case preparation. Featured in Best Lawyers in America.",
              },
              {
                name: "Michael Torres",
                credentials: "Senior Associate — 12 Years | Business Litigation",
                bio: "Focuses on business disputes, contract litigation, and real estate law. Former in-house counsel for a Fortune 500 company.",
              },
              {
                name: "Emily Chen",
                credentials: "Associate — 8 Years | Criminal Defense & Personal Injury",
                bio: "Aggressive advocate for clients in criminal defense and personal injury matters. Fluent in Mandarin and Spanish.",
              },
            ].map((attorney) => (
                <div key={attorney.name} className="flex gap-5 border-l-2 border-[var(--theme-primary)] pl-5 dark:border-[var(--theme-primary)]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <span className="text-base font-bold text-[var(--theme-primary)]">
                    {attorney.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold text-neutral-900 dark:text-neutral-50 ${playfair.className}`}>
                    {attorney.name}
                  </h3>
                  <p className="text-sm font-medium text-[var(--theme-accent)]">{attorney.credentials}</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{attorney.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {composition.testimonials && <TestimonialsAdapter data={composition.testimonials} />}

      {/* Contact — inline consultation intake form */}
      <section id="contact" className="border-t border-neutral-200 bg-white py-16 dark:border-neutral-800 dark:bg-neutral-950 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          {!submitted && (
            <>
              <motion.h2 variants={fadeOnly} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeTransition} className={`text-center text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 ${playfair.className}`}>
                {composition.contact.headline}
              </motion.h2>
              <motion.p variants={fadeOnly} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ ...fadeTransition, delay: 0.1 }} className="mt-4 text-center text-lg text-neutral-600 dark:text-neutral-400">
                {composition.contact.subtitle}
              </motion.p>
              <div className="mt-12 grid gap-10 md:grid-cols-5 md:gap-16">
                <div className="md:col-span-2">
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Initial consultations are confidential. Provide a summary of your matter and the appropriate attorney will respond.
                  </p>
                  <div className="mt-6 space-y-1 text-sm text-neutral-500">
                    {composition.contact.email && <p>{composition.contact.email}</p>}
                    {composition.contact.phone && <p>{composition.contact.phone}</p>}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <LegalContactForm onSuccess={() => setSubmitted(true)} />
                </div>
              </div>
            </>
          )}
          {submitted && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Consultation Requested</h2>
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">An attorney will review your case and contact you within one business day. All consultations are confidential.</p>
              <div className="mt-8 space-y-1 text-sm text-neutral-500">
                {composition.contact.email && <p>{composition.contact.email}</p>}
                {composition.contact.phone && <p>{composition.contact.phone}</p>}
              </div>
                <button onClick={() => setSubmitted(false)} className="mt-8 rounded-xl bg-[var(--theme-primary-600)] px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110">
                Submit Another Case
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <FooterAdapter
        name="Harrison & Cole"
        email={composition.contact.email}
        phone={composition.contact.phone}
      />
    </main>
  );
}
