const BASE_URL = 'https://port-0-legal-ai-mp2pi1ad2d46dc8d.sel3.cloudtype.app'

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
  const res = await fetch(`${BASE_URL}/api/document-templates`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: ApiResponse = await res.json()
  return json.data
}
