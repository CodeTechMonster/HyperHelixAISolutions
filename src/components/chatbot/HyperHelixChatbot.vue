<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import HelixMark from '@/components/brand/HelixMark.vue'
import { useI18n } from '@/composables/useI18n'
import { CHATBOT_CONFIG } from './chatbot.config'
import { CHATBOT_COPY } from './chatbot.content'
import { chatbotOpenRequests } from './openChatbot'
import {
  ChatServiceError,
  chatService,
  type ChatErrorKind,
  type ChatMessage,
  type SetupProgress,
} from './chatService'

/**
 * Hyper Helix AI — floating assistant.
 *
 * Conversation state lives only in this component's memory: nothing is
 * persisted, and a page reload starts fresh. All backend details sit behind
 * `chatService`, so this file never talks to the model directly.
 */
const { locale, isCJK, t } = useI18n()
const copy = computed(() => CHATBOT_COPY[locale.value])
const welcome = computed(() => CHATBOT_CONFIG.welcomeMessage[locale.value])
const modelInfo = CHATBOT_CONFIG.model.info

const uid = useId()
const panelId = `hh-chat-panel-${uid}`
const titleId = `hh-chat-title-${uid}`
const inputId = `hh-chat-input-${uid}`

const isOpen = ref(false)
const messages = ref<ChatMessage[]>([])
const draft = ref('')
const isSending = ref(false)
const errorKind = ref<Exclude<ChatErrorKind, 'aborted' | 'not-ready'> | null>(null)

const launcherRef = ref<HTMLButtonElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const logRef = ref<HTMLElement | null>(null)

let controller: AbortController | null = null

// --- One-time setup (in-browser model download) ------------------------------

/** A service without a download step starts out ready. */
const setup = chatService.setup
type SetupState = 'idle' | 'loading' | 'ready' | 'unsupported' | 'error'
const setupState = ref<SetupState>(!setup ? 'ready' : setup.isSupported() ? 'idle' : 'unsupported')
const setupProgress = ref<SetupProgress>({ phase: 'download', fraction: 0 })
const setupPercent = computed(() =>
  setupProgress.value.phase === 'compile' ? 100 : Math.round(setupProgress.value.fraction * 100),
)
const isReady = computed(() => setupState.value === 'ready')
let checkedCache = false

async function prepareModel() {
  if (!setup || setupState.value === 'loading' || setupState.value === 'ready') return
  setupState.value = 'loading'
  setupProgress.value = { phase: 'download', fraction: 0 }
  errorKind.value = null
  try {
    await setup.prepare((progress) => {
      setupProgress.value = progress
    })
    setupState.value = 'ready'
    focusInput()
  } catch (error) {
    const kind = error instanceof ChatServiceError ? error.kind : 'load-failed'
    setupState.value = kind === 'unsupported' ? 'unsupported' : 'error'
    if (kind !== 'unsupported') errorKind.value = 'load-failed'
  }
  void scrollToEnd()
}

// --- Panel -------------------------------------------------------------------

const canSend = computed(() => draft.value.trim().length > 0 && !isSending.value && isReady.value)
/** Typing dots until the first streamed token turns into a bubble. */
const isWaitingForFirstToken = computed(
  () => isSending.value && messages.value[messages.value.length - 1]?.role === 'user',
)

function focusInput() {
  void nextTick(() => inputRef.value?.focus())
}

function open() {
  if (isOpen.value) return focusInput()
  isOpen.value = true
  focusInput()
  void scrollToEnd()

  // Returning visitors already have the model cached: load it without asking again.
  if (setup && !checkedCache && setupState.value === 'idle') {
    checkedCache = true
    void setup.isCached().then((cached) => {
      if (cached) void prepareModel()
    })
  }
}

function close() {
  isOpen.value = false
  void nextTick(() => launcherRef.value?.focus())
}

function toggle() {
  if (isOpen.value) close()
  else open()
}

async function scrollToEnd() {
  await nextTick()
  const el = logRef.value
  if (el) el.scrollTop = el.scrollHeight
}

