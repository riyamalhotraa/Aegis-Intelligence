interface IconProps {
  name: string
  className?: string
  size?: number
  filled?: boolean
}

/**
 * Single wrapper around Material Symbols so every icon in the app is sized,
 * weighted and colored the same way. Never reach for ad-hoc icon markup —
 * always go through <Icon />.
 */
export function Icon({ name, className = '', size = 20, filled = false }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}
