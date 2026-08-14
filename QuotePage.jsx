import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import QuoteForm from "../components/QuoteForm";
import { Reveal } from "../components/Reveal";

export default function QuotePage() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const service = params.get("service") || "";
  return (
    <>
      <Seo title={t.seo.quote.title} description={t.seo.quote.desc} />
      <PageHeader overline={t.quotePage.overline} title={t.quotePage.title} sub={t.quotePage.sub} />
      <section className="py-20 lg:py-24 bg-sand/50">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Reveal>
            <QuoteForm defaultService={service} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
