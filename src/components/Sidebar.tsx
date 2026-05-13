import { Link } from 'react-router-dom'
import {
  BrandMark,
  ChatBubbleIcon,
  FileTextIcon,
  FolderCaseIcon,
  GridIcon,
  PlusIcon,
} from './icons'
import type { ReactNode } from 'react'

export type SidebarKey = 'home' | 'chat' | 'docs' | 'cases'

export type Recent = { id?: number; title: string; meta: string }

const DEFAULT_RECENTS: Recent[] = [
  { title: '보증금 미반환 분쟁', meta: '3일 전' },
  { title: '야근수당 미지급', meta: '1주 전' },
  { title: '온라인 환불 거부', meta: '2주 전' },
]

export default function Sidebar({
  active = 'home',
  activeRecent,
  recents = DEFAULT_RECENTS,
  recentsLabel = '최근 대화',
  mobileOpen = false,
  onMobileClose,
  onRecentClick,
}: {
  active?: SidebarKey
  activeRecent?: number
  recents?: Recent[]
  recentsLabel?: string
  mobileOpen?: boolean
  onMobileClose?: () => void
  onRecentClick?: (id: number) => void
}) {
  return (
    <>
      <div
        aria-hidden
        onClick={onMobileClose}
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
    <aside className={`bg-surface border-r border-line flex flex-col w-[260px] fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0.24,1)] lg:sticky lg:h-screen lg:z-auto lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="px-4 pt-5 pb-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-hover grid place-items-center text-white">
          <BrandMark className="w-4 h-4" />
        </div>
        <span className="text-base font-bold text-ink tracking-[-0.02em]">Legal AI</span>
      </div>

      <button
        type="button"
        className="mx-4 mt-1 mb-4 h-11 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-primary-hover transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        새 진단 시작
      </button>

      <div className="h-px bg-line mx-4" />

      <nav className="px-2 pt-3 pb-2 flex flex-col gap-0.5">
        <NavLink to="/dashboard" active={active === 'home'} icon={<GridIcon className="w-4.5 h-4.5" />}>
          홈
        </NavLink>
        <NavLink to="/chat" active={active === 'chat'} icon={<ChatBubbleIcon className="w-4.5 h-4.5" />}>
          채팅
        </NavLink>
        <NavLink to="/documents" active={active === 'docs'} icon={<FileTextIcon className="w-4.5 h-4.5" />}>
          내 문서
        </NavLink>
        <NavItem active={active === 'cases'} icon={<FolderCaseIcon className="w-4.5 h-4.5" />}>
          사건 관리
        </NavItem>
      </nav>

      <div className="h-px bg-line mx-4" />

      <div className="px-4 pt-4 pb-1.5 text-xs text-ink-mute font-medium tracking-[0.01em]">
        {recentsLabel}
      </div>

      <div className="px-2 flex flex-col gap-0.5 flex-1 overflow-y-auto">
        {recents.map((r, i) => {
          const isActive = activeRecent === i
          return (
            <button
              key={i}
              type="button"
              onClick={() => r.id != null && onRecentClick?.(r.id)}
              className={`flex items-center gap-2 py-2.5 px-3 rounded-[10px] text-left transition-colors ${
                isActive ? 'bg-primary-soft' : 'hover:bg-bg'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isActive ? 'bg-primary' : 'bg-line-strong'
                }`}
              />
              <span
                className={`flex-1 min-w-0 truncate text-[13.5px] ${
                  isActive ? 'text-primary font-semibold' : 'text-ink-soft font-medium'
                }`}
              >
                {r.title}
              </span>
              <span className="text-[11.5px] text-ink-mute font-normal">{r.meta}</span>
            </button>
          )
        })}
      </div>

      <Link
        to="/account"
        className="m-2 py-2.5 px-3 flex items-center gap-2.5 rounded-xl bg-bg hover:bg-bg-soft-2 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#b8d4ff] to-primary text-white grid place-items-center text-[13px] font-semibold shrink-0">
          홍
        </div>
        <span className="flex-1 text-sm font-semibold text-ink text-left">홍길동</span>
      </Link>
    </aside>
    </>
  )
}

function NavLink({
  to,
  active,
  icon,
  children,
}: {
  to: string
  active: boolean
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <Link to={to} className={navItemClass(active)}>
      <span className={iconClass(active)}>{icon}</span>
      <span>{children}</span>
    </Link>
  )
}

function NavItem({
  active,
  icon,
  children,
}: {
  active: boolean
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <button type="button" className={navItemClass(active)}>
      <span className={iconClass(active)}>{icon}</span>
      <span>{children}</span>
    </button>
  )
}

function navItemClass(active: boolean) {
  return `flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] text-sm transition-colors text-left w-full ${
    active
      ? 'bg-primary-soft text-primary font-semibold'
      : 'text-ink-soft font-medium hover:bg-bg'
  }`
}

function iconClass(active: boolean) {
  return `w-4.5 grid place-items-center ${active ? 'text-primary' : 'text-ink-mute'}`
}
