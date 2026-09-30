import { CHATBOT_CONFIG } from './chatbot.config'
import type { ModelMessage, WorkerRequest, WorkerResponse } from './browserModel.protocol'

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  role: ChatRole
  content: string
}

export type ChatErrorKind = 'not-ready' | 'unsupported' | 'load-failed' | 'failed' | 'aborted'

export class ChatServiceError extends Error {
  readonly kind: ChatErrorKind

  constructor(kind: ChatErrorKind, message?: string) {
    super(message ?? kind)
    this.name = 'ChatServiceError'
    this.kind = kind
  }
}

export interface SendOptions {
  signal?: AbortSignal
  /** Streaming backends call this with the full reply so far. */
  onToken?: (textSoFar: string) => void
}

export interface SetupProgress {
  phase: 'download' | 'compile'
  /** 0–1. */
  fraction: number
}

/**
 * Contract the UI depends on. A different backend (e.g. a hosted model) can
 * be added later as another factory without touching the component.
 */
export interface ChatService {
  send(message: string, history: ChatMessage[], options?: SendOptions): Promise<string>

  /** Present when the model must be downloaded before first use. */
  setup?: {
    downloadSizeMB: number
    /** Cheap capability check, safe to call on render. */
    isSupported(): boolean
    /** True when the download already sits in the browser cache. */
    isCached(): Promise<boolean>
    prepare(onProgress: (progress: SetupProgress) => void): Promise<void>
  }
}

interface BrowserOptions {
  modelId: string
  downloadSizeMB: number
  maxNewTokens: number
  systemPrompt: string
  maxHistoryMessages: number
}

/** Cache Storage bucket transformers.js writes model files to. */
const TRANSFORMERS_CACHE = 'transformers-cache'

/**
 * Runs the model in a Web Worker on the visitor's GPU. The worker (and the
 * ~1 MB inference runtime) is only created once the visitor opts in.
 */
export function createBrowserChatService(options: BrowserOptions): ChatService {
  let worker: Worker | null = null
  let ready: Promise<void> | null = null
  let progressListener: ((progress: SetupProgress) => void) | null = null
  let nextId = 0
  const pending = new Map<
    number,
    { resolve(text: string): void; reject(error: Error): void; onToken?(text: string): void }
  >()

  const post = (message: WorkerRequest) => worker?.postMessage(message)

  function getWorker(): Worker {
    if (worker) return worker
    worker = new Worker(new URL('./browserModel.worker.ts', import.meta.url), { type: 'module' })
    worker.addEventListener('message', ({ data }: MessageEvent<WorkerResponse>) => {
      if (data.type === 'progress') {
        progressListener?.({ phase: data.phase, fraction: data.fraction })
        return
      }
      if (data.type === 'ready' || data.type === 'load-error') return // handled in prepare()

      const entry = pending.get(data.id)
      if (!entry) return // reply to an aborted request
      if (data.type === 'token') {
        entry.onToken?.(data.text)
      } else {
        pending.delete(data.id)
        if (data.type === 'done') entry.resolve(data.text)
        else entry.reject(new ChatServiceError('failed', data.message))
      }
    })
    return worker
  }

  function isSupported() {
    return typeof Worker !== 'undefined' && 'gpu' in navigator
  }

  function prepare(onProgress: (progress: SetupProgress) => void): Promise<void> {
    progressListener = onProgress
    if (ready) return ready

    if (!isSupported()) return Promise.reject(new ChatServiceError('unsupported'))

    const w = getWorker()
    ready = new Promise<void>((resolve, reject) => {
      const onMessage = ({ data }: MessageEvent<WorkerResponse>) => {
        if (data.type === 'ready') {
          w.removeEventListener('message', onMessage)
          resolve()
        } else if (data.type === 'load-error') {
          w.removeEventListener('message', onMessage)
          ready = null // allow a retry
          reject(new ChatServiceError(data.kind, data.message))
        }
      }
      w.addEventListener('message', onMessage)
      post({ type: 'load', modelId: options.modelId })
    })
    return ready
  }

  async function isCached(): Promise<boolean> {
    try {
      if (!('caches' in window) || !(await caches.has(TRANSFORMERS_CACHE))) return false
      const keys = await (await caches.open(TRANSFORMERS_CACHE)).keys()
      return keys.some((req) => req.url.includes(options.modelId) && req.url.includes('.onnx'))
    } catch {
      return false // storage blocked (private mode etc.)
    }
  }

  return {
    setup: {
      downloadSizeMB: options.downloadSizeMB,
      isSupported,
      isCached,
      prepare,
    },

    async send(message, history, { signal, onToken } = {}) {
      if (!ready) throw new ChatServiceError('not-ready', 'Model not prepared')
      await ready

      // Copy to plain objects: postMessage can't clone Vue's reactive proxies.
      const messages: ModelMessage[] = [
        { role: 'system', content: options.systemPrompt },
        ...history.slice(-options.maxHistoryMessages).map(({ role, content }) => ({ role, content })),
        { role: 'user', content: message },
      ]
      const id = ++nextId

      return new Promise<string>((resolve, reject) => {
        const onAbort = () => {
          pending.delete(id)
          post({ type: 'interrupt' })
          reject(new ChatServiceError('aborted'))
        }
        if (signal?.aborted) return onAbort()
        signal?.addEventListener('abort', onAbort, { once: true })

        pending.set(id, {
          onToken,
          resolve: (text) => {
            signal?.removeEventListener('abort', onAbort)
            if (text) resolve(text)
            else reject(new ChatServiceError('failed', 'Empty reply'))
          },
          reject: (error) => {
            signal?.removeEventListener('abort', onAbort)
            reject(error)
          },
        })
        post({ type: 'generate', id, messages, maxNewTokens: options.maxNewTokens })
      })
    },
  }
}

export const chatService: ChatService = createBrowserChatService({
  modelId: CHATBOT_CONFIG.model.id,
  downloadSizeMB: CHATBOT_CONFIG.model.downloadSizeMB,
  maxNewTokens: CHATBOT_CONFIG.model.maxNewTokens,
  systemPrompt: CHATBOT_CONFIG.systemPrompt,
  maxHistoryMessages: CHATBOT_CONFIG.maxHistoryMessages,
})
