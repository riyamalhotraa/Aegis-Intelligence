interface ProgressBarProps {
  value: number // 0-100
  tone?: 'accent' | 'success' | 'warning' | 'danger'
  className?: string
  showLabel?: boolean
}

const toneClasses = {
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

export function ProgressBar({ value, tone = 'accent', className = '', showLabel = false }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-high">
        <div
          className={`h-full rounded-full transition-all duration-500 ${toneClasses[tone]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="w-10 text-right text-caption text-ink-muted">{Math.round(clamped)}%</span>}
    </div>
  )
}
