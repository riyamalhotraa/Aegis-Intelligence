import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Switch } from '@/components/ui/Switch'
import { Icon } from '@/components/icons/Icon'
import { Tabs } from '@/components/ui/Tabs'
import { SkeletonLines } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAsync } from '@/hooks/useAsync'
import { fetchGuardrails, toggleGuardrail } from '@/services/guardrailsService'
import { useToast } from '@/contexts/ToastContext'
import type { Guardrail } from '@/types'

const categoryIcon: Record<Guardrail['category'], string> = {
  spending: 'account_balance_wallet',
  access: 'lock',
  compliance: 'gavel',
  behavioral: 'psychology',
}

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Spending', value: 'spending' },
  { label: 'Access', value: 'access' },
  { label: 'Compliance', value: 'compliance' },
  { label: 'Behavioral', value: 'behavioral' },
]

export function GuardrailsPage() {
  const { data, loading, error, refetch, setData } = useAsync(fetchGuardrails)
  const { showToast } = useToast()
  const [tab, setTab] = useState('all')

  const filtered = (data ?? []).filter((g) => tab === 'all' || g.category === tab)

  async function handleToggle(guardrail: Guardrail) {
    const updated = await toggleGuardrail(guardrail.id, !guardrail.enabled)
    setData((data ?? []).map((g) => (g.id === guardrail.id ? updated : g)))
    showToast({
      title: updated.enabled ? 'Guardrail enabled' : 'Guardrail disabled',
      description: `${updated.name} is now ${updated.enabled ? 'active' : 'inactive'}.`,
      status: updated.enabled ? 'success' : 'warning',
    })
  }

  return (
    <AppShell title="Guardrails" breadcrumb="Govern">
      <PageHeader
        title="Guardrails"
        description="Always-on runtime constraints that automatically intervene when an agent's behavior crosses a safe boundary."
      />

      <div className="mb-4">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <SkeletonLines count={3} />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="shield" title="No guardrails in this category" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((g) => (
            <Card key={g.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-high text-ink-muted">
                    <Icon name={categoryIcon[g.category]} size={18} />
                  </span>
                  <CardHeader title={g.name} subtitle={g.description} />
                </div>
                <Switch checked={g.enabled} onChange={() => handleToggle(g)} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-body-sm">
                {g.threshold && (
                  <span className="flex items-center gap-1.5 text-ink-muted">
                    <Icon name="tune" size={15} /> {g.threshold}
                  </span>
                )}
                <Badge tone={g.triggeredCount > 5 ? 'warning' : 'neutral'}>
                  Triggered {g.triggeredCount}× (30d)
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  )
}
