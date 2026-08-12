import type { Guardrail } from '@/types'

const API_BASE_URL = 'http://127.0.0.1:8000'

export async function fetchGuardrails(): Promise<Guardrail[]> {
  const response = await fetch(
    `${API_BASE_URL}/guardrails`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch guardrails')
  }

  return response.json()
}

export async function toggleGuardrail(
  id: string,
  enabled: boolean
): Promise<Guardrail> {
  const response = await fetch(
    `${API_BASE_URL}/guardrails/${id}/toggle`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        enabled,
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to update guardrail')
  }

  return response.json()
}