import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padded?: boolean
  interactive?: boolean
}

export function Card({ children, padded = true, interactive = false, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface shadow-card ${padded ? 'p-5' : ''} ${
        interactive ? 'transition-colors duration-150 hover:border-border-strong cursor-pointer' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-h3 text-ink">{title}</h3>
        {subtitle && <p className="mt-1 text-body-sm text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
