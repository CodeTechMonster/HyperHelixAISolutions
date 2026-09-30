/**
 * Runs an open chat model on the visitor's GPU via transformers.js (WebGPU).
 *
 * Lives in a Web Worker so downloading, shader compilation and token
 * generation never block the page. Model files come from the Hugging Face Hub
 * and are cached by the browser (Cache Storage), so later visits skip the
 * download. Nothing is sent anywhere.
 */
import {
  AutoModelForCausalLM,
  AutoTokenizer,
  InterruptableStoppingCriteria,
  TextStreamer,
  type PreTrainedModel,
  type PreTrainedTokenizer,
} from '@huggingface/transformers'
import type { WorkerRequest, WorkerResponse } from './browserModel.protocol'

// The project compiles against the DOM lib, not WebWorker — type only what we use.
const scope = self as unknown as {
  postMessage(message: WorkerResponse): void
  addEventListener(type: 'message', listener: (event: MessageEvent<WorkerRequest>) => void): void
}
const post = (message: WorkerResponse) => scope.postMessage(message)

interface GpuAdapter {
  features: { has(feature: string): boolean }
}
interface NavigatorGpu {
  gpu?: { requestAdapter(): Promise<GpuAdapter | null> }
}

let tokenizer: PreTrainedTokenizer | null = null
let model: PreTrainedModel | null = null
let loading: Promise<void> | null = null
const stopping = new InterruptableStoppingCriteria()

/** Generations run one at a time, in arrival order. */
let queue: Promise<void> = Promise.resolve()

// transformers.js template kwargs (e.g. Qwen3's `enable_thinking`) are passed
// straight through to the Jinja chat template; its typings don't list them.
type ChatTemplateOptions = Parameters<PreTrainedTokenizer['apply_chat_template']>[1] &
  Record<string, unknown>

function templateOptions(): ChatTemplateOptions {
  return {
    add_generation_prompt: true,
    return_dict: true,
    // Qwen3: answer directly instead of emitting a <think> block first.
    enable_thinking: false,
  }
}

async function load(modelId: string) {
  const adapter = await (navigator as unknown as NavigatorGpu).gpu?.requestAdapter()
  // q4f16 needs 16-bit shaders. The q4 alternative is ~60% bigger than the
  // download size visitors agreed to, so GPUs without them are unsupported.
  if (!adapter?.features.has('shader-f16')) {
    loading = null
    post({ type: 'load-error', kind: 'unsupported', message: 'WebGPU with shader-f16 unavailable' })
    return
  }

  // Per-file byte counts → one overall fraction for the progress bar.
  const files = new Map<string, { loaded: number; total: number }>()
  let reported = 0
  const onProgress = (info: { status: string; file?: string; loaded?: number; total?: number }) => {
    if (info.status !== 'progress' || !info.file || !info.total) return
    files.set(info.file, { loaded: info.loaded ?? 0, total: info.total })
    let loaded = 0
    let total = 0
    for (const f of files.values()) {
      loaded += f.loaded
      total += f.total
    }
    // New files join mid-download; never let the bar move backwards. Only
    // whole-percent changes are posted — chunks arrive hundreds of times a second.
    const next = Math.max(reported, Math.floor((loaded / total) * 100) / 100)
    if (next === reported) return
    reported = next
    post({ type: 'progress', phase: 'download', fraction: reported })
  }

  try {
    tokenizer = await AutoTokenizer.from_pretrained(modelId, { progress_callback: onProgress })
    model = await AutoModelForCausalLM.from_pretrained(modelId, {
      dtype: 'q4f16',
      device: 'webgpu',
      progress_callback: onProgress,
    })

    // The first run compiles WebGPU shaders; do it now rather than on the
    // visitor's first question.
    post({ type: 'progress', phase: 'compile', fraction: 1 })
    const warmup = tokenizer.apply_chat_template(
      [{ role: 'user', content: 'Hi' }],
      templateOptions(),
    ) as Record<string, unknown>
    await model.generate({ ...warmup, max_new_tokens: 1 })

    post({ type: 'ready' })
  } catch (error) {
    tokenizer = null
    model = null
    loading = null
    post({ type: 'load-error', kind: 'load-failed', message: String(error) })
  }
}

async function generate(request: Extract<WorkerRequest, { type: 'generate' }>) {
  if (!tokenizer || !model) {
    post({ type: 'error', id: request.id, message: 'Model not loaded' })
    return
  }

  let text = ''
  const streamer = new TextStreamer(tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: (chunk: string) => {
      text += chunk
      post({ type: 'token', id: request.id, text })
    },
  })

  try {
    const inputs = tokenizer.apply_chat_template(request.messages, templateOptions()) as Record<
      string,
      unknown
    >
    stopping.reset()
    // Qwen3's recommended non-thinking sampling settings.
    await model.generate({
      ...inputs,
      max_new_tokens: request.maxNewTokens,
      do_sample: true,
      temperature: 0.7,
      top_p: 0.8,
      top_k: 20,
      streamer,
      stopping_criteria: stopping,
    })
    post({ type: 'done', id: request.id, text: text.trim() })
  } catch (error) {
    post({ type: 'error', id: request.id, message: String(error) })
  }
}

scope.addEventListener('message', ({ data }) => {
  switch (data.type) {
    case 'load':
      loading ??= load(data.modelId)
      break
    case 'generate':
      queue = queue.then(() => generate(data))
      break
    case 'interrupt':
      stopping.interrupt()
      break
  }
})
