<script setup lang="ts">
import SectionHeading from '@/components/ui/SectionHeading.vue'
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import CategoryIcon from '@/components/ui/CategoryIcon.vue'
import NodeNetwork from '@/components/visuals/NodeNetwork.vue'
import { useI18n } from '@/composables/useI18n'

const { t, isCJK } = useI18n()
</script>

<template>
  <section
    id="vision"
    class="hh-section relative overflow-hidden bg-space-900 text-white"
    aria-labelledby="vision-heading"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(85%_70%_at_75%_25%,#123058_0%,#071a33_50%,#04101f_100%)]"
      aria-hidden="true"
    />
    <div class="bg-grid-dark absolute inset-0 opacity-40" aria-hidden="true" />

    <div class="hh-container relative">
      <div class="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-20">
        <div>
          <SectionHeading
            heading-id="vision-heading"
            tone="dark"
            :eyebrow="t.future.eyebrow"
            :title="t.future.title"
            :lead="t.future.lead"
          />
        </div>

        <!-- The helix opening outward into a knowledge network -->
        <RevealOnScroll :delay="140">
          <div class="relative mx-auto w-full max-w-lg">
            <div class="hh-aurora inset-6 text-aurora-500/20" aria-hidden="true" />
            <NodeNetwork class="relative" />
          </div>
        </RevealOnScroll>
      </div>

      <div class="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <RevealOnScroll
          v-for="(pillar, index) in t.future.pillars"
          :key="pillar.id"
          :delay="index * 90"
        >
          <div
            class="hh-glass-dark group h-full rounded-card p-7 transition-[transform,border-color] duration-500 hover:-translate-y-1.5 hover:border-cyan-400/40 motion-reduce:transform-none motion-reduce:transition-none"
          >
            <span
              class="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-500/10 text-cyan-200"
            >
              <CategoryIcon :name="pillar.icon" class="h-6 w-6" />
            </span>
            <h3 class="mt-6 font-display text-base font-semibold text-white" :class="isCJK && 'lang-ko'">
              {{ pillar.title }}
            </h3>
            <p class="mt-2.5 text-sm leading-relaxed text-mist-400" :class="isCJK && 'lang-ko'">
              {{ pillar.body }}
            </p>
          </div>
        </RevealOnScroll>
      </div>

      <RevealOnScroll :delay="120">
        <p
          class="mx-auto mt-20 max-w-3xl text-center font-display text-xl font-semibold leading-snug text-mist-200 sm:text-2xl"
          :class="isCJK && 'lang-ko'"
        >
          {{ t.future.closing }}
        </p>
      </RevealOnScroll>
    </div>
  </section>
</template>
