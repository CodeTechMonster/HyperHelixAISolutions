<script setup lang="ts">
import { computed, useId } from 'vue'

/**
 * Expanding knowledge network for the Vision section.
 *
 * Deterministic SVG rather than canvas: it is static geometry with CSS-driven
 * pulses, so it costs nothing per frame and degrades to a clean still image
 * under prefers-reduced-motion.
 */
const uid = useId()
const glowId = `hh-net-glow-${uid}`
const lineId = `hh-net-line-${uid}`

interface Node {
  x: number
  y: number
  r: number
  delay: number
}

/** Three concentric rings — the helix opening outward into a network. */
const nodes = computed<Node[]>(() => {
  const out: Node[] = [{ x: 200, y: 150, r: 7, delay: 0 }]
  const rings = [
    { count: 6, radius: 62, r: 4.4 },
    { count: 10, radius: 108, r: 3.4 },
    { count: 14, radius: 152, r: 2.6 },
  ]
  rings.forEach((ring, ringIndex) => {
    for (let i = 0; i < ring.count; i++) {
      const angle = (i / ring.count) * Math.PI * 2 + ringIndex * 0.42
      out.push({
        x: 200 + Math.cos(angle) * ring.radius,
        y: 150 + Math.sin(angle) * ring.radius * 0.72,
        r: ring.r,
        delay: (ringIndex * 0.55 + i * 0.07) % 3,
      })
    }
  })
  return out
})

/** Connect every node to the two nearest nodes closer to the centre. */
const links = computed(() => {
  const list = nodes.value
  const out: { x1: number; y1: number; x2: number; y2: number; o: number }[] = []
  for (let i = 1; i < list.length; i++) {
    const node = list[i]!
    const candidates = list
      .slice(0, i)
      .map((other, index) => ({
        index,
        other,
        d: Math.hypot(other.x - node.x, other.y - node.y),
      }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)

    for (const c of candidates) {
      out.push({
        x1: node.x,
        y1: node.y,
        x2: c.other.x,
        y2: c.other.y,
        o: Math.max(0.06, 0.4 - c.d / 340),
      })
    }
  }
  return out
})
</script>

<template>
  <svg viewBox="0 0 400 300" class="h-full w-full" aria-hidden="true" role="presentation">
    <defs>
      <radialGradient :id="glowId">
        <stop offset="0%" stop-color="#00c2ff" stop-opacity="0.32" />
        <stop offset="70%" stop-color="#7b61ff" stop-opacity="0.06" />
        <stop offset="100%" stop-color="#7b61ff" stop-opacity="0" />
      </radialGradient>
      <linearGradient :id="lineId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00c2ff" />
        <stop offset="100%" stop-color="#7b61ff" />
      </linearGradient>
    </defs>

    <ellipse cx="200" cy="150" rx="190" ry="140" :fill="`url(#${glowId})`" />

    <g :stroke="`url(#${lineId})`" stroke-width="0.9">
      <line
        v-for="(l, i) in links"
        :key="`l-${i}`"
        :x1="l.x1"
        :y1="l.y1"
        :x2="l.x2"
        :y2="l.y2"
        :stroke-opacity="l.o"
      />
    </g>

    <g>
      <circle
        v-for="(n, i) in nodes"
        :key="`n-${i}`"
        :cx="n.x"
        :cy="n.y"
        :r="n.r"
        :fill="i === 0 ? `url(#${lineId})` : '#00c2ff'"
        :fill-opacity="i === 0 ? 1 : 0.62"
        class="hh-node"
        :style="{ animationDelay: `${n.delay}s` }"
      />
    </g>
  </svg>
</template>

<style scoped>
.hh-node {
  animation: hh-node-pulse 3.4s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes hh-node-pulse {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.28);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hh-node {
    animation: none;
    opacity: 0.8;
  }
}
</style>
