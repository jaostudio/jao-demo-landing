import type { IndustryProfile } from '@jaostudio/engine/types'

export const summitRidge: IndustryProfile = {
  slug: 'summit-ridge',
  company: {
    name: 'Summit Ridge Construction',
    category: 'Commercial Construction',
    tagline: 'Premium Builders — Get an Instant Estimate',
    description:
      'A mid-market commercial builder serving Metro Manila and nearby growth corridors — general contracting, fit-outs, renovations, and industrial facilities.',
        cta: { label: 'Request a Proposal', href: '#contact' },
    personality: 'industrial',
    domain: 'jaostudio.com',
  },
  theme: { primary: 'amber', accent: 'slate' },
  imagery: {
    hero: '/industry-assets/summit-ridge/hero.jpg',
    thumbnail: '/industry-assets/summit-ridge/thumbnail.jpg',
    gallery: [
      '/industry-assets/summit-ridge/project-1.jpg',
      '/industry-assets/summit-ridge/project-2.jpg',
    ],
  },
  switcher: {
    previewType: "photo",
  },
  navigation: [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Safety', href: '#safety' },
    { label: 'Contact', href: '#contact' },
  ],
  sections: [
    {
      type: 'hero',
      data: {
        title: 'Commercial Construction for Growing Businesses',
        subtitle:
          'Metro Manila • Cavite • Clark',
    cta: { label: 'Request a Proposal', href: '#contact' },
        secondaryCta: { label: 'View Projects', href: '/summit-ridge#work' },
      },
    },
    {
      type: 'proof',
      data: {
        headline: 'By the numbers',
        items: [
          { value: '200+', label: 'Projects Completed' },
          { value: '15+', label: 'Years in Business' },
          { value: '99%', label: 'On-Time Delivery' },
        ],
      },
    },
    {
      type: 'services',
      data: {
        headline: 'What We Build',
        items: [
          {
            title: 'Commercial Facilities',
            description:
              'Office buildings, headquarters, and business parks across Metro Manila — delivered on schedule and within budget.',
            icon: 'building',
          },
          {
            title: 'Interior Fit-Outs',
            description:
              'Tenant improvements and workplace modernization for growing enterprises in BGC, Makati, and Ortigas.',
            icon: 'home',
          },
          {
            title: 'Industrial Facilities',
            description:
              'Warehouses, logistics hubs, and light manufacturing facilities for Metro Manila\'s expanding industrial corridors.',
            icon: 'truck',
          },
          {
            title: 'Construction Management',
            description:
              'Scheduling, procurement, and trade coordination for complex projects across multiple sites.',
            icon: 'clipboard-check',
          },
          {
            title: 'Site Development',
            description:
              'Civil works, infrastructure, and site preparation for greenfield developments in Cavite and Clark.',
            icon: 'route',
          },
          {
            title: 'Preconstruction Planning',
            description:
              'Budgeting, feasibility reviews, and constructability assessments during early project stages.',
            icon: 'trending-up',
          },
        ],
      },
    },
    {
      type: 'case-studies',
      data: {
        headline: 'Featured Projects',
        studies: [
          {
            title: 'BGC Corporate Headquarters',
            challenge:
              'A 12-storey office tower requiring full structural fit-out, MEP installation, and interior finishes for a multinational tenant. 40,000 sq m. 14-month schedule.',
            solution:
              'Phased construction with concurrent MEP and finish trades. Night and weekend work windows for core activities. Self-performed steel and concrete.',
            outcome:
              'Completed on schedule. Zero safety incidents. Certificate of occupancy obtained ahead of lease commencement.',
            image: '/industry-assets/summit-ridge/project-1.jpg',
          },
          {
            title: 'South Metro Logistics Hub',
            challenge:
              'Greenfield development of a 25,000 sq m warehouse and distribution centre on a former industrial site in Cavite. 12-month schedule with environmental remediation.',
            solution:
              'Fast-tracked foundation work in parallel with remediation. Self-performed steel erection and concrete to maintain schedule control.',
            outcome:
              'Facility delivered on schedule. Tenant occupancy began immediately upon certificate of occupancy.',
            image: '/industry-assets/summit-ridge/project-2.jpg',
          },
          {
            title: 'Quezon Medical Pavilion',
            challenge:
              'New 6-storey medical office building attached to an existing hospital. Required uninterrupted hospital operations during construction.',
            solution:
              'Sequenced construction with vibration monitoring, dust containment, and dedicated pedestrian separation. All utility tie-ins performed during off-peak hours.',
            outcome:
              'Completed on schedule with zero disruption to hospital operations. 100% satisfaction from facility management.',
            image: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1400&q=80',
          },
        ],
      },
    },
    {
      type: 'testimonials',
      data: {
        headline: 'What Our Clients Say',
        items: [
          {
            quote:
              'Summit Ridge coordinated every trade without a single interruption to patient care during our 6-storey expansion. That level of discipline is rare.',
            author: 'Facilities Director',
            role: 'Facilities Director',
            company: 'Metro Manila Healthcare Group',
          },
          {
            quote:
              'The transparency on budgets and timelines is unmatched. Every milestone met, every dollar accounted for.',
            author: 'Operations Manager',
            role: 'Operations Manager',
            company: 'Sample Logistics Corporation',
          },
          {
            quote:
              'Our headquarters fit-out required precision across every detail. Summit Ridge delivered exactly what was promised.',
            author: 'Project Director',
            role: 'Project Director',
            company: 'BGC Development Corporation',
          },
        ],
      },
    },
    {
      type: 'process',
      data: {
        headline: 'Project Delivery Process',
        steps: [
          {
            title: '01 Preconstruction',
            description:
              'Feasibility studies, budget development, permitting pathway, and subcontractor prequalification before site mobilization.',
          },
          {
            title: '02 Procurement',
            description:
              'Material sourcing, equipment procurement, supply chain coordination, and long-lead item ordering.',
          },
          {
            title: '03 Site Mobilization',
            description:
              'Site preparation, utility connections, temporary facilities, and safety program deployment before construction begins.',
          },
          {
            title: '04 Construction',
            description:
              'Weekly progress reporting, safety audits, quality inspections, and real-time schedule management throughout the build.',
          },
          {
            title: '05 Turnover',
            description:
              'Final inspection, systems commissioning, operations training for your team, and comprehensive warranty documentation.',
          },
        ],
      },
    },
    {
      type: 'contact',
      data: {
        headline: 'Request a Proposal',
        subtitle:
          'Tell us about your facility, expansion, renovation, or development plans.',
        cta: 'Request a Proposal',
        email: 'estimates@summitridge.build',
      },
    },
  ],
}
