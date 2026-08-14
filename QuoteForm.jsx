import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload, X } from "lucide-react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const inputCls = "w-full bg-white border border-line px-4 py-3 text-sm text-ink placeholder:text-soot/50 focus:outline-none focus:ring-1 focus:ring-olive focus:border-olive transition-colors";
const labelCls = "block text-xs font-semibold tracking-widest uppercase text-soot mb-2";
const errCls = "mt-1.5 text-xs text-destructive";

export default function QuoteForm({ defaultService = "" }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", clientType: "", propertyType: "",
    area: "", rooms: "", size: "", cleaningType: defaultService, frequency: "",
    preferredDate: "", preferredTime: "", details: "", website: "",
  });

  const f = t.quotePage.fields;
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setErrors({ ...errors, [k]: "" }); };

  const validateStep = (s) => {
    const e = {};
    const er = t.quotePage.errors;
    if (s === 0) {
      if (!form.name.trim()) e.name = er.required;
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = er.email;
      if (!/^[+\d][\d\s\-()]{6,19}$/.test(form.phone)) e.phone = er.phone;
      if (!form.clientType) e.clientType = er.required;
    }
    if (s === 1 && !form.propertyType) e.propertyType = er.required;
    if (s === 2 && !form.cleaningType) e.cleaningType = er.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep(step + 1); };

  const onPhoto = (e) => {
    const file = e.target.files[0];
    setErrors({ ...errors, photo: "" });
    if (!file) { setPhoto(null); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors({ ...errors, photo: t.quotePage.errors.fileType }); setPhoto(null); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, photo: t.quotePage.errors.fileSize }); setPhoto(null); return;
    }
    setPhoto(file);
  };

  const submit = async () => {
    if (!validateStep(2)) return;
    setSending(true);
    setSubmitError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (photo) data.append("photo", photo);
      await axios.post(`${API}/quotes`, data);
      setDone(true);
    } catch (err) {
      setSubmitError(err.response?.data?.detail || t.quotePage.errorText);
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="bg-white border border-line p-10 sm:p-14 text-center" data-testid="quote-success">
        <span className="inline-flex w-14 h-14 rounded-full bg-olive items-center justify-center">
          <Check size={26} className="text-bone" />
        </span>
        <h2 className="font-serif font-medium text-3xl sm:text-4xl text-ink mt-6">{t.quotePage.successTitle}</h2>
        <p className="mt-4 text-base text-soot leading-relaxed max-w-md mx-auto">{t.quotePage.successText}</p>
      </div>
    );
  }

  const steps = [t.quotePage.step1, t.quotePage.step2, t.quotePage.step3];

  return (
    <div className="bg-white border border-line" data-testid="quote-form">
      <div className="flex border-b border-line">
        {steps.map((s, i) => (
          <div key={s} className={`flex-1 px-3 py-4 text-center text-xs font-semibold tracking-widest uppercase border-b-2 -mb-px transition-colors ${i === step ? "border-olive text-olive" : i < step ? "border-transparent text-ink" : "border-transparent text-soot/50"}`}>
            <span className="hidden sm:inline">{s}</span>
            <span className="sm:hidden">{i + 1}/3</span>
          </div>
        ))}
      </div>
      <div className="p-6 sm:p-10">
        <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="q-name" className={labelCls}>{f.name} *</label>
              <input id="q-name" data-testid="quote-name" className={inputCls} value={form.name} onChange={set("name")} autoComplete="name" />
              {errors.name && <p className={errCls}>{errors.name}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="q-email" className={labelCls}>{f.email} *</label>
                <input id="q-email" type="email" data-testid="quote-email" className={inputCls} value={form.email} onChange={set("email")} autoComplete="email" />
                {errors.email && <p className={errCls}>{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="q-phone" className={labelCls}>{f.phone} *</label>
                <input id="q-phone" type="tel" data-testid="quote-phone" className={inputCls} value={form.phone} onChange={set("phone")} autoComplete="tel" />
                {errors.phone && <p className={errCls}>{errors.phone}</p>}
              </div>
            </div>
            <div>
              <span className={labelCls}>{f.clientType} *</span>
              <div className="grid grid-cols-2 gap-3">
                {[["residential", f.residential], ["commercial", f.commercial]].map(([val, label]) => (
                  <button key={val} type="button" data-testid={`quote-type-${val}`}
                    onClick={() => { setForm({ ...form, clientType: val }); setErrors({ ...errors, clientType: "" }); }}
                    className={`border px-4 py-3.5 text-sm font-medium transition-colors ${form.clientType === val ? "border-olive bg-olive text-bone" : "border-line bg-white text-soot hover:border-ink/40"}`}>
                    {label}
                  </button>
                ))}
              </div>
              {errors.clientType && <p className={errCls}>{errors.clientType}</p>}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="q-ptype" className={labelCls}>{f.propertyType} *</label>
              <select id="q-ptype" data-testid="quote-property-type" className={inputCls} value={form.propertyType} onChange={set("propertyType")}>
                <option value="">—</option>
                {f.propertyTypes.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.propertyType && <p className={errCls}>{errors.propertyType}</p>}
            </div>
            <div>
              <label htmlFor="q-area" className={labelCls}>{f.area}</label>
              <input id="q-area" data-testid="quote-area" className={inputCls} value={form.area} onChange={set("area")} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="q-rooms" className={labelCls}>{f.rooms}</label>
                <input id="q-rooms" type="number" min="0" data-testid="quote-rooms" className={inputCls} value={form.rooms} onChange={set("rooms")} />
              </div>
              <div>
                <label htmlFor="q-size" className={labelCls}>{f.size}</label>
                <input id="q-size" type="number" min="0" data-testid="quote-size" className={inputCls} value={form.size} onChange={set("size")} />
              </div>
            </div>
            <div>
              <label htmlFor="q-photo" className={labelCls}>{f.photo}</label>
              {photo ? (
                <div className="flex items-center justify-between border border-line bg-sand px-4 py-3">
                  <span className="text-sm text-ink truncate">{photo.name}</span>
                  <button type="button" onClick={() => setPhoto(null)} data-testid="quote-photo-remove" aria-label="Remove" className="p-1 text-soot hover:text-ink"><X size={16} /></button>
                </div>
              ) : (
                <label htmlFor="q-photo" data-testid="quote-photo-label"
                  className="flex items-center justify-center gap-2 border border-dashed border-line px-4 py-6 text-sm text-soot cursor-pointer hover:border-olive hover:text-olive transition-colors">
                  <Upload size={16} /> {f.photoHint}
                </label>
              )}
              <input id="q-photo" type="file" accept="image/jpeg,image/png,image/webp" data-testid="quote-photo" onChange={onPhoto} className="hidden" />
              {errors.photo && <p className={errCls}>{errors.photo}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="q-ctype" className={labelCls}>{f.cleaningType} *</label>
                <select id="q-ctype" data-testid="quote-cleaning-type" className={inputCls} value={form.cleaningType} onChange={set("cleaningType")}>
                  <option value="">—</option>
                  {f.cleaningTypes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.cleaningType && <p className={errCls}>{errors.cleaningType}</p>}
              </div>
              <div>
                <label htmlFor="q-freq" className={labelCls}>{f.frequency}</label>
                <select id="q-freq" data-testid="quote-frequency" className={inputCls} value={form.frequency} onChange={set("frequency")}>
                  <option value="">—</option>
                  {f.frequencies.map((fr) => <option key={fr} value={fr}>{fr}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="q-date" className={labelCls}>{f.date}</label>
                <input id="q-date" type="date" data-testid="quote-date" className={inputCls} value={form.preferredDate} onChange={set("preferredDate")} />
              </div>
              <div>
                <label htmlFor="q-time" className={labelCls}>{f.time}</label>
                <input id="q-time" type="time" data-testid="quote-time" className={inputCls} value={form.preferredTime} onChange={set("preferredTime")} />
              </div>
            </div>
            <div>
              <label htmlFor="q-details" className={labelCls}>{f.details}</label>
              <textarea id="q-details" rows={4} data-testid="quote-details" className={inputCls} placeholder={f.detailsPh} value={form.details} onChange={set("details")} />
            </div>
          </div>
        )}

        {submitError && <p className={`${errCls} mt-6`} data-testid="quote-error">{submitError}</p>}

        <div className="mt-9 flex items-center justify-between">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} data-testid="quote-back"
              className="inline-flex items-center gap-2 text-sm font-medium text-soot hover:text-ink transition-colors">
              <ArrowLeft size={16} /> {t.quotePage.back}
            </button>
          ) : <span />}
          {step < 2 ? (
            <button type="button" onClick={next} data-testid="quote-next"
              className="inline-flex items-center gap-2 bg-olive text-bone font-medium px-8 py-3.5 text-sm tracking-wide hover:bg-olive-dark transition-colors">
              {t.quotePage.next} <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={sending} data-testid="quote-submit"
              className="bg-olive text-bone font-medium px-8 py-3.5 text-sm tracking-wide hover:bg-olive-dark transition-colors disabled:opacity-60">
              {sending ? t.common.sending : t.quotePage.submit}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
