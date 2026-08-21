export interface SecurityStatus {
  status: string
  total_checks: number
  passed: number
  warnings: number
  blocked: number
  audit_coverage: number
}


export interface SecurityEvent {
  id: string

  event_type: string

  request_id: string | null

  result: 'passed' | 'warning' | 'blocked'

  details: {
    sensitive_fields?: string[]
    detected_types?: string[]
  }

  sensitive_data: {
    email: string[]
    phone: string[]
    username: string[]
  }

  created_at: string
}


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000'


// ============================================================
// SECURITY STATUS
// ============================================================

export async function fetchSecurityStatus(): Promise<SecurityStatus> {

  const response = await fetch(
    `${API_BASE_URL}/security/status`
  )

  if (!response.ok) {

    throw new Error(
      `Security API request failed: ${response.status}`
    )

  }

  return response.json()
}


// ============================================================
// SECURITY EVENTS
// ============================================================

export async function fetchSecurityEvents(): Promise<SecurityEvent[]> {

  const response = await fetch(
    `${API_BASE_URL}/security/events`
  )

  if (!response.ok) {

    throw new Error(
      `Security events API request failed: ${response.status}`
    )

  }

  return response.json()
}