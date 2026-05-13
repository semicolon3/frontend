import { apiFetch } from './client'

export type Conversation = {
  id: number
  title: string
  domain: string
  archived: boolean
  createdAt: string
  updatedAt: string
}

export type Citation = { lawId: string; lawName: string; article: string }

export type Message = {
  id: number
  role: 'USER' | 'ASSISTANT'
  content: string
  citations: Citation[]
  createdAt: string
}

type SortInfo = { empty: boolean; sorted: boolean; unsorted: boolean }

type PageData = {
  content: Conversation[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
  sort: SortInfo
  pageable: {
    offset: number
    sort: SortInfo
    paged: boolean
    pageNumber: number
    pageSize: number
    unpaged: boolean
  }
}

type ApiResponse = {
  success: boolean
  message: string
  data: PageData
}

export async function createConversation(domain: string, title?: string): Promise<Conversation> {
  const res = await apiFetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain, ...(title ? { title } : {}) }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: { data: Conversation } = await res.json()
  return json.data
}

export type ConversationDetail = Conversation & { messages: Message[] }

export async function updateConversation(
  id: number,
  body: { title?: string; archived?: boolean },
): Promise<Conversation> {
  const res = await apiFetch(`/api/conversations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: { data: Conversation } = await res.json()
  return json.data
}

export async function deleteConversation(id: number): Promise<void> {
  const res = await apiFetch(`/api/conversations/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function fetchConversationById(id: number): Promise<ConversationDetail> {
  const res = await apiFetch(`/api/conversations/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: { data: ConversationDetail } = await res.json()
  return json.data
}

export async function sendMessage(conversationId: number, content: string): Promise<Message> {
  const res = await apiFetch(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: { data: Message } = await res.json()
  return json.data
}

export async function fetchMessages(conversationId: number): Promise<Message[]> {
  const res = await apiFetch(`/api/conversations/${conversationId}/messages`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: { data: Message[] } = await res.json()
  return json.data
}

export async function fetchConversations(page = 0, size = 20): Promise<PageData> {
  const res = await apiFetch(`/api/conversations?page=${page}&size=${size}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: ApiResponse = await res.json()
  return json.data
}
