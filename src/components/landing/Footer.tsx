import type { ReactNode } from 'react'
import { BrandMark } from '../icons'

export default function Footer() {
  return (
    <footer className="border-t border-line py-8 px-5 md:px-10 lg:px-20 bg-surface grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-6">
      <div className="flex items-center justify-center md:justify-start gap-2.5 text-[13px] text-ink-mute">
        <span className="w-6 h-6 rounded-[7px] bg-linear-to-br from-primary to-primary-hover grid place-items-center text-white">
          <BrandMark className="w-3.5 h-3.5" />
        </span>
        © 2026 Legal AI
      </div>
      <div className="text-center text-[12.5px] text-ink-mute leading-normal">
        본 서비스는 법률 정보 제공이며 법률 자문이 아닙니다
      </div>
      <div className="flex items-center justify-center md:justify-end gap-1.5 text-[13px] text-ink-soft">
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
    <a href="#" className="py-1 px-2 rounded-md transition-colors hover:text-primary hover:bg-bg">
      {children}
    </a>
  )
}
