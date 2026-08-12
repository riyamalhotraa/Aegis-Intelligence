interface TabsProps {
  tabs: { label: string; value: string; count?: number }[]
  active: string
  onChange: (value: string) => void
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-border">
      {tabs.map((tab) => {
        const isActive = tab.value === active
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`focus-ring relative flex items-center gap-2 px-4 py-2.5 text-body-sm font-medium transition-colors ${
              isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span className="rounded-full bg-surface-high px-1.5 py-0.5 text-caption text-ink-muted">
                {tab.count}
              </span>
            )}
            {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent" />}
          </button>
        )
      })}
    </div>
  )
}
