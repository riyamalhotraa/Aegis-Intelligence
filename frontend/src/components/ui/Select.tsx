import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { label: string; value: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, className = '', id, ...rest },
  ref,
) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-label uppercase tracking-wider text-ink-muted">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`focus-ring h-10 w-full rounded-md border border-border-strong bg-surface-low px-3 text-body text-ink ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
})
