# 05 — SEO & Accessibility

## SEO

### Two layers, on purpose

Static tags live in `index.html`; `useSeo.ts` keeps them in sync with the active
locale at runtime. The duplication is intentional: a crawler that does not execute
JavaScript still gets a complete, correct card from the markup, and a user who
switches to Korean gets a correctly-localised `<head>` without a page load.

`useSeo` runs inside `watchEffect`, so every locale change rewrites title,
description, Open Graph, Twitter, canonical, hreflang and all three JSON-LD blocks in
one pass.

### Structured data

Three JSON-LD graphs, injected and kept current by `useSeo`:

| Type | Carries |
|---|---|
| `Organization` | name, logo, description, slogan, region, contact point, `knowsAbout` |
| `WebSite` | canonical URL, `inLanguage` |
| `ItemList` of `Service` | all four services with descriptions and provider |

`contactPoint.availableLanguage` lists both `en` and `ko`, which is what tells Google
the bilingual offer is real rather than a machine translation.

### International targeting

```html
<link rel="canonical"  href="https://www.hyperhelix.ai/" />
<link rel="alternate"  hreflang="en"        href="https://www.hyperhelix.ai/" />
<link rel="alternate"  hreflang="ko"        href="https://www.hyperhelix.ai/?lang=ko" />
<link rel="alternate"  hreflang="x-default" href="https://www.hyperhelix.ai/" />
```

`sitemap.xml` repeats the same alternates as `xhtml:link` entries. Both directions are
required — Google treats a one-sided hreflang claim as unconfirmed and ignores it.

If Korean becomes a significant acquisition channel, promote it from `?lang=ko` to a
`/ko/` path segment. The content layer already supports it; only the canonical
construction in `useSeo.ts` and the sitemap need to change.

### Semantic structure

- Exactly one `<h1>` (the hero). Each section owns a single `<h2>`; cards use `<h3>`.
- Every `<section>` carries `aria-labelledby` pointing at its own heading, so a
  screen-reader landmark list reads as a table of contents.
- Story metrics are a `<dl>`; the founder timeline is an `<ol>`; philosophy values are
  a grid of articles. The markup describes the content, not the layout.
- Decorative layers — aurora blooms, grids, canvas, gradient rules — are all
  `aria-hidden="true"` and contribute nothing to the accessibility tree.

### Copy-level SEO

Headings are written as claims, not keyword strings: "Technology should give people
more room to be human", "High automation and high human control are not opposites".
The target terms (human-centered AI, AI enablement, business automation, digital
transformation, AI governance) appear where they belong — service titles, capability
lists, `knowsAbout` — rather than being stuffed into display type.

---

## Accessibility — WCAG 2.1 AA

### Perceivable

| Criterion | Implementation |
|---|---|
| 1.1.1 Non-text Content | Decorative SVG/canvas `aria-hidden`; the logo mark takes an optional `title` and is otherwise hidden with a visible wordmark beside it |
| 1.3.1 Info & Relationships | Real `dl`/`ol`/`ul`/`section` semantics throughout |
| 1.4.3 Contrast | Body `mist-700` on light and `mist-300` on dark both exceed 4.5:1; headings exceed 7:1 |
| 1.4.4 Resize Text | Everything in `rem`/`clamp`; no `px` font sizes; layout holds at 200% zoom |
| 1.4.10 Reflow | Single-column from 320px with no horizontal scroll |
| 1.4.12 Text Spacing | No fixed heights on text containers |

Gradient-clipped text (`hh-gradient-text`) is used only on the hero and CTA headlines,
where the cyan→aurora range sits well above 4.5:1 against `space-950`. It is never
applied to body copy.

### Operable

| Criterion | Implementation |
|---|---|
| 2.1.1 Keyboard | Everything interactive is a native `<a>` or `<button>`; no `div` handlers, no positive `tabindex` |
| 2.1.2 No Keyboard Trap | Mobile panel closes on `Esc` and returns focus to its trigger |
| 2.4.1 Bypass Blocks | Skip link, first in the DOM, visible on focus |
| 2.4.3 Focus Order | DOM order matches visual order in every section |
| 2.4.7 Focus Visible | Global `:focus-visible` — 3px cyan ring, 3px offset. The default outline is restyled, never removed |
| 2.3.1 Three Flashes | Nothing flashes; the slowest loop is a 3.4s node pulse |
| 2.3.3 Animation from Interactions | Full `prefers-reduced-motion` support (see `docs/04`) |
| 2.5.5 Target Size | Interactive targets ≥ 44×44 |

### Understandable

| Criterion | Implementation |
|---|---|
| 3.1.1 Language of Page | `<html lang>` updated reactively by `useI18n` |
| 3.1.2 Language of Parts | Each language toggle button carries its own `lang` attribute |
| 3.2.3 Consistent Navigation | Same nav, same order, both locales |
| 3.2.4 Consistent Identification | One icon system, one button component, one card component |

### Robust

| Criterion | Implementation |
|---|---|
| 4.1.2 Name, Role, Value | `aria-expanded` + `aria-controls` on the menu button; `aria-pressed` on language options; `role="dialog"` + `aria-modal` on the mobile panel; `aria-current` on the active nav item |
| 4.1.3 Status Messages | No live regions needed — no async status on this page |

### Beyond the checklist

- **The language toggle shows `EN` / `KO`** but exposes "English" / "한국어" via
  `aria-label`. Short codes keep the header compact; screen-reader users still hear
  the full language name.
- **Reveal animations never gate content.** `.hh-reveal` under reduced motion is
  `opacity: 1; transform: none`, and if `IntersectionObserver` is unavailable the
  composable reveals immediately. Content is never trapped behind an animation that
  did not fire.
- **`<noscript>`** carries the positioning line and a mailto, so the page is not a
  blank div without JavaScript.
- **Card hover states are mirrored with `focus-within`,** so a keyboard user sees the
  same emphasis a mouse user does.

### What to verify before launch

1. axe DevTools / Lighthouse a11y audit on both locales.
2. Full keyboard pass: skip link → header → each section → footer, with the mobile
   panel open and closed.
3. Screen-reader pass (VoiceOver or NVDA) confirming the landmark list reads as a
   table of contents.
4. Zoom to 200% and 400% at 1280px wide.
5. Toggle "Reduce motion" at the OS level and confirm the helix freezes and reveals
   render instantly.
