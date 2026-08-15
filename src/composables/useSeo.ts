import { watchEffect } from 'vue'
import { useI18n } from './useI18n'

const SITE_URL = 'https://www.hyperhelix.ai'
const OG_IMAGE = `${SITE_URL}/og-image.png`

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    if (hreflang) el.hreflang = hreflang
    document.head.appendChild(el)
  }
  el.href = href
}

function setJsonLd(id: string, data: object) {
  let el = document.head.querySelector<HTMLScriptElement>(`script[data-jsonld="${id}"]`)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.dataset.jsonld = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * Keeps <head> in sync with the active locale: title, description, Open Graph,
 * Twitter cards, canonical + hreflang alternates, and Organization JSON-LD.
 *
 * Call once, from the root component.
 */
export function useSeo() {
  const { t, locale } = useI18n()

  watchEffect(() => {
    if (typeof document === 'undefined') return

    const c = t.value
    const canonical = locale.value === 'en' ? SITE_URL : `${SITE_URL}/?lang=${locale.value}`

    document.title = c.meta.title
    document.documentElement.lang = c.meta.htmlLang

    setMeta('meta[name="description"]', 'name', 'description', c.meta.description)
    setMeta('meta[name="keywords"]', 'name', 'keywords', c.meta.keywords)

    // Open Graph
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', c.brand.name)
    setMeta('meta[property="og:title"]', 'property', 'og:title', c.meta.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', c.meta.description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    setMeta('meta[property="og:image"]', 'property', 'og:image', OG_IMAGE)
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', c.meta.ogLocale)

    // Twitter
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', c.meta.title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', c.meta.description)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', OG_IMAGE)

    // Canonical + hreflang alternates (self-referencing + x-default)
    setLink('canonical', canonical)
    setLink('alternate', SITE_URL, 'en')
    setLink('alternate', `${SITE_URL}/?lang=ko`, 'ko')
    setLink('alternate', SITE_URL, 'x-default')

    setJsonLd('organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: c.brand.name,
      alternateName: c.brand.nameShort,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description: c.meta.description,
      slogan: c.footer.tagline,
      address: { '@type': 'PostalAddress', addressRegion: 'Ontario', addressCountry: 'CA' },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: c.cta.email,
        availableLanguage: ['en', 'ko'],
      },
      knowsAbout: [
        'Human-Centered AI',
        'AI Enablement',
        'Business Automation',
        'Cyber Security Governance',
        'Digital Transformation',
      ],
    })

    setJsonLd('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: c.brand.name,
      url: SITE_URL,
      inLanguage: c.meta.htmlLang,
    })

    setJsonLd('services', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: c.services.title,
      itemListElement: c.services.items.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          provider: { '@type': 'Organization', name: c.brand.name },
        },
      })),
    })
  })
}
