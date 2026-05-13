import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Topbar from '../components/Topbar'
import { signup } from '../api/auth'
import {
  AlertIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
  XIcon,
} from '../components/icons'

type FieldStatus = 'idle' | 'success' | 'error'

const TAKEN_EMAILS = new Set(['admin@legal.ai', 'test@example.com'])
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const STRENGTH_LABELS = ['', '약함', '보통', '강함', '매우 강함'] as const

function inputClass(status: FieldStatus, extra = '') {
  const stateClass =
    status === 'success'
      ? 'border-success focus:border-success focus:ring-4 focus:ring-success/15'
      : status === 'error'
      ? 'border-danger focus:border-danger focus:ring-4 focus:ring-danger/15'
      : 'border-line hover:border-line-strong focus:border-primary focus:ring-4 focus:ring-primary/15'
  return `w-full h-13 bg-white border rounded-xl text-[15px] text-ink placeholder:text-ink-mute outline-none transition-colors ${stateClass} ${extra}`
}

function scorePassword(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Za-z]/.test(pw) && /\d/.test(pw)) s++
  if (pw.length >= 12) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return Math.min(s, 4) as 0 | 1 | 2 | 3 | 4
}

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length < 4) return d
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [birth, setBirth] = useState('')
  const [phone, setPhone] = useState('')
  const [agreements, setAgreements] = useState({ tos: false, privacy: false, marketing: false })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const emailStatus = useMemo<'idle' | 'invalid' | 'taken' | 'ok'>(() => {
    const v = email.trim()
    if (!v) return 'idle'
    if (!EMAIL_REGEX.test(v)) return 'invalid'
    if (TAKEN_EMAILS.has(v.toLowerCase())) return 'taken'
    return 'ok'
  }, [email])

  const passwordStrength = scorePassword(password)
  const confirmStatus: FieldStatus =
    !passwordConfirm ? 'idle' : passwordConfirm === password && password ? 'success' : 'error'

  const allChecked = agreements.tos && agreements.privacy && agreements.marketing
  const requiredOk = agreements.tos && agreements.privacy

  const toggleAll = (v: boolean) =>
    setAgreements({ tos: v, privacy: v, marketing: v })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    try {
      await signup({
        email: email.trim(),
        password,
        name: name.trim(),
        phone: phone.replace(/-/g, '') || undefined,
      })
      navigate('/dashboard')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const emailFieldStatus: FieldStatus =
    emailStatus === 'ok' ? 'success' : emailStatus === 'idle' ? 'idle' : 'error'

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Topbar />

      <main className="flex-1 flex items-start justify-center px-6 pt-8 pb-16">
        <div className="w-full max-w-120 flex flex-col items-center gap-4">
          <section
            aria-labelledby="signup-title"
            className="w-full bg-surface rounded-3xl shadow-card p-12 max-[520px]:py-9 max-[520px]:px-6 max-[520px]:rounded-[20px]"
          >
            <div className="text-center mb-7">
              <span className="inline-flex items-center gap-1.5 bg-primary-soft text-primary text-xs font-semibold py-1.5 px-2.5 rounded-full tracking-[-0.01em] mb-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                기본 정보 입력
              </span>
              <h1
                id="signup-title"
                className="text-[28px] max-[520px]:text-2xl font-bold tracking-[-0.02em] text-ink mb-2"
              >
                회원가입
              </h1>
              <p className="text-[15px] text-ink-soft leading-normal">
                기본 정보만 입력하면 바로 시작할 수 있어요
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <Field label="이메일" required htmlFor="email">
                <div className="relative flex items-center">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass(emailFieldStatus, 'pl-4 pr-12')}
                  />
                  <StatusIcon status={emailFieldStatus} />
                </div>
                <EmailHint status={emailStatus} />
              </Field>

              <Field label="비밀번호" required htmlFor="password">
                <div className="relative flex items-center">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="영문, 숫자 포함 8자 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass('idle', 'pl-4 pr-13')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 inline-flex items-center justify-center rounded-lg text-ink-mute hover:bg-bg-soft-2 hover:text-ink-soft transition-colors"
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                <StrengthMeter level={passwordStrength} />
              </Field>

              <Field label="비밀번호 확인" required htmlFor="password2">
                <div className="relative flex items-center">
                  <input
                    id="password2"
                    name="password2"
                    type="password"
                    autoComplete="new-password"
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className={inputClass(confirmStatus, 'pl-4 pr-12')}
                  />
                  <StatusIcon status={confirmStatus} />
                </div>
                {confirmStatus === 'success' && (
                  <Hint tone="success" icon={<CheckIcon className="w-3.5 h-3.5" />}>
                    비밀번호가 일치합니다
                  </Hint>
                )}
                {confirmStatus === 'error' && (
                  <Hint tone="error" icon={<AlertIcon className="w-3.5 h-3.5" />}>
                    비밀번호가 일치하지 않습니다
                  </Hint>
                )}
              </Field>

              <Field label="이름" required htmlFor="name">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass('idle', 'px-4')}
                />
              </Field>

              <Field label="생년월일" required htmlFor="birth">
                <BirthDatePicker value={birth} onChange={setBirth} />
              </Field>

              <Field label="휴대폰 번호" optional htmlFor="phone">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={13}
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className={inputClass('idle', 'px-4')}
                />
              </Field>

              <div className="bg-bg border border-line rounded-xl p-4 mt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none text-[14.5px] font-bold text-ink tracking-[-0.01em]">
                  <CheckboxBox
                    size={20}
                    checked={allChecked}
                    onChange={toggleAll}
                  />
                  <span>전체 동의</span>
                </label>

                <div className="h-px bg-line my-3" />

                <div className="flex flex-col gap-2">
                  <AgreeRow
                    label={<><span className="text-primary font-semibold">(필수)</span> 이용약관 동의</>}
                    checked={agreements.tos}
                    onChange={(v) => setAgreements((s) => ({ ...s, tos: v }))}
                  />
                  <AgreeRow
                    label={<><span className="text-primary font-semibold">(필수)</span> 개인정보 처리방침 동의</>}
                    checked={agreements.privacy}
                    onChange={(v) => setAgreements((s) => ({ ...s, privacy: v }))}
                  />
                  <AgreeRow
                    label={<><span className="text-ink-mute font-semibold">(선택)</span> 마케팅 정보 수신 동의</>}
                    checked={agreements.marketing}
                    onChange={(v) => setAgreements((s) => ({ ...s, marketing: v }))}
                  />
                </div>
              </div>

              {submitError && (
                <p className="text-[13px] text-danger text-center -mb-1">{submitError}</p>
              )}
              <button
                type="submit"
                disabled={!requiredOk || submitting}
                className="w-full h-14 rounded-[14px] text-base font-semibold tracking-[-0.01em] mt-2 inline-flex items-center justify-center transition-colors bg-primary text-white hover:bg-primary-hover active:translate-y-px disabled:bg-bg-soft-2 disabled:text-ink-mute disabled:cursor-not-allowed disabled:active:translate-y-0"
              >
                {submitting ? '가입 중…' : '가입하기'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-soft">
              이미 계정이 있으신가요?
              <Link
                to="/login"
                className="ml-1.5 font-bold text-primary hover:underline underline-offset-[3px]"
              >
                로그인
              </Link>
            </p>
          </section>

          <p className="text-xs text-ink-mute text-center leading-normal">
            가입 즉시 무료로 사용 가능합니다
            <span className="inline-block w-0.75 h-0.75 rounded-full bg-ink-mute align-middle mx-1.5 opacity-60" />
            신용카드 불필요
          </p>
        </div>
      </main>
    </div>
  )
}

