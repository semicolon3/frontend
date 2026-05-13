import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Topbar from '../components/Topbar'
import { signup } from '../api/auth'
import { AlertIcon, CheckIcon, EyeIcon, EyeOffIcon } from '../components/icons'
import { Field, StatusIcon, Hint, EmailHint, type EmailStatus } from '../components/signup/Field'
import StrengthMeter from '../components/signup/StrengthMeter'
import { CheckboxBox, AgreeRow } from '../components/signup/Checkbox'
import BirthDatePicker from '../components/signup/BirthDatePicker'
import { inputClass, type FieldStatus } from '../components/signup/styles'

const TAKEN_EMAILS = new Set(['admin@legal.ai', 'test@example.com'])
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

  const emailStatus = useMemo<EmailStatus>(() => {
    const v = email.trim()
    if (!v) return 'idle'
    if (!EMAIL_REGEX.test(v)) return 'invalid'
    if (TAKEN_EMAILS.has(v.toLowerCase())) return 'taken'
    return 'ok'
  }, [email])

  const confirmStatus: FieldStatus =
    !passwordConfirm ? 'idle' : passwordConfirm === password && password ? 'success' : 'error'

  const allChecked = agreements.tos && agreements.privacy && agreements.marketing
  const requiredOk = agreements.tos && agreements.privacy

  const toggleAll = (v: boolean) => setAgreements({ tos: v, privacy: v, marketing: v })

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
              <h1 id="signup-title" className="text-[28px] max-[520px]:text-2xl font-bold tracking-[-0.02em] text-ink mb-2">
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
                <StrengthMeter password={password} />
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
                  <CheckboxBox size={20} checked={allChecked} onChange={toggleAll} />
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

              {submitError && <p className="text-[13px] text-danger text-center -mb-1">{submitError}</p>}
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
              <Link to="/login" className="ml-1.5 font-bold text-primary hover:underline underline-offset-[3px]">
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
