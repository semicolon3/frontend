import type { ReactNode } from 'react'

export default function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: ReactNode
}) {
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