function resizeInput() {
  const el = inputRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

async function request(history: ChatMessage[], message: string) {
  const ctrl = new AbortController()
  controller = ctrl
  isSending.value = true
  errorKind.value = null
  void scrollToEnd()

  // Index of the streaming assistant bubble, created on the first token.
  let replyIndex = -1
  const onToken = (text: string) => {
    if (controller !== ctrl) return
    if (replyIndex === -1) {
      replyIndex = messages.value.push({ role: 'assistant', content: text }) - 1
    } else {
      messages.value[replyIndex]!.content = text
    }
    void scrollToEnd()
  }

  try {
    const reply = await chatService.send(message, history, { signal: ctrl.signal, onToken })
    if (controller !== ctrl) return
    if (replyIndex === -1) messages.value.push({ role: 'assistant', content: reply })
    else messages.value[replyIndex]!.content = reply
  } catch (error) {
    // Stopped by the visitor: keep whatever had streamed so far.
    if (ctrl.signal.aborted) return
    if (replyIndex !== -1) messages.value.splice(replyIndex, 1)
    const kind = error instanceof ChatServiceError ? error.kind : 'failed'
    errorKind.value = kind === 'aborted' || kind === 'not-ready' ? null : kind
  } finally {
    if (controller === ctrl) {
      controller = null
      isSending.value = false
    }
    void scrollToEnd()
  }
}

function send() {
  const text = draft.value.trim().slice(0, CHATBOT_CONFIG.maxInputLength)
  if (!text || !canSend.value) return

  const history = messages.value.slice()
  messages.value.push({ role: 'user', content: text })
  draft.value = ''
  void nextTick(resizeInput)
  void request(history, text)
}

function stop() {
  controller?.abort()
}

/** Retries whatever failed: the model download, or the last unanswered message. */
function retry() {
  if (setupState.value === 'error') {
    void prepareModel()
    return
  }
  const last = messages.value[messages.value.length - 1]
  if (!last || last.role !== 'user' || isSending.value) return
  void request(messages.value.slice(0, -1), last.content)
}

function reset() {
  controller?.abort()
  controller = null
  isSending.value = false
  if (errorKind.value !== 'load-failed') errorKind.value = null
  messages.value = []
  draft.value = ''
  void nextTick(resizeInput)
  focusInput()
}

function onInputKeydown(event: KeyboardEvent) {
  // Enter sends, Shift+Enter adds a line. Ignore Enter while an IME (Hangul)
  // composition is in progress, or the last syllable is sent twice.
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing || event.keyCode === 229) return
  event.preventDefault()
  send()
}

// "Start the Conversation" buttons elsewhere on the site open the panel.
watch(chatbotOpenRequests, open)
// A click that arrived before this lazy-loaded widget finished mounting.
onMounted(() => {
  if (chatbotOpenRequests.value > 0) open()
})

onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <div class="hh-chat" :class="{ 'is-open': isOpen, 'lang-ko': isCJK }">
    <Transition name="hh-chat-panel">
      <section
        v-if="isOpen"
        :id="panelId"
        role="dialog"
        aria-modal="false"
        :aria-labelledby="titleId"
        class="hh-chat__panel hh-glass flex flex-col overflow-hidden rounded-card shadow-lift"
        @keydown.esc.stop="close"
      >
        <!-- Header -->
        <header
          class="relative isolate flex items-center gap-3 overflow-hidden bg-space-800 px-4 py-3 text-white"
        >
          <span
            aria-hidden="true"
            class="absolute inset-0 -z-10 bg-[radial-gradient(120%_140%_at_100%_0%,rgb(123_97_255/0.45),transparent_60%),radial-gradient(90%_120%_at_0%_100%,rgb(0_194_255/0.3),transparent_65%)]"
          />
          <span class="h-8 shrink-0">
            <HelixMark variant="white" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex min-w-0 items-center gap-2">
              <h2 :id="titleId" class="truncate font-display text-[0.95rem] font-semibold leading-tight">
                {{ CHATBOT_CONFIG.name }}
              </h2>
              <span
                class="shrink-0 rounded-pill border border-cyan-300/40 bg-cyan-400/15 px-2 py-px text-[0.625rem] font-semibold tracking-[0.06em] text-cyan-100"
              >
                {{ copy.experimental }}
              </span>
            </div>
            <p class="truncate text-xs text-mist-300">{{ copy.tagline }}</p>
          </div>
          <button
            type="button"
            class="hh-chat__icon-btn"
            :aria-label="copy.newChat"
            :title="copy.newChat"
            :disabled="messages.length === 0 && !draft"
            @click="reset"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" class="h-[1.1rem] w-[1.1rem]">
              <path
                d="M4 10a6 6 0 1 0 1.8-4.3M4 3.5v2.8h2.8"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            class="hh-chat__icon-btn"
            :aria-label="copy.close"
            :title="copy.close"
            @click="close"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" class="h-[1.1rem] w-[1.1rem]">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </button>
        </header>

        <!-- Messages -->
        <div
          ref="logRef"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          class="hh-chat__log flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
        >
          <p class="hh-chat__bubble hh-chat__bubble--ai">{{ welcome }}</p>

          <!-- Experimental notice + model spec: always visible, so visitors
               calibrate their trust before reading any answer. -->
          <div
            v-if="modelInfo"
            class="rounded-2xl border border-mist-300 bg-mist-100/80 px-4 py-3 text-[0.8rem] leading-snug text-mist-800"
          >
            <p class="flex gap-2 font-medium text-space-800">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" class="mt-px h-4 w-4 shrink-0 text-aurora-600">
                <circle cx="10" cy="10" r="7.25" stroke="currentColor" stroke-width="1.5" />
                <path d="M10 9v4.5M10 6.5v.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
              <span>{{ copy.experimentalNotice }}</span>
            </p>
            <p class="hh-sr-only">{{ copy.spec.title }}</p>
            <dl class="mt-2.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-mist-300/80 pt-2.5">
              <dt class="text-mist-600">{{ copy.spec.model }}</dt>
              <dd>
                <span class="font-medium text-space-900">{{ modelInfo.name }}</span>
                <span class="text-mist-600"> · {{ modelInfo.developer }}</span>
              </dd>
              <dt class="text-mist-600">{{ copy.spec.size }}</dt>
              <dd>
                {{ copy.spec.sizeValue(modelInfo.parameters[locale], modelInfo.quantization[locale]) }}
              </dd>
              <dt class="text-mist-600">{{ copy.spec.runtime }}</dt>
              <dd>{{ copy.spec.runtimeValue }}</dd>
              <dt class="text-mist-600">{{ copy.spec.license }}</dt>
              <dd>
                {{ modelInfo.license }} ·
                <a
                  :href="modelInfo.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-medium text-aurora-700 underline-offset-4 hover:underline"
                >
                  {{ copy.spec.modelCard }}<span aria-hidden="true"> ↗</span>
                  <span class="hh-sr-only"> {{ t.a11y.opensInNewTab }}</span>
                </a>
              </dd>
            </dl>
          </div>

          <!-- One-time opt-in for the on-device model -->
          <div
            v-if="setup && setupState !== 'ready'"
            class="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-aurora-50 px-4 py-3.5 text-sm text-space-800"
          >
            <p class="font-display font-semibold text-space-900">{{ copy.setup.title }}</p>

            <p v-if="setupState === 'unsupported'" class="mt-1.5 leading-relaxed">
              {{ copy.setup.unsupported }}
            </p>

            <template v-else-if="setupState === 'loading'">
              <p class="mt-1.5">
                {{
                  setupProgress.phase === 'compile'
                    ? copy.setup.compiling
                    : copy.setup.downloading(setupPercent)
                }}
              </p>
              <div
                class="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-valuenow="setupPercent"
                :aria-label="copy.setup.title"
              >
                <div
                  class="h-full rounded-full bg-gradient-to-r from-cyan-500 to-aurora-500 transition-[width] duration-300"
                  :style="{ width: `${setupPercent}%` }"
                />
              </div>
            </template>

            <template v-else>
              <p class="mt-1.5 leading-relaxed">{{ copy.setup.body(setup.downloadSizeMB) }}</p>
              <button
                type="button"
                class="mt-3 inline-flex items-center rounded-pill bg-space-800 px-4 py-2 text-sm font-semibold text-white shadow-glass transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-space-700 motion-reduce:transform-none"
                @click="prepareModel"
              >
                {{ copy.setup.action(setup.downloadSizeMB) }}
              </button>
            </template>
          </div>

          <template v-for="(message, index) in messages" :key="index">
            <p
              class="hh-chat__bubble"
              :class="message.role === 'user' ? 'hh-chat__bubble--user' : 'hh-chat__bubble--ai'"
            >
              <!-- No whitespace around the text: bubbles use pre-wrap. -->
              <span class="hh-sr-only">{{ message.role === 'user' ? copy.you : CHATBOT_CONFIG.name }}: </span
              >{{ message.content }}</p
            >
          </template>

          <div v-if="isWaitingForFirstToken" class="hh-chat__bubble hh-chat__bubble--ai hh-chat__typing" role="status">
            <span class="hh-sr-only">{{ copy.thinking }}</span>
            <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
          </div>

          <div
            v-if="errorKind"
            role="alert"
            class="rounded-2xl border border-aurora-200 bg-aurora-50 px-3.5 py-3 text-sm text-space-800"
          >
            <p>{{ copy.errors[errorKind] }}</p>
            <button
              v-if="errorKind !== 'unsupported'"
              type="button"
              class="mt-2 text-sm font-semibold text-aurora-700 underline-offset-4 hover:underline"
              @click="retry"
            >
              {{ copy.retry }}
            </button>
          </div>
        </div>

        <!-- Composer -->
        <form class="border-t border-mist-300/70 bg-white/70 px-3 pb-2.5 pt-3" @submit.prevent="send">
          <div
            class="flex items-end gap-2 rounded-[1.25rem] border border-mist-300 bg-white py-1.5 pl-3.5 pr-1.5 transition-colors focus-within:border-cyan-500"
          >
            <label :for="inputId" class="hh-sr-only">{{ copy.inputLabel }}</label>
            <textarea
              :id="inputId"
              ref="inputRef"
              v-model="draft"
              rows="1"
              :maxlength="CHATBOT_CONFIG.maxInputLength"
              :placeholder="isReady ? copy.placeholder : copy.placeholderNotReady"
              class="hh-chat__input flex-1 resize-none bg-transparent py-1.5 text-[0.95rem] leading-snug text-mist-900 placeholder:text-mist-600 focus:outline-none"
              enterkeyhint="send"
              @input="resizeInput"
              @keydown="onInputKeydown"
            />
            <button
              v-if="isSending"
              type="button"
              :aria-label="copy.stop"
              :title="copy.stop"
              class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-space-800 text-white shadow-glass transition-colors duration-200 hover:bg-space-700"
              @click="stop"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" class="h-3.5 w-3.5">
                <rect x="4" y="4" width="12" height="12" rx="2.5" fill="currentColor" />
              </svg>
            </button>
            <button
              v-else
              type="submit"
              :disabled="!canSend"
              :aria-label="copy.send"
              class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-600 to-aurora-600 text-white shadow-glass transition-[opacity,transform] duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 motion-reduce:transform-none"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" class="h-4 w-4">
                <path
                  d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
          <p class="mt-2 px-1 text-center text-[0.7rem] leading-snug text-mist-600">{{ copy.disclaimer }}</p>
        </form>
      </section>
    </Transition>

    <!-- Launcher -->
    <button
      ref="launcherRef"
      type="button"
      class="hh-chat__launcher grid place-items-center rounded-full bg-space-800 text-white shadow-glow transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lift motion-reduce:transform-none"
      :aria-label="isOpen ? copy.close : copy.open"
      :title="isOpen ? copy.close : CHATBOT_CONFIG.name"
      :aria-expanded="isOpen"
      :aria-controls="panelId"
      @click="toggle"
    >
      <span v-if="!isOpen" class="h-7">
        <HelixMark variant="white" />
      </span>
      <svg v-else viewBox="0 0 20 20" fill="none" aria-hidden="true" class="h-5 w-5">
        <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
