import { useLanguage } from "../context/LanguageContext";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import ServicesSection from "../components/ServicesSection";
import CtaBand from "../components/CtaBand";

export default function ServicesPage() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={t.seo.services.title} description={t.seo.services.desc} />
      <PageHeader overline={t.servicesPage.overline} title={t.servicesPage.title} sub={t.servicesPage.sub} />
      <ServicesSection showHeader={false} />
      <CtaBand />
    </>
  );
}
