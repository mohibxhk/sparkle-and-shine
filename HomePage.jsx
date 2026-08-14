import { useLanguage } from "../context/LanguageContext";
import Seo from "../components/Seo";
import Hero from "../components/Hero";
import EditorialMarquee from "../components/EditorialMarquee";
import ServicesSection from "../components/ServicesSection";
import HowItWorks from "../components/HowItWorks";
import WhyUs from "../components/WhyUs";
import BeforeAfter from "../components/BeforeAfter";
import ReviewsSection from "../components/ReviewsSection";
import CtaBand from "../components/CtaBand";

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={t.seo.home.title} description={t.seo.home.desc} />
      <Hero />
      <EditorialMarquee />
      <ServicesSection />
      <HowItWorks />
      <WhyUs />
      <BeforeAfter />
      <ReviewsSection />
      <CtaBand />
    </>
  );
}
