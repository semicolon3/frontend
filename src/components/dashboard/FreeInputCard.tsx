import { useState } from 'react'
import { ArrowRightIcon, SparklesIcon } from '../icons'

const EXAMPLES = [
  '야근수당을 두 달째 못 받았어요',
  '중고거래 사기를 당했어요',
  '교통사고가 났는데 보험사가…',
  '계약서를 검토하고 싶어요',
]

export default function FreeInputCard() {
  const [query, setQuery] = useState('')

  return (
    <section className="bg-surface border border-line rounded-[20px] py-8 px-9 shadow-card-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-[10px] bg-primary-soft text-primary grid place-items-center shrink-0">
          <SparklesIcon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-ink m-0 tracking-[-0.02em]">어떤 분야인지 모르겠다면</h2>
      </div>
      <p className="text-sm text-ink-soft m-0 mb-5 ml-12">
        상황을 자유롭게 입력하면 AI가 분야를 판단해 진단을 시작해드려요.
      </p>

      <div className="bg-bg border-[1.5px] border-transparent rounded-2xl h-16 flex items-center pl-5 pr-2 transition-colors focus-within:bg-surface focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="겪고 계신 상황을 자유롭게 입력해주세요. 예: 집주인이 보증금을 안 돌려줘서요"
          className="flex-1 bg-transparent outline-none h-full text-[15px] text-ink placeholder:text-ink-mute tracking-[-0.01em]"
        />
        <button
          type="button"
          className="h-12 px-5 rounded-xl bg-primary text-white text-[14.5px] font-semibold inline-flex items-center gap-1.5 shrink-0 hover:bg-primary-hover transition-colors"
        >
          <span>보내기</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4.5 flex flex-wrap gap-2 items-center">
        <span className="text-[12.5px] text-ink-mute mr-1">예시</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setQuery(ex)}
            className="bg-surface border border-line rounded-full py-1.5 px-3 text-[13px] text-ink-soft font-medium hover:bg-primary-soft hover:border-[#c5deff] hover:text-primary transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>
    </section>
  )
}
