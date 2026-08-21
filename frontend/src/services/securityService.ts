export interface SecurityStatus {
  status: string
  total_checks: number
  passed: number
  warnings: number
  blocked: number
  audit_coverage: number
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000'

export async function fetchSecurityStatus(): Promise<SecurityStatus> {
  const response = await fetch(`${API_BASE_URL}/security/status`)

  if (!response.ok) {
    throw new Error(
      `Security API request failed: ${response.status}`
    )
  }

  return response.json()
}