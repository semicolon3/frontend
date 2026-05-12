import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export function EyeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...base} {...props}>
      <path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12z" />
      <circle cx={12} cy={12} r={3} />
    </svg>
  )
}

export function EyeOffIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...base} {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58a3 3 0 0 0 4.24 4.24" />
      <path d="M9.88 5.09A10.9 10.9 0 0 1 12 4.5c6.5 0 10.5 7.5 10.5 7.5a18.6 18.6 0 0 1-3.32 4.27" />
      <path d="M6.61 6.61A18.7 18.7 0 0 0 1.5 12s4 7.5 10.5 7.5a10.8 10.8 0 0 0 5.39-1.44" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.4} {...base} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.4} {...base} {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <circle cx={12} cy={12} r={10} />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...base} {...props}>
      <rect x={3} y={5} width={18} height={16} rx={2} />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.5} {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.5} {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function GridIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <rect x={3} y={3} width={7} height={7} rx={1.5} />
      <rect x={14} y={3} width={7} height={7} rx={1.5} />
      <rect x={3} y={14} width={7} height={7} rx={1.5} />
      <rect x={14} y={14} width={7} height={7} rx={1.5} />
    </svg>
  )
}

export function ChatBubbleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export function FileTextIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

export function FolderCaseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <rect x={3} y={4} width={18} height={18} rx={2} />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <circle cx={11} cy={11} r={8} />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export function BellIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <circle cx={12} cy={12} r={3} />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export function BoltIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} {...base} {...props}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" />
      <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" />
    </svg>
  )
}

export function ShareIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1={12} y1={2} x2={12} y2={15} />
    </svg>
  )
}

export function MoreHorizIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} {...base} {...props}>
      <circle cx={12} cy={12} r={1.2} />
      <circle cx={19} cy={12} r={1.2} />
      <circle cx={5} cy={12} r={1.2} />
    </svg>
  )
}

export function BookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.4} {...base} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

export function ThumbsUpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.66-9.32a1 1 0 0 1 1.73.13L15 5.88Z" />
    </svg>
  )
}

export function ThumbsDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.66 9.32a1 1 0 0 1-1.73-.13L9 18.12Z" />
    </svg>
  )
}

export function CopyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <rect x={9} y={9} width={13} height={13} rx={2} />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export function AttachIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} {...base} {...props}>
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 17.93 8.8l-8.57 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.4} {...base} {...props}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

export function BrandMark(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...base} {...props}>
      <path d="M12 3v18" />
      <path d="M5 21h14" />
      <path d="M6 7h12" />
      <path d="M9 5l-4 9a4 4 0 0 0 8 0L9 5z" />
      <path d="M15 5l-4 9a4 4 0 0 0 8 0l-4-9z" />
    </svg>
  )
}
