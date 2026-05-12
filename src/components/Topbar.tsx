import { useNavigate } from 'react-router-dom'
import { BrandMark, ChevronLeftIcon } from './icons'

export default function Topbar() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-10 grid grid-cols-[1fr_auto_1fr] items-center h-16 px-7 bg-bg max-[520px]:px-3">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => navigate(-1)}
        className="justify-self-start w-10 h-10 inline-flex items-center justify-center rounded-xl text-ink-soft hover:bg-[#eef1f4] hover:text-ink transition-colors"
      >
        <ChevronLeftIcon className="w-5.5 h-5.5" />
      </button>

      <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-soft tracking-[-0.01em]">
        <span className="w-5.5 h-5.5 inline-flex items-center justify-center text-primary">
          <BrandMark className="w-5.5 h-5.5" />
        </span>
        <span>Legal AI</span>
      </div>
    </header>
  )
}
