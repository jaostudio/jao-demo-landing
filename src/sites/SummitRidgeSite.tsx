"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { SiteComposition } from "@jaostudio/engine/types";
import { HeroIndustrial } from "../components/sections/hero/HeroIndustrial";
import { BudgetEstimator } from "../components/sections/estimator/BudgetEstimator";
import { TestimonialsAdapter } from "../components/sections/testimonials/TestimonialsAdapter";
import { FooterAdapter } from "../components/sections/footer/FooterAdapter";
import { fadeUp } from "@/lib/motion-tokens";

const mechEase = [0.34, 1.56, 0.64, 1] as const;
const mechTransition = { duration: 0.35, ease: mechEase };
const mechStagger = 0.06;

type Props = {
  composition: SiteComposition;
};

const sectors = [
  "Commercial",
  "Industrial",
  "Healthcare",
  "Education",
  "Mixed-Use",
];

const capabilities = [
  "Design Coordination",
  "Preconstruction Planning",
  "Construction Management",
  "General Contracting",
];

const capabilityGroups = [
  {
    title: "Commercial Facilities",
    items: ["Office Buildings", "Corporate Headquarters", "Business Parks"],
  },
  {
    title: "Industrial Facilities",
    items: ["Warehouses", "Distribution Centers", "Manufacturing Spaces"],
  },
  {
    title: "Specialty Services",
    items: ["Interior Fit-Outs", "Construction Management", "Site Development", "Preconstruction Planning"],
  },
];

const safetyItems = [
  { title: "Safety Planning", desc: "Project-specific programs developed before ground breaking." },
  { title: "Site Coordination", desc: "Daily trade coordination to maintain safe working conditions." },
  { title: "Documentation Systems", desc: "Complete safety records, tracking, and compliance reporting." },
  { title: "Quality Assurance", desc: "Systematic inspections at every phase to verify specifications." },
];

