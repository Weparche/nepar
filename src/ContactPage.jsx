import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ImagePlus, Mail, MapPin, Send, X } from "lucide-react";
import { Background, content as siteContent, Navbar } from "./App.jsx";

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
  "w-full rounded-[0.75rem] border border-blue-200/15 bg-white/[0.04] px-4 py-3 text-base text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/20";

export default function ContactPage() {
  const [lang, setLang] = useState("hr");
  const copy = contactContent[lang];
  const navCopy = siteContent[lang];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
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
    <main className="relative min-h-screen overflow-x-hidden font-sans text-white">
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={navCopy} />

      <section className="px-4 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-8 text-center sm:mb-12"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
              {copy.eyebrow}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl xl:text-6xl">
              {copy.title}{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                {copy.titleHighlight}
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-400">
              {copy.description}
            </p>

            {/* Info — inline below heading, no boxes */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {copy.info.map(({ Icon, label, value, href }) => (
                <span key={label} className="inline-flex items-center gap-2 text-sm text-slate-400">
                  <Icon size={14} className="shrink-0 text-blue-400" />
                  <span className="text-slate-500">{label}:</span>
                  {href ? (
                    <a href={href} className="font-medium text-slate-300 transition hover:text-white select-all">
                      {value}
                    </a>
                  ) : (
                    <span className="font-medium text-slate-300">{value}</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Form card — no overflow-hidden so focus ring is never clipped */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="relative rounded-[1rem] border border-blue-200/12 bg-white/[0.03] p-5 shadow-2xl shadow-blue-950/20 backdrop-blur-xl sm:p-8"
          >
            {/* Decorative blurs in their own clipped wrapper */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1rem]">
              <div className="absolute -right-16 -top-16 size-56 rounded-full bg-blue-500/8 blur-3xl" />
              <div className="absolute -bottom-12 -left-12 size-44 rounded-full bg-violet-500/8 blur-3xl" />
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex flex-col items-center justify-center gap-4 py-12 text-center"
              >
                <div className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
                  <CheckCircle2 size={26} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">{copy.form.successTitle}</h2>
                <p className="max-w-xs text-sm leading-6 text-slate-400">{copy.form.successDesc}</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-1 text-sm text-blue-400 transition hover:text-blue-300"
                >
                  {copy.form.newMessage}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="relative grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">{copy.form.name}</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={copy.form.namePlaceholder}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">{copy.form.email}</label>
                    <input
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
                  <label className="text-sm font-medium text-slate-300">{copy.form.subject}</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={copy.form.subjectPlaceholder}
                    className={inputCls}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-300">{copy.form.message}</label>
                  <textarea
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
                  <label className="text-sm font-medium text-slate-300">{copy.form.uploadLabel}</label>
                  {file ? (
                    <div className="flex items-center gap-3 rounded-[0.75rem] border border-blue-200/15 bg-white/[0.04] px-4 py-3">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-200">{file.name}</p>
                          <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="shrink-0 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-white"
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
                      className={`flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[0.75rem] border-2 border-dashed px-4 py-7 text-center transition ${
                        dragging
                          ? "border-blue-400/60 bg-blue-500/10"
                          : "border-blue-200/15 bg-white/[0.02] hover:border-blue-400/30 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="grid size-10 place-items-center rounded-[0.65rem] bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/20">
                        <ImagePlus size={18} />
                      </div>
                      <p className="text-sm text-slate-400">
                        {copy.form.uploadHint}{" "}
                        <span className="font-medium text-blue-400">{copy.form.uploadBtn}</span>
                      </p>
                      <p className="text-xs text-slate-600">{copy.form.uploadTypes}</p>
                      <input
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
                  <p className="rounded-[0.75rem] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {sendError}
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={sending ? {} : { y: -2, scale: 1.02 }}
                  whileTap={sending ? {} : { scale: 0.98 }}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-[0.8rem] bg-gradient-to-r from-blue-500 via-blue-500 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-blue-500/45 disabled:opacity-60 sm:w-auto"
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
            <a href="/" className="text-sm text-slate-500 transition hover:text-slate-300">
              {copy.form.backHome}
            </a>
          </div>

        </div>
      </section>

      <footer className="px-4 pb-8">
        <div className="mx-auto max-w-4xl">
          <div className="border-t border-blue-200/10 pt-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-blue-400/60">
                  {navCopy.footer.infoLabel}
                </p>
                <p className="text-sm font-medium text-slate-300">{navCopy.footer.companyName}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-0.5 text-xs text-slate-500">
                  <span>{navCopy.footer.owner}</span>
                  <span>{navCopy.footer.mbo}</span>
                  <a href="mailto:nepar@nepar.hr" className="transition hover:text-slate-300">
                    {navCopy.footer.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-2 border-t border-blue-200/10 pt-4 text-xs text-slate-500 sm:flex-row sm:gap-4 sm:pt-5 sm:text-sm">
              <p>{navCopy.footer.copyright}</p>
              <a href="/" className="transition hover:text-slate-200">
                {copy.form.backHome}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
