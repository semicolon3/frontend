import { useState } from 'react'
import { updateMe, type UserMe } from '../../api/user'
import { CheckIcon } from '../icons'
import { Card, CardHead, GhostBtn, Row } from './Card'

export default function ProfileInfoCard({ me, onUpdate }: { me: UserMe | null; onUpdate: (u: UserMe) => void }) {
  const [editingName, setEditingName] = useState(false)
  const [editingPhone, setEditingPhone] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async (field: 'name' | 'phone') => {
    setSaving(true)
    try {
      const updated = await updateMe(field === 'name' ? { name: editName.trim() } : { phone: editPhone.trim() })
      onUpdate(updated)
      if (field === 'name') setEditingName(false)
      else setEditingPhone(false)
    } catch {} finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHead title="내 정보" desc="다른 사용자에게 표시되거나 알림 발송에 사용되는 정보입니다." />
      <Row
        label="이름"
        action={
          editingName ? (
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => setEditingName(false)} className="h-8 px-3 rounded-[10px] text-[13px] font-semibold bg-bg text-ink-soft hover:bg-bg-soft-2 transition-colors">취소</button>
              <button type="button" disabled={saving || !editName.trim()} onClick={() => handleSave('name')} className="h-8 px-3 rounded-[10px] text-[13px] font-semibold bg-primary text-white hover:bg-primary-hover disabled:opacity-50 transition-colors">저장</button>
            </div>
          ) : (
            <GhostBtn onClick={() => { setEditName(me?.name ?? ''); setEditingName(true) }}>변경</GhostBtn>
          )
        }
      >
        {editingName ? (
          <input
            autoFocus
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave('name'); if (e.key === 'Escape') setEditingName(false) }}
            className="h-9 px-3 rounded-[10px] border-[1.5px] border-primary bg-surface text-sm text-ink outline-none max-w-60 w-full focus:ring-[3px] focus:ring-primary/12"
          />
        ) : me?.name ?? '—'}
      </Row>

      <Row label="이메일" action={<GhostBtn>변경</GhostBtn>}>
        {me?.email ?? '—'}
        {me?.email && (
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-success bg-success-soft py-0.5 px-2 rounded-full">
            <CheckIcon className="w-2.5 h-2.5" />
            인증됨
          </span>
        )}
      </Row>

      <Row
        label="휴대폰"
        action={
          editingPhone ? (
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => setEditingPhone(false)} className="h-8 px-3 rounded-[10px] text-[13px] font-semibold bg-bg text-ink-soft hover:bg-bg-soft-2 transition-colors">취소</button>
              <button type="button" disabled={saving} onClick={() => handleSave('phone')} className="h-8 px-3 rounded-[10px] text-[13px] font-semibold bg-primary text-white hover:bg-primary-hover disabled:opacity-50 transition-colors">저장</button>
            </div>
          ) : (
            <GhostBtn onClick={() => { setEditPhone(me?.phone ?? ''); setEditingPhone(true) }}>변경</GhostBtn>
          )
        }
      >
        {editingPhone ? (
          <input
            autoFocus
            type="tel"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave('phone'); if (e.key === 'Escape') setEditingPhone(false) }}
            placeholder="010-0000-0000"
            className="h-9 px-3 rounded-[10px] border-[1.5px] border-primary bg-surface text-sm text-ink outline-none max-w-60 w-full focus:ring-[3px] focus:ring-primary/12"
          />
        ) : me?.phone || <span className="text-ink-mute text-[13.5px]">미등록</span>}
      </Row>
    </Card>
  )
}
