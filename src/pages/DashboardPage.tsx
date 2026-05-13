import { useState, type ReactNode } from 'react'
import Sidebar from '../components/Sidebar'
import {
  ArrowRightIcon,
  BellIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
} from '../components/icons'

type Domain = {
  key: 'rent' | 'work' | 'consumer' | 'traffic'
  name: string
  emoji: string
  items: string[]
  dotClass: string
  iconBgClass: string
  hoverTextClass: string
}

const DOMAINS: Domain[] = [
  {
    key: 'rent',
    name: '임대차',
    emoji: '🏠',
    items: ['보증금 미반환', '수리비 부담', '묵시적 갱신'],
    dotClass: 'bg-primary',
    iconBgClass: 'bg-primary-soft',
    hoverTextClass: 'group-hover:text-primary',
  },
  {
    key: 'work',
    name: '근로',
    emoji: '💼',
    items: ['임금체불', '부당해고', '4대보험'],
    dotClass: 'bg-violet',
    iconBgClass: 'bg-violet-soft',
    hoverTextClass: 'group-hover:text-violet',
  },
  {
    key: 'consumer',
    name: '소비자',
    emoji: '🛍️',
    items: ['환불 거부', '온라인 사기', '약관 분쟁'],
    dotClass: 'bg-warn',
    iconBgClass: 'bg-warn-soft',
    hoverTextClass: 'group-hover:text-warn',
  },
  {
    key: 'traffic',
    name: '교통',
    emoji: '🚗',
    items: ['접촉사고', '과실비율', '합의금'],
    dotClass: 'bg-success',
    iconBgClass: 'bg-success-soft',
    hoverTextClass: 'group-hover:text-success',
  },
]

const EXAMPLES = [
  '야근수당을 두 달째 못 받았어요',
  '중고거래 사기를 당했어요',
  '교통사고가 났는데 보험사가…',
  '계약서를 검토하고 싶어요',
]

export default function DashboardPage() {
  const [query, setQuery] = useState('')

  return (
    <div className="grid grid-cols-[260px_1fr] min-h-screen w-360 mx-auto">
      <Sidebar active="home" />

      <section className="flex flex-col min-w-0 min-h-screen">
        <header className="h-16 bg-surface border-b border-line flex items-center justify-between px-10 shrink-0">
          <h1 className="text-base font-semibold text-ink m-0">홈</h1>
          <div className="flex items-center gap-2">
            <div
              role="button"
              className="w-80 h-10 bg-bg border border-transparent rounded-xl flex items-center gap-2 px-3.5 text-ink-mute text-[13.5px] cursor-text transition-colors hover:bg-bg-soft-2"
            >
              <SearchIcon className="w-4 h-4" />
              <span>법령·판례 검색</span>
            </div>
            <IconBtn label="알림">
              <BellIcon className="w-4.5 h-4.5" />
            </IconBtn>
            <IconBtn label="설정">
              <SettingsIcon className="w-4.5 h-4.5" />
            </IconBtn>
          </div>
        </header>

        <div className="flex-1 px-10 pt-10 pb-14 max-w-[1180px] w-full mx-auto">
          <div className="mb-9">
            <h1 className="text-[32px] font-bold text-ink m-0 mb-2 tracking-[-0.025em] leading-[1.25]">
              안녕하세요, 홍길동님 <span aria-hidden>👋</span>
            </h1>
            <p className="text-base text-ink-soft m-0 leading-normal">
              오늘은 어떤 도움이 필요하세요?
            </p>
          </div>

          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-bold text-ink m-0 tracking-[-0.015em]">
              어떤 분야의 도움이 필요하세요?
            </h2>
            <span className="text-[13.5px] text-ink-mute">
              분야를 선택하면 맞춤 진단을 시작합니다
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-11">
            {DOMAINS.map((d) => (
              <DomainCard key={d.key} domain={d} />
            ))}
          </div>

          <section className="bg-surface border border-line rounded-[20px] py-8 px-9 shadow-card-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-[10px] bg-primary-soft text-primary grid place-items-center shrink-0">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-ink m-0 tracking-[-0.02em]">
                어떤 분야인지 모르겠다면
              </h2>
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
        </div>
      </section>
    </div>
  )
}

function IconBtn({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="w-9 h-9 rounded-[10px] grid place-items-center text-ink-soft hover:bg-bg transition-colors"
    >
      {children}
    </button>
  )
}

function DomainCard({ domain }: { domain: Domain }) {
  return (
    <button
      type="button"
      className="group bg-surface border border-line rounded-2xl p-6 cursor-pointer text-left w-full flex flex-col gap-4 relative transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 hover:shadow-card-hover hover:border-transparent"
    >
      <div
        className={`w-16 h-16 rounded-2xl grid place-items-center text-[30px] shrink-0 ${domain.iconBgClass}`}
        aria-hidden
      >
        {domain.emoji}
      </div>

      <h3 className="text-lg font-bold text-ink m-0 tracking-[-0.015em]">
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle -translate-y-px ${domain.dotClass}`}
        />
        {domain.name}
      </h3>

      <ul className="list-none m-0 p-0 flex flex-col gap-1.75">
        {domain.items.map((it) => (
          <li
            key={it}
            className="text-[13.5px] text-ink-soft flex items-center gap-2 leading-normal before:content-[''] before:w-[3px] before:h-[3px] before:rounded-full before:bg-ink-quat before:shrink-0"
          >
            {it}
          </li>
        ))}
      </ul>

      <div
        className={`mt-auto pt-3.5 border-t border-line flex items-center justify-between text-[13px] font-semibold text-ink-mute transition-colors ${domain.hoverTextClass}`}
      >
        <span>진단 시작</span>
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  )
}
