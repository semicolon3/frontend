import { useEffect, useState, type ReactNode } from 'react'
import { createGeneratedDocument, downloadDocumentPdf } from '../../api/generatedDocuments'
import { fetchTemplates, type DocumentTemplate } from '../../api/templates'
import { DownloadIcon, SparklesIcon, XIcon } from '../icons'

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CertificateGeneratorPanel({ open, onClose, onSuccess }: Props) {
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
            <h2 className="m-0 text-[19px] font-bold text-ink tracking-[-0.02em]">내용증명 자동 생성</h2>
            <div className="text-[12.5px] text-ink-mute mt-0.5">제5조 위험 조항 기반 · AI가 자동 작성했어요</div>
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
            <div className="text-[11.5px] text-ink-mute mt-1">주택임대차보호법 제3조의2에 근거하여 작성됨</div>
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
          {error && <p className="text-[12.5px] text-danger text-center m-0">{error}</p>}
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

function FormRow({ label, aiTag, children }: { label: string; aiTag?: string; children: ReactNode }) {
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

function PanelInput({ value, onChange, amount }: { value: string; onChange: (v: string) => void; amount?: boolean }) {
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
      <h3 className="text-center m-0 mb-1 text-lg font-extrabold tracking-[0.5em] pl-2 text-[#111]">내 용 증 명</h3>
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
        <p className="m-0 mb-1.5 text-justify text-[#1a1a1a] indent-[0.6em]">귀댁의 안녕과 번영을 기원합니다.</p>
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
