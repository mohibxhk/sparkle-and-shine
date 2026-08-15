import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, X, Send, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const inputCls = "w-full bg-white border border-line px-3.5 py-2.5 text-sm text-ink placeholder:text-soot/50 focus:outline-none focus:ring-1 focus:ring-olive focus:border-olive";

function getSessionId() {
  let id = localStorage.getItem("ss-chat-session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("ss-chat-session", id);
  }
  return id;
}

export default function ChatWidget() {
  const { t, lp, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [leadMode, setLeadMode] = useState(false);
  const [lead, setLead] = useState({ name: "", email: "", phone: "", message: "" });
  const [leadDone, setLeadDone] = useState(false);
  const [leadBusy, setLeadBusy] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", text: t.chat.greeting }]);
    }
  }, [open, messages.length, t.chat.greeting]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, leadMode]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    setLeadMode(false);
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    setBusy(true);
    try {
      const { data } = await axios.post(`${API}/chat`, { session_id: getSessionId(), message: msg });
      setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: t.chat.error }]);
    } finally {
      setBusy(false);
    }
  };

  const onQuick = (q) => {
    const talk = t.chat.quick[t.chat.quick.length - 1];
    const quote = t.chat.quick[0];
    if (q === talk) { setLeadMode(true); setLeadDone(false); return; }
    if (q === quote) { setMessages((m) => [...m, { role: "user", text: q }, { role: "assistant", text: "__QUOTE__" }]); return; }
    send(q);
  };

  const submitLead = async () => {
    if (!lead.name.trim() || (!lead.email.trim() && !lead.phone.trim()) || leadBusy) return;
    setLeadBusy(true);
    try {
      await axios.post(`${API}/leads`, { ...lead, source: "chat", website: "" });
      setLeadDone(true);
    } catch {
      setLeadDone(false);
    } finally {
      setLeadBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        data-testid="chat-open-btn"
        aria-label={t.chat.open}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 bg-olive text-bone pl-4 pr-5 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.18)] hover:bg-olive-dark transition-colors duration-200"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} strokeWidth={1.8} />}
        <span className="text-sm font-medium">{open ? t.nav.close : t.chat.open}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-[390px] bg-bone border border-line shadow-[0_16px_50px_rgba(0,0,0,0.16)] flex flex-col overflow-hidden"
            style={{ height: "min(560px, calc(100vh - 8.5rem))" }}
            data-testid="chat-panel"
            role="dialog"
            aria-label={t.chat.title}
          >
            <div className="bg-olive-deep text-bone px-5 py-4 flex items-center gap-3.5">
              <span className="w-9 h-9 rounded-full bg-bone/15 flex items-center justify-center font-serif text-lg font-semibold">S</span>
              <div>
                <p className="font-serif font-semibold text-base leading-tight">{t.chat.title}</p>
                <p className="text-xs text-bone/70">{t.chat.subtitle}</p>
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-sand/60">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.text === "__QUOTE__" ? (
                    <div className="bg-white border border-line px-4 py-3.5 max-w-[85%] text-sm text-soot leading-relaxed">
                      {t.contact.quoteText}{" "}
                      <Link to={lp("/quote")} onClick={() => setOpen(false)} data-testid="chat-quote-link" className="font-semibold text-olive underline underline-offset-4">
                        {t.nav.quote} →
                      </Link>
                    </div>
                  ) : (
                    <div className={`px-4 py-3 max-w-[85%] text-sm leading-relaxed ${m.role === "user" ? "bg-olive text-bone" : "bg-white border border-line text-ink"}`}
                      data-testid={`chat-msg-${i}`}>
                      {m.text}
                    </div>
                  )}
                </div>
              ))}
              {busy && (
                <div className="flex justify-start" data-testid="chat-typing">
                  <div className="bg-white border border-line px-4 py-3 flex gap-1.5">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-soot/50 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              {leadMode && (
                <div className="bg-white border border-line p-4 space-y-2.5" data-testid="chat-lead-form">
                  {leadDone ? (
                    <p className="text-sm text-olive flex items-center gap-2"><Check size={16} /> {t.chat.leadSuccess}</p>
                  ) : (
                    <>
                      <p className="font-serif font-semibold text-base text-ink">{t.chat.leadTitle}</p>
                      <p className="text-xs text-soot">{t.chat.leadText}</p>
                      <input className={inputCls} placeholder={t.contact.name} value={lead.name} data-testid="chat-lead-name"
                        onChange={(e) => setLead({ ...lead, name: e.target.value })} />
                      <input className={inputCls} placeholder={t.contact.email} type="email" value={lead.email} data-testid="chat-lead-email"
                        onChange={(e) => setLead({ ...lead, email: e.target.value })} />
                      <input className={inputCls} placeholder={t.contact.phone} type="tel" value={lead.phone} data-testid="chat-lead-phone"
                        onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
                      <textarea className={inputCls} rows={2} placeholder={t.contact.messagePh} value={lead.message} data-testid="chat-lead-message"
                        onChange={(e) => setLead({ ...lead, message: e.target.value })} />
                      <button onClick={submitLead} disabled={leadBusy} data-testid="chat-lead-submit"
                        className="w-full bg-olive text-bone text-sm font-medium py-2.5 hover:bg-olive-dark transition-colors disabled:opacity-60">
                        {leadBusy ? t.common.sending : t.chat.leadSend}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="px-4 pt-3 pb-1.5 flex gap-2 overflow-x-auto" data-testid="chat-quick-options">
              {t.chat.quick.map((q) => (
                <button key={q} onClick={() => onQuick(q)} data-testid={`chat-quick-${q.toLowerCase().replace(/[\s?]/g, "-")}`}
                  className="shrink-0 text-xs font-medium border border-line bg-white text-soot px-3 py-1.5 hover:border-olive hover:text-olive transition-colors">
                  {q}
                </button>
              ))}
            </div>

            <div className="p-3.5 flex gap-2 border-t border-line bg-bone">
              <input
                className={inputCls}
                placeholder={t.chat.placeholder}
                value={input}
                data-testid="chat-input"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                aria-label={t.chat.placeholder}
              />
              <button onClick={() => send()} disabled={busy || !input.trim()} data-testid="chat-send" aria-label={t.chat.send}
                className="bg-olive text-bone px-4 hover:bg-olive-dark transition-colors disabled:opacity-50">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
