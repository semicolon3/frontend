import { useState, type RefObject } from 'react'
import type { DocumentType } from '../../api/documents'
import { FileTextIcon } from '../icons'
import { UploadCloudIcon } from './icons'

type Props = {
  inputRef: RefObject<HTMLInputElement | null>
  uploadType: DocumentType
  onUploadTypeChange: (t: DocumentType) => void
  uploading: boolean
  onDrop: (files: FileList) => void
}

export default function UploadDropzone({ inputRef, uploadType, onUploadTypeChange, uploading, onDrop }: Props) {
  const [dragging, setDragging] = useState(false)

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); onDrop(e.dataTransfer.files) }}
      onClick={() => inputRef.current?.click()}
      className={`rounded-2xl p-7 md:p-9 flex flex-col md:flex-row items-center gap-6 mb-7 cursor-pointer transition-colors border-[1.5px] border-dashed ${
        dragging
          ? 'bg-[#dceaff] border-primary border-solid'
          : 'bg-primary-lighter border-[#b8d4ff] hover:bg-[#eef5ff] hover:border-[#95c0ff]'
      }`}
    >
      <div className="w-18 h-18 rounded-2xl bg-surface border border-[#d7e8ff] grid place-items-center text-primary shadow-[0_4px_14px_rgba(49,130,246,0.14)] shrink-0">
        <UploadCloudIcon />
      </div>
      <div className="flex-1 min-w-0 text-center md:text-left">
        <h3 className="m-0 mb-1 text-lg font-bold text-ink tracking-tight">여기로 문서를 끌어다 놓으세요</h3>
        <p className="m-0 text-[13.5px] text-ink-soft">계약서, 카톡 대화 캡처, 합의서 등을 올리면 AI가 위험 조항을 찾아드려요.</p>
        <div className="flex flex-wrap gap-1.5 mt-2 justify-center md:justify-start">
          {['PDF', '이미지 (JPG·PNG)', '문서 (DOCX·HWP)', '텍스트'].map((t) => (
            <span key={t} className="inline-flex items-center gap-1 bg-white/75 border border-primary/15 text-ink-soft text-[11.5px] font-medium py-0.75 px-2 rounded-full">
              <span className="w-1 h-1 rounded-full bg-primary" />
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        <select
          value={uploadType}
          onChange={(e) => onUploadTypeChange(e.target.value as DocumentType)}
          className="h-9 px-2.5 rounded-[10px] bg-surface border border-line-strong text-[12.5px] font-semibold text-ink-soft outline-none cursor-pointer hover:border-primary hover:text-primary transition-colors"
        >
          <option value="OTHER">기타</option>
          <option value="CONTRACT">계약서</option>
          <option value="KAKAO_CHAT">카톡 캡처</option>
          <option value="RECEIPT">영수증</option>
        </select>
        <button
          type="button"
          disabled={uploading}
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
          className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FileTextIcon className="w-4 h-4" />
          {uploading ? '업로드 중…' : '파일 선택'}
        </button>
      </div>
    </div>
  )
}
