import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { BrandMark } from '../icons'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 h-14 md:h-18 bg-surface border-b border-line flex items-center justify-between px-5 md:px-10 lg:px-20">
      <Link to="/" className="flex items-center gap-2.25">
        <span className="w-8 h-8 rounded-[9px] bg-linear-to-br from-primary to-primary-hover grid place-items-center text-white">
          <BrandMark className="w-4.5 h-4.5" />
        </span>
        <span className="text-[17px] font-bold text-ink tracking-[-0.025em]">Legal AI</span>
      </Link>

      <nav className="hidden md:flex items-center gap-1">
        <HeaderLink href="#features">서비스 소개</HeaderLink>
        <HeaderLink href="#how">이용 방법</HeaderLink>
      </nav>

      <div className="flex items-center gap-1.5">
        <Link
          to="/login"
          className="h-9 md:h-10 px-3 md:px-3.5 rounded-[10px] text-[13.5px] md:text-[14.5px] font-semibold text-ink-soft inline-flex items-center transition-colors hover:bg-bg hover:text-ink"
        >
          로그인
        </Link>
        <Link
          to="/dashboard"
          className="h-9 md:h-10 px-3.5 md:px-4.5 rounded-[10px] bg-primary text-white text-[13.5px] md:text-[14.5px] font-bold inline-flex items-center justify-center gap-1.5 transition-colors hover:bg-primary-hover active:scale-[0.98] tracking-[-0.01em]"
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
