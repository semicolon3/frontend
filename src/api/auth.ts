import { apiFetch, setTokens } from './client'

type SignupRequest = {
  email: string
  password: string
  name: string
  phone?: string
}

type AuthData = {
  accessToken: string
  refreshToken: string
  tokenType: string
}

type AuthResponse = {
  success: boolean
  message: string
  data: AuthData
}


export async function login(email: string, password: string): Promise<AuthData> {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`)
  }
  const json: AuthResponse = await res.json()
  setTokens(json.data.accessToken, json.data.refreshToken)
  return json.data
}

export async function signup(body: SignupRequest): Promise<AuthData> {
  const res = await apiFetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`)
  }
  const json: AuthResponse = await res.json()
  setTokens(json.data.accessToken, json.data.refreshToken)
  return json.data
}
