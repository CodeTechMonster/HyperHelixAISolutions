<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useI18n } from '@/composables/useI18n'
import type { LegalDocumentId } from '@/content/types'

/**
 * Privacy / Terms / Accessibility, opened from the footer.
 *
 * There is no router, so each document is addressed by its URL hash
 * (`/#privacy`) — shareable, and Back closes it. It renders in a native modal
 * <dialog>, which provides the focus trap, Esc to close and an inert page.
 */
const { t, isCJK } = useI18n()

const dialogRef = ref<HTMLDialogElement | null>(null)
const openId = ref<LegalDocumentId | null>(null)
const doc = computed(() => t.value.footer.legal.find((d) => d.id === openId.value) ?? null)
const titleId = `hh-legal-title-${useId()}`
let returnFocus: HTMLElement | null = null

function idFromHash(): LegalDocumentId | null {
  const id = decodeURIComponent(window.location.hash.slice(1))
  return t.value.footer.legal.find((d) => d.id === id)?.id ?? null
}

async function syncWithHash() {
  const id = idFromHash()
  const dialog = dialogRef.value
  if (!id) {
    if (dialog?.open) dialog.close()
    return
  }
  if (!dialog?.open) returnFocus = document.activeElement as HTMLElement | null
  openId.value = id
  await nextTick()
  if (dialog && !dialog.open) dialog.showModal()
  dialog?.querySelector('.hh-legal__body')?.scrollTo(0, 0)
  document.body.style.overflow = 'hidden'
}

function close() {
  dialogRef.value?.close()
}

function onClose() {
  document.body.style.overflow = ''
  // Drop the hash so the URL is clean and a reload doesn't reopen the dialog.
  if (idFromHash()) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }
  returnFocus?.focus()
  returnFocus = null
}

/** A click on the dialog element itself is a click on its backdrop. */
function onDialogClick(event: MouseEvent) {
  if (event.target === dialogRef.value) close()
}

onMounted(() => {
  window.addEventListener('hashchange', syncWithHash)
  void syncWithHash() // opened straight from a shared link
})

onBeforeUnmount(() => window.removeEventListener('hashchange', syncWithHash))
</script>

<template>
  <dialog
    ref="dialogRef"
    :aria-labelledby="titleId"
    class="hh-legal m-auto w-[min(44rem,calc(100vw-2rem))] overflow-hidden rounded-panel bg-white p-0 text-mist-800 shadow-lift backdrop:bg-space-950/60 backdrop:backdrop-blur-sm"
    @close="onClose"
    @click="onDialogClick"
  >
    <div
      v-if="doc"
      class="flex max-h-[min(85dvh,52rem)] flex-col"
      :class="isCJK && 'lang-ko'"
    >
      <header class="flex items-start gap-4 border-b border-mist-200 px-6 py-5 sm:px-8">
        <div class="min-w-0 flex-1">
          <h2 :id="titleId" class="text-title text-space-900">{{ doc.title }}</h2>
          <p class="mt-1 text-sm text-mist-600">
            {{ t.footer.legalUi.lastUpdated }}: {{ doc.updated }}
          </p>
        </div>
        <button
          type="button"
          class="grid h-11 w-11 shrink-0 place-items-center rounded-pill text-mist-700 ring-1 ring-mist-300 transition-colors duration-200 hover:bg-mist-100 hover:text-space-900"
          :aria-label="t.footer.legalUi.close"
          @click="close"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" class="h-5 w-5">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </button>
      </header>

      <div class="hh-legal__body overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
        <p class="leading-relaxed text-mist-700">{{ doc.intro }}</p>

        <section v-for="section in doc.sections" :key="section.heading" class="mt-7">
          <h3 class="font-display text-base font-semibold text-space-900">{{ section.heading }}</h3>
          <p
            v-for="(paragraph, index) in section.paragraphs"
            :key="index"
            class="mt-2 text-[0.95rem] leading-relaxed text-mist-700"
          >
            {{ paragraph }}
          </p>
          <ul
            v-if="section.list"
            class="mt-2 list-disc space-y-1.5 pl-5 text-[0.95rem] leading-relaxed text-mist-700 marker:text-cyan-600"
          >
            <li v-for="item in section.list" :key="item">{{ item }}</li>
          </ul>
        </section>

        <p class="mt-8 border-t border-mist-200 pt-5 text-sm text-mist-700">
          {{ t.footer.legalUi.contact }}: {{ t.footer.contactNote }}
        </p>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.hh-legal[open] {
  animation: hh-legal-in var(--duration-base) var(--ease-out-expo);
}
.hh-legal[open]::backdrop {
  animation: hh-legal-fade var(--duration-base) ease;
}

@keyframes hh-legal-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
}
@keyframes hh-legal-fade {
  from {
    opacity: 0;
  }
}
</style>
