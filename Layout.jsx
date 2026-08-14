import { Outlet, useParams, Navigate } from "react-router-dom";
import { LanguageProvider } from "../context/LanguageContext";
import { LANGS, DEFAULT_LANG } from "../i18n";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";
import CookieConsent from "./CookieConsent";

export default function Layout() {
  const { lang } = useParams();
  if (!LANGS.includes(lang)) return <Navigate to={`/${DEFAULT_LANG}`} replace />;
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <ChatWidget />
        <CookieConsent />
      </div>
    </LanguageProvider>
  );
}
