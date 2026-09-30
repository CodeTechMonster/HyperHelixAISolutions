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
| Configure or disable the AI chatbot | `src/components/chatbot/chatbot.config.ts` |
| Edit the Privacy / Terms / Accessibility text | `footer.legal` in `src/content/en.ts` / `ko.ts` (opened at `/#privacy`, `/#terms`, `/#accessibility`) |

Every user-facing string is in the content files and typed against `SiteContent`.
Components contain no literal copy — so copy edits never require touching a `.vue`
file, and adding a locale surfaces every missing string as a type error.

## Before you deploy

1. **Set the domain.** `SITE_URL` in `src/composables/useSeo.ts`, plus the absolute
   URLs in `index.html`, `public/sitemap.xml` and `public/robots.txt`.
2. **Add the two raster assets** referenced by `index.html`: `public/og-image.png`
   (1200×630) and `public/apple-touch-icon.png` (180×180). Both can be generated from
   `public/favicon.svg`.
3. **Drop in a founder photo** if you have one. `CeoStorySection.vue` has a marked
   placeholder plate; swap the inner block for an `<img>` at 4:5, `object-cover`.
4. **Self-host the fonts** for the last few Lighthouse points — see
   `docs/04-responsive-and-performance.md`.

Deploys as static output to any host (Vercel, Netlify, Cloudflare Pages, S3).

## Hyper Helix AI chatbot

A floating assistant in the lower-right corner. The model, an open Qwen3 model, runs
**on the visitor's own device** in the browser. It costs $0: no paid APIs, no server,
no Hugging Face Space, no secrets, and nothing to set up beyond deploying the site.

### How it works

```
hyperhelix.ca (GitHub Pages, static)
  └─ HyperHelixChatbot.vue ──> chatService.ts ──> Web Worker (browserModel.worker.ts)
                                                     └─ transformers.js + WebGPU
                                                          └─ onnx-community/Qwen3-0.6B-ONNX
                                                             (downloaded once from the HF Hub)
```

- On first use, the panel asks the visitor to **load the AI** (about 580 MB, one time).
  The files come straight from the Hugging Face Hub and are cached by the browser, so
  later visits load them from the cache without asking again.
- The model runs in a Web Worker on the visitor's GPU (WebGPU), so the page never
  freezes. Replies stream in token by token, and a stop button cancels generation.
- **Privacy:** conversations never leave the device. They aren't sent to a server,
  stored or logged. Reloading the page starts fresh.
- The panel says clearly that this is an **experimental** small AI and shows the
  model's spec (name, size, license, where it runs) so visitors know what to expect.
- Every "Start the Conversation" button on the site (header, mobile menu, the closing
  call-to-action section, the footer link) opens the chatbot. With the chatbot disabled,
  those buttons go back to their original targets.
- The UI only knows the `ChatService` interface, so a different backend could be
  added later without touching the component.
- Nothing loads until the visitor opens the chat. The widget is an ~18 kB chunk; the
  worker and inference runtime (~0.5 MB) load only after the visitor opts in.

| File | Role |
|---|---|
| `src/components/chatbot/chatbot.config.ts` | **Single config point**: on/off flag, model and its spec card, system prompt, welcome message |
| `src/components/chatbot/chatService.ts` | Talks to the model worker; the only thing the UI depends on |
| `src/components/chatbot/browserModel.worker.ts` | Loads and runs the model (transformers.js) off the main thread |
| `src/components/chatbot/HyperHelixChatbot.vue` | Launcher, panel, setup card, messages, composer |
| `src/components/chatbot/chatbot.content.ts` | EN/KO UI copy |
| `src/components/chatbot/openChatbot.ts` | Lets other components (the CTA buttons) open the panel |

### Browser support

The model needs **WebGPU with 16-bit shader support**:

- Desktop Chrome or Edge, and recent Safari: generally supported.
- Phones: possible on recent devices, but slow and memory-hungry.
- Unsupported browsers: the panel explains that the on-device AI can't run there.
  The rest of the site is unaffected.

### Run locally

```bash
npm install
npm run dev        # http://localhost:5173 → open the chat → "Load the AI"
```

### Deploy

Nothing extra to do. Push to `main`, and GitHub Actions builds and publishes to GitHub
Pages as before.

### Change the system prompt

Edit `systemPrompt` in `chatbot.config.ts`.

### Change the model

Set `model.id`, `model.downloadSizeMB` and the spec card in `model.info` in
`chatbot.config.ts`. Any ONNX chat
model on the Hub that ships a `q4f16` build and works with transformers.js
`AutoModelForCausalLM` should work. The `onnx-community` organization has many.

- `onnx-community/Qwen3-0.6B-ONNX` (default): about 580 MB, fast, basic quality.
- `onnx-community/Qwen3-1.7B-ONNX`: better answers, but a much bigger download.
  Check the file size of `onnx/model_q4f16.onnx` on the model page before switching.

The worker passes `enable_thinking: false` to the chat template so that Qwen3 answers
directly. Other models' templates ignore that setting.

### Disable the chatbot

Set `enabled: false` in `chatbot.config.ts`. The component is never rendered, its
code never loads, and the "Start the Conversation" buttons go back to their original
targets. To remove it completely:

1. Delete `src/components/chatbot/`.
2. Remove the chatbot imports, the `HyperHelixChatbot` constant and the
   `<HyperHelixChatbot>` tag from `src/App.vue`.
3. Remove the `onStartConversation` import and its `@click` handlers from
   `SiteHeader.vue`, `SiteFooter.vue` and `CtaSection.vue`.
4. Run `npm uninstall @huggingface/transformers`.

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
