const IS_DEV = import.meta.env.DEV
export const BASE_URL = IS_DEV
  ? ''
  : 'https://port-0-legal-ai-mp2pi1ad2d46dc8d.sel3.cloudtype.app'

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken')
}

export function getEmail(): string | null {
  return localStorage.getItem('userEmail')
}

export function setTokens(accessToken: string, refreshToken: string, email?: string): void {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
  if (email) localStorage.setItem('userEmail', email)
}

export function clearTokens(): void {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userEmail')
}

function authHeaders(init: RequestInit): HeadersInit {
  const token = getAccessToken()
  return {
    ...(init.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return false
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) { clearTokens(); return false }
    const json = await res.json() as { data: { accessToken: string; refreshToken: string } }
    setTokens(json.data.accessToken, json.data.refreshToken)
    return true
  } catch {
    clearTokens()
    return false
  }
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers: authHeaders(init) })

  if (res.status === 401) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      return fetch(`${BASE_URL}${path}`, { ...init, headers: authHeaders(init) })
    }
    window.location.href = '/login'
  }

  return res
}
