export default function PageHeader({ eyebrow, title, children }) {
  return (
    <section className="slats text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <p className="eyebrow text-rose">{eyebrow}</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold text-rose sm:text-6xl">{title}</h1>
        {children && <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cream/75 sm:text-lg">{children}</p>}
      </div>
      <div className="gingham h-3" />
    </section>
  );
}
