<script setup lang="ts">
import BrandLogo from '@/components/brand/BrandLogo.vue'
import { useI18n } from '@/composables/useI18n'

const { t, isCJK } = useI18n()
</script>

<template>
  <footer class="relative overflow-hidden bg-space-950 text-mist-400">
    <div class="bg-grid-dark absolute inset-0 opacity-40" aria-hidden="true" />
    <div
      class="hh-aurora -left-24 top-0 h-72 w-72 text-cyan-500/20"
      aria-hidden="true"
    />

    <div class="hh-container relative py-16 lg:py-20">
      <div class="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <BrandLogo tone="dark" />
          <p class="mt-6 max-w-xs text-sm leading-relaxed" :class="isCJK && 'lang-ko'">
            {{ t.footer.tagline }}
          </p>
          <a
            :href="`mailto:${t.cta.email}`"
            class="mt-6 inline-block text-sm font-semibold text-cyan-300 underline-offset-4 hover:underline"
          >
            {{ t.cta.email }}
          </a>
        </div>

        <div class="grid gap-10 sm:grid-cols-3">
          <div v-for="column in t.footer.columns" :key="column.title">
            <h2 class="text-eyebrow uppercase text-white/50">{{ column.title }}</h2>
            <ul class="mt-5 space-y-3">
              <li v-for="link in column.links" :key="link.id">
                <a
                  :href="`#${link.id}`"
                  class="text-sm text-mist-400 transition-colors duration-200 hover:text-white"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="hh-rule my-12" aria-hidden="true" />

      <div class="flex flex-col gap-5 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>{{ t.footer.copyright }}</p>
        <ul class="flex flex-wrap gap-x-6 gap-y-2">
          <li v-for="item in t.footer.legal" :key="item">
            <a href="#top" class="transition-colors duration-200 hover:text-white">{{ item }}</a>
          </li>
        </ul>
        <a href="#top" class="font-semibold text-cyan-300 hover:text-cyan-200">
          {{ t.a11y.backToTop }} ↑
        </a>
      </div>
    </div>
  </footer>
</template>
