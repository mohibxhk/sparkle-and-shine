import { useRef, useState, useCallback } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { IMAGES } from "../data/content";
import { Reveal, Overline } from "./Reveal";

export default function BeforeAfter({ showHeader = true }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const update = useCallback((clientX) => {
    const rect = ref.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    ref.current.setPointerCapture(e.pointerId);
    update(e.clientX);
  };
  const onPointerMove = (e) => { if (dragging.current) update(e.clientX); };
  const onPointerUp = () => { dragging.current = false; };
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 4));
  };

  return (
    <section className="py-24 lg:py-32" data-testid="before-after">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {showHeader && (
          <Reveal className="max-w-2xl mb-14">
            <Overline>{t.work.overline}</Overline>
            <h2 className="font-serif font-medium text-4xl sm:text-5xl tracking-tight leading-[1.1] text-ink mt-4">{t.work.title}</h2>
            <p className="mt-5 text-base sm:text-lg text-soot leading-relaxed">{t.work.sub}</p>
          </Reveal>
        )}
        <Reveal>
          <div
            ref={ref}
            role="slider"
            aria-label={`${t.work.before} / ${t.work.after}`}
            aria-valuenow={Math.round(pos)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            data-testid="before-after-slider"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onKeyDown={onKeyDown}
            className="relative aspect-[16/9] overflow-hidden select-none touch-none cursor-ew-resize"
          >
            <img src={IMAGES.kitchen} alt={t.work.after} draggable={false}
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <img src={IMAGES.kitchen} alt={t.work.before} draggable={false}
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.85] brightness-[0.72] contrast-[0.95]" />
            </div>
            <span className="absolute top-4 left-4 bg-ink/70 text-bone text-xs font-medium tracking-widest uppercase px-3 py-1.5">{t.work.before}</span>
            <span className="absolute top-4 right-4 bg-bone/90 text-ink text-xs font-medium tracking-widest uppercase px-3 py-1.5">{t.work.after}</span>
            <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
              <div className="absolute inset-y-0 -left-px w-0.5 bg-bone" />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-bone shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex items-center justify-center">
                <ChevronsLeftRight size={20} className="text-olive" />
              </div>
            </div>
            <span className="absolute bottom-4 left-4 text-[11px] tracking-wide text-bone/90 bg-ink/50 px-2.5 py-1">{t.work.note}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
