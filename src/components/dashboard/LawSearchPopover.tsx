import { useState } from 'react'
import { searchLaw, fetchLawDetail, type LawItem, type LawSearchResult } from '../../api/law'
import { SearchIcon } from '../icons'

function formatDate(d: string) {
  if (d.length !== 8) return d
  return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}`
}

function LawListItem({ item, onSelect }: { item: LawItem; onSelect: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.법령ID)}
      className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-bg transition-colors group"
    >
      <p className="text-[13.5px] font-semibold text-ink leading-snug mb-0.5 group-hover:text-primary transition-colors">
        {item.법령명한글}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11.5px] bg-primary-soft text-primary font-medium px-1.5 py-0.5 rounded-md">
          {item.법령구분명}
        </span>
        <span className="text-[11.5px] text-ink-mute">{item.소관부처명}</span>
        <span className="text-[11.5px] text-ink-quat ml-auto">시행 {formatDate(item.시행일자)}</span>
      </div>
    </button>
  )
}

export default function LawSearchPopover() {
  const [searchInput, setSearchInput] = useState('')
  const [result, setResult] = useState<LawSearchResult | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedLawId, setSelectedLawId] = useState<string | null>(null)
  const [detailText, setDetailText] = useState<string | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const handleSearch = async (q: string) => {
    if (!q.trim()) return
    setSearchLoading(true)
    setSearchOpen(true)
    setResult(null)
    setSelectedLawId(null)
    setDetailText(null)
    try {
      const data = await searchLaw(q.trim())
      setResult(data)
    } catch {
      setResult({ items: [], totalCnt: 0, keyword: q })
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSelect = async (lawId: string) => {
    setSelectedLawId(lawId)
    setDetailText(null)
    setDetailLoading(true)
    try {
      const text = await fetchLawDetail(lawId)
      setDetailText(text)
    } catch {
      setDetailText('상세 정보를 불러오지 못했습니다.')
    } finally {
      setDetailLoading(false)
    }
  }

  const handleBack = () => {
    setSelectedLawId(null)
    setDetailText(null)
  }

  const selectedItem = result?.items.find((i) => i.법령ID === selectedLawId)

  return (
    <div className="relative hidden md:block">
      <div className="flex w-64 lg:w-80 h-10 bg-bg border border-transparent rounded-xl items-center gap-2 px-3.5 text-ink-mute text-[13.5px] transition-colors focus-within:bg-surface focus-within:border-line hover:bg-bg-soft-2">
        <SearchIcon className="w-4 h-4 shrink-0" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch(searchInput)
            if (e.key === 'Escape') setSearchOpen(false)
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="법령·판례 검색"
          className="flex-1 bg-transparent outline-none text-ink placeholder:text-ink-mute"
        />
        {searchLoading && (
          <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
        )}
      </div>

      {searchOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setSearchOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full mt-2 w-105 bg-surface border border-line rounded-2xl shadow-popover z-20 overflow-hidden flex flex-col">

            {/* 목록 뷰 */}
            {!selectedLawId && (
              <div className="max-h-80 overflow-y-auto">
                {searchLoading ? (
                  <p className="text-sm text-ink-mute text-center py-8">검색 중…</p>
                ) : result === null ? (
                  <p className="text-sm text-ink-mute text-center py-8">검색어를 입력하고 Enter를 누르세요</p>
                ) : result.items.length === 0 ? (
                  <p className="text-sm text-ink-mute text-center py-8">검색 결과가 없습니다</p>
                ) : (
                  <div className="p-2">
                    <p className="text-[11.5px] text-ink-mute px-3 py-1.5">
                      <span className="font-semibold text-ink">"{result.keyword}"</span> 검색 결과 {result.totalCnt.toLocaleString()}건
                    </p>
                    {result.items.map((item) => (
                      <LawListItem key={item.id} item={item} onSelect={handleSelect} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 상세 뷰 */}
            {selectedLawId && (
              <div className="flex flex-col max-h-96">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-line shrink-0">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-[12px] text-ink-mute hover:text-ink transition-colors"
                  >
                    ← 목록
                  </button>
                  {selectedItem && (
                    <p className="text-[13px] font-semibold text-ink truncate">{selectedItem.법령명한글}</p>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {detailLoading ? (
                    <p className="text-sm text-ink-mute text-center py-6">불러오는 중…</p>
                  ) : detailText !== null ? (
                    <p className="text-[13px] text-ink leading-[1.7] whitespace-pre-wrap m-0">{detailText}</p>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
