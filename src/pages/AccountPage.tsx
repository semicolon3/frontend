import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { MenuIcon } from '../components/icons'
import { logout } from '../api/auth'
import { clearTokens } from '../api/client'
import { fetchMe, deleteMe, type UserMe } from '../api/user'
import ProfileHero from '../components/account/ProfileHero'
import ProfileInfoCard from '../components/account/ProfileInfoCard'
import SecurityCard from '../components/account/SecurityCard'
import Toggle from '../components/account/Toggle'
import WithdrawModal from '../components/account/WithdrawModal'
import { Card, CardHead, Row } from '../components/account/Card'
import { LogoutIcon, TrashIcon } from '../components/account/icons'

export default function AccountPage() {
  const navigate = useNavigate()
  const [me, setMe] = useState<UserMe | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifyDiagnosis, setNotifyDiagnosis] = useState(true)
  const [notifyMarketing, setNotifyMarketing] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)

  useEffect(() => { fetchMe().then(setMe).catch(() => {}) }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleWithdraw = async () => {
    try {
      await deleteMe()
    } catch {}
    clearTokens()
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

            <ProfileHero me={me} />
            <ProfileInfoCard me={me} onUpdate={setMe} />
            <SecurityCard />

            <Card>
              <CardHead title="알림 설정" desc="받고 싶은 알림을 선택하세요." />
              <Row label="진단 결과 알림" action={<Toggle on={notifyDiagnosis} onToggle={() => setNotifyDiagnosis((v) => !v)} />}>
                AI 진단이 완료되면 이메일로 받기
              </Row>
              <Row label="마케팅 정보 수신" action={<Toggle on={notifyMarketing} onToggle={() => setNotifyMarketing((v) => !v)} />}>
                신규 기능, 프로모션, 이벤트 안내
              </Row>
            </Card>

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

      <WithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} onConfirm={handleWithdraw} />
    </>
  )
}
