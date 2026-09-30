/** Messages between `chatService.ts` (page) and `browserModel.worker.ts`. */

export interface ModelMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type WorkerRequest =
  | { type: 'load'; modelId: string }
  | { type: 'generate'; id: number; messages: ModelMessage[]; maxNewTokens: number }
  | { type: 'interrupt' }

export type WorkerResponse =
  | { type: 'progress'; phase: 'download' | 'compile'; fraction: number }
  | { type: 'ready' }
  | { type: 'load-error'; kind: 'unsupported' | 'load-failed'; message: string }
  /** `text` is the full reply so far, not a delta. */
  | { type: 'token'; id: number; text: string }
  | { type: 'done'; id: number; text: string }
  | { type: 'error'; id: number; message: string }
