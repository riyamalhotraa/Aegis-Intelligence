import type { AnalyticsSeriesPoint } from '@/types'

interface LineChartProps {
  data: AnalyticsSeriesPoint[]
  height?: number
  color?: string
  formatValue?: (v: number) => string
}

export function LineChart({ data, height = 220, color = '#c6f135', formatValue }: LineChartProps) {
  const width = 640
  const padding = 32
  const max = Math.max(...data.map((d) => d.value)) * 1.1
  const min = Math.min(0, Math.min(...data.map((d) => d.value)))
  const stepX = (width - padding * 2) / (data.length - 1 || 1)

  const points = data.map((d, i) => {
    const x = padding + i * stepX
    const y = height - padding - ((d.value - min) / (max - min || 1)) * (height - padding * 2)
    return { x, y, d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? 0} ${height - padding} L ${points[0]?.x ?? 0} ${
    height - padding
  } Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Line chart">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={padding}
          x2={width - padding}
          y1={padding + f * (height - padding * 2)}
          y2={padding + f * (height - padding * 2)}
          stroke="#26282a"
          strokeDasharray="4 4"
        />
      ))}
      <path d={areaPath} fill="url(#lineFill)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3.5} fill="#0a0b0c" stroke={color} strokeWidth={2} />
          <text x={p.x} y={height - 8} textAnchor="middle" fontSize="11" fill="#6b6863">
            {p.d.label}
          </text>
        </g>
      ))}
      {points.map((p, i) => (
        <title key={`t-${i}`}>{formatValue ? formatValue(p.d.value) : p.d.value}</title>
      ))}
    </svg>
  )
}
