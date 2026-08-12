import { Icon } from '@/components/icons/Icon'
import type { ToastItem } from '@/contexts/ToastContext'

const toneConfig = {
  success: { icon: 'check_circle', class: 'border-success/30 text-success' },
  warning: { icon: 'warning', class: 'border-warning/30 text-warning' },
  danger: { icon: 'error', class: 'border-danger/30 text-danger' },
  info: { icon: 'info', class: 'border-info/30 text-info' },
  neutral: { icon: 'notifications', class: 'border-border-strong text-ink-muted' },
}

export function ToastViewport({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const cfg = toneConfig[t.status]
        return (
          <div
            key={t.id}
            className={`animate-fade-in flex items-start gap-3 rounded-lg border bg-surface-high/95 px-4 py-3 shadow-elevated glass ${cfg.class}`}
          >
            <Icon name={cfg.icon} size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-body-sm font-medium text-ink">{t.title}</p>
              {t.description && <p className="mt-0.5 text-caption text-ink-muted">{t.description}</p>}
            </div>
            <button onClick={() => onDismiss(t.id)} className="text-ink-faint hover:text-ink">
              <Icon name="close" size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
