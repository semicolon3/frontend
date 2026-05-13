import { useState } from 'react'
import { searchLaw, fetchLawDetail } from '../../api/law'
import { SearchIcon } from '../icons'

export default function LawSearchPopover() {
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState<string | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [lawIdInput, setLawIdInput] = useState('')
  const [detailResult, setDetailResult] = useState<string | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const handleSearch = async (q: string) => {
    if (!q.trim()) return
    setSearchLoading(true)
    setSearchOpen(true)
    setSearchResult(null)
    setDetailResult(null)
    try {
      const result = await searchLaw(q.trim())
      setSearchResult(result)
    } catch {
      setSearchResult('검색에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSearchLoading(false)
    }
  }

  const handleLawDetail = async (id: string) => {
    if (!id.trim()) return
    setDetailLoading(true)
    setDetailResult(null)
    try {
      const result = await fetchLawDetail(id.trim())
      setDetailResult(result)
    } catch {
      setDetailResult('조회에 실패했습니다. 법령 ID를 확인해주세요.')
    } finally {
      setDetailLoading(false)
    }
  }

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
          <div className="absolute right-0 top-full mt-2 w-96 bg-surface border border-line rounded-2xl shadow-popover z-20 overflow-hidden">
            <div className="max-h-60 overflow-y-auto p-4">
              {searchLoading ? (
                <p className="text-sm text-ink-mute text-center py-4">검색 중…</p>
              ) : searchResult !== null ? (
                <p className="text-[13.5px] text-ink leading-[1.65] whitespace-pre-wrap m-0">{searchResult}</p>
              ) : null}
            </div>

            <div className="border-t border-line p-3">
              <p className="text-[11px] font-semibold text-ink-mute mb-2 tracking-[0.02em]">법령 ID로 상세 조회</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lawIdInput}
                  onChange={(e) => setLawIdInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLawDetail(lawIdInput)}
                  placeholder="법령 ID 입력"
                  className="flex-1 h-8 px-2.5 text-[13px] text-ink bg-bg border border-line rounded-lg outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => handleLawDetail(lawIdInput)}
                  disabled={detailLoading || !lawIdInput.trim()}
                  className="h-8 px-3 text-[12.5px] font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors shrink-0"
                >
                  {detailLoading ? '…' : '조회'}
                </button>
              </div>
              {detailResult !== null && (
                <div className="mt-2.5 max-h-40 overflow-y-auto text-[13px] text-ink leading-[1.65] whitespace-pre-wrap bg-bg rounded-lg p-2.5">
                  {detailResult}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
