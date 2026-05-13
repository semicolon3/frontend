export default function StatusPill({ status }: { status: string }) {
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
