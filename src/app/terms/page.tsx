export const metadata = {
  title: "Terms of Service — JAO Studio Portfolio",
  description: "Terms of service for the JAO Studio portfolio demo. This is a portfolio showcase — no commercial transactions occur on this site.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 md:py-32">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        Terms of Service
      </h1>
      <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
        Last updated: June 2026
      </p>

      <div className="mt-10 space-y-6 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Portfolio Project</h2>
          <p className="mt-3">
            This website is a portfolio project created by JAO Studio. It demonstrates
            three fictional business websites (Summit Ridge Construction, BrightSmile
            Dental Studio, and Harrison &amp; Cole) as examples of bespoke design and
            development work.
          </p>
          <p className="mt-3">
            <strong>No real businesses are represented.</strong> All company names,
            testimonials, project descriptions, statistics, attorney profiles, dental case
            studies, and construction project details are fictional and used for
            illustration purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">No Services Offered</h2>
          <p className="mt-3">
            Nothing on this website constitutes an offer to provide construction,
            dental, or legal services. Any form submissions or email links are
            demonstration only and do not create a client relationship of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Intellectual Property</h2>
          <p className="mt-3">
            The design, code, and content of this portfolio are owned by JAO Studio.
            Hero and gallery imagery is licensed from Unsplash under the Unsplash
            License. The Playfair Display and Inter fonts are licensed under the SIL
            Open Font License.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">No Warranty</h2>
          <p className="mt-3">
            This portfolio is provided &ldquo;as is&rdquo; without warranty of any kind.
            While every effort has been made to ensure accuracy, no guarantee is made
            regarding the fitness of any design pattern for any particular commercial
            purpose.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Limitation of Liability</h2>
          <p className="mt-3">
            JAO Studio is not liable for any damages arising from use of this website,
            including but not limited to reliance on fictional business information
            displayed on any of the three vertical pages.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Changes</h2>
          <p className="mt-3">
            These terms may be updated without notice. Continued use of the site
            constitutes acceptance of the current terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Contact</h2>
          <p className="mt-3">
            Questions? Reach out to{" "}
            <a
              href="mailto:hello@jaostudio.com"
              className="text-[var(--theme-primary-600)] underline-offset-2 hover:underline"
            >
              hello@jaostudio.com
            </a>
            .
          </p>
        </section>
      </div>

      <a
        href="/"
        className="mt-12 inline-block text-sm font-medium text-[var(--theme-primary-600)] underline-offset-2 hover:underline"
      >
        &larr; Back to portfolio
      </a>
    </main>
  );
}
