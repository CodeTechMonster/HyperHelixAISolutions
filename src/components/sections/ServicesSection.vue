<script setup lang="ts">
import SectionHeading from '@/components/ui/SectionHeading.vue'
import CategoryIcon from '@/components/ui/CategoryIcon.vue'
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import { useI18n } from '@/composables/useI18n'

const { t, isCJK } = useI18n()
</script>

<template>
  <section id="services" class="hh-section relative overflow-hidden bg-white" aria-labelledby="services-heading">
    <div class="hh-aurora -left-40 top-1/3 h-96 w-96 text-cyan-100/70" aria-hidden="true" />

    <div class="hh-container relative">
      <SectionHeading
        heading-id="services-heading"
        :eyebrow="t.services.eyebrow"
        :title="t.services.title"
        :lead="t.services.lead"
      />

      <div class="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RevealOnScroll
          v-for="(service, index) in t.services.items"
          :key="service.id"
          :delay="index * 90"
        >
          <article
            class="group relative h-full overflow-hidden rounded-panel border border-mist-200 bg-mist-50 p-8 transition-[transform,box-shadow,border-color] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-transparent hover:shadow-lift focus-within:-translate-y-1.5 motion-reduce:transform-none motion-reduce:transition-none sm:p-10"
          >
            <!-- Hover wash -->
            <span
              class="pointer-events-none absolute inset-0 bg-gradient-to-br from-space-900 via-space-800 to-space-950 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
              aria-hidden="true"
            />
            <!-- Top accent rule that draws in on hover -->
            <span
              class="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-cyan-500 to-aurora-500 transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
              aria-hidden="true"
            />

            <div class="relative">
              <div class="flex items-start justify-between gap-6">
                <span
                  class="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-mist-200 bg-white text-space-800 transition-colors duration-500 group-hover:border-cyan-400/30 group-hover:bg-white/10 group-hover:text-white"
                >
                  <CategoryIcon :name="service.icon" class="h-7 w-7" />
                </span>
                <span
                  class="font-display text-sm font-bold tabular-nums text-mist-400 transition-colors duration-500 group-hover:text-cyan-300"
                >
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
              </div>

              <h3
                class="mt-7 text-title text-space-900 transition-colors duration-500 group-hover:text-white"
                :class="isCJK && 'lang-ko'"
              >
                {{ service.title }}
              </h3>
              <p
                class="mt-3.5 max-w-md text-[0.98rem] leading-relaxed text-mist-700 transition-colors duration-500 group-hover:text-mist-300"
                :class="isCJK && 'lang-ko'"
              >
                {{ service.summary }}
              </p>

              <ul class="mt-7 grid gap-3 sm:grid-cols-2">
                <li
                  v-for="capability in service.capabilities"
                  :key="capability"
                  class="flex items-start gap-2.5 text-sm text-mist-700 transition-colors duration-500 group-hover:text-mist-300"
                  :class="isCJK && 'lang-ko'"
                >
                  <svg
                    class="mt-0.5 h-4 w-4 shrink-0 text-cyan-500"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    aria-hidden="true"
                  >
                    <path d="m3.5 8.4 3 3 6-6.4" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ capability }}
                </li>
              </ul>
            </div>
          </article>
        </RevealOnScroll>
      </div>
    </div>
  </section>
</template>
