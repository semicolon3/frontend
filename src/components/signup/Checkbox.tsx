import type { ReactNode } from 'react'
import { ChevronRightIcon } from '../icons'

export function CheckboxBox({
  checked,
  onChange,
  size = 18,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  size?: 18 | 20
}) {
  const sizeClass = size === 20 ? 'w-5 h-5 rounded-md' : 'w-[18px] h-[18px] rounded-[5px]'
  return (
    <span className={`relative inline-flex shrink-0 ${sizeClass}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`peer appearance-none w-full h-full border-[1.5px] border-line-strong ${sizeClass.includes('rounded-md') ? 'rounded-md' : 'rounded-[5px]'} bg-white cursor-pointer transition-colors hover:border-primary checked:bg-primary checked:border-primary`}
      />
      <svg
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
      >
        <path d="M2 6l3 3 5-6" />
      </svg>
    </span>
  )
}

export function AgreeRow({
  label,
  checked,
  onChange,
}: {
  label: ReactNode
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-[13.5px] text-ink-soft">
        <CheckboxBox size={20} checked={checked} onChange={onChange} />
        <span>{label}</span>
      </label>
      <a
        href="#"
        className="inline-flex items-center gap-0.5 text-[12.5px] text-ink-mute py-0.5 px-1.5 rounded-md hover:bg-white hover:text-ink-soft transition-colors"
      >
        보기
        <ChevronRightIcon className="w-3 h-3" />
      </a>
    </div>
  )
}
