import { useState, type ReactNode } from 'react'
import Sidebar from '../components/Sidebar'
import {
  ArrowRightIcon,
  ArrowUpIcon,
  AttachIcon,
  BookIcon,
  BrandMark,
  CopyIcon,
  MoreHorizIcon,
  ShareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '../components/icons'

const SUGGESTION_CHIPS = [
  '보증금을 안 돌려줘요',
  '집주인이 나가라고 해요',
  '수리비를 누가 부담하나요?',
  '묵시적 갱신이 뭔가요?',
]

const STEPS = [
  <><strong className="font-bold">내용증명 발송</strong>으로 공식적으로 반환을 요구합니다.</>,
  <><strong className="font-bold">임차권등기명령</strong>을 신청해 대항력·우선변제권을 유지합니다. (3개월 무효 방지)</>,
  <>합의가 어려우면 <strong className="font-bold">민사조정</strong> 또는 소액사건을 진행합니다.</>,
]

export default function ChatDiagnosisPage() {
  const [input, setInput] = useState('')

  return (
    <div className="grid grid-cols-[260px_1fr] w-360 mx-auto h-screen">
      <Sidebar active="chat" activeRecent={0} />

      <section className="flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-surface border-b border-line flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-primary-soft text-primary shrink-0">
              <span aria-hidden>🏠</span>
              <span>임대차</span>
            </span>
            <h1 className="text-base font-semibold text-ink truncate">보증금 미반환 분쟁</h1>
          </div>
          <div className="flex items-center gap-2">
            <IconBtn label="공유">
              <ShareIcon className="w-4.5 h-4.5" />
            </IconBtn>
            <IconBtn label="더보기">
              <MoreHorizIcon className="w-4.5 h-4.5" />
            </IconBtn>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-bg">
          <div className="max-w-[760px] mx-auto pt-8 pb-6 flex flex-col gap-7">
            <div>
              <div className="flex gap-3 items-start">
                <AIAvatar />
                <div className="bg-surface border border-line rounded-2xl rounded-tl-[4px] py-4 px-4.5 max-w-[620px] shadow-card-sm">
                  <p className="m-0 text-ink text-[15px] leading-[1.65]">
                    안녕하세요! 어떤 상황인지 자유롭게 알려주세요.
                    <br />
                    관련 법령과 판례를 찾아 정확하게 답변드릴게요.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 max-w-[620px] ml-11">
                {SUGGESTION_CHIPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setInput(c)}
                    className="bg-surface border border-line rounded-full py-2.25 px-3.5 text-[13.5px] text-ink-soft font-medium inline-flex items-center gap-1.5 transition-colors hover:bg-primary-soft hover:border-[#c5deff] hover:text-primary"
                  >
                    <span>💡</span>
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-primary text-white py-3.5 px-4.5 rounded-2xl rounded-br-[4px] max-w-[520px] text-[15px] leading-[1.6] shadow-[0_1px_3px_rgba(49,130,246,0.2)]">
                전세 계약 끝났는데 집주인이 보증금 안 돌려주고 있어요. 2주 됐어요.
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <AIAvatar />
              <AnswerCard />
            </div>

            <div className="ml-11 -mt-4">
              <div className="flex items-start gap-1.5 py-2.5 px-3.5 bg-bg-soft-3 rounded-[10px] max-w-[700px]">
                <span aria-hidden className="text-sm leading-normal">⚠️</span>
                <span className="text-xs text-ink-mute leading-normal">
                  본 정보는 법률 자문이 아닙니다. 구체적 사안에 대한 판단은 변호사 상담을 권장드립니다.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="shrink-0 pt-2 pb-5"
          style={{
            background:
              'linear-gradient(to bottom, rgba(249,250,251,0) 0%, var(--color-bg) 30%)',
          }}
        >
          <div className="max-w-[760px] mx-auto px-6">
            <div className="text-[12.5px] text-ink-mute mb-2 pl-1 flex items-center gap-1.5">
              <span>💡</span>
              <span>계약서나 카톡 캡처를 함께 올리면 더 정확한 답변을 받을 수 있어요</span>
            </div>
            <div className="bg-surface border-[1.5px] border-line rounded-2xl flex items-center pl-4 pr-2 h-14 transition-colors shadow-card-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
              <button
                type="button"
                aria-label="파일 첨부"
                className="w-9 h-9 rounded-[10px] grid place-items-center text-ink-mute shrink-0 transition-colors hover:bg-bg hover:text-ink-soft"
              >
                <AttachIcon className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요…"
                className="flex-1 outline-none h-full text-[15px] text-ink placeholder:text-ink-mute px-3 bg-transparent"
              />
              <button
                type="button"
                aria-label="전송"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-primary text-white grid place-items-center shrink-0 transition-colors hover:bg-primary-hover disabled:bg-line-strong disabled:cursor-not-allowed"
              >
                <ArrowUpIcon className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function AIAvatar() {
  return (
    <div
      aria-hidden
      className="w-8 h-8 rounded-full bg-primary-soft text-primary grid place-items-center shrink-0 border border-[#d7e8ff]"
    >
      <BrandMark className="w-4 h-4" />
    </div>
  )
}

function IconBtn({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="w-9 h-9 rounded-[10px] grid place-items-center text-ink-soft transition-colors hover:bg-bg"
    >
      {children}
    </button>
  )
}

function AnswerCard() {
  return (
    <div className="bg-surface border border-line rounded-2xl rounded-tl-[4px] pt-5.5 px-6 pb-4.5 max-w-[700px] shadow-card">
      <div className="text-ink text-[15px] leading-[1.75]">
        <p className="m-0 mb-3">
          임대차 종료 후에도 집주인이 보증금을 반환하지 않는 경우, 임차인은 다음과 같이 단계적으로 대응할 수 있습니다.
        </p>

        <ol className="my-1.5 mb-3.5 p-0 list-none flex flex-col gap-2">
          {STEPS.map((step, i) => (
            <li key={i} className="relative pl-8 leading-[1.65]">
              <span className="absolute left-0 top-0.5 w-5.5 h-5.5 bg-primary-soft text-primary rounded-full grid place-items-center text-xs font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <p className="m-0 mb-3">
          <Cite type="law">
            <BookIcon className="w-2.75 h-2.75" />
            주택임대차보호법 제3조의2
          </Cite>
          에 따르면, 임차인이 보증금 반환을 받지 못한 경우 법원에{' '}
          <strong className="font-bold">임차권등기명령</strong>을 신청할 수 있으며, 이로써 이사 후에도 대항력과 우선변제권이 유지됩니다.
        </p>

        <p className="m-0">
          또한{' '}
          <Cite type="case">
            <BrandMark className="w-2.75 h-2.75" />
            대법원 2021다12345
          </Cite>{' '}
          판결은 보증금 반환 지연에 따른 <strong className="font-bold">지연이자(연 5%)</strong>를 인정한 사례입니다. 내용증명 발송 시점부터 청구 가능합니다.
        </p>
      </div>

      <SourcesBox />
      <ActionsBox />
      <FeedbackRow />
    </div>
  )
}

function Cite({ type, children }: { type: 'law' | 'case'; children: ReactNode }) {
  const cls =
    type === 'law'
      ? 'bg-primary-soft text-primary'
      : 'bg-bg-soft-2 text-ink-soft'
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-md text-[13px] font-semibold leading-[1.4] align-baseline cursor-pointer transition-opacity hover:opacity-80 mx-px ${cls}`}
    >
      {children}
    </button>
  )
}

function SourcesBox() {
  return (
    <div className="mt-4.5 p-4.5 bg-bg-soft-3 rounded-xl">
      <p className="text-[13px] font-bold text-ink m-0 mb-3 flex items-center gap-1.5">
        <span>📚</span> 참고한 법령 · 판례
      </p>
      <SourceCard
        tag="law"
        title="주택임대차보호법 제3조의2 (보증금의 회수)"
        excerpt='"임차인은 임차주택에 대한 보증금반환청구소송의 확정 판결 또는 이에 준하는 집행권원에 기한 경매를 신청하는 경우 반대의무의 이행이나 이행의 제공을 집행개시의 요건으로 하지 아니한다…"'
      />
      <SourceCard
        tag="case"
        title="대법원 2021다12345 판결"
        excerpt='"임대차계약이 종료된 후 임대인이 보증금을 반환하지 않은 경우, 임차인은 그 반환을 구할 수 있고, 임대인은 지연이자를 지급할 의무가 있다…"'
      />
    </div>
  )
}

function SourceCard({
  tag,
  title,
  excerpt,
}: {
  tag: 'law' | 'case'
  title: string
  excerpt: string
}) {
  const tagCls =
    tag === 'law'
      ? 'bg-primary-soft text-primary'
      : 'bg-bg-soft-2 text-ink-soft'
  return (
    <div className="bg-surface border border-line rounded-xl py-3.5 px-4 mb-2 last:mb-0 cursor-pointer transition-colors hover:border-line-strong">
      <div className="flex items-center justify-between gap-2.5 mb-1.5">
        <span
          className={`inline-flex items-center gap-1 py-0.75 px-2 rounded-md text-[11.5px] font-semibold ${tagCls}`}
        >
          {tag === 'law' ? (
            <BookIcon className="w-2.75 h-2.75" />
          ) : (
            <BrandMark className="w-2.75 h-2.75" />
          )}
          {tag === 'law' ? '법령' : '판례'}
        </span>
        <span className="flex-1 text-sm font-semibold text-ink min-w-0">{title}</span>
        <a
          href="#"
          className="text-[13px] font-semibold text-primary inline-flex items-center gap-0.5 shrink-0"
        >
          원문 보기
          <ArrowRightIcon className="w-3 h-3" />
        </a>
      </div>
      <p className="text-[13.5px] text-ink-soft leading-[1.6] m-0">{excerpt}</p>
    </div>
  )
}

type ActionTone = 'rent' | 'court' | 'law'

const ACTIONS: {
  icon: string
  iconBg: ActionTone
  title: string
  desc: string
  btn: { label: string; variant: 'primary' | 'outline' }
}[] = [
  {
    icon: '📜',
    iconBg: 'rent',
    title: '내용증명 발송',
    desc: '공식 문서로 반환을 요구합니다. AI가 초안을 작성해드려요.',
    btn: { label: '자동 작성', variant: 'primary' },
  },
  {
    icon: '🏛️',
    iconBg: 'court',
    title: '임차권등기명령',
    desc: '대항력·우선변제권을 유지하기 위한 법원 신청 절차입니다.',
    btn: { label: '더 알아보기', variant: 'outline' },
  },
  {
    icon: '⚖️',
    iconBg: 'law',
    title: '민사조정 · 소액사건',
    desc: '3,000만원 이하 소송사건을 빠른 절차로 진행할 수 있어요.',
    btn: { label: '절차 보기', variant: 'outline' },
  },
]

function ActionsBox() {
  return (
    <div className="mt-3.5 p-4.5 bg-bg-soft-3 rounded-xl">
      <p className="text-[13px] font-bold text-ink m-0 mb-3 flex items-center gap-1.5">
        <span>🎯</span> 추천 다음 액션
      </p>
      {ACTIONS.map((a, i) => (
        <ActionRow key={i} index={i + 1} {...a} />
      ))}
    </div>
  )
}

function ActionRow({
  index,
  icon,
  iconBg,
  title,
  desc,
  btn,
}: {
  index: number
  icon: string
  iconBg: ActionTone
  title: string
  desc: string
  btn: { label: string; variant: 'primary' | 'outline' }
}) {
  const iconBgCls =
    iconBg === 'rent'
      ? 'bg-primary-soft'
      : iconBg === 'court'
      ? 'bg-warn-soft'
      : 'bg-violet-soft'
  const btnCls =
    btn.variant === 'primary'
      ? 'bg-primary text-white hover:bg-primary-hover'
      : 'bg-surface border border-line text-ink-soft hover:bg-bg hover:border-line-strong'
  return (
    <div className="flex items-center gap-3 py-3.5 px-4 bg-surface border border-line rounded-xl mb-2 last:mb-0">
      <span className="w-6 h-6 rounded-full bg-bg text-ink-soft grid place-items-center text-xs font-bold shrink-0">
        {index}
      </span>
      <span
        aria-hidden
        className={`w-9 h-9 rounded-[10px] grid place-items-center text-lg shrink-0 ${iconBgCls}`}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[14.5px] font-semibold text-ink m-0 mb-0.5">{title}</p>
        <p className="text-[12.5px] text-ink-mute m-0">{desc}</p>
      </div>
      <button
        type="button"
        className={`h-9 px-3.5 rounded-[10px] text-[13.5px] font-semibold inline-flex items-center gap-1 shrink-0 transition-colors ${btnCls}`}
      >
        {btn.label}
      </button>
    </div>
  )
}

function FeedbackRow() {
  const [vote, setVote] = useState<'up' | 'down' | null>(null)
  return (
    <div className="flex items-center justify-end gap-0.5 mt-3.5 pt-3.5 border-t border-line">
      <span className="mr-auto text-xs text-ink-mute">이 답변이 도움이 되셨나요?</span>
      <FbBtn label="도움됨" active={vote === 'up'} onClick={() => setVote(vote === 'up' ? null : 'up')}>
        <ThumbsUpIcon className="w-4 h-4" />
      </FbBtn>
      <FbBtn label="부정확" active={vote === 'down'} onClick={() => setVote(vote === 'down' ? null : 'down')}>
        <ThumbsDownIcon className="w-4 h-4" />
      </FbBtn>
      <FbBtn label="복사">
        <CopyIcon className="w-4 h-4" />
      </FbBtn>
    </div>
  )
}

function FbBtn({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`w-8 h-8 rounded-lg grid place-items-center transition-colors ${
        active
          ? 'bg-primary-soft text-primary'
          : 'text-ink-mute hover:bg-bg hover:text-ink-soft'
      }`}
    >
      {children}
    </button>
  )
}
