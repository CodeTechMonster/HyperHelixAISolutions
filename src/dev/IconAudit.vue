<script setup lang="ts">
import CategoryIcon from '@/components/ui/CategoryIcon.vue'
import HelixMark from '@/components/brand/HelixMark.vue'
import type { IconName } from '@/content/types'

/**
 * Internal brand reference page (`/icons.html`, noindex).
 * Renders every icon and logo lockup at the sizes they ship at, so visual
 * regressions in the glyph set are obvious at a glance.
 */
const ICONS: IconName[] = [
  'human',
  'time',
  'collaboration',
  'growth',
  'trust',
  'files',
  'document',
  'presentation',
  'contract',
  'workflow',
  'brain',
  'automation',
  'shield',
  'transform',
  'network',
  'spark',
]

const SWATCHES = [
  { name: 'Deep Space Blue', value: '#0A2342', className: 'bg-space-800' },
  { name: 'Electric Cyan', value: '#00C2FF', className: 'bg-cyan-500' },
  { name: 'Aurora Purple', value: '#7B61FF', className: 'bg-aurora-500' },
  { name: 'Soft White', value: '#F8FAFC', className: 'bg-mist-100' },
  { name: 'Ink', value: '#111827', className: 'bg-mist-900' },
]
</script>

<template>
  <div class="hh-container py-16">
    <h1 class="text-headline text-space-900">Brand & icon reference</h1>
    <p class="mt-3 text-mist-600">Internal page — not linked from the site, marked noindex.</p>

    <h2 class="mt-14 text-title text-space-900">Logo mark</h2>
    <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="flex h-40 items-center justify-center rounded-card border border-mist-200 bg-white">
        <span class="h-24"><HelixMark variant="full" title="Full colour" /></span>
      </div>
      <div class="flex h-40 items-center justify-center rounded-card border border-mist-200 bg-white text-space-800">
        <span class="h-24"><HelixMark variant="mono" title="Monochrome" /></span>
      </div>
      <div class="flex h-40 items-center justify-center rounded-card bg-space-900">
        <span class="h-24"><HelixMark variant="white" title="On dark" /></span>
      </div>
      <div class="flex h-40 items-center justify-center rounded-card border border-mist-200 bg-white">
        <span class="h-8"><HelixMark variant="full" title="Favicon size" /></span>
      </div>
    </div>

    <h2 class="mt-14 text-title text-space-900">Icon set</h2>
    <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
      <div
        v-for="name in ICONS"
        :key="name"
        class="rounded-card border border-mist-200 bg-white p-4 text-center"
      >
        <div class="flex items-center justify-center gap-3 text-space-800">
          <CategoryIcon :name="name" class="h-10 w-10" />
          <CategoryIcon :name="name" class="h-6 w-6" />
        </div>
        <p class="mt-3 text-[0.68rem] text-mist-600">{{ name }}</p>
      </div>
    </div>

    <h2 class="mt-14 text-title text-space-900">Colour</h2>
    <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
      <div v-for="s in SWATCHES" :key="s.name" class="rounded-card border border-mist-200 p-3">
        <div class="h-20 rounded-xl" :class="s.className" />
        <p class="mt-3 text-sm font-semibold text-space-900">{{ s.name }}</p>
        <p class="text-xs text-mist-600">{{ s.value }}</p>
      </div>
    </div>
  </div>
</template>
