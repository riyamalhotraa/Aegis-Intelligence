import type { AnalyticsSeriesPoint } from '@/types'

interface DonutChartProps {
  data: AnalyticsSeriesPoint[]
  colors?: string[]
  size?: number
}

const defaultColors = ['#7ed957', '#f5a623', '#ff5c5c', '#4ea1ff', '#c6f135']

export function DonutChart({ data, colors = defaultColors, size = 180 }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1
  const radius = size / 2
  const stroke = size * 0.16
  const innerRadius = radius - stroke / 2
  const circumference = 2 * Math.PI * innerRadius

  let offsetAcc = 0

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Donut chart">
        <g transform={`rotate(-90 ${radius} ${radius})`}>
          <circle cx={radius} cy={radius} r={innerRadius} fill="none" stroke="#1a1c1c" strokeWidth={stroke} />
          {data.map((d, i) => {
            const fraction = d.value / total
            const dash = fraction * circumference
            const gapLen = circumference - dash
            const el = (
              <circle
                key={d.label}
                cx={radius}
                cy={radius}
                r={innerRadius}
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${gapLen}`}
                strokeDashoffset={-offsetAcc}
                strokeLinecap="butt"
              >
                <title>{`${d.label}: ${d.value}`}</title>
              </circle>
            )
            offsetAcc += dash
            return el
          })}
        </g>
      </svg>
      <ul className="flex flex-col gap-2">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2 text-body-sm text-ink">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-ink-muted">{d.label}</span>
            <span className="font-medium">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
