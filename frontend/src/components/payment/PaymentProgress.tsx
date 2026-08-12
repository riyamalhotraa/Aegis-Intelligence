import { useEffect, useState } from 'react'
import { Icon } from '@/components/icons/Icon'

type PaymentStage =
  | 'payment_required'
  | 'authorized'
  | 'verified'
  | 'settling'
  | 'settled'

interface PaymentProgressProps {
  amount: number
  currency: string
  network: string
}

const stages = [
  {
    id: 'payment_required' as PaymentStage,
    title: 'Payment Required',
    description: 'Payment request generated for this transaction.',
  },
  {
    id: 'authorized' as PaymentStage,
    title: 'Payment Authorized',
    description: 'Payment authorization received.',
  },
  {
    id: 'verified' as PaymentStage,
    title: 'Payment Verified',
    description: 'Payment authorization verified.',
  },
  {
    id: 'settling' as PaymentStage,
    title: 'Settling Payment',
    description: 'Preparing payment settlement.',
  },
  {
    id: 'settled' as PaymentStage,
    title: 'Payment Settled',
    description: 'Demo settlement completed successfully.',
  },
]

export function PaymentProgress({
  amount,
  currency,
  network,
}: PaymentProgressProps) {
  const [currentStage, setCurrentStage] =
    useState<PaymentStage>('payment_required')

  useEffect(() => {
    const timers = [
      window.setTimeout(() => {
        setCurrentStage('authorized')
      }, 1200),

      window.setTimeout(() => {
        setCurrentStage('verified')
      }, 2400),

      window.setTimeout(() => {
        setCurrentStage('settling')
      }, 3600),

      window.setTimeout(() => {
        setCurrentStage('settled')
      }, 5000),
    ]

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer)
      })
    }
  }, [])

  const currentIndex = stages.findIndex(
    (stage) => stage.id === currentStage
  )

  return (
    <div className="rounded-lg border border-border bg-surface-low p-5">

      {/* HEADER */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">

        <div>
          <div className="flex items-center gap-2">
            <Icon
              name="payments"
              size={18}
              className="text-accent"
            />

            <h3 className="text-h3 text-ink">
              Payment Execution
            </h3>
          </div>

          <p className="mt-1 text-body-sm text-ink-muted">
            x402 payment lifecycle
          </p>
        </div>

        <div className="text-right">
          <p className="font-mono text-body-sm text-ink">
            {amount.toFixed(2)} {currency}
          </p>

          <p className="text-caption text-ink-faint">
            {network}
          </p>
        </div>

      </div>

      {/* PAYMENT TIMELINE */}
      <div className="flex flex-col gap-5">

        {stages.map((stage, index) => {

          const completed = index < currentIndex
          const active = index === currentIndex

          return (
            <div
              key={stage.id}
              className="relative flex gap-3"
            >

              {/* CONNECTOR */}
              {index < stages.length - 1 && (
                <span
                  className="absolute left-[9px] top-5 h-[calc(100%+20px)] w-px bg-border"
                />
              )}

              {/* ICON */}
              <div className="relative z-10 shrink-0">

                {completed ? (

                  <Icon
                    name="check_circle"
                    size={20}
                    className="text-success"
                    filled
                  />

                ) : active ? (

                  <Icon
                    name="autorenew"
                    size={20}
                    className="animate-spin text-accent"
                  />

                ) : (

                  <Icon
                    name="radio_button_unchecked"
                    size={20}
                    className="text-ink-faint"
                  />

                )}

              </div>

              {/* TEXT */}
              <div>

                <p
                  className={`text-body-sm font-medium ${
                    active || completed
                      ? 'text-ink'
                      : 'text-ink-faint'
                  }`}
                >
                  {stage.title}

                  {active &&
                    stage.id !== 'settled' && (
                      <span className="ml-2 text-caption text-accent">
                        Processing...
                      </span>
                    )}
                </p>

                <p className="mt-0.5 text-caption text-ink-muted">
                  {stage.description}
                </p>

              </div>

            </div>
          )
        })}

      </div>

      {/* RESULT */}
      <div className="mt-5 border-t border-border pt-4">

        {currentStage === 'settled' ? (

          <div className="rounded-md border border-success/30 bg-success/5 p-3">

            <div className="flex items-center gap-2">

              <Icon
                name="check_circle"
                size={18}
                className="text-success"
                filled
              />

              <span className="text-body-sm font-medium text-ink">
                Payment Settled
              </span>

            </div>

            <p className="mt-1 text-caption text-ink-muted">
              Demo settlement completed successfully.
            </p>

          </div>

        ) : (

          <p className="text-caption text-ink-muted">
            AEGIS is processing the payment lifecycle...
          </p>

        )}

        <p className="mt-3 text-center text-[11px] text-ink-faint">
          Demo settlement · Live x402 gateway integration coming soon
        </p>

      </div>

    </div>
  )
}