export default function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative w-10.5 h-6 rounded-full transition-colors shrink-0 ${on ? 'bg-primary' : 'bg-line-strong'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${on ? 'translate-x-4.5' : ''}`} />
    </button>
  )
}
