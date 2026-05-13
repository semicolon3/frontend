import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar, { type Recent } from '../components/Sidebar'
import { BellIcon, ChevronDownIcon, GridIcon, MenuIcon, PlusIcon, SearchIcon } from '../components/icons'
import { fetchDocuments, uploadDocument, deleteDocument, type Document as UploadedDoc, type DocumentType } from '../api/documents'
import { formatRelativeTime } from '../utils/relativeTime'
import { TAB_LABEL, formatFileSize, isThisWeek, type Tab } from '../components/my-documents/constants'
import { ListIcon, SortIcon } from '../components/my-documents/icons'
import DocCard from '../components/my-documents/DocCard'
import UploadDropzone from '../components/my-documents/UploadDropzone'

export default function MyDocumentsPage() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [documents, setDocuments] = useState<UploadedDoc[]>([])
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [search, setSearch] = useState('')
  const [uploadType, setUploadType] = useState<DocumentType>('OTHER')
  const [uploading, setUploading] = useState(false)
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
    () => documents.slice(0, 5).map((d) => ({ id: d.id, title: d.originalFileName, meta: formatRelativeTime(d.createdAt) })),
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

  const renderDocs = (docs: UploadedDoc[]) =>
    docs.map((doc) => (
      <DocCard
        key={doc.id}
        doc={doc}
        menuOpen={menuOpenId === doc.id}
        onMenuToggle={() => setMenuOpenId(menuOpenId === doc.id ? null : doc.id)}
        onClick={() => navigate(`/docs?id=${doc.id}`)}
        onDelete={() => handleDelete(doc.id)}
      />
    ))

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

          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.docx,.hwp,.txt"
            className="hidden"
            onChange={(e) => { handleFiles(e.target.files ?? []); e.target.value = '' }}
          />
          <UploadDropzone
            inputRef={inputRef}
            uploadType={uploadType}
            onUploadTypeChange={setUploadType}
            uploading={uploading}
            onDrop={handleFiles}
          />

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

          {thisWeek.length > 0 && (
            <>
              <SectionTitle title="이번 주" sub="최근 7일" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{renderDocs(thisWeek)}</div>
            </>
          )}

          {earlier.length > 0 && (
            <>
              <SectionTitle title="이전" sub="7일보다 오래된 문서" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{renderDocs(earlier)}</div>
            </>
          )}

          {documents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-ink-mute">아직 업로드된 문서가 없어요. 위쪽 영역으로 첫 문서를 올려보세요.</p>
            </div>
          )}

          {documents.length > 0 && filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-ink-mute">조건에 맞는 문서가 없습니다.</p>
            </div>
          )}

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
