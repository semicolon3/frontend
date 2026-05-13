import { useEffect, useState, type ReactNode } from 'react'
import type { RiskClause } from '../../api/documents'
import { AlertIcon, BookIcon, CheckIcon, ChevronDownIcon, SearchIcon, SparklesIcon } from '../icons'
import { severityToTone, type ClauseTone } from './constants'

type Props = {
  openClauses: boolean[]
  toggleClause: (i: number) => void
  riskClauses: RiskClause[] | null
}

export default function ClausesSection({ openClauses, toggleClause, riskClauses }: Props) {
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
      <ClauseCard
        tone="high" title="제5조 · 보증금 반환 시기"
        open={openClauses[0]} onToggle={() => toggleClause(0)}
        quote='"보증금 반환 시기는 임대인이 임의로 결정한다. 임차인은 이에 이의를 제기할 수 없다."'
        reason={<><strong>주택임대차보호법 위반 소지가 있어요.</strong> 반환 시기를 일방적으로 정할 수 없습니다.</>}
        laws={['주택임대차보호법 제3조의2', '대법원 2019다252178']}
        suggestion='"임대인은 계약 종료일로부터 7일 이내에 보증금을 반환한다."'
      />
      <ClauseCard
        tone="mid" title="제8조 · 원상복구 비용 범위"
        open={openClauses[1]} onToggle={() => toggleClause(1)}
        quote='"계약 종료 시 임차인은 일체의 원상복구 비용을 부담하며, 그 범위는 임대인이 정한다."'
        reason={<><strong>통상적 사용으로 인한 마모는 임차인 부담이 아닙니다.</strong></>}
      />
      <ClauseCard
        tone="low" title="제2조 · 임대료 지급"
        open={openClauses[2]} onToggle={() => toggleClause(2)}
        quote='"보증금 일금 오천만원정(₩50,000,000)은 계약일에 지불한다."'
        reason={<>표준 임대차계약서 양식에 부합합니다.</>}
      />
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
