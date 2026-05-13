import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AlertTriangleIcon, ArrowRightIcon, CheckIcon, FileTextIcon } from '../icons'

export default function Hero() {
  return (
    <section className="min-h-120 lg:h-160 bg-bg px-5 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-[60%_40%] items-center relative overflow-hidden py-14 lg:py-0">
      <div
        aria-hidden
        className="absolute -top-30 -right-20 w-120 h-120 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(49,130,246,0.10) 0%, rgba(49,130,246,0) 70%)' }}
      />

      <div className="relative z-10 lg:pr-10">
        <span className="inline-flex items-center gap-1.5 bg-primary-soft text-primary text-[13px] font-semibold py-1.5 px-3 rounded-full mb-5 md:mb-6 tracking-[-0.01em]">
          🇰🇷 한국 법률 특화 AI
        </span>
        <h1 className="text-[36px] sm:text-[46px] lg:text-[56px] font-extrabold leading-[1.18] text-ink m-0 mb-4 md:mb-5 tracking-[-0.035em]">
          변호사를 부르기 전,
          <br />
          <span className="text-primary">먼저 물어보세요</span>
        </h1>
        <p className="text-base md:text-xl leading-normal text-ink-soft m-0 mb-7 md:mb-9 font-medium">
          AI가 한국 법령과 판례를 검색해
          <br />
          본인 상황에 맞는 답을 드립니다
        </p>
        <div className="flex flex-col gap-3 items-start">
          <Link
            to="/chat"
            className="h-12 md:h-14 px-6 md:px-7 rounded-[14px] bg-primary text-white text-sm md:text-base font-bold inline-flex items-center justify-center gap-1.5 transition-[background,box-shadow,transform] hover:bg-primary-hover hover:shadow-[0_6px_20px_rgba(49,130,246,0.34)] active:scale-[0.98] tracking-[-0.01em] shadow-[0_4px_14px_rgba(49,130,246,0.28)]"
          >
            무료로 진단 시작
            <ArrowRightIcon className="w-4.5 h-4.5" />
          </Link>
          <Caption>신용카드 불필요 · 5분이면 끝</Caption>
        </div>
      </div>

      <div className="hidden lg:block">
        <HeroMockup />
      </div>
    </section>
  )
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-mute pl-1">
      <span className="w-4 h-4 rounded-full bg-success text-white inline-grid place-items-center">
        <CheckIcon className="w-2.5 h-2.5" />
      </span>
      {children}
    </span>
  )
}

function HeroMockup() {
  return (
    <div className="relative h-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-3 w-115 bg-surface border border-line rounded-[20px] shadow-[0_12px_32px_rgba(20,30,50,0.10),0_32px_80px_rgba(20,30,50,0.12)] overflow-hidden">
        <div className="h-9.5 bg-bg border-b border-line flex items-center gap-1.5 px-3.5">
          <span className="w-2.25 h-2.25 rounded-full bg-[#ff6157]" />
          <span className="w-2.25 h-2.25 rounded-full bg-[#ffbe2f]" />
          <span className="w-2.25 h-2.25 rounded-full bg-[#28c940]" />
          <span className="ml-2.5 flex-1 text-[11px] text-ink-mute bg-surface border border-line rounded-md py-0.75 px-2.5 text-center">
            legal-ai.kr / 새 진단
          </span>
        </div>
        <div className="p-5.5 pt-5.5 flex flex-col gap-3">
          <Bubble role="user">계약 끝났는데 집주인이 보증금 5천만원을 안 돌려줘요. 두 달째예요.</Bubble>
          <Bubble role="ai">
            <strong className="text-primary font-bold">주택임대차보호법 제3조의2</strong>에 따라 임대인은 계약 종료 시 보증금을 즉시 반환할 의무가 있어요. 2개월 지연은 명백한 의무 위반이며, 다음 단계로 진행할 수 있어요.
            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-dashed border-line">
              <SrcPill type="law">주임법 §3-2</SrcPill>
              <SrcPill type="case">2019다252178</SrcPill>
            </div>
          </Bubble>
          <div className="self-start max-w-[80%] rounded-2xl rounded-bl-[4px] py-3 px-3.5 text-[13px] leading-[1.55] tracking-[-0.01em] bg-primary-soft border border-[#d7e8ff] text-[#1b3f7a]">
            📝 <strong className="font-bold">내용증명을 자동 작성</strong>해 드릴까요?
          </div>
        </div>
      </div>

      <FloatCard className="top-15 left-7 -rotate-6" iconBg="bg-primary-soft text-primary" icon={<FileTextIcon className="w-4.5 h-4.5" />} title="근거 자료" value="출처 2건 인용" />
      <FloatCard className="bottom-20 right-6 rotate-4" iconBg="bg-[#e0f6ee] text-[#00b27a]" icon={<CheckIcon className="w-4.5 h-4.5" />} title="분석 완료" value="위험 조항 2건" />
      <FloatCard className="bottom-7 left-15 -rotate-2" iconBg="bg-risk-high-bg text-danger" icon={<AlertTriangleIcon className="w-4.5 h-4.5" />} title="추천 액션" value="내용증명 작성" />
    </div>
  )
}

function Bubble({ role, children }: { role: 'user' | 'ai'; children: ReactNode }) {
  if (role === 'user') {
    return (
      <div className="self-end max-w-[80%] rounded-2xl rounded-br-[4px] py-3 px-3.5 text-[13px] leading-[1.55] tracking-[-0.01em] bg-primary text-white">
        {children}
      </div>
    )
  }
  return (
    <div className="self-start max-w-[80%] rounded-2xl rounded-bl-[4px] py-3 px-3.5 text-[13px] leading-[1.55] tracking-[-0.01em] bg-bg text-ink border border-line">
      {children}
    </div>
  )
}

function SrcPill({ type, children }: { type: 'law' | 'case'; children: ReactNode }) {
  return (
    <span className="text-[10.5px] font-semibold bg-surface border border-line text-ink-soft py-0.5 px-1.75 rounded-full">
      <span className="text-primary">{type === 'law' ? '법령' : '판례'}</span> {children}
    </span>
  )
}

function FloatCard({
  className, iconBg, icon, title, value,
}: { className: string; iconBg: string; icon: ReactNode; title: string; value: string }) {
  return (
    <div className={`absolute bg-surface border border-line rounded-[14px] py-3 px-3.5 shadow-card-md flex items-center gap-2.5 ${className}`}>
      <span className={`w-9 h-9 rounded-[10px] grid place-items-center shrink-0 ${iconBg}`}>
        {icon}
      </span>
      <div>
        <div className="text-[11px] text-ink-mute font-medium">{title}</div>
        <div className="text-[13px] text-ink font-bold tracking-[-0.01em]">{value}</div>
      </div>
    </div>
  )
}
