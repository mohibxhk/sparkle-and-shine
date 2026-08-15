import { useLanguage } from "../context/LanguageContext";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import { Reveal } from "../components/Reveal";

export default function LegalPage({ kind }) {
  const { t } = useLanguage();
  const doc = t.legal[kind];
  return (
    <>
      <Seo title={`${doc.title} — Sparkline & Shine`} description={doc.intro} />
      <PageHeader overline="Sparkline & Shine" title={doc.title} sub={doc.intro} />
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-12">
          {doc.sections.map((s, i) => (
            <Reveal key={s.h} delay={i * 0.06}>
              <h2 className="font-serif font-medium text-2xl sm:text-3xl tracking-tight text-ink">{s.h}</h2>
              <p className="mt-4 text-base text-soot leading-relaxed">{s.p}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
