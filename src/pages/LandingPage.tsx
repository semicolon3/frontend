import { Link } from 'react-router-dom'
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BrandMark,
  CheckIcon,
  FileTextIcon,
} from '../components/icons'
import type { ReactNode } from 'react'

const DOMAINS = [
  {
    key: 'rent',
    emoji: '🏠',
    name: '임대차',
    items: ['보증금 미반환', '수리비 부담', '퇴거 통보'],
    iconBg: 'bg-primary-soft',
    iconText: 'text-primary',
  },
  {
    key: 'work',
    emoji: '💼',
    name: '근로',
    items: ['임금 체불', '부당 해고', '퇴직금 미지급'],
    iconBg: 'bg-[#efebff]',
    iconText: 'text-[#7b61ff]',
  },
  {
    key: 'consumer',
    emoji: '🛍️',
    name: '소비자',
    items: ['환불 거부', '온라인 사기', '불공정 약관'],
    iconBg: 'bg-[#e0f6ee]',
    iconText: 'text-[#00b27a]',
  },
  {
    key: 'traffic',
    emoji: '🚗',
    name: '교통',
    items: ['접촉 사고', '합의금 협상', '과실 비율 분석'],
    iconBg: 'bg-[#ffefe6]',
    iconText: 'text-[#ff7a45]',
  },
]

export default function LandingPage() {
  return (
    <div className="bg-surface text-ink w-360 mx-auto">
      <Header />
      <Hero />
      <DomainsSection />
      <StepsSection />
      <DiffSection />
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-30 h-18 bg-surface border-b border-line flex items-center justify-between px-20">
      <Link to="/" className="flex items-center gap-2.25">
        <span className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-primary to-primary-hover grid place-items-center text-white">
          <BrandMark className="w-4.5 h-4.5" />
        </span>
        <span className="text-[17px] font-bold text-ink tracking-[-0.025em]">Legal AI</span>
      </Link>

      <nav className="flex items-center gap-1">
        <HeaderLink href="#features">서비스 소개</HeaderLink>
        <HeaderLink href="#how">이용 방법</HeaderLink>
      </nav>

      <div className="flex items-center gap-1.5">
        <Link
          to="/login"
          className="h-10 px-3.5 rounded-[10px] text-[14.5px] font-semibold text-ink-soft inline-flex items-center transition-colors hover:bg-bg hover:text-ink"
        >
          로그인
        </Link>
        <Link
          to="/dashboard"
          className="h-10 px-4.5 rounded-[10px] bg-primary text-white text-[14.5px] font-bold inline-flex items-center justify-center gap-1.5 transition-colors hover:bg-primary-hover active:scale-[0.98] tracking-[-0.01em]"
        >
          시작하기
        </Link>
      </div>
    </header>
  )
}

function HeaderLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="py-2 px-4 rounded-lg text-[14.5px] font-medium text-ink-soft transition-colors hover:bg-bg hover:text-ink"
    >
      {children}
    </a>
  )
}

