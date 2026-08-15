<script setup lang="ts">
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import PhilosophySection from '@/components/sections/PhilosophySection.vue'
import StoriesSection from '@/components/sections/StoriesSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import CeoStorySection from '@/components/sections/CeoStorySection.vue'
import HcaiSection from '@/components/sections/HcaiSection.vue'
import FutureVisionSection from '@/components/sections/FutureVisionSection.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
import { useI18n } from '@/composables/useI18n'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()
useSeo()
</script>

<template>
  <!-- WCAG 2.1 — 2.4.1 Bypass Blocks -->
  <a
    href="#main"
    class="hh-sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:h-auto focus:w-auto focus:rounded-pill focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-space-900 focus:shadow-lift focus:[clip:auto]"
  >
    {{ t.a11y.skipToContent }}
  </a>

  <SiteHeader />

  <main id="main" :aria-label="t.a11y.mainLandmark">
    <HeroSection />
    <PhilosophySection />
    <StoriesSection />
    <ServicesSection />
    <CeoStorySection />
    <HcaiSection />
    <FutureVisionSection />
    <CtaSection />
  </main>

  <SiteFooter />
</template>
