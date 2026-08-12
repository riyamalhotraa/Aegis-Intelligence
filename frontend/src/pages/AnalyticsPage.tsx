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

export function AnalyticsPage() {
  const { data, loading, error, refetch } = useAsync(fetchAnalytics)

  return (
    <AppShell title="Analytics" breadcrumb="Insights">
      <PageHeader
        title="Analytics"
        description="Spend velocity, approval throughput, and portfolio risk distribution across the agent fleet."
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
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="7-day Spend" value="$570.1K" delta="+12.4%" deltaDirection="up" icon="payments" />
            <StatCard label="Avg Approval Time" value="1.8h" delta="-24%" deltaDirection="up" icon="speed" />
            <StatCard label="Auto-approved" value="76%" delta="+4pp" deltaDirection="up" icon="bolt" />
            <StatCard label="Policy Breaches" value="3" delta="this week" deltaDirection="flat" icon="report" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title="Agent Spend, Last 7 Days" subtitle="Aggregate outbound spend across all agents" />
              <LineChart data={data!.spendSeries} formatValue={(v) => `$${v.toLocaleString()}`} />
            </Card>
            <Card>
              <CardHeader title="Risk Distribution" subtitle="Share of transactions by risk tier" />
              <DonutChart data={data!.riskDistribution} />
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Approval Velocity" subtitle="Median hours to resolve a pending approval, by week" />
              <BarChart data={data!.approvalVelocitySeries} formatValue={(v) => `${v}h median`} color="#4ea1ff" />
            </Card>
            <Card>
              <CardHeader title="Top Agents by Spend" subtitle="Last 7 days" />
              <div className="flex flex-col gap-3">
                {[
                  { name: 'Vendor Payments Agent', pct: 62 },
                  { name: 'Treasury Rebalancing Agent', pct: 24 },
                  { name: 'Competitor Sentiment Agent', pct: 9 },
                  { name: 'Compliance Crawler', pct: 5 },
                ].map((row) => (
                  <div key={row.name}>
                    <div className="mb-1 flex items-center justify-between text-body-sm">
                      <span className="text-ink">{row.name}</span>
                      <span className="font-mono text-ink-muted">{row.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-high">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </AppShell>
  )
}
