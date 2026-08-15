import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, FileText, Check } from "lucide-react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { CONTACT } from "../data/content";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import { Reveal } from "../components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const inputCls = "w-full bg-white border border-line px-4 py-3 text-sm text-ink placeholder:text-soot/50 focus:outline-none focus:ring-1 focus:ring-olive focus:border-olive transition-colors";
const labelCls = "block text-xs font-semibold tracking-widest uppercase text-soot mb-2";

export default function ContactPage() {
  const { t, lp } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setStatus(null);
    try {
      await axios.post(`${API}/leads`, { ...form, source: "contact" });
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", message: "", website: "" });
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  const cards = [
    { icon: Phone, label: t.contact.call, value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phone}`, testid: "contact-call" },
    { icon: Mail, label: t.contact.emailLabel, value: CONTACT.email, href: `mailto:${CONTACT.email}`, testid: "contact-email" },
  ];

  return (
    <>
      <Seo title={t.seo.contact.title} description={t.seo.contact.desc} />
      <PageHeader overline={t.contact.overline} title={t.contact.title} sub={t.contact.sub} />
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5 space-y-5">
            {cards.map((c) => (
              <Reveal key={c.label}>
                <a href={c.href} data-testid={c.testid}
                  className="flex items-center gap-5 border border-line bg-white p-6 hover:border-olive transition-colors group">
                  <span className="w-11 h-11 border border-line flex items-center justify-center text-olive group-hover:bg-olive group-hover:text-bone transition-colors">
                    <c.icon size={18} strokeWidth={1.8} />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold tracking-widest uppercase text-soot">{c.label}</span>
                    <span className="block text-base font-medium text-ink mt-1 break-all">{c.value}</span>
                  </span>
                </a>
              </Reveal>
            ))}
            <Reveal delay={0.1}>
              <Link to={lp("/quote")} data-testid="contact-quote-card"
                className="flex items-center gap-5 border border-line bg-white p-6 hover:border-olive transition-colors group">
                <span className="w-11 h-11 border border-line flex items-center justify-center text-olive group-hover:bg-olive group-hover:text-bone transition-colors">
                  <FileText size={18} strokeWidth={1.8} />
                </span>
                <span>
                  <span className="block text-xs font-semibold tracking-widest uppercase text-soot">{t.contact.quoteLabel}</span>
                  <span className="block text-base font-medium text-ink mt-1">{t.contact.quoteText}</span>
                </span>
              </Link>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="border border-line overflow-hidden" data-testid="contact-map">
                <iframe
                  title="Lisbon, Portugal"
                  src="https://www.google.com/maps?q=Lisbon,Portugal&output=embed"
                  className="w-full h-64 grayscale-[0.3]"
                  loading="lazy"
                />
                <p className="text-xs text-soot px-4 py-3 bg-white">{t.contact.mapNote}</p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-7">
            <form onSubmit={submit} className="bg-white border border-line p-7 sm:p-10" data-testid="contact-form">
              <h2 className="font-serif font-medium text-3xl tracking-tight text-ink">{t.contact.formTitle}</h2>
              <div className="mt-8 space-y-6">
                <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <div>
                  <label htmlFor="c-name" className={labelCls}>{t.contact.name} *</label>
                  <input id="c-name" required data-testid="contact-name" className={inputCls} value={form.name} onChange={set("name")} autoComplete="name" />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="c-email" className={labelCls}>{t.contact.email} *</label>
                    <input id="c-email" type="email" required data-testid="contact-email-input" className={inputCls} value={form.email} onChange={set("email")} autoComplete="email" />
                  </div>
                  <div>
                    <label htmlFor="c-phone" className={labelCls}>{t.contact.phone}</label>
                    <input id="c-phone" type="tel" data-testid="contact-phone" className={inputCls} value={form.phone} onChange={set("phone")} autoComplete="tel" />
                  </div>
                </div>
                <div>
                  <label htmlFor="c-message" className={labelCls}>{t.contact.message} *</label>
                  <textarea id="c-message" required rows={5} data-testid="contact-message" className={inputCls} placeholder={t.contact.messagePh} value={form.message} onChange={set("message")} />
                </div>
                <button type="submit" disabled={sending} data-testid="contact-submit"
                  className="bg-olive text-bone font-medium px-8 py-4 text-sm tracking-wide hover:bg-olive-dark transition-colors disabled:opacity-60">
                  {sending ? t.common.sending : t.contact.send}
                </button>
                {status === "ok" && (
                  <p className="text-sm text-olive flex items-center gap-2" data-testid="contact-success"><Check size={16} /> {t.contact.success}</p>
                )}
                {status === "error" && (
                  <p className="text-sm text-destructive" data-testid="contact-error">{t.contact.error}</p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
