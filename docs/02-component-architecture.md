# 02 — Component Architecture & Folder Structure

## Folder structure

```
hyper-helix/
├── index.html                  # SEO meta in markup + critical shell CSS
├── icons.html                  # /icons.html — brand & icon reference (noindex)
├── vite.config.ts              # aliases, two entries, gsap manual chunk
├── tsconfig.json               # strict, noUnusedLocals, @/* path alias
│
├── public/
│   ├── favicon.svg             # the H-mark, hand-authored SVG
│   ├── robots.txt
│   ├── sitemap.xml             # with xhtml:link hreflang alternates
│   └── site.webmanifest
│
├── docs/                       # this documentation set
│
└── src/
    ├── main.ts
    ├── App.vue                 # skip link · header · 8 sections · footer
    ├── env.d.ts
    │
    ├── assets/styles/
    │   └── main.css            # @theme tokens, base, component primitives
    │
    ├── content/                # ← ALL copy lives here, nowhere else
    │   ├── types.ts            # SiteContent contract
    │   ├── en.ts
    │   └── ko.ts
    │
    ├── composables/
    │   ├── useI18n.ts          # locale singleton + typed content tree
    │   ├── useSeo.ts           # head tags + JSON-LD, reactive to locale
    │   ├── useScrollReveal.ts  # IntersectionObserver → .is-visible
    │   └── useReducedMotion.ts # reactive prefers-reduced-motion
    │
    ├── components/
    │   ├── brand/
    │   │   ├── HelixMark.vue   # the H monogram, inline SVG, 3 variants
    │   │   └── BrandLogo.vue   # mark + wordmark lockup
    │   ├── layout/
    │   │   ├── SiteHeader.vue  # scroll state, scroll-spy, mobile panel
    │   │   ├── SiteFooter.vue
    │   │   └── LanguageToggle.vue
    │   ├── ui/
    │   │   ├── AppButton.vue
    │   │   ├── GlassCard.vue
    │   │   ├── SectionHeading.vue
    │   │   ├── RevealOnScroll.vue
    │   │   └── CategoryIcon.vue    # 16-glyph icon system
    │   ├── visuals/
    │   │   ├── HelixCanvas.vue     # animated double helix (Canvas 2D)
    │   │   └── NodeNetwork.vue     # knowledge network (deterministic SVG)
    │   └── sections/
    │       ├── HeroSection.vue
    │       ├── PhilosophySection.vue
    │       ├── StoriesSection.vue
    │       ├── ServicesSection.vue
    │       ├── CeoStorySection.vue
    │       ├── HcaiSection.vue
    │       ├── FutureVisionSection.vue
    │       └── CtaSection.vue
    │
    └── dev/
        └── IconAudit.vue       # renders every glyph and swatch at ship size
```

## Component tree

```
App.vue
├── a.skip-link
├── SiteHeader
│   ├── BrandLogo → HelixMark
│   ├── nav (scroll-spy)
│   ├── LanguageToggle
│   ├── AppButton
│   └── mobile panel (Transition, role="dialog")
├── main#main
│   ├── HeroSection
│   │   ├── HelixCanvas
│   │   └── AppButton × 2
│   ├── PhilosophySection
│   │   ├── SectionHeading → RevealOnScroll × 3
│   │   └── RevealOnScroll × 5 → GlassCard → CategoryIcon
│   ├── StoriesSection      → SectionHeading, GlassCard[dark], CategoryIcon
│   ├── ServicesSection     → SectionHeading, CategoryIcon
│   ├── CeoStorySection     → RevealOnScroll, HelixMark
│   ├── HcaiSection         → SectionHeading, GlassCard
│   ├── FutureVisionSection → SectionHeading, NodeNetwork, CategoryIcon
│   └── CtaSection          → HelixMark, AppButton × 2
└── SiteFooter → BrandLogo
```

Three layers, one direction of dependency: `sections` compose `ui`, `ui` composes
nothing but itself, `visuals` and `brand` are leaves. No section imports another
section, so any one of them can be deleted or reordered in `App.vue` without a
cascade.

## The content layer

Every user-facing string is in `src/content/{en,ko}.ts`, typed against
`SiteContent` in `types.ts`. Components read `t.value.<path>` and never contain
literal copy.

Three things fall out of that:

- **Adding a locale is one file.** Copy `en.ts`, translate, register it in
  `useI18n`. TypeScript then lists every string you missed.
- **Copy edits need no component knowledge.** A marketer can change the site
  without opening a `.vue` file.
- **Structure is enforced.** A story card cannot ship without a Problem, a
  Solution, an Impact and a metric — the type will not compile otherwise.

`useI18n` holds its `locale` ref at module scope, so it is a singleton: every
component sees the same value and switching language re-renders the whole tree
from one assignment. Resolution order is `?lang=` → `localStorage` → browser
language → `en`.

## Composables

| Composable | Responsibility | Notes |
|---|---|---|
| `useI18n` | active locale + typed content | module-scoped singleton; syncs `<html lang>` |
| `useSeo` | title, OG, Twitter, canonical, hreflang, JSON-LD | `watchEffect`, re-runs on locale change |
| `useScrollReveal` | toggles `.is-visible` on an element | observer only; animation stays in CSS |
| `useReducedMotion` | reactive `prefers-reduced-motion` | listens for change, not just initial value |

`useScrollReveal` deliberately does not animate anything itself. It adds a class;
`main.css` owns the transition and disables it under `prefers-reduced-motion`. That
keeps the motion definition in one place and means the reveal degrades correctly even
if JavaScript never runs the observer.

## Animation strategy

| Where | Technique | Why |
|---|---|---|
| Hero entrance | GSAP timeline, dynamically imported | one-shot orchestration with stagger; ~70KB kept off the critical path |
| Scroll reveals | IntersectionObserver + CSS transition | no per-frame JS, no scroll listener |
| Card hover | CSS transitions | GPU-composited, free |
| DNA helix | Canvas 2D `requestAnimationFrame` | see `docs/03` |
| Node network | static SVG + CSS keyframes | zero per-frame cost |

GSAP is imported with `await import('gsap')` inside `onMounted` and split into a
`motion` chunk by `vite.config.ts`, so the hero paints before the animation library
is even requested. Everything else on the page runs on platform primitives.
