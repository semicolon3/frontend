import { useState } from 'react'
import { changePassword } from '../../api/user'
import { EyeIcon, EyeOffIcon } from '../icons'
import StrengthMeter from '../signup/StrengthMeter'
import { Card, CardHead } from './Card'

export default function SecurityCard() {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = async () => {
    setError(null)
    setSuccess(false)
    setSaving(true)
    try {
      await changePassword(currentPw, newPw)
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '변경에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const mismatch = !!(newPw && confirmPw && newPw !== confirmPw)
  const disabled = saving || !currentPw || !newPw || !confirmPw || newPw !== confirmPw

  return (
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
            <StrengthMeter password={newPw} />
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
            {error && <p className="text-[12.5px] text-danger mt-1.5">{error}</p>}
            {success && <p className="text-[12.5px] text-success mt-1.5">비밀번호가 변경됐습니다.</p>}
            {mismatch && <p className="text-[12.5px] text-danger mt-1.5">새 비밀번호가 일치하지 않습니다.</p>}
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={handleChange}
            className="h-9 px-4 rounded-[10px] bg-primary text-white text-[13.5px] font-semibold inline-flex items-center transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shrink-0 self-start"
          >
            {saving ? '변경 중…' : '비밀번호 변경'}
          </button>
        </div>
      </div>
    </Card>
  )
}
