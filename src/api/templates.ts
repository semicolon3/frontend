import { apiFetch } from './client'

export type DocumentTemplate = {
  id: number
  name: string
  description: string
  category: string
  templateContent: string
  fieldsJson: string
}

type ApiResponse = {
  success: boolean
  message: string
  data: DocumentTemplate[]
}

export async function fetchTemplates(): Promise<DocumentTemplate[]> {
  const res = await apiFetch('/api/document-templates')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: ApiResponse = await res.json()
  return json.data
}
