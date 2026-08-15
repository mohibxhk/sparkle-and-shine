import { Reveal, Overline } from "./Reveal";

export default function PageHeader({ overline, title, sub }) {
  return (
    <section className="bg-sand border-b border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-24 max-w-7xl">
        <Reveal>
          <Overline>{overline}</Overline>
          <h1 className="font-serif font-medium text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-ink mt-4 max-w-3xl">{title}</h1>
          {sub && <p className="mt-6 text-base sm:text-lg text-soot leading-relaxed max-w-2xl">{sub}</p>}
        </Reveal>
      </div>
    </section>
  );
}
