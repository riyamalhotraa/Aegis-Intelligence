interface SparklineProps {
  values: number[]
  width?: number
  height?: number
  color?: string
}

export function Sparkline({ values, width = 96, height = 28, color = '#c6f135' }: SparklineProps) {
  if (values.length === 0) return null
  const max = Math.max(...values)
  const min = Math.min(...values)
  const stepX = width / (values.length - 1 || 1)
  const points = values
    .map((v, i) => {
      const x = i * stepX
      const y = height - ((v - min) / (max - min || 1)) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Sparkline">
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
