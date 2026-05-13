import { useEffect, useRef, useState } from 'react'
import { CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons'
import { inputClass } from './styles'

function parseDate(s: string): Date | null {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const d = new Date(+m[1], +m[2] - 1, +m[3])
  return Number.isNaN(d.getTime()) ? null : d
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function sameDay(a: Date, b: Date | null): boolean {
  return (
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

const DOW = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
const THIS_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 101 }, (_, i) => THIS_YEAR - i)

type PickerMode = 'day' | 'month' | 'year'

export default function BirthDatePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<PickerMode>('day')
  const [view, setView] = useState<Date>(() => parseDate(value) ?? new Date(1995, 0, 1))
  const wrapRef = useRef<HTMLDivElement>(null)
  const yearListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setMode('day')
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  useEffect(() => {
    if (mode === 'year' && yearListRef.current) {
      const selected = yearListRef.current.querySelector('[data-selected="true"]')
      selected?.scrollIntoView({ block: 'center' })
    }
  }, [mode])

  const selected = parseDate(value)
  const today = new Date()
  const first = new Date(view.getFullYear(), view.getMonth(), 1)
  const start = new Date(first)
  start.setDate(1 - first.getDay())
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })

  const stepMonth = (delta: number) =>
    setView(new Date(view.getFullYear(), view.getMonth() + delta, 1))

  const toggleMode = () => setMode((m) => (m === 'day' ? 'year' : 'day'))

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative flex items-center">
        <input
          id="birth"
          name="birth"
          type="text"
          placeholder="YYYY-MM-DD"
          readOnly
          value={value}
          onClick={() => { setOpen((v) => !v); setMode('day') }}
          className={`${inputClass('idle', 'pl-4 pr-13')} cursor-pointer`}
        />
        <button
          type="button"
          onClick={() => { setOpen((v) => !v); setMode('day') }}
          aria-label="달력 열기"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 inline-flex items-center justify-center rounded-lg text-ink-mute hover:bg-bg-soft-2 hover:text-ink-soft transition-colors"
        >
          <CalendarIcon className="w-5 h-5" />
        </button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-label="날짜 선택"
          className="absolute left-0 right-0 top-full mt-2 bg-white border border-line rounded-[14px] shadow-popover p-3.5 z-10"
        >
          <div className="flex items-center justify-between mb-2.5">
            <button
              type="button"
              onClick={() => stepMonth(-1)}
              aria-label="이전 달"
              className={`w-7 h-7 inline-flex items-center justify-center rounded-lg text-ink-soft hover:bg-bg-soft-2 transition-colors ${mode !== 'day' ? 'invisible' : ''}`}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleMode}
              className="inline-flex items-center gap-1 text-sm font-bold text-ink hover:text-primary transition-colors"
            >
              {view.getFullYear()}년 {view.getMonth() + 1}월
              <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${mode !== 'day' ? 'rotate-180' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => stepMonth(1)}
              aria-label="다음 달"
              className={`w-7 h-7 inline-flex items-center justify-center rounded-lg text-ink-soft hover:bg-bg-soft-2 transition-colors ${mode !== 'day' ? 'invisible' : ''}`}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          {mode === 'year' && (
            <div ref={yearListRef} className="grid grid-cols-4 gap-1 max-h-52 overflow-y-auto py-0.5 pr-0.5">
              {YEARS.map((y) => {
                const isSel = y === view.getFullYear()
                return (
                  <button
                    key={y}
                    type="button"
                    data-selected={isSel}
                    onClick={() => { setView(new Date(y, view.getMonth(), 1)); setMode('month') }}
                    className={`h-8 rounded-lg text-[13px] font-medium transition-colors ${
                      isSel ? 'bg-primary text-white font-bold' : 'text-ink hover:bg-primary-soft hover:text-primary'
                    }`}
                  >
                    {y}
                  </button>
                )
              })}
            </div>
          )}

          {mode === 'month' && (
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS.map((m, i) => {
                const isSel = i === view.getMonth()
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setView(new Date(view.getFullYear(), i, 1)); setMode('day') }}
                    className={`h-9 rounded-lg text-[13px] font-medium transition-colors ${
                      isSel ? 'bg-primary text-white font-bold' : 'text-ink hover:bg-primary-soft hover:text-primary'
                    }`}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          )}

          {mode === 'day' && (
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {DOW.map((d) => (
                <div key={d} className="text-[11px] font-semibold text-ink-mute py-1.5 tracking-[-0.01em]">
                  {d}
                </div>
              ))}
              {days.map((d, i) => {
                const muted = d.getMonth() !== view.getMonth()
                const isToday = sameDay(d, today)
                const isSelected = sameDay(d, selected)
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { onChange(fmtDate(d)); setOpen(false) }}
                    className={[
                      'h-8 rounded-lg inline-flex items-center justify-center text-[13px] transition-colors',
                      isSelected ? 'bg-primary text-white font-bold'
                        : muted ? 'text-ink-mute opacity-50 hover:bg-primary-soft hover:text-primary'
                        : 'text-ink hover:bg-primary-soft hover:text-primary',
                      isToday && !isSelected ? 'ring-1 ring-inset ring-primary' : '',
                    ].join(' ')}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
