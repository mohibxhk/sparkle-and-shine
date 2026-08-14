import { createContext, useContext, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { translations, LANGS, DEFAULT_LANG } from "../i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const active = LANGS.includes(lang) ? lang : DEFAULT_LANG;

  const value = useMemo(() => ({
    lang: active,
    t: translations[active],
    lp: (path = "") => `/${active}${path}`,
    switchLang: (next) => {
      const rest = location.pathname.replace(/^\/(en|pt)/, "");
      navigate(`/${next}${rest}${location.search}`);
    },
  }), [active, navigate, location]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
