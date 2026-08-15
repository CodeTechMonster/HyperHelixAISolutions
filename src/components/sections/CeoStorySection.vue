<script setup lang="ts">
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import HelixMark from '@/components/brand/HelixMark.vue'
import { useI18n } from '@/composables/useI18n'

const { t, isCJK } = useI18n()
</script>

<template>
  <section
    id="founder"
    class="hh-section relative overflow-hidden bg-space-950 text-white"
    aria-labelledby="founder-heading"
  >
    <!-- Ambient stage lighting — the TED-stage feel without a literal photo. -->
    <div
      class="absolute inset-0 bg-[radial-gradient(90%_60%_at_18%_0%,#123058_0%,#071a33_45%,#04101f_100%)]"
      aria-hidden="true"
    />
    <div class="hh-aurora left-1/3 top-0 h-[28rem] w-[28rem] text-aurora-500/20" aria-hidden="true" />

    <div class="hh-container relative">
      <div class="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <!-- Left rail: portrait plate + pull quote, sticky on large screens -->
        <div class="lg:sticky lg:top-28 lg:self-start">
          <RevealOnScroll>
            <p class="flex items-center gap-3 text-eyebrow uppercase text-cyan-300">
              <span class="h-px w-8 bg-cyan-300/60" aria-hidden="true" />
              {{ t.ceo.eyebrow }}
            </p>
          </RevealOnScroll>

          <RevealOnScroll :delay="90">
            <!-- Portrait plate: replace the inner block with a founder photo
                 (<img> at 4:5, object-cover) when one is available. -->
            <div
              class="mt-8 flex aspect-[4/5] w-full max-w-sm items-center justify-center overflow-hidden rounded-panel border border-white/10 bg-gradient-to-br from-space-800 via-space-900 to-space-950"
              role="img"
              :aria-label="`${t.ceo.signature.name} — ${t.ceo.signature.role}`"
            >
              <div class="relative flex h-full w-full items-center justify-center">
                <div class="hh-aurora h-56 w-56 text-cyan-500/25" aria-hidden="true" />
                <span class="relative h-40 opacity-90">
                  <HelixMark variant="white" animated />
                </span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll :delay="170">
            <blockquote class="mt-10 max-w-sm">
              <p
                class="border-l-2 border-cyan-400/70 pl-6 font-display text-xl font-semibold leading-snug text-white sm:text-2xl"
                :class="isCJK && 'lang-ko'"
              >
                “{{ t.ceo.pullQuote }}”
              </p>
            </blockquote>
          </RevealOnScroll>
        </div>

        <!-- Right: the narrative -->
        <div>
          <RevealOnScroll>
            <h2
              id="founder-heading"
              class="text-headline text-white"
              :class="isCJK && 'lang-ko'"
            >
              {{ t.ceo.title }}
            </h2>
          </RevealOnScroll>

          <div class="mt-9 space-y-6">
            <RevealOnScroll
              v-for="(paragraph, index) in t.ceo.paragraphs"
              :key="index"
              :delay="index * 60"
            >
              <!-- The opening paragraph gets weight instead of a drop cap: a
                   capital "I" as a drop cap reads as a stray rule, not a letter. -->
              <p
                class="text-lead"
                :class="[
                  isCJK && 'lang-ko',
                  index === 0 ? 'text-xl font-medium text-white sm:text-2xl' : 'text-mist-300',
                ]"
              >
                {{ paragraph }}
              </p>
            </RevealOnScroll>
          </div>

          <RevealOnScroll :delay="120">
            <div class="mt-12 flex items-center gap-4 border-t border-white/10 pt-8">
              <span class="h-11 w-11 shrink-0">
                <HelixMark variant="white" />
              </span>
              <div>
                <p class="font-display text-base font-semibold text-white">
                  {{ t.ceo.signature.name }}
                </p>
                <p class="mt-0.5 text-sm text-mist-400">
                  {{ t.ceo.signature.role }} · {{ t.ceo.signature.location }}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <!-- Timeline -->
      <ol class="mt-20 grid gap-px overflow-hidden rounded-panel border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        <RevealOnScroll
          v-for="(milestone, index) in t.ceo.milestones"
          :key="milestone.year"
          as="li"
          :delay="index * 90"
          class="relative bg-space-950/90 p-7"
        >
          <span
            class="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-cyan-500/70 to-aurora-500/40"
            aria-hidden="true"
          />
          <p class="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {{ milestone.year }}
          </p>
          <h3 class="mt-4 font-display text-base font-semibold text-white" :class="isCJK && 'lang-ko'">
            {{ milestone.title }}
          </h3>
          <p class="mt-2.5 text-sm leading-relaxed text-mist-400" :class="isCJK && 'lang-ko'">
            {{ milestone.body }}
          </p>
          <a
            v-if="milestone.link"
            :href="milestone.link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 underline-offset-4 transition-colors hover:text-cyan-200 hover:underline"
          >
            {{ milestone.link.label }}
            <svg viewBox="0 0 12 12" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M4 2h6v6M10 2 3 9" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="hh-sr-only">{{ t.a11y.opensInNewTab }}</span>
          </a>
        </RevealOnScroll>
      </ol>
    </div>
  </section>
</template>