function Hero() {
  return (
    <section className="h-160 bg-bg px-20 grid grid-cols-[60%_40%] items-center relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-30 -right-20 w-120 h-120 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(49,130,246,0.10) 0%, rgba(49,130,246,0) 70%)',
        }}
      />

      <div className="relative z-10 pr-10">
        <span className="inline-flex items-center gap-1.5 bg-primary-soft text-primary text-[13px] font-semibold py-1.5 px-3 rounded-full mb-6 tracking-[-0.01em]">
          🇰🇷 한국 법률 특화 AI
        </span>
        <h1 className="text-[56px] font-extrabold leading-[1.18] text-ink m-0 mb-5 tracking-[-0.035em]">
          변호사를 부르기 전,
          <br />
          <span className="text-primary">먼저 물어보세요</span>
        </h1>
        <p className="text-xl leading-normal text-ink-soft m-0 mb-9 font-medium">
          AI가 한국 법령과 판례를 검색해
          <br />
          본인 상황에 맞는 답을 드립니다
        </p>
        <div className="flex flex-col gap-3 items-start">
          <Link
            to="/chat"
            className="h-14 px-7 rounded-[14px] bg-primary text-white text-base font-bold inline-flex items-center justify-center gap-1.5 transition-[background,box-shadow,transform] hover:bg-primary-hover hover:shadow-[0_6px_20px_rgba(49,130,246,0.34)] active:scale-[0.98] tracking-[-0.01em] shadow-[0_4px_14px_rgba(49,130,246,0.28)]"
          >
            무료로 진단 시작
            <ArrowRightIcon className="w-4.5 h-4.5" />
          </Link>
          <Caption>신용카드 불필요 · 5분이면 끝</Caption>
        </div>
      </div>

      <HeroMockup />
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
          <Bubble role="user">
            계약 끝났는데 집주인이 보증금 5천만원을 안 돌려줘요. 두 달째예요.
          </Bubble>
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

      <FloatCard
        className="top-15 left-7 -rotate-6"
        iconBg="bg-primary-soft text-primary"
        icon={<FileTextIcon className="w-4.5 h-4.5" />}
        title="근거 자료"
        value="출처 2건 인용"
      />
      <FloatCard
        className="bottom-20 right-6 rotate-4"
        iconBg="bg-[#e0f6ee] text-[#00b27a]"
        icon={<CheckIcon className="w-4.5 h-4.5" />}
        title="분석 완료"
        value="위험 조항 2건"
      />
      <FloatCard
        className="bottom-7 left-15 -rotate-2"
        iconBg="bg-risk-high-bg text-danger"
        icon={<AlertTriangleIcon className="w-4.5 h-4.5" />}
        title="추천 액션"
        value="내용증명 작성"
      />
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
  className,
  iconBg,
  icon,
  title,
  value,
}: {
  className: string
  iconBg: string
  icon: ReactNode
  title: string
  value: string
}) {
  return (
    <div
      className={`absolute bg-surface border border-line rounded-[14px] py-3 px-3.5 shadow-card-md flex items-center gap-2.5 ${className}`}
    >
      <span
        className={`w-9 h-9 rounded-[10px] grid place-items-center shrink-0 ${iconBg}`}
      >
        {icon}
      </span>
      <div>
        <div className="text-[11px] text-ink-mute font-medium">{title}</div>
        <div className="text-[13px] text-ink font-bold tracking-[-0.01em]">{value}</div>
      </div>
    </div>
  )
}

function SecHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="text-center mb-14">
      <h2 className="text-[40px] font-extrabold text-ink tracking-[-0.03em] m-0 mb-3.5 leading-[1.25]">
        {title}
      </h2>
      <p className="text-lg text-ink-soft m-0 leading-normal font-medium">{sub}</p>
    </div>
  )
}

