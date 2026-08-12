import type { ReactNode } from 'react'
import { Icon } from '@/components/icons/Icon'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function Drawer({ open, onClose, title, children, footer }: DrawerProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-border-strong bg-surface shadow-elevated">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-h3 text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="focus-ring rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-high hover:text-ink"
            aria-label="Close panel"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}
