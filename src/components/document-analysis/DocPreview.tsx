import { useEffect, useState } from 'react'
import type { Document } from '../../api/documents'
import { fetchDocumentThumbnail } from '../../api/documents'
import { FileTextIcon } from '../icons'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const TYPE_LABEL: Record<string, string> = {
  CONTRACT: '계약서',
  KAKAO_CHAT: '카카오톡',
  RECEIPT: '영수증',
  OTHER: '기타',
}

export default function DocPreview({ doc }: { doc: Document | null }) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!doc || doc.ocrStatus !== 'COMPLETED') { setThumbnailUrl(null); return }
    setLoading(true)
    setThumbnailUrl(null)
    fetchDocumentThumbnail(doc.id)
      .then(setThumbnailUrl)
      .catch(() => setThumbnailUrl(null))
      .finally(() => setLoading(false))
  }, [doc?.id, doc?.ocrStatus])

  return (
    <div className="bg-surface border border-line rounded-2xl shadow-card-sm overflow-hidden">
      <div className="h-11 px-3.5 flex items-center border-b border-line bg-bg">
        <span className="text-[12.5px] text-ink-soft font-medium truncate">
          {doc?.originalFileName ?? '미리보기'}
        </span>
        {doc && (
          <span className="ml-auto text-[11.5px] text-ink-mute shrink-0">
            {TYPE_LABEL[doc.documentType] ?? doc.documentType} · {formatBytes(doc.fileSize)}
          </span>
        )}
      </div>

      <div className="bg-[#eef0f3] p-5 min-h-80 flex items-center justify-center">
        {loading ? (
          <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="문서 미리보기"
            className="w-full max-w-sm rounded shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
          />
        ) : doc ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-line shadow-card-sm grid place-items-center text-primary">
              <FileTextIcon className="w-7 h-7" />
            </div>
            <p className="text-[15px] font-semibold text-ink m-0 max-w-56 truncate">{doc.originalFileName}</p>
            <p className="text-[12px] text-ink-quat m-0">파일 미리보기가 지원되지 않습니다</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-14 h-14 rounded-[14px] bg-surface border border-line grid place-items-center text-ink-quat">
              <FileTextIcon className="w-6 h-6" />
            </div>
            <p className="text-[13.5px] text-ink-mute m-0">문서를 업로드하면 여기에 표시됩니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
