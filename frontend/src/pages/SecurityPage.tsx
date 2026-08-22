import { useEffect, useState } from 'react'

import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { Icon } from '@/components/icons/Icon'
import { useAsync } from '@/hooks/useAsync'

import {
  fetchSecurityStatus,
  fetchSecurityEvents,
  type SecurityStatus,
  type SecurityEvent,
} from '@/services/securityService'

// ============================================================
// SECURITY CONTROLS
// ============================================================

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

// ============================================================
// SECURITY PAGE
// ============================================================

export function SecurityPage() {
  // ============================================================
  // SECURITY STATUS
  // ============================================================

  const {
    data,
    loading,
    error,
    refetch,
  } = useAsync(fetchSecurityStatus)

  // ============================================================
  // SECURITY EVENTS
  // ============================================================

  const {
    data: events,
    loading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useAsync(fetchSecurityEvents)

  // ============================================================
  // LIVE SECURITY DATA
  // ============================================================

  const [liveData, setLiveData] =
    useState<SecurityStatus | null>(null)

  // ============================================================
  // INITIAL / BACKEND DATA
  // ============================================================

  useEffect(() => {
    if (data) {
      setLiveData(data)
    }
  }, [data])

  // ============================================================
  // LISTEN FOR LIVE UPDATES FROM MISSION CONTROL
  // ============================================================

  useEffect(() => {
    function handleSecurityUpdate(event: Event) {
      const customEvent =
        event as CustomEvent<SecurityStatus>

      if (customEvent.detail) {
        setLiveData(customEvent.detail)
      }
    }

    window.addEventListener(
      'aegis-security-update',
      handleSecurityUpdate,
    )

    return () => {
      window.removeEventListener(
        'aegis-security-update',
        handleSecurityUpdate,
      )
    }
  }, [])

  // ============================================================
  // LIVE BACKEND REFRESH
  // ============================================================

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
      refetchEvents()
    }, 5000)

    return () => clearInterval(interval)
  }, [refetch, refetchEvents])

  // ============================================================
  // CURRENT SECURITY DATA
  // ============================================================

  const currentData =
    liveData ?? data

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <AppShell
      title="Security & Privacy"
      breadcrumb="Govern"
    >
      <PageHeader
        title="Security & Privacy"
        description="Protecting sensitive information while keeping autonomous payments controlled and auditable."
      />

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error ? (
        <Card className="mb-6">
          <div className="p-5">
            <p className="font-medium text-ink">
              Unable to load security status
            </p>

            <p className="mt-1 text-body-sm text-ink-muted">
              {error}
            </p>

            <button
              onClick={() => {
                refetch()
                refetchEvents()
              }}
              className="mt-3 rounded-md bg-accent px-4 py-2 text-body-sm font-medium text-black"
            >
              Retry
            </button>
          </div>
        </Card>
      ) : (
        <>
          {/* ==================================================
              SECURITY POSTURE
          ================================================== */}

          <Card className="mb-6">
            <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon
                    name="shield"
                    size={26}
                    filled
                  />
                </div>

                <div>

                  <p className="text-label uppercase tracking-widest text-ink-faint">
                    AEGIS Security Posture
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-ink">
                    Security-First Architecture
                  </h2>

                  <p className="mt-1 max-w-2xl text-body-sm text-ink-muted">
                    {loading && !currentData
                      ? 'Loading security status...'
                      : `${currentData?.total_checks ?? 0} requests scanned · ${
                          currentData?.warnings ?? 0
                        } warnings · ${
                          currentData?.blocked ?? 0
                        } blocked`}
                  </p>

                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">

                <span className="h-2 w-2 rounded-full bg-accent" />

                <span className="text-body-sm font-medium text-accent">
                  {loading && !currentData
                    ? 'Checking'
                    : currentData?.status === 'healthy'
                      ? 'Healthy'
                      : 'Attention Required'}
                </span>

              </div>

            </div>
          </Card>

          {/* ==================================================
              LIVE SECURITY METRICS
          ================================================== */}

          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

            {/* Requests Scanned */}

            <Card>
              <div className="p-5">

                <p className="text-label uppercase tracking-widest text-ink-faint">
                  Requests Scanned
                </p>

                <p className="mt-2 text-2xl font-semibold text-ink">
                  {loading && !currentData
                    ? '—'
                    : currentData?.total_checks ?? 0}
                </p>

              </div>
            </Card>

            {/* Passed */}

            <Card>
              <div className="p-5">

                <p className="text-label uppercase tracking-widest text-ink-faint">
                  Passed
                </p>

                <p className="mt-2 text-2xl font-semibold text-accent">
                  {loading && !currentData
                    ? '—'
                    : currentData?.passed ?? 0}
                </p>

              </div>
            </Card>

            {/* Warnings */}

            <Card>
              <div className="p-5">

                <p className="text-label uppercase tracking-widest text-ink-faint">
                  Warnings
                </p>

                <p className="mt-2 text-2xl font-semibold text-ink">
                  {loading && !currentData
                    ? '—'
                    : currentData?.warnings ?? 0}
                </p>

              </div>
            </Card>

            {/* Audit Coverage */}

            <Card>
              <div className="p-5">

                <p className="text-label uppercase tracking-widest text-ink-faint">
                  Audit Coverage
                </p>

                <p className="mt-2 text-2xl font-semibold text-accent">
                  {loading && !currentData
                    ? '—'
                    : `${currentData?.audit_coverage ?? 0}%`}
                </p>

              </div>
            </Card>

          </div>

          {/* ==================================================
              RECENT SECURITY EVENTS
          ================================================== */}

          <Card className="mb-6">

            <CardHeader
              title="Recent Security Events"
              subtitle="Sensitive information is masked before being exposed to the application."
            />

            <div className="divide-y divide-border">

              {/* Loading */}

              {eventsLoading ? (

                <div className="p-5 text-body-sm text-ink-muted">
                  Loading security events...
                </div>

              ) : eventsError ? (

                /* Error */

                <div className="p-5">

                  <p className="text-body-sm text-ink-muted">
                    Unable to load security events.
                  </p>

                  <button
                    onClick={refetchEvents}
                    className="mt-3 rounded-md bg-accent px-4 py-2 text-body-sm font-medium text-black"
                  >
                    Retry
                  </button>

                </div>

              ) : !events || events.length === 0 ? (

                /* Empty */

                <div className="p-5 text-body-sm text-ink-muted">
                  No security events recorded yet.
                </div>

              ) : (

                /* Events */

                events
                  .slice(0, 10)
                  .map((event: SecurityEvent) => {

                    // ------------------------------------------------
                    // Always provide safe empty arrays.
                    // This prevents rendering errors when older
                    // events don't contain sensitive_data.
                    // ------------------------------------------------

                    const sensitiveData =
                      event.sensitive_data ?? {
                        email: [],
                        phone: [],
                        username: [],
                      }

                    const hasEmail =
                      sensitiveData.email?.length > 0

                    const hasPhone =
                      sensitiveData.phone?.length > 0

                    const hasUsername =
                      sensitiveData.username?.length > 0

                    const hasSensitiveData =
                      hasEmail ||
                      hasPhone ||
                      hasUsername

                    return (

                      <div
                        key={event.id}
                        className="p-5"
                      >

                        <div className="flex flex-col gap-5">

                          {/* ==================================================
                              EVENT HEADER
                          ================================================== */}

                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">

                            <div>

                              <div className="flex items-center gap-3">

                                <span className="font-medium text-ink">
                                  {event.event_type}
                                </span>

                                <span
                                  className={
                                    `rounded-full px-2.5 py-1 text-xs font-medium ${
                                      event.result === 'blocked'
                                        ? 'bg-red-500/10 text-red-500'
                                        : event.result === 'warning'
                                          ? 'bg-yellow-500/10 text-yellow-500'
                                          : 'bg-accent/10 text-accent'
                                    }`
                                  }
                                >
                                  {event.result}
                                </span>

                              </div>

                              <p className="mt-2 text-body-sm text-ink-muted">
                                Request ID:{' '}
                                {event.request_id ?? 'N/A'}
                              </p>

                              <p className="mt-1 text-xs text-ink-faint">
                                {new Date(
                                  event.created_at
                                ).toLocaleString()}
                              </p>

                            </div>

                          </div>

                          {/* ==================================================
                              DETECTED SENSITIVE DATA
                          ================================================== */}

                          <div className="rounded-lg border border-border bg-surface-low p-4">

                            <div className="mb-3 flex items-center gap-2">

                              <Icon
                                name="visibility_off"
                                size={18}
                              />

                              <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
                                Detected Sensitive Data
                              </p>

                            </div>

                            {hasSensitiveData ? (

                              <div className="space-y-2">

                                {/* EMAIL */}

                                {hasEmail && (
                                  <div className="flex flex-col gap-1 rounded-md border border-border bg-surface-high px-3 py-2 sm:flex-row sm:items-center sm:justify-between">

                                    <span className="text-body-sm text-ink-muted">
                                      Email
                                    </span>

                                    <span className="font-mono text-body-sm font-medium text-ink">
                                      {sensitiveData.email.join(', ')}
                                    </span>

                                  </div>
                                )}

                                {/* PHONE */}

                                {hasPhone && (
                                  <div className="flex flex-col gap-1 rounded-md border border-border bg-surface-high px-3 py-2 sm:flex-row sm:items-center sm:justify-between">

                                    <span className="text-body-sm text-ink-muted">
                                      Phone
                                    </span>

                                    <span className="font-mono text-body-sm font-medium text-ink">
                                      {sensitiveData.phone.join(', ')}
                                    </span>

                                  </div>
                                )}

                                {/* USERNAME */}

                                {hasUsername && (
                                  <div className="flex flex-col gap-1 rounded-md border border-border bg-surface-high px-3 py-2 sm:flex-row sm:items-center sm:justify-between">

                                    <span className="text-body-sm text-ink-muted">
                                      Username
                                    </span>

                                    <span className="font-mono text-body-sm font-medium text-ink">
                                      {sensitiveData.username.join(', ')}
                                    </span>

                                  </div>
                                )}

                              </div>

                            ) : (

                              <div className="flex items-center gap-2">

                                <span className="h-2 w-2 rounded-full bg-accent" />

                                <span className="text-body-sm text-ink-faint">
                                  No sensitive data detected
                                </span>

                              </div>

                            )}

                          </div>

                          {/* ==================================================
                              DETECTION SUMMARY
                          ================================================== */}

                          {event.details?.detected_types &&
                            event.details.detected_types.length > 0 && (

                              <div className="flex flex-wrap items-center gap-2">

                                <span className="text-xs text-ink-faint">
                                  Detected:
                                </span>

                                {event.details.detected_types.map(
                                  (type: string) => (
                                    <span
                                      key={type}
                                      className="rounded-md border border-border bg-surface-high px-2 py-1 text-xs text-ink-muted"
                                    >
                                      {type}
                                    </span>
                                  )
                                )}

                              </div>

                          )}

                        </div>

                      </div>

                    )
                  })

              )}

            </div>

          </Card>

          {/* ==================================================
              SECURITY CONTROLS
          ================================================== */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            {securityControls.map((control) => (

              <Card key={control.title}>

                <div className="p-5">

                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-high text-accent">

                    <Icon
                      name={control.icon}
                      size={20}
                    />

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

          {/* ==================================================
              SECURE PAYMENT FLOW
          ================================================== */}

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

                <div
                  key={step}
                  className="flex items-center gap-3"
                >

                  <div className="rounded-lg border border-border bg-surface-high px-4 py-3 text-center text-body-sm font-medium text-ink">
                    {step}
                  </div>

                  {index < arr.length - 1 && (
                    <span className="hidden text-ink-faint lg:block">
                      →
                    </span>
                  )}

                </div>

              ))}

            </div>

          </Card>

          {/* ==================================================
              PRODUCTION SECURITY ROADMAP
          ================================================== */}

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

                  <span className="text-body-sm text-ink">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </Card>

        </>
      )}

    </AppShell>
  )
}