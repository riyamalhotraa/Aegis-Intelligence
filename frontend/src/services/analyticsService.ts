import { spendSeries, approvalVelocitySeries, riskDistribution } from '@/data/governance'
import { withFlakiness } from './api'

export async function fetchAnalytics() {
  return withFlakiness({
    spendSeries,
    approvalVelocitySeries,
    riskDistribution,
  })
}