function Field({
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

function StatusIcon({ status }: { status: FieldStatus }) {
  if (status === 'idle') return null
  const color = status === 'success' ? 'text-success' : 'text-danger'
  return (
    <span className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 inline-flex items-center justify-center ${color}`}>
      {status === 'success' ? <CheckIcon className="w-5 h-5" /> : <XIcon className="w-5 h-5" />}
    </span>
  )
}

function Hint({
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

function EmailHint({ status }: { status: 'idle' | 'invalid' | 'taken' | 'ok' }) {
  if (status === 'idle') return <Hint>로그인 시 사용할 이메일을 입력해주세요</Hint>
  if (status === 'invalid')
    return (
      <Hint tone="error" icon={<AlertIcon className="w-3.5 h-3.5" />}>
        올바른 이메일 형식이 아닙니다
      </Hint>
    )
  if (status === 'taken')
    return (
      <Hint tone="error" icon={<AlertIcon className="w-3.5 h-3.5" />}>
        이미 사용 중인 이메일입니다
      </Hint>
    )
  return (
    <Hint tone="success" icon={<CheckIcon className="w-3.5 h-3.5" />}>
      사용 가능한 이메일입니다
    </Hint>
  )
}

function StrengthMeter({ level }: { level: 0 | 1 | 2 | 3 | 4 }) {
  const labelColor =
    level === 1
      ? 'text-danger'
      : level === 2
      ? 'text-warn'
      : level >= 3
      ? 'text-success'
      : 'text-ink-mute'
  const barColor = (i: number) => {
    if (i >= level) return 'bg-bg-soft-2'
    if (level === 1) return 'bg-danger'
    if (level === 2) return 'bg-warn'
    return 'bg-success'
  }
  return (
    <div className="flex items-center gap-2.5 mt-2.5">
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`flex-1 h-1 rounded transition-colors ${barColor(i)}`} />
        ))}
      </div>
      <span className={`text-xs font-semibold min-w-9 text-right tracking-[-0.01em] ${labelColor}`}>
        {STRENGTH_LABELS[level]}
      </span>
    </div>
  )
}

function CheckboxBox({
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

function AgreeRow({
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

function parseDate(s: string): Date | null {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const d = new Date(+m[1], +m[2] - 1, +m[3])
  return Number.isNaN(d.getTime()) ? null : d
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function sameDay(a: Date, b: Date | null): boolean {
  return (
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

const DOW = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
const THIS_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 101 }, (_, i) => THIS_YEAR - i)

type PickerMode = 'day' | 'month' | 'year'

function BirthDatePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<PickerMode>('day')
  const [view, setView] = useState<Date>(() => parseDate(value) ?? new Date(1995, 0, 1))
  const wrapRef = useRef<HTMLDivElement>(null)
  const yearListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setMode('day')
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  useEffect(() => {
    if (mode === 'year' && yearListRef.current) {
      const selected = yearListRef.current.querySelector('[data-selected="true"]')
      selected?.scrollIntoView({ block: 'center' })
    }
  }, [mode])

  const selected = parseDate(value)
  const today = new Date()
  const first = new Date(view.getFullYear(), view.getMonth(), 1)
  const start = new Date(first)
  start.setDate(1 - first.getDay())
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })

  const stepMonth = (delta: number) =>
    setView(new Date(view.getFullYear(), view.getMonth() + delta, 1))

  const toggleMode = () => setMode((m) => (m === 'day' ? 'year' : 'day'))

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative flex items-center">
        <input
          id="birth"
          name="birth"
          type="text"
          placeholder="YYYY-MM-DD"
          readOnly
          value={value}
          onClick={() => { setOpen((v) => !v); setMode('day') }}
          className={`${inputClass('idle', 'pl-4 pr-13')} cursor-pointer`}
        />
        <button
          type="button"
          onClick={() => { setOpen((v) => !v); setMode('day') }}
          aria-label="달력 열기"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 inline-flex items-center justify-center rounded-lg text-ink-mute hover:bg-bg-soft-2 hover:text-ink-soft transition-colors"
        >
          <CalendarIcon className="w-5 h-5" />
        </button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-label="날짜 선택"
          className="absolute left-0 right-0 top-full mt-2 bg-white border border-line rounded-[14px] shadow-popover p-3.5 z-10"
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-2.5">
            <button
              type="button"
              onClick={() => stepMonth(-1)}
              aria-label="이전 달"
              className={`w-7 h-7 inline-flex items-center justify-center rounded-lg text-ink-soft hover:bg-bg-soft-2 transition-colors ${mode !== 'day' ? 'invisible' : ''}`}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleMode}
              className="inline-flex items-center gap-1 text-sm font-bold text-ink hover:text-primary transition-colors"
            >
              {view.getFullYear()}년 {view.getMonth() + 1}월
              <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${mode !== 'day' ? 'rotate-180' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => stepMonth(1)}
              aria-label="다음 달"
              className={`w-7 h-7 inline-flex items-center justify-center rounded-lg text-ink-soft hover:bg-bg-soft-2 transition-colors ${mode !== 'day' ? 'invisible' : ''}`}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 연도 선택 */}
          {mode === 'year' && (
            <div ref={yearListRef} className="grid grid-cols-4 gap-1 max-h-52 overflow-y-auto py-0.5 pr-0.5">
              {YEARS.map((y) => {
                const isSel = y === view.getFullYear()
                return (
                  <button
                    key={y}
                    type="button"
                    data-selected={isSel}
                    onClick={() => {
                      setView(new Date(y, view.getMonth(), 1))
                      setMode('month')
                    }}
                    className={`h-8 rounded-lg text-[13px] font-medium transition-colors ${
                      isSel ? 'bg-primary text-white font-bold' : 'text-ink hover:bg-primary-soft hover:text-primary'
                    }`}
                  >
                    {y}
                  </button>
                )
              })}
            </div>
          )}

          {/* 월 선택 */}
          {mode === 'month' && (
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS.map((m, i) => {
                const isSel = i === view.getMonth()
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setView(new Date(view.getFullYear(), i, 1))
                      setMode('day')
                    }}
                    className={`h-9 rounded-lg text-[13px] font-medium transition-colors ${
                      isSel ? 'bg-primary text-white font-bold' : 'text-ink hover:bg-primary-soft hover:text-primary'
                    }`}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          )}

          {/* 날짜 선택 */}
          {mode === 'day' && (
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {DOW.map((d) => (
                <div key={d} className="text-[11px] font-semibold text-ink-mute py-1.5 tracking-[-0.01em]">
                  {d}
                </div>
              ))}
              {days.map((d, i) => {
                const muted = d.getMonth() !== view.getMonth()
                const isToday = sameDay(d, today)
                const isSelected = sameDay(d, selected)
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { onChange(fmtDate(d)); setOpen(false) }}
                    className={[
                      'h-8 rounded-lg inline-flex items-center justify-center text-[13px] transition-colors',
                      isSelected
                        ? 'bg-primary text-white font-bold'
                        : muted
                        ? 'text-ink-mute opacity-50 hover:bg-primary-soft hover:text-primary'
                        : 'text-ink hover:bg-primary-soft hover:text-primary',
                      isToday && !isSelected ? 'ring-1 ring-inset ring-primary' : '',
                    ].join(' ')}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
