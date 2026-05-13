import { apiFetch } from './client'

export type UserMe = {
  id: number
  email: string
  name: string
  phone: string
  role: string
  createdAt: string
}

type ApiResponse = {
  success: boolean
  message: string
  data: UserMe
}

export async function updateMe(body: { name?: string; phone?: string }): Promise<UserMe> {
  const res = await apiFetch('/api/users/me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: ApiResponse = await res.json()
  return json.data
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await apiFetch('/api/users/me/password', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`)
  }
}

export async function deleteMe(): Promise<void> {
  const res = await apiFetch('/api/users/me', { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function fetchMe(): Promise<UserMe> {
  const res = await apiFetch('/api/users/me')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: ApiResponse = await res.json()
  return json.data
}
