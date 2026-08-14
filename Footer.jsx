import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { CONTACT } from "../data/content";

export default function Footer() {
  const { t, lp } = useLanguage();
  const year = new Date().getFullYear();

  const cols = [
    {
      title: t.footer.services,
      links: [
        { to: lp("/services/residential-cleaning"), label: t.footer.residential },
        { to: lp("/services/commercial-cleaning"), label: t.footer.commercial },
        { to: lp("/services/specialty-cleaning"), label: t.footer.specialty },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { to: lp("/about"), label: t.nav.about },
        { to: lp("/our-work"), label: t.nav.work },
        { to: `${lp("")}#how-it-works`, label: t.nav.how },
        { to: lp("/faq"), label: t.nav.faq },
      ],
    },
  ];

  return (
    <footer className="bg-olive-deep text-bone" data-testid="footer">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <p className="font-serif text-2xl font-semibold">Sparkline <span className="text-bone/60">&amp;</span> Shine</p>
            <p className="mt-4 text-sm leading-relaxed text-bone/65 max-w-xs">{t.footer.tagline}</p>
          </div>
          {cols.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-bone/50 mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-bone/80 hover:text-bone transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="md:col-span-4">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-bone/50 mb-5">{t.footer.contactCol}</p>
            <ul className="space-y-3 text-sm text-bone/80">
              <li className="flex items-center gap-2.5"><MapPin size={15} className="text-bone/50" /> {CONTACT.location}</li>
              <li>
                <a href={`tel:${CONTACT.phone}`} data-testid="footer-phone" className="flex items-center gap-2.5 hover:text-bone transition-colors">
                  <Phone size={15} className="text-bone/50" /> {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} data-testid="footer-email" className="flex items-center gap-2.5 hover:text-bone transition-colors break-all">
                  <Mail size={15} className="text-bone/50 shrink-0" /> {CONTACT.email}
                </a>
              </li>
            </ul>
            <Link to={lp("/quote")} data-testid="footer-quote-cta"
              className="inline-block mt-6 bg-bone text-olive-deep text-sm font-medium px-6 py-3 hover:bg-sand transition-colors">
              {t.nav.quote}
            </Link>
          </div>
        </div>
        <div className="mt-14 pt-7 border-t border-bone/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-bone/45">© {year} Sparkline &amp; Shine Cleaning Service. {t.footer.rights}</p>
          <div className="flex items-center gap-5 text-xs text-bone/45">
            <Link to={lp("/privacy")} className="hover:text-bone transition-colors">{t.footer.privacy}</Link>
            <Link to={lp("/terms")} className="hover:text-bone transition-colors">{t.footer.terms}</Link>
            <Link to={lp("/cookies")} className="hover:text-bone transition-colors">{t.footer.cookies}</Link>
          </div>
        </div>
        <p className="mt-5 text-[11px] text-bone/35">
          {t.footer.credit}{" "}
          <a href="https://hubofecom.com/" target="_blank" rel="noopener noreferrer" data-testid="footer-credit"
            className="underline underline-offset-2 hover:text-bone/70 transition-colors">
            {t.footer.creditName}
          </a>
        </p>
      </div>
    </footer>
  );
}
