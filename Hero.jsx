import { useRef } from "react";
import { Link } from "react-router-dom";
import { Check, Phone } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { IMAGES, CONTACT } from "../data/content";

function MaskLine({ children, delay }) {
  return (
    <span className="mask-line">
      <span style={{ animationDelay: `${delay}s` }}>{children}</span>
    </span>
  );
}

export default function Hero() {
  const { t, lp } = useLanguage();
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section className="relative overflow-hidden" data-testid="hero">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-20 lg:pt-24 lg:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-6 xl:col-span-5 relative z-10">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="uppercase text-xs tracking-[0.24em] font-medium text-terra mb-6"
          >
            {t.hero.overline}
          </motion.p>
          <h1 className="font-serif font-medium text-5xl sm:text-6xl xl:text-7xl tracking-tight leading-[1.05] text-ink">
            <MaskLine delay={0.15}>{t.hero.line1}</MaskLine>
            <MaskLine delay={0.32}><em className="text-olive">{t.hero.line2}</em></MaskLine>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.7 }}
            className="mt-6 text-base sm:text-lg leading-relaxed text-soot max-w-md"
          >
            {t.hero.sub}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link to={lp("/quote")} data-testid="hero-quote-cta"
              className="bg-olive text-bone font-medium px-8 py-4 text-sm tracking-wide hover:bg-olive-dark transition-colors duration-200">
              {t.hero.quote}
            </Link>
            <Link to={lp("/services")} data-testid="hero-explore-cta"
              className="border border-ink/20 text-ink font-medium px-8 py-4 text-sm tracking-wide hover:border-ink transition-colors duration-200">
              {t.hero.explore}
            </Link>
            <a href={`tel:${CONTACT.phone}`} data-testid="hero-phone-cta"
              className="flex items-center gap-2 text-sm font-medium text-soot hover:text-ink transition-colors">
              <Phone size={16} strokeWidth={1.8} /> {CONTACT.phoneDisplay}
            </a>
          </motion.div>
          <motion.ul
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5"
            data-testid="hero-trust-list"
          >
            {t.hero.trust.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-soot">
                <Check size={15} strokeWidth={2.2} className="text-olive shrink-0" /> {item}
              </li>
            ))}
          </motion.ul>
        </div>
        <div className="lg:col-span-6 xl:col-span-7" ref={imgRef}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden aspect-[4/3] lg:aspect-[5/4]"
          >
            <motion.img
              src={IMAGES.hero}
              alt="A bright, freshly cleaned living room in a Lisbon home"
              style={{ y }}
              className="w-full h-[112%] object-cover"
              loading="eager"
              data-testid="hero-image"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
