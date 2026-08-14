import { Quote } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Reveal, Overline } from "./Reveal";

export default function ReviewsSection() {
  const { t } = useLanguage();
  return (
    <section className="bg-sand py-24 lg:py-32" data-testid="reviews-section">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <Overline className="text-center">{t.reviews.overline}</Overline>
          <h2 className="font-serif font-medium text-4xl sm:text-5xl tracking-tight leading-[1.1] text-ink mt-4">{t.reviews.title}</h2>
          <p className="mt-5 text-base text-soot leading-relaxed max-w-xl mx-auto">{t.reviews.sub}</p>
        </Reveal>
        <div className="mt-14 space-y-12">
          {t.reviews.items.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.12}>
              <figure className="bg-bone border border-line px-8 sm:px-14 py-12 text-left" data-testid={`review-${i}`}>
                <Quote size={28} className="text-terra" aria-hidden="true" />
                <blockquote className="mt-6 font-serif text-2xl sm:text-3xl leading-snug text-ink">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-7">
                  <p className="font-semibold text-sm tracking-wide text-ink">{r.name}</p>
                  <p className="text-xs text-soot mt-1">{r.meta}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <p className="text-sm text-soot italic">{t.reviews.empty}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