/* Sits under the site header (z-50) so the mobile menu always wins. */
.hh-chat {
  --hh-chat-gap: max(1rem, env(safe-area-inset-bottom));
  --hh-chat-side: max(1rem, env(safe-area-inset-right));
  --hh-chat-launcher: 3.5rem;
  position: fixed;
  z-index: 40;
  right: var(--hh-chat-side);
  bottom: var(--hh-chat-gap);
}

.hh-chat__launcher {
  width: var(--hh-chat-launcher);
  height: var(--hh-chat-launcher);
  border: 1px solid rgb(255 255 255 / 0.14);
  animation: hh-chat-enter var(--duration-slow) var(--ease-out-expo) both;
}

.hh-chat__panel {
  position: absolute;
  right: 0;
  bottom: calc(var(--hh-chat-launcher) + 0.75rem);
  width: min(23rem, calc(100vw - 2rem));
  height: min(36rem, calc(100dvh - var(--hh-chat-launcher) - 7rem));
  transform-origin: bottom right;
}

/* Phones: a compact sheet that never takes the whole screen. The panel's own
   close button replaces the launcher while it is open. */
@media (max-width: 639px) {
  .hh-chat {
    --hh-chat-launcher: 3.25rem;
  }
  .hh-chat.is-open {
    left: 0.75rem;
    right: 0.75rem;
    bottom: max(0.75rem, env(safe-area-inset-bottom));
  }
  .hh-chat.is-open .hh-chat__launcher {
    display: none;
  }
  .hh-chat__panel {
    position: relative;
    bottom: 0;
    width: 100%;
    height: min(70dvh, 34rem);
  }
}

