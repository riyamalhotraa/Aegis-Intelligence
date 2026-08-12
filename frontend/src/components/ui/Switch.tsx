interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <label className={`inline-flex items-center gap-2 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`focus-ring relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ${
          checked ? 'bg-accent' : 'bg-surface-highest'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-150 ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
      {label && <span className="text-body-sm text-ink">{label}</span>}
    </label>
  )
}
