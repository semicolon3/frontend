import type { DocumentAnalysis } from '../../api/documents'
import { SparklesIcon } from '../icons'
import { STATUS_LABEL } from './constants'

export default function SummaryCard({ analysis }: { analysis: DocumentAnalysis | null }) {
  const isPending = !analysis || analysis.analysisStatus === 'PENDING' || analysis.analysisStatus === 'PROCESSING'
  const entities = analysis?.entities ? Object.entries(analysis.entities).slice(0, 3) : null

  return (
    <div className="bg-linear-to-br from-primary-lighter to-primary-soft border border-[#d7e8ff] rounded-2xl p-5 mb-4">
      <div className="flex items-center gap-2 mb-2.5">
        <h3 className="text-base font-bold text-ink m-0 tracking-[-0.015em]">분석 요약</h3>
        {analysis && analysis.analysisStatus !== 'COMPLETED' && (
          <span className="text-[11px] font-semibold text-warn bg-warn-soft py-0.5 px-2 rounded-full">
            {STATUS_LABEL[analysis.analysisStatus] ?? analysis.analysisStatus}
          </span>
        )}
        <span className="ml-auto inline-flex items-center gap-1 bg-primary/10 text-primary text-[11px] font-semibold py-0.5 px-2 rounded-full">
          <SparklesIcon className="w-2.5 h-2.5" />
          AI
        </span>
      </div>
      <p className="m-0 mb-3.5 text-sm leading-[1.6] text-ink-soft">
        {isPending
          ? <span className="text-ink-mute">분석 결과를 불러오는 중…</span>
          : analysis?.summary ?? '요약 정보가 없습니다.'}
      </p>
      {entities && entities.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {entities.map(([k, v]) => (
            <KeyTag key={k} k={k} v={v[0] ?? '-'} />
          ))}
        </div>
      )}
    </div>
  )
}

function KeyTag({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-white/70 border border-primary/12 rounded-[10px] py-2 px-2.5">
      <div className="text-[11px] text-ink-mute mb-0.5">{k}</div>
      <div className="text-[13.5px] font-bold text-ink tabular-nums">{v}</div>
    </div>
  )
}
