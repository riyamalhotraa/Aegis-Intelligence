import { Icon } from '@/components/icons/Icon'
import { Button } from './Button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-danger/30 bg-danger-container px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
        <Icon name="error" size={24} />
      </span>
      <div>
        <p className="text-body font-medium text-ink">Couldn't load this data</p>
        <p className="mt-1 text-body-sm text-ink-muted">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" icon="refresh" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}
