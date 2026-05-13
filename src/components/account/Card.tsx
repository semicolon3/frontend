import type { ReactNode } from 'react'

export function Card({ children }: { children: ReactNode }) {
  return <div className="bg-surface border border-line rounded-[18px] mb-5 overflow-hidden">{children}</div>
}

export function CardHead({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="px-7 pt-5.5 pb-1.5">
      <h2 className="text-base font-bold text-ink m-0 tracking-[-0.015em]">{title}</h2>
      <p className="text-[13px] text-ink-mute mt-1 m-0">{desc}</p>
    </div>
  )
}

export function Row({ label, children, action }: { label: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr_auto] items-center gap-4 px-7 py-4 border-t border-line">
      <div className="text-[13.5px] font-semibold text-ink-soft">{label}</div>
      <div className="text-[14.5px] text-ink font-medium flex items-center gap-2 flex-wrap min-w-0">{children}</div>
      <div className="flex items-center gap-2 justify-end">{action}</div>
    </div>
  )
}

export function GhostBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-8 px-3 rounded-[10px] text-[13px] font-semibold bg-bg text-ink-soft hover:bg-bg-soft-2 hover:text-ink transition-colors"
    >
      {children}
    </button>
  )
}
