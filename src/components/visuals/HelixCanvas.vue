<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useI18n } from '@/composables/useI18n'

/**
 * Animated DNA double helix — Canvas 2D.
 *
 * Why Canvas 2D and not Three.js: the whole visual is ~6KB of logic with no
 * dependency, no WebGL context cost, and no shader compile on first paint,
 * which is what keeps the hero LCP fast and Lighthouse above 95.
 *
 * Depth is faked with a single cosine: each node's z drives its radius, alpha
 * and blur, and nodes are painted back-to-front. That reads as 3D without a
 * matrix stack.
 *
 * Performance guards:
 *  - pauses when scrolled out of view (IntersectionObserver)
 *  - pauses when the tab is hidden (visibilitychange)
 *  - renders exactly one static frame under prefers-reduced-motion
 *  - caps devicePixelRatio at 2 and node count on small viewports
 */

const props = withDefaults(
  defineProps<{
    /** Number of full 360° twists across the visible height. */
    turns?: number
    /** Rotation speed in radians per second. */
    speed?: number
    /** Ambient particle count at desktop size. */
    particleCount?: number
    /** Follow the pointer with a slight parallax tilt. */
    interactive?: boolean
  }>(),
  { turns: 2.6, speed: 0.34, particleCount: 46, interactive: true },
)

const { prefersReducedMotion } = useReducedMotion()
const { t } = useI18n()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const wrapperRef = ref<HTMLDivElement | null>(null)

interface Particle {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  alpha: number
  hue: 'cyan' | 'aurora' | 'mist'
}

let ctx: CanvasRenderingContext2D | null = null
let rafId = 0
let width = 0
let height = 0
let dpr = 1
let phase = 0
let lastTime = 0
let inView = true
let particles: Particle[] = []
let pointerX = 0
let pointerY = 0
let targetPointerX = 0
let targetPointerY = 0

let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null

const NODE_COLORS = {
  cyan: '0, 194, 255',
  aurora: '123, 97, 255',
  mist: '169, 193, 224',
} as const

function nodeCount(): number {
  return width < 640 ? 44 : width < 1024 ? 58 : 74
}

function seedParticles() {
  const count = width < 640 ? Math.round(props.particleCount * 0.45) : props.particleCount
  const hues: Particle['hue'][] = ['cyan', 'aurora', 'mist']
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 0.6 + Math.random() * 1.9,
    vx: (Math.random() - 0.5) * 5,
    vy: -(4 + Math.random() * 12),
    alpha: 0.16 + Math.random() * 0.42,
    hue: hues[Math.floor(Math.random() * hues.length)]!,
  }))
}

function resize() {
  const canvas = canvasRef.value
  const wrapper = wrapperRef.value
  if (!canvas || !wrapper) return

  const rect = wrapper.getBoundingClientRect()
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = Math.max(1, rect.width)
  height = Math.max(1, rect.height)

  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  ctx = canvas.getContext('2d', { alpha: true })
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)

  seedParticles()
  if (prefersReducedMotion.value) draw(0)
}

