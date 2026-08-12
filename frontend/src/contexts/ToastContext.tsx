import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { Status } from '@/types'
import { ToastViewport } from '@/components/ui/Toast'

export interface ToastItem {
  id: string
  title: string
  description?: string
  status: Status
}

interface ToastContextValue {
  toasts: ToastItem[]
  showToast: (toast: Omit<ToastItem, 'id'>) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).slice(2, 9)
      setToasts((prev) => [...prev, { ...toast, id }])
      setTimeout(() => dismissToast(id), 4500)
    },
    [dismissToast],
  )

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
