<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import RevealOnScroll from './RevealOnScroll.vue'

withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    lead?: string
    tone?: 'light' | 'dark'
    align?: 'left' | 'center'
    /** Id of the heading, used by aria-labelledby on the parent <section>. */
    headingId?: string
  }>(),
  { lead: '', tone: 'light', align: 'left', headingId: undefined },
)

const { isCJK } = useI18n()
</script>

<template>
  <div
    class="flex flex-col"
    :class="align === 'center' ? 'items-center text-center' : 'items-start text-left'"
  >
    <RevealOnScroll>
      <p
        class="flex items-center gap-3 text-eyebrow uppercase"
        :class="tone === 'dark' ? 'text-cyan-300' : 'text-space-400'"
      >
        <span
          class="h-px w-8"
          :class="tone === 'dark' ? 'bg-cyan-300/60' : 'bg-space-300'"
          aria-hidden="true"
        />
        {{ eyebrow }}
      </p>
    </RevealOnScroll>

    <RevealOnScroll :delay="90">
      <h2
        :id="headingId"
        class="mt-5 max-w-3xl text-headline"
        :class="[tone === 'dark' ? 'text-white' : 'text-space-900', isCJK && 'lang-ko']"
      >
        {{ title }}
      </h2>
    </RevealOnScroll>

    <RevealOnScroll v-if="lead" :delay="170">
      <p
        class="mt-6 max-w-2xl text-lead"
        :class="[tone === 'dark' ? 'text-mist-300' : 'text-mist-700', isCJK && 'lang-ko']"
      >
        {{ lead }}
      </p>
    </RevealOnScroll>
  </div>
</template>
