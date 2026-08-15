<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    tone?: 'light' | 'dark'
    /** Adds pointer-driven lift, glow border and gradient sheen. */
    interactive?: boolean
    padding?: 'sm' | 'md' | 'lg'
  }>(),
  { tone: 'light', interactive: true, padding: 'md' },
)

const paddings = { sm: 'p-6', md: 'p-7 sm:p-8', lg: 'p-8 sm:p-10' } as const

const classes = computed(() => [
  'group relative isolate flex flex-col overflow-hidden rounded-card',
  paddings[props.padding],
  props.tone === 'dark' ? 'hh-glass-dark text-white' : 'hh-glass',
  props.interactive &&
    'transition-[transform,box-shadow,border-color] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] ' +
      'hover:-translate-y-1.5 hover:shadow-lift focus-within:-translate-y-1.5 ' +
      'motion-reduce:transform-none motion-reduce:transition-none',
  props.interactive && props.tone === 'light' && 'hover:border-cyan-200',
  props.interactive && props.tone === 'dark' && 'hover:border-cyan-400/40',
])
</script>

<template>
  <div :class="classes">
    <!-- Sheen: a soft brand-gradient wash that fades in on hover. -->
    <span
      v-if="interactive"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
      :class="
        tone === 'dark'
          ? 'bg-gradient-to-br from-cyan-500/12 via-transparent to-aurora-500/12'
          : 'bg-gradient-to-br from-cyan-50 via-transparent to-aurora-50'
      "
    />
    <slot />
  </div>
</template>
