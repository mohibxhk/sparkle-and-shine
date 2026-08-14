import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { SERVICE_IMAGES } from "../data/content";
import { Reveal, Overline } from "./Reveal";

export default function ServicesSection({ showHeader = true }) {
  const { t, lp } = useLanguage();
  return (
    <section className="py-24 lg:py-32" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {showHeader && (
          <Reveal className="max-w-2xl mb-16 lg:mb-24">
            <Overline>{t.servicesHome.overline}</Overline>
            <h2 className="font-serif font-medium text-4xl sm:text-5xl tracking-tight leading-[1.1] text-ink mt-4">
              {t.servicesHome.title}
            </h2>
            <p className="mt-5 text-base sm:text-lg text-soot leading-relaxed">{t.servicesHome.sub}</p>
          </Reveal>
        )}
        <div className="space-y-20 lg:space-y-28">
          {t.servicesHome.items.map((s, i) => (
            <Reveal key={s.slug}>
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center`}>
                <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <Link to={lp(`/services/${s.slug}`)} className="block overflow-hidden group" data-testid={`service-image-${s.slug}`}>
                    <img
                      src={SERVICE_IMAGES[s.slug]}
                      alt={s.title}
                      loading="lazy"
                      className="w-full aspect-[16/10] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </Link>
                </div>
                <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-1 lg:pr-8" : "lg:pl-4"}`}>
                  <span className="font-serif text-6xl text-line select-none" aria-hidden="true">0{i + 1}</span>
                  <h3 className="font-serif font-medium text-3xl sm:text-4xl tracking-tight text-ink mt-2">{s.title}</h3>
                  <p className="mt-4 text-base text-soot leading-relaxed">{s.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-sm text-soot">
                        <Check size={15} strokeWidth={2.2} className="text-olive shrink-0" /> {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap items-center gap-5">
                    <Link to={lp(`/services/${s.slug}`)} data-testid={`service-learn-${s.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-olive hover:text-olive-dark transition-colors group">
                      {t.common.learnMore}
                      <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                    <Link to={lp("/quote")} data-testid={`service-quote-${s.slug}`}
                      className="text-sm font-medium text-soot underline underline-offset-4 decoration-line hover:text-ink transition-colors">
                      {t.common.requestQuote}
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
