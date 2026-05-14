import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Sidebar, { type Recent } from '../components/Sidebar'
import { fetchConversations, fetchConversationById, createConversation, sendMessage, deleteConversation, updateConversation, type Message, type Conversation } from '../api/conversations'
import {
  ArrowUpIcon,
  AttachIcon,
  BookIcon,
  BrandMark,
  MenuIcon,
  MoreHorizIcon,
  ShareIcon,
} from '../components/icons'

const SUGGESTION_CHIPS = [
  '보증금을 안 돌려줘요',
  '집주인이 나가라고 해요',
  '수리비를 누가 부담하나요?',
  '묵시적 갱신이 뭔가요?',
]

const DOMAIN_LABELS: Record<string, { emoji: string; label: string }> = {
  LEASE: { emoji: '🏠', label: '임대차' },
  WORK: { emoji: '💼', label: '근로' },
  CONSUMER: { emoji: '🛍️', label: '소비자' },
  TRAFFIC: { emoji: '🚗', label: '교통' },
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return '방금'
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}일 전`
  return `${Math.floor(d / 7)}주 전`
}

export default function ChatDiagnosisPage() {
  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [recents, setRecents] = useState<Recent[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [titleInput, setTitleInput] = useState('')
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [searchParams] = useSearchParams()
  const bottomRef = useRef<HTMLDivElement>(null)
  const initSentRef = useRef(false)
  const navigate = useNavigate()

  const conversationId = searchParams.get('id') ? Number(searchParams.get('id')) : null
  const initMessage = searchParams.get('init')

  useEffect(() => {
    fetchConversations()
      .then(({ content }) =>
        setRecents(content.map((c) => ({ id: c.id, title: c.title, meta: formatRelative(c.updatedAt) })))
      )
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (conversationId == null) { setMessages([]); setConversation(null); return }
    setLoadingMessages(true)
    fetchConversationById(conversationId)
      .then((detail) => {
        setConversation(detail)
        setMessages(detail.messages)
      })
      .catch(() => {})
      .finally(() => setLoadingMessages(false))
  }, [conversationId])

  useEffect(() => {
    if (!initMessage || conversationId == null || loadingMessages || initSentRef.current) return
    if (messages.length > 0) return
    initSentRef.current = true
    const text = initMessage
    setMessages([{ id: Date.now(), role: 'USER', content: text, citations: [], createdAt: new Date().toISOString() }])
    setSending(true)
    sendMessage(conversationId, text)
      .then((reply) => setMessages((prev) => [...prev, reply]))
      .catch(() => {})
      .finally(() => setSending(false))
  }, [conversationId, initMessage, loadingMessages, messages.length])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || sending) return
    let convId = conversationId
    if (convId == null) {
      try {
        const conv = await createConversation('LEASE')
        convId = conv.id
        navigate(`/chat?id=${conv.id}`, { replace: true })
      } catch {
        return
      }
    }
    const text = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { id: Date.now(), role: 'USER', content: text, citations: [], createdAt: new Date().toISOString() }])
    setSending(true)
    try {
      const reply = await sendMessage(convId, text)
      setMessages((prev) => [...prev, reply])
    } catch {
      // keep the user message visible but don't crash
    } finally {
      setSending(false)
    }
  }

  const handleRenameStart = () => {
    setTitleInput(conversation?.title ?? '')
    setMenuOpen(false)
    setRenaming(true)
  }

  const handleRenameCommit = async () => {
    setRenaming(false)
    if (!titleInput.trim() || conversationId == null) return
    try {
      const updated = await updateConversation(conversationId, { title: titleInput.trim() })
      setConversation(updated)
    } catch {
      // 실패 시 기존 제목 유지
    }
  }

  const handleArchive = async () => {
    if (conversationId == null) return
    setMenuOpen(false)
    try {
      await updateConversation(conversationId, { archived: true })
      navigate('/dashboard')
    } catch {
      // 실패 시 현재 페이지 유지
    }
  }

  const handleDelete = async () => {
    if (conversationId == null) return
    setMenuOpen(false)
    try {
      await deleteConversation(conversationId)
      navigate('/dashboard')
    } catch {
      // 실패 시 현재 페이지 유지
    }
  }

  const domain = conversation
    ? (DOMAIN_LABELS[conversation.domain] ?? { emoji: '⚖️', label: conversation.domain })
    : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] h-screen">
      <Sidebar active="chat" recents={recents} mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      <section className="flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-surface border-b border-line flex items-center justify-between px-5 md:px-8 shrink-0">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button
              type="button"
              aria-label="메뉴"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-[10px] grid place-items-center text-ink-soft hover:bg-bg transition-colors shrink-0"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            {domain && (
              <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-primary-soft text-primary shrink-0">
                <span aria-hidden>{domain.emoji}</span>
                <span>{domain.label}</span>
              </span>
            )}
            {renaming ? (
              <input
                autoFocus
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleRenameCommit}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRenameCommit(); if (e.key === 'Escape') setRenaming(false) }}
                className="text-base font-semibold text-ink bg-bg border border-primary rounded-lg px-2 py-0.5 outline-none min-w-0 w-48"
              />
            ) : (
              <h1 className="text-base font-semibold text-ink truncate">
                {conversation?.title ?? '새 대화'}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <IconBtn label="공유">
              <ShareIcon className="w-4.5 h-4.5" />
            </IconBtn>
            <div className="relative">
              <IconBtn label="더보기" onClick={() => setMenuOpen((v) => !v)}>
                <MoreHorizIcon className="w-4.5 h-4.5" />
              </IconBtn>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden />
                  <div className="absolute right-0 top-full mt-1 w-36 bg-surface border border-line rounded-xl shadow-popover z-20 py-1 overflow-hidden">
                    <button
                      type="button"
                      onClick={handleRenameStart}
                      className="w-full text-left px-3.5 py-2.5 text-[13.5px] text-ink-soft hover:bg-bg transition-colors"
                    >
                      제목 변경
                    </button>
                    <button
                      type="button"
                      onClick={handleArchive}
                      className="w-full text-left px-3.5 py-2.5 text-[13.5px] text-ink-soft hover:bg-bg transition-colors"
                    >
                      보관
                    </button>
                    <div className="h-px bg-line mx-2 my-1" />
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="w-full text-left px-3.5 py-2.5 text-[13.5px] text-danger hover:bg-bg transition-colors"
                    >
                      대화 삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-bg">
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="max-w-190 mx-auto px-4 md:px-0 pt-8 pb-6">
              <div className="flex gap-3 items-start">
                <AIAvatar />
                <div className="bg-surface border border-line rounded-2xl rounded-tl-sm py-4 px-4.5 max-w-155 shadow-card-sm">
                  <p className="m-0 text-ink text-[15px] leading-[1.65]">
                    안녕하세요! 어떤 상황인지 자유롭게 알려주세요.
                    <br />
                    관련 법령과 판례를 찾아 정확하게 답변드릴게요.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 max-w-155 ml-11">
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
          ) : (
            <div className="max-w-190 mx-auto px-4 md:px-0 pt-8 pb-6 flex flex-col gap-4">
              {messages.map((msg) =>
                msg.role === 'USER' ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="bg-primary text-white py-3.5 px-4.5 rounded-2xl rounded-br-sm max-w-130 text-[15px] leading-[1.6] shadow-[0_1px_3px_rgba(49,130,246,0.2)]">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex gap-3 items-start">
                    <AIAvatar />
                    <div className="bg-surface border border-line rounded-2xl rounded-tl-sm py-4 px-4.5 max-w-175 shadow-card-sm">
                      <p className="m-0 text-ink text-[15px] leading-[1.75] whitespace-pre-wrap">{msg.content}</p>
                      {msg.citations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-line">
                          {msg.citations.map((c, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 py-0.5 px-2 rounded-md text-[12.5px] font-semibold bg-primary-soft text-primary"
                            >
                              <BookIcon className="w-2.75 h-2.75" />
                              {c.lawName} {c.article}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {sending && (
            <div className="max-w-190 mx-auto px-4 md:px-0 pb-4">
              <div className="flex gap-3 items-start">
                <AIAvatar />
                <div className="bg-surface border border-line rounded-2xl rounded-tl-sm py-4 px-4.5 shadow-card-sm">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-2 h-2 bg-ink-mute rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-ink-mute rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-ink-mute rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div
          className="shrink-0 pt-2 pb-5"
          style={{ background: 'linear-gradient(to bottom, rgba(249,250,251,0) 0%, var(--color-bg) 30%)' }}
        >
          <div className="max-w-190 mx-auto px-4 md:px-6">
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
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSend() }}
                placeholder="메시지를 입력하세요…"
                disabled={sending}
                className="flex-1 outline-none h-full text-[15px] text-ink placeholder:text-ink-mute px-3 bg-transparent disabled:opacity-60"
              />
              <button
                type="button"
                aria-label="전송"
                onClick={handleSend}
                disabled={!input.trim() || sending}
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

function IconBtn({ label, onClick, children }: { label: string; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="w-9 h-9 rounded-[10px] grid place-items-center text-ink-soft transition-colors hover:bg-bg"
    >
      {children}
    </button>
  )
}
