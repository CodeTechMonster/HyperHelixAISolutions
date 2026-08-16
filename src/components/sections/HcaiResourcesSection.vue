<script setup lang="ts">
import SectionHeading from '@/components/ui/SectionHeading.vue'
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import { useI18n } from '@/composables/useI18n'

const { t, isCJK } = useI18n()
</script>

<template>
  <section
    id="hcai-resources"
    class="hh-section relative overflow-hidden bg-white"
    aria-labelledby="hcai-resources-heading"
  >
    <div class="hh-aurora right-0 top-0 h-96 w-96 text-aurora-100" aria-hidden="true" />

    <div class="hh-container relative">
      <SectionHeading
        heading-id="hcai-resources-heading"
        :eyebrow="t.hcaiResources.eyebrow"
        :title="t.hcaiResources.title"
        :lead="t.hcaiResources.lead"
      />

      <!-- Featured thought leaders -->
      <div class="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <RevealOnScroll
          v-for="(leader, index) in t.hcaiResources.thoughtLeaders"
          :key="leader.id"
          :delay="index * 90"
        >
          <GlassCard padding="lg" class="h-full">
            <span
              class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-space-800 to-space-600 text-white shadow-glass"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 4.3a3.1 3.1 0 1 1 0 6.2 3.1 3.1 0 0 1 0-6.2Z" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4.9 20.3a7.1 7.1 0 0 1 14.2 0" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>

            <h3 class="mt-7 text-title text-space-900" :class="isCJK && 'lang-ko'">
              {{ leader.name }}
            </h3>
            <p class="mt-1.5 text-sm font-semibold text-cyan-700" :class="isCJK && 'lang-ko'">
              {{ leader.role }}
            </p>
            <p class="mt-3.5 text-[0.98rem] leading-relaxed text-mist-700" :class="isCJK && 'lang-ko'">
              {{ leader.body }}
            </p>

            <a
              :href="leader.href"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-sm font-semibold text-space-800 underline-offset-4 transition-colors hover:text-cyan-700 hover:underline"
            >
              {{ leader.href.replace(/^https?:\/\//, '').replace(/\/$/, '') }}
              <svg viewBox="0 0 12 12" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <path d="M4 2h6v6M10 2 3 9" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="hh-sr-only">{{ t.a11y.opensInNewTab }}</span>
            </a>
          </GlassCard>
        </RevealOnScroll>
      </div>

      <!-- Additional resources -->
      <RevealOnScroll :delay="100">
        <p class="mt-20 flex items-center gap-3 text-eyebrow uppercase text-space-400">
          <span class="h-px w-8 bg-space-300" aria-hidden="true" />
          {{ t.hcaiResources.resourcesTitle }}
        </p>
      </RevealOnScroll>

      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RevealOnScroll
          v-for="(resource, index) in t.hcaiResources.resources"
          :key="resource.id"
          :delay="index * 70"
        >
          <a
            :href="resource.href"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex h-full flex-col rounded-card border border-mist-200 bg-mist-50 p-6 transition-[transform,box-shadow,border-color] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-cyan-200 hover:bg-white hover:shadow-glass motion-reduce:transform-none motion-reduce:transition-none"
          >
            <div class="flex items-start justify-between gap-3">
              <h4 class="font-display text-base font-semibold text-space-900" :class="isCJK && 'lang-ko'">
                {{ resource.name }}
              </h4>
              <svg
                viewBox="0 0 12 12"
                class="mt-1 h-3.5 w-3.5 shrink-0 text-mist-400 transition-colors duration-300 group-hover:text-cyan-600"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <path d="M4 2h6v6M10 2 3 9" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <p class="mt-2.5 text-sm leading-relaxed text-mist-700" :class="isCJK && 'lang-ko'">
              {{ resource.description }}
            </p>
            <span class="hh-sr-only">{{ t.a11y.opensInNewTab }}</span>
          </a>
        </RevealOnScroll>
      </div>

      <!-- Philosophy statement -->
      <RevealOnScroll :delay="120">
        <div
          class="relative mt-16 overflow-hidden rounded-panel bg-gradient-to-br from-space-800 via-space-700 to-space-900 p-8 text-white shadow-glow sm:p-12"
        >
          <div class="hh-aurora -left-24 -top-24 h-72 w-72 text-cyan-500/25" aria-hidden="true" />
          <div class="hh-aurora -bottom-24 -right-24 h-72 w-72 text-aurora-500/25" aria-hidden="true" />

          <div class="relative max-w-3xl">
            <h3 class="text-title text-white" :class="isCJK && 'lang-ko'">
              {{ t.hcaiResources.philosophy.title }}
            </h3>
            <p
              v-for="(paragraph, index) in t.hcaiResources.philosophy.paragraphs"
              :key="index"
              class="mt-4 text-[0.98rem] leading-relaxed text-mist-300"
              :class="isCJK && 'lang-ko'"
            >
              {{ paragraph }}
            </p>
            <p
              class="mt-7 border-l-2 border-cyan-400/70 pl-5 font-display text-lg font-semibold leading-snug text-cyan-200 sm:text-xl"
              :class="isCJK && 'lang-ko'"
            >
              {{ t.hcaiResources.philosophy.closing }}
            </p>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  </section>
</template>
