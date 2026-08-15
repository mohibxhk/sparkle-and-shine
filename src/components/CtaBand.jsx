import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { CONTACT } from "../data/content";
import { Reveal } from "./Reveal";

export default function CtaBand() {
  const { t, lp } = useLanguage();
  return (
    <section className="bg-olive text-bone py-20 lg:py-28" data-testid="cta-band">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <h2 className="font-serif font-medium text-4xl sm:text-5xl tracking-tight leading-[1.1]">{t.cta.title}</h2>
          <p className="mt-5 text-base sm:text-lg text-bone/75 leading-relaxed max-w-xl mx-auto">{t.cta.sub}</p>
          <div className="mt-9 flex flex-wrap justify-center items-center gap-4">
            <Link to={lp("/quote")} data-testid="cta-quote-btn"
              className="bg-bone text-olive font-medium px-8 py-4 text-sm tracking-wide hover:bg-sand transition-colors duration-200">
              {t.cta.quote}
            </Link>
            <a href={`tel:${CONTACT.phone}`} data-testid="cta-call-btn"
              className="inline-flex items-center gap-2 border border-bone/30 text-bone font-medium px-8 py-4 text-sm tracking-wide hover:border-bone transition-colors duration-200">
              <Phone size={15} strokeWidth={1.8} /> {t.cta.call}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
