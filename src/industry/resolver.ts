import type {
  IndustryProfile,
  SiteComposition,
  SectionType,
  HeroData,
  ProofData,
  ServiceData,
  TestimonialData,
  CaseStudyData,
  ProcessData,
  ContactData,
} from '@jaostudio/engine/types'

function assert<T>(value: unknown, msg: string): T {
  if (value === undefined || value === null) throw new Error(msg)
  return value as T
}

export function resolveIndustry(profile: IndustryProfile): SiteComposition {
  const get = (type: SectionType) =>
    profile.sections.find(s => s.type === type)?.data

  return {
    hero: assert<HeroData>(get('hero'), `[${profile.slug}] Missing hero section`),
    proof: assert<ProofData>(get('proof'), `[${profile.slug}] Missing proof section`),
    services: assert<ServiceData>(get('services'), `[${profile.slug}] Missing services section`),
    testimonials: get('testimonials') as TestimonialData | undefined,
    caseStudies: get('case-studies') as CaseStudyData | undefined,
    process: assert<ProcessData>(get('process'), `[${profile.slug}] Missing process section`),
    contact: assert<ContactData>(get('contact'), `[${profile.slug}] Missing contact section`),
    heroStats: profile.company.heroStats,
    assets: {
      hero: profile.imagery.hero,
      gallery: profile.imagery.gallery,
    },
  }
}
