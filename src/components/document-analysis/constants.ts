export const STATUS_LABEL: Record<string, string> = {
  PENDING: '대기',
  PROCESSING: '처리 중',
  COMPLETED: '완료',
  FAILED: '실패',
}

export const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-bg text-ink-mute',
  PROCESSING: 'bg-warn-soft text-warn',
  COMPLETED: 'bg-success-soft text-success',
  FAILED: 'bg-risk-high-bg text-danger',
}

export type ClauseTone = 'high' | 'mid' | 'low'

export function severityToTone(s: string): ClauseTone {
  const u = s.toUpperCase()
  if (u.includes('HIGH') || u === 'DANGER' || u === 'CRITICAL') return 'high'
  if (u.includes('MED') || u.includes('MID') || u === 'WARN' || u === 'WARNING') return 'mid'
  return 'low'
}
