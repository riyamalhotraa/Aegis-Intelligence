import type { Agent, AgentLogEntry } from '@/types'

export const agents: Agent[] = [
  {
    id: 'AEGIS-772-BETA',
    name: 'Competitor Sentiment Agent',
    objective: 'Competitor Q3 Sentiment Analysis',
    status: 'running',
    riskLevel: 'low',
    coherence: 98.6,
    spendToday: 412.5,
    lastActive: '2m ago',
  },
  {
    id: 'AEGIS-410-NOVA',
    name: 'Vendor Payments Agent',
    objective: 'Autonomous vendor settlement batch #4471',
    status: 'running',
    riskLevel: 'medium',
    coherence: 94.1,
    spendToday: 18420.0,
    lastActive: 'just now',
  },
  {
    id: 'AEGIS-118-ORION',
    name: 'Treasury Rebalancing Agent',
    objective: 'Cross-chain liquidity rebalancing',
    status: 'paused',
    riskLevel: 'high',
    coherence: 81.3,
    spendToday: 0,
    lastActive: '14m ago',
  },
  {
    id: 'AEGIS-905-LUNA',
    name: 'Compliance Crawler',
    objective: 'SEC filings cross-reference sweep',
    status: 'running',
    riskLevel: 'low',
    coherence: 99.2,
    spendToday: 12.0,
    lastActive: '31s ago',
  },
  {
    id: 'AEGIS-233-VEGA',
    name: 'Fraud Detection Agent',
    objective: 'Real-time transaction anomaly scoring',
    status: 'error',
    riskLevel: 'critical',
    coherence: 62.8,
    spendToday: 0,
    lastActive: '2m ago',
  },
]

export const agentLog: AgentLogEntry[] = [
  { id: 'l1', agentId: 'AEGIS-772-BETA', timestamp: '14:21:05', actor: 'SYSTEM', message: 'Booting heuristic engine…', kind: 'info' },
  { id: 'l2', agentId: 'AEGIS-772-BETA', timestamp: '14:21:07', actor: 'AGENT', message: 'Agent initialized with objective: "Competitor Q3 Sentiment Analysis".', kind: 'info' },
  { id: 'l3', agentId: 'AEGIS-772-BETA', timestamp: '14:21:09', actor: 'RISK', message: 'High volatility detected in sector X.', kind: 'flagged' },
  { id: 'l4', agentId: 'AEGIS-772-BETA', timestamp: '14:21:12', actor: 'AGENT', message: 'Crawling high-fidelity data sources and SEC filings.', kind: 'processing' },
  { id: 'l5', agentId: 'AEGIS-772-BETA', timestamp: '14:21:15', actor: 'POLICY', message: 'Cross-referencing findings with Corporate Governance Policy v4.2.', kind: 'info' },
  { id: 'l6', agentId: 'AEGIS-772-BETA', timestamp: '14:21:16', actor: 'POLICY', message: 'Checking compliance branch 7… [PASSED]', kind: 'passed' },
  { id: 'l7', agentId: 'AEGIS-772-BETA', timestamp: '14:21:18', actor: 'AGENT', message: 'Awaiting directive…', kind: 'info' },
]
