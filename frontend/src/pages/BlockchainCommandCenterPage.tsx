import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonCard, SkeletonLines } from '@/components/ui/Skeleton'
import { useAsync } from '@/hooks/useAsync'
import {
  fetchBlockchain,
  fetchBlockchainStats,
  verifyBlockchain,
  type BlockchainBlock,
} from '@/services/blockchainService'

export function BlockchainCommandCenterPage() {
  const blocksState = useAsync(fetchBlockchain)
  const statsState = useAsync(fetchBlockchainStats)

  const [verifying, setVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [selectedBlock, setSelectedBlock] =
    useState<BlockchainBlock | null>(null)

  const blocks = blocksState.data ?? []
  const stats = statsState.data

  async function handleVerify() {
    try {
      setVerifying(true)

      const result = await verifyBlockchain()

      setVerificationResult(result)

      await statsState.refetch()
      await blocksState.refetch()
    } catch (error) {
      console.error(error)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <AppShell title="Blockchain Command Center">

      <PageHeader
        title="Audit Ledger"
        description="Tamper-evident record of finalized AEGIS decisions."
      />

      {/* ===================================================== */}
      {/* TOP STATISTICS */}
      {/* ===================================================== */}

      {statsState.loading ? (
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : statsState.error ? (
        <div className="mb-6">
          <ErrorState
            message={statsState.error}
            onRetry={statsState.refetch}
          />
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <StatCard
            label="Total Blocks"
            value={String(stats?.totalBlocks ?? 0)}
            icon="link"
          />

          <StatCard
            label="Verified Blocks"
            value={String(stats?.verifiedBlocks ?? 0)}
            icon="verified"
          />

          <StatCard
            label="Tampered Blocks"
            value={String(stats?.tamperedBlocks ?? 0)}
            icon="security"
          />

          <StatCard
            label="Chain Status"
            value={
              stats?.chainStatus === 'verified'
                ? 'Verified'
                : 'Compromised'
            }
            icon="shield"
            delta={
              stats?.chainStatus === 'verified'
                ? '0 anomalies'
                : 'review required'
            }
            deltaDirection={
              stats?.chainStatus === 'verified'
                ? 'up'
                : 'down'
            }
          />

        </div>
      )}

      {/* ===================================================== */}
      {/* VERIFICATION PANEL */}
      {/* ===================================================== */}

      <Card className="mb-6">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-caption text-ink-faint">
              CHAIN INTEGRITY
            </p>

            <h2 className="mt-1 text-h3 text-ink">
              {stats?.chainStatus === 'verified'
                ? 'All blocks verified'
                : 'Chain integrity compromised'}
            </h2>

            <p className="mt-1 text-body-sm text-ink-muted">
              {stats?.verifiedBlocks ?? 0} of{' '}
              {stats?.totalBlocks ?? 0} blocks currently valid.
            </p>

          </div>

          <Button
            onClick={handleVerify}
            disabled={verifying}
          >
            {verifying
              ? 'Verifying...'
              : 'Verify Entire Chain'}
          </Button>

        </div>

        {verificationResult && (
          <div className="mt-4 rounded-md border border-border-subtle bg-surface-low p-4">

            <p className="text-body-sm text-ink">
              {verificationResult.valid ? '✓' : '✕'}{' '}
              {verificationResult.message}
            </p>

            <p className="mt-1 text-caption text-ink-faint">
              {verificationResult.verifiedBlocks} blocks verified ·{' '}
              {verificationResult.tamperedBlocks} tampered
            </p>

          </div>
        )}

      </Card>

      {/* ===================================================== */}
      {/* BLOCKCHAIN VISUALIZATION */}
      {/* ===================================================== */}

      <Card className="mb-6">

        <CardHeader
          title="Chain Visualization"
          subtitle="Linked sequence of finalized AEGIS decisions"
        />

        {blocksState.loading ? (

          <div className="p-5">
            <SkeletonLines count={4} />
          </div>

        ) : blocksState.error ? (

          <div className="p-5">
            <ErrorState
              message={blocksState.error}
              onRetry={blocksState.refetch}
            />
          </div>

        ) : blocks.length === 0 ? (

          <div className="p-8 text-center">
            <p className="text-body-sm text-ink-muted">
              No finalized decisions have been recorded yet.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto p-5">

            <div className="flex min-w-max items-center gap-3">

              {/* GENESIS */}

              <div className="w-[190px] shrink-0 rounded-lg border border-border bg-surface-low p-4">

                <p className="text-caption text-ink-faint">
                  GENESIS
                </p>

                <p className="mt-2 text-body-sm font-medium text-ink">
                  Chain Origin
                </p>

                <p className="mt-2 font-mono text-[11px] text-ink-faint">
                  GENESIS
                </p>

              </div>

              {blocks.map((block) => (

                <div
                  key={block.blockNumber}
                  className="flex items-center gap-3"
                >

                  <span className="text-ink-faint">
                    →
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedBlock(block)}
                    className="w-[230px] shrink-0 rounded-lg border border-border bg-surface-low p-4 text-left transition hover:border-ink-muted hover:bg-surface"
                  >

                    <div className="flex items-center justify-between">

                      <p className="text-caption text-ink-faint">
                        BLOCK #{block.blockNumber}
                      </p>

                      <span className="text-caption text-ink-muted">
                        {block.decision.toUpperCase()}
                      </span>

                    </div>

                    <p className="mt-3 truncate text-body-sm font-medium text-ink">
                      {block.task}
                    </p>

                    <p className="mt-2 text-caption text-ink-muted">
                      {block.decisionBy}
                    </p>

                    <p className="mt-3 truncate font-mono text-[11px] text-ink-faint">
                      {block.hash.slice(0, 16)}...
                    </p>

                  </button>

                </div>

              ))}

            </div>

          </div>

        )}

      </Card>

      {/* ===================================================== */}
      {/* LATEST BLOCK */}
      {/* ===================================================== */}

      {stats?.latestBlock && (

        <Card className="mb-6">

          <div className="flex items-center justify-between gap-4">

            <div>

              <p className="text-caption text-ink-faint">
                LATEST BLOCK
              </p>

              <h2 className="mt-1 text-h3 text-ink">
                Block #{stats.latestBlock.blockNumber}
              </h2>

            </div>

            <Button
              variant="outline"
              onClick={() =>
                setSelectedBlock(stats.latestBlock)
              }
            >
              View Audit Proof
            </Button>

          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            <div>
              <p className="text-caption text-ink-faint">
                Task
              </p>

              <p className="mt-1 text-body-sm text-ink">
                {stats.latestBlock.task}
              </p>
            </div>

            <div>
              <p className="text-caption text-ink-faint">
                Provider
              </p>

              <p className="mt-1 text-body-sm text-ink">
                {stats.latestBlock.provider}
              </p>
            </div>

            <div>
              <p className="text-caption text-ink-faint">
                Decision
              </p>

              <p className="mt-1 text-body-sm font-medium text-ink">
                {stats.latestBlock.decision.toUpperCase()}
              </p>
            </div>

            <div>
              <p className="text-caption text-ink-faint">
                Decision By
              </p>

              <p className="mt-1 text-body-sm text-ink">
                {stats.latestBlock.decisionBy}
              </p>
            </div>

          </div>

        </Card>

      )}

      {/* ===================================================== */}
      {/* AUDIT RECORDS */}
      {/* ===================================================== */}

      <Card padded={false}>

        <div className="border-b border-border p-5">

          <p className="text-caption text-ink-faint">
            AUDIT RECORDS
          </p>

          <h2 className="mt-1 text-h3 text-ink">
            Finalized Decisions
          </h2>

        </div>

        {blocksState.loading ? (

          <div className="p-5">
            <SkeletonLines count={5} />
          </div>

        ) : blocks.length === 0 ? (

          <div className="p-8 text-center">
            <p className="text-body-sm text-ink-muted">
              No audit records yet.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-border">

                  <th className="px-5 py-3 text-caption text-ink-faint">
                    Block
                  </th>

                  <th className="px-5 py-3 text-caption text-ink-faint">
                    Task
                  </th>

                  <th className="px-5 py-3 text-caption text-ink-faint">
                    Provider
                  </th>

                  <th className="px-5 py-3 text-caption text-ink-faint">
                    Decision
                  </th>

                  <th className="px-5 py-3 text-caption text-ink-faint">
                    Decision By
                  </th>

                  <th className="px-5 py-3 text-caption text-ink-faint">
                    Hash
                  </th>

                </tr>

              </thead>

              <tbody>

                {[...blocks].reverse().map((block) => (

                  <tr
                    key={block.blockNumber}
                    onClick={() => setSelectedBlock(block)}
                    className="cursor-pointer border-b border-border transition hover:bg-surface-low"
                  >

                    <td className="px-5 py-4 font-mono text-body-sm text-ink">
                      #{block.blockNumber}
                    </td>

                    <td className="max-w-[260px] truncate px-5 py-4 text-body-sm text-ink">
                      {block.task}
                    </td>

                    <td className="px-5 py-4 text-body-sm text-ink">
                      {block.provider}
                    </td>

                    <td className="px-5 py-4 text-body-sm text-ink">
                      {block.decision}
                    </td>

                    <td className="px-5 py-4 text-body-sm text-ink">
                      {block.decisionBy}
                    </td>

                    <td className="px-5 py-4 font-mono text-[11px] text-ink-faint">
                      {block.hash.slice(0, 18)}...
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </Card>

      {/* ===================================================== */}
      {/* BLOCK DETAIL */}
      {/* ===================================================== */}

      {selectedBlock && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-surface p-6 shadow-xl">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-caption text-ink-faint">
                  AUDIT PROOF
                </p>

                <h2 className="mt-1 text-h2 text-ink">
                  Block #{selectedBlock.blockNumber}
                </h2>

              </div>

              <button
                type="button"
                onClick={() => setSelectedBlock(null)}
                className="text-xl text-ink-muted hover:text-ink"
              >
                ×
              </button>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>
                <p className="text-caption text-ink-faint">
                  Task
                </p>

                <p className="mt-1 text-body-sm text-ink">
                  {selectedBlock.task}
                </p>
              </div>

              <div>
                <p className="text-caption text-ink-faint">
                  Provider
                </p>

                <p className="mt-1 text-body-sm text-ink">
                  {selectedBlock.provider}
                </p>
              </div>

              <div>
                <p className="text-caption text-ink-faint">
                  Amount
                </p>

                <p className="mt-1 font-mono text-body-sm text-ink">
                  ${selectedBlock.amount.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-caption text-ink-faint">
                  Decision
                </p>

                <p className="mt-1 text-body-sm font-medium text-ink">
                  {selectedBlock.decision.toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-caption text-ink-faint">
                  Decision By
                </p>

                <p className="mt-1 text-body-sm text-ink">
                  {selectedBlock.decisionBy}
                </p>
              </div>

              <div>
                <p className="text-caption text-ink-faint">
                  Category
                </p>

                <p className="mt-1 text-body-sm text-ink">
                  {selectedBlock.category ?? '—'}
                </p>
              </div>

            </div>

            <div className="mt-6">

              <p className="text-caption text-ink-faint">
                Reason
              </p>

              <div className="mt-2 rounded-md border border-border-subtle bg-surface-low p-4 text-body-sm text-ink-muted">
                {selectedBlock.reason ?? 'No reason recorded.'}
              </div>

            </div>

            <div className="mt-6 space-y-4">

              <div>

                <p className="text-caption text-ink-faint">
                  Previous Hash
                </p>

                <p className="mt-1 break-all rounded-md border border-border-subtle bg-surface-low p-3 font-mono text-[11px] text-ink-muted">
                  {selectedBlock.previousHash}
                </p>

              </div>

              <div>

                <p className="text-caption text-ink-faint">
                  Current Hash
                </p>

                <p className="mt-1 break-all rounded-md border border-border-subtle bg-surface-low p-3 font-mono text-[11px] text-ink-muted">
                  {selectedBlock.hash}
                </p>

              </div>

            </div>

            <div className="mt-6 rounded-md border border-border-subtle bg-surface-low p-4">

              <p className="text-body-sm font-medium text-ink">
                ✓ Block integrity recorded
              </p>

              <p className="mt-1 text-caption text-ink-muted">
                {new Date(
                  selectedBlock.timestamp
                ).toLocaleString()}
              </p>

            </div>

            <div className="mt-6 flex justify-end">

              <Button
                variant="secondary"
                onClick={() => setSelectedBlock(null)}
              >
                Close
              </Button>

            </div>

          </div>

        </div>

      )}

    </AppShell>
  )
}