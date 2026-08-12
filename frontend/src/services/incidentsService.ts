import { incidents } from '@/data/governance'
import { withFlakiness } from './api'
import type { Incident } from '@/types'

export async function fetchIncidents(): Promise<Incident[]> {
  return withFlakiness([...incidents])
}
