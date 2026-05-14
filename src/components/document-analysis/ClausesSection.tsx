import { useEffect, useState, type ReactNode } from 'react'
import type { RiskClause } from '../../api/documents'
import { AlertIcon, BookIcon, CheckIcon, ChevronDownIcon, SearchIcon, SparklesIcon } from '../icons'
import { severityToTone, type ClauseTone } from './constants'

export default function ClausesSection({ riskClauses }: { riskClauses: RiskClause[] | null }) {
  const [dynamicOpen, setDynamicOpen] = useState<boolean[]>([])

  useEffect(() => {
    if (riskClauses) setDynamicOpen(riskClauses.map((_, i) => i === 0))
  }, [riskClauses])

  const header = (
    <div className="flex items-baseline justify-between mt-1 mb-2.5">
      <h3 className="text-base font-bold text-ink m-0 tracking-[-0.015em]">조항별 분석</h3>
      <button type="button" className="text-[12.5px] text-ink-mute inline-flex items-center gap-1 hover:text-ink-soft">
        위험도 순<ChevronDownIcon className="w-3 h-3" />
      </button>
    </div>
  )

  if (riskClauses) {
    return (
      <>
        {header}
        {riskClauses.length === 0 && (
          <p className="text-sm text-ink-mute text-center py-6">위험 조항이 발견되지 않았습니다.</p>
        )}
        {riskClauses.map((c, i) => (
          <ClauseCard
            key={i}
            tone={severityToTone(c.severity)}
            title={c.clauseTitle}
            open={dynamicOpen[i] ?? false}
            onToggle={() => setDynamicOpen((a) => a.map((v, idx) => idx === i ? !v : v))}
            quote={`"${c.description}"`}
            reason={<>{c.description}</>}
          />
        ))}
      </>
    )
  }

  return (
    <>
      {header}
      <p className="text-sm text-ink-mute text-center py-8">문서를 업로드하면 조항별 분석 결과가 표시됩니다.</p>
    </>
  )
}

type ClauseCardProps = {
  tone: ClauseTone
  title: string
  open: boolean
  onToggle: () => void
  quote: string
  reason: ReactNode
  laws?: string[]
  suggestion?: string
}

function ClauseCard({ tone, title, open, onToggle, quote, reason, laws, suggestion }: ClauseCardProps) {
  const badge =
    tone === 'high' ? 'bg-risk-high-bg text-danger'
    : tone === 'mid' ? 'bg-risk-mid-bg text-[#b45309]'
    : 'bg-success-soft text-[#15803d]'
  const badgeLabel = tone === 'high' ? '위험' : tone === 'mid' ? '주의' : '일반'
  const cardBorder =
    open && tone === 'high' ? 'border-[#fca5a5] shadow-card-md'
    : open ? 'border-line shadow-card-md'
    : 'border-line'
  const reasonIco =
    tone === 'high' ? 'bg-risk-high-bg text-danger'
    : tone === 'mid' ? 'bg-risk-mid-bg text-risk-mid'
    : 'bg-success-soft text-success'

  return (
    <div className={`bg-surface border rounded-[14px] mb-2.5 transition-[box-shadow,border-color] hover:shadow-card-md ${cardBorder}`}>
      <button type="button" onClick={onToggle} className="w-full py-3.5 px-4 flex items-center gap-2.5 select-none text-left">
        <span className={`inline-flex items-center gap-1 text-[11.5px] font-bold py-1 px-2 rounded-full shrink-0 ${badge}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {badgeLabel}
        </span>
        <span className="flex-1 text-[14.5px] font-semibold text-ink tracking-[-0.01em]">{title}</span>
        <span className={`text-ink-mute transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <div className="bg-bg border-l-[3px] border-line-strong rounded-lg py-3 px-3.5 text-[13px] text-ink-soft leading-[1.6] mb-3">
            <div className="text-[11px] font-semibold text-ink-mute mb-1 tracking-[0.02em]">원문</div>
            {quote}
          </div>

          <div className="flex gap-2 mb-3">
            <span className={`w-4.5 h-4.5 rounded-full grid place-items-center shrink-0 mt-px ${reasonIco}`}>
              {tone === 'low' ? <CheckIcon className="w-2.5 h-2.5" /> : <AlertIcon className="w-2.5 h-2.5" />}
            </span>
            <div className="text-[13px] text-ink-soft leading-[1.55] [&_strong]:text-ink [&_strong]:font-bold">{reason}</div>
          </div>

          {laws && laws.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {laws.map((law) => <LawTag key={law}>{law}</LawTag>)}
            </div>
          )}

          {suggestion && (
            <div className="bg-primary-soft rounded-xl py-3 px-3.5">
              <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-primary mb-1.5 tracking-[0.01em]">
                <SparklesIcon className="w-3 h-3" />
                AI 수정 제안
              </div>
              <div className="text-[13px] text-[#1b3f7a] leading-[1.55] font-medium">{suggestion}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LawTag({ children }: { children: ReactNode }) {
  const text = String(children)
  const isCase = text.includes('대법원') || text.includes('판결')
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 bg-surface border border-line rounded-full py-1 px-2.5 text-[11.5px] font-medium text-ink-soft cursor-pointer transition-colors hover:border-primary hover:text-primary [&_.ico]:text-ink-mute [&:hover_.ico]:text-primary"
    >
      <span className="ico inline-flex transition-colors">
        {isCase ? <SearchIcon className="w-2.75 h-2.75" /> : <BookIcon className="w-2.75 h-2.75" />}
      </span>
      {children}
    </button>
  )
}
