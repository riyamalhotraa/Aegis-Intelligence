import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/icons/Icon'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

const tabs = [
  { label: 'Profile', value: 'profile' },
  { label: 'Security', value: 'security' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'API & Webhooks', value: 'api' },
  { label: 'Team', value: 'team' },
]

export function SettingsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [tab, setTab] = useState('profile')
  const [notifPolicy, setNotifPolicy] = useState(true)
  const [notifIncident, setNotifIncident] = useState(true)
  const [notifDigest, setNotifDigest] = useState(false)
  const [mfa, setMfa] = useState(true)

  function handleSave() {
    showToast({ title: 'Settings saved', description: 'Your changes have been applied.', status: 'success' })
  }

  return (
    <AppShell title="Settings" breadcrumb="Platform">
      <PageHeader title="Settings" description="Manage your profile, security posture, and platform preferences." />

      <div className="mb-6">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </div>

      {tab === 'profile' && (
        <Card className="max-w-2xl">
          <CardHeader title="Profile" subtitle="This information is visible to other operators in your organization." />
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-high text-h2 font-semibold text-ink">
                {user?.avatarInitials ?? '—'}
              </span>
              <Button variant="secondary" size="sm" icon="upload">
                Change avatar
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full name" defaultValue={user?.name} />
              <Input label="Role" defaultValue={user?.role} disabled />
              <Input label="Enterprise ID" defaultValue={user?.enterpriseId} disabled />
              <Input label="Email" placeholder="you@company.com" />
            </div>
            <div>
              <Button icon="save" onClick={handleSave}>
                Save changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {tab === 'security' && (
        <Card className="max-w-2xl">
          <CardHeader title="Security" subtitle="Protect your access to the governance console." />
          <div className="flex flex-col divide-y divide-border-subtle">
            <div className="flex items-center justify-between py-4 first:pt-0">
              <div className="flex items-center gap-3">
                <Icon name="shield_lock" size={20} className="text-ink-muted" />
                <div>
                  <p className="text-body-sm font-medium text-ink">Multi-factor authentication</p>
                  <p className="text-caption text-ink-faint">Require a second factor on every sign-in</p>
                </div>
              </div>
              <Switch checked={mfa} onChange={setMfa} />
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Icon name="password" size={20} className="text-ink-muted" />
                <div>
                  <p className="text-body-sm font-medium text-ink">Passcode</p>
                  <p className="text-caption text-ink-faint">Last changed 34 days ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Rotate passcode
              </Button>
            </div>
            <div className="flex items-center justify-between py-4 last:pb-0">
              <div className="flex items-center gap-3">
                <Icon name="devices" size={20} className="text-ink-muted" />
                <div>
                  <p className="text-body-sm font-medium text-ink">Active sessions</p>
                  <p className="text-caption text-ink-faint">2 devices currently signed in</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </div>
        </Card>
      )}

      {tab === 'notifications' && (
        <Card className="max-w-2xl">
          <CardHeader title="Notifications" subtitle="Choose what AEGIS should alert you about." />
          <div className="flex flex-col divide-y divide-border-subtle">
            <div className="flex items-center justify-between py-4 first:pt-0">
              <div>
                <p className="text-body-sm font-medium text-ink">Policy breaches</p>
                <p className="text-caption text-ink-faint">Notify me the moment a policy is violated</p>
              </div>
              <Switch checked={notifPolicy} onChange={setNotifPolicy} />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-body-sm font-medium text-ink">Incident alerts</p>
                <p className="text-caption text-ink-faint">Real-time push for new incidents</p>
              </div>
              <Switch checked={notifIncident} onChange={setNotifIncident} />
            </div>
            <div className="flex items-center justify-between py-4 last:pb-0">
              <div>
                <p className="text-body-sm font-medium text-ink">Weekly digest</p>
                <p className="text-caption text-ink-faint">Summary of spend, approvals, and risk trends</p>
              </div>
              <Switch checked={notifDigest} onChange={setNotifDigest} />
            </div>
          </div>
        </Card>
      )}

      {tab === 'api' && (
        <Card className="max-w-2xl">
          <CardHeader title="API & Webhooks" subtitle="Programmatic access to the AEGIS governance layer." />
          <div className="flex flex-col gap-4">
            <Input label="Production API key" defaultValue="sk_live_••••••••••••4f21" disabled icon="key" />
            <Input label="Webhook endpoint" placeholder="https://your-service.com/webhooks/aegis" icon="webhook" />
            <Select
              label="Event subscription"
              options={[
                { label: 'All events', value: 'all' },
                { label: 'Approvals only', value: 'approvals' },
                { label: 'Incidents only', value: 'incidents' },
              ]}
            />
            <div>
              <Button icon="save" onClick={handleSave}>
                Save configuration
              </Button>
            </div>
          </div>
        </Card>
      )}

      {tab === 'team' && (
        <Card className="max-w-2xl">
          <CardHeader
            title="Team"
            subtitle="Operators with access to this AEGIS workspace."
            action={
              <Button size="sm" icon="person_add">
                Invite
              </Button>
            }
          />
          <div className="flex flex-col divide-y divide-border-subtle">
            {[
              { name: 'Morgan Lee', role: 'Administrator', email: 'morgan.lee@aegis.io' },
              { name: 'Jordan Reyes', role: 'Employee', email: 'jordan.reyes@aegis.io' },
              { name: 'Alex Kim', role: 'Auditor', email: 'alex.kim@aegis.io' },
            ].map((member) => (
              <div key={member.email} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-high text-caption font-semibold text-ink">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                  <div>
                    <p className="text-body-sm font-medium text-ink">{member.name}</p>
                    <p className="text-caption text-ink-faint">{member.email}</p>
                  </div>
                </div>
                <span className="text-body-sm text-ink-muted">{member.role}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </AppShell>
  )
}
