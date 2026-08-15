import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { LineChart } from '@/components/charts/LineChart'
import { BarChart } from '@/components/charts/BarChart'
import { DonutChart } from '@/components/charts/DonutChart'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { useAsync } from '@/hooks/useAsync'
import { fetchAnalytics } from '@/services/analyticsService'

function RiskAmountChart({
  data,
}: {
  data: {
    id: string
    amount: number
    riskScore: number
    riskLevel: string
    category: string
  }[]
}) {
  const width = 640
  const height = 260
  const padding = 42

  const maxAmount = Math.max(...data.map((d) => d.amount), 1)

  const getRiskColor = (risk: string) => {
    if (risk === 'critical') return '#ff5c5c'
    if (risk === 'high') return '#f5a623'
    if (risk === 'medium') return '#4ea1ff'
    return '#7ed957'
  }

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label="Risk versus payment amount scatter plot"
      >
        {[25, 50, 75].map((risk) => {
          const y =
            height -
            padding -
            (risk / 100) * (height - padding * 2)

          return (
            <g key={risk}>
              <line
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke="#26282a"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#6b6863"
              >
                {risk}
              </text>
            </g>
          )
        })}

        <line
          x1={padding}
          x2={width - padding}
          y1={height - padding}
          y2={height - padding}
          stroke="#26282a"
        />

        <line
          x1={padding}
          x2={padding}
          y1={padding}
          y2={height - padding}
          stroke="#26282a"
        />

        {data.map((point) => {
          const x =
            padding +
            (point.amount / maxAmount) * (width - padding * 2)

          const y =
            height -
            padding -
            (point.riskScore / 100) * (height - padding * 2)

          return (
            <g key={point.id}>
              <circle
                cx={x}
                cy={y}
                r={6}
                fill={getRiskColor(point.riskLevel)}
                opacity={0.9}
              >
                <title>
                  {`${point.id} • $${point.amount.toLocaleString()} • ${point.riskLevel} risk`}
                </title>
              </circle>
            </g>
          )
        })}

        <text
          x={width / 2}
          y={height - 8}
          textAnchor="middle"
          fontSize="11"
          fill="#6b6863"
        >
          Payment Amount ($)
        </text>

        <text
          x={14}
          y={height / 2}
          textAnchor="middle"
          fontSize="11"
          fill="#6b6863"
          transform={`rotate(-90 14 ${height / 2})`}
        >
          Risk Score
        </text>
      </svg>

      <div className="mt-2 flex justify-center gap-5 text-xs text-ink-muted">
        <span>● Low</span>
        <span>● Medium</span>
        <span>● High</span>
        <span>● Critical</span>
      </div>
    </div>
  )
}

function PolicyDecisionChart({
  data,
}: {
  data: {
    label: string
    approved: number
    review: number
    rejected: number
  }[]
}) {
  const max = Math.max(
    ...data.map((d) => d.approved + d.review + d.rejected),
    1,
  )

  return (
    <div className="flex flex-col gap-4">
      {data.map((item) => {
        const total = item.approved + item.review + item.rejected

        return (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between text-body-sm">
              <span className="text-ink">{item.label}</span>
              <span className="font-mono text-ink-muted">{total}</span>
            </div>

            <div className="flex h-3 overflow-hidden rounded-full bg-surface-high">
              {item.approved > 0 && (
                <div
                  className="bg-[#7ed957]"
                  style={{
                    width: `${(item.approved / max) * 100}%`,
                  }}
                  title={`Approved: ${item.approved}`}
                />
              )}

              {item.review > 0 && (
                <div
                  className="bg-[#f5a623]"
                  style={{
                    width: `${(item.review / max) * 100}%`,
                  }}
                  title={`Human approval: ${item.review}`}
                />
              )}

              {item.rejected > 0 && (
                <div
                  className="bg-[#ff5c5c]"
                  style={{
                    width: `${(item.rejected / max) * 100}%`,
                  }}
                  title={`Rejected: ${item.rejected}`}
                />
              )}
            </div>

            <div className="mt-1 flex gap-4 text-xs text-ink-muted">
              <span>Approved {item.approved}</span>
              <span>Review {item.review}</span>
              <span>Rejected {item.rejected}</span>
            </div>
          </div>
        )
      })}

      <div className="mt-1 flex gap-5 text-xs text-ink-muted">
        <span>● Approved</span>
        <span>● Human Review</span>
        <span>● Rejected</span>
      </div>
    </div>
  )
}

export function AnalyticsPage() {
  const { data, loading, error, refetch } = useAsync(fetchAnalytics)

  return (
    <AppShell title="Analytics" breadcrumb="Insights">
      <PageHeader
        title="Payment Analytics"
        description="Financial and governance intelligence across the agent payment ecosystem."
      />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* KPI CARDS */}
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Total Spent"
              value={`$${data!.totalSpent.toLocaleString()}`}
              icon="payments"
            />

            <StatCard
              label="Total Payments"
              value={data!.totalPayments.toString()}
              icon="payments"
            />

            <StatCard
              label="Auto-approved"
              value={`${data!.autoApprovalRate}%`}
              icon="bolt"
            />

            <StatCard
              label="Policy Breaches"
              value={data!.rejectedPayments.toString()}
              delta="blocked"
              deltaDirection="flat"
              icon="report"
            />
          </div>

          {/* ROW 1 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-2">
              <CardHeader
                title="Spend by Category"
                subtitle="Share of non-rejected payment value"
              />
              <div className="flex justify-center py-3">
                <DonutChart data={data!.spendByCategory} />
              </div>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader
                title="Payment Volume Over Time"
                subtitle="Number of payment requests"
              />
              <LineChart
                data={data!.paymentVolumeSeries}
                formatValue={(v) => `${v} payments`}
              />
            </Card>
          </div>

          {/* ROW 2 */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader
                title="Average Payment by Category"
                subtitle="Average value of non-rejected payments"
              />
              <BarChart
                data={data!.averagePaymentByCategory}
                formatValue={(v) => `$${v.toLocaleString()}`}
              />
            </Card>

            <Card>
              <CardHeader
                title="Provider Usage"
                subtitle="Number of requests by provider"
              />
              <BarChart
                data={data!.providerUsage}
                color="#4ea1ff"
                formatValue={(v) => `${v} requests`}
              />
            </Card>
          </div>

          {/* ROW 3 */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader
                title="Policy Decision Analysis"
                subtitle="Governance outcomes by payment category"
              />
              <PolicyDecisionChart data={data!.policyDecisions} />
            </Card>

            <Card>
              <CardHeader
                title="Risk vs Payment Amount"
                subtitle="Relationship between transaction value and risk"
              />
              <RiskAmountChart data={data!.riskPoints} />
            </Card>
          </div>
        </>
      )}
    </AppShell>
  )
}