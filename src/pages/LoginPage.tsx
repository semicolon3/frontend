import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Topbar from '../components/Topbar'
import { EyeIcon, EyeOffIcon } from '../components/icons'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Topbar />

      <main className="flex-1 flex items-center justify-center px-6 pt-6 pb-14">
        <div className="w-full max-w-[440px] flex flex-col items-center gap-5">
          <section
            aria-labelledby="login-title"
            className="w-full bg-surface rounded-3xl shadow-card p-12 max-[520px]:py-9 max-[520px]:px-6 max-[520px]:rounded-[20px]"
          >
            <div className="text-center mb-8">
              <h1
                id="login-title"
                className="text-[28px] max-[520px]:text-2xl font-bold tracking-[-0.02em] text-ink mb-2"
              >
                다시 오신 것을 환영합니다
              </h1>
              <p className="text-[15px] text-ink-soft leading-normal">
                계정 정보로 로그인해주세요
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[13px] font-semibold text-ink-soft mb-2 tracking-[-0.01em]"
                >
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@email.com"
                  className="w-full h-13 px-4 bg-white border border-line rounded-xl text-[15px] text-ink placeholder:text-ink-mute outline-none transition-colors hover:border-line-strong focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[13px] font-semibold text-ink-soft mb-2 tracking-[-0.01em]"
                >
                  비밀번호
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="비밀번호 입력"
                    className="w-full h-13 pl-4 pr-13 bg-white border border-line rounded-xl text-[15px] text-ink placeholder:text-ink-mute outline-none transition-colors hover:border-line-strong focus:border-primary focus:ring-4 focus:ring-primary/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 inline-flex items-center justify-center rounded-lg text-ink-mute hover:bg-[#f2f4f6] hover:text-ink-soft transition-colors"
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none text-sm text-ink-soft">
                  <span className="relative inline-flex w-[18px] h-[18px]">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="peer appearance-none w-full h-full border-[1.5px] border-line-strong rounded-[5px] bg-white cursor-pointer transition-colors hover:border-primary checked:bg-primary checked:border-primary"
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
                  <span>로그인 상태 유지</span>
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-primary hover:text-primary-hover hover:underline underline-offset-[3px]"
                >
                  비밀번호 찾기
                </a>
              </div>

              <button
                type="submit"
                className="w-full h-14 rounded-[14px] bg-primary text-white text-base font-semibold tracking-[-0.01em] mt-3 transition-colors hover:bg-primary-hover active:translate-y-px"
              >
                로그인
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-ink-soft">
              계정이 없으신가요?
              <Link
                to="/signup"
                className="ml-1.5 font-bold text-primary hover:underline underline-offset-[3px]"
              >
                회원가입
              </Link>
            </p>
          </section>

          <p className="text-xs text-ink-mute text-center leading-normal">
            법률 정보 제공 서비스
            <span className="inline-block w-0.75 h-0.75 rounded-full bg-ink-mute align-middle mx-1.5 opacity-60" />
            법률 자문 아님
          </p>
        </div>
      </main>
    </div>
  )
}
