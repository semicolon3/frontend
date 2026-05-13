import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import Sidebar, { type Recent } from '../components/Sidebar'
import { createGeneratedDocument, downloadDocumentPdf } from '../api/generatedDocuments'
import { fetchTemplates, type DocumentTemplate } from '../api/templates'
import { fetchDocuments, fetchDocumentById, fetchDocumentAnalysis, deleteDocument, uploadDocument, type DocumentType, type Document as UploadedDoc, type DocumentAnalysis, type RiskClause } from '../api/documents'
import {
  MenuIcon,
  AlertIcon,
  AlertTriangleIcon,
  BookIcon,
  CheckIcon,
  ChevronDownIcon,
  DownloadIcon,
  FileTextIcon,
  MinusIcon,
  MoreHorizIcon,
  PlusIcon,
  SearchIcon,
  ShareNetworkIcon,
  SparklesIcon,
  XIcon,
} from '../components/icons'

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '방금'
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일 전`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}주 전`
  return `${Math.floor(days / 30)}달 전`
}

export default function DocumentAnalysisPage() {
  const [openClauses, setOpenClauses] = useState<boolean[]>([true, false, false])
  const [panelOpen, setPanelOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [recents, setRecents] = useState<Recent[]>([])
  const [selectedDoc, setSelectedDoc] = useState<UploadedDoc | null>(null)
  const [analysisData, setAnalysisData] = useState<DocumentAnalysis | null>(null)
  const [activeRecentIndex, setActiveRecentIndex] = useState<number | undefined>(undefined)
  const [menuOpen, setMenuOpen] = useState(false)

  const loadRecents = () =>
    fetchDocuments()
      .then((docs) =>
        setRecents(docs.map((d) => ({ id: d.id, title: d.originalFileName, meta: formatRelativeTime(d.createdAt) })))
      )
      .catch(() => {})

  useEffect(() => {
    const t = setTimeout(() => setPanelOpen(true), 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => { loadRecents() }, [])

  const [searchParams] = useSearchParams()
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) handleRecentClick(Number(id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleRecentClick = (id: number) => {
    setAnalysisData(null)
    fetchDocumentById(id)
      .then((doc) => {
        const idx = recents.findIndex((r) => r.id === id)
        setActiveRecentIndex(idx >= 0 ? idx : undefined)
        setSelectedDoc(doc)
        return fetchDocumentAnalysis(id)
      })
      .then(setAnalysisData)
      .catch(() => {})
  }

  const toggleClause = (i: number) =>
    setOpenClauses((arr) => arr.map((v, idx) => (idx === i ? !v : v)))

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-screen">
        <Sidebar
          active="docs"
          activeRecent={activeRecentIndex}
          recents={recents}
          recentsLabel="최근 분석"
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
          onRecentClick={handleRecentClick}
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
                <a href="#" className="hover:text-ink-soft">홈</a>
                <span className="mx-1.5 text-ink-quat">›</span>
                <span>내 문서</span>
                <span className="mx-1.5 text-ink-quat">›</span>
              </span>
              <h1 className="text-base font-semibold text-ink truncate m-0">
                {selectedDoc?.originalFileName ?? '자취계약서.pdf'}
              </h1>
              {selectedDoc && (
                <StatusBadge ocr={selectedDoc.ocrStatus} analysis={selectedDoc.analysisStatus} />
              )}
            </div>
            <div className="flex items-center gap-2">
              <IconBtn label="공유">
                <ShareNetworkIcon className="w-4.5 h-4.5" />
              </IconBtn>
              <div className="relative">
                <IconBtn label="더보기" onClick={() => setMenuOpen((v) => !v)}>
                  <MoreHorizIcon className="w-4.5 h-4.5" />
                </IconBtn>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden />
                    <div className="absolute right-0 top-full mt-1 w-36 bg-surface border border-line rounded-xl shadow-popover z-20 py-1 overflow-hidden">
                      <button
                        type="button"
                        disabled={!selectedDoc}
                        onClick={() => {
                          if (!selectedDoc) return
                          deleteDocument(selectedDoc.id)
                            .then(() => {
                              setSelectedDoc(null)
                              setActiveRecentIndex(undefined)
                              setMenuOpen(false)
                              loadRecents()
                            })
                            .catch(() => {})
                        }}
                        className="w-full text-left px-3.5 py-2.5 text-[13.5px] font-medium text-danger hover:bg-risk-high-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        문서 삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 px-5 md:px-10 pt-6 md:pt-8 pb-14 w-full">
            <div className="mb-6">
              <h1 className="text-[24px] md:text-[28px] font-bold text-ink m-0 mb-1.5 tracking-tight">
                문서 분석
              </h1>
              <p className="text-[15px] text-ink-soft m-0">
                계약서나 카톡 캡처를 올리면 위험 조항을 찾고, 내용증명까지 만들어드려요.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              <div>
                <UploadBox onUploadSuccess={loadRecents} />
                <DocPreview />
              </div>
              <div>
                <SummaryCard analysis={analysisData} />
                <RiskStats riskClauses={analysisData?.riskClauses ?? null} />
                <ClausesSection
                  openClauses={openClauses}
                  toggleClause={toggleClause}
                  riskClauses={analysisData?.riskClauses ?? null}
                />
                <div className="mt-5 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPanelOpen(true)}
                    className="h-13 rounded-[14px] bg-primary text-white text-[15px] font-bold inline-flex items-center justify-center gap-2 tracking-[-0.01em] transition-colors hover:bg-primary-hover active:scale-[0.99]"
                  >
                    <FileTextIcon className="w-4.5 h-4.5" />
                    내용증명 자동 생성
                  </button>
                  <button
                    type="button"
                    className="h-12 rounded-xl bg-surface border border-line-strong text-ink-soft text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors hover:border-primary hover:text-primary"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    챗봇으로 더 질문하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onSuccess={loadRecents}
      />
    </>
  )
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: '대기',
  PROCESSING: '처리 중',
  COMPLETED: '완료',
  FAILED: '실패',
}
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-bg text-ink-mute',
  PROCESSING: 'bg-warn-soft text-warn',
  COMPLETED: 'bg-success-soft text-success',
  FAILED: 'bg-risk-high-bg text-danger',
}

function StatusBadge({ ocr, analysis }: { ocr: string; analysis: string }) {
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

function IconBtn({ label, onClick, children }: { label: string; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="w-9 h-9 rounded-[10px] grid place-items-center text-ink-soft transition-colors hover:bg-bg"
    >
      {children}
    </button>
  )
}

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  CONTRACT: '계약서',
  KAKAO_CHAT: '카카오톡',
  RECEIPT: '영수증',
  OTHER: '기타',
}

function UploadBox({ onUploadSuccess }: { onUploadSuccess: () => void }) {
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

function DocPreview() {
  return (
    <div className="bg-surface border border-line rounded-2xl shadow-card-sm overflow-hidden">
      <div className="h-11 px-3.5 flex items-center justify-between border-b border-line bg-bg">
        <span className="text-[12.5px] text-ink-soft font-medium tabular-nums">
          1 / 3 페이지
        </span>
        <div className="flex items-center gap-0.5 bg-surface border border-line rounded-lg p-0.5">
          <ZoomBtn label="축소">
            <MinusIcon className="w-3.5 h-3.5" />
          </ZoomBtn>
          <span className="text-xs font-semibold text-ink-soft px-2 tabular-nums">
            100%
          </span>
          <ZoomBtn label="확대">
            <PlusIcon className="w-3.5 h-3.5" />
          </ZoomBtn>
          <ZoomBtn label="다운로드">
            <DownloadIcon className="w-3.5 h-3.5" />
          </ZoomBtn>
        </div>
      </div>
      <div className="bg-[#eef0f3] p-5 h-180 overflow-y-auto">
        <A4Doc />
      </div>
    </div>
  )
}

function ZoomBtn({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="w-6.5 h-6.5 rounded-md text-ink-soft grid place-items-center transition-colors hover:bg-bg"
    >
      {children}
    </button>
  )
}

function A4Doc() {
  return (
    <div className="w-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] rounded text-[10.5px] leading-[1.85] text-[#1d242c] tracking-[-0.005em] py-9 px-10 aspect-210/297">
      <h4 className="text-center text-base font-extrabold tracking-[0.3em] m-0 mb-1 text-[#111]">
        주택임대차계약서
      </h4>
      <div className="text-center text-[10px] text-[#6b7480] mb-5.5">
        전세 (보증금 일시지급)
      </div>

      <div className="grid grid-cols-[60px_1fr] gap-x-3 gap-y-1 mb-3.5">
        <span className="text-[#6b7480]">임대인</span>
        <span>박상열 (서울시 송파구 송이로 123)</span>
        <span className="text-[#6b7480]">임차인</span>
        <span>홍길동 (서울시 강남구 테헤란로 456)</span>
        <span className="text-[#6b7480]">목적물</span>
        <span>서울시 강남구 역삼동 100-1 아파트 302호</span>
      </div>

      <Clause title="제1조 (목적)">
        위 부동산에 관하여 임대인과 임차인은 합의에 의하여 임차보증금 및 차임을 아래와 같이 지불하기로 한다.
      </Clause>

      <Clause title="제2조 (임대료 지급)">
        보증금 일금 오천만원정 (₩50,000,000)은 계약일에 지불한다. 차임은 없다.
      </Clause>

      <Clause title="제3조 (계약기간)">
        2024년 3월 1일부터 2026년 2월 28일까지 24개월로 한다.
      </Clause>

      <Clause title="제4조 (사용·수익)">
        임대인은 목적물을 임차인이 사용·수익할 수 있는 상태로 인도하고 임대차 기간 중 이를 유지하여야 한다.
      </Clause>

      <Clause
        title={<><Pin tone="red">!</Pin>제5조 (보증금 반환)</>}
        body={
          <span className="bg-risk-high-bg shadow-[inset_0_-1px_0_#fca5a5] py-px px-0.5 rounded-sm">
            보증금 반환 시기는 임대인이 임의로 결정한다. 임차인은 이에 이의를 제기할 수 없다.
          </span>
        }
      />

      <Clause title="제6조 (관리비)">
        매월 관리비는 임차인이 부담하며, 매월 25일까지 지정 계좌로 송금한다.
      </Clause>

      <Clause title="제7조 (수선 의무)">
        통상의 수선은 임차인이 부담하고, 대수선은 임대인이 부담한다.
      </Clause>

      <Clause
        title={<><Pin tone="yellow">!</Pin>제8조 (원상복구)</>}
        body={
          <span className="bg-risk-mid-bg shadow-[inset_0_-1px_0_#fcd34d] py-px px-0.5 rounded-sm">
            계약 종료 시 임차인은 일체의 원상복구 비용을 부담하며, 그 범위는 임대인이 정한다.
          </span>
        }
      />
    </div>
  )
}

function Clause({
  title,
  children,
  body,
}: {
  title: ReactNode
  children?: ReactNode
  body?: ReactNode
}) {
  return (
    <div className="mb-3">
      <div className="font-bold mb-0.5 text-[#1d242c]">{title}</div>
      <div className="text-[#2b3441]">{body ?? children}</div>
    </div>
  )
}

function Pin({ tone, children }: { tone: 'red' | 'yellow'; children: ReactNode }) {
  const bg = tone === 'red' ? 'bg-danger' : 'bg-risk-mid'
  return (
    <span
      className={`inline-block w-3.5 h-3.5 rounded-full text-white text-[9px] font-bold text-center leading-3.5 mr-1 -translate-y-px ${bg}`}
    >
      {children}
    </span>
  )
}

function SummaryCard({ analysis }: { analysis: DocumentAnalysis | null }) {
  const isPending = !analysis || analysis.analysisStatus === 'PENDING' || analysis.analysisStatus === 'PROCESSING'
  const entities = analysis?.entities ? Object.entries(analysis.entities).slice(0, 3) : null

  return (
    <div className="bg-linear-to-br from-primary-lighter to-primary-soft border border-[#d7e8ff] rounded-2xl p-5 mb-4">
      <div className="flex items-center gap-2 mb-2.5">
        <h3 className="text-base font-bold text-ink m-0 tracking-[-0.015em]">분석 요약</h3>
        {analysis && analysis.analysisStatus !== 'COMPLETED' && (
          <span className="text-[11px] font-semibold text-warn bg-warn-soft py-0.5 px-2 rounded-full">
            {STATUS_LABEL[analysis.analysisStatus] ?? analysis.analysisStatus}
          </span>
        )}
        <span className="ml-auto inline-flex items-center gap-1 bg-primary/10 text-primary text-[11px] font-semibold py-0.5 px-2 rounded-full">
          <SparklesIcon className="w-2.5 h-2.5" />
          AI
        </span>
      </div>
      <p className="m-0 mb-3.5 text-sm leading-[1.6] text-ink-soft">
        {isPending
          ? <span className="text-ink-mute">분석 결과를 불러오는 중…</span>
          : analysis?.summary ?? '요약 정보가 없습니다.'}
      </p>
      {entities && entities.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {entities.map(([k, v]) => (
            <KeyTag key={k} k={k} v={v[0] ?? '-'} />
          ))}
        </div>
      )}
    </div>
  )
}

function KeyTag({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-white/70 border border-primary/12 rounded-[10px] py-2 px-2.5">
      <div className="text-[11px] text-ink-mute mb-0.5">{k}</div>
      <div className="text-[13.5px] font-bold text-ink tabular-nums">{v}</div>
    </div>
  )
}

function severityToTone(s: string): 'high' | 'mid' | 'low' {
  const u = s.toUpperCase()
  if (u.includes('HIGH') || u === 'DANGER' || u === 'CRITICAL') return 'high'
  if (u.includes('MED') || u.includes('MID') || u === 'WARN' || u === 'WARNING') return 'mid'
  return 'low'
}

function RiskStats({ riskClauses }: { riskClauses: RiskClause[] | null }) {
  const high = riskClauses?.filter((c) => severityToTone(c.severity) === 'high').length ?? 0
  const mid  = riskClauses?.filter((c) => severityToTone(c.severity) === 'mid').length  ?? 0
  const low  = riskClauses?.filter((c) => severityToTone(c.severity) === 'low').length  ?? 0
  return (
    <div className="grid grid-cols-3 gap-2.5 mb-4">
      <StatCard tone="high" num={high} label="위험" />
      <StatCard tone="mid"  num={mid}  label="주의" />
      <StatCard tone="low"  num={low}  label="일반" />
    </div>
  )
}

function StatCard({
  tone,
  num,
  label,
}: {
  tone: 'high' | 'mid' | 'low'
  num: number
  label: string
}) {
  const iconWrap =
    tone === 'high'
      ? 'bg-risk-high-bg text-danger'
      : tone === 'mid'
      ? 'bg-risk-mid-bg text-risk-mid'
      : 'bg-success-soft text-success'
  return (
    <div className="bg-surface border border-line rounded-[14px] py-3.5 px-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-[10px] grid place-items-center shrink-0 ${iconWrap}`}>
        {tone === 'high' ? (
          <AlertTriangleIcon className="w-4 h-4" />
        ) : tone === 'mid' ? (
          <AlertIcon className="w-4 h-4" />
        ) : (
          <CheckIcon className="w-4 h-4" />
        )}
      </div>
      <div>
        <div className="text-[22px] font-extrabold text-ink tracking-[-0.02em] tabular-nums leading-none">
          {num}
        </div>
        <div className="text-xs text-ink-mute mt-0.5 font-medium">{label}</div>
      </div>
    </div>
  )
}

function ClausesSection({
  openClauses,
  toggleClause,
  riskClauses,
}: {
  openClauses: boolean[]
  toggleClause: (i: number) => void
  riskClauses: RiskClause[] | null
}) {
  const [dynamicOpen, setDynamicOpen] = useState<boolean[]>([])

  useEffect(() => {
    if (riskClauses) setDynamicOpen(riskClauses.map((_, i) => i === 0))
  }, [riskClauses])

  const header = (
    <div className="flex items-baseline justify-between mt-1 mb-2.5">
      <h3 className="text-base font-bold text-ink m-0 tracking-[-0.015em]">조항별 분석</h3>
      <button type="button" className="text-[12.5px] text-ink-mute inline-flex items-center gap-1 hover:text-ink-soft">
        위험도 순<ChevronDownIcon className="w-3 h-3" />
      </button>
    </div>
  )

  if (riskClauses) {
    return (
      <>
        {header}
        {riskClauses.length === 0 && (
          <p className="text-sm text-ink-mute text-center py-6">위험 조항이 발견되지 않았습니다.</p>
        )}
        {riskClauses.map((c, i) => (
          <ClauseCard
            key={i}
            tone={severityToTone(c.severity)}
            title={c.clauseTitle}
            open={dynamicOpen[i] ?? false}
            onToggle={() => setDynamicOpen((a) => a.map((v, idx) => idx === i ? !v : v))}
            quote={`"${c.description}"`}
            reason={<>{c.description}</>}
          />
        ))}
      </>
    )
  }

  return (
    <>
      {header}
      <ClauseCard
        tone="high" title="제5조 · 보증금 반환 시기"
        open={openClauses[0]} onToggle={() => toggleClause(0)}
        quote='"보증금 반환 시기는 임대인이 임의로 결정한다. 임차인은 이에 이의를 제기할 수 없다."'
        reason={<><strong>주택임대차보호법 위반 소지가 있어요.</strong> 반환 시기를 일방적으로 정할 수 없습니다.</>}
        laws={['주택임대차보호법 제3조의2', '대법원 2019다252178']}
        suggestion='"임대인은 계약 종료일로부터 7일 이내에 보증금을 반환한다."'
      />
      <ClauseCard
        tone="mid" title="제8조 · 원상복구 비용 범위"
        open={openClauses[1]} onToggle={() => toggleClause(1)}
        quote='"계약 종료 시 임차인은 일체의 원상복구 비용을 부담하며, 그 범위는 임대인이 정한다."'
        reason={<><strong>통상적 사용으로 인한 마모는 임차인 부담이 아닙니다.</strong></>}
      />
      <ClauseCard
        tone="low" title="제2조 · 임대료 지급"
        open={openClauses[2]} onToggle={() => toggleClause(2)}
        quote='"보증금 일금 오천만원정(₩50,000,000)은 계약일에 지불한다."'
        reason={<>표준 임대차계약서 양식에 부합합니다.</>}
      />
    </>
  )
}

type ClauseTone = 'high' | 'mid' | 'low'

function ClauseCard({
  tone,
  title,
  open,
  onToggle,
  quote,
  reason,
  laws,
  suggestion,
}: {
  tone: ClauseTone
  title: string
  open: boolean
  onToggle: () => void
  quote: string
  reason: ReactNode
  laws?: string[]
  suggestion?: string
}) {
  const badge =
    tone === 'high'
      ? 'bg-risk-high-bg text-danger'
      : tone === 'mid'
      ? 'bg-risk-mid-bg text-[#b45309]'
      : 'bg-success-soft text-[#15803d]'
  const badgeLabel = tone === 'high' ? '위험' : tone === 'mid' ? '주의' : '일반'
  const cardBorder =
    open && tone === 'high'
      ? 'border-[#fca5a5] shadow-card-md'
      : open
      ? 'border-line shadow-card-md'
      : 'border-line'
  const reasonIco =
    tone === 'high'
      ? 'bg-risk-high-bg text-danger'
      : tone === 'mid'
      ? 'bg-risk-mid-bg text-risk-mid'
      : 'bg-success-soft text-success'
  return (
    <div
      className={`bg-surface border rounded-[14px] mb-2.5 transition-[box-shadow,border-color] hover:shadow-card-md ${cardBorder}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-3.5 px-4 flex items-center gap-2.5 select-none text-left"
      >
        <span
          className={`inline-flex items-center gap-1 text-[11.5px] font-bold py-1 px-2 rounded-full shrink-0 ${badge}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {badgeLabel}
        </span>
        <span className="flex-1 text-[14.5px] font-semibold text-ink tracking-[-0.01em]">
          {title}
        </span>
        <span
          className={`text-ink-mute transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <div className="bg-bg border-l-[3px] border-line-strong rounded-lg py-3 px-3.5 text-[13px] text-ink-soft leading-[1.6] mb-3">
            <div className="text-[11px] font-semibold text-ink-mute mb-1 tracking-[0.02em]">
              원문
            </div>
            {quote}
          </div>

          <div className="flex gap-2 mb-3">
            <span
              className={`w-4.5 h-4.5 rounded-full grid place-items-center shrink-0 mt-px ${reasonIco}`}
            >
              {tone === 'low' ? (
                <CheckIcon className="w-2.5 h-2.5" />
              ) : (
                <AlertIcon className="w-2.5 h-2.5" />
              )}
            </span>
            <div className="text-[13px] text-ink-soft leading-[1.55] [&_strong]:text-ink [&_strong]:font-bold">
              {reason}
            </div>
          </div>

          {laws && laws.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {laws.map((law) => (
                <LawTag key={law}>{law}</LawTag>
              ))}
            </div>
          )}

          {suggestion && (
            <div className="bg-primary-soft rounded-xl py-3 px-3.5">
              <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-primary mb-1.5 tracking-[0.01em]">
                <SparklesIcon className="w-3 h-3" />
                AI 수정 제안
              </div>
              <div className="text-[13px] text-[#1b3f7a] leading-[1.55] font-medium">
                {suggestion}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LawTag({ children }: { children: ReactNode }) {
  const text = String(children)
  const isCase = text.includes('대법원') || text.includes('판결')
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 bg-surface border border-line rounded-full py-1 px-2.5 text-[11.5px] font-medium text-ink-soft cursor-pointer transition-colors hover:border-primary hover:text-primary [&_.ico]:text-ink-mute [&:hover_.ico]:text-primary"
    >
      <span className="ico inline-flex transition-colors">
        {isCase ? <SearchIcon className="w-2.75 h-2.75" /> : <BookIcon className="w-2.75 h-2.75" />}
      </span>
      {children}
    </button>
  )
}

function SlidePanel({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(1)
  const [sender, setSender] = useState('홍길동 / 서울시 강남구 테헤란로 456')
  const [recipient, setRecipient] = useState('박상열 / 서울시 송파구 송이로 123')
  const [amount, setAmount] = useState('₩50,000,000')
  const [deadline, setDeadline] = useState('7일 이내')
  const [reason, setReason] = useState(
    '본인은 귀하와 2024년 3월 1일에 임대차계약을 체결하고, 보증금 5천만원을 지급하였습니다. 계약기간 만료일인 2026년 2월 28일까지 계약상 의무를 성실히 이행하였음에도 귀하께서 보증금 반환을 지연하고 계신바, 본 내용증명 도달로부터 7일 이내에 보증금 5천만원 전액을 반환해 주실 것을 요청드립니다.'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    fetchTemplates()
      .then((list) => {
        setTemplates(list)
        if (list.length > 0) setSelectedTemplateId(list[0].id)
      })
      .catch(() => {})
  }, [open])

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const doc = await createGeneratedDocument({
        templateId: selectedTemplateId,
        title: `내용증명 · ${sender.split('/')[0].trim()}`,
        fields: { sender, recipient, amount, deadline, reason },
      })
      const blob = await downloadDocumentPdf(doc.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${doc.title}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      onSuccess()
      onClose()
    } catch {
      setError('저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 bg-[rgba(20,30,50,0.32)] transition-opacity duration-300 z-40 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <aside
        aria-hidden={!open}
        className={`fixed top-0 right-0 w-full sm:w-120 h-screen bg-surface shadow-panel z-50 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0.24,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="py-5.5 px-6 pb-4 border-b border-line flex items-center justify-between shrink-0">
          <div>
            <h2 className="m-0 text-[19px] font-bold text-ink tracking-[-0.02em]">
              내용증명 자동 생성
            </h2>
            <div className="text-[12.5px] text-ink-mute mt-0.5">
              제5조 위험 조항 기반 · AI가 자동 작성했어요
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="w-9 h-9 rounded-[10px] text-ink-soft grid place-items-center transition-colors hover:bg-bg hover:text-ink"
          >
            <XIcon className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5 px-6">
          <div className="flex gap-2 bg-primary-soft rounded-xl py-2.5 px-3 mb-4.5">
            <span className="text-primary shrink-0 mt-px">
              <SparklesIcon className="w-3.5 h-3.5" />
            </span>
            <div className="text-[12.5px] text-[#1b3f7a] leading-normal">
              <strong className="font-bold">AI가 계약서를 분석해 자동 채웠어요.</strong> 내용을 확인하고 필요한 부분만 수정해주세요.
            </div>
          </div>

          {templates.length > 0 && (
            <FormRow label="문서 템플릿">
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
                className="w-full border border-line rounded-[10px] py-2.5 px-3 text-[13.5px] text-ink bg-surface outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/12 transition-all"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}{t.description ? ` — ${t.description}` : ''}
                  </option>
                ))}
              </select>
            </FormRow>
          )}

          <FormRow label="발신인" aiTag="자동 채움">
            <PanelInput value={sender} onChange={setSender} />
          </FormRow>

          <FormRow label="수신인" aiTag="자동 채움">
            <PanelInput value={recipient} onChange={setRecipient} />
          </FormRow>

          <div className="mb-3.5 grid grid-cols-2 gap-2.5">
            <FormRow label="청구 금액">
              <PanelInput value={amount} onChange={setAmount} amount />
            </FormRow>
            <FormRow label="요청 기한">
              <PanelInput value={deadline} onChange={setDeadline} />
            </FormRow>
          </div>

          <FormRow label="청구 사유" aiTag="AI 작성">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-line rounded-[10px] py-2.5 px-3 text-[13.5px] text-ink bg-surface transition-all leading-normal outline-none min-h-28 resize-y focus:border-primary focus:ring-[3px] focus:ring-primary/12"
            />
            <div className="text-[11.5px] text-ink-mute mt-1">
              주택임대차보호법 제3조의2에 근거하여 작성됨
            </div>
          </FormRow>

          <div className="mt-5.5 pt-5.5 border-t border-dashed border-line">
            <div className="flex items-baseline justify-between mb-2.5">
              <h4 className="m-0 text-[13px] font-bold text-ink">문서 미리보기</h4>
              <span className="text-[11px] text-ink-mute">A4 · 1페이지</span>
            </div>
            <CertDoc />
          </div>
        </div>

        <div className="py-4 px-6 pb-5 border-t border-line flex flex-col gap-2 bg-surface shrink-0">
          {error && (
            <p className="text-[12.5px] text-danger text-center m-0">{error}</p>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-xl bg-surface border border-line-strong text-ink-soft text-sm font-semibold inline-flex items-center justify-center transition-colors hover:border-primary hover:text-primary"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="h-12 rounded-[14px] bg-primary text-white text-[14.5px] font-bold inline-flex items-center justify-center gap-1.5 transition-colors hover:bg-primary-hover active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <DownloadIcon className="w-4 h-4" />
              {loading ? '저장 중…' : 'PDF 다운로드'}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

function FormRow({
  label,
  aiTag,
  children,
}: {
  label: string
  aiTag?: string
  children: ReactNode
}) {
  return (
    <div className="mb-3.5">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[12.5px] font-semibold text-ink-soft">{label}</label>
        {aiTag && (
          <span className="text-[10.5px] font-semibold text-primary bg-primary-soft py-0.5 px-1.5 rounded-full inline-flex items-center gap-0.5">
            <SparklesIcon className="w-2.5 h-2.5" />
            {aiTag}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function PanelInput({
  value,
  onChange,
  amount,
}: {
  value: string
  onChange: (v: string) => void
  amount?: boolean
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border border-line rounded-[10px] py-2.5 px-3 text-[13.5px] bg-surface transition-all leading-normal outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/12 ${
        amount ? 'tabular-nums font-bold text-primary' : 'text-ink'
      }`}
    />
  )
}

function CertDoc() {
  return (
    <div className="bg-white border border-line rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.06)] aspect-210/297 py-6 px-6.5 font-['Nanum_Myeongjo',serif] text-[#111] text-[9px] leading-[1.7] overflow-hidden relative">
      <h3 className="text-center m-0 mb-1 text-lg font-extrabold tracking-[0.5em] pl-2 text-[#111]">
        내 용 증 명
      </h3>
      <div className="text-right text-[#555] text-[7.5px] m-0 mb-3.5 font-['Pretendard_Variable',sans-serif] font-medium">
        발송일자: 2026. 03. 02.
      </div>

      <div className="my-2 text-[8px]">
        <b className="inline-block w-9.5 text-[#444]">수 신</b>박상열 귀하 (서울시 송파구 송이로 123)
      </div>
      <div className="my-2 text-[8px]">
        <b className="inline-block w-9.5 text-[#444]">발 신</b>홍길동 (서울시 강남구 테헤란로 456)
      </div>

      <div className="text-center font-bold my-3.5 mb-3 text-[11px] underline underline-offset-4">
        제 목 : 임대차보증금 반환 청구의 건
      </div>

      <div>
        <p className="m-0 mb-1.5 text-justify text-[#1a1a1a] indent-[0.6em]">
          귀댁의 안녕과 번영을 기원합니다.
        </p>
        <p className="m-0 mb-1.5 text-justify text-[#1a1a1a] indent-[0.6em]">
          본인은 귀하와 2024. 3. 1.에 별첨 임대차계약을 체결하고, 보증금 일금 오천만원(₩50,000,000)을 지급한 임차인입니다.
        </p>
        <p className="m-0 mb-1.5 text-justify text-[#1a1a1a] indent-[0.6em]">
          계약기간 만료일인 2026. 2. 28.까지 계약상 의무를 성실히 이행하였음에도, 귀하께서 보증금 반환을 지연하고 계시므로 다음과 같이 청구합니다.
        </p>
        <p className="m-0 mb-1.5 text-justify text-[#1a1a1a] indent-[0.6em]">
          <b>본 내용증명 도달로부터 7일 이내</b>에 임대차보증금 일금 오천만원 전액을 반환하여 주시기 바랍니다.
        </p>
        <p className="m-0 mb-1.5 text-justify text-[#1a1a1a] indent-[0.6em]">
          위 기한 내 이행하지 아니할 경우, 부득이 법적 절차를 진행할 수밖에 없음을 알려드립니다.
        </p>
      </div>

      <div className="mt-3.5 text-right text-[8px]">
        2026. 3. 2.
        <br />
        발신인 홍 길 동
        <span className="inline-block w-7 h-7 border-[1.5px] border-danger rounded-full text-danger text-center leading-6.5 text-[9px] font-extrabold ml-1 rotate-[-8deg]">
          印
        </span>
      </div>
    </div>
  )
}
