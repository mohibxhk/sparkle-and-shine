import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function NotFoundPage() {
  const { t, lp } = useLanguage();
  return (
    <section className="py-32 lg:py-44 text-center" data-testid="not-found">
      <p className="font-serif text-8xl text-line select-none" aria-hidden="true">404</p>
      <h1 className="font-serif font-medium text-4xl sm:text-5xl tracking-tight text-ink mt-4">{t.notFound.title}</h1>
      <p className="mt-4 text-base text-soot">{t.notFound.text}</p>
      <Link to={lp("")} data-testid="not-found-home"
        className="inline-block mt-9 bg-olive text-bone font-medium px-8 py-4 text-sm tracking-wide hover:bg-olive-dark transition-colors">
        {t.notFound.back}
      </Link>
    </section>
  );
}
