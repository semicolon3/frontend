import SecHead from './SecHead'

const DOMAINS = [
  { key: 'rent', emoji: '🏠', name: '임대차', items: ['보증금 미반환', '수리비 부담', '퇴거 통보'], iconBg: 'bg-primary-soft', iconText: 'text-primary' },
  { key: 'work', emoji: '💼', name: '근로', items: ['임금 체불', '부당 해고', '퇴직금 미지급'], iconBg: 'bg-[#efebff]', iconText: 'text-[#7b61ff]' },
  { key: 'consumer', emoji: '🛍️', name: '소비자', items: ['환불 거부', '온라인 사기', '불공정 약관'], iconBg: 'bg-[#e0f6ee]', iconText: 'text-[#00b27a]' },
  { key: 'traffic', emoji: '🚗', name: '교통', items: ['접촉 사고', '합의금 협상', '과실 비율 분석'], iconBg: 'bg-[#ffefe6]', iconText: 'text-[#ff7a45]' },
]

export default function DomainsSection() {
  return (
    <section id="features" className="py-16 md:py-24 lg:py-30 px-5 md:px-10 lg:px-20">
      <SecHead title="어떤 분쟁이든 도와드려요" sub="4대 핵심 분야에서 변호사 1차 상담 수준의 정보를 제공합니다" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {DOMAINS.map((d) => (
          <div
            key={d.key}
            className="bg-surface border border-line rounded-[20px] py-7 px-6 cursor-pointer transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:shadow-card-hover hover:border-transparent"
          >
            <div className={`w-14 h-14 rounded-2xl grid place-items-center text-[26px] mb-5 ${d.iconBg} ${d.iconText}`}>
              {d.emoji}
            </div>
            <h3 className="text-[19px] font-bold text-ink m-0 mb-3.5 tracking-[-0.02em]">{d.name}</h3>
            <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
              {d.items.map((it) => (
                <li
                  key={it}
                  className="text-sm text-ink-soft flex items-center gap-2 tracking-[-0.01em] before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-ink-quat before:shrink-0"
                >
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
