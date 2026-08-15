<script setup lang="ts">
import SectionHeading from '@/components/ui/SectionHeading.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import CategoryIcon from '@/components/ui/CategoryIcon.vue'
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import { useI18n } from '@/composables/useI18n'

const { t, isCJK } = useI18n()

const SPANS = [
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-3',
  'lg:col-span-3',
] as const
</script>

<template>
  <section
    id="stories"
    class="hh-section relative overflow-hidden bg-space-900 text-white"
    aria-labelledby="stories-heading"
  >
    <div class="bg-grid-dark absolute inset-0 opacity-50" aria-hidden="true" />
    <div class="hh-aurora left-1/4 -top-20 h-80 w-80 text-cyan-500/20" aria-hidden="true" />
    <div class="hh-aurora right-0 bottom-10 h-96 w-96 text-aurora-500/20" aria-hidden="true" />

    <div class="hh-container relative">
      <SectionHeading
        heading-id="stories-heading"
        tone="dark"
        :eyebrow="t.stories.eyebrow"
        :title="t.stories.title"
        :lead="t.stories.lead"
      />

      <div class="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
        <RevealOnScroll
          v-for="(story, index) in t.stories.items"
          :key="story.id"
          :delay="index * 70"
          :class="SPANS[index]"
        >
          <GlassCard tone="dark" class="h-full">
            <div class="flex items-start justify-between gap-4">
              <span
                class="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-500/10 text-cyan-200"
              >
                <CategoryIcon :name="story.icon" class="h-6 w-6" />
              </span>
              <span
                class="rounded-pill border border-white/12 bg-white/5 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-mist-400"
              >
                {{ story.tag }}
              </span>
            </div>

            <h3 class="mt-6 text-title text-white" :class="isCJK && 'lang-ko'">
              {{ story.title }}
            </h3>

            <!-- Headline outcome, stated before the detail -->
            <div class="mt-5 flex items-baseline gap-3 border-y border-white/10 py-4">
              <span class="hh-gradient-text font-display text-3xl font-bold">
                {{ story.metric.value }}
              </span>
              <span class="text-xs leading-tight text-mist-400" :class="isCJK && 'lang-ko'">
                {{ story.metric.label }}
              </span>
            </div>

            <dl class="mt-5 space-y-4 text-sm">
              <div
                v-for="row in [
                  { label: t.stories.labels.problem, body: story.problem, accent: 'bg-mist-500' },
                  { label: t.stories.labels.solution, body: story.solution, accent: 'bg-cyan-400' },
                  { label: t.stories.labels.impact, body: story.impact, accent: 'bg-aurora-400' },
                ]"
                :key="row.label"
              >
                <dt class="flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-mist-500">
                  <span class="h-1.5 w-1.5 rounded-full" :class="row.accent" aria-hidden="true" />
                  {{ row.label }}
                </dt>
                <dd class="mt-1.5 leading-relaxed text-mist-300" :class="isCJK && 'lang-ko'">
                  {{ row.body }}
                </dd>
              </div>
            </dl>
          </GlassCard>
        </RevealOnScroll>
      </div>

      <RevealOnScroll :delay="120">
        <p class="mt-10 max-w-3xl text-xs leading-relaxed text-mist-500" :class="isCJK && 'lang-ko'">
          {{ t.stories.footnote }}
        </p>
      </RevealOnScroll>
    </div>
  </section>
</template>
