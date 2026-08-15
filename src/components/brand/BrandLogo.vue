<script setup lang="ts">
import HelixMark from './HelixMark.vue'
import { useI18n } from '@/composables/useI18n'

withDefaults(
  defineProps<{
    tone?: 'light' | 'dark'
    /** Hide the wordmark and show the monogram only (mobile / compact rails). */
    compact?: boolean
  }>(),
  { tone: 'light', compact: false },
)

const { t } = useI18n()
</script>

<template>
  <span class="flex items-center gap-3" :class="tone === 'dark' ? 'text-white' : 'text-space-800'">
    <span class="h-9 shrink-0 sm:h-10">
      <HelixMark :variant="tone === 'dark' ? 'white' : 'full'" animated />
    </span>

    <span v-if="!compact" class="flex flex-col leading-none">
      <span class="font-display text-[0.98rem] font-bold tracking-[-0.01em] sm:text-lg">
        {{ t.brand.nameShort }}
      </span>
      <span
        class="hh-keep-tracking mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.28em]"
        :class="tone === 'dark' ? 'text-cyan-300/80' : 'text-space-400'"
      >
        {{ t.brand.descriptor }}
      </span>
    </span>

    <span class="hh-sr-only">{{ t.brand.name }}</span>
  </span>
</template>
