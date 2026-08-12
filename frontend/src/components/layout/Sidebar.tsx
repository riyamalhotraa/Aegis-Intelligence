import { Icon } from '@/components/icons/Icon'
import { navGroups, settingsNav } from '@/constants/nav'
import { useRouter } from '@/contexts/RouterContext'
import { useAuth } from '@/contexts/AuthContext'

export function Sidebar() {
  const { path, navigate } = useRouter()
  const { user, logout } = useAuth()

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface-low">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-ink-onAccent">
          <Icon name="shield" size={18} filled />
        </span>
        <div className="leading-tight">
          <p className="text-body-lg font-bold tracking-tight text-ink">AEGIS</p>
          <p className="-mt-0.5 text-label uppercase tracking-widest text-ink-faint">Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-1.5 px-3 text-label uppercase tracking-widest text-ink-faint">{group.label}</p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = path === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`focus-ring group flex items-center gap-3 rounded-md px-3 py-2 text-body-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? 'bg-accent text-ink-onAccent'
                        : 'text-ink-muted hover:bg-surface-high hover:text-ink'
                    }`}
                  >
                    <Icon name={item.icon} size={18} filled={isActive} />
                    <span className="truncate">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* <div className="border-t border-border p-3">
        <button
          onClick={() => navigate(settingsNav.path)}
          className={`focus-ring mb-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-body-sm font-medium transition-colors ${
            path === settingsNav.path ? 'bg-accent text-ink-onAccent' : 'text-ink-muted hover:bg-surface-high hover:text-ink'
          }`}
        >
          <Icon name={settingsNav.icon} size={18} />
          {settingsNav.label}
        </button>
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-high text-caption font-semibold text-ink">
            {user?.avatarInitials ?? '—'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-sm font-medium text-ink">{user?.name ?? 'Guest'}</p>
            <p className="truncate text-caption text-ink-faint">{user?.role ?? ''}</p>
          </div>
          <button onClick={logout} className="focus-ring rounded-md p-1.5 text-ink-faint hover:bg-surface-high hover:text-ink" aria-label="Sign out">
            <Icon name="logout" size={18} />
          </button>
        </div>
      </div> */}
    </aside>
  )
}
