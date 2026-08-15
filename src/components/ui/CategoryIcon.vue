<script setup lang="ts">
import { computed, useId } from 'vue'
import type { IconName } from '@/content/types'

/**
 * One icon system for the whole site.
 *
 * Every glyph is a 24px outline built on the same 1.5 stroke, and the
 * "container" glyphs (shield, brain, folder, monitor…) carry a small helix
 * inside them — the same relationship the brand icon sheet uses, so a service
 * card and the logo obviously belong to each other.
 */
const props = withDefaults(
  defineProps<{ name: IconName; helixTone?: 'brand' | 'inherit' }>(),
  { helixTone: 'brand' },
)

interface IconDef {
  paths: string[]
  /** SVG transform placing the shared helix glyph inside the container. */
  helix?: string
}

/**
 * The shared helix glyph: two mirrored strands over a full period, drawn around
 * the origin so one translate/scale places it inside any container shape.
 *
 * A full period matters. Strands that cross only once render as a plain ✗ at
 * icon sizes; crossing twice produces the paired lens shapes that read
 * unmistakably as a double helix even at 16px.
 */
const HELIX_A = 'M-3.4 -6C-3.4 -3.4 3.4 -2.6 3.4 0C3.4 2.6 -3.4 3.4 -3.4 6'
const HELIX_B = 'M3.4 -6C3.4 -3.4 -3.4 -2.6 -3.4 0C-3.4 2.6 3.4 3.4 3.4 6'

const ICONS: Record<IconName, IconDef> = {
  human: {
    paths: [
      'M12 4.3a3.1 3.1 0 1 1 0 6.2 3.1 3.1 0 0 1 0-6.2Z',
      'M4.9 20.3a7.1 7.1 0 0 1 14.2 0',
    ],
  },
  time: {
    paths: ['M12 3.4a8.6 8.6 0 1 1 0 17.2 8.6 8.6 0 0 1 0-17.2Z', 'M12 7.4V12l3.2 2'],
  },
  collaboration: {
    paths: [
      'M12 3.6a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6Z',
      'M5.2 15.4a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6Z',
      'M18.8 15.4a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6Z',
      'M10.3 9.7 6.6 14M13.7 9.7l3.7 4.3M7.5 17.7h9',
    ],
  },
  growth: {
    paths: ['M3.6 18.8 9.4 12l3.6 3.4L20.4 6.2', 'M15.6 6.2h4.8v4.8'],
  },
  trust: {
    paths: ['M12 3.1 19.5 5.9v5.6c0 4.4-3 7.6-7.5 9.4-4.5-1.8-7.5-5-7.5-9.4V5.9L12 3.1Z'],
    helix: 'translate(12 12.4) scale(0.82)',
  },
  files: {
    paths: [
      'M3.4 7.4a1.6 1.6 0 0 1 1.6-1.6h3.5l1.8 2.3h8.7a1.6 1.6 0 0 1 1.6 1.6v8.5a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6V7.4Z',
    ],
    helix: 'translate(12 13.6) scale(0.72)',
  },
  document: {
    paths: ['M6.3 3.4h7.4l5 5v12.2H6.3V3.4Z', 'M13.5 3.4v5.2h5.2'],
    helix: 'translate(12.4 14) scale(0.72)',
  },
  presentation: {
    paths: ['M3.4 4.6h17.2v11.3H3.4V4.6Z', 'M12 15.9v3.5M8.7 19.4h6.6'],
    helix: 'translate(12 10.2) scale(0.68)',
  },
  contract: {
    paths: ['M6.3 3.4h7.4l5 5v12.2H6.3V3.4Z', 'M13.5 3.4v5.2h5.2', 'M9 15.6l1.9 1.9 3.9-4'],
    helix: 'translate(12.4 12) scale(0.58)',
  },
  workflow: {
    paths: [
      'M3.4 4.6h5.4v4H3.4v-4Z',
      'M15.2 15.4h5.4v4h-5.4v-4Z',
      'M8.8 6.6h3.6a2 2 0 0 1 2 2v6.8',
      'M12.6 13.5 14.4 15.4l1.8-1.9',
    ],
  },
  brain: {
    paths: [
      'M12 4.2c-2.1 0-3.8 1.4-4.1 3.3-1.8.4-3.1 1.9-3.1 3.7 0 1.1.5 2.1 1.2 2.8-.2.5-.3 1-.3 1.5 0 2 1.7 3.6 3.8 3.6.9 0 1.7-.3 2.4-.8.7.5 1.5.8 2.4.8 2.1 0 3.8-1.6 3.8-3.6 0-.5-.1-1-.3-1.5.7-.7 1.2-1.7 1.2-2.8 0-1.8-1.3-3.3-3.1-3.7-.3-1.9-2-3.3-4.1-3.3Z',
    ],
    helix: 'translate(12 12.4) scale(0.72)',
  },
  automation: {
    paths: [
      'M12 5.6a6.4 6.4 0 1 1 0 12.8 6.4 6.4 0 0 1 0-12.8Z',
      'M12 2.9v2.2M12 18.9v2.2M21.1 12h-2.2M5.1 12H2.9M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6',
    ],
    helix: 'translate(12 12) scale(0.62)',
  },
  shield: {
    paths: [
      'M12 3.1 19.5 5.9v5.6c0 4.4-3 7.6-7.5 9.4-4.5-1.8-7.5-5-7.5-9.4V5.9L12 3.1Z',
      'M8.9 11.9l2.2 2.2 4-4.3',
    ],
  },
  transform: {
    paths: [
      'M4.4 10.6A7.7 7.7 0 0 1 17.3 7l2.3 2.2',
      'M19.6 13.4A7.7 7.7 0 0 1 6.7 17l-2.3-2.2',
      'M19.6 4.6v4.6H15M4.4 19.4v-4.6h4.6',
    ],
  },
  network: {
    paths: [
      'M12 9.6a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8Z',
      'M12 2.8a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM4.4 16.2a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM19.6 16.2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z',
      'M12 6.8v2.8M10 13.9l-4.2 2.9M14 13.9l4.2 2.9',
    ],
  },
  spark: {
    paths: [
      'M11 3.2 12.8 8.4 18 10.2 12.8 12 11 17.2 9.2 12 4 10.2 9.2 8.4 11 3.2Z',
      'M18.2 15.4l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9.9-2.3Z',
    ],
  },
}

const uid = useId()
const gradientId = `hh-icon-${uid}`
const def = computed(() => ICONS[props.name])
const helixStroke = computed(() =>
  props.helixTone === 'brand' ? `url(#${gradientId})` : 'currentColor',
)
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00c2ff" />
        <stop offset="100%" stop-color="#7b61ff" />
      </linearGradient>
    </defs>

    <path v-for="(d, i) in def.paths" :key="i" :d="d" />

    <g v-if="def.helix" :transform="def.helix" :stroke="helixStroke" stroke-width="1.7">
      <path :d="HELIX_A" />
      <path :d="HELIX_B" />
    </g>
  </svg>
</template>
