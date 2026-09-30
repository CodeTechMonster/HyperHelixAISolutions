import type { Locale } from '@/content/types'

/**
 * Hyper Helix AI — the single configuration point for the chatbot.
 *
 * The model runs on the visitor's own device (WebGPU): no server, no API key,
 * conversations never leave the device. Everything here is public — it ships
 * in the browser bundle.
 */
export const CHATBOT_CONFIG = {
  /** Set to `false` to remove the chatbot from the page without deleting code. */
  enabled: true,

  /** Display name in the panel header and launcher label. */
  name: 'Hyper Helix AI',

  model: {
    /** ONNX build of an open chat model on the Hugging Face Hub (q4f16 weights are used). */
    id: 'onnx-community/Qwen3-0.6B-ONNX',
    /** Shown to visitors before they opt in to the one-time download. */
    downloadSizeMB: 580,
    maxNewTokens: 512,
    /** Spec card shown in the chat panel. Update together with `id`. */
    info: {
      name: 'Qwen3-0.6B',
      developer: 'Alibaba Qwen',
      parameters: { en: '0.6 billion', ko: '약 6억 개' },
      quantization: { en: '4-bit compressed (q4f16)', ko: '4비트 압축 (q4f16)' },
      license: 'Apache-2.0',
      url: 'https://huggingface.co/Qwen/Qwen3-0.6B',
    },
  },

  /** Instructions the model follows in every conversation. */
  systemPrompt: `You are Hyper Helix AI.

You are an AI assistant created for the Hyper Helix personal technology project.

Your role is to help users explore AI, technology, productivity, programming, and human-centered AI.

You should help people understand and accomplish tasks rather than unnecessarily replace human decision-making.

Be concise, helpful, technically accurate, and transparent when you are uncertain.

Reply in the same language the user writes in. Keep answers short and readable in a small chat window: plain sentences and short lists, no tables, minimal Markdown.`,

  /** First assistant bubble. Shown only in the UI — never sent to the model. */
  welcomeMessage: {
    en: 'Hello! I’m Hyper Helix AI. Ask me about AI, technology, productivity or programming — how can I help?',
    ko: '안녕하세요! Hyper Helix AI입니다. AI, 기술, 생산성, 프로그래밍에 대해 무엇이든 물어보세요.',
  } satisfies Record<Locale, string>,

  /** Most recent messages sent as context. */
  maxHistoryMessages: 12,

  maxInputLength: 1000,
} as const
