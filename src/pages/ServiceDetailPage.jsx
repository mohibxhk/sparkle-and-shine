import { Link, useParams, Navigate } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { SERVICE_IMAGES, SERVICE_SLUGS } from "../data/content";
import Seo from "../components/Seo";
import CtaBand from "../components/CtaBand";
import { Reveal, Overline } from "../components/Reveal";

const KEY_MAP = {
  "residential-cleaning": "residential",
  "commercial-cleaning": "commercial",
  "specialty-cleaning": "specialty",
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { t, lp } = useLanguage();
  const key = KEY_MAP[slug];
  if (!key) return <Navigate to="../services" replace />;
  const d = t.serviceDetail[key];
  const seoKey = key;

  return (
    <>
      <Seo title={t.seo[seoKey].title} description={t.seo[seoKey].desc} />
      <section className="bg-sand border-b border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <Link to={lp("/services")} data-testid="service-back" className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-soot hover:text-ink transition-colors mb-8">
                <ArrowLeft size={14} /> {t.serviceDetail.back}
              </Link>
              <Overline>{t.servicesPage.overline}</Overline>
              <h1 className="font-serif font-medium text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-ink mt-4">
                {d.headline || d.title}
              </h1>
              <p className="mt-6 text-base sm:text-lg text-soot leading-relaxed">{d.intro}</p>
              <Link to={lp("/quote")} data-testid="service-quote-cta"
                className="inline-block mt-8 bg-olive text-bone font-medium px-8 py-4 text-sm tracking-wide hover:bg-olive-dark transition-colors">
                {t.serviceDetail.request}
              </Link>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="lg:col-span-6">
            <img src={SERVICE_IMAGES[slug]} alt={d.title} className="w-full aspect-[4/3] object-cover" data-testid="service-detail-image" />
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14">
          <Reveal className="lg:col-span-7">
            <h2 className="font-serif font-medium text-3xl sm:text-4xl tracking-tight text-ink">{t.serviceDetail.includes}</h2>
            <ul className="mt-8 space-y-5">
              {d.includes.map((item) => (
                <li key={item} className="flex items-start gap-3.5 border-b border-line pb-5">
                  <Check size={17} strokeWidth={2.2} className="text-olive shrink-0 mt-0.5" />
                  <span className="text-base text-soot leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            {d.confirm && <p className="mt-6 text-sm text-soot/80 italic">{d.confirm}</p>}
          </Reveal>
          <div className="lg:col-span-5 space-y-10">
            <Reveal delay={0.1}>
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-terra">{t.serviceDetail.whoFor}</h3>
              <p className="mt-3 text-base text-soot leading-relaxed">{d.whoFor}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-terra">{t.serviceDetail.expect}</h3>
              <p className="mt-3 text-base text-soot leading-relaxed">{d.expect}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <h2 className="font-serif font-medium text-2xl sm:text-3xl tracking-tight text-ink mb-8">{t.serviceDetail.other}</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {SERVICE_SLUGS.filter((s) => s !== slug).map((s) => {
                const item = t.servicesHome.items.find((x) => x.slug === s);
                return (
                  <Link key={s} to={lp(`/services/${s}`)} data-testid={`service-other-${s}`}
                    className="group border border-line bg-white p-7 flex items-center justify-between hover:border-olive transition-colors">
                    <div>
                      <p className="font-serif font-medium text-xl text-ink group-hover:text-olive transition-colors">{item.title}</p>
                      <p className="text-sm text-soot mt-1.5 line-clamp-2 max-w-sm">{item.desc}</p>
                    </div>
                    <ArrowRight size={18} className="text-soot group-hover:text-olive group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