function DomainsSection() {
  return (
    <section id="features" className="py-30 px-20">
      <SecHead
        title="어떤 분쟁이든 도와드려요"
        sub="4대 핵심 분야에서 변호사 1차 상담 수준의 정보를 제공합니다"
      />
      <div className="grid grid-cols-4 gap-5">
        {DOMAINS.map((d) => (
          <div
            key={d.key}
            className="bg-surface border border-line rounded-[20px] py-7 px-6 cursor-pointer transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:shadow-card-hover hover:border-transparent"
          >
            <div
              className={`w-14 h-14 rounded-2xl grid place-items-center text-[26px] mb-5 ${d.iconBg} ${d.iconText}`}
            >
              {d.emoji}
            </div>
            <h3 className="text-[19px] font-bold text-ink m-0 mb-3.5 tracking-[-0.02em]">
              {d.name}
            </h3>
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

function StepsSection() {
  return (
    <section id="how" className="py-30 px-20 bg-bg">
      <SecHead title="어떻게 사용하나요?" sub="3단계로 끝나는 가장 빠른 법률 진단" />
      <div className="grid grid-cols-[1fr_60px_1fr_60px_1fr] items-start max-w-[1100px] mx-auto">
        <Step num={1} glyph="💬" title="질문하기" desc={<>분쟁 상황을 자유롭게<br />설명해 주세요</>} />
        <StepArrow />
        <Step num={2} glyph="🤖" title="AI 진단" desc={<>법령과 판례를 근거로<br />답변드려요</>} />
        <StepArrow />
        <Step num={3} glyph="✉️" title="액션" desc={<>내용증명까지<br />한 번에</>} />
      </div>
    </section>
  )
}

function Step({
  num,
  glyph,
  title,
  desc,
}: {
  num: number
  glyph: string
  title: string
  desc: ReactNode
}) {
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
    <div className="pt-6 grid place-items-center text-ink-quat" aria-hidden>
      <ArrowRightIcon className="w-10 h-5" />
    </div>
  )
}

function DiffSection() {
  return (
    <section className="py-30 px-20">
      <SecHead
        title="ChatGPT와는 다릅니다"
        sub="범용 AI로는 불가능한, 한국 법률에 진짜 특화된 답변"
      />
      <div className="grid grid-cols-3 gap-5">
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

        <DiffCard
          glyph="🇰🇷"
          title="한국 법령 특화"
          desc="국가법령정보센터와 실시간 동기화. 폐지·개정 조항을 자동 추적합니다."
        >
          <div className="flex justify-between items-center">
            <span>주택임대차보호법</span>
            <span className="text-success font-bold">최신</span>
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-ink-mute">동기화: 2026.02.28</span>
            <span>v2.4</span>
          </div>
        </DiffCard>

        <DiffCard
          glyph="📁"
          title="문서 멀티모달"
          desc="계약서, 카톡 캡처, 영수증을 함께 읽고 사건 맥락에 맞춰 답합니다."
        >
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
  highlight,
  glyph,
  title,
  desc,
  children,
}: {
  highlight?: boolean
  glyph: string
  title: string
  desc: string
  children: ReactNode
}) {
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
      <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary grid place-items-center text-[26px] mb-5.5">
        {glyph}
      </div>
      <h3 className="text-[22px] font-bold text-ink m-0 mb-3 tracking-[-0.02em]">{title}</h3>
      <p className="text-[15px] text-ink-soft leading-[1.6] m-0 mb-5 tracking-[-0.005em]">{desc}</p>
      <div className="bg-bg border border-line rounded-xl py-3 px-3.5 text-[12.5px] text-ink-soft leading-[1.55]">
        {children}
      </div>
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

function Footer() {
  return (
    <footer className="border-t border-line py-8 px-20 bg-surface grid grid-cols-3 items-center gap-6">
      <div className="flex items-center gap-2.5 text-[13px] text-ink-mute">
        <span className="w-6 h-6 rounded-[7px] bg-gradient-to-br from-primary to-primary-hover grid place-items-center text-white">
          <BrandMark className="w-3.5 h-3.5" />
        </span>
        © 2026 Legal AI
      </div>
      <div className="text-center text-[12.5px] text-ink-mute leading-normal">
        본 서비스는 법률 정보 제공이며 법률 자문이 아닙니다
      </div>
      <div className="flex items-center justify-end gap-1.5 text-[13px] text-ink-soft">
        <FooterLink>이용약관</FooterLink>
        <span className="text-ink-quat select-none">·</span>
        <FooterLink>개인정보 처리방침</FooterLink>
        <span className="text-ink-quat select-none">·</span>
        <FooterLink>회사소개</FooterLink>
      </div>
    </footer>
  )
}

function FooterLink({ children }: { children: ReactNode }) {
  return (
    <a
      href="#"
      className="py-1 px-2 rounded-md transition-colors hover:text-primary hover:bg-bg"
    >
      {children}
    </a>
  )
}
