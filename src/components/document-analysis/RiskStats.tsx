import type { RiskClause } from '../../api/documents'
import { AlertIcon, AlertTriangleIcon, CheckIcon } from '../icons'
import { severityToTone, type ClauseTone } from './constants'

export default function RiskStats({ riskClauses }: { riskClauses: RiskClause[] | null }) {
  const high = riskClauses?.filter((c) => severityToTone(c.severity) === 'high').length ?? 0
  const mid  = riskClauses?.filter((c) => severityToTone(c.severity) === 'mid').length  ?? 0
  const low  = riskClauses?.filter((c) => severityToTone(c.severity) === 'low').length  ?? 0
  return (
    <div className="grid grid-cols-3 gap-2.5 mb-4">
      <StatCard tone="high" num={high} label="위험" />
      <StatCard tone="mid"  num={mid}  label="주의" />
      <StatCard tone="low"  num={low}  label="일반" />
    </div>
  )
}

function StatCard({ tone, num, label }: { tone: ClauseTone; num: number; label: string }) {
  const iconWrap =
    tone === 'high' ? 'bg-risk-high-bg text-danger'
    : tone === 'mid' ? 'bg-risk-mid-bg text-risk-mid'
    : 'bg-success-soft text-success'
  return (
    <div className="bg-surface border border-line rounded-[14px] py-3.5 px-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-[10px] grid place-items-center shrink-0 ${iconWrap}`}>
        {tone === 'high' ? <AlertTriangleIcon className="w-4 h-4" />
          : tone === 'mid' ? <AlertIcon className="w-4 h-4" />
          : <CheckIcon className="w-4 h-4" />}
      </div>
      <div>
        <div className="text-[22px] font-extrabold text-ink tracking-[-0.02em] tabular-nums leading-none">{num}</div>
        <div className="text-xs text-ink-mute mt-0.5 font-medium">{label}</div>
      </div>
    </div>
  )
}
