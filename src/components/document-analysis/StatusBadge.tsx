import { STATUS_COLOR, STATUS_LABEL } from './constants'

export default function StatusBadge({ ocr, analysis }: { ocr: string; analysis: string }) {
  return (
    <div className="hidden sm:flex items-center gap-1.5 shrink-0">
      <span className={`text-[11px] font-semibold py-0.5 px-2 rounded-full ${STATUS_COLOR[ocr] ?? 'bg-bg text-ink-mute'}`}>
        OCR {STATUS_LABEL[ocr] ?? ocr}
      </span>
      <span className={`text-[11px] font-semibold py-0.5 px-2 rounded-full ${STATUS_COLOR[analysis] ?? 'bg-bg text-ink-mute'}`}>
        분석 {STATUS_LABEL[analysis] ?? analysis}
      </span>
    </div>
  )
}
