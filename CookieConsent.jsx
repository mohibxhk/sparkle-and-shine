import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function CookieConsent() {
  const { t, lp } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("ss-cookie-consent")) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const choose = (val) => {
    localStorage.setItem("ss-cookie-consent", val);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-5 left-5 z-40 max-w-sm bg-white border border-line shadow-[0_16px_50px_rgba(0,0,0,0.12)] p-5"
          data-testid="cookie-banner"
          role="dialog"
          aria-label={t.cookie.policy}
        >
          <p className="text-sm text-soot leading-relaxed">{t.cookie.text}</p>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => choose("accepted")} data-testid="cookie-accept"
              className="bg-olive text-bone text-xs font-semibold tracking-wide px-5 py-2.5 hover:bg-olive-dark transition-colors">
              {t.cookie.accept}
            </button>
            <button onClick={() => choose("declined")} data-testid="cookie-decline"
              className="border border-line text-xs font-semibold tracking-wide px-5 py-2.5 text-soot hover:border-ink transition-colors">
              {t.cookie.decline}
            </button>
            <Link to={lp("/cookies")} data-testid="cookie-policy-link" className="text-xs text-soot underline underline-offset-4 decoration-line hover:text-ink ml-auto">
              {t.cookie.policy}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
