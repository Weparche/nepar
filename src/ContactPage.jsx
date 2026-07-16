import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ImagePlus, Mail, MapPin, Send, X } from "lucide-react";
import { Background, Navbar, siteContent } from "./SiteChrome.jsx";

const easeOut = [0.23, 1, 0.32, 1];

const contactContent = {
  hr: {
    eyebrow: "KONTAKT",
    title: "Pišite",
    titleHighlight: "nam",
    description: "Opišite projekt ili pitanje — javit ćemo se unutar 24 sata.",
    info: [
      { Icon: Mail, label: "E-mail", value: "nepar@nepar.hr", href: "mailto:nepar@nepar.hr" },
      { Icon: Clock, label: "Odgovor", value: "Unutar 24h", href: null },
      { Icon: MapPin, label: "Lokacija", value: "Hrvatska", href: null },
    ],
    form: {
      name: "Ime i prezime",
      namePlaceholder: "Vaše ime i prezime",
      email: "E-mail adresa",
      emailPlaceholder: "vas@email.com",
      subject: "Tema",
      subjectPlaceholder: "O čemu se radi?",
      message: "Poruka",
      messagePlaceholder: "Opišite što trebate, koji je projekt, rok, budžet...",
      submit: "Pošalji poruku",
      newMessage: "Nova poruka",
      successTitle: "Poruka poslana!",
      successDesc: "Vaša poruka je proslijeđena na nepar@nepar.hr. Javit ćemo se uskoro.",
      backHome: "← Natrag na početnu",
      uploadLabel: "Priložite sliku projekta",
      uploadHint: "Povucite sliku ovdje ili",
      uploadBtn: "odaberite datoteku",
      uploadTypes: "PNG, JPG, WEBP — max 10 MB",
      uploadRemove: "Ukloni",
    },
  },
  en: {
    eyebrow: "CONTACT",
    title: "Get in",
    titleHighlight: "touch",
    description: "Describe your project or question — we'll get back to you within 24 hours.",
    info: [
      { Icon: Mail, label: "Email", value: "nepar@nepar.hr", href: "mailto:nepar@nepar.hr" },
      { Icon: Clock, label: "Response", value: "Within 24h", href: null },
      { Icon: MapPin, label: "Location", value: "Croatia", href: null },
    ],
    form: {
      name: "Full name",
      namePlaceholder: "Your full name",
      email: "Email address",
      emailPlaceholder: "you@email.com",
      subject: "Subject",
      subjectPlaceholder: "What is this about?",
      message: "Message",
      messagePlaceholder: "Describe what you need, the project, deadline, budget...",
      submit: "Send message",
      newMessage: "New message",
      successTitle: "Message sent!",
      successDesc: "Your message has been forwarded to nepar@nepar.hr. We'll get back to you soon.",
      backHome: "← Back to home",
      uploadLabel: "Attach a project image",
      uploadHint: "Drag an image here or",
      uploadBtn: "choose file",
      uploadTypes: "PNG, JPG, WEBP — max 10 MB",
      uploadRemove: "Remove",
    },
  },
};

/* text-base (16px) on inputs prevents iOS Safari zoom-on-focus */
const inputCls =
  "w-full rounded-xl border border-slate-300/90 bg-white/[0.92] px-4 py-3 text-base text-slate-800 placeholder:text-slate-500 outline-none shadow-sm shadow-slate-200/30 transition-[border-color,box-shadow,background-color] duration-200 focus:border-blue-500 focus:bg-white focus:shadow-blue-200/40 focus:ring-2 focus:ring-blue-500/20";

