<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    as?: 'a' | 'button'
    href?: string
    variant?: 'primary' | 'secondary' | 'ghost' | 'onDark'
    size?: 'md' | 'lg'
  }>(),
  { as: 'a', href: '#', variant: 'primary', size: 'md' },
)

const base =
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill font-semibold ' +
  'transition-[transform,box-shadow,background-color,color] duration-200 ease-out ' +
  'will-change-transform hover:-translate-y-0.5 active:translate-y-0 ' +
  'motion-reduce:transform-none motion-reduce:transition-none'

const sizes = {
  md: 'px-6 py-3 text-[0.95rem]',
  lg: 'px-8 py-4 text-base',
} as const

const variants = {
  primary:
    'bg-gradient-to-r from-cyan-500 to-aurora-500 text-white shadow-glow hover:shadow-lift',
  secondary:
    'bg-white text-space-800 border border-mist-300 shadow-glass hover:border-cyan-400 hover:text-space-900',
  ghost: 'text-space-700 hover:text-space-900 hover:bg-space-50',
  onDark:
    'hh-glass-dark text-white hover:bg-white/15 hover:border-white/25',
} as const

const classes = computed(() => [base, sizes[props.size], variants[props.variant]])
</script>

<template>
  <component :is="as" :href="as === 'a' ? href : undefined" :class="classes">
    <span><slot /></span>
    <svg
      v-if="variant !== 'ghost'"
      class="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </component>
</template>
