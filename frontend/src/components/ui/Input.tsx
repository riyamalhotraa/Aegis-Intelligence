import { forwardRef, type InputHTMLAttributes } from 'react'
import { Icon } from '@/components/icons/Icon'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, icon, error, hint, className = '', id, ...rest },
  ref,
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-label uppercase tracking-wider text-ink-muted">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint">
            <Icon name={icon} size={18} />
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`focus-ring h-10 w-full rounded-md border bg-surface-low px-3 text-body text-ink placeholder:text-ink-faint ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-danger' : 'border-border-strong'} ${className}`}
          {...rest}
        />
      </div>
      {error ? (
        <span className="text-caption text-danger">{error}</span>
      ) : hint ? (
        <span className="text-caption text-ink-faint">{hint}</span>
      ) : null}
    </div>
  )
})
