import { delay } from './api'
import type { User } from '@/types'

const SESSION_KEY = 'aegis.session'

export async function login(enterpriseId: string, role: 'Employee' | 'Administrator'): Promise<User> {
  const user: User = {
    id: 'usr_' + Math.random().toString(36).slice(2, 8),
    name: role === 'Administrator' ? 'Morgan Lee' : 'Jordan Reyes',
    role,
    enterpriseId,
    avatarInitials: role === 'Administrator' ? 'ML' : 'JR',
  }
  await delay(null, 600)
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export function getStoredSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
