export const metadata = {
  title: "Privacy Policy — JAO Studio Portfolio",
  description: "Privacy policy for the JAO Studio portfolio demo. This is a portfolio showcase — no real user data is collected or stored.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 md:py-32">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
        Last updated: June 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert mt-10 space-y-6 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Overview</h2>
          <p className="mt-3">
            This is a portfolio project created by JAO Studio. The website showcases three
            fictional business websites (Summit Ridge Construction, BrightSmile Dental Studio,
            and Harrison &amp; Cole) and does not collect, store, or process real user data
            beyond standard web analytics provided by the hosting platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Contact Form Submissions</h2>
          <p className="mt-3">
            The contact forms on each vertical page and the homepage open your default email
            client with a pre-filled message. <strong>No form data is sent to or stored on
            any server.</strong> The mailto: link launches your email application locally;
            whether you choose to send the message is entirely your decision.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Analytics &amp; Hosting</h2>
          <p className="mt-3">
            This site is hosted on Vercel. Standard server logs (IP address, request path,
            user agent) are collected by Vercel for performance, security, and abuse
            detection. These logs are governed by Vercel&apos;s privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Third-Party Content</h2>
          <p className="mt-3">
            Hero and gallery imagery is sourced from Unsplash. When your browser loads
            these images, Unsplash may receive standard HTTP request information. Unsplash
            images are licensed under the Unsplash License, which permits free use.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Cookies &amp; Tracking</h2>
          <p className="mt-3">
            This site does not set any cookies and does not embed third-party tracking
            scripts. The only persistent client-side state is a localStorage entry that
            remembers your light/dark theme preference.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Contact</h2>
          <p className="mt-3">
            Questions about this portfolio? Reach out to{" "}
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
