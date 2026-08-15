<script setup lang="ts">
import SectionHeading from '@/components/ui/SectionHeading.vue'
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import { useI18n } from '@/composables/useI18n'

const { t, isCJK, locale } = useI18n()

/**
 * Positioning matrix. Both axes high is the target corner: high automation AND
 * high human control, rather than the usual trade-off framing.
 */
const MATRIX = {
  en: {
    xAxis: 'Automation →',
    yAxis: 'Human control →',
    cells: [
      { id: 'careful', label: 'Careful but slow', note: 'Control without leverage' },
      { id: 'amplified', label: 'Amplified', note: 'Where we build', target: true },
      { id: 'manual', label: 'Manual effort', note: 'Everything by hand' },
      { id: 'runaway', label: 'Unchecked automation', note: 'Speed without accountability' },
    ],
  },
  ko: {
    xAxis: '자동화 →',
    yAxis: '인간의 통제 →',
    cells: [
      { id: 'careful', label: '신중하지만 느림', note: '통제는 있으나 지렛대가 없음' },
      { id: 'amplified', label: '확장', note: '우리가 만드는 지점', target: true },
      { id: 'manual', label: '수작업', note: '모든 것을 손으로' },
      { id: 'runaway', label: '통제 없는 자동화', note: '속도는 있으나 책임이 없음' },
    ],
  },
} as const
</script>

<template>
  <section
    id="human-centered"
    class="hh-section relative overflow-hidden bg-mist-100"
    aria-labelledby="hcai-heading"
  >
    <div class="bg-grid absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" aria-hidden="true" />
    <div class="hh-aurora right-0 top-1/4 h-96 w-96 text-cyan-100" aria-hidden="true" />

    <div class="hh-container relative">
      <SectionHeading
        heading-id="hcai-heading"
        :eyebrow="t.hcai.eyebrow"
        :title="t.hcai.title"
        :lead="t.hcai.lead"
      />

      <div class="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
        <!-- Stances -->
        <ul class="space-y-4">
          <RevealOnScroll
            v-for="(stance, index) in t.hcai.stances"
            as="li"
            :key="stance.id"
            :delay="index * 90"
          >
            <div
              class="flex gap-5 rounded-card border p-6 sm:p-7"
              :class="
                stance.state === 'reject'
                  ? 'border-mist-300 bg-mist-200/50'
                  : 'border-cyan-200 bg-white shadow-glass'
              "
            >
              <span
                class="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                :class="
                  stance.state === 'reject'
                    ? 'bg-mist-400'
                    : 'bg-gradient-to-br from-cyan-500 to-aurora-500'
                "
                aria-hidden="true"
              >
                <svg v-if="stance.state === 'reject'" viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.4">
                  <path d="M6 6l8 8M14 6l-8 8" stroke-linecap="round" />
                </svg>
                <svg v-else viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.4">
                  <path d="m5 10.5 3.4 3.4L15 7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>

              <div>
                <p
                  class="text-[0.66rem] font-semibold uppercase tracking-[0.18em]"
                  :class="stance.state === 'reject' ? 'text-mist-500' : 'text-cyan-700'"
                >
                  {{ stance.label }}
                </p>
                <h3
                  class="mt-2 font-display text-lg font-semibold sm:text-xl"
                  :class="stance.state === 'reject' ? 'text-mist-600 line-through decoration-mist-400 decoration-2' : 'text-space-900'"
                >
                  {{ stance.title }}
                </h3>
                <p class="mt-2.5 text-[0.95rem] leading-relaxed text-mist-700" :class="isCJK && 'lang-ko'">
                  {{ stance.body }}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </ul>

        <!-- Positioning matrix -->
        <RevealOnScroll :delay="120">
          <div class="lg:sticky lg:top-28">
            <GlassCard padding="lg" :interactive="false" class="bg-white/80">
              <!-- Axis labels stay horizontal in both locales: vertical
                   writing-mode plus rotate renders Hangul upside-down. -->
              <p class="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-mist-500">
                ↑ {{ MATRIX[locale].yAxis }}
              </p>

              <div class="mt-4 grid grid-cols-2 gap-2.5">
                <div
                  v-for="cell in MATRIX[locale].cells"
                  :key="cell.id"
                  class="flex aspect-[4/3] flex-col justify-end rounded-2xl border p-4"
                  :class="
                    'target' in cell && cell.target
                      ? 'border-transparent bg-gradient-to-br from-space-800 via-space-700 to-space-900 text-white shadow-glow'
                      : 'border-mist-200 bg-mist-100 text-mist-600'
                  "
                >
                  <p
                    class="font-display text-sm font-semibold leading-tight"
                    :class="'target' in cell && cell.target ? 'text-white' : 'text-mist-700'"
                  >
                    {{ cell.label }}
                  </p>
                  <p
                    class="mt-1.5 text-[0.72rem] leading-snug"
                    :class="'target' in cell && cell.target ? 'text-cyan-200' : 'text-mist-500'"
                  >
                    {{ cell.note }}
                  </p>
                </div>
              </div>

              <p class="mt-4 text-right text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-mist-500">
                {{ MATRIX[locale].xAxis }}
              </p>
            </GlassCard>
          </div>
        </RevealOnScroll>
      </div>

      <!-- Principles -->
      <div class="mt-20 grid gap-px overflow-hidden rounded-panel border border-mist-200 bg-mist-200 sm:grid-cols-2 lg:grid-cols-4">
        <RevealOnScroll
          v-for="(principle, index) in t.hcai.principles"
          :key="principle.id"
          :delay="index * 80"
          class="bg-white p-7"
        >
          <span class="font-display text-xs font-bold tabular-nums text-cyan-600">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <h3 class="mt-4 font-display text-base font-semibold text-space-900" :class="isCJK && 'lang-ko'">
            {{ principle.title }}
          </h3>
          <p class="mt-2.5 text-sm leading-relaxed text-mist-700" :class="isCJK && 'lang-ko'">
            {{ principle.body }}
          </p>
        </RevealOnScroll>
      </div>

      <RevealOnScroll :delay="100">
        <p class="mt-8 max-w-3xl text-xs leading-relaxed text-mist-500" :class="isCJK && 'lang-ko'">
          {{ t.hcai.disclaimer }}
        </p>
      </RevealOnScroll>
    </div>
  </section>
</template>
