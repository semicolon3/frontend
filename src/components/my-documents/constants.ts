export type Tab = 'all' | 'CONTRACT' | 'KAKAO_CHAT' | 'OTHER'
export type FileKind = 'pdf' | 'image' | 'doc' | 'text'

export const TAB_LABEL: Record<Tab, string> = {
  all: '전체',
  CONTRACT: '계약서',
  KAKAO_CHAT: '카톡·캡처',
  OTHER: '합의서·기타',
}

export const DOC_TAG: Record<string, string> = {
  CONTRACT: '계약서',
  KAKAO_CHAT: '카톡 캡처',
  RECEIPT: '영수증',
  OTHER: '기타',
}

export const TYPE_ICON_CLASS: Record<FileKind, string> = {
  pdf: 'bg-risk-high-bg text-danger',
  image: 'bg-[#f3eeff] text-[#8b5cf6]',
  doc: 'bg-primary-soft text-primary',
  text: 'bg-bg text-ink-soft',
}

export function getFileKind(mimeType: string, fileName: string): FileKind {
  const l = fileName.toLowerCase()
  if (mimeType.includes('pdf') || l.endsWith('.pdf')) return 'pdf'
  if (mimeType.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/.test(l)) return 'image'
  if (mimeType.startsWith('text/') || l.endsWith('.txt')) return 'text'
  return 'doc'
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function isThisWeek(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() < 7 * 24 * 60 * 60 * 1000
}
