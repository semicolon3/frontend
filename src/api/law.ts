const BASE_URL = 'https://port-0-legal-ai-mp2pi1ad2d46dc8d.sel3.cloudtype.app'

export async function searchLaw(query: string): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/api/law/search?query=${encodeURIComponent(query)}`
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

export async function fetchLawDetail(lawId: string): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/api/law/detail?lawId=${encodeURIComponent(lawId)}`
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}
