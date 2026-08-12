import type {
  Policy,
  Guardrail,
  Incident,
  BlockchainNode,
  BlockEntry,
  AuditEntry,
  AnalyticsSeriesPoint,
} from '@/types'

export const policies: Policy[] = [
  {
    id: 'POL-004',
    name: 'Spend Ceiling',
    description: 'Caps single-transaction autonomy at $25,000 without human approval.',
    status: 'active',
    severity: 'medium',
    updatedAt: '2 days ago',
    appliesTo: ['AEGIS-410-NOVA', 'AEGIS-772-BETA'],
    rules: [
      { id: 'r1', field: 'transaction.amount', operator: '>', value: '25000' },
      { id: 'r2', field: 'agent.role', operator: '=', value: 'payments' },
    ],
  },
  {
    id: 'POL-002',
    name: 'Counterparty Verification',
    description: 'Blocks any transfer to a wallet outside the verified counterparty registry.',
    status: 'active',
    severity: 'high',
    updatedAt: '6 days ago',
    appliesTo: ['AEGIS-118-ORION', 'AEGIS-233-VEGA'],
    rules: [
      { id: 'r1', field: 'counterparty.verified', operator: '=', value: 'false' },
    ],
  },
  {
    id: 'POL-011',
    name: 'Vendor Allowlist',
    description: 'Restricts settlement agents to a pre-approved vendor list.',
    status: 'active',
    severity: 'low',
    updatedAt: '1 week ago',
    appliesTo: ['AEGIS-410-NOVA'],
    rules: [{ id: 'r1', field: 'vendor.status', operator: '!=', value: 'approved' }],
  },
  {
    id: 'POL-009',
    name: 'Duplicate Detection',
    description: 'Flags repeated invoice or renewal charges within the same billing cycle.',
    status: 'draft',
    severity: 'low',
    updatedAt: '12 hours ago',
    appliesTo: ['AEGIS-905-LUNA'],
    rules: [{ id: 'r1', field: 'invoice.duplicateWindowDays', operator: '<', value: '30' }],
  },
]

export const guardrails: Guardrail[] = [
  { id: 'G-01', name: 'Max daily spend per agent', category: 'spending', description: 'Hard stop once an agent exceeds its configured daily budget.', enabled: true, threshold: '$50,000 / day', triggeredCount: 3 },
  { id: 'G-02', name: 'Unverified counterparty block', category: 'compliance', description: 'Prevents transfers to wallets outside the verified registry.', enabled: true, threshold: 'registry match required', triggeredCount: 1 },
  { id: 'G-03', name: 'Off-hours activity throttle', category: 'behavioral', description: 'Slows agent execution velocity outside business hours pending review.', enabled: true, threshold: '22:00–06:00 UTC', triggeredCount: 12 },
  { id: 'G-04', name: 'Sensitive data access lock', category: 'access', description: 'Restricts agents from reading PII-tagged data stores without elevated approval.', enabled: true, threshold: 'PII tag present', triggeredCount: 0 },
  { id: 'G-05', name: 'Model drift auto-pause', category: 'behavioral', description: 'Pauses an agent automatically if coherence score drops below threshold.', enabled: false, threshold: 'coherence < 70%', triggeredCount: 2 },
  { id: 'G-06', name: 'Multi-sig for high-risk transfers', category: 'compliance', description: 'Requires two human approvers for any critical-risk transaction.', enabled: true, threshold: 'risk = critical', triggeredCount: 5 },
]

export const incidents: Incident[] = [
  {
    id: 'INC-3391',
    title: 'Anomalous fraud-scoring drift on AEGIS-233-VEGA',
    severity: 'critical',
    status: 'investigating',
    agentId: 'AEGIS-233-VEGA',
    detectedAt: '2 min ago',
    summary: 'Fraud detection agent coherence dropped below 65%, producing inconsistent risk scores on incoming transactions.',
    timeline: [
      { id: 't1', timestamp: '14:19:52', label: 'Coherence threshold breach detected', actor: 'SYSTEM' },
      { id: 't2', timestamp: '14:20:04', label: 'Agent auto-paused pending review', actor: 'GUARDRAIL G-05' },
      { id: 't3', timestamp: '14:21:30', label: 'Security Officer notified', actor: 'SYSTEM' },
    ],
  },
  {
    id: 'INC-3388',
    title: 'Unregistered wallet transfer attempt blocked',
    severity: 'high',
    status: 'contained',
    agentId: 'AEGIS-233-VEGA',
    detectedAt: '8 hr ago',
    summary: 'Treasury agent attempted a transfer to a wallet outside the verified counterparty registry; blocked automatically by POL-002.',
    timeline: [
      { id: 't1', timestamp: '06:11:02', label: 'Transfer request scored critical risk', actor: 'SYSTEM' },
      { id: 't2', timestamp: '06:11:05', label: 'Transaction blocked by policy engine', actor: 'POLICY POL-002' },
      { id: 't3', timestamp: '06:14:00', label: 'Security Officer rejected manually', actor: 'HUMAN' },
      { id: 't4', timestamp: '06:20:00', label: 'Incident marked contained', actor: 'HUMAN' },
    ],
  },
  {
    id: 'INC-3379',
    title: 'Elevated off-hours activity across 3 agents',
    severity: 'medium',
    status: 'resolved',
    agentId: 'AEGIS-905-LUNA',
    detectedAt: '1 day ago',
    summary: 'Behavioral throttle triggered after sustained off-hours execution velocity above baseline.',
    timeline: [
      { id: 't1', timestamp: 'Yesterday 23:41', label: 'Velocity anomaly detected', actor: 'SYSTEM' },
      { id: 't2', timestamp: 'Yesterday 23:42', label: 'Throttle applied automatically', actor: 'GUARDRAIL G-03' },
      { id: 't3', timestamp: 'Today 06:00', label: 'Throttle lifted, activity normalized', actor: 'SYSTEM' },
    ],
  },
]

