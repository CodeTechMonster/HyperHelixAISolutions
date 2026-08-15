# 03 — Design Tokens & Visual System

Tailwind v4 is configured CSS-first. Every token lives in the `@theme` block of
`src/assets/styles/main.css` and is emitted twice: as a CSS custom property
(`var(--color-cyan-500)`) and as a utility class (`bg-cyan-500`). There is no
`tailwind.config.js` — the stylesheet is the single source of truth.

## Colour

Each brand colour is expanded into a full ramp so components have honest choices for
hover, border and disabled states instead of faking them with opacity.

| Role | Token | Hex |
|---|---|---|
| **Primary** — Deep Space Blue | `--color-space-800` | `#0A2342` |
| **Secondary** — Electric Cyan | `--color-cyan-500` | `#00C2FF` |
| **Accent** — Aurora Purple | `--color-aurora-500` | `#7B61FF` |
| **Support** — Soft White | `--color-mist-100` | `#F8FAFC` |
| **Text** — Ink | `--color-mist-900` | `#111827` |

```
space   50 → 950   #eef3fa … #0A2342 … #04101f    structure, dark surfaces
cyan    50 → 900   #e6faff … #00C2FF … #054d68    energy, accents, links
aurora  50 → 900   #f1efff … #7B61FF … #322676    the "human" warm counterweight
mist    50 → 900   #ffffff … #F8FAFC … #111827    surfaces and type
```

**Usage rules**

- Cyan and aurora appear together in gradients (`100deg`, cyan → aurora) and
  separately never for more than an accent. They are punctuation, not paragraphs.
- Body copy is `mist-700` on light and `mist-300` on dark — both clear 4.5:1 against
  their surfaces. Pure `#111827` is reserved for headings.
- `mist-500` is the floor for decorative text (footnotes, axis labels) and is never
  used for anything a user must read to act.

## Typography

**Sora** for display (geometric, slightly wide, holds up at 5rem), **Inter** for UI,
**Pretendard** for Korean — a dynamic-subset variable font, so a Korean visitor
downloads only the syllable blocks the page actually uses.

The scale is fluid. Every step is a `clamp()`, so type grows continuously with the
viewport rather than snapping at breakpoints:

| Token | Range | Line height | Tracking | Use |
|---|---|---|---|---|
| `text-display-1` | 2.5 → 5rem | 1.02 | −0.035em | Hero H1 only |
| `text-display-2` | 2.25 → 4.25rem | 1.06 | −0.03em | CTA headline |
| `text-headline` | 1.75 → 3rem | 1.14 | −0.022em | Section H2 |
| `text-title` | 1.25 → 1.75rem | 1.25 | −0.015em | Card H3 |
| `text-lead` | 1.06 → 1.375rem | 1.6 | — | Intro paragraphs |
| `text-eyebrow` | 0.75rem | 1.2 | +0.22em | Section labels |

Negative tracking scales with size — display type needs it, body type does not.

### Korean typography

Latin display habits actively damage Hangul, so two adjustments are automatic:

- `.lang-ko` sets `word-break: keep-all` (breaks between words, not mid-syllable),
  `line-height: 1.7`, and near-zero tracking.
- An unlayered rule tightens `.text-eyebrow` and any `tracking-[…]` utility to
  `0.045em` when `<html lang="ko">`. It has to be unlayered — Tailwind's `utilities`
  layer beats any selector in `base` or `components` regardless of specificity.
  Latin-only strings inside a Korean page (the logo's "AI SOLUTIONS" descriptor) opt
  out with `.hh-keep-tracking`.

## Radii, elevation, motion

```css
--radius-card:  1.5rem     --shadow-glass: soft 24px ambient
--radius-panel: 2rem       --shadow-lift:  48px lift, on hover
--radius-pill:  999px      --shadow-glow:  cyan ring + 60px bloom

--ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1)   entrances
--ease-in-out-soft: cubic-bezier(0.65, 0, 0.35, 1)  loops
--duration-fast: 200ms   --duration-base: 420ms   --duration-slow: 900ms
```

Shadows are wide and low-opacity rather than tight and dark. A 48px blur at 22% alpha
reads as "floating in light"; a 6px blur at 40% reads as a 2014 material card.

## Component primitives

| Class | What it is |
|---|---|
| `.hh-container` | max 76rem, responsive gutters |
| `.hh-section` | `clamp(4.5rem, 3rem + 6vw, 9rem)` block padding, `position: relative` |
| `.hh-glass` | white 78% + `blur(24px) saturate(160%)` — cards |
| `.hh-glass-strong` | white 90% — the sticky header, where copy must not read through |
| `.hh-glass-dark` | space-800 38% + blur — cards on dark sections |
| `.hh-gradient-text` | cyan → aurora, background-clipped |
| `.hh-aurora` | ambient colour bloom (see below) |
| `.hh-reveal` | scroll-reveal transition + `--reveal-delay` |
| `.bg-grid` / `.bg-grid-dark` | 64px hairline grid |

### Why the aurora blooms are gradients, not blurs

The obvious way to paint an ambient glow is a solid circle with `filter: blur(80px)`.
It works — until it doesn't. Large blur radii are approximated differently across GPUs
and headless renderers, and the approximation shows up as concentric banding, moiré
rings, and in one case a cyan bloom that rendered **yellow**.

`.hh-aurora` paints `radial-gradient(closest-side, currentColor, transparent)` instead.
Identical result, no filter pass, and byte-for-byte the same everywhere. Colour comes
from `currentColor`, so blooms are tinted with a `text-*` utility:

```html
<div class="hh-aurora -left-32 top-24 h-[26rem] w-[26rem] text-cyan-500/25" aria-hidden="true" />
```

## Glassmorphism, used sparingly

Vision Pro's layer language works because the glass sits over *something*. Every
`hh-glass` surface here has a grid, a gradient field or an aurora bloom beneath it —
never flat colour. Glass over a solid background is just a grey box with extra
compositing cost.

## The icon system

`CategoryIcon.vue` holds all 16 glyphs: 24px box, 1.5 stroke, round caps, no fills.
"Container" glyphs (shield, brain, folder, monitor, document, gear) carry a small
helix inside them in cyan→aurora gradient — the same relationship the brand icon sheet
uses, so a service card visibly belongs to the logo.

One detail worth recording, because the first attempt was wrong: the inner helix must
cross **twice**. Two mirrored curves that cross once render as a plain `✗` at 16px. A
full period produces the paired lens shapes that read unmistakably as a double helix.
`/icons.html` renders the whole set at 40px and 24px side by side to catch exactly
this class of regression.

## Extending the system

- **New colour** → add the full 50–950 ramp to `@theme`. Do not one-off a hex.
- **New type size** → add a `--text-*` clamp token. Do not reach for `text-[19px]`.
- **New surface** → compose from existing primitives; add to `@layer components` only
  if it appears three or more times.
