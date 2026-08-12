import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, StatusBadge, Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/icons/Icon'
import { SkeletonLines } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAsync } from '@/hooks/useAsync'
import { fetchApprovals, decideApproval } from '@/services/paymentsService'
import { useToast } from '@/contexts/ToastContext'

export function ApprovalCenterPage() {
  const { data, loading, error, refetch, setData } = useAsync(fetchApprovals)
  const { showToast } = useToast()

  const pending = (data ?? []).filter((a) => a.status === 'pending')
  const resolved = (data ?? []).filter((a) => a.status !== 'pending')

  async function decide(id: string, decision: 'approved' | 'rejected') {
    const updated = await decideApproval(id, decision)
    setData((data ?? []).map((a) => (a.id === id ? updated : a)))
    showToast({
      title: decision === 'approved' ? 'Approval granted' : 'Request rejected',
      description: `${id} has been ${decision}.`,
      status: decision === 'approved' ? 'success' : 'danger',
    })
  }

  return (
    <AppShell title="Approval Center" breadcrumb="Payments">
      <PageHeader
        title="Approval Center"
        description="Requests that exceed an agent's delegated authority and require a human sign-off."
      />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <SkeletonLines count={3} />
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-h3 text-ink">Pending your review</h3>
              <Badge tone="warning">{pending.length}</Badge>
            </div>
            {pending.length === 0 ? (
              <EmptyState icon="task_alt" title="All caught up" description="No approvals are waiting on you." />
            ) : (
              <div className="flex flex-col gap-4">
                {pending.map((a) => (
                  <Card key={a.id}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-xl">
                        <CardHeader
                          title={a.title}
                          subtitle={
                            <span className="flex flex-wrap items-center gap-2 font-mono">
                              {a.id} · {a.agentId} · {a.createdAt}
                            </span>
                          }
                        />
                        <p className="text-body-sm text-ink-muted">{a.reason}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {a.policyRefs.map((p) => (
                            <span
                              key={p}
                              className="flex items-center gap-1 rounded-md border border-border-strong bg-surface-low px-2 py-1 text-caption text-ink-muted"
                            >
                              <Icon name="gavel" size={13} /> {p}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <RiskBadge level={a.riskLevel} />
                        <p className="font-mono text-h3 text-ink">${a.amount.toLocaleString()}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" icon="close" onClick={() => decide(a.id, 'rejected')}>
                            Reject
                          </Button>
                          <Button size="sm" icon="check" onClick={() => decide(a.id, 'approved')}>
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-h3 text-ink">Recently resolved</h3>
            <div className="flex flex-col gap-3">
              {resolved.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-md border border-border bg-surface p-4">
                  <div>
                    <p className="text-body-sm font-medium text-ink">{a.title}</p>
                    <p className="font-mono text-caption text-ink-faint">
                      {a.id} · {a.agentId}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-body-sm text-ink-muted">${a.amount.toLocaleString()}</span>
                    <StatusBadge status={a.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AppShell>
  )
}
