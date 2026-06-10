import type { IndustryProfile } from '@jaostudio/engine/types'

export const harrisonCole: IndustryProfile = {
  slug: 'harrison-cole',
  company: {
    name: 'Harrison & Cole',
    category: 'Law Firm',
    tagline: '$500M+ Recovered — Free Consultation',
    description:
      'Full-service law firm serving individuals and businesses with decades of combined experience across corporate, family, and criminal law.',
    cta: { label: 'Free Case Evaluation', href: '#contact' },
    heroStats: [
      { value: '$500M+', label: 'Recovered for Clients' },
      { value: '2,000+', label: 'Cases Won' },
      { value: '95%', label: 'Success Rate' },
      { value: '25+', label: 'Years Combined Experience' },
    ],
    personality: 'legal',
    domain: 'harrisoncolelaw.com',
  },
  theme: { primary: 'indigo', accent: 'amber' },
  imagery: {
    hero: '/industry-assets/harrison-cole/hero.jpg',
    thumbnail: '/industry-assets/harrison-cole/hero.jpg',
    gallery: [
      '/industry-assets/harrison-cole/gallery-1.jpg',
      '/industry-assets/harrison-cole/gallery-2.jpg',
    ],
  },
  switcher: {
    previewType: "photo",
  },
  navigation: [
    { label: 'Practice Areas', href: '#practice-areas' },
    { label: 'Case Results', href: '#results' },
    { label: 'Our Attorneys', href: '#attorneys' },
    { label: 'Contact', href: '#contact' },
  ],
  sections: [
    {
      type: 'hero',
      data: {
        title: 'Experienced Counsel. Proven Results.',
        subtitle:
          'A full-service law firm with $500M+ recovered for clients across corporate law, family law, and criminal defense.',
cta: { label: 'Free Case Evaluation', href: '#contact' },
        secondaryCta: { label: 'Practice Areas', href: '#practice-areas' },
      },
    },
    {
      type: 'proof',
      data: {
        headline: 'Track Record',
        items: [
          { value: '$500M+', label: 'Recovered for Clients' },
          { value: '2,000+', label: 'Cases Won' },
          { value: '95%', label: 'Success Rate' },
          { value: '25+', label: 'Years Experience' },
        ],
      },
    },
    {
      type: 'services',
      data: {
        headline: 'Practice Areas',
        items: [
          { title: 'Business Law', description: 'Entity formation, contracts, mergers, acquisitions, and corporate governance for businesses of all sizes.', icon: 'building' },
          { title: 'Family Law', description: 'Divorce, child custody, adoption, prenuptial agreements, and mediation services.', icon: 'users' },
          { title: 'Criminal Defense', description: 'Misdemeanor and felony defense, DUI, white-collar crime, and appeals.', icon: 'shield' },
          { title: 'Estate Planning', description: 'Wills, trusts, probate administration, power of attorney, and healthcare directives.', icon: 'file-text' },
          { title: 'Real Estate Law', description: 'Title review, closing, landlord-tenant disputes, zoning, and property litigation.', icon: 'home' },
          { title: 'Personal Injury', description: 'Auto accidents, medical malpractice, premises liability, and wrongful death claims.', icon: 'book-open' },
        ],
      },
    },
    {
      type: 'case-studies',
      data: {
        headline: 'Notable Case Results',
        studies: [
          {
            title: '$12.5M Settlement — Medical Malpractice',
            challenge:
              'Plaintiff suffered permanent nerve damage following a routine surgical procedure. Hospital denied liability and offered $500K pre-litigation.',
            solution:
              'Built a case around documented protocol violations, secured expert testimony from three independent surgeons, and deposed the attending physician.',
            outcome:
              'Confidential settlement reached during mediation for $12.5M — the largest medical malpractice settlement in the county that year.',
            image: '/industry-assets/harrison-cole/hero.jpg',
          },
          {
            title: '$4.2M Verdict — Business Contract Dispute',
            challenge:
              'A manufacturer was locked in a breach of contract dispute with a key supplier, threatening a production shutdown affecting 200+ employees.',
            solution:
              'Filed an emergency TRO to prevent supply termination while building the breach case. Identified pattern of prior violations by the supplier.',
            outcome:
              'Jury returned a $4.2M verdict including punitive damages. Client resumed full production within 72 hours of the TRO.',
            image: '/industry-assets/harrison-cole/hero.jpg',
          },
          {
            title: 'Family Business Succession — Estate Planning',
            challenge:
              'Third-generation family business with $40M+ in assets had no succession plan, no buy-sell agreement, and a pending estate tax exposure of $8M.',
            solution:
              'Designed a comprehensive estate plan including a family limited partnership, grantor retained annuity trusts, and a cross-purchase buy-sell agreement.',
            outcome:
              'Projected estate tax liability reduced to $1.2M. Ownership transition structured over 10 years with no disruption to operations.',
            image: '/industry-assets/harrison-cole/hero.jpg',
          },
        ],
      },
    },
    {
      type: 'testimonials',
      data: {
        headline: 'Client Feedback',
        items: [
          { quote: 'They made a difficult divorce process manageable. Compassionate and sharp — I never felt like just another case number.', author: 'Jennifer A.', role: 'Client', company: '' },
          { quote: 'Our family business had been in limbo for years. They designed a succession plan that protected everything we built.', author: 'Marcus W.', role: 'Small Business Owner', company: '' },
          { quote: 'Aggressive defense got my charges reduced. I\'m forever grateful for how they handled my case.', author: 'Carlos D.', role: 'Client', company: '' },
        ],
      },
    },
    {
      type: 'process',
      data: {
        headline: 'Our Approach',
        steps: [
          { title: 'Initial Consultation', description: 'Free confidential case review. We listen to your situation, discuss options, and outline potential strategies with clear fee structures.' },
          { title: 'Case Strategy', description: 'We develop a tailored legal strategy with realistic timelines, milestone planning, and regular client updates.' },
          { title: 'Representation', description: 'Aggressive advocacy in negotiation, mediation, and trial. Every client receives direct partner-level attention.' },
          { title: 'Resolution', description: 'We pursue the best outcome — whether through favorable settlement, alternative dispute resolution, or courtroom verdict.' },
        ],
      },
    },
    {
      type: 'contact',
      data: {
        headline: 'Speak With an Attorney Today',
        subtitle: 'Initial consultations are always free, confidential, and carry no obligation.',
        cta: 'Schedule a Consultation',
        email: 'counsel@harrisoncolelaw.com',
        phone: '(555) 678-9012',
      },
    },
  ],
}
