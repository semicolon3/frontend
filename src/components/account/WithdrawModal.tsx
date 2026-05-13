import { useState } from 'react'
import { AlertTriangleIcon } from '../icons'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

const RISKS = [
  '모든 진단 기록 및 채팅 내역',
  '저장된 문서 및 사건 관리 데이터',
  '구독 및 결제 정보 (환불되지 않음)',
]

export default function WithdrawModal({ open, onClose, onConfirm }: Props) {
  const [input, setInput] = useState('')

  if (!open) return null

  const close = () => { onClose(); setInput('') }

  return (
    <>
      <div
        className="fixed inset-0 bg-[rgba(15,19,25,0.45)] backdrop-blur-sm z-40"
        onClick={close}
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
          {RISKS.map((item) => (
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="탈퇴합니다"
          className="w-full h-11 px-3.5 rounded-[10px] border-[1.5px] border-line text-sm text-ink outline-none transition-all focus:border-danger focus:ring-[4px] focus:ring-danger/10"
        />
        <div className="flex gap-2 justify-end mt-[22px]">
          <button
            type="button"
            onClick={close}
            className="h-11 px-5 rounded-[10px] bg-bg text-ink-soft text-[14.5px] font-semibold hover:bg-bg-soft-2 hover:text-ink transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            disabled={input.trim() !== '탈퇴합니다'}
            onClick={onConfirm}
            className="h-11 px-5 rounded-[10px] bg-danger text-white text-[14.5px] font-bold transition-colors hover:bg-[#d63848] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </>
  )
}
