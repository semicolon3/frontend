import { useRef, useState } from 'react'
import { uploadDocument, type DocumentType } from '../../api/documents'
import { CheckIcon, FileTextIcon } from '../icons'

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  CONTRACT: '계약서',
  KAKAO_CHAT: '카카오톡',
  RECEIPT: '영수증',
  OTHER: '기타',
}

export default function UploadBox({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [docType, setDocType] = useState<DocumentType>('CONTRACT')
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState<{ name: string; size: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      await uploadDocument(file, docType)
      setUploaded({ name: file.name, size: file.size })
      onUploadSuccess()
    } catch {
      setError('업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setUploading(false)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="bg-primary-lighter border-[1.5px] border-dashed border-[#b8d4ff] rounded-2xl h-50 flex flex-col items-center justify-center gap-2.5 mb-4 transition-colors hover:bg-[#eef5ff] hover:border-[#95c0ff]"
    >
      <input ref={inputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={onInputChange} />

      <div className="w-14 h-14 rounded-[14px] bg-surface border border-[#d7e8ff] grid place-items-center text-primary mb-0.5 shadow-[0_4px_10px_rgba(49,130,246,0.12)]">
        <FileTextIcon className="w-6.5 h-6.5" />
      </div>

      {uploaded ? (
        <>
          <div className="text-[15px] font-semibold text-ink flex items-center gap-1.5">
            {uploaded.name}
            <span className="w-4 h-4 rounded-full bg-success text-white inline-grid place-items-center">
              <CheckIcon className="w-2.5 h-2.5" />
            </span>
          </div>
          <div className="text-[12.5px] text-ink-mute tabular-nums">
            {(uploaded.size / 1024 / 1024).toFixed(1)} MB · 분석 시작됨
          </div>
        </>
      ) : (
        <div className="text-[14.5px] font-semibold text-ink-soft">
          {uploading ? '업로드 중…' : '파일을 드래그하거나 선택하세요'}
        </div>
      )}

      {error && <div className="text-[12px] text-danger">{error}</div>}

      <div className="flex items-center gap-2">
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value as DocumentType)}
          className="h-7.5 px-2 rounded-lg bg-surface border border-line-strong text-[12.5px] font-semibold text-ink-soft outline-none cursor-pointer hover:border-primary hover:text-primary transition-colors"
        >
          {(Object.keys(DOC_TYPE_LABELS) as DocumentType[]).map((t) => (
            <option key={t} value={t}>{DOC_TYPE_LABELS[t]}</option>
          ))}
        </select>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="h-7.5 px-3.5 rounded-lg bg-surface border border-line-strong text-[12.5px] font-semibold text-ink-soft transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {uploaded ? '다른 파일 업로드' : '파일 선택'}
        </button>
      </div>
    </div>
  )
}
