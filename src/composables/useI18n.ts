import { computed, readonly, ref, watch } from 'vue'
import { en } from '@/content/en'
import { ko } from '@/content/ko'
import type { Locale, SiteContent } from '@/content/types'

const DICTIONARY: Record<Locale, SiteContent> = { en, ko }
const STORAGE_KEY = 'hh-locale'
const SUPPORTED: Locale[] = ['en', 'ko']

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && SUPPORTED.includes(value as Locale)
}

/**
 * Resolution order: ?lang= query → saved preference → browser language → 'en'.
 * Runs once at module load, so every component observes the same source.
 */
function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  const fromQuery = new URLSearchParams(window.location.search).get('lang')
  if (isLocale(fromQuery)) return fromQuery

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(saved)) return saved
  } catch {
    /* storage unavailable (private mode / blocked cookies) — fall through */
  }

  return window.navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en'
}

/** Module-scoped singleton — shared reactive state across all consumers. */
const locale = ref<Locale>(detectLocale())

watch(
  locale,
  (next) => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = DICTIONARY[next].meta.htmlLang
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* non-fatal */
    }
  },
  { immediate: true },
)

export function useI18n() {
  /** Full typed content tree for the active locale. */
  const t = computed<SiteContent>(() => DICTIONARY[locale.value])

  /** True when the active locale needs CJK-friendly line breaking. */
  const isCJK = computed(() => locale.value === 'ko')

  const otherLocale = computed<Locale>(() => (locale.value === 'en' ? 'ko' : 'en'))

  function setLocale(next: Locale) {
    locale.value = next
  }

  function toggleLocale() {
    locale.value = otherLocale.value
  }

  return {
    locale: readonly(locale),
    otherLocale,
    supported: SUPPORTED,
    t,
    isCJK,
    setLocale,
    toggleLocale,
  }
}
