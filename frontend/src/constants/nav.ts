import { ROUTES } from '@/router/routes'

export interface NavItem {
  label: string
  path: string
  icon: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'Operate',
    items: [
      { label: 'Mission Control', path: ROUTES.mission, icon: 'space_dashboard' },
      // { label: 'AI Workspace', path: ROUTES.workspace, icon: 'smart_toy' },
      { label: 'AI Command Center', path: ROUTES.commandCenter, icon: 'terminal' },
    ],
  },
  {
    label: 'Payments',
    items: [
      { label: 'Payment Requests', path: ROUTES.paymentRequests, icon: 'payments' },
      // { label: 'Approval Center', path: ROUTES.approvals, icon: 'verified_user' },
      { label: 'Transaction Details', path: ROUTES.transactionDetails, icon: 'receipt_long' },
    ],
  },
  {
    label: 'Govern',
    items: [
      { label: 'Policy Builder', path: ROUTES.policyBuilder, icon: 'gavel' },
      { label: 'Guardrails', path: ROUTES.guardrails, icon: 'shield' },
      // { label: 'Incident Center', path: ROUTES.incidents, icon: 'emergency' },
      { label: 'Blockchain Command Center', path: ROUTES.blockchain, icon: 'hub' },
    ],
  },
  // {
  //   label: 'Insights',
  //   items: [
  //     // { label: 'Analytics', path: ROUTES.analytics, icon: 'monitoring' },
  //     // { label: 'Audit Logs', path: ROUTES.auditLogs, icon: 'history' },
  //   ],
  // },
]

// export const settingsNav: NavItem = { label: 'Settings', path: ROUTES.settings, icon: 'settings' }
