import type { ReactNode } from 'react'
import { ArrowRightIcon } from '../icons'
import SecHead from './SecHead'

export default function StepsSection() {
  return (
    <section id="how" className="py-16 md:py-24 lg:py-30 px-5 md:px-10 lg:px-20 bg-bg">
      <SecHead title="어떻게 사용하나요?" sub="3단계로 끝나는 가장 빠른 법률 진단" />
      <div className="flex flex-col items-center gap-8 md:grid md:grid-cols-[1fr_60px_1fr_60px_1fr] md:items-start max-w-275 mx-auto">
        <Step num={1} glyph="💬" title="질문하기" desc={<>분쟁 상황을 자유롭게<br />설명해 주세요</>} />
        <StepArrow />
        <Step num={2} glyph="🤖" title="AI 진단" desc={<>법령과 판례를 근거로<br />답변드려요</>} />
        <StepArrow />
        <Step num={3} glyph="✉️" title="액션" desc={<>내용증명까지<br />한 번에</>} />
      </div>
    </section>
  )
}

function Step({ num, glyph, title, desc }: { num: number; glyph: string; title: string; desc: ReactNode }) {
  return (
    <div className="text-center px-3">
      <div className="w-18 h-18 rounded-full bg-primary text-white grid place-items-center text-[28px] font-extrabold mx-auto mb-5.5 tabular-nums tracking-[-0.02em] shadow-[0_8px_24px_rgba(49,130,246,0.28)]">
        {num}
      </div>
      <div className="w-21 h-21 bg-surface border border-line rounded-3xl grid place-items-center text-[38px] mx-auto mb-5 shadow-card-sm">
        {glyph}
      </div>
      <h3 className="text-[22px] font-bold text-ink m-0 mb-2.5 tracking-[-0.02em]">{title}</h3>
      <p className="text-[15px] text-ink-soft m-0 leading-[1.55] tracking-[-0.01em]">{desc}</p>
    </div>
  )
}

function StepArrow() {
  return (
    <div className="hidden md:grid pt-6 place-items-center text-ink-quat" aria-hidden>
      <ArrowRightIcon className="w-10 h-5" />
    </div>
  )
}
