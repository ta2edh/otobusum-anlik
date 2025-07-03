import { create } from 'zustand'

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface ToastStore {
  toasts: ToastMessage[]
  addToast: (message: string, type?: ToastMessage['type'], duration?: number) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (message: string, type = 'info', duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const toast: ToastMessage = { id, message, type, duration }
    
    set((state) => ({
      toasts: [...state.toasts, toast]
    }))
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter(t => t.id !== id)
        }))
      }, duration)
    }
  },
  
  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }))
  },
  
  clearAllToasts: () => {
    set({ toasts: [] })
  }
}))
