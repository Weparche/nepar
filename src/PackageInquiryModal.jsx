import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Send, X } from "lucide-react";

const copy = {
  hr: {
    title: "Pošaljite upit",
    subtitle: "Javit ćemo se s preporukom i sljedećim korakom.",
    close: "Zatvori upit",
    offer: "Odabrana usluga",
    price: "Cijena",
    kinds: { build: "Jednokratna izrada", maintenance: "Godišnje održavanje", additional: "Dodatna usluga" },
    name: "Ime i prezime",
    namePlaceholder: "Vaše ime i prezime",
    email: "E-mail adresa",
    emailPlaceholder: "vas@email.com",
    message: "Kratko opišite projekt",
    messagePlaceholder: "Čime se bavite, što web treba sadržavati i koji vam je glavni cilj?",
    submit: "Pošalji upit",
    sending: "Šaljem…",
    successTitle: "Upit je pripremljen",
    successText: "Hvala. Javit ćemo se čim pregledamo podatke o projektu.",
    error: "Slanje nije uspjelo. Pokušajte ponovo ili pišite na nepar@nepar.hr.",
  },
  en: {
    title: "Send an inquiry",
    subtitle: "We will respond with a recommendation and the next step.",
    close: "Close inquiry",
    offer: "Selected service",
    price: "Price",
    kinds: { build: "One-time development", maintenance: "Annual maintenance", additional: "Additional service" },
    name: "Full name",
    namePlaceholder: "Your full name",
    email: "Email address",
    emailPlaceholder: "you@email.com",
    message: "Briefly describe the project",
    messagePlaceholder: "What does your business do, what should the website include, and what is the main goal?",
    submit: "Send inquiry",
    sending: "Sending…",
    successTitle: "Your inquiry is ready",
    successText: "Thank you. We will respond after reviewing the project details.",
    error: "Sending failed. Please try again or email nepar@nepar.hr.",
  },
};

export default function PackageInquiryModal({ open, onClose, lang = "hr", offerKind = "build", offerName, priceLabel }) {
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);
  const returnFocusRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sendError, setSendError] = useState("");
  const text = copy[lang];
  const WORKER_URL = import.meta.env.VITE_WORKER_URL || null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement;
      dialog.showModal();
      window.setTimeout(() => firstFieldRef.current?.focus(), 0);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleClose() {
    setSubmitted(false);
    setSendError("");
    onClose();
    if (returnFocusRef.current instanceof HTMLElement) returnFocusRef.current.focus();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setSendError("");
    const kindLabel = text.kinds[offerKind];
    const subject = `${offerName} — ${kindLabel} (${priceLabel})`;
    const bodyText = [
      `Usluga: ${offerName}`,
      `Vrsta: ${kindLabel}`,
      `Cijena: ${priceLabel}`,
      "",
      `Ime: ${name}`,
      `E-mail: ${email}`,
      "",
      "Poruka:",
      message,
    ].join("\n");

    if (!WORKER_URL) {
      window.location.href = `mailto:nepar@nepar.hr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      setSending(false);
      setSubmitted(true);
      return;
    }

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message: bodyText }),
      });
      if (!response.ok) throw new Error("send_failed");
      setSubmitted(true);
    } catch {
      setSendError(text.error);
    } finally {
      setSending(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="inquiry-dialog"
      aria-labelledby="inquiry-title"
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) closeDialog();
      }}
    >
      <div className="dialog-panel">
        <header className="dialog-header">
          <div><h2 id="inquiry-title">{text.title}</h2><p>{text.subtitle}</p></div>
          <button type="button" className="icon-button" aria-label={text.close} onClick={closeDialog}><X aria-hidden="true" /></button>
        </header>

        <div className="dialog-body">
          <div className="selected-offer">
            <div><span>{text.offer}</span><strong>{offerName}</strong><small>{text.kinds[offerKind]}</small></div>
            <div><span>{text.price}</span><strong>{priceLabel}</strong></div>
          </div>

          {submitted ? (
            <div className="dialog-success" role="status">
              <CheckCircle2 aria-hidden="true" size={42} />
              <h3>{text.successTitle}</h3>
              <p>{text.successText}</p>
              <button type="button" className="button button-secondary" onClick={closeDialog}>{text.close}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="inquiry-form">
              <label htmlFor="inquiry-name">{text.name}</label>
              <input ref={firstFieldRef} id="inquiry-name" type="text" required value={name} onChange={(event) => setName(event.target.value)} placeholder={text.namePlaceholder} />
              <label htmlFor="inquiry-email">{text.email}</label>
              <input id="inquiry-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder={text.emailPlaceholder} />
              <label htmlFor="inquiry-message">{text.message}</label>
              <textarea id="inquiry-message" required rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={text.messagePlaceholder} />
              {sendError && <p className="form-error" role="alert">{sendError}</p>}
              <button type="submit" className="button button-primary" disabled={sending}>{sending ? text.sending : text.submit}<Send aria-hidden="true" size={17} /></button>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
