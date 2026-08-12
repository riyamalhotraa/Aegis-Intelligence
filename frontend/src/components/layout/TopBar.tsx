import { Icon } from '@/components/icons/Icon'

interface TopBarProps {
  title: string
  breadcrumb?: string
}

export function TopBar({ title, breadcrumb }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border bg-bg/90 px-6 backdrop-blur-md">
      <div>
        {breadcrumb && <p className="text-label uppercase tracking-widest text-ink-faint">{breadcrumb}</p>}
        <h1 className="text-h3 font-semibold text-ink">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-md border border-border bg-surface-low px-3 py-1.5 text-body-sm text-ink-faint sm:flex">
          <Icon name="search" size={16} />
          <span>Search AEGIS…</span>
          <kbd className="ml-4 rounded border border-border-strong bg-surface px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
            ⌘K
          </kbd>
        </div>
        <button className="focus-ring relative rounded-md p-2 text-ink-muted transition-colors hover:bg-surface-high hover:text-ink" aria-label="Notifications">
          <Icon name="notifications" size={20} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <div className="flex items-center gap-1.5 rounded-md border border-success/30 bg-success-container px-2.5 py-1.5 text-caption font-medium text-success">
          <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-success" />
          System Optimal
        </div>
      </div>
    </header>
  )
}
