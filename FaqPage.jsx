import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { useLanguage } from "../context/LanguageContext";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import CtaBand from "../components/CtaBand";
import { Reveal } from "../components/Reveal";

export default function FaqPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return t.faq.items;
    return t.faq.items.filter((i) => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q));
  }, [query, t.faq.items]);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-jsonld";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faq.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    });
    document.head.appendChild(script);
    return () => document.getElementById("faq-jsonld")?.remove();
  }, [t.faq.items]);

  return (
    <>
      <Seo title={t.seo.faq.title} description={t.seo.faq.desc} />
      <PageHeader overline={t.faq.overline} title={t.faq.title} sub={t.faq.sub} />
      <section className="py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="relative mb-10">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-soot/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.faq.search}
                aria-label={t.faq.search}
                data-testid="faq-search"
                className="w-full bg-white border border-line pl-11 pr-4 py-3.5 text-sm text-ink placeholder:text-soot/50 focus:outline-none focus:ring-1 focus:ring-olive focus:border-olive"
              />
            </div>
          </Reveal>
          {filtered.length === 0 ? (
            <p className="text-soot text-sm py-10 text-center" data-testid="faq-no-results">{t.faq.noResults}</p>
          ) : (
            <Accordion type="single" collapsible data-testid="faq-accordion">
              {filtered.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b border-line">
                  <AccordionTrigger data-testid={`faq-question-${i}`}
                    className="text-left font-serif text-xl sm:text-2xl font-medium text-ink hover:text-olive hover:no-underline py-6 transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-soot leading-relaxed pb-6">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
