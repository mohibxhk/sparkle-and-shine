import { useLanguage } from "../context/LanguageContext";
import { Reveal, Overline } from "./Reveal";

export default function HowItWorks() {
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="bg-olive-deep text-bone py-24 lg:py-32 scroll-mt-20" data-testid="how-it-works">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-2xl mb-16 lg:mb-20">
          <Overline className="text-bone/60">{t.how.overline}</Overline>
          <h2 className="font-serif font-medium text-4xl sm:text-5xl tracking-tight leading-[1.1] mt-4">{t.how.title}</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {t.how.steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.12} className="border-t border-bone/15 pt-8">
              <span className="font-serif text-7xl font-medium text-bone/25 select-none" aria-hidden="true">{step.n}</span>
              <h3 className="font-serif text-2xl font-medium mt-5 leading-snug">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-bone/70">{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
