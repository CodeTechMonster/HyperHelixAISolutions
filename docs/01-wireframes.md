# 01 — Wireframes & Page Structure

The homepage is a single scroll narrative in eight movements. Each section answers one
question, in the order a skeptical visitor actually asks it.

| # | Section | id | Question it answers | Surface |
|---|---------|-----|--------------------|---------|
| 1 | Hero | `#top` | What is this? | Dark |
| 2 | Philosophy | `#philosophy` | What do you believe? | Light |
| 3 | Real Stories | `#stories` | Does it actually work? | Dark |
| 4 | Services | `#services` | What can I buy? | White |
| 5 | Founder Story | `#founder` | Who are you? | Dark |
| 6 | Human-Centered AI | `#human-centered` | How is this different? | Light |
| 7 | Future Vision | `#vision` | Where is this going? | Dark |
| 8 | Call to action | `#contact` | What now? | Gradient |

The dark/light alternation is structural, not decorative: each switch signals "new
argument" without needing a divider, and it keeps a long page from reading as one
undifferentiated scroll.

---

## Vertical rhythm

```
┌──────────────────────────────────────────────────────────┐
│  Fixed header — transparent over hero, glass after 32px  │
└──────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════╗
║ 1. HERO                              min-height: 100svh  ║
║                                                          ║
║      · animated DNA helix (canvas, behind copy)          ║
║      · aurora blooms + fine grid, 4 stacked layers       ║
║                                                          ║
║              [ HUMAN-CENTERED AI ]        ← eyebrow pill ║
║                                                          ║
║           Empowering Human                               ║
║           Potential Through AI            ← gradient      ║
║                                                          ║
║          one-sentence positioning line                   ║
║                                                          ║
║      ( Explore Our Philosophy )  ( See Real Stories )     ║
║                                                          ║
║      ┌────────┐  ┌────────┐  ┌────────┐   ← proof strip  ║
║      │ 18 yrs │  │   5    │  │  100%  │                  ║
║      └────────┘  └────────┘  └────────┘                  ║
║                    ↓ scroll                              ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║ 2. PHILOSOPHY                                     light  ║
║  ─── OUR PHILOSOPHY                                      ║
║  Section heading (left aligned, max 3xl)                 ║
║  Lead paragraph (max 2xl)                                ║
║                                                          ║
║  ┌───────────────────┐ ┌───────────────────┐   bento 3+3 ║
║  │ Human-Centered AI │ │ Meaningful Time   │             ║
║  └───────────────────┘ └───────────────────┘             ║
║  ┌───────────┐ ┌───────────┐ ┌───────────┐     bento 2+2+2║
║  │Collaborat.│ │  Growth   │ │   Trust   │             ║
║  └───────────┘ └───────────┘ └───────────┘             ║
╚══════════════════════════════════════════════════════════╝
```

The five philosophy cards use a 6-column grid split `3 / 3 / 2 / 2 / 2`. A plain
3-across grid leaves a visible hole in row two; the asymmetric split reads as
intentional composition instead of a missing sixth card. The Stories grid uses the
mirror split (`2 / 2 / 2 / 3 / 3`) so the two sections rhyme without repeating.

```
╔══════════════════════════════════════════════════════════╗
║ 3. REAL STORIES                                    dark  ║
║  Each card:                                              ║
║  ┌──────────────────────────────────┐                    ║
║  │ [icon]              [ TAG PILL ] │                    ║
║  │ Story title                      │                    ║
║  │ ──────────────────────────────── │                    ║
║  │  92%   Faster document retrieval │  ← outcome first   ║
║  │ ──────────────────────────────── │                    ║
║  │ ● PROBLEM   …                    │                    ║
║  │ ● SOLUTION  …                    │                    ║
║  │ ● IMPACT    …                    │                    ║
║  └──────────────────────────────────┘                    ║
╚══════════════════════════════════════════════════════════╝
```

Outcome sits above the Problem/Solution/Impact narrative: a scanner gets the number,
a reader gets the story. The three-row `<dl>` keeps that structure machine-readable.

```
╔══════════════════════════════════════════════════════════╗
║ 4. SERVICES                            2 × 2, white      ║
║  Card hover: whole card inverts to deep space blue,      ║
║  gradient rule draws across the top edge, icon flips     ║
║  to outline-on-dark. One state change, four properties.  ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║ 5. FOUNDER STORY                                   dark  ║
║  ┌────────────┐  ┌──────────────────────────────┐        ║
║  │  portrait  │  │  Headline                    │        ║
║  │   plate    │  │                              │        ║
║  │  (sticky)  │  │  Opening paragraph — larger, │        ║
║  │            │  │  white, carries the hook     │        ║
║  │            │  │                              │        ║
║  │            │  │  Four narrative paragraphs   │        ║
║  │ pull quote │  │                              │        ║
║  │            │  │  — signature                 │        ║
║  └────────────┘  └──────────────────────────────┘        ║
║  ┌──────┬──────┬──────┬──────┐  4-step timeline          ║
║  └──────┴──────┴──────┴──────┘                           ║
╚══════════════════════════════════════════════════════════╝
```

The left rail is `position: sticky` from `lg` up, so the portrait and pull quote stay
present while the story scrolls past — the TED-stage effect, done with two CSS
properties instead of a scroll library.

```
╔══════════════════════════════════════════════════════════╗
║ 6. HUMAN-CENTERED AI                              light  ║
║  ┌───────────────────────┐  ┌────────────────────┐       ║
║  │ ✗  AI First           │  │  ↑ Human control   │       ║
║  │ ✓  Human First        │  │ ┌────────┬───────┐ │       ║
║  │ ✓  AI + Human         │  │ │Careful │AMPLIF.│ │       ║
║  └───────────────────────┘  │ ├────────┼───────┤ │       ║
║                             │ │ Manual │Unchk. │ │       ║
║  ┌────┬────┬────┬────┐      │ └────────┴───────┘ │       ║
║  │ 01 │ 02 │ 03 │ 04 │      │   Automation →     │       ║
║  └────┴────┴────┴────┘      └────────────────────┘       ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║ 7. FUTURE VISION                                   dark  ║
║  Heading + lead  |  expanding node network (SVG)         ║
║  ┌────┬────┬────┬────┐  four pillars                     ║
║  └────┴────┴────┴────┘                                   ║
║  centred closing line                                    ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║ 8. CTA                     conic gradient + blur, dark   ║
║        [logo mark]                                       ║
║        Let's Build a Better Future Together              ║
║        ( Start the Conversation )  ( See our services )   ║
║        reassurance line                                  ║
╚══════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────┐
│ FOOTER — brand, three link columns, legal, back-to-top   │
└──────────────────────────────────────────────────────────┘
```

---

## Header behaviour

| State | Trigger | Appearance |
|-------|---------|-----------|
| Transparent | `scrollY ≤ 32` | White logo/nav directly on the hero |
| Condensed | `scrollY > 32` | `hh-glass-strong` bar, ink nav, gradient CTA |
| Mobile panel | menu button | Full-width glass sheet, body scroll locked, Esc closes |

Nav items highlight via `IntersectionObserver` with `rootMargin: -45% 0 -50% 0` — the
active section is whichever one occupies the middle band of the viewport, which matches
what a reader perceives as "where I am" better than a top-edge test.

The full nav appears at `xl` (1280px). Below that it collapses to the menu button —
six items plus a language toggle plus a CTA is genuinely too much for 1024px, and
shrinking the type to fit is worse than collapsing.
