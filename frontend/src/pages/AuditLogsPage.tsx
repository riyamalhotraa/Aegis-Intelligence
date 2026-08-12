import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, type Column } from '@/components/ui/Table'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SkeletonLines } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAsync } from '@/hooks/useAsync'
import { fetchAuditLog } from '@/services/auditService'
import type { AuditEntry } from '@/types'

export function AuditLogsPage() {
  const { data, loading, error, refetch } = useAsync(fetchAuditLog)
  const [query, setQuery] = useState('')

  const filtered = (data ?? []).filter(
    (e) =>
      e.actor.toLowerCase().includes(query.toLowerCase()) ||
      e.action.toLowerCase().includes(query.toLowerCase()) ||
      e.target.toLowerCase().includes(query.toLowerCase()),
  )

  const columns: Column<AuditEntry>[] = [
    { header: 'Timestamp', key: 'timestamp', render: (e) => <span className="font-mono text-ink-muted">{e.timestamp}</span> },
    { header: 'Actor', key: 'actor', render: (e) => <span className="font-mono text-ink">{e.actor}</span> },
    { header: 'Action', key: 'action' },
    { header: 'Target', key: 'target', render: (e) => <span className="font-mono text-ink-muted">{e.target}</span> },
    { header: 'Result', key: 'result', render: (e) => <Badge tone={e.result === 'success' ? 'success' : 'danger'}>{e.result}</Badge> },
    { header: 'Source IP', key: 'ip', align: 'right', render: (e) => <span className="font-mono text-ink-faint">{e.ip}</span> },
  ]

  return (
    <AppShell title="Audit Logs" breadcrumb="Insights">
      <PageHeader
        title="Audit Logs"
        description="An immutable record of every human and agent action taken across the platform."
        action={
          <Button variant="outline" icon="download">
            Export CSV
          </Button>
        }
      />

      <Card padded={false}>
        <div className="flex items-center justify-between gap-4 border-b border-border p-4">
          <Input icon="search" placeholder="Search actor, action, or target…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
        </div>
        <div className="p-4">
          {error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : loading ? (
            <SkeletonLines count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState icon="history" title="No matching audit entries" />
          ) : (
            <Table columns={columns} rows={filtered} rowKey={(r) => r.id} />
          )}
        </div>
      </Card>
    </AppShell>
  )
}
