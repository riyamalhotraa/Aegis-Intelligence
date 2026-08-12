import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Icon } from '@/components/icons/Icon'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: string
  iconTrailing?: string
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-ink-onAccent hover:bg-accent-bright active:bg-accent-dim shadow-card',
  secondary: 'bg-surface-high text-ink hover:bg-surface-highest border border-border-strong',
  outline: 'bg-transparent text-ink border border-border hover:border-border-strong hover:bg-surface-high',
  ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-surface-high',
  danger: 'bg-danger text-white hover:bg-danger/90',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-body-sm gap-1.5',
  md: 'h-10 px-4 text-body gap-2',
  lg: 'h-12 px-5 text-body-lg gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon, iconTrailing, loading, className = '', children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`focus-ring inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />
      )}
      {children}
      {!loading && iconTrailing && <Icon name={iconTrailing} size={size === 'sm' ? 16 : 18} />}
    </button>
  )
})
