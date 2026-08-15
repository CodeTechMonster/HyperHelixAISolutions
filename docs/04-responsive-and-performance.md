# 04 — Responsive Strategy, Motion & Performance

## Breakpoints

Tailwind defaults, used for structure only:

| Token | Width | What changes |
|---|---|---|
| — | 0–639 | Single column. Menu button. Stacked CTAs. |
| `sm` | 640 | 2-up hero signals, 2-up capability lists, wider gutters |
| `md` | 768 | Header CTA appears; story cards go 2-up |
| `lg` | 1024 | Bento grids activate; founder rail becomes sticky; scroll hint appears |
| `xl` | 1280 | Full horizontal nav replaces the menu button |

Type is *not* in this table. Every size is a `clamp()` against viewport width, so text
scales continuously between breakpoints instead of jumping at them. The breakpoints
only ever change layout.

### Why the nav collapses at `xl`, not `lg`

Six nav items plus a two-option language toggle plus a CTA button do not fit at
1024px without shrinking type below 13px or wrapping labels to two lines. Both were
tried; both looked broken. Collapsing to the menu button one breakpoint later is the
honest fix.

## Grid behaviour by section

| Section | Mobile | Tablet | Desktop |
|---|---|---|---|
| Hero signals | 1 col | 3 col (`sm`) | 3 col |
| Philosophy | 1 col | 2 col (`sm`) | 6-col bento, `3/3/2/2/2` |
| Stories | 1 col | 2 col (`md`) | 6-col bento, `2/2/2/3/3` |
| Services | 1 col | 1 col | 2 col (`lg`) |
| Founder | stacked | stacked | `0.85fr / 1.15fr`, left rail sticky |
| HCAI | stacked | stacked | `1fr / 0.9fr`, matrix sticky |
| Vision pillars | 1 col | 2 col (`sm`) | 4 col (`lg`) |

## Touch and viewport details

- Interactive targets are ≥ 44×44 (menu button is exactly `h-11 w-11`; buttons carry
  `py-3`/`py-4`).
- Hero uses `min-h-[100svh]`, not `100vh` — `svh` accounts for mobile browser chrome,
  so the CTA never hides behind Safari's toolbar.
- `viewport-fit=cover` plus safe-area-aware gutters on notched devices.
- `scroll-padding-top: 6rem` on `:root` so anchor jumps clear the fixed header.
- All hover affordances have a non-hover equivalent: cards use `focus-within` as well
  as `hover`, so keyboard and touch users get the same state.

## Motion

### Reduced motion is a first-class path, not a fallback

`prefers-reduced-motion: reduce` triggers four independent behaviours:

1. A global CSS rule collapses all animation and transition durations to `0.01ms`.
2. `.hh-reveal` renders at full opacity with no transform — content is never
   dependent on an animation having run.
3. `HelixCanvas` draws exactly one static frame and never starts its RAF loop.
4. The GSAP hero timeline is skipped entirely — the library is not even imported.

`useReducedMotion` uses a `change` listener rather than reading `matches` once, so
toggling the OS setting mid-session takes effect immediately.

### The DNA helix — why Canvas 2D

Three.js was the obvious choice and the wrong one. WebGL context creation plus shader
compilation lands squarely in the hero's LCP window, for a visual that is
mathematically a sine wave. The Canvas 2D implementation is ~6KB of logic with zero
dependencies.

Depth is faked with a single cosine. Each node's `z = cos(angle)` drives its radius,
alpha and glow; nodes are sorted and painted back-to-front. That reads as 3D without
a matrix stack.

Performance guards, all of them necessary:

| Guard | Mechanism |
|---|---|
| Off-screen | `IntersectionObserver` pauses the RAF loop |
| Background tab | `visibilitychange` pauses the loop |
| Reduced motion | one static frame, no loop |
| Retina cost | `devicePixelRatio` capped at 2 |
| Small screens | node count 74 → 44, particles ×0.45 |
| Resize | `ResizeObserver`, re-seeds rather than stretching |

Pointer parallax is lerped at `0.05` toward the target, so the helix drifts rather
than tracking the cursor — motion that suggests depth without demanding attention.

### The node network — SVG, not canvas

The Vision graphic is static geometry with pulsing nodes. Deterministic SVG plus CSS
keyframes costs nothing per frame, scales to any size, and degrades to a clean still
image under reduced motion. Canvas would have been strictly worse.

## Performance budget

Production build, gzipped:

| Asset | Raw | Notes |
|---|---|---|
| `index.js` | ~77 KB | Vue 3 runtime + all components |
| `motion.js` | ~70 KB | GSAP — **deferred**, loaded after mount |
| `index.css` | ~56 KB | full theme; Tailwind purges unused utilities |

Deliberate choices behind those numbers:

- **No router, no state library.** One page, one content tree, module-scoped
  reactivity. Vue Router and Pinia would add weight and solve nothing here.
- **GSAP is dynamically imported** inside `onMounted` and split into its own chunk, so
  it never blocks first paint.
- **A critical shell in `index.html`.** A tiny inline `<style>` paints the hero's
  deep-space gradient before the JS bundle resolves — no white flash, earlier LCP.
- **The logo, all 16 icons and both visuals are inline SVG or canvas.** Zero image
  requests above the fold.
- **Fonts are `display: swap`** with preconnect; Korean uses Pretendard's
  dynamic-subset build so only the needed syllable blocks download.

### Getting to Lighthouse 95+ in production

Everything above is in place. Three deployment-side items complete the picture:

1. **Self-host the fonts.** Third-party font CSS costs a connection and a
   render-blocking round trip. Move Sora/Inter/Pretendard into `public/fonts` and
   `<link rel="preload">` the two weights the hero actually uses.
2. **Serve Brotli** with long `Cache-Control` on hashed assets.
3. **Add `og-image.png` and `apple-touch-icon.png`** to `public/` (referenced in
   `index.html`; generate from `favicon.svg`).

If SEO for a JavaScript-rendered page becomes a concern, `vite-ssg` will prerender
this app to static HTML with no source changes — the site has no dynamic routes and no
client-only data.
