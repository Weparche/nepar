import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Send, X } from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1];

const inputCls =
  "w-full rounded-xl border border-slate-300/90 bg-white/[0.92] px-4 py-3 text-base text-slate-800 placeholder:text-slate-500 outline-none shadow-sm shadow-slate-200/30 transition-[border-color,box-shadow,background-color] duration-200 focus:border-blue-500 focus:bg-white focus:shadow-blue-200/40 focus:ring-2 focus:ring-blue-500/20";

const modalCopy = {
  hr: {
    title: "Pošaljite upit",
    subtitle: "Javit ćemo se unutar 24 sata s prijedlogom za odabrani paket.",
    package: "Paket",
    billing: "Način naplate",
    billingMonthly: "Mjesečna pretplata",
    billingYearly: "Godišnja pretplata",
    name: "Ime i prezime",
    namePlaceholder: "Vaše ime i prezime",
    email: "E-mail adresa",
    emailPlaceholder: "vas@email.com",
    message: "Poruka",
    messagePlaceholder: "Kratko opišite djelatnost, lokaciju i što želite istaknuti na stranici...",
    messagePlaceholderRedesign:
      "Zalijepite link vaše trenutne web stranice i kratko opišite što želite poboljšati...",
    paymentType: "Vrsta usluge",
    paymentOneTime: "Jednokratni redizajn",
    submit: "Pošalji upit",
    sending: "Šaljem…",
    successTitle: "Upit poslan!",
    successDesc: "Vaš upit je proslijeđen na nepar@nepar.hr. Javit ćemo se uskoro.",
    newInquiry: "Novi upit",
    close: "Zatvori",
    error: "Slanje nije uspjelo. Pokušajte ponovo ili pišite direktno na nepar@nepar.hr.",
  },
  en: {
    title: "Send an inquiry",
    subtitle: "We will get back within 24 hours with a proposal for your selected plan.",
    package: "Plan",
    billing: "Billing",
    billingMonthly: "Monthly subscription",
    billingYearly: "Yearly subscription",
    name: "Full name",
    namePlaceholder: "Your full name",
    email: "Email address",
    emailPlaceholder: "you@email.com",
    message: "Message",
    messagePlaceholder: "Briefly describe your business, location, and what you want to highlight...",
    messagePlaceholderRedesign:
      "Paste your current website link and briefly describe what you want to improve...",
    paymentType: "Service type",
    paymentOneTime: "One-time redesign",
    submit: "Send inquiry",
    sending: "Sending…",
    successTitle: "Inquiry sent!",
    successDesc: "Your inquiry was forwarded to nepar@nepar.hr. We will get back to you soon.",
    newInquiry: "New inquiry",
    close: "Close",
    error: "Failed to send. Please try again or email nepar@nepar.hr directly.",
  },
};

export default function PackageInquiryModal({
  open,
  onClose,
  lang = "hr",
  packageName = "Web Start",
  billing = "monthly",
  priceLabel = "",
  inquiryType = "subscription",
}) {
  const copy = modalCopy[lang];
  const closeRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  const isRedesign = inquiryType === "redesign";
  const WORKER_URL = import.meta.env.VITE_WORKER_URL || null;
  const billingLabel = billing === "yearly" ? copy.billingYearly : copy.billingMonthly;
  const subject = isRedesign
    ? `${packageName} — redizajn weba${priceLabel ? ` (${priceLabel})` : ""}`
    : `${packageName} — ${billingLabel}${priceLabel ? ` (${priceLabel})` : ""} — besplatan prijedlog`;
  const messagePlaceholder = isRedesign ? copy.messagePlaceholderRedesign : copy.messagePlaceholder;

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setSendError(null);
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setSendError(null);

    const body = isRedesign
      ? [
          `Paket: ${packageName}`,
          copy.paymentOneTime,
          priceLabel ? `Cijena: ${priceLabel}` : "",
          "",
          `Ime: ${name}`,
          `E-mail: ${email}`,
          "",
          "Poruka:",
          message,
        ]
      : [
          `Paket: ${packageName}`,
          `Način naplate: ${billingLabel}`,
          priceLabel ? `Cijena: ${priceLabel}` : "",
          "",
          `Ime: ${name}`,
          `E-mail: ${email}`,
          "",
          "Poruka:",
          message,
        ];
    const bodyText = body.filter(Boolean).join("\n");

    if (!WORKER_URL) {
      window.location.href = `mailto:nepar@nepar.hr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      setSending(false);
      setSubmitted(true);
      return;
    }

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message: bodyText }),
      });
      if (!res.ok) throw new Error("send_failed");
      setSubmitted(true);
    } catch {
      setSendError(copy.error);
    } finally {
      setSending(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-modal-title"
          className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            aria-label={copy.close}
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.32, ease: easeOut }}
            className="relative flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-slate-200/90 bg-white/95 shadow-2xl shadow-blue-300/25 backdrop-blur-xl sm:max-h-[min(92vh,720px)] sm:rounded-2xl"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 size-40 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative flex items-start justify-between gap-3 border-b border-slate-200/80 px-4 py-4 sm:px-6">
              <div>
                <h2 id="inquiry-modal-title" className="text-lg font-semibold text-slate-900 sm:text-xl">
                  {copy.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{copy.subtitle}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:text-slate-900"
                aria-label={copy.close}
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative overflow-y-auto px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-4">
              <div
                className={`mb-4 rounded-xl border border-blue-200/70 bg-blue-50/50 px-4 py-3 text-sm ${
                  isRedesign ? "space-y-1" : "grid gap-2 sm:grid-cols-2"
                }`}
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">{copy.package}</span>
                  <p className="mt-0.5 font-medium text-slate-900">{packageName}</p>
                  {isRedesign && (
                    <>
                      {priceLabel && <p className="mt-0.5 text-sm font-semibold text-blue-700">{priceLabel}</p>}
                      <p className="text-xs text-slate-600">{copy.paymentOneTime}</p>
                    </>
                  )}
                </div>
                {!isRedesign && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">{copy.billing}</span>
                    <p className="mt-0.5 font-medium text-slate-900">{billingLabel}</p>
                    {priceLabel && <p className="text-xs text-slate-600">{priceLabel}</p>}
                  </div>
                )}
              </div>

              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-300/40">
                    <CheckCircle2 size={26} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{copy.successTitle}</h3>
                  <p className="max-w-sm text-sm leading-6 text-slate-600">{copy.successDesc}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="mt-1 text-sm text-blue-600 transition hover:text-blue-700"
                  >
                    {copy.newInquiry}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="inquiry-name" className="text-sm font-medium text-slate-700">
                      {copy.name}
                    </label>
                    <input
                      id="inquiry-name"
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={copy.namePlaceholder}
                      className={inputCls}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="inquiry-email" className="text-sm font-medium text-slate-700">
                      {copy.email}
                    </label>
                    <input
                      id="inquiry-email"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={copy.emailPlaceholder}
                      className={inputCls}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="inquiry-message" className="text-sm font-medium text-slate-700">
                      {copy.message}
                    </label>
                    <textarea
                      id="inquiry-message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={messagePlaceholder}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  {sendError && (
                    <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {sendError}
                    </p>
                  )}
                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileHover={sending ? {} : { y: -1, scale: 1.01 }}
                    whileTap={sending ? {} : { scale: 0.98 }}
                    className="premium-button inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {sending ? copy.sending : copy.submit}
                    {!sending && <Send size={16} />}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
