import { apiFetch } from './client'

export type LawItem = {
  id: string
  법령ID: string
  법령명한글: string
  법령구분명: string
  소관부처명: string
  시행일자: string
  공포일자: string
}

export type LawSearchResult = {
  items: LawItem[]
  totalCnt: number
  keyword: string
}

export async function searchLaw(query: string): Promise<LawSearchResult> {
  const res = await apiFetch(`/api/law/search?query=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const text = await res.text()
  const json = JSON.parse(text)
  const data = json.LawSearch ?? {}
  return {
    items: (data.law ?? []) as LawItem[],
    totalCnt: Number(data.totalCnt ?? 0),
    keyword: data.키워드 ?? query,
  }
}

export async function fetchLawDetail(lawId: string): Promise<string> {
  const res = await apiFetch(`/api/law/detail?lawId=${encodeURIComponent(lawId)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}
