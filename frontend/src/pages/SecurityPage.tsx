import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { Icon } from '@/components/icons/Icon'
import { useAsync } from '@/hooks/useAsync'
import { fetchSecurityStatus } from '@/services/securityService'

const securityControls = [
  {
    icon: 'database',
    title: 'Data Minimization',
    description:
      'Only information required to evaluate and execute a payment should be processed by AEGIS.',
  },
  {
    icon: 'key',
    title: 'Credential Isolation',
    description:
      'User passwords and private keys should never be stored in payment records or exposed to AI agents.',
  },
  {
    icon: 'lock',
    title: 'Least-Privilege Access',
    description:
      'Agents and external services should receive only the permissions required for their specific task.',
  },
  {
    icon: 'visibility_off',
    title: 'Sensitive Data Protection',
    description:
      'Credentials, API keys and unnecessary personal information should never be exposed through application logs.',
  },
  {
    icon: 'history',
    title: 'Auditability',
    description:
      'Security-sensitive payment decisions and actions remain traceable for investigation and accountability.',
  },
  {
    icon: 'verified_user',
    title: 'Human Oversight',
    description:
      'High-risk or sensitive actions can be escalated to a human instead of being executed autonomously.',
  },
]

export function SecurityPage() {
  const { data, loading, error, refetch } = useAsync(fetchSecurityStatus)

  return (
    <AppShell title="Security & Privacy" breadcrumb="Govern">
      <PageHeader
        title="Security & Privacy"
        description="Protecting sensitive information while keeping autonomous payments controlled and auditable."
      />

      {error ? (
        <Card className="mb-6">
          <div className="p-5">
            <p className="font-medium text-ink">Unable to load security status</p>
            <p className="mt-1 text-body-sm text-ink-muted">{error}</p>
            <button
              onClick={refetch}
              className="mt-3 rounded-md bg-accent px-4 py-2 text-body-sm font-medium text-black"
            >
              Retry
            </button>
          </div>
        </Card>
      ) : (
        <>
          {/* Security posture */}
          <Card className="mb-6">
            <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon name="shield" size={26} filled />
                </div>

                <div>
                  <p className="text-label uppercase tracking-widest text-ink-faint">
                    AEGIS Security Posture
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-ink">
                    Security-First Architecture
                  </h2>

                  <p className="mt-1 max-w-2xl text-body-sm text-ink-muted">
                    {loading
                      ? 'Loading security status...'
                      : `${data?.total_checks ?? 0} requests scanned · ${
                          data?.warnings ?? 0
                        } warnings · ${data?.blocked ?? 0} blocked`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-accent" />

                <span className="text-body-sm font-medium text-accent">
                  {loading
                    ? 'Checking'
                    : data?.status === 'healthy'
                      ? 'Healthy'
                      : 'Attention Required'}
                </span>
              </div>
            </div>
          </Card>

          {/* Live security metrics */}
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card>
              <div className="p-5">
                <p className="text-label uppercase tracking-widest text-ink-faint">
                  Requests Scanned
                </p>
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {loading ? '—' : data?.total_checks ?? 0}
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <p className="text-label uppercase tracking-widest text-ink-faint">
                  Passed
                </p>
                <p className="mt-2 text-2xl font-semibold text-accent">
                  {loading ? '—' : data?.passed ?? 0}
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <p className="text-label uppercase tracking-widest text-ink-faint">
                  Warnings
                </p>
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {loading ? '—' : data?.warnings ?? 0}
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <p className="text-label uppercase tracking-widest text-ink-faint">
                  Audit Coverage
                </p>
                <p className="mt-2 text-2xl font-semibold text-accent">
                  {loading ? '—' : `${data?.audit_coverage ?? 0}%`}
                </p>
              </div>
            </Card>
          </div>

          {/* Security controls */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {securityControls.map((control) => (
              <Card key={control.title}>
                <div className="p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-high text-accent">
                    <Icon name={control.icon} size={20} />
                  </div>

                  <h3 className="text-body-lg font-semibold text-ink">
                    {control.title}
                  </h3>

                  <p className="mt-2 text-body-sm leading-relaxed text-ink-muted">
                    {control.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Secure payment flow */}
          <Card className="mt-6">
            <CardHeader
              title="Secure Payment Flow"
              subtitle="Sensitive information is controlled before a transaction reaches execution."
            />

            <div className="flex flex-col items-center gap-3 px-5 pb-6 lg:flex-row lg:justify-center">
              {[
                'AI Agent',
                'Privacy Check',
                'Policy & Risk',
                'Human Approval',
                'Payment Execution',
              ].map((step, index, arr) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="rounded-lg border border-border bg-surface-high px-4 py-3 text-center text-body-sm font-medium text-ink">
                    {step}
                  </div>

                  {index < arr.length - 1 && (
                    <span className="hidden text-ink-faint lg:block">→</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Production security roadmap */}
          <Card className="mt-6">
            <CardHeader
              title="Production Security Roadmap"
              subtitle="Additional controls planned for production integrations."
            />

            <div className="grid grid-cols-1 gap-3 px-5 pb-5 md:grid-cols-2">
              {[
                'OAuth with scoped permissions',
                'Dedicated secrets management',
                'Encryption at rest and in transit',
                'Credential and token rotation',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-md border border-border bg-surface-low px-4 py-3"
                >
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-body-sm text-ink">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </AppShell>
  )
}