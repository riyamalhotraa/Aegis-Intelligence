import type { ReactNode } from 'react'
import { Icon } from '@/components/icons/Icon'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon = 'inbox', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-high text-ink-muted">
        <Icon name={icon} size={24} />
      </span>
      <div>
        <p className="text-body font-medium text-ink">{title}</p>
        {description && <p className="mt-1 text-body-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
