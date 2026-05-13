import type { UserMe } from '../../api/user'
import { CameraIcon, EditIcon } from './icons'

export default function ProfileHero({ me }: { me: UserMe | null }) {
  return (
    <div className="bg-surface border border-line rounded-[20px] p-6 md:p-7 flex items-center gap-5 mb-5">
      <div className="relative shrink-0">
        <div className="w-18 h-18 rounded-full bg-linear-to-br from-[#b8d4ff] to-primary text-white grid place-items-center text-[26px] font-bold">
          {me?.name?.[0] ?? '?'}
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
        <h2 className="text-xl font-bold text-ink m-0 mb-1 tracking-tight">{me?.name ?? '—'}</h2>
        <p className="text-sm text-ink-soft m-0">{me?.email ?? '—'}</p>
        {me && (
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[12.5px] text-ink-mute">
            <span>
              {new Date(me.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} 가입
            </span>
          </div>
        )}
      </div>
      <button
        type="button"
        className="hidden sm:inline-flex h-9 px-4 rounded-[10px] bg-surface border-[1.5px] border-line text-[13.5px] font-semibold text-ink-soft items-center gap-1.5 hover:border-line-strong hover:text-ink transition-colors shrink-0"
      >
        <EditIcon />
        프로필 수정
      </button>
    </div>
  )
}
