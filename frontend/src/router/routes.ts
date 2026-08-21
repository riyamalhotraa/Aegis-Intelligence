export const ROUTES = {
  login: '/login',
  mission: '/',
  workspace: '/workspace',
  commandCenter: '/command-center',
  paymentRequests: '/payments',
  approvals: '/approvals',
  transactionDetails: '/transactions',
  policyBuilder: '/policies',
  guardrails: '/guardrails',
  incidents: '/incidents',
  blockchain: '/blockchain',
  analytics: '/analytics',
  security: '/security',
  auditLogs: '/audit-logs',
  settings: '/settings',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
