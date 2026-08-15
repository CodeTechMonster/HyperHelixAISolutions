<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import type { Locale } from '@/content/types'

withDefaults(defineProps<{ tone?: 'light' | 'dark' }>(), { tone: 'light' })

const { locale, supported, setLocale, t } = useI18n()

/** Short codes keep the control compact in a crowded header; the full language
 *  name is exposed to assistive tech via aria-label. */
const LABELS: Record<Locale, string> = { en: 'EN', ko: 'KO' }
const FULL_NAMES: Record<Locale, string> = { en: 'English', ko: '한국어' }
</script>

<template>
  <div
    class="flex items-center rounded-pill p-1"
    :class="tone === 'dark' ? 'bg-white/10 ring-1 ring-white/15' : 'bg-mist-200/80 ring-1 ring-mist-300'"
    role="group"
    :aria-label="t.a11y.languageToggle"
  >
    <button
      v-for="code in supported"
      :key="code"
      type="button"
      class="rounded-pill px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors duration-200"
      :class="[
        locale === code
          ? tone === 'dark'
            ? 'bg-white text-space-800'
            : 'bg-white text-space-800 shadow-glass'
          : tone === 'dark'
            ? 'text-white/70 hover:text-white'
            : 'text-mist-600 hover:text-space-800',
      ]"
      :aria-pressed="locale === code"
      :aria-label="FULL_NAMES[code]"
      :lang="code"
      @click="setLocale(code)"
    >
      {{ LABELS[code] }}
    </button>
  </div>
</template>
