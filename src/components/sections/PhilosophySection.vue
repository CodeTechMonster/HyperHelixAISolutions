<script setup lang="ts">
import SectionHeading from '@/components/ui/SectionHeading.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import CategoryIcon from '@/components/ui/CategoryIcon.vue'
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import { useI18n } from '@/composables/useI18n'

const { t, isCJK } = useI18n()

/** Bento rhythm: two wide cards, then three equal — asymmetry keeps a
 *  five-item grid from reading as an incomplete six-item grid. */
const SPANS = [
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
] as const
</script>

<template>
  <section id="philosophy" class="hh-section bg-mist-100" aria-labelledby="philosophy-heading">
    <div class="bg-grid absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(80%_60%_at_50%_30%,black,transparent)]" aria-hidden="true" />
    <div class="hh-aurora -right-40 top-10 h-96 w-96 text-aurora-200/40" aria-hidden="true" />

    <div class="hh-container relative">
      <SectionHeading
        heading-id="philosophy-heading"
        :eyebrow="t.philosophy.eyebrow"
        :title="t.philosophy.title"
        :lead="t.philosophy.lead"
      />

      <div class="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
        <RevealOnScroll
          v-for="(value, index) in t.philosophy.values"
          :key="value.id"
          :delay="index * 80"
          :class="SPANS[index]"
        >
          <GlassCard class="h-full">
            <span
              class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-space-800 to-space-600 text-white shadow-glass"
            >
              <CategoryIcon :name="value.icon" class="h-7 w-7" />
            </span>

            <h3 class="mt-7 text-title text-space-900" :class="isCJK && 'lang-ko'">
              {{ value.title }}
            </h3>
            <p class="mt-3.5 text-[0.98rem] leading-relaxed text-mist-700" :class="isCJK && 'lang-ko'">
              {{ value.body }}
            </p>

            <p
              class="mt-auto flex items-start gap-2.5 pt-6 text-sm font-medium text-space-500"
              :class="isCJK && 'lang-ko'"
            >
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" aria-hidden="true" />
              {{ value.note }}
            </p>
          </GlassCard>
        </RevealOnScroll>
      </div>
    </div>
  </section>
</template>
