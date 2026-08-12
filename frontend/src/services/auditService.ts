import { auditEntries } from '@/data/governance'
import { withFlakiness } from './api'
import type { AuditEntry } from '@/types'

export async function fetchAuditLog(): Promise<AuditEntry[]> {
  return withFlakiness([...auditEntries])
}
