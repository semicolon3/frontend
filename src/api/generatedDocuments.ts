import { apiFetch } from './client'

export type GeneratedDocument = {
  id: number
  templateId: number
  title: string
  content: string
  version: number
  createdAt: string
  updatedAt: string
}

type ApiResponse = {
  success: boolean
  message: string
  data: GeneratedDocument[]
}

type SingleApiResponse = {
  success: boolean
  message: string
  data: GeneratedDocument
}

export type CreateDocumentRequest = {
  templateId: number
  title: string
  fields: Record<string, string>
}

export async function fetchGeneratedDocuments(): Promise<GeneratedDocument[]> {
  const res = await apiFetch('/api/generated-documents')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: ApiResponse = await res.json()
  return json.data
}

export async function fetchGeneratedDocumentById(id: number): Promise<GeneratedDocument> {
  const res = await apiFetch(`/api/generated-documents/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: SingleApiResponse = await res.json()
  return json.data
}

export async function createGeneratedDocument(body: CreateDocumentRequest): Promise<GeneratedDocument> {
  const res = await apiFetch('/api/generated-documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: SingleApiResponse = await res.json()
  return json.data
}

export async function downloadDocumentPdf(id: number): Promise<Blob> {
  const res = await apiFetch(`/api/generated-documents/${id}/pdf`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.blob()
}
