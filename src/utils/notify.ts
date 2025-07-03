import { useToastStore } from '@/stores/toast'

export const notify = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
  // Use in-app toast instead of system notifications
  useToastStore.getState().addToast(message, type)
}
