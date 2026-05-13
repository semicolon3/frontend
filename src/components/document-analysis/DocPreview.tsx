import type { ReactNode } from 'react'
import { DownloadIcon, MinusIcon, PlusIcon } from '../icons'

export default function DocPreview() {
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
          <span className="text-xs font-semibold text-ink-soft px-2 tabular-nums">100%</span>
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

function Clause({ title, children, body }: { title: ReactNode; children?: ReactNode; body?: ReactNode }) {
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
    <span className={`inline-block w-3.5 h-3.5 rounded-full text-white text-[9px] font-bold text-center leading-3.5 mr-1 -translate-y-px ${bg}`}>
      {children}
    </span>
  )
}
