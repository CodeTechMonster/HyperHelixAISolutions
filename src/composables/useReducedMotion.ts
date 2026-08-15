import { onScopeDispose, readonly, ref } from 'vue'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Reactive `prefers-reduced-motion`. WCAG 2.1 (2.3.3, 2.2.2) — anything that
 * animates continuously must be able to stop. Every animated component in this
 * project reads this before starting a loop, not just at mount.
 */
export function useReducedMotion() {
  const prefersReducedMotion = ref(false)

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const mql = window.matchMedia(QUERY)
    prefersReducedMotion.value = mql.matches

    const onChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion.value = event.matches
    }

    mql.addEventListener('change', onChange)
    onScopeDispose(() => mql.removeEventListener('change', onChange))
  }

  return { prefersReducedMotion: readonly(prefersReducedMotion) }
}
