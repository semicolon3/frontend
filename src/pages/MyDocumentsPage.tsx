import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar, { type Recent } from '../components/Sidebar'
import {
  BellIcon,
  ChevronDownIcon,
  FileTextIcon,
  GridIcon,
  MenuIcon,
  MoreHorizIcon,
  PlusIcon,
  SearchIcon,
} from '../components/icons'
import {
  fetchDocuments,
  uploadDocument,
  deleteDocument,
  type Document as UploadedDoc,
  type DocumentType,
} from '../api/documents'

type Tab = 'all' | 'CONTRACT' | 'KAKAO_CHAT' | 'OTHER'
type FileKind = 'pdf' | 'image' | 'doc' | 'text'

const TAB_LABEL: Record<Tab, string> = {
  all: '전체',
  CONTRACT: '계약서',
  KAKAO_CHAT: '카톡·캡처',
  OTHER: '합의서·기타',
}

const DOC_TAG: Record<string, string> = {
  CONTRACT: '계약서',
  KAKAO_CHAT: '카톡 캡처',
  RECEIPT: '영수증',
  OTHER: '기타',
}

const TYPE_ICON_CLASS: Record<FileKind, string> = {
  pdf: 'bg-risk-high-bg text-danger',
  image: 'bg-[#f3eeff] text-[#8b5cf6]',
  doc: 'bg-primary-soft text-primary',
  text: 'bg-bg text-ink-soft',
}

