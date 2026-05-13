import { apiFetch } from './client'

export async function searchLaw(query: string): Promise<string> {
  const res = await apiFetch(`/api/law/search?query=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

export async function fetchLawDetail(lawId: string): Promise<string> {
  const res = await apiFetch(`/api/law/detail?lawId=${encodeURIComponent(lawId)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}
