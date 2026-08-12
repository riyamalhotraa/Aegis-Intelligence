import { useState } from 'react'
import { Icon } from '@/components/icons/Icon'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from '@/contexts/RouterContext'
import { ROUTES } from '@/router/routes'

export function LoginPage() {
  const { login, isAuthenticating } = useAuth()
  const { navigate } = useRouter()
  const [role, setRole] = useState<'Employee' | 'Administrator'>('Employee')
  const [enterpriseId, setEnterpriseId] = useState('AEGIS-992-XXX')
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!enterpriseId.trim() || !passcode.trim()) {
      setError('Enter your enterprise ID and secure passcode to continue.')
      return
    }
    setError(null)
    await login(enterpriseId, role)
    navigate(ROUTES.mission)
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      {/* Left — brand story */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-surface-low p-12 lg:flex">
        <div>
          <div className="mb-8 flex items-center gap-2 text-label uppercase tracking-widest text-success">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-success" />
            System Status: Active Secure Ledger
          </div>
          <h1 className="max-w-md text-display text-ink">Autonomous governance for global payments.</h1>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5 font-mono text-body-sm">
          <div className="mb-3 flex items-center justify-between text-label uppercase tracking-widest text-ink-faint">
            Internal Monologue
            <Icon name="shield" size={16} className="text-accent" />
          </div>
          <p className="text-ink-muted">
            <span className="text-accent">AGENT_01:</span> Verifying node consensus for transaction TX_7782…
          </p>
          <p className="mt-2 text-ink-muted">
            <span className="text-accent">SHIELD_PROTOCOL:</span> Compliance layer 4 active. Anti-fraud check complete.
          </p>
          <p className="mt-2 text-ink-muted">
            <span className="text-accent">SYSTEM:</span> Ready for administrative release.
          </p>
        </div>

        <div className="flex gap-10">
          <div>
            <p className="text-h2 text-ink">1,240+</p>
            <p className="text-body-sm text-ink-faint">Global nodes</p>
          </div>
          <div>
            <p className="text-h2 text-ink">0.02ms</p>
            <p className="text-body-sm text-ink-faint">Validation latency</p>
          </div>
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex items-center justify-center bg-bg p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-ink-onAccent">
              <Icon name="shield" size={20} filled />
            </span>
            <div>
              <p className="text-h3 font-bold leading-none text-ink">AEGIS Intelligence</p>
              <p className="text-caption text-ink-faint">Enterprise AI Governance Platform</p>
            </div>
          </div>

          <p className="mb-2 text-label uppercase tracking-widest text-ink-muted">Select command role</p>
          <div className="mb-5 grid grid-cols-2 gap-3">
            {(['Employee', 'Administrator'] as const).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`focus-ring flex flex-col items-center gap-2 rounded-md border px-4 py-4 text-body-sm font-medium transition-colors ${
                  role === r
                    ? 'border-accent bg-accent text-ink-onAccent'
                    : 'border-border-strong bg-surface-low text-ink-muted hover:text-ink'
                }`}
              >
                <Icon name={r === 'Administrator' ? 'shield_person' : 'person'} size={22} />
                {r}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label="Enterprise ID"
              icon="apartment"
              value={enterpriseId}
              onChange={(e) => setEnterpriseId(e.target.value)}
              placeholder="AEGIS-992-XXX"
            />
            <Input
              label="Secure Passcode"
              icon="lock"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••"
              error={error ?? undefined}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-body-sm">
            <label className="flex items-center gap-2 text-ink-muted">
              <input type="checkbox" className="h-4 w-4 rounded border-border-strong bg-surface-low accent-accent" />
              Remember node
            </label>
            <a className="text-accent hover:underline" href="#">
              Reset identity
            </a>
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full" iconTrailing="arrow_forward" loading={isAuthenticating}>
            Initialize Session
          </Button>

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5 text-caption text-ink-faint">
            <span>AEGIS Intelligence v4.2.1</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-ink-muted">Documentation</a>
              <a href="#" className="hover:text-ink-muted">Support</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
