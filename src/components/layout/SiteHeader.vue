<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BrandLogo from '@/components/brand/BrandLogo.vue'
import LanguageToggle from './LanguageToggle.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const isScrolled = ref(false)
const isMenuOpen = ref(false)
const activeSection = ref<string>('')
const menuPanel = ref<HTMLElement | null>(null)

/** Over the dark hero the header is transparent-on-dark; once the user scrolls
 *  past it, the header condenses into a light glass bar. */
const tone = computed<'light' | 'dark'>(() =>
  isScrolled.value || isMenuOpen.value ? 'light' : 'dark',
)

let sectionObserver: IntersectionObserver | null = null

function onScroll() {
  isScrolled.value = window.scrollY > 32
}

function closeMenu() {
  isMenuOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isMenuOpen.value) {
    closeMenu()
    ;(document.querySelector('[data-menu-trigger]') as HTMLElement | null)?.focus()
  }
}

watch(isMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    // Move focus into the panel so keyboard users land inside the dialog.
    requestAnimationFrame(() => menuPanel.value?.querySelector('a')?.focus())
  }
})

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)

  // Scroll-spy: highlight the nav item for the section occupying mid-viewport.
  const sections = t.value.nav.links
    .map((link) => document.getElementById(link.id))
    .filter((el): el is HTMLElement => !!el)

  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      }
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
  )
  sections.forEach((section) => sectionObserver?.observe(section))
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  sectionObserver?.disconnect()
  document.body.style.overflow = ''
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500"
    :class="isScrolled || isMenuOpen ? 'hh-glass-strong' : 'bg-transparent'"
  >
    <div class="hh-container">
      <div class="flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
        <a href="#top" class="shrink-0 rounded-lg" @click="closeMenu">
          <BrandLogo :tone="tone === 'dark' ? 'dark' : 'light'" />
        </a>

        <!-- Desktop navigation -->
        <nav class="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          <a
            v-for="link in t.nav.links"
            :key="link.id"
            :href="`#${link.id}`"
            class="relative whitespace-nowrap rounded-pill px-3 py-2 text-[0.83rem] font-medium transition-colors duration-200"
            :class="[
              tone === 'dark'
                ? 'text-white/80 hover:text-white'
                : 'text-mist-700 hover:text-space-900',
              activeSection === link.id && (tone === 'dark' ? 'text-white' : 'text-space-900'),
            ]"
            :aria-current="activeSection === link.id ? 'true' : undefined"
          >
            {{ link.label }}
            <span
              class="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-gradient-to-r from-cyan-500 to-aurora-500 transition-transform duration-300"
              :class="activeSection === link.id ? 'scale-x-100' : 'scale-x-0'"
              aria-hidden="true"
            />
          </a>
        </nav>

        <div class="flex items-center gap-3">
          <LanguageToggle :tone="tone === 'dark' ? 'dark' : 'light'" />

          <!-- Wrapper handles the breakpoint: `hidden` on the button itself
               would lose to the button's own `inline-flex` display utility. -->
          <span class="hidden md:block">
            <AppButton href="#contact" :variant="tone === 'dark' ? 'onDark' : 'primary'">
              {{ t.nav.cta }}
            </AppButton>
          </span>

          <!-- Mobile menu trigger -->
          <button
            type="button"
            data-menu-trigger
            class="inline-flex h-11 w-11 items-center justify-center rounded-pill xl:hidden"
            :class="
              tone === 'dark'
                ? 'text-white ring-1 ring-white/20'
                : 'text-space-800 ring-1 ring-mist-300'
            "
            :aria-expanded="isMenuOpen"
            aria-controls="mobile-menu"
            :aria-label="isMenuOpen ? t.nav.menuClose : t.nav.menuOpen"
            @click="isMenuOpen = !isMenuOpen"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path v-if="!isMenuOpen" d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
              <path v-else d="M6 6l12 12M18 6 6 18" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile panel -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMenuOpen"
        id="mobile-menu"
        ref="menuPanel"
        class="xl:hidden"
        role="dialog"
        aria-modal="true"
        :aria-label="t.a11y.mainLandmark"
      >
        <div class="hh-container border-t border-mist-200/70 pb-8 pt-6">
          <nav class="flex flex-col" aria-label="Primary mobile">
            <a
              v-for="link in t.nav.links"
              :key="link.id"
              :href="`#${link.id}`"
              class="border-b border-mist-200/70 py-4 text-title text-space-800"
              @click="closeMenu"
            >
              {{ link.label }}
            </a>
          </nav>
          <AppButton href="#contact" variant="primary" size="lg" class="mt-7 w-full" @click="closeMenu">
            {{ t.nav.cta }}
          </AppButton>
        </div>
      </div>
    </Transition>
  </header>
</template>
