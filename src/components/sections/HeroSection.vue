<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import HelixCanvas from '@/components/visuals/HelixCanvas.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useI18n } from '@/composables/useI18n'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { t, isCJK } = useI18n()
const { prefersReducedMotion } = useReducedMotion()

const root = ref<HTMLElement | null>(null)
let cleanup: (() => void) | undefined

onMounted(async () => {
  if (prefersReducedMotion.value || !root.value) return

  // GSAP is code-split (see vite.config.ts) and imported after mount so it
  // never blocks first paint of the hero.
  const { gsap } = await import('gsap')

  const ctx = gsap.context(() => {
    gsap
      .timeline({ defaults: { ease: 'expo.out', duration: 1.1 } })
      .from('[data-hero="eyebrow"]', { y: 18, opacity: 0, duration: 0.8 }, 0.15)
      .from('[data-hero="line"]', { y: 46, opacity: 0, stagger: 0.09 }, 0.25)
      .from('[data-hero="sub"]', { y: 24, opacity: 0, duration: 0.9 }, 0.55)
      .from('[data-hero="cta"]', { y: 20, opacity: 0, stagger: 0.08, duration: 0.8 }, 0.7)
      .from('[data-hero="signal"]', { y: 18, opacity: 0, stagger: 0.1, duration: 0.8 }, 0.85)
      .from('[data-hero="hint"]', { opacity: 0, duration: 0.8 }, 1.2)
  }, root.value)

  cleanup = () => ctx.revert()
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <section
    id="top"
    ref="root"
    class="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-space-950 pb-16 pt-32 text-white lg:pb-24"
    aria-labelledby="hero-heading"
  >
    <!-- Layer 1: ambient gradient field -->
    <div
      class="absolute inset-0 -z-30 bg-[radial-gradient(120%_90%_at_50%_-10%,#123058_0%,#0a2342_38%,#04101f_78%)]"
      aria-hidden="true"
    />
    <!-- Layer 2: aurora blooms -->
    <div class="hh-aurora -left-32 top-24 h-[26rem] w-[26rem] text-cyan-500/25 -z-20" aria-hidden="true" />
    <div class="hh-aurora -right-24 bottom-0 h-[30rem] w-[30rem] text-aurora-500/25 -z-20" aria-hidden="true" />
    <!-- Layer 3: fine grid for depth -->
    <div class="bg-grid-dark absolute inset-0 -z-20 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" aria-hidden="true" />
    <!-- Layer 4: the animated double helix -->
    <div class="-z-10">
      <HelixCanvas />
    </div>

    <div class="hh-container relative">
      <div class="mx-auto max-w-4xl text-center">
        <p
          data-hero="eyebrow"
          class="inline-flex items-center gap-2.5 rounded-pill border border-white/15 bg-white/5 px-4 py-2 text-eyebrow uppercase text-cyan-200 backdrop-blur-sm"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
          {{ t.hero.eyebrow }}
        </p>

        <h1 id="hero-heading" class="mt-8 text-display-1" :class="isCJK && 'lang-ko'">
          <span data-hero="line" class="block text-white">{{ t.hero.headlineLead }}</span>
          <span data-hero="line" class="hh-gradient-text mt-1 block pb-2">
            {{ t.hero.headlineAccent }}
          </span>
        </h1>

        <p
          data-hero="sub"
          class="mx-auto mt-8 max-w-2xl text-lead text-mist-300"
          :class="isCJK && 'lang-ko'"
        >
          {{ t.hero.subheadline }}
        </p>

        <div class="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <AppButton data-hero="cta" href="#philosophy" variant="primary" size="lg">
            {{ t.hero.ctaPrimary }}
          </AppButton>
          <AppButton data-hero="cta" href="#stories" variant="onDark" size="lg">
            {{ t.hero.ctaSecondary }}
          </AppButton>
        </div>

        <!-- Proof signals -->
        <dl class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div
            v-for="signal in t.hero.signals"
            :key="signal.label"
            data-hero="signal"
            class="rounded-card border border-white/10 bg-white/[0.04] px-5 py-6 backdrop-blur-sm"
          >
            <dt class="hh-gradient-text font-display text-2xl font-bold sm:text-3xl">
              {{ signal.value }}
            </dt>
            <dd class="mt-2 text-[0.78rem] leading-snug text-mist-400" :class="isCJK && 'lang-ko'">
              {{ signal.label }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Scroll hint -->
    <div
      data-hero="hint"
      class="hh-container relative mt-14 hidden justify-center lg:flex"
    >
      <a
        href="#philosophy"
        class="group flex flex-col items-center gap-3 text-[0.68rem] uppercase tracking-[0.24em] text-mist-500 transition-colors hover:text-cyan-300"
      >
        {{ t.hero.scrollHint }}
        <span class="relative flex h-9 w-5 justify-center rounded-pill border border-mist-600/60">
          <span class="hh-scroll-dot mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.hh-scroll-dot {
  animation: hh-scroll 1.9s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes hh-scroll {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    transform: translateY(12px);
    opacity: 0;
  }
  100% {
    transform: translateY(12px);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hh-scroll-dot {
    animation: none;
  }
}
</style>
