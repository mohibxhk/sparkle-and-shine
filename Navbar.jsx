import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { CONTACT } from "../data/content";

export default function Navbar() {
  const { t, lp, lang, switchLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const links = [
    { to: lp(""), label: t.nav.home, end: true },
    { to: lp("/services"), label: t.nav.services },
    { to: lp("/about"), label: t.nav.about },
    { to: `${lp("")}#how-it-works`, label: t.nav.how, hash: true },
    { to: lp("/our-work"), label: t.nav.work },
    { to: lp("/faq"), label: t.nav.faq },
    { to: lp("/contact"), label: t.nav.contact },
  ];

  return (
    <>
      <header
        data-testid="main-nav"
        className={`sticky top-0 z-40 bg-bone border-b border-line transition-[padding] duration-300 ${scrolled ? "py-2" : "py-4"}`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
          <Link to={lp("")} data-testid="nav-logo" className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-ink">
            Sparkline <span className="text-olive">&amp;</span> Shine
          </Link>
          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
            {links.map((l) =>
              l.hash ? (
                <Link key={l.label} to={l.to} data-testid={`nav-${l.label.toLowerCase().replace(/\s/g, "-")}`} className="text-sm font-medium text-soot hover:text-ink transition-colors duration-200">
                  {l.label}
                </Link>
              ) : (
                <NavLink key={l.label} to={l.to} end={l.end} data-testid={`nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                  className={({ isActive }) => `text-sm font-medium transition-colors duration-200 ${isActive ? "text-olive" : "text-soot hover:text-ink"}`}>
                  {l.label}
                </NavLink>
              )
            )}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center text-xs font-semibold tracking-widest" data-testid="lang-toggle">
              <button onClick={() => switchLang("en")} data-testid="lang-en" className={`px-1.5 py-1 ${lang === "en" ? "text-olive" : "text-soot/60 hover:text-ink"}`}>EN</button>
              <span className="text-line">|</span>
              <button onClick={() => switchLang("pt")} data-testid="lang-pt" className={`px-1.5 py-1 ${lang === "pt" ? "text-olive" : "text-soot/60 hover:text-ink"}`}>PT</button>
            </div>
            <a href={`tel:${CONTACT.phone}`} data-testid="nav-phone" className="hidden md:flex items-center gap-2 text-sm font-medium text-soot hover:text-ink transition-colors">
              <Phone size={15} strokeWidth={1.8} /> {CONTACT.phoneDisplay}
            </a>
            <Link to={lp("/quote")} data-testid="nav-quote-cta"
              className="hidden sm:inline-flex bg-olive text-bone text-sm font-medium px-5 py-2.5 hover:bg-olive-dark transition-colors duration-200">
              {t.nav.quote}
            </Link>
            <button onClick={() => setOpen(true)} data-testid="mobile-menu-open" aria-label={t.nav.menu}
              className="lg:hidden p-2 text-ink">
              <Menu size={22} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-bone flex flex-col"
            data-testid="mobile-menu"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <span className="font-serif text-xl font-semibold">Sparkline <span className="text-olive">&amp;</span> Shine</span>
              <button onClick={() => setOpen(false)} data-testid="mobile-menu-close" aria-label={t.nav.close} className="p-2">
                <X size={24} strokeWidth={1.8} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-8 gap-2" aria-label="Mobile">
              {links.map((l, i) => (
                <motion.div key={l.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link to={l.to} onClick={() => setOpen(false)} data-testid={`mobile-nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                    className="block font-serif text-3xl py-2 text-ink hover:text-olive transition-colors">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="px-8 pb-10 space-y-4">
              <Link to={lp("/quote")} onClick={() => setOpen(false)} data-testid="mobile-quote-cta"
                className="block text-center bg-olive text-bone font-medium px-6 py-4">
                {t.nav.quote}
              </Link>
              <div className="flex items-center justify-between text-sm">
                <a href={`tel:${CONTACT.phone}`} className="font-medium text-soot">{CONTACT.phoneDisplay}</a>
                <div className="flex items-center text-xs font-semibold tracking-widest">
                  <button onClick={() => switchLang("en")} data-testid="mobile-lang-en" className={`px-1.5 ${lang === "en" ? "text-olive" : "text-soot/60"}`}>EN</button>
                  <span className="text-line">|</span>
                  <button onClick={() => switchLang("pt")} data-testid="mobile-lang-pt" className={`px-1.5 ${lang === "pt" ? "text-olive" : "text-soot/60"}`}>PT</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
