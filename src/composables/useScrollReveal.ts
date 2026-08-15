import { onMounted, onScopeDispose, ref, type Ref } from 'vue'

export interface ScrollRevealOptions {
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number
  /** Extra margin around the viewport; negative bottom delays the trigger. */
  rootMargin?: string
  /** Reveal only the first time the element enters the viewport. */
  once?: boolean
}

/**
 * IntersectionObserver-based reveal. Deliberately CSS-driven: the observer only
 * toggles `.is-visible`, so the animation itself is defined in `main.css` and
 * automatically disabled under `prefers-reduced-motion`.
 *
 * Cheaper than a scroll listener and never blocks the main thread.
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -8% 0px', once = true } = options

  const target: Ref<HTMLElement | null> = ref(null)
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const el = target.value
    if (!el) return

    // No IntersectionObserver (very old browsers): show content immediately.
    if (typeof IntersectionObserver === 'undefined') {
      isVisible.value = true
      el.classList.add('is-visible')
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            isVisible.value = true
            entry.target.classList.add('is-visible')
            if (once) observer?.unobserve(entry.target)
          } else if (!once) {
            isVisible.value = false
            entry.target.classList.remove('is-visible')
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
  })

  onScopeDispose(() => {
    observer?.disconnect()
    observer = null
  })

  return { target, isVisible }
}