export function SummitRidgeSite({ composition }: Props) {
  const studies = composition.caseStudies?.studies ?? [];
  const [submitted, setSubmitted] = useState(false);

  return (
    <main>
      <HeroIndustrial
        data={composition.hero}
        image={composition.assets.hero}
        sectors={sectors}
        capabilities={capabilities}
      />

      {/* Featured Work — inline for Summit Ridge */}
      <section data-testid="work-section" id="work" className="bg-white py-20 dark:bg-slate-950 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={mechTransition}
            className="mb-16 text-center text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50"
          >
            Featured Work
          </motion.h2>

          <div className="space-y-20">
            {studies.map((study, i) => {
              const imageLeft = i % 2 === 1;
              return (
                <motion.div
                  key={study.title}
                  data-testid={`work-project-${i}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...mechTransition, delay: i * mechStagger }}
                  className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${
                    i > 0 ? "border-t border-slate-300 pt-16 dark:border-slate-700" : ""
                  }`}
                >
                  {imageLeft ? (
                    <>
                      <div className="order-2 md:order-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">
                          Featured Project
                        </span>
                        <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                          {study.title}
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {study.challenge}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {study.solution}
                        </p>
                        <p className="mt-3 text-sm font-bold text-[var(--theme-primary)]">
                          {study.outcome}
                        </p>
                      </div>
                      <div className="order-1 md:order-2">
                        <div
                          className="aspect-[4/3] w-full rounded-lg bg-cover bg-center"
                          style={{ backgroundImage: `url(${study.image})` }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div
                          className="aspect-[4/3] w-full rounded-lg bg-cover bg-center"
                          style={{ backgroundImage: `url(${study.image})` }}
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">
                          Featured Project
                        </span>
                        <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                          {study.title}
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {study.challenge}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {study.solution}
                        </p>
                        <p className="mt-3 text-sm font-bold text-[var(--theme-primary)]">
                          {study.outcome}
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Build — inline capability matrix for Summit Ridge */}
      <section data-testid="services-section" id="services" className="border-t border-slate-300 bg-stone-50 py-20 dark:border-slate-700 dark:bg-slate-950 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={mechTransition}
            className="mb-16 text-center text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50"
          >
            What We Build
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: mechStagger }}
            className="grid gap-12 md:grid-cols-3 md:gap-16"
          >
            {capabilityGroups.map((group) => (
              <motion.div
                key={group.title}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-center"
              >
                <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50">
                  {group.title}
                </h3>
                <ul className="mt-3 space-y-1">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-slate-700 dark:text-slate-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <BudgetEstimator />

      {composition.testimonials && (
        <section className="border-t border-slate-300 py-20 dark:border-slate-800 md:py-28">
          <TestimonialsAdapter data={composition.testimonials} />
        </section>
      )}

      {/* Safety & Compliance — theme-aware like other sections */}
      <section data-testid="safety-section" id="safety" className="bg-white py-20 dark:bg-slate-950 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              Safety &amp; Compliance
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              Every Summit Ridge project operates under documented planning,
              coordination, reporting, and quality-control procedures throughout delivery.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-4">
            {safetyItems.map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-lg font-bold text-slate-950 dark:text-slate-50">{item.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.desc}</div>
              </div>
            ))}
          </div>
          <p data-testid="disclosure" className="mx-auto mt-16 max-w-2xl text-center text-xs text-slate-500 dark:text-slate-400">
            Portfolio project created by JAO Studio. Projects, testimonials, and business data
            shown are fictional and provided for illustration purposes.
          </p>
        </div>
      </section>

      {/* Contact — lead intake form for Summit Ridge */}
      <section data-testid="contact-section" id="contact" className="border-t border-slate-300 bg-stone-100 py-20 dark:border-slate-800 dark:bg-slate-950 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={mechTransition}
            className="text-center text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50"
          >
            {composition.contact.headline}
          </motion.h2>
          {!submitted && (
            <div className="mt-12 grid gap-10 md:grid-cols-5 md:gap-16">
              {/* Left — context panel */}
              <div className="md:col-span-2">
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  Tell us about your facility, expansion, renovation, or development plans.
                  Include project scope, estimated timeline, and budget range.
                </p>
                <div className="mt-8 border-l-2 border-slate-300 pl-4 dark:border-slate-700">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">Email Direct</p>
                  <a
                    data-testid="contact-cta"
                    href={`mailto:${composition.contact.email}`}
                    className="mt-1 block text-sm text-slate-700 underline-offset-2 hover:underline dark:text-slate-300"
                  >
                    {composition.contact.email}
                  </a>
                </div>
              </div>
              {/* Right — form panel */}
              <div className="md:col-span-3">
                <ContactForm onSuccess={() => setSubmitted(true)} />
              </div>
            </div>
          )}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-12 max-w-xl text-center"
            >
              <div className="text-lg font-bold text-slate-950 dark:text-slate-50">Inquiry Submitted</div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                Your project inquiry has been received. A Summit Ridge representative will respond
                within 1 business day.
              </p>
              <div className="mt-8 border-l-2 border-slate-300 pl-4 text-left dark:border-slate-700">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">Email Direct</p>
                <a
                  href={`mailto:${composition.contact.email}`}
                  className="mt-1 block text-sm text-slate-700 underline-offset-2 hover:underline dark:text-slate-300"
                >
                  {composition.contact.email}
                </a>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 rounded-lg bg-[var(--theme-primary-600)] px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110 dark:bg-[var(--theme-primary)] dark:text-slate-950"
              >
                Submit Another Inquiry
              </button>
            </motion.div>
          )}
          {composition.contact.email && (
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ ...mechTransition, delay: 0.15 }}
              className="mx-auto mt-16 max-w-xl text-center text-xs text-slate-500 dark:text-slate-400"
            >
              {composition.contact.email}
            </motion.p>
          )}
        </div>
      </section>

      <FooterAdapter
        name="Summit Ridge Construction"
        email={composition.contact.email}
        phone={composition.contact.phone}
      />
    </main>
  );
}

const projectTypes = [
  "Commercial Facility",
  "Industrial / Warehouse",
  "Interior Fit-Out",
  "Renovation",
  "Preconstruction Consultation",
  "Other",
];

function ContactForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Required";
    if (!email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email";
    if (!projectType) errs.projectType = "Select a project type";
    if (!message.trim()) errs.message = "Required";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    const payload = { name: name.trim(), company: company.trim(), email: email.trim(), phone: phone.trim(), projectType, message: message.trim(), source: "summit-ridge", vertical: "construction", timestamp: new Date().toISOString() };
    console.log("[Summit Ridge Intake]", payload);
    setTimeout(() => {
      setSubmitting(false);
      onSuccess();
    }, 400);
  };

  const inputClass = "w-full border border-slate-300 bg-transparent px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-[var(--theme-primary)] focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]/40 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">Name <span className="text-[var(--theme-primary)]">*</span></label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputClass} />
          {errors.name && <p className="mt-1 text-xs text-[var(--theme-primary)]">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">Company</label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" className={inputClass} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">Email <span className="text-[var(--theme-primary)]">*</span></label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputClass} />
          {errors.email && <p className="mt-1 text-xs text-[var(--theme-primary)]">{errors.email}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">Project Type <span className="text-[var(--theme-primary)]">*</span></label>
        <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className={inputClass}>
          <option value="">Select project type</option>
          {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
          {errors.projectType && <p className="mt-1 text-xs text-[var(--theme-primary)]">{errors.projectType}</p>}
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">Project Details <span className="text-[var(--theme-primary)]">*</span></label>
        <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass + " resize-y"} />
          {errors.message && <p className="mt-1 text-xs text-[var(--theme-primary)]">{errors.message}</p>}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[var(--theme-primary-600)] px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-60 dark:bg-[var(--theme-primary)] dark:text-slate-950"
      >
        {submitting ? "Submitting..." : "Submit Project Inquiry"}
      </button>
    </form>
  );
}
