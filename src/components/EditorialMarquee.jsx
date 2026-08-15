import Marquee from "react-fast-marquee";
import { useLanguage } from "../context/LanguageContext";

export default function EditorialMarquee() {
  const { t } = useLanguage();
  return (
    <div className="bg-sand border-y border-line py-5 overflow-hidden" aria-hidden="true">
      <Marquee speed={28} gradient={false}>
        {t.marquee.map((item) => (
          <span key={item} className="font-serif italic text-xl sm:text-2xl text-ink/70 mx-8 whitespace-nowrap">
            {item} <span className="text-terra not-italic mx-4">·</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
