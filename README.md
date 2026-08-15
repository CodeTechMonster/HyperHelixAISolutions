# Hyper Helix AI Solutions — Homepage

> **Empowering Human Potential Through AI**
> AI that amplifies people, not replaces them.

A production-ready Vue 3 marketing site: bilingual (EN/KO), fully responsive,
WCAG 2.1 AA, with an animated DNA double helix in the hero.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build → dist/
npm run preview    # serve the production build
npm run typecheck  # vue-tsc, no emit
```

Node 20+ recommended.

## Stack

| Concern | Choice |
|---|---|
| Framework | Vue 3.5, `<script setup>`, Composition API |
| Language | TypeScript (strict, `noUnusedLocals`) |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 — CSS-first `@theme`, no JS config |
| Animation | GSAP (hero only, code-split) + CSS + Canvas 2D |
| i18n | Custom typed content layer — no runtime i18n dependency |

No router and no state library: one page, one content tree, module-scoped reactivity.

## What's here

Eight sections in one scroll narrative — Hero, Philosophy, Real Stories, Services,
Founder Story, Human-Centered AI, Future Vision, Call to Action — plus a scroll-aware
header with scroll-spy and a footer.

Also included:

- **`/icons.html`** — brand and icon reference page (noindex). Renders the logo in all
  three variants, all 16 icons at 40px and 24px, and the colour swatches. Useful for
  spotting glyph regressions at a glance.

## Where to change things

| I want to… | Go to |
|---|---|
| Edit any copy | `src/content/en.ts` / `src/content/ko.ts` |
| Change a colour, font or spacing token | the `@theme` block in `src/assets/styles/main.css` |
| Add a language | copy `en.ts`, translate, register in `src/composables/useI18n.ts` |
| Reorder or remove a section | `src/App.vue` |
| Adjust the helix animation | `src/components/visuals/HelixCanvas.vue` |
| Update meta tags or JSON-LD | `src/composables/useSeo.ts` |

Every user-facing string is in the content files and typed against `SiteContent`.
Components contain no literal copy — so copy edits never require touching a `.vue`
file, and adding a locale surfaces every missing string as a type error.

## Before you deploy

1. **Set the domain.** `SITE_URL` in `src/composables/useSeo.ts`, plus the absolute
   URLs in `index.html`, `public/sitemap.xml` and `public/robots.txt`.
2. **Add the two raster assets** referenced by `index.html`: `public/og-image.png`
   (1200×630) and `public/apple-touch-icon.png` (180×180). Both can be generated from
   `public/favicon.svg`.
3. **Replace the contact email** — currently `hello@hyperhelix.ai` in both content
   files.
4. **Drop in a founder photo** if you have one. `CeoStorySection.vue` has a marked
   placeholder plate; swap the inner block for an `<img>` at 4:5, `object-cover`.
5. **Self-host the fonts** for the last few Lighthouse points — see
   `docs/04-responsive-and-performance.md`.

Deploys as static output to any host (Vercel, Netlify, Cloudflare Pages, S3).

## Documentation

| Doc | Contents |
|---|---|
| [`docs/01-wireframes.md`](docs/01-wireframes.md) | Section-by-section wireframes, page rhythm, header behaviour |
| [`docs/02-component-architecture.md`](docs/02-component-architecture.md) | Folder structure, component tree, content layer, composables |
| [`docs/03-design-tokens.md`](docs/03-design-tokens.md) | Colour ramps, type scale, primitives, icon system |
| [`docs/04-responsive-and-performance.md`](docs/04-responsive-and-performance.md) | Breakpoints, motion policy, helix internals, perf budget |
| [`docs/05-seo-and-accessibility.md`](docs/05-seo-and-accessibility.md) | SEO strategy, structured data, WCAG 2.1 AA mapping |

## Design intent

Apple Vision Pro's layered glass and unhurried easing, IDEO's human-centred
storytelling, OpenAI's restraint, Stripe's gradient-and-card craft — in service of one
argument that is Hyper Helix's own: **AI should give people their time back, and what
they do with it is the actual point.**

Practical consequences of that argument, visible in the build:

- Every section is warm-lit, not cyberpunk. No neon, no dark-hacker palette, no robots
  replacing people.
- The Real Stories section leads with an outcome number, then Problem → Solution →
  Impact. Claims are specific and footnoted rather than sweeping.
- The Human-Centered AI section rejects "AI First" explicitly and argues that high
  automation and high human control are compatible, not a trade-off.
- The founder story is told at the length it needs, because it is the actual reason
  the company exists.

---

© 2026 Hyper Helix AI Solutions.
