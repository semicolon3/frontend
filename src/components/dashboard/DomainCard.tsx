import { ArrowRightIcon } from '../icons'

export type Domain = {
  key: 'rent' | 'work' | 'consumer' | 'traffic'
  name: string
  emoji: string
  items: string[]
  dotClass: string
  iconBgClass: string
  hoverTextClass: string
}

export const DOMAINS: Domain[] = [
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

export const DOMAIN_MAP: Record<string, string> = {
  rent: 'LEASE',
  work: 'WORK',
  consumer: 'CONSUMER',
  traffic: 'TRAFFIC',
}

export default function DomainCard({ domain, onStart }: { domain: Domain; onStart: () => void }) {
  return (
    <button
      type="button"
      onClick={onStart}
      className="group bg-surface border border-line rounded-2xl p-6 cursor-pointer text-left w-full flex flex-col gap-4 relative transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 hover:shadow-card-hover hover:border-transparent"
    >
      <div
        className={`w-16 h-16 rounded-2xl grid place-items-center text-[30px] shrink-0 ${domain.iconBgClass}`}
        aria-hidden
      >
        {domain.emoji}
      </div>

      <h3 className="text-lg font-bold text-ink m-0 tracking-[-0.015em]">
        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle -translate-y-px ${domain.dotClass}`} />
        {domain.name}
      </h3>

      <ul className="list-none m-0 p-0 flex flex-col gap-1.75">
        {domain.items.map((it) => (
          <li
            key={it}
            className="text-[13.5px] text-ink-soft flex items-center gap-2 leading-normal before:content-[''] before:w-0.75 before:h-0.75 before:rounded-full before:bg-ink-quat before:shrink-0"
          >
            {it}
          </li>
        ))}
      </ul>

      <div className={`mt-auto pt-3.5 border-t border-line flex items-center justify-between text-[13px] font-semibold text-ink-mute transition-colors ${domain.hoverTextClass}`}>
        <span>진단 시작</span>
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  )
}
