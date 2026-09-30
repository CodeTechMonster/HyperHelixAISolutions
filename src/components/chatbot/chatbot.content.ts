import type { Locale } from '@/content/types'
import type { ChatErrorKind } from './chatService'

/**
 * UI copy for the chatbot. Kept beside the component rather than in
 * `src/content/*` so the whole feature can be removed by deleting one folder.
 */
export interface ChatbotCopy {
  tagline: string
  open: string
  close: string
  newChat: string
  inputLabel: string
  placeholder: string
  placeholderNotReady: string
  send: string
  stop: string
  thinking: string
  retry: string
  disclaimer: string
  you: string
  /** Badge next to the name, and the notice that opens the spec card. */
  experimental: string
  experimentalNotice: string
  spec: {
    title: string
    model: string
    size: string
    sizeValue: (parameters: string, quantization: string) => string
    runtime: string
    runtimeValue: string
    license: string
    modelCard: string
  }
  setup: {
    title: string
    body: (sizeMB: number) => string
    action: (sizeMB: number) => string
    downloading: (percent: number) => string
    compiling: string
    unsupported: string
  }
  errors: Record<Exclude<ChatErrorKind, 'aborted' | 'not-ready'>, string>
}

export const CHATBOT_COPY: Record<Locale, ChatbotCopy> = {
  en: {
    tagline: 'Runs privately on your device',
    open: 'Open Hyper Helix AI chat',
    close: 'Close chat',
    newChat: 'Start a new conversation',
    inputLabel: 'Message Hyper Helix AI',
    placeholder: 'Ask something…',
    placeholderNotReady: 'Load the AI above to start',
    send: 'Send message',
    stop: 'Stop generating',
    thinking: 'Hyper Helix AI is thinking…',
    retry: 'Try again',
    disclaimer: 'Experimental AI — answers can be wrong. Your conversation stays on this device.',
    you: 'You',
    experimental: 'Experimental',
    experimentalNotice:
      'This is an experimental, very small AI. Answers can be inaccurate or made up — please double-check anything important.',
    spec: {
      title: 'About this AI',
      model: 'Model',
      size: 'Size',
      sizeValue: (params, quant) => `${params} parameters · ${quant}`,
      runtime: 'Runs on',
      runtimeValue: 'Your device’s GPU (WebGPU) · no server',
      license: 'License',
      modelCard: 'Model card',
    },
    setup: {
      title: 'This AI runs on your device',
      body: (mb) =>
        `A small open model (Qwen3) is downloaded once — about ${mb} MB — and then cached by your browser. ` +
        'Nothing you type is sent to any server. Works best in a recent Chrome or Edge on a computer.',
      action: (mb) => `Load the AI (~${mb} MB)`,
      downloading: (pct) => `Downloading the model… ${pct}%`,
      compiling: 'Preparing your GPU… almost there',
      unsupported:
        'Your browser doesn’t support WebGPU, which this on-device AI needs. Try a recent Chrome or Edge on a computer.',
    },
    errors: {
      unsupported:
        'Your browser or device can’t run the on-device AI (WebGPU unavailable). Try a recent Chrome or Edge on a computer.',
      'load-failed':
        'The AI couldn’t be loaded — the download may have been interrupted or the device ran out of memory.',
      failed: 'Something went wrong while generating a reply. Please try again.',
    },
  },
  ko: {
    tagline: '내 기기에서 안전하게 실행됩니다',
    open: 'Hyper Helix AI 대화 열기',
    close: '대화 닫기',
    newChat: '새 대화 시작',
    inputLabel: 'Hyper Helix AI에게 메시지 보내기',
    placeholder: '무엇이든 물어보세요…',
    placeholderNotReady: '먼저 위에서 AI를 불러와 주세요',
    send: '메시지 보내기',
    stop: '답변 중지',
    thinking: 'Hyper Helix AI가 답변을 작성하고 있습니다…',
    retry: '다시 시도',
    disclaimer: '실험용 AI라 답변이 틀릴 수 있습니다. 대화 내용은 이 기기 밖으로 전송되지 않습니다.',
    you: '나',
    experimental: '실험용',
    experimentalNotice:
      '아주 작은 실험용 AI입니다. 답변이 부정확하거나 사실과 다를 수 있으니 중요한 내용은 꼭 따로 확인해 주세요.',
    spec: {
      title: '이 AI 정보',
      model: '모델',
      size: '크기',
      sizeValue: (params, quant) => `파라미터 ${params} · ${quant}`,
      runtime: '실행',
      runtimeValue: '내 기기 GPU (WebGPU) · 서버 전송 없음',
      license: '라이선스',
      modelCard: '모델 정보',
    },
    setup: {
      title: '이 AI는 내 기기에서 실행됩니다',
      body: (mb) =>
        `작은 오픈 모델(Qwen3)을 처음 한 번 약 ${mb}MB 내려받고, 이후에는 브라우저에 저장해 사용합니다. ` +
        '입력한 내용은 어떤 서버로도 전송되지 않습니다. 컴퓨터의 최신 Chrome 또는 Edge에서 가장 잘 동작합니다.',
      action: (mb) => `AI 불러오기 (약 ${mb}MB)`,
      downloading: (pct) => `모델을 내려받는 중… ${pct}%`,
      compiling: 'GPU를 준비하는 중… 거의 다 됐습니다',
      unsupported:
        '이 브라우저는 온디바이스 AI에 필요한 WebGPU를 지원하지 않습니다. 컴퓨터의 최신 Chrome 또는 Edge를 이용해 주세요.',
    },
    errors: {
      unsupported:
        '이 브라우저나 기기에서는 온디바이스 AI를 실행할 수 없습니다(WebGPU 미지원). 컴퓨터의 최신 Chrome 또는 Edge를 이용해 주세요.',
      'load-failed':
        'AI를 불러오지 못했습니다. 다운로드가 중단되었거나 기기 메모리가 부족할 수 있습니다.',
      failed: '답변을 생성하는 중 문제가 발생했습니다. 다시 시도해 주세요.',
    },
  },
}
