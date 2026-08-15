<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal'

/**
 * Wraps content in an IntersectionObserver-driven fade-and-rise.
 * Purely additive: if JS or IO is unavailable the content is still rendered,
 * and `prefers-reduced-motion` disables the transform in CSS.
 */
const props = withDefaults(
  defineProps<{
    /** Stagger in milliseconds. Use small increments across a grid. */
    delay?: number
    as?: string
    threshold?: number
  }>(),
  { delay: 0, as: 'div', threshold: 0.15 },
)

const { target } = useScrollReveal({ threshold: props.threshold })
</script>

<template>
  <component
    :is="as"
    :ref="(el: unknown) => (target = el as HTMLElement | null)"
    class="hh-reveal"
    :style="{ '--reveal-delay': `${delay}ms` }"
  >
    <slot />
  </component>
</template>
