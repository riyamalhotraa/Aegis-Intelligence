import type { ReactNode } from 'react'
import { Icon } from '@/components/icons/Icon'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative z-10 w-full ${sizeClasses[size]} rounded-lg border border-border-strong bg-surface shadow-elevated`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-h3 text-ink">{title}</h2>
            {description && <p className="mt-1 text-body-sm text-ink-muted">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="focus-ring rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-high hover:text-ink"
            aria-label="Close dialog"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}
