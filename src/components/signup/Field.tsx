import type { ReactNode } from 'react'
import { AlertIcon, CheckIcon, XIcon } from '../icons'
import type { FieldStatus } from './styles'

export type EmailStatus = 'idle' | 'invalid' | 'taken' | 'ok'

export function Field({
  label,
  htmlFor,
  required,
  optional,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-[13px] font-semibold text-ink-soft mb-2 tracking-[-0.01em]"
      >
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
        {optional && <span className="text-ink-mute font-medium ml-1.5">(선택)</span>}
      </label>
      {children}
    </div>
  )
}

export function StatusIcon({ status }: { status: FieldStatus }) {
  if (status === 'idle') return null
  const color = status === 'success' ? 'text-success' : 'text-danger'
  return (
    <span className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 inline-flex items-center justify-center ${color}`}>
      {status === 'success' ? <CheckIcon className="w-5 h-5" /> : <XIcon className="w-5 h-5" />}
    </span>
  )
}

export function Hint({
  tone = 'idle',
  icon,
  children,
}: {
  tone?: 'idle' | 'success' | 'error'
  icon?: ReactNode
  children: ReactNode
}) {
  const color =
    tone === 'success' ? 'text-success' : tone === 'error' ? 'text-danger' : 'text-ink-mute'
  return (
    <div className={`flex items-center gap-1.5 text-[12.5px] mt-2 min-h-4 tracking-[-0.01em] ${color}`}>
      {icon}
      <span>{children}</span>
    </div>
  )
}

export function EmailHint({ status }: { status: EmailStatus }) {
  if (status === 'idle') return <Hint>로그인 시 사용할 이메일을 입력해주세요</Hint>
  if (status === 'invalid')
    return <Hint tone="error" icon={<AlertIcon className="w-3.5 h-3.5" />}>올바른 이메일 형식이 아닙니다</Hint>
  if (status === 'taken')
    return <Hint tone="error" icon={<AlertIcon className="w-3.5 h-3.5" />}>이미 사용 중인 이메일입니다</Hint>
  return <Hint tone="success" icon={<CheckIcon className="w-3.5 h-3.5" />}>사용 가능한 이메일입니다</Hint>
}
