import { notFound } from 'next/navigation'
import type { Theme } from '@jaostudio/engine/theme'
import { industries } from '../../industry'
import { resolveIndustry } from '../../industry/resolver'
import { getSiteComponent } from '../../sites'
import { ThemeBridge } from '../../components/theme/ThemeBridge'

export function generateStaticParams() {
  return Object.keys(industries).map((slug) => ({ vertical: slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ vertical: string }> }) {
  const resolved = await params
  const profile = industries[resolved.vertical]
  if (!profile) return {}
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://jao-demo-landing.vercel.app'
  return {
    title: `${profile.company.name} | ${profile.company.tagline}`,
    description: profile.company.description,
    openGraph: {
      title: `${profile.company.name} | ${profile.company.tagline}`,
      description: profile.company.description,
      images: [`/og/${resolved.vertical}.svg`],
    },
    alternates: {
      canonical: `${baseUrl}/${resolved.vertical}`,
    },
  }
}

function JsonLd({ profile }: { profile: { slug: string; company: { name: string; description: string; domain: string } } }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: profile.company.name,
    description: profile.company.description,
    url: `https://${profile.company.domain}`,
  };

  if (profile.slug === "brightsmile") {
    schema["@type"] = "MedicalOrganization";
  } else if (profile.slug === "harrison-cole") {
    schema["@type"] = "LegalService";
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function VerticalPage({ params }: { params: Promise<{ vertical: string }> }) {
  const resolved = await params
  const profile = industries[resolved.vertical]
  if (!profile) notFound()

  const composition = resolveIndustry(profile)
  const Site = getSiteComponent(resolved.vertical)

  return (
    <ThemeBridge theme={profile.theme as Theme}>
      <JsonLd profile={profile} />
      <Site composition={composition} />
    </ThemeBridge>
  )
}
