export function PageHeader({ eyebrow, title, accent, description, children }: { eyebrow: string; title: string; accent?: string; description?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-volt/20 blur-[120px]" />
      <div className="container-x relative py-14 sm:py-20">
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl animate-rise text-4xl font-semibold tracking-tight [animation-delay:80ms] sm:text-5xl">
          {title} {accent && <span className="font-display font-normal italic text-volt-gradient">{accent}</span>}
        </h1>
        {description && <p className="mt-4 max-w-2xl animate-rise text-base leading-7 text-muted [animation-delay:160ms] sm:text-lg">{description}</p>}
        {children}
      </div>
    </section>
  );
}
