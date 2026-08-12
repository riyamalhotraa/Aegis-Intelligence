import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, className = '', id, ...rest },
  ref,
) {
  const areaId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={areaId} className="text-label uppercase tracking-wider text-ink-muted">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        className={`focus-ring min-h-[88px] w-full rounded-md border border-border-strong bg-surface-low px-3 py-2 text-body text-ink placeholder:text-ink-faint ${className}`}
        {...rest}
      />
      {hint && <span className="text-caption text-ink-faint">{hint}</span>}
    </div>
  )
})
