import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { RouterProvider, useRouter } from '@/contexts/RouterContext'
import { ROUTES } from '@/router/routes'

import { LoginPage } from '@/pages/LoginPage'
import { MissionControlPage } from '@/pages/MissionControlPage'
import { AIWorkspacePage } from '@/pages/AIWorkspacePage'
import { AICommandCenterPage } from '@/pages/AICommandCenterPage'
import { PaymentRequestsPage } from '@/pages/PaymentRequestsPage'
import { ApprovalCenterPage } from '@/pages/ApprovalCenterPage'
import { TransactionDetailsPage } from '@/pages/TransactionDetailsPage'
import { PolicyBuilderPage } from '@/pages/PolicyBuilderPage'
import { GuardrailsPage } from '@/pages/GuardrailsPage'
import { IncidentCenterPage } from '@/pages/IncidentCenterPage'
import { BlockchainCommandCenterPage } from '@/pages/BlockchainCommandCenterPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { AuditLogsPage } from '@/pages/AuditLogsPage'
import { SettingsPage } from '@/pages/SettingsPage'

const routeTable: Record<string, () => JSX.Element> = {
  [ROUTES.mission]: MissionControlPage,
  [ROUTES.workspace]: AIWorkspacePage,
  [ROUTES.commandCenter]: AICommandCenterPage,
  [ROUTES.paymentRequests]: PaymentRequestsPage,
  [ROUTES.approvals]: ApprovalCenterPage,
  [ROUTES.transactionDetails]: TransactionDetailsPage,
  [ROUTES.policyBuilder]: PolicyBuilderPage,
  [ROUTES.guardrails]: GuardrailsPage,
  [ROUTES.incidents]: IncidentCenterPage,
  [ROUTES.blockchain]: BlockchainCommandCenterPage,
  [ROUTES.analytics]: AnalyticsPage,
  [ROUTES.auditLogs]: AuditLogsPage,
  [ROUTES.settings]: SettingsPage,
}

function AuthenticatedApp() {
  const { path } = useRouter()
  const Page = routeTable[path] ?? MissionControlPage
  return <Page />
}

function RootRouter() {
  const { user } = useAuth()
  const { path, navigate } = useRouter()

  if (!user) {
    if (path !== ROUTES.login) {
      // Defer to avoid navigating during render.
      queueMicrotask(() => navigate(ROUTES.login))
    }
    return <LoginPage />
  }

  if (path === ROUTES.login) {
    queueMicrotask(() => navigate(ROUTES.mission))
  }

  return <AuthenticatedApp />
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider>
          <RootRouter />
        </RouterProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
