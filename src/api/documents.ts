const BASE_URL = 'https://port-0-legal-ai-mp2pi1ad2d46dc8d.sel3.cloudtype.app'

export type Document = {
  id: number
  originalFileName: string
  fileSize: number
  mimeType: string
  documentType: string
  ocrStatus: string
  analysisStatus: string
  createdAt: string
}

type ApiResponse = {
  success: boolean
  message: string
  data: Document[]
}

type SingleApiResponse = {
  success: boolean
  message: string
  data: Document
}

export type DocumentType = 'CONTRACT' | 'KAKAO_CHAT' | 'RECEIPT' | 'OTHER'

export async function fetchDocuments(): Promise<Document[]> {
  const res = await fetch(`${BASE_URL}/api/documents`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: ApiResponse = await res.json()
  return json.data
}

export async function fetchDocumentById(id: number): Promise<Document> {
  const res = await fetch(`${BASE_URL}/api/documents/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: SingleApiResponse = await res.json()
  return json.data
}

export type RiskClause = {
  clauseTitle: string
  description: string
  severity: string
}

export type DocumentAnalysis = {
  documentId: number
  analysisStatus: string
  summary: string | null
  entities: Record<string, string[]> | null
  riskClauses: RiskClause[] | null
}

type AnalysisApiResponse = {
  success: boolean
  message: string
  data: DocumentAnalysis
}

export async function fetchDocumentAnalysis(id: number): Promise<DocumentAnalysis> {
  const res = await fetch(`${BASE_URL}/api/documents/${id}/analysis`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: AnalysisApiResponse = await res.json()
  return json.data
}

export async function deleteDocument(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/documents/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function uploadDocument(file: File, documentType: DocumentType = 'OTHER'): Promise<Document> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE_URL}/api/documents?documentType=${documentType}`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: SingleApiResponse = await res.json()
  return json.data
}
