import type { Document as UploadedDoc } from '../../api/documents'
import { MoreHorizIcon } from '../icons'
import { formatRelativeTime } from '../../utils/relativeTime'
import { DOC_TAG, formatFileSize, getFileKind, TYPE_ICON_CLASS, type FileKind } from './constants'
import { ImageIcon, PdfIcon } from './icons'
import StatusPill from './StatusPill'

function FileTypeBadge({ kind }: { kind: FileKind }) {
  return (
    <div className={`w-11 h-11 rounded-xl grid place-items-center shrink-0 ${TYPE_ICON_CLASS[kind]}`}>
      {kind === 'image' ? <ImageIcon /> : <PdfIcon />}
    </div>
  )
}

type Props = {
  doc: UploadedDoc
  menuOpen: boolean
  onMenuToggle: () => void
  onClick: () => void
  onDelete: () => void
}

export default function DocCard({ doc, menuOpen, onMenuToggle, onClick, onDelete }: Props) {
  const kind = getFileKind(doc.mimeType, doc.originalFileName)
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="group bg-surface border border-line rounded-2xl p-5 flex flex-col gap-3.5 cursor-pointer transition-[box-shadow,transform,border-color] hover:border-line-strong hover:-translate-y-0.5 hover:shadow-card-hover relative"
    >
      <div className="flex items-start justify-between gap-2">
        <FileTypeBadge kind={kind} />
        <div className="relative">
          <button
            type="button"
            aria-label="더보기"
            onClick={(e) => { e.stopPropagation(); onMenuToggle() }}
            className="w-7 h-7 rounded-lg text-ink-mute grid place-items-center transition-all opacity-0 group-hover:opacity-100 hover:bg-bg hover:text-ink"
          >
            <MoreHorizIcon className="w-3.5 h-3.5" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); onMenuToggle() }} aria-hidden />
              <div className="absolute right-0 top-full mt-1 w-32 bg-surface border border-line rounded-xl shadow-popover z-20 py-1 overflow-hidden">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDelete() }}
                  className="w-full text-left px-3.5 py-2.5 text-[13px] font-medium text-danger hover:bg-risk-high-bg transition-colors"
                >
                  삭제
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <div className="text-[15px] font-bold text-ink leading-snug line-clamp-2 break-all tracking-tight">
          {doc.originalFileName}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-ink-mute tabular-nums">
          <span>{formatRelativeTime(doc.createdAt)}</span>
          <span className="w-0.75 h-0.75 rounded-full bg-ink-quat" />
          <span>{formatFileSize(doc.fileSize)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-line mt-auto">
        <StatusPill status={doc.analysisStatus} />
        <span className="text-[11.5px] text-ink-mute font-medium">{DOC_TAG[doc.documentType] ?? doc.documentType}</span>
      </div>
    </div>
  )
}
