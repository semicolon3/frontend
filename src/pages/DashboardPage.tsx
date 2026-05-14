import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar, { type Recent } from '../components/Sidebar'
import { fetchMe, type UserMe } from '../api/user'
import IconBtn from '../components/IconBtn'
import { fetchConversations, createConversation } from '../api/conversations'
import { BellIcon, MenuIcon, SettingsIcon } from '../components/icons'
import { formatRelativeTime } from '../utils/relativeTime'
import DomainCard, { DOMAINS, DOMAIN_MAP } from '../components/dashboard/DomainCard'
import LawSearchPopover from '../components/dashboard/LawSearchPopover'
import FreeInputCard from '../components/dashboard/FreeInputCard'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [recents, setRecents] = useState<Recent[]>([])
  const [me, setMe] = useState<UserMe | null>(null)

  const handleNewChat = async (domainKey?: string) => {
    try {
      const conv = await createConversation(DOMAIN_MAP[domainKey ?? ''] ?? 'LEASE')
      navigate(`/chat?id=${conv.id}`)
    } catch {
      navigate('/chat')
    }
  }

  const handleFreeInput = async (query: string) => {
    try {
      const conv = await createConversation('LEASE')
      navigate(`/chat?id=${conv.id}&init=${encodeURIComponent(query)}`)
    } catch {
      navigate('/chat')
    }
  }

  useEffect(() => {
    fetchMe().then(setMe).catch(() => {})
  }, [])

  useEffect(() => {
    fetchConversations()
      .then(({ content }) =>
        setRecents(content.map((c) => ({ id: c.id, title: c.title, meta: c.updatedAt ? formatRelativeTime(c.updatedAt) : '' })))
      )
      .catch(() => {})
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-screen">
      <Sidebar
        active="home"
        recents={recents}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        onNewChat={() => handleNewChat()}
      />

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
            <h1 className="text-base font-semibold text-ink m-0">홈</h1>
          </div>
          <div className="flex items-center gap-2">
            <LawSearchPopover />
            <IconBtn label="알림">
              <BellIcon className="w-4.5 h-4.5" />
            </IconBtn>
            <IconBtn label="설정">
              <SettingsIcon className="w-4.5 h-4.5" />
            </IconBtn>
          </div>
        </header>

        <div className="flex-1 px-5 md:px-10 pt-8 md:pt-10 pb-14 max-w-295 w-full mx-auto">
          <div className="mb-9">
            <h1 className="text-[26px] md:text-[32px] font-bold text-ink m-0 mb-2 tracking-tight leading-tight">
              안녕하세요, {me?.name ?? ''}님 <span aria-hidden>👋</span>
            </h1>
            <p className="text-base text-ink-soft m-0 leading-normal">오늘은 어떤 도움이 필요하세요?</p>
          </div>

          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-bold text-ink m-0 tracking-[-0.015em]">어떤 분야의 도움이 필요하세요?</h2>
            <span className="text-[13.5px] text-ink-mute">분야를 선택하면 맞춤 진단을 시작합니다</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-11">
            {DOMAINS.map((d) => (
              <DomainCard key={d.key} domain={d} onStart={() => handleNewChat(d.key)} />
            ))}
          </div>

          <FreeInputCard onSubmit={handleFreeInput} />
        </div>
      </section>
    </div>
  )
}
