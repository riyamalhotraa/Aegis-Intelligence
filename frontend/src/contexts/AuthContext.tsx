import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@/types'
import { getStoredSession, clearSession, login as loginRequest } from '@/services/authService'

interface AuthContextValue {
  user: User | null
  isAuthenticating: boolean
  login: (enterpriseId: string, role: 'Employee' | 'Administrator') => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    setUser(getStoredSession())
  }, [])

  async function login(enterpriseId: string, role: 'Employee' | 'Administrator') {
    setIsAuthenticating(true)
    try {
      const u = await loginRequest(enterpriseId, role)
      setUser(u)
    } finally {
      setIsAuthenticating(false)
    }
  }

  function logout() {
    clearSession()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticating, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
