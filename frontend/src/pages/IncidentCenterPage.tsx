import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge, RiskBadge, StatusBadge } from '@/components/ui/Badge'
import { Icon } from '@/components/icons/Icon'
import { SkeletonLines } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAsync } from '@/hooks/useAsync'
import { fetchIncidents } from '@/services/incidentsService'
import type { Incident } from '@/types'

const severityBorder: Record<Incident['severity'], string> = {
  low: 'border-l-success',
  medium: 'border-l-warning',
  high: 'border-l-danger',
  critical: 'border-l-danger',
}

export function IncidentCenterPage() {
  const { data, loading, error, refetch } = useAsync(fetchIncidents)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const active: Incident | undefined = (data ?? []).find((i) => i.id === selectedId) ?? data?.[0]

  const openCount = (data ?? []).filter((i) => i.status === 'open' || i.status === 'investigating').length

  return (
    <AppShell title="Incident Center" breadcrumb="Govern">
      <PageHeader
        title="Incident Center"
        description="Detected anomalies, policy breaches, and agent failures — tracked from detection through resolution."
        action={
          openCount > 0 ? (
            <Badge tone="danger" dot>
              {openCount} open
            </Badge>
          ) : (
            <Badge tone="success" dot>
              All clear
            </Badge>
          )
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : loading ? (
        <SkeletonLines count={6} />
      ) : (data ?? []).length === 0 ? (
        <EmptyState icon="emergency" title="No incidents recorded" description="AEGIS hasn't detected any anomalies." />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          <div className="flex flex-col gap-3">
            {(data ?? []).map((incident) => (
              <button
                key={incident.id}
                onClick={() => setSelectedId(incident.id)}
                className={`focus-ring flex flex-col gap-2 rounded-lg border-l-4 border border-border bg-surface p-4 text-left transition-colors ${
                  severityBorder[incident.severity]
                } ${incident.id === active?.id ? 'bg-surface-high' : 'hover:bg-surface-high/50'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-caption text-ink-faint">{incident.id}</span>
                  <StatusBadge status={incident.status} />
                </div>
                <p className="text-body-sm font-medium text-ink">{incident.title}</p>
                <div className="flex items-center justify-between text-caption text-ink-faint">
                  <span>{incident.detectedAt}</span>
                  <RiskBadge level={incident.severity} />
                </div>
              </button>
            ))}
          </div>

          {active && (
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="font-mono text-caption text-ink-faint">{active.id}</p>
                  <h3 className="mt-1 text-h2 text-ink">{active.title}</h3>
                  <p className="mt-2 max-w-2xl text-body-sm text-ink-muted">{active.summary}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <RiskBadge level={active.severity} />
                  <StatusBadge status={active.status} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-body-sm text-ink-muted">
                <Icon name="smart_toy" size={16} />
                Related agent: <span className="font-mono text-ink">{active.agentId}</span>
              </div>

              <p className="mb-4 mt-6 text-label uppercase tracking-widest text-ink-faint">Incident Timeline</p>
              <ol className="flex flex-col gap-5 border-l border-border pl-5">
                {active.timeline.map((event) => (
                  <li key={event.id} className="relative">
                    <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border-2 border-bg bg-accent" />
                    <p className="font-mono text-caption text-ink-faint">
                      {event.timestamp} · {event.actor}
                    </p>
                    <p className="mt-0.5 text-body-sm text-ink">{event.label}</p>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </div>
      )}
    </AppShell>
  )
}
