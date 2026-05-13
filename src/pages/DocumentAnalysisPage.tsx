import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Sidebar, { type Recent } from '../components/Sidebar'
import IconBtn from '../components/IconBtn'
import StatusBadge from '../components/document-analysis/StatusBadge'
import UploadBox from '../components/document-analysis/UploadBox'
import DocPreview from '../components/document-analysis/DocPreview'
import SummaryCard from '../components/document-analysis/SummaryCard'
import RiskStats from '../components/document-analysis/RiskStats'
import ClausesSection from '../components/document-analysis/ClausesSection'
import CertificateGeneratorPanel from '../components/document-analysis/CertificateGeneratorPanel'
import { fetchDocuments, fetchDocumentById, fetchDocumentAnalysis, deleteDocument, type Document as UploadedDoc, type DocumentAnalysis } from '../api/documents'
import { FileTextIcon, MenuIcon, MoreHorizIcon, ShareNetworkIcon } from '../components/icons'
import { formatRelativeTime } from '../utils/relativeTime'

export default function DocumentAnalysisPage() {
  const [openClauses, setOpenClauses] = useState<boolean[]>([true, false, false])
  const [panelOpen, setPanelOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [recents, setRecents] = useState<Recent[]>([])
  const [selectedDoc, setSelectedDoc] = useState<UploadedDoc | null>(null)
  const [analysisData, setAnalysisData] = useState<DocumentAnalysis | null>(null)
  const [activeRecentIndex, setActiveRecentIndex] = useState<number | undefined>(undefined)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchParams] = useSearchParams()

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

  const handleDelete = () => {
    if (!selectedDoc) return
    deleteDocument(selectedDoc.id)
      .then(() => {
        setSelectedDoc(null)
        setActiveRecentIndex(undefined)
        setMenuOpen(false)
        loadRecents()
      })
      .catch(() => {})
  }

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
              {selectedDoc && <StatusBadge ocr={selectedDoc.ocrStatus} analysis={selectedDoc.analysisStatus} />}
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
                        onClick={handleDelete}
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
              <h1 className="text-[24px] md:text-[28px] font-bold text-ink m-0 mb-1.5 tracking-tight">문서 분석</h1>
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

      <CertificateGeneratorPanel open={panelOpen} onClose={() => setPanelOpen(false)} onSuccess={loadRecents} />
    </>
  )
}
