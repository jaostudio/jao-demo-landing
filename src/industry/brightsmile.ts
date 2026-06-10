import type { IndustryProfile } from '@jaostudio/engine/types'

export const brightsmile: IndustryProfile = {
  slug: 'brightsmile',
  company: {
    name: 'BrightSmile Dental Studio',
    category: 'Dental Practice',
    tagline: 'Before & After Gallery — Book Online',
    description:
      'Gentle, modern dentistry for the whole family — from routine cleanings to full-mouth restoration with same-day appointments and sedation options.',
    cta: { label: 'Book an Appointment', href: '#contact' },
    heroStats: [
      { value: '5,000+', label: 'Patients Treated' },
      { value: '4.9', label: 'Average Rating' },
      { value: '98%', label: 'Pain-Free Procedures' },
      { value: '15 min', label: 'Average Wait Time' },
    ],
    personality: 'medical',
    domain: 'brightsmiledental.com',
  },
  theme: { primary: 'cyan', accent: 'violet' },
  imagery: {
    hero: '/industry-assets/brightsmile/hero.jpg',
    thumbnail: '/industry-assets/brightsmile/hero.jpg',
    gallery: [
      '/industry-assets/brightsmile/gallery-1.jpg',
      '/industry-assets/brightsmile/gallery-2.jpg',
    ],
  },
  switcher: {
    previewType: "photo",
  },
  navigation: [
    { label: 'Services', href: '#services' },
    { label: 'Results', href: '#results' },
    { label: 'Insurance', href: '#insurance' },
    { label: 'Contact', href: '#contact' },
  ],
  sections: [
    {
      type: 'hero',
      data: {
        title: 'Comprehensive Dental Care. Comfortably Delivered.',
        subtitle:
          'From routine cleanings to full-mouth restoration — same-day appointments available with sedation for anxiety-free treatment.',
cta: { label: 'Book an Appointment', href: '#contact' },
        secondaryCta: { label: 'Our Services', href: '#services' },
      },
    },
    {
      type: 'proof',
      data: {
        headline: 'Trusted by the community',
        items: [
          { value: '5,000+', label: 'Patients Treated' },
          { value: '4.9', label: 'Average Rating' },
          { value: '98%', label: 'Pain-Free Procedures' },
          { value: '15 min', label: 'Average Wait Time' },
        ],
      },
    },
    {
      type: 'services',
      data: {
        headline: 'Full-Service Dentistry',
        items: [
          { title: 'Preventive Care', description: 'Cleanings, exams, fluoride treatments, sealants, and oral cancer screenings for all ages.', icon: 'smile-plus' },
          { title: 'Restorative Dentistry', description: 'Composite fillings, CEREC same-day crowns, bridges, dental implants, and partials.', icon: 'syringe' },
          { title: 'Cosmetic Dentistry', description: 'Professional whitening, porcelain veneers, composite bonding, and complete smile makeovers.', icon: 'sparkles' },
          { title: 'Orthodontics', description: 'Invisalign clear aligners and accelerated orthodontics for teens and adults.', icon: 'smile' },
          { title: 'Periodontal Health', description: 'Scaling and root planing, LANAP laser therapy, and periodontal maintenance.', icon: 'pill' },
          { title: 'Emergency Dentistry', description: 'Same-day emergency care for toothaches, fractures, lost fillings, and dental trauma.', icon: 'ambulance' },
        ],
      },
    },
    {
      type: 'case-studies',
      data: {
        headline: 'Transformative Results',
        studies: [
          {
            title: 'Full-Mouth Reconstruction',
            challenge: 'Patient presented with advanced periodontal disease, missing teeth 2–15, and significant bone loss. Unable to chew solid foods for over a year.',
            solution: 'Full-mouth extraction of non-restorable teeth, four sinus lifts, eight dental implants with immediate temporary loading, and zygomatic implants for posterior support.',
            outcome: 'Completed over 14 months. Patient regained full chewing function, reported 9/10 satisfaction on function and aesthetics.',
            image: '/industry-assets/brightsmile/hero.jpg',
          },
          {
            title: 'Invisalign Comprehensive — 18-Month Transformation',
            challenge: 'Adult patient with severe crowding, crossbite, and 8mm overjet. Previous orthodontic treatment had relapsed.',
            solution: 'Invisalign Comprehensive with 42 aligners, Class II elastics, and interproximal reduction to manage crowding without extractions.',
            outcome: 'Treatment completed in 18 months — ideal Class I occlusion, resolved crossbite, overjet reduced to 2mm. Retainer protocol prescribed.',
            image: '/industry-assets/brightsmile/hero.jpg',
          },
        ],
      },
    },
    {
      type: 'testimonials',
      data: {
        headline: 'Patient Stories',
        items: [
          { quote: 'I used to dread the dentist. Now I actually look forward to my cleanings. The team is incredibly gentle.', author: 'James K.', role: 'Patient', company: '' },
          { quote: 'They stayed open late to see my son after a sports accident. Exceptional care when we needed it most.', author: 'Maria G.', role: 'Parent', company: '' },
          { quote: 'My Invisalign results are incredible. The 3D scanning made the whole process easy and comfortable.', author: 'David L.', role: 'Patient', company: '' },
        ],
      },
    },
    {
      type: 'process',
      data: {
        headline: 'Your First Visit',
        steps: [
          { title: 'Paperless Check-In', description: 'Complete our online intake and health history from your phone before you arrive.' },
          { title: 'Comprehensive Exam', description: 'Digital X-rays, intraoral photos, 3D cone beam scan, and oral cancer screening.' },
          { title: 'Treatment Planning', description: 'We review findings chair-side, show you digital previews, and provide clear cost estimates with insurance breakdown.' },
          { title: 'Same-Day Care', description: 'Treatment begins same-day when possible. We schedule follow-ups at your convenience.' },
        ],
      },
    },
    {
      type: 'contact',
      data: {
        headline: 'Schedule Your Visit',
        subtitle: 'New patients welcome. Most PPO insurance plans accepted. Interest-free financing available.',
        cta: 'Book Online',
        email: 'smiles@brightsmiledental.com',
        phone: '(555) 345-6789',
      },
    },
  ],
}
