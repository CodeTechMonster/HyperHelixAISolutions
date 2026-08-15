<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import HelixMark from '@/components/brand/HelixMark.vue'
import { useI18n } from '@/composables/useI18n'

const { t, isCJK } = useI18n()
</script>

<template>
  <section
    id="contact"
    class="relative isolate overflow-hidden bg-space-950 py-24 text-white lg:py-32"
    aria-labelledby="cta-heading"
  >
    <div
      class="absolute inset-0 -z-20 bg-[conic-gradient(from_210deg_at_50%_50%,#0a2342_0deg,#123058_90deg,#4d33bd_190deg,#0079a5_280deg,#0a2342_360deg)] opacity-70"
      aria-hidden="true"
    />
    <div class="absolute inset-0 -z-10 bg-space-950/70 backdrop-blur-3xl" aria-hidden="true" />
    <div class="hh-aurora left-1/2 top-0 h-96 w-96 -translate-x-1/2 text-cyan-500/25" aria-hidden="true" />

    <div class="hh-container relative text-center">
      <RevealOnScroll>
        <span class="flex h-16 justify-center opacity-90">
          <HelixMark variant="white" animated />
        </span>
      </RevealOnScroll>

      <RevealOnScroll :delay="80">
        <p class="mt-8 text-eyebrow uppercase text-cyan-200">{{ t.cta.eyebrow }}</p>
      </RevealOnScroll>

      <RevealOnScroll :delay="140">
        <h2
          id="cta-heading"
          class="mx-auto mt-5 max-w-3xl text-display-2 text-white"
          :class="isCJK && 'lang-ko'"
        >
          {{ t.cta.title }}
        </h2>
      </RevealOnScroll>

      <RevealOnScroll :delay="210">
        <p class="mx-auto mt-7 max-w-2xl text-lead text-mist-300" :class="isCJK && 'lang-ko'">
          {{ t.cta.lead }}
        </p>
      </RevealOnScroll>

      <RevealOnScroll :delay="280">
        <div class="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <AppButton :href="`mailto:${t.cta.email}`" variant="primary" size="lg">
            {{ t.cta.button }}
          </AppButton>
          <AppButton href="#services" variant="onDark" size="lg">
            {{ t.cta.secondary }}
          </AppButton>
        </div>
      </RevealOnScroll>

      <RevealOnScroll :delay="340">
        <p class="mt-8 text-sm text-mist-400" :class="isCJK && 'lang-ko'">
          {{ t.cta.reassurance }}
        </p>
      </RevealOnScroll>
    </div>
  </section>
</template>