export const blockchainNodes: BlockchainNode[] = [
  { id: 'n1', region: 'us-east', status: 'healthy', latencyMs: 12, throughput: 4820 },
  { id: 'n2', region: 'us-west', status: 'healthy', latencyMs: 18, throughput: 3910 },
  { id: 'n3', region: 'eu-central', status: 'healthy', latencyMs: 24, throughput: 4110 },
  { id: 'n4', region: 'ap-southeast', status: 'degraded', latencyMs: 96, throughput: 1240 },
  { id: 'n5', region: 'sa-east', status: 'healthy', latencyMs: 41, throughput: 2210 },
  { id: 'n6', region: 'af-south', status: 'offline', latencyMs: 0, throughput: 0 },
]

export const blocks: BlockEntry[] = [
  { height: 1928441, hash: '0x8f3a…d1f4', txCount: 42, timestamp: '2 min ago', validator: 'validator-us-east-03' },
  { height: 1928440, hash: '0x7e29…c8a1', txCount: 31, timestamp: '4 min ago', validator: 'validator-eu-central-01' },
  { height: 1928439, hash: '0x1c4b…9de2', txCount: 55, timestamp: '6 min ago', validator: 'validator-us-west-02' },
  { height: 1928438, hash: '0x1a2b…293a', txCount: 19, timestamp: '18 min ago', validator: 'validator-us-east-01' },
  { height: 1928437, hash: '0x66ab…10fe', txCount: 27, timestamp: '20 min ago', validator: 'validator-ap-southeast-01' },
]

export const spendSeries: AnalyticsSeriesPoint[] = [
  { label: 'Mon', value: 82000 },
  { label: 'Tue', value: 94500 },
  { label: 'Wed', value: 71200 },
  { label: 'Thu', value: 108300 },
  { label: 'Fri', value: 133900 },
  { label: 'Sat', value: 41200 },
  { label: 'Sun', value: 38700 },
]

export const approvalVelocitySeries: AnalyticsSeriesPoint[] = [
  { label: 'Wk 1', value: 4.2 },
  { label: 'Wk 2', value: 3.6 },
  { label: 'Wk 3', value: 3.1 },
  { label: 'Wk 4', value: 2.4 },
  { label: 'Wk 5', value: 2.1 },
  { label: 'Wk 6', value: 1.8 },
]

export const riskDistribution: AnalyticsSeriesPoint[] = [
  { label: 'Low', value: 62 },
  { label: 'Medium', value: 24 },
  { label: 'High', value: 10 },
  { label: 'Critical', value: 4 },
]

export const auditEntries: AuditEntry[] = [
  { id: 'AL-9001', timestamp: '2026-07-30 14:21:16', actor: 'AEGIS-772-BETA', action: 'Policy check passed', target: 'POL-004 Spend Ceiling', result: 'success', ip: '10.20.4.11' },
  { id: 'AL-9000', timestamp: '2026-07-30 14:20:04', actor: 'GUARDRAIL G-05', action: 'Agent auto-paused', target: 'AEGIS-233-VEGA', result: 'success', ip: 'internal' },
  { id: 'AL-8999', timestamp: '2026-07-30 14:14:02', actor: 'jordan.reyes@aegis.io', action: 'Approved payment request', target: 'PMT-50288', result: 'success', ip: '203.0.113.44' },
  { id: 'AL-8998', timestamp: '2026-07-30 13:58:41', actor: 'AEGIS-233-VEGA', action: 'Transaction blocked by policy', target: 'POL-002 Counterparty Verification', result: 'success', ip: 'internal' },
  { id: 'AL-8997', timestamp: '2026-07-30 13:40:17', actor: 'morgan.lee@aegis.io', action: 'Login attempt', target: 'Administrator console', result: 'failure', ip: '198.51.100.7' },
  { id: 'AL-8996', timestamp: '2026-07-30 12:02:55', actor: 'system', action: 'Policy published', target: 'POL-009 Duplicate Detection', result: 'success', ip: 'internal' },
]
