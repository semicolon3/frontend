import type { ReactNode } from 'react'
import SecHead from './SecHead'

export default function DiffSection() {
  return (
    <section className="py-16 md:py-24 lg:py-30 px-5 md:px-10 lg:px-20">
      <SecHead title="ChatGPT와는 다릅니다" sub="범용 AI로는 불가능한, 한국 법률에 진짜 특화된 답변" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <DiffCard
          highlight
          glyph="📎"
          title="출처 강제 인용"
          desc="모든 답변에 법령 조항과 판례 번호가 표시됩니다. 출처 없는 답변은 자동 차단됩니다."
        >
          "임차인은 즉시 반환 청구 가능합니다."
          <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-primary bg-primary-soft py-0.5 px-1.75 rounded-full">
            📎 주임법 §3-2 · 2019다252178
          </span>
        </DiffCard>

        <DiffCard glyph="🇰🇷" title="한국 법령 특화" desc="국가법령정보센터와 실시간 동기화. 폐지·개정 조항을 자동 추적합니다.">
          <div className="flex justify-between items-center">
            <span>주택임대차보호법</span>
            <span className="text-success font-bold">최신</span>
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-ink-mute">동기화: 2026.02.28</span>
            <span>v2.4</span>
          </div>
        </DiffCard>

        <DiffCard glyph="📁" title="문서 멀티모달" desc="계약서, 카톡 캡처, 영수증을 함께 읽고 사건 맥락에 맞춰 답합니다.">
          한 번에 처리 가능한 자료:
          <div className="flex gap-1.5 mt-1">
            <DocThumb>📄 PDF</DocThumb>
            <DocThumb>💬 카톡</DocThumb>
            <DocThumb>🧾 영수증</DocThumb>
          </div>
        </DiffCard>
      </div>
    </section>
  )
}

function DiffCard({
  highlight, glyph, title, desc, children,
}: { highlight?: boolean; glyph: string; title: string; desc: string; children: ReactNode }) {
  return (
    <div
      className={`relative border rounded-[20px] py-8 px-7 transition-[box-shadow,transform] duration-200 hover:shadow-card-md hover:-translate-y-0.5 ${
        highlight
          ? 'border-[#d7e8ff] bg-[linear-gradient(180deg,#f3f8ff_0%,#ffffff_60%)]'
          : 'bg-surface border-line'
      }`}
    >
      {highlight && (
        <span className="absolute top-6 right-6 bg-primary text-white text-[11px] font-bold py-1 px-2.5 rounded-full tracking-[0.02em]">
          핵심 차별점
        </span>
      )}
      <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary grid place-items-center text-[26px] mb-5.5">{glyph}</div>
      <h3 className="text-[22px] font-bold text-ink m-0 mb-3 tracking-[-0.02em]">{title}</h3>
      <p className="text-[15px] text-ink-soft leading-[1.6] m-0 mb-5 tracking-[-0.005em]">{desc}</p>
      <div className="bg-bg border border-line rounded-xl py-3 px-3.5 text-[12.5px] text-ink-soft leading-[1.55]">{children}</div>
    </div>
  )
}

function DocThumb({ children }: { children: ReactNode }) {
  return (
    <span className="flex-1 h-8 rounded-md bg-surface border border-line grid place-items-center text-ink-mute text-[10.5px] font-semibold">
      {children}
    </span>
  )
}
