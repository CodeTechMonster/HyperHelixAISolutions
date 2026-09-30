import { ref } from 'vue'
import { CHATBOT_CONFIG } from './chatbot.config'

/**
 * Lets any part of the site open the chatbot without importing the widget
 * itself (it is lazy-loaded). The widget watches this counter.
 */
export const chatbotOpenRequests = ref(0)

/** Opens the chatbot panel. Returns `false` when the chatbot is disabled. */
export function openChatbot(): boolean {
  if (!CHATBOT_CONFIG.enabled) return false
  chatbotOpenRequests.value++
  return true
}

/**
 * Click handler for "Start the Conversation" links: opens the chatbot instead
 * of following the link. With the chatbot disabled, the link works as before.
 */
export function onStartConversation(event: MouseEvent) {
  if (openChatbot()) event.preventDefault()
}
