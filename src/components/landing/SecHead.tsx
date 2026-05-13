export default function SecHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="text-center mb-10 md:mb-14">
      <h2 className="text-[28px] md:text-[34px] lg:text-[40px] font-extrabold text-ink tracking-[-0.03em] m-0 mb-3 md:mb-3.5 leading-tight">
        {title}
      </h2>
      <p className="text-base md:text-lg text-ink-soft m-0 leading-normal font-medium">{sub}</p>
    </div>
  )
}
