import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge, RiskBadge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/icons/Icon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SkeletonLines, Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAsync } from '@/hooks/useAsync'
import { fetchAgents, fetchAgentLog } from '@/services/agentsService'
import { useToast } from '@/contexts/ToastContext'

const logKindStyles: Record<string, string> = {
  info: 'text-ink-muted',
  processing: 'text-info',
  passed: 'text-success',
  flagged: 'text-warning',
  blocked: 'text-danger',
}

export function AIWorkspacePage() {
  const { showToast } = useToast()
  const agentsState = useAsync(fetchAgents)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const activeId = selectedId ?? agentsState.data?.[0]?.id ?? null
  const activeAgent = agentsState.data?.find((a) => a.id === activeId)
  const logState = useAsync(() => (activeId ? fetchAgentLog(activeId) : Promise.resolve([])), [activeId])

  function handleDirective(directive: string) {
    showToast({ title: 'Directive sent', description: `"${directive}" queued for ${activeAgent?.id}.`, status: 'info' })
  }

  return (
    <AppShell title="AI Workspace" breadcrumb="Operate">
      <PageHeader
        title="AI Workspace"
        description="Inspect live reasoning traces and issue directives to autonomous agents in real time."
        action={<Button icon="add">New Agent</Button>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <Card padded={false} className="h-fit overflow-hidden">
          <div className="border-b border-border px-4 py-3 text-label uppercase tracking-widest text-ink-faint">
            Active Agents
          </div>
          {agentsState.loading ? (
            <div className="p-4">
              <SkeletonLines count={4} />
            </div>
          ) : agentsState.error ? (
            <div className="p-4">
              <ErrorState message={agentsState.error} onRetry={agentsState.refetch} />
            </div>
          ) : (
            <div className="flex flex-col">
              {(agentsState.data ?? []).map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedId(agent.id)}
                  className={`focus-ring flex flex-col gap-1.5 border-b border-border-subtle px-4 py-3 text-left transition-colors last:border-b-0 ${
                    agent.id === activeId ? 'bg-surface-high' : 'hover:bg-surface-high/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate text-body-sm font-medium text-ink">{agent.name}</span>
                    <StatusBadge status={agent.status} />
                  </div>
                  <span className="font-mono text-caption text-ink-faint">{agent.id}</span>
                </button>
              ))}
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-6">
          {!activeAgent && !agentsState.loading ? (
            <EmptyState icon="smart_toy" title="No agent selected" description="Choose an agent from the left to inspect its live trace." />
          ) : (
            <>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-caption text-ink-faint">{activeAgent?.id ?? <Skeleton className="h-3 w-32" />}</p>
                    <h3 className="text-h3 text-ink">{activeAgent?.name ?? <Skeleton className="mt-1 h-5 w-48" />}</h3>
                    <p className="mt-1 text-body-sm text-ink-muted">{activeAgent?.objective}</p>
                  </div>
                  <div className="flex gap-2">
                    {activeAgent && <RiskBadge level={activeAgent.riskLevel} />}
                    {activeAgent && <StatusBadge status={activeAgent.status} />}
                  </div>
                </div>
                {activeAgent && (
                  <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
                    <div>
                      <p className="text-caption text-ink-faint">Coherence</p>
                      <ProgressBar value={activeAgent.coherence} className="mt-1.5" showLabel />
                    </div>
                    <div>
                      <p className="text-caption text-ink-faint">Spend today</p>
                      <p className="mt-1 text-body font-medium text-ink">${activeAgent.spendToday.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-caption text-ink-faint">Last active</p>
                      <p className="mt-1 text-body font-medium text-ink">{activeAgent.lastActive}</p>
                    </div>
                  </div>
                )}
              </Card>

              <Card>
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-h3 text-ink">
                    Live Reasoning Trace
                    <Badge tone="accent" dot>
                      Streaming
                    </Badge>
                  </span>
                </div>
                {logState.loading ? (
                  <SkeletonLines count={6} />
                ) : logState.error ? (
                  <ErrorState message={logState.error} onRetry={logState.refetch} />
                ) : (logState.data ?? []).length === 0 ? (
                  <EmptyState icon="terminal" title="No trace yet" description="This agent hasn't produced any reasoning events." />
                ) : (
                  <div className="rounded-md border border-border bg-surface-low p-4 font-mono text-body-sm">
                    {(logState.data ?? []).map((entry) => (
                      <p key={entry.id} className={`mb-2 last:mb-0 ${logKindStyles[entry.kind]}`}>
                        <span className="text-ink-faint">[{entry.timestamp}]</span> {entry.actor}: {entry.message}
                      </p>
                    ))}
                    <p className="text-ink-faint">
                      <span className="animate-blink">▍</span>
                    </p>
                  </div>
                )}
              </Card>

              <Card>
                <p className="mb-3 text-label uppercase tracking-widest text-ink-faint">Issue Directive</p>
                <div className="flex flex-wrap gap-2">
                  {['Pause execution', 'Request status report', 'Escalate to human review', 'Resume with caution'].map(
                    (d) => (
                      <Button key={d} variant="secondary" size="sm" onClick={() => handleDirective(d)}>
                        {d}
                      </Button>
                    ),
                  )}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </AppShell>
  )
}