.hh-chat__icon-btn {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  color: var(--color-mist-200);
  transition: background-color var(--duration-fast) ease;
}
.hh-chat__icon-btn:hover:not(:disabled) {
  background-color: rgb(255 255 255 / 0.12);
  color: white;
}
.hh-chat__icon-btn:disabled {
  opacity: 0.4;
}

.hh-chat__log {
  scrollbar-width: thin;
}

.hh-chat__bubble {
  width: fit-content;
  max-width: 88%;
  padding: 0.625rem 0.875rem;
  border-radius: 1.125rem;
  font-size: 0.9rem;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.hh-chat__bubble--ai {
  background: white;
  color: var(--color-mist-900);
  border: 1px solid var(--color-mist-300);
  border-bottom-left-radius: 0.375rem;
}
.hh-chat__bubble--user {
  margin-left: auto;
  background: linear-gradient(135deg, var(--color-space-700), var(--color-space-800));
  color: white;
  border-bottom-right-radius: 0.375rem;
}

.hh-chat__input {
  max-height: 8rem;
}

/* Typing indicator */
.hh-chat__typing {
  display: flex;
  gap: 0.3rem;
  align-items: center;
  padding-block: 0.8rem;
}
.hh-chat__typing > span[aria-hidden] {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: var(--color-cyan-600);
  animation: hh-chat-dot 1.2s var(--ease-in-out-soft) infinite;
}
.hh-chat__typing > span[aria-hidden]:nth-of-type(3) {
  animation-delay: 0.15s;
  background: var(--color-space-400);
}
.hh-chat__typing > span[aria-hidden]:nth-of-type(4) {
  animation-delay: 0.3s;
  background: var(--color-aurora-500);
}

@keyframes hh-chat-dot {
  0%,
  80%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

@keyframes hh-chat-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.9);
  }
}

/* Panel open/close */
.hh-chat-panel-enter-active {
  transition:
    opacity var(--duration-base) var(--ease-out-expo),
    transform var(--duration-base) var(--ease-out-expo);
}
.hh-chat-panel-leave-active {
  transition:
    opacity var(--duration-fast) ease,
    transform var(--duration-fast) ease;
}
.hh-chat-panel-enter-from,
.hh-chat-panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
</style>
