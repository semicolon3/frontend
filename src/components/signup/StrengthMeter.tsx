const STRENGTH_LABELS = ['', '약함', '보통', '강함', '매우 강함'] as const

function scorePassword(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Za-z]/.test(pw) && /\d/.test(pw)) s++
  if (pw.length >= 12) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return Math.min(s, 4) as 0 | 1 | 2 | 3 | 4
}

export default function StrengthMeter({ password }: { password: string }) {
  const level = scorePassword(password)
  const labelColor =
    level === 1 ? 'text-danger'
    : level === 2 ? 'text-warn'
    : level >= 3 ? 'text-success'
    : 'text-ink-mute'
  const barColor = (i: number) => {
    if (i >= level) return 'bg-bg-soft-2'
    if (level === 1) return 'bg-danger'
    if (level === 2) return 'bg-warn'
    return 'bg-success'
  }
  return (
    <div className="flex items-center gap-2.5 mt-2.5">
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`flex-1 h-1 rounded transition-colors ${barColor(i)}`} />
        ))}
      </div>
      <span className={`text-xs font-semibold min-w-9 text-right tracking-[-0.01em] ${labelColor}`}>
        {STRENGTH_LABELS[level]}
      </span>
    </div>
  )
}