function getFileKind(mimeType: string, fileName: string): FileKind {
  const l = fileName.toLowerCase()
  if (mimeType.includes('pdf') || l.endsWith('.pdf')) return 'pdf'
  if (mimeType.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/.test(l)) return 'image'
  if (mimeType.startsWith('text/') || l.endsWith('.txt')) return 'text'
  return 'doc'
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return '방금'
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}일 전`
  const w = Math.floor(d / 7)
  if (w < 5) return `${w}주 전`
  return `${Math.floor(d / 30)}달 전`
}

function isThisWeek(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() < 7 * 24 * 60 * 60 * 1000
}

function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1={9} y1={13} x2={15} y2={13} />
      <line x1={9} y1={17} x2={13} y2={17} />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x={3} y={3} width={18} height={18} rx={2} />
      <circle cx={9} cy={9} r={2} />
      <path d="m21 15-4.5-4.5-7 7" />
    </svg>
  )
}

function UploadCloudIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1={12} y1={3} x2={12} y2={15} />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1={8} y1={6} x2={21} y2={6} />
      <line x1={8} y1={12} x2={21} y2={12} />
      <line x1={8} y1={18} x2={21} y2={18} />
      <line x1={3} y1={6} x2={3.01} y2={6} />
      <line x1={3} y1={12} x2={3.01} y2={12} />
      <line x1={3} y1={18} x2={3.01} y2={18} />
    </svg>
  )
}

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M6 12h12M10 18h4" />
    </svg>
  )
}

function FileTypeBadge({ kind }: { kind: FileKind }) {
  return (
    <div className={`w-11 h-11 rounded-xl grid place-items-center shrink-0 ${TYPE_ICON_CLASS[kind]}`}>
      {kind === 'image' ? <ImageIcon /> : <PdfIcon />}
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const u = status.toUpperCase()
  if (u === 'COMPLETED') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold bg-success-soft text-[#15803d] py-1 px-2.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-current" />분석 완료
      </span>
    )
  }
  if (u === 'FAILED') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold bg-risk-high-bg text-danger py-1 px-2.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-current" />분석 실패
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold bg-primary-soft text-primary py-1 px-2.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />AI 분석 중
    </span>
  )
}

export default function MyDocumentsPage() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [documents, setDocuments] = useState<UploadedDoc[]>([])
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [search, setSearch] = useState('')
  const [uploadType, setUploadType] = useState<DocumentType>('OTHER')
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  const [sortDesc, setSortDesc] = useState(true)

  const loadDocs = () => fetchDocuments().then(setDocuments).catch(() => {})
  useEffect(() => { loadDocs() }, [])

  const handleFiles = async (files: FileList | File[]) => {
    if (!files.length) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        await uploadDocument(file, uploadType)
      }
      await loadDocs()
    } catch {} finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setMenuOpenId(null)
    try {
      await deleteDocument(id)
      await loadDocs()
    } catch {}
  }

  const recents: Recent[] = useMemo(
    () => documents.slice(0, 5).map((d) => ({ id: d.id, title: d.originalFileName, meta: formatRelative(d.createdAt) })),
    [documents]
  )

  const filtered = useMemo(() => {
    let list = documents
    if (activeTab !== 'all') {
      list = list.filter((d) =>
        activeTab === 'OTHER' ? d.documentType === 'OTHER' || d.documentType === 'RECEIPT' : d.documentType === activeTab
      )
    }
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((d) => d.originalFileName.toLowerCase().includes(q))
    list = [...list].sort((a, b) => {
      const diff = +new Date(b.createdAt) - +new Date(a.createdAt)
      return sortDesc ? diff : -diff
    })
    return list
  }, [documents, activeTab, search, sortDesc])

  const thisWeek = filtered.filter((d) => isThisWeek(d.createdAt))
  const earlier = filtered.filter((d) => !isThisWeek(d.createdAt))

  const counts = {
    all: documents.length,
    CONTRACT: documents.filter((d) => d.documentType === 'CONTRACT').length,
    KAKAO_CHAT: documents.filter((d) => d.documentType === 'KAKAO_CHAT').length,
    OTHER: documents.filter((d) => d.documentType === 'OTHER' || d.documentType === 'RECEIPT').length,
  }
  const totalSize = documents.reduce((sum, d) => sum + d.fileSize, 0)
  const processingCount = documents.filter((d) => {
    const s = d.analysisStatus.toUpperCase()
    return s === 'PENDING' || s === 'PROCESSING'
  }).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-screen">
      <Sidebar
        active="docs"
        recents={recents}
        recentsLabel="최근 분석"
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        onRecentClick={(id) => navigate(`/docs?id=${id}`)}
      />

      <section className="flex flex-col min-w-0 min-h-screen">
        <header className="h-16 bg-surface border-b border-line flex items-center justify-between px-5 md:px-10 shrink-0">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button
              type="button"
              aria-label="메뉴"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-[10px] grid place-items-center text-ink-soft hover:bg-bg transition-colors shrink-0"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline text-[13px] text-ink-mute">
              홈 <span className="mx-1.5 text-ink-quat">›</span>
            </span>
            <h1 className="text-base font-semibold text-ink m-0">내 문서</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 w-64 lg:w-72 h-9 bg-bg border border-transparent rounded-[10px] px-3 focus-within:bg-surface focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/12 transition-all">
              <SearchIcon className="w-4 h-4 text-ink-mute shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="문서 이름, 내용으로 검색"
                className="flex-1 bg-transparent outline-none text-[13.5px] text-ink placeholder:text-ink-mute"
              />
            </div>
            <button type="button" aria-label="알림" className="w-9 h-9 rounded-[10px] grid place-items-center text-ink-soft hover:bg-bg transition-colors">
              <BellIcon className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        <div className="flex-1 px-5 md:px-10 pt-8 pb-14 w-full">
          {/* 헤더 */}
          <div className="mb-6 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-[26px] md:text-[28px] font-bold text-ink m-0 mb-1.5 tracking-tight">내 문서</h1>
              <p className="text-[14.5px] text-ink-soft m-0">업로드한 계약서·캡처를 한곳에서 관리하고, 다시 열어 위험 조항을 확인할 수 있어요.</p>
            </div>
            <div className="flex items-center gap-6">
              <Stat num={String(counts.all)} label="전체 문서" />
              <div className="w-px h-8 bg-line" />
              <Stat num={String(processingCount)} label="분석 대기" color={processingCount > 0 ? 'text-primary' : undefined} />
              <div className="w-px h-8 bg-line" />
              <Stat num={formatFileSize(totalSize)} label="사용 / 1 GB" />
            </div>
          </div>

          {/* 업로드 영역 */}
          <input ref={inputRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.docx,.hwp,.txt" className="hidden" onChange={(e) => { handleFiles(e.target.files ?? []); e.target.value = '' }} />
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
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
                onChange={(e) => setUploadType(e.target.value as DocumentType)}
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

          {/* 툴바 */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div className="inline-flex bg-surface border border-line rounded-xl p-1 gap-0.5 overflow-x-auto">
              {(Object.keys(TAB_LABEL) as Tab[]).map((tab) => {
                const active = tab === activeTab
                const count = counts[tab as keyof typeof counts]
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`h-8 px-3.5 rounded-lg text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                      active ? 'bg-primary-soft text-primary' : 'text-ink-mute hover:text-ink-soft'
                    }`}
                  >
                    {TAB_LABEL[tab]}
                    <span className={`text-[11.5px] font-bold py-px px-1.75 rounded-full tabular-nums ${active ? 'bg-primary/18 text-primary' : 'bg-bg text-ink-mute'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSortDesc((v) => !v)}
                className="h-9 px-3 rounded-[10px] bg-surface border border-line text-ink-soft text-[13px] font-medium inline-flex items-center gap-1.5 hover:border-line-strong transition-colors"
              >
                <SortIcon />
                {sortDesc ? '최신순' : '오래된순'}
                <ChevronDownIcon className="w-3 h-3 text-ink-mute" />
              </button>
              <div className="inline-flex bg-surface border border-line rounded-[10px] p-0.75 gap-0.5">
                <button type="button" aria-label="격자 보기" className="w-7.5 h-7.5 rounded-md bg-primary-soft text-primary grid place-items-center">
                  <GridIcon className="w-3.5 h-3.5" />
                </button>
                <button type="button" aria-label="목록 보기" className="w-7.5 h-7.5 rounded-md text-ink-mute grid place-items-center hover:text-ink-soft transition-colors">
                  <ListIcon />
                </button>
              </div>
            </div>
          </div>

          {/* 이번 주 */}
          {thisWeek.length > 0 && (
            <>
              <SectionTitle title="이번 주" sub="최근 7일" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {thisWeek.map((doc) => (
                  <DocCard
                    key={doc.id}
                    doc={doc}
                    menuOpen={menuOpenId === doc.id}
                    onMenuToggle={() => setMenuOpenId(menuOpenId === doc.id ? null : doc.id)}
                    onClick={() => navigate(`/docs?id=${doc.id}`)}
                    onDelete={() => handleDelete(doc.id)}
                  />
                ))}
              </div>
            </>
          )}

          {/* 이전 */}
          {earlier.length > 0 && (
            <>
              <SectionTitle title="이전" sub="7일보다 오래된 문서" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {earlier.map((doc) => (
                  <DocCard
                    key={doc.id}
                    doc={doc}
                    menuOpen={menuOpenId === doc.id}
                    onMenuToggle={() => setMenuOpenId(menuOpenId === doc.id ? null : doc.id)}
                    onClick={() => navigate(`/docs?id=${doc.id}`)}
                    onDelete={() => handleDelete(doc.id)}
                  />
                ))}
              </div>
            </>
          )}

          {/* 빈 상태 */}
          {documents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-ink-mute">아직 업로드된 문서가 없어요. 위쪽 영역으로 첫 문서를 올려보세요.</p>
            </div>
          )}

          {/* 검색 결과 없음 */}
          {documents.length > 0 && filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-ink-mute">조건에 맞는 문서가 없습니다.</p>
            </div>
          )}

          {/* 새 문서 추가 카드 (항상 표시) */}
          {documents.length > 0 && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="border-[1.5px] border-dashed border-line-strong rounded-2xl min-h-50 flex flex-col items-center justify-center gap-2 text-ink-mute hover:border-primary hover:text-primary hover:bg-primary-lighter transition-colors"
              >
                <span className="w-11 h-11 rounded-full bg-surface border border-line grid place-items-center text-ink-mute group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-colors">
                  <PlusIcon className="w-5 h-5" />
                </span>
                <span className="text-[13.5px] font-semibold">새 문서 업로드</span>
                <span className="text-[11.5px] text-ink-quat">또는 여기로 드래그</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function Stat({ num, label, color }: { num: string; label: string; color?: string }) {
  return (
    <div>
      <div className={`text-[20px] font-extrabold tabular-nums leading-[1.1] tracking-tight ${color ?? 'text-ink'}`}>{num}</div>
      <div className="text-xs text-ink-mute mt-0.5">{label}</div>
    </div>
  )
}

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mt-8 mb-3 flex items-baseline gap-2">
      <span className="text-sm font-semibold text-ink-soft">{title}</span>
      <span className="text-xs text-ink-mute font-medium">{sub}</span>
    </div>
  )
}

function DocCard({
  doc,
  menuOpen,
  onMenuToggle,
  onClick,
  onDelete,
}: {
  doc: UploadedDoc
  menuOpen: boolean
  onMenuToggle: () => void
  onClick: () => void
  onDelete: () => void
}) {
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
          <span>{formatRelative(doc.createdAt)}</span>
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

