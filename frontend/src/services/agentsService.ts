import { agents, agentLog } from '@/data/agents'
import { withFlakiness } from './api'
import type { Agent, AgentLogEntry } from '@/types'

export async function fetchAgents(): Promise<Agent[]> {
  return withFlakiness([...agents])
}

export async function fetchAgentLog(agentId: string): Promise<AgentLogEntry[]> {
  return withFlakiness(agentLog.filter((l) => l.agentId === agentId))
}
