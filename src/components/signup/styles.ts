export type FieldStatus = 'idle' | 'success' | 'error'

export function inputClass(status: FieldStatus, extra = ''): string {
  const stateClass =
    status === 'success'
      ? 'border-success focus:border-success focus:ring-4 focus:ring-success/15'
      : status === 'error'
      ? 'border-danger focus:border-danger focus:ring-4 focus:ring-danger/15'
      : 'border-line hover:border-line-strong focus:border-primary focus:ring-4 focus:ring-primary/15'
  return `w-full h-13 bg-white border rounded-xl text-[15px] text-ink placeholder:text-ink-mute outline-none transition-colors ${stateClass} ${extra}`
}
