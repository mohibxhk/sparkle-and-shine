import { useLanguage } from "../context/LanguageContext";
import { IMAGES } from "../data/content";
import { Reveal, Overline } from "./Reveal";

export default function WhyUs() {
  const { t } = useLanguage();
  return (
    <section className="bg-sand py-24 lg:py-32" data-testid="why-us">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14">
        <div className="lg:col-span-4">
          <Reveal>
            <Overline>{t.why.overline}</Overline>
            <h2 className="font-serif font-medium text-4xl sm:text-5xl tracking-tight leading-[1.1] text-ink mt-4">{t.why.title}</h2>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 hidden lg:block">
            <img src={IMAGES.cleaner} alt="A Sparkline & Shine professional at work" loading="lazy"
              className="w-full aspect-[3/4] object-cover" data-testid="why-image" />
          </Reveal>
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-14 content-start">
          {t.why.pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1} className="border-t border-ink/15 pt-7">
              <h3 className="font-serif font-medium text-2xl sm:text-3xl tracking-tight text-ink">{p.title}</h3>
              <p className="mt-3 text-base text-soot leading-relaxed">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
