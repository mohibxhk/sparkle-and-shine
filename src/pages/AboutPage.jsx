import { useLanguage } from "../context/LanguageContext";
import { IMAGES } from "../data/content";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import CtaBand from "../components/CtaBand";
import { Reveal } from "../components/Reveal";

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={t.seo.about.title} description={t.seo.about.desc} />
      <PageHeader overline={t.about.overline} title={t.about.title} />
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14">
          <Reveal className="lg:col-span-5 order-2 lg:order-1">
            <img src={IMAGES.lisbon} alt="Classic Lisbon architecture" loading="lazy"
              className="w-full aspect-[3/4] object-cover" data-testid="about-image" />
          </Reveal>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <Reveal className="space-y-6 max-w-xl">
              <p className="font-serif text-2xl sm:text-3xl leading-snug text-ink">{t.about.p1}</p>
              <p className="text-base sm:text-lg text-soot leading-relaxed">{t.about.p2}</p>
              <p className="text-base sm:text-lg text-soot leading-relaxed">{t.about.p3}</p>
            </Reveal>
            <div className="mt-16">
              <Reveal>
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-terra">{t.about.valuesTitle}</h2>
              </Reveal>
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
                {t.about.values.map((v, i) => (
                  <Reveal key={v.title} delay={i * 0.08} className="border-t border-ink/15 pt-5">
                    <h3 className="font-serif font-medium text-2xl text-ink">{v.title}</h3>
                    <p className="mt-2 text-sm text-soot leading-relaxed">{v.desc}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
