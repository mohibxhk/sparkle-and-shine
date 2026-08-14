import { useLanguage } from "../context/LanguageContext";
import { IMAGES } from "../data/content";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import BeforeAfter from "../components/BeforeAfter";
import CtaBand from "../components/CtaBand";
import { Reveal } from "../components/Reveal";

export default function OurWorkPage() {
  const { t } = useLanguage();
  const gallery = [
    { src: IMAGES.kitchen, alt: t.work.items[0] },
    { src: IMAGES.livingRoom, alt: t.work.items[2] },
    { src: IMAGES.residential, alt: t.work.items[3] },
    { src: IMAGES.hero, alt: t.work.items[2] },
    { src: IMAGES.cleaner, alt: t.work.items[4] },
    { src: IMAGES.lisbon, alt: t.work.items[5] },
  ];
  return (
    <>
      <Seo title={t.seo.work.title} description={t.seo.work.desc} />
      <PageHeader overline={t.work.overline} title={t.work.title} sub={t.work.sub} />
      <BeforeAfter showHeader={false} />
      <section className="pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gallery.map((g, i) => (
              <Reveal key={i} delay={(i % 3) * 0.08}>
                <figure className="group overflow-hidden bg-sand">
                  <img src={g.src} alt={g.alt} loading="lazy"
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    data-testid={`gallery-item-${i}`} />
                  <figcaption className="py-3 text-xs tracking-widest uppercase text-soot">{g.alt}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <p className="text-sm text-soot/70 italic">{t.work.galleryNote}</p>
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