function drawParticles(dt: number) {
  if (!ctx) return
  for (const p of particles) {
    if (dt > 0) {
      p.x += p.vx * dt
      p.y += p.vy * dt
      if (p.y < -12) {
        p.y = height + 12
        p.x = Math.random() * width
      }
      if (p.x < -12) p.x = width + 12
      if (p.x > width + 12) p.x = -12
    }
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${NODE_COLORS[p.hue]}, ${p.alpha})`
    ctx.fill()
  }
}

interface HelixNode {
  x: number
  y: number
  z: number
  strand: 0 | 1
  index: number
}

function draw(dt: number) {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  drawParticles(dt)

  const count = nodeCount()
  // The helix occupies a centred column; it never fills the full width so the
  // hero copy beside it keeps a clean, uncrowded measure.
  const cx = width * 0.5 + pointerX * 26
  const radiusX = Math.min(width * 0.19, 168)
  const top = height * 0.06
  const usableHeight = height * 0.88
  const tilt = pointerY * 0.05

  const nodes: HelixNode[] = []

  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1)
    const angle = ratio * props.turns * Math.PI * 2 + phase
    const y = top + ratio * usableHeight + Math.sin(angle) * tilt * 60

    for (const strand of [0, 1] as const) {
      const a = angle + strand * Math.PI
      nodes.push({
        x: cx + Math.sin(a) * radiusX,
        y,
        z: Math.cos(a), // -1 (far) … 1 (near)
        strand,
        index: i,
      })
    }
  }

  // --- Rungs: base pairs between the two strands -------------------------
  for (let i = 0; i < count; i += 2) {
    const a = nodes[i * 2]
    const b = nodes[i * 2 + 1]
    if (!a || !b) continue
    const depth = (a.z + b.z) * 0.5
    const alpha = 0.05 + (depth + 1) * 0.085
    const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
    gradient.addColorStop(0, `rgba(${NODE_COLORS.cyan}, ${alpha})`)
    gradient.addColorStop(1, `rgba(${NODE_COLORS.aurora}, ${alpha})`)
    ctx.strokeStyle = gradient
    ctx.lineWidth = 1 + (depth + 1) * 0.5
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }

  // --- Backbones: continuous ribbon through each strand ------------------
  for (const strand of [0, 1] as const) {
    const strandNodes = nodes.filter((n) => n.strand === strand)
    ctx.beginPath()
    strandNodes.forEach((n, i) => (i === 0 ? ctx!.moveTo(n.x, n.y) : ctx!.lineTo(n.x, n.y)))
    const stroke = ctx.createLinearGradient(cx - radiusX, top, cx + radiusX, top + usableHeight)
    stroke.addColorStop(0, `rgba(${NODE_COLORS.cyan}, ${strand === 0 ? 0.5 : 0.28})`)
    stroke.addColorStop(1, `rgba(${NODE_COLORS.aurora}, ${strand === 0 ? 0.32 : 0.18})`)
    ctx.strokeStyle = stroke
    ctx.lineWidth = strand === 0 ? 1.7 : 1.2
    ctx.stroke()
  }

  // --- Nodes: painter's algorithm, far to near ---------------------------
  nodes.sort((a, b) => a.z - b.z)
  for (const n of nodes) {
    const depth = (n.z + 1) * 0.5 // 0 … 1
    const radius = 1.5 + depth * 3.6
    const alpha = 0.2 + depth * 0.75
    const color = n.strand === 0 ? NODE_COLORS.cyan : NODE_COLORS.aurora

    if (depth > 0.72) {
      ctx.shadowBlur = 18 * depth
      ctx.shadowColor = `rgba(${color}, 0.6)`
    }
    ctx.beginPath()
    ctx.arc(n.x, n.y, radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${color}, ${alpha})`
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

function loop(time: number) {
  if (!lastTime) lastTime = time
  const dt = Math.min((time - lastTime) / 1000, 0.05)
  lastTime = time

  phase += props.speed * dt
  pointerX += (targetPointerX - pointerX) * 0.05
  pointerY += (targetPointerY - pointerY) * 0.05

  draw(dt)
  rafId = requestAnimationFrame(loop)
}

function start() {
  if (rafId || prefersReducedMotion.value || !inView) return
  lastTime = 0
  rafId = requestAnimationFrame(loop)
}

function stop() {
  if (!rafId) return
  cancelAnimationFrame(rafId)
  rafId = 0
}

function onPointerMove(event: PointerEvent) {
  if (!props.interactive) return
  targetPointerX = (event.clientX / window.innerWidth) * 2 - 1
  targetPointerY = (event.clientY / window.innerHeight) * 2 - 1
}

function onVisibilityChange() {
  document.hidden ? stop() : start()
}

onMounted(() => {
  const wrapper = wrapperRef.value
  if (!wrapper) return

  resize()

  resizeObserver = new ResizeObserver(() => resize())
  resizeObserver.observe(wrapper)

  intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      inView = !!entry?.isIntersecting
      inView ? start() : stop()
    },
    { threshold: 0 },
  )
  intersectionObserver.observe(wrapper)

  document.addEventListener('visibilitychange', onVisibilityChange)
  if (props.interactive) {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
  }

  start()
})

// Honour a mid-session change to the OS motion preference.
watch(prefersReducedMotion, (reduced) => {
  if (reduced) {
    stop()
    phase = 0
    pointerX = 0
    pointerY = 0
    draw(0)
  } else {
    start()
  }
})

onBeforeUnmount(() => {
  stop()
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  document.removeEventListener('visibilitychange', onVisibilityChange)
  window.removeEventListener('pointermove', onPointerMove)
})
</script>

<template>
  <div ref="wrapperRef" class="absolute inset-0 overflow-hidden" aria-hidden="true">
    <canvas ref="canvasRef" class="block h-full w-full" />
    <span class="hh-sr-only">{{ t.a11y.decorativeCanvas }}</span>
  </div>
</template>
