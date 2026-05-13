import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import {
  AlertTriangleIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  MenuIcon,
} from '../components/icons'
import { logout } from '../api/auth'

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx={12} cy={13} r={4} />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1={21} y1={12} x2={9} y2={12} />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  )
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

const STRENGTH_LABELS = ['', '약함', '보통', '강함', '매우 강함'] as const

function StrengthBar({ level }: { level: 0 | 1 | 2 | 3 | 4 }) {
  const barColor = (i: number) => {
    if (i >= level) return 'bg-bg-soft-2'
    if (level === 1) return 'bg-danger'
    if (level === 2) return 'bg-warn'
    return 'bg-success'
  }
  const labelColor = level === 1 ? 'text-danger' : level === 2 ? 'text-warn' : level >= 3 ? 'text-success' : 'text-ink-mute'
  return (
    <div className="flex items-center gap-2.5 mt-2 max-w-90">
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`flex-1 h-1 rounded transition-colors ${barColor(i)}`} />
        ))}
      </div>
      <span className={`text-xs font-semibold min-w-9 text-right ${labelColor}`}>
        {STRENGTH_LABELS[level]}
      </span>
    </div>
  )
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative w-10.5 h-6 rounded-full transition-colors shrink-0 ${on ? 'bg-primary' : 'bg-line-strong'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${on ? 'translate-x-4.5' : ''}`} />
    </button>
  )
}

function Card({ children }: { children: ReactNode }) {
  return <div className="bg-surface border border-line rounded-[18px] mb-5 overflow-hidden">{children}</div>
}

function CardHead({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="px-7 pt-5.5 pb-1.5">
      <h2 className="text-base font-bold text-ink m-0 tracking-[-0.015em]">{title}</h2>
      <p className="text-[13px] text-ink-mute mt-1 m-0">{desc}</p>
    </div>
  )
}

function Row({ label, children, action }: { label: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr_auto] items-center gap-4 px-7 py-4 border-t border-line">
      <div className="text-[13.5px] font-semibold text-ink-soft">{label}</div>
      <div className="text-[14.5px] text-ink font-medium flex items-center gap-2 flex-wrap min-w-0">{children}</div>
      <div className="flex items-center gap-2 justify-end">{action}</div>
    </div>
  )
}

function GhostBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
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

export default function AccountPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showNew, setShowNew] = useState(false)

  const [notifyDiagnosis, setNotifyDiagnosis] = useState(true)
  const [notifyMarketing, setNotifyMarketing] = useState(false)

  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawInput, setWithdrawInput] = useState('')

  const pwLevel = scorePassword(newPw)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleWithdraw = () => {
    navigate('/')
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-screen">
        <Sidebar active="home" mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

        <section className="flex flex-col min-w-0 min-h-screen">
          <header className="h-16 bg-surface border-b border-line flex items-center justify-between px-5 md:px-10 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="메뉴"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-9 h-9 rounded-[10px] grid place-items-center text-ink-soft hover:bg-bg transition-colors"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
              <span className="text-[13px] text-ink-mute hidden sm:inline">
                홈 <span className="mx-1.5 text-ink-quat">/</span>
              </span>
              <h1 className="text-base font-semibold text-ink m-0">내 계정</h1>
            </div>
          </header>

          <div className="flex-1 px-5 md:px-10 pt-8 pb-16 max-w-230 w-full mx-auto">
            <div className="mb-7">
              <h1 className="text-[26px] font-bold text-ink m-0 mb-1.5 tracking-tight">내 계정</h1>
              <p className="text-[14.5px] text-ink-soft m-0">프로필, 보안, 알림 등 계정에 관한 설정을 관리할 수 있어요.</p>
            </div>

            {/* 프로필 히어로 */}
            <div className="bg-surface border border-line rounded-[20px] p-6 md:p-7 flex items-center gap-5 mb-5">
              <div className="relative shrink-0">
                <div className="w-18 h-18 rounded-full bg-linear-to-br from-[#b8d4ff] to-primary text-white grid place-items-center text-[26px] font-bold">
                  홍
                </div>
                <button
                  type="button"
                  aria-label="프로필 사진 변경"
                  className="absolute right-[-2px] bottom-[-2px] w-7 h-7 rounded-full bg-surface border-[1.5px] border-line grid place-items-center text-ink-soft hover:border-primary hover:text-primary transition-colors"
                >
                  <CameraIcon />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-ink m-0 mb-1 tracking-tight">홍길동</h2>
                <p className="text-sm text-ink-soft m-0">hong@example.com</p>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[12.5px] text-ink-mute">
                  <span>2025년 8월 12일 가입</span>
                  <span className="text-line-strong">·</span>
                  <span>최근 접속 2분 전</span>
                </div>
              </div>
              <button
                type="button"
                className="hidden sm:inline-flex h-9 px-4 rounded-[10px] bg-surface border-[1.5px] border-line text-[13.5px] font-semibold text-ink-soft items-center gap-1.5 hover:border-line-strong hover:text-ink transition-colors shrink-0"
              >
                <EditIcon />
                프로필 수정
              </button>
            </div>

            {/* 내 정보 */}
            <Card>
              <CardHead title="내 정보" desc="다른 사용자에게 표시되거나 알림 발송에 사용되는 정보입니다." />
              <Row label="이름" action={<GhostBtn>변경</GhostBtn>}>홍길동</Row>
              <Row label="이메일" action={<GhostBtn>변경</GhostBtn>}>
                hong@example.com
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-success bg-[#e5f8eb] py-0.5 px-2 rounded-full">
                  <CheckIcon className="w-2.5 h-2.5" />
                  인증됨
                </span>
              </Row>
              <Row label="휴대폰" action={<GhostBtn>변경</GhostBtn>}>
                010-1234-5678
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-success bg-[#e5f8eb] py-0.5 px-2 rounded-full">
                  <CheckIcon className="w-2.5 h-2.5" />
                  본인인증
                </span>
              </Row>
            </Card>

            {/* 보안 */}
            <Card>
              <CardHead title="보안" desc="비밀번호와 로그인 보안 설정을 관리하세요." />
              <div className="px-7 py-4 border-t border-line">
                <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3 md:gap-4 items-start">
                  <div className="text-[13.5px] font-semibold text-ink-soft pt-2.5">현재 비밀번호</div>
                  <input
                    type="password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="현재 비밀번호 입력"
                    className="h-10 px-3.5 rounded-[10px] border-[1.5px] border-line bg-surface text-sm text-ink outline-none max-w-90 w-full transition-all hover:border-line-strong focus:border-primary focus:ring-[3px] focus:ring-primary/12"
                  />
                </div>
              </div>
              <div className="px-7 py-4 border-t border-line">
                <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3 md:gap-4 items-start">
                  <div className="text-[13.5px] font-semibold text-ink-soft pt-2.5">새 비밀번호</div>
                  <div className="max-w-90 w-full">
                    <div className="relative flex items-center">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                        className="h-10 pl-3.5 pr-11 rounded-[10px] border-[1.5px] border-line bg-surface text-sm text-ink outline-none w-full transition-all hover:border-line-strong focus:border-primary focus:ring-[3px] focus:ring-primary/12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((v) => !v)}
                        className="absolute right-2 w-8 h-8 inline-flex items-center justify-center rounded-lg text-ink-mute hover:text-ink-soft transition-colors"
                      >
                        {showNew ? <EyeOffIcon className="w-4.5 h-4.5" /> : <EyeIcon className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                    <StrengthBar level={pwLevel} />
                  </div>
                </div>
              </div>
              <div className="px-7 py-4 border-t border-line">
                <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_auto] gap-3 md:gap-4 items-start">
                  <div className="text-[13.5px] font-semibold text-ink-soft pt-2.5">새 비밀번호 확인</div>
                  <div className="max-w-90 w-full">
                    <input
                      type="password"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      placeholder="새 비밀번호를 한 번 더 입력"
                      className="h-10 px-3.5 rounded-[10px] border-[1.5px] border-line bg-surface text-sm text-ink outline-none w-full transition-all hover:border-line-strong focus:border-primary focus:ring-[3px] focus:ring-primary/12"
                    />
                    <p className="text-[12.5px] text-ink-mute mt-1.5">최근 사용한 비밀번호와 같은 비밀번호는 사용할 수 없어요.</p>
                  </div>
                  <button
                    type="button"
                    disabled={!currentPw || !newPw || !confirmPw}
                    className="h-9 px-4 rounded-[10px] bg-primary text-white text-[13.5px] font-semibold inline-flex items-center transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shrink-0 self-start"
                  >
                    비밀번호 변경
                  </button>
                </div>
              </div>
            </Card>

            {/* 알림 */}
            <Card>
              <CardHead title="알림 설정" desc="받고 싶은 알림을 선택하세요." />
              <Row
                label="진단 결과 알림"
                action={<Toggle on={notifyDiagnosis} onToggle={() => setNotifyDiagnosis((v) => !v)} />}
              >
                AI 진단이 완료되면 이메일로 받기
              </Row>
              <Row
                label="마케팅 정보 수신"
                action={<Toggle on={notifyMarketing} onToggle={() => setNotifyMarketing((v) => !v)} />}
              >
                신규 기능, 프로모션, 이벤트 안내
              </Row>
            </Card>

            {/* 로그아웃 */}
            <Card>
              <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-7 py-[18px]">
                <div>
                  <p className="text-sm font-semibold text-ink m-0 mb-0.5">로그아웃</p>
                  <p className="text-[13px] text-ink-mute m-0">현재 사용 중인 기기에서 로그아웃합니다.</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="h-11 px-5 rounded-xl bg-surface border-[1.5px] border-line text-[14.5px] font-semibold text-ink-soft inline-flex items-center gap-2 hover:border-line-strong hover:text-ink transition-colors"
                >
                  <LogoutIcon />
                  로그아웃
                </button>
              </div>
            </Card>

            {/* 회원탈퇴 */}
            <div className="bg-surface border border-[#ffd7db] rounded-[18px] mb-5 overflow-hidden">
              <div className="px-7 pt-5.5 pb-1.5">
                <h2 className="text-base font-bold text-danger m-0 tracking-[-0.015em]">회원 탈퇴</h2>
                <p className="text-[13px] text-ink-mute mt-1 m-0">계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없어요.</p>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-7 py-[18px] border-t border-line">
                <div>
                  <p className="text-sm font-semibold text-ink m-0 mb-0.5">계정 삭제</p>
                  <p className="text-[13px] text-ink-mute m-0">탈퇴 후 30일간 데이터가 보관되며, 이후 영구 삭제됩니다.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setWithdrawOpen(true)}
                  className="h-11 px-5 rounded-xl bg-surface border-[1.5px] border-[#ffd7db] text-[14.5px] font-semibold text-danger inline-flex items-center gap-2 hover:bg-[#fff0f1] hover:border-[#ffb8bf] transition-colors shrink-0"
                >
                  <TrashIcon />
                  회원 탈퇴
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 탈퇴 확인 모달 */}
      {withdrawOpen && (
        <>
          <div
            className="fixed inset-0 bg-[rgba(15,19,25,0.45)] backdrop-blur-sm z-40"
            onClick={() => { setWithdrawOpen(false); setWithdrawInput('') }}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] max-w-[calc(100vw-32px)] bg-surface rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.08)] p-7 z-50"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-[#fff0f1] text-danger grid place-items-center shrink-0">
                <AlertTriangleIcon className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-[18px] font-bold text-ink m-0 tracking-tight">정말 탈퇴하시겠어요?</h3>
            </div>
            <p className="text-[14px] text-ink-soft mt-3 mb-0 leading-[1.55]">
              회원을 탈퇴하면 아래의 데이터가 모두 삭제되며 복구할 수 없어요.
            </p>
            <ul className="mt-3 mb-0 p-3.5 bg-bg rounded-xl list-none space-y-1">
              {['모든 진단 기록 및 채팅 내역', '저장된 문서 및 사건 관리 데이터', '구독 및 결제 정보 (환불되지 않음)'].map((item) => (
                <li key={item} className="text-[13px] text-ink-soft flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-ink-quat mt-[9px] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[13.5px] text-ink-soft mt-4 mb-1.5">
              계속하려면 <strong className="text-danger font-bold">탈퇴합니다</strong> 라고 입력해주세요.
            </p>
            <input
              type="text"
              value={withdrawInput}
              onChange={(e) => setWithdrawInput(e.target.value)}
              placeholder="탈퇴합니다"
              className="w-full h-11 px-3.5 rounded-[10px] border-[1.5px] border-line text-sm text-ink outline-none transition-all focus:border-danger focus:ring-[4px] focus:ring-danger/10"
            />
            <div className="flex gap-2 justify-end mt-[22px]">
              <button
                type="button"
                onClick={() => { setWithdrawOpen(false); setWithdrawInput('') }}
                className="h-11 px-5 rounded-[10px] bg-bg text-ink-soft text-[14.5px] font-semibold hover:bg-bg-soft-2 hover:text-ink transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                disabled={withdrawInput.trim() !== '탈퇴합니다'}
                onClick={handleWithdraw}
                className="h-11 px-5 rounded-[10px] bg-danger text-white text-[14.5px] font-bold transition-colors hover:bg-[#d63848] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
