<script setup lang="ts">
import { computed, useId } from 'vue'

/**
 * The Hyper Helix "H" monogram, rebuilt as inline SVG.
 *
 * Two slab uprights form the H; a double-helix ribbon twists between them,
 * with a metallic highlight at the crossing point. Vector so it stays crisp at
 * favicon size, animatable, and recolourable per surface.
 */
const props = withDefaults(
  defineProps<{
    /** Colour treatment. `mono` for print, `white` for dark surfaces. */
    variant?: 'full' | 'mono' | 'white'
    /** Accessible name. Omit for decorative use (renders aria-hidden). */
    title?: string
    /** Subtle idle rotation on the ribbon. Respects prefers-reduced-motion. */
    animated?: boolean
  }>(),
  { variant: 'full', title: '', animated: false },
)

const uid = useId()
const barGradient = `hh-bar-${uid}`
const ribbonGradient = `hh-ribbon-${uid}`
const ribbonLightGradient = `hh-ribbon-light-${uid}`
const metalGradient = `hh-metal-${uid}`

const barFill = computed(() => {
  if (props.variant === 'white') return '#ffffff'
  if (props.variant === 'mono') return 'currentColor'
  return `url(#${barGradient})`
})

// On dark surfaces the uprights go solid white and the ribbon keeps its cyan
// gradient — otherwise the whole mark flattens into an unreadable white blob.
const ribbonFill = computed(() => {
  if (props.variant === 'white') return `url(#${ribbonLightGradient})`
  if (props.variant === 'mono') return 'currentColor'
  return `url(#${ribbonGradient})`
})

const metalFill = computed(() => {
  if (props.variant === 'full') return `url(#${metalGradient})`
  return props.variant === 'white' ? 'rgba(255,255,255,0.75)' : 'currentColor'
})
</script>

<template>
  <svg
    viewBox="0 0 120 148"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :role="title ? 'img' : undefined"
    :aria-hidden="title ? undefined : 'true'"
    :aria-label="title || undefined"
    class="hh-mark"
    :class="{ 'hh-mark--animated': animated }"
  >
    <defs>
      <linearGradient :id="barGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#123058" />
        <stop offset="55%" stop-color="#0a2342" />
        <stop offset="100%" stop-color="#04101f" />
      </linearGradient>

      <linearGradient :id="ribbonGradient" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#47d7ff" />
        <stop offset="28%" stop-color="#00c2ff" />
        <stop offset="66%" stop-color="#1d4278" />
        <stop offset="100%" stop-color="#0a2342" />
      </linearGradient>

      <linearGradient :id="ribbonLightGradient" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#85e6ff" />
        <stop offset="35%" stop-color="#00c2ff" />
        <stop offset="100%" stop-color="#7b61ff" />
      </linearGradient>

      <linearGradient :id="metalGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#c9d3de" />
        <stop offset="45%" stop-color="#f4f7fa" />
        <stop offset="100%" stop-color="#9aa9b8" />
      </linearGradient>
    </defs>

    <!-- Uprights: slab parallelograms, left raised and right dropped so the
         monogram reads as an H even when the ribbon is stripped out. -->
    <g :fill="barFill">
      <path d="M26 30 L52 22 L52 112 L26 120 Z" />
      <path d="M68 40 L94 32 L94 122 L68 130 Z" />
    </g>

    <!-- Metallic twist at the crossing point (behind the ribbon). -->
    <path d="M50 70 L74 63 L76 76 L52 83 Z" :fill="metalFill" opacity="0.95" />

    <!-- The helix ribbon: one continuous band, narrowing at the twist. -->
    <g class="hh-mark__ribbon">
      <path
        :fill="ribbonFill"
        d="M104 14
           C104 46 86 63 60 73
           C34 83 18 103 22 134
           L35 129
           C31 104 46 87 69 78
           C93 67 95 44 93 16
           Z"
      />
    </g>
  </svg>
</template>

<style scoped>
.hh-mark {
  display: block;
  height: 100%;
  width: auto;
}

.hh-mark--animated .hh-mark__ribbon {
  transform-origin: 60px 74px;
  animation: hh-ribbon-breathe 9s var(--ease-in-out-soft) infinite;
}

@keyframes hh-ribbon-breathe {
  0%,
  100% {
    transform: rotateY(0deg) scale(1);
  }
  50% {
    transform: rotateY(14deg) scale(1.015);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hh-mark--animated .hh-mark__ribbon {
    animation: none;
  }
}
</style>
