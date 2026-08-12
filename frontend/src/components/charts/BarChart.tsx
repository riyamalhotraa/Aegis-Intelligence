import type { AnalyticsSeriesPoint } from '@/types'

interface BarChartProps {
  data: AnalyticsSeriesPoint[]
  height?: number
  color?: string
  formatValue?: (v: number) => string
}

export function BarChart({ data, height = 220, color = '#c6f135', formatValue }: BarChartProps) {
  const width = 640
  const padding = 32
  const max = Math.max(...data.map((d) => d.value)) * 1.15 || 1
  const gap = 16
  const barWidth = (width - padding * 2 - gap * (data.length - 1)) / data.length

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Bar chart">
      {data.map((d, i) => {
        const barHeight = (d.value / max) * (height - padding * 2)
        const x = padding + i * (barWidth + gap)
        const y = height - padding - barHeight
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx={4} fill={color} opacity={0.9}>
              <title>{formatValue ? formatValue(d.value) : d.value}</title>
            </rect>
            <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" fontSize="11" fill="#6b6863">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