export default function ContactPage() {
  const [lang, setLang] = useState("hr");
  const copy = contactContent[lang];
  const navCopy = siteContent[lang];

  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get("tema") || searchParams.get("subject") || "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const WORKER_URL = import.meta.env.VITE_WORKER_URL || null;

  function handleFile(f) {
    if (!f || !f.type.startsWith("image/")) return;
    if (f.size > 10 * 1024 * 1024) return;
    setFile(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setSendError(null);

    let image = null;
    let imageName = null;

    if (file) {
      imageName = file.name;
      image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(file);
      });
    }

    if (!WORKER_URL) {
      const body = `Ime: ${name}\nE-mail: ${email}\nTema: ${subject}\n\nPoruka:\n${message}`;
      window.location.href = `mailto:nepar@nepar.hr?subject=${encodeURIComponent(subject || "Upit s web stranice")}&body=${encodeURIComponent(body)}`;
      setSending(false);
      setSubmitted(true);
      return;
    }

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, image, imageName }),
      });
      if (!res.ok) throw new Error("send_failed");
      setSubmitted(true);
    } catch {
      setSendError(lang === "hr" ? "Slanje nije uspjelo. Pokušajte ponovo ili pišite direktno na nepar@nepar.hr." : "Failed to send. Please try again or email nepar@nepar.hr directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden font-sans text-slate-800">
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={navCopy} />

      <section className="px-4 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: easeOut }}
            className="mb-8 text-center sm:mb-12"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              {copy.eyebrow}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl xl:text-6xl">
              {copy.title}{" "}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
                {copy.titleHighlight}
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
              {copy.description}
            </p>

            {/* Info — inline below heading, no boxes */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {copy.info.map(({ Icon, label, value, href }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-sm text-slate-600 shadow-sm backdrop-blur">
                  <Icon size={14} className="shrink-0 text-blue-600" />
                  <span className="text-slate-500">{label}:</span>
                  {href ? (
                    <a href={href} className="font-medium text-slate-700 transition hover:text-slate-900 select-all">
                      {value}
                    </a>
                  ) : (
                    <span className="font-medium text-slate-700">{value}</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Form card — no overflow-hidden so focus ring is never clipped */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.08, ease: easeOut }}
            className="premium-card contact-panel relative p-5 sm:p-8"
          >
            {/* Decorative blurs in their own clipped wrapper */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute -right-16 -top-16 size-56 rounded-full bg-blue-500/5 blur-3xl" />
              <div className="absolute -bottom-12 -left-12 size-44 rounded-full bg-cyan-500/5 blur-3xl" />
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.24, ease: easeOut }}
                className="relative flex flex-col items-center justify-center gap-4 py-12 text-center"
              >
                <div className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-300/50">
                  <CheckCircle2 size={26} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">{copy.form.successTitle}</h2>
                <p className="max-w-xs text-sm leading-6 text-slate-600">{copy.form.successDesc}</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="pressable mt-1 rounded-lg px-3 py-1.5 text-sm text-blue-600 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  {copy.form.newMessage}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="relative grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">{copy.form.name}</label>
                    <input
                      id="contact-name"
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={copy.form.namePlaceholder}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="text-sm font-medium text-slate-700">{copy.form.email}</label>
                    <input
                      id="contact-email"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={copy.form.emailPlaceholder}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-subject" className="text-sm font-medium text-slate-700">{copy.form.subject}</label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={copy.form.subjectPlaceholder}
                    className={inputCls}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-message" className="text-sm font-medium text-slate-700">{copy.form.message}</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={copy.form.messagePlaceholder}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Upload */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-file" className="text-sm font-medium text-slate-700">{copy.form.uploadLabel}</label>
                  {file ? (
                    <div className="flex items-center gap-3 rounded-xl border border-slate-300/90 bg-white/[0.92] px-4 py-3 shadow-sm shadow-slate-200/40">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="pressable shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
                        aria-label={copy.form.uploadRemove}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className={`pressable flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed px-4 py-7 text-center shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-200 ${
                        dragging
                          ? "border-blue-500/70 bg-blue-50 shadow-blue-200/40"
                          : "border-slate-300 bg-white/65 hover:border-blue-400/60 hover:bg-white hover:shadow-blue-200/30"
                      }`}
                    >
                      <div className="grid size-10 place-items-center rounded-lg bg-blue-100 text-blue-600 ring-1 ring-blue-300/60">
                        <ImagePlus size={18} />
                      </div>
                      <p className="text-sm text-slate-600">
                        {copy.form.uploadHint}{" "}
                        <span className="font-medium text-blue-600">{copy.form.uploadBtn}</span>
                      </p>
                      <p className="text-xs text-slate-500">{copy.form.uploadTypes}</p>
                      <input
                        id="contact-file"
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleFile(e.target.files[0])}
                      />
                    </div>
                  )}
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
                  whileTap={sending ? {} : { scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 460, damping: 32 }}
                  className="premium-button pressable inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto"
                >
                  {sending ? (
                    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : (
                    <Send size={15} />
                  )}
                  {sending ? (lang === "hr" ? "Šaljem…" : "Sending…") : copy.form.submit}
                </motion.button>
              </form>
            )}
          </motion.div>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-slate-500 transition hover:text-slate-900">
              {copy.form.backHome}
            </a>
          </div>

        </div>
      </section>

      <footer className="px-4 pb-8">
        <div className="mx-auto max-w-4xl">
          <div className="border-t border-slate-200 pt-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-blue-700">
                  {navCopy.footer.infoLabel}
                </p>
                <p className="text-sm font-medium text-slate-700">{navCopy.footer.companyName}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-0.5 text-xs text-slate-500">
                  <span>{navCopy.footer.owner}</span>
                  <span>{navCopy.footer.mbo}</span>
                  <a href="mailto:nepar@nepar.hr" className="transition hover:text-slate-900">
                    {navCopy.footer.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 sm:flex-row sm:gap-4 sm:pt-5 sm:text-sm">
              <p>{navCopy.footer.copyright}</p>
              <a href="/" className="transition hover:text-slate-900">
                {copy.form.backHome}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
