import { paymentRequests } from '@/data/payments'
import { withFlakiness } from './api'

export async function fetchAnalytics() {
  const totalPayments = paymentRequests.length

  // "Total Spent" = payments that have actually settled.
  const totalSpent = paymentRequests
    .filter((p) => p.status === 'settled')
    .reduce((sum, p) => sum + p.amount, 0)

  const approvedPayments = paymentRequests.filter(
    (p) => p.status === 'settled' || p.status === 'processing',
  ).length

  const rejectedPayments = paymentRequests.filter(
    (p) => p.status === 'rejected',
  ).length

  const pendingPayments = paymentRequests.filter(
    (p) => p.status === 'pending',
  ).length

  // Spend by category
  const categoryTotals = new Map<string, number>()

  paymentRequests.forEach((payment) => {
    if (payment.status !== 'rejected') {
      categoryTotals.set(
        payment.category,
        (categoryTotals.get(payment.category) ?? 0) + payment.amount,
      )
    }
  })

  const totalCategorySpend =
    Array.from(categoryTotals.values()).reduce((sum, value) => sum + value, 0) || 1

  const spendByCategory = Array.from(categoryTotals.entries())
    .map(([label, value]) => ({
      label,
      value: Math.round((value / totalCategorySpend) * 100),
    }))
    .sort((a, b) => b.value - a.value)

  // Average payment by category
  const categoryStats = new Map<
    string,
    { total: number; count: number }
  >()

  paymentRequests.forEach((payment) => {
    if (payment.status === 'rejected') return

    const current = categoryStats.get(payment.category) ?? {
      total: 0,
      count: 0,
    }

    current.total += payment.amount
    current.count += 1

    categoryStats.set(payment.category, current)
  })

  const averagePaymentByCategory = Array.from(categoryStats.entries())
    .map(([label, stats]) => ({
      label,
      value: Math.round(stats.total / stats.count),
    }))
    .sort((a, b) => b.value - a.value)

  // Provider usage
  const providerCounts = new Map<string, number>()

  paymentRequests.forEach((payment) => {
    providerCounts.set(
      payment.vendor,
      (providerCounts.get(payment.vendor) ?? 0) + 1,
    )
  })

  const providerUsage = Array.from(providerCounts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)

  // Governance decisions
  const policyDecisionMap = new Map<
    string,
    { approved: number; review: number; rejected: number }
  >()

  paymentRequests.forEach((payment) => {
    const current = policyDecisionMap.get(payment.category) ?? {
      approved: 0,
      review: 0,
      rejected: 0,
    }

    if (payment.status === 'rejected') {
      current.rejected += 1
    } else if (payment.status === 'pending') {
      current.review += 1
    } else {
      current.approved += 1
    }

    policyDecisionMap.set(payment.category, current)
  })

  const policyDecisions = Array.from(policyDecisionMap.entries()).map(
    ([label, values]) => ({
      label,
      ...values,
    }),
  )

  // Payment volume
  // The current demo dataset stores relative timestamps such as
  // "3m ago", "1h ago", etc. We therefore use the existing spend-series
  // structure for the time-series visualization.
  const paymentVolumeSeries = [
    { label: 'Mon', value: 18 },
    { label: 'Tue', value: 24 },
    { label: 'Wed', value: 21 },
    { label: 'Thu', value: 29 },
    { label: 'Fri', value: 34 },
    { label: 'Sat', value: 27 },
    { label: 'Sun', value: totalPayments },
  ]

  // Risk vs amount
  const riskPoints = paymentRequests.map((payment) => {
    const riskScore =
      payment.riskLevel === 'low'
        ? 25
        : payment.riskLevel === 'medium'
          ? 50
          : payment.riskLevel === 'high'
            ? 75
            : 95

    return {
      id: payment.id,
      amount: payment.amount,
      riskScore,
      riskLevel: payment.riskLevel,
      category: payment.category,
    }
  })

  return withFlakiness({
    totalSpent,
    totalPayments,
    approvedPayments,
    rejectedPayments,
    pendingPayments,
    autoApprovalRate:
      totalPayments > 0
        ? Math.round((approvedPayments / totalPayments) * 100)
        : 0,
    spendByCategory,
    paymentVolumeSeries,
    averagePaymentByCategory,
    providerUsage,
    policyDecisions,
    riskPoints,
  })
}