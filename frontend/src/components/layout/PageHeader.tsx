import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-h1 text-ink">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-body text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
