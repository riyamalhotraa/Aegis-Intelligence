import { Icon } from '@/components/icons/Icon'
import type { StatDelta } from '@/types'
import { Card } from './Card'

const deltaColor: Record<NonNullable<StatDelta['deltaDirection']>, string> = {
  up: 'text-success',
  down: 'text-danger',
  flat: 'text-ink-muted',
}

const deltaIcon: Record<NonNullable<StatDelta['deltaDirection']>, string> = {
  up: 'trending_up',
  down: 'trending_down',
  flat: 'trending_flat',
}

export function StatCard({ label, value, delta, deltaDirection, icon }: StatDelta) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-label uppercase tracking-widest text-ink-muted">{label}</span>
        {icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-high text-ink-muted">
            <Icon name={icon} size={16} />
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-h1 text-ink">{value}</span>
        {delta && deltaDirection && (
          <span className={`flex items-center gap-0.5 text-body-sm font-medium ${deltaColor[deltaDirection]}`}>
            <Icon name={deltaIcon[deltaDirection]} size={16} />
            {delta}
          </span>
        )}
      </div>
    </Card>
  )
}
