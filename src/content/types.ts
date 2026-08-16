/**
 * Content model for the Hyper Helix marketing site.
 *
 * Every user-facing string on the site lives in `en.ts` / `ko.ts` and is typed
 * against this contract. Adding a locale means adding one file — the compiler
 * then tells you exactly which strings are missing.
 */

export type Locale = 'en' | 'ko'

/** Keys of the SVG glyphs available in `CategoryIcon.vue`. */
export type IconName =
  | 'human'
  | 'time'
  | 'collaboration'
  | 'growth'
  | 'trust'
  | 'files'
  | 'document'
  | 'presentation'
  | 'contract'
  | 'workflow'
  | 'brain'
  | 'automation'
  | 'shield'
  | 'transform'
  | 'network'
  | 'spark'

export interface NavLink {
  /** Matches the `id` attribute of the target <section>. */
  id: string
  label: string
}

export interface ValueCard {
  id: string
  icon: IconName
  title: string
  body: string
  /** Short supporting line rendered in a lighter weight beneath the body. */
  note: string
}

export interface StoryCard {
  id: string
  icon: IconName
  tag: string
  title: string
  problem: string
  solution: string
  impact: string
  /** Headline outcome shown as a large figure on the card. */
  metric: { value: string; label: string }
}

export interface ServiceCard {
  id: string
  icon: IconName
  title: string
  summary: string
  capabilities: string[]
}

export interface Milestone {
  year: string
  title: string
  body: string
  /** Optional outbound reference, e.g. a former employer's site. */
  link?: { label: string; href: string }
}

export interface Principle {
  id: string
  title: string
  body: string
}

export interface VisionPillar {
  id: string
  icon: IconName
  title: string
  body: string
}

export interface ThoughtLeader {
  id: string
  name: string
  role: string
  body: string
  href: string
}

export interface ResourceLink {
  id: string
  name: string
  description: string
  href: string
}

export interface SiteContent {
  meta: {
    /** Used for <html lang> and Open Graph locale. */
    htmlLang: string
    ogLocale: string
    title: string
    description: string
    keywords: string
  }

  brand: {
    name: string
    nameShort: string
    descriptor: string
  }

  nav: {
    links: NavLink[]
    cta: string
    menuOpen: string
    menuClose: string
  }

  hero: {
    eyebrow: string
    headlineLead: string
    headlineAccent: string
    subheadline: string
    ctaPrimary: string
    ctaSecondary: string
    scrollHint: string
    signals: { value: string; label: string }[]
  }

  philosophy: {
    eyebrow: string
    title: string
    lead: string
    values: ValueCard[]
  }

  stories: {
    eyebrow: string
    title: string
    lead: string
    labels: { problem: string; solution: string; impact: string }
    items: StoryCard[]
    footnote: string
  }

  services: {
    eyebrow: string
    title: string
    lead: string
    items: ServiceCard[]
  }

  ceo: {
    eyebrow: string
    title: string
    pullQuote: string
    paragraphs: string[]
    milestones: Milestone[]
    signature: { name: string; role: string; location: string }
  }

  hcai: {
    eyebrow: string
    title: string
    lead: string
    stances: {
      id: string
      state: 'reject' | 'accept'
      label: string
      title: string
      body: string
    }[]
    principles: Principle[]
    disclaimer: string
  }

  future: {
    eyebrow: string
    title: string
    lead: string
    pillars: VisionPillar[]
    closing: string
  }

  hcaiResources: {
    eyebrow: string
    title: string
    lead: string
    thoughtLeaders: ThoughtLeader[]
    resourcesTitle: string
    resources: ResourceLink[]
    philosophy: {
      title: string
      paragraphs: string[]
      closing: string
    }
  }

  cta: {
    eyebrow: string
    title: string
    lead: string
    button: string
    secondary: string
    email: string
    reassurance: string
  }

  footer: {
    tagline: string
    columns: { title: string; links: NavLink[] }[]
    legal: string[]
    copyright: string
  }

  a11y: {
    skipToContent: string
    mainLandmark: string
    languageToggle: string
    languageSwitchTo: string
    decorativeCanvas: string
    backToTop: string
    opensInNewTab: string
  }
}
