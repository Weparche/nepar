// Shared checker + lead-form + implementation-popup logic, copied from src/DigitalPriceListPage.jsx
// so /sidrene-cijene can offer the exact same "provjeri svoju stranicu" mechanism and lead-capture
// rules in its own hero, without touching the working /digitalni-cjenik page. Keep this file's
// checker/lead copy and behaviour in sync with DigitalPriceListPage.jsx if that page's own checker
// ever changes — they are meant to read as the same tool.
import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, CheckCircle2, CircleAlert, Loader2, Search, Send, X } from "lucide-react";
import { getContactWorkerUrl, submitContactLead } from "./contactLead.js";
import { trackEvent } from "./analytics.js";

const easeOut = [0.23, 1, 0.32, 1];
const revealTransition = { duration: 0.35, ease: easeOut };
const spinTransition = { repeat: Infinity, duration: 0.8, ease: "linear" };
const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200";

export const checkerCopy = {
  hr: {
    checkerTitle: "Provjerite digitalni cjenik svoje web stranice", checkerLead: "Unesite adresu. Provjera se izvršava na našem serveru i gleda samo javno dostupne tehničke signale.", checkerButton: "Provjeri", checkerPlaceholder: "https://vasadomena.hr", checkerMissing: "Provjera trenutno nije dostupna. Pokušajte ponovo ili nam pošaljite upit.", checkerInvalid: "Unesite ispravnu adresu, primjerice https://vasadomena.hr.", checkerUnavailableTitle: "Provjera trenutačno nije dostupna", checkerRetry: "Pokušajte ponovo", checkerLoading: "Provjeravamo javno dostupne dokumente…", technicalNotice: "Automatska provjera provjerava tehničku dostupnost XML/CSV cjenika. Ne provjerava obvezu isticanja dodatne/sidrene cijene niti potvrđuje pravnu usklađenost poslovanja.", pricePage: "Stranica cjenika", csvFoundLabel: "Pronađen CSV", xmlFoundLabel: "Pronađen XML", archiveFoundLabel: "Pronađen signal arhive cjenika", csvMissing: "CSV: nije pronađen", xmlMissing: "XML: nije pronađen", archiveMissing: "Signal arhive cjenika: nije pronađen", csvUnconfirmed: "CSV: pronađen link, ali dostupnost nije potvrđena", xmlUnconfirmed: "XML: pronađen link, ali dostupnost nije potvrđena", archiveUnconfirmed: "Signal arhive cjenika: pronađen link, ali dostupnost nije potvrđena", greenTitle: "Pronašli smo digitalni cjenik", greenBody: "Na web stranici pronađen je javno dostupan CSV ili XML dokument.", yellowTitle: "Pronašli smo cjenik, ali ne i XML/CSV", yellowBody: "Na stranici postoje informacije o cijenama ili cjeniku, ali automatska provjera nije pronašla javno dostupan XML ili CSV dokument.", redTitle: "Nismo pronašli digitalni cjenik", redBody: "Automatska provjera nije pronašla javno dostupan XML ili CSV cjenik.", checks: ["Javno dostupni signali", "Bez pravne procjene", "Server-side provjera"], sendInquiry: "Pošaljite upit", requestImplementation: "Zatražite ponudu", sendFoundUrl: "Zatražite pomoć s usklađivanjem", whyNotEnoughTitle: "Zašto sama datoteka možda nije dovoljna?", whyNotEnoughIntro: "Ova provjera potvrđuje samo da je CSV/XML tehnički dostupan na webu. Ne potvrđuje da ispunjavate Odluku o digitalnom cjeniku. Često i dalje nedostaje:", whyNotEnoughItems: [["Arhiva", "prethodne objavljene verzije moraju ostati javno dostupne najmanje 30 dana"], ["Naziv datoteke", "propisani elementi (objekt, adresa, oznaka, broj pohrane, datum i vrijeme)"], ["Sadržaj", "obavezna polja, sidrena/dodatna cijena, posebni oblici prodaje gdje treba"], ["Strojna vidljivost", "softverski alati moraju moći dohvatiti aktualne cijene bez prijave"], ["Ažurnost", "aktualni cjenik mora odgovarati stvarnim cijenama u propisanom roku"]], whyNotEnoughDisclaimer: "Ovo nije pravni savjet — tehnička napomena što ova automatska provjera ne pokriva.",
  },
  en: {
    checkerTitle: "Check your website’s digital price list", checkerLead: "Enter an address. The check runs on our server and looks only at publicly available technical signals.", checkerButton: "Check", checkerPlaceholder: "https://yourdomain.com", checkerMissing: "The check is currently unavailable. Please try again or send us an enquiry.", checkerInvalid: "Enter a valid address, for example https://yourdomain.com.", checkerUnavailableTitle: "The check is currently unavailable", checkerRetry: "Try again", checkerLoading: "Checking publicly available documents…", technicalNotice: "The automated check verifies the technical availability of XML/CSV price lists. It does not check the additional/reference-price obligation or confirm legal compliance.", pricePage: "Price-list page", csvFoundLabel: "CSV found", xmlFoundLabel: "XML found", archiveFoundLabel: "Price-list archive signal found", csvMissing: "CSV: not found", xmlMissing: "XML: not found", archiveMissing: "Price-list archive signal: not found", csvUnconfirmed: "CSV: link found, but availability was not confirmed", xmlUnconfirmed: "XML: link found, but availability was not confirmed", archiveUnconfirmed: "Price-list archive signal: link found, but availability was not confirmed", greenTitle: "We found a digital price list", greenBody: "A publicly available CSV or XML document was found on the website.", yellowTitle: "We found a price list, but not XML/CSV", yellowBody: "The website contains price or price-list information, but the automated check did not find a publicly available XML or CSV document.", redTitle: "We did not find a digital price list", redBody: "The automated check did not find a publicly available XML or CSV price list.", checks: ["Public technical signals", "No legal assessment", "Server-side check"], sendInquiry: "Send an enquiry", requestImplementation: "Request a quote", sendFoundUrl: "Get help closing these gaps", whyNotEnoughTitle: "Why the file alone might not be enough?", whyNotEnoughIntro: "This check only confirms that a CSV/XML file is technically available on the website. It does not confirm that you meet the digital price list Decision. This is often still missing:", whyNotEnoughItems: [["Archive", "previously published versions must remain publicly available for at least 30 days"], ["File name", "the prescribed elements (location, address, code, storage number, date and time)"], ["Content", "required fields, the reference/additional price, special sale formats where applicable"], ["Machine visibility", "software tools must be able to retrieve current prices without logging in"], ["Freshness", "the current price list must match real prices within the prescribed deadline"]], whyNotEnoughDisclaimer: "This is not legal advice — a technical note on what this automated check does not cover.",
  },
};

export const leadFormCopy = {
  hr: {
    formTitle: "Zatražite ponudu", formLead: "Pošaljite nekoliko podataka o postojećoj web stranici i javit ćemo se s konkretnim sljedećim korakom.", fields: { name: "Ime ili naziv tvrtke", email: "E-mail", phone: "Telefon (opcionalno)", website: "Web stranica", platform: "Platforma", program: "Poslovni program (opcionalno)", message: "Poruka", submit: "Pošalji upit" }, formSuccess: "Upit je poslan. Javit ćemo se uskoro.", formError: "Slanje nije uspjelo. Pokušajte ponovo ili pišite na nepar@nepar.hr.", legal: "Informacije na ovoj stranici služe kao tehnički i informativni pregled propisa i ne predstavljaju pravni savjet. Za tumačenje primjenjivosti propisa na konkretno poslovanje obratite se nadležnom tijelu ili pravnom stručnjaku.", close: "Zatvori",
  },
  en: {
    formTitle: "Request a quote", formLead: "Send a few details about your current website and we will reply with a practical next step.", fields: { name: "Name or company", email: "Email", phone: "Phone (optional)", website: "Website", platform: "Platform", program: "Business software (optional)", message: "Message", submit: "Send inquiry" }, formSuccess: "Your inquiry has been sent. We will be in touch soon.", formError: "Sending failed. Please try again or email nepar@nepar.hr.", legal: "Information on this page is a technical and informational overview of Croatian regulation and does not constitute legal advice. For interpretation of the regulation’s applicability to a specific business, contact the competent authority or a legal professional.", close: "Close",
  },
};

function normalizeForPrefill(value) { const trimmed = value.trim(); return trimmed && !/^[a-z][a-z\d+.-]*:/i.test(trimmed) ? `https://${trimmed}` : trimmed; }
function normalizeCheckerUrl(value) { const normalized = normalizeForPrefill(value); if (!normalized || normalized.length > 2048) return null; try { const parsed = new URL(normalized); if (!/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password) return null; return parsed.pathname === "/" && !parsed.search && !parsed.hash ? parsed.origin : parsed.href; } catch { return null; } }
function displayUrl(value) { try { const url = new URL(value); const format = url.searchParams.get("format") || url.searchParams.get("type"); return `${url.pathname || "/"}${format ? `?format=${format}` : ""}`; } catch { return value; } }

export function DigitalCjenikLeadForm({ lang = "hr", initialWebsite = "", firstFieldRef }) {
  const copy = leadFormCopy[lang];
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: initialWebsite, platform: "", businessProgram: "", message: "" });
  const [sending, setSending] = useState(false); const [notice, setNotice] = useState(""); const started = useRef(false);
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const normalizeWebsite = () => setForm((current) => ({ ...current, website: normalizeForPrefill(current.website) }));
  const start = () => { if (!started.current) { started.current = true; trackEvent("start_digital_price_list_lead"); } };
  async function submit(event) { event.preventDefault(); const normalizedWebsite = normalizeForPrefill(form.website); setForm((current) => ({ ...current, website: normalizedWebsite })); setSending(true); setNotice(""); try { const sent = await submitContactLead({ ...form, website: normalizedWebsite, subject: "Digitalni cjenik", formName: "digitalni_cjenik", leadSource: "digitalni-cjenik" }); if (!sent) throw new Error("worker_missing"); trackEvent("generate_digital_price_list_lead"); setNotice(copy.formSuccess); } catch { setNotice(copy.formError); } finally { setSending(false); } }
  return <form onSubmit={submit} onFocusCapture={start} className="grid gap-4"><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.name}<input ref={firstFieldRef} className={inputClass} required value={form.name} onChange={update("name")} /></label><label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.email}<input className={inputClass} required type="email" value={form.email} onChange={update("email")} /></label></div><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.phone}<input className={inputClass} type="tel" value={form.phone} onChange={update("phone")} /></label><label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.website}<input className={inputClass} required type="text" inputMode="url" autoCapitalize="none" value={form.website} onBlur={normalizeWebsite} onChange={update("website")} /></label></div><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.platform}<select className={inputClass} required value={form.platform} onChange={update("platform")}><option value="" disabled>—</option>{["WordPress", "Wix", "React / Next / Vite", "Shopify", "Webflow", "Custom", "Ne znam"].map((value) => <option key={value}>{value}</option>)}</select></label><label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.program}<input className={inputClass} value={form.businessProgram} onChange={update("businessProgram")} /></label></div><label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.message}<textarea className={`${inputClass} min-h-32 resize-y`} required value={form.message} onChange={update("message")} /></label><AnimatePresence>{notice && <motion.p key={notice} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={revealTransition} role="status" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{notice}</motion.p>}</AnimatePresence><button type="submit" disabled={sending} className="button button-primary w-full disabled:cursor-wait disabled:opacity-60 sm:w-fit">{sending ? <motion.span animate={{ rotate: 360 }} transition={spinTransition} className="inline-flex"><Loader2 size={17} aria-hidden="true" /></motion.span> : <Send size={17} aria-hidden="true" />}{sending ? "…" : copy.fields.submit}</button></form>;
}

/** Popup wrapper around DigitalCjenikLeadForm — same fields/rules as the bottom of /digitalni-cjenik,
 * opened from a CTA instead of reached by scrolling. Follows the native <dialog> + focus-management
 * pattern already established in src/PackageInquiryModal.jsx. */
export function DigitalCjenikImplementationModal({ open, onClose, lang = "hr", initialWebsite = "" }) {
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);
  const returnFocusRef = useRef(null);
  const copy = leadFormCopy[lang];
  // Remounts the form fresh on every open (not just when initialWebsite changes) so a
  // closed-without-submitting draft, or a lingering success/error notice, never survives
  // into the next time this modal is opened — even when reopened with the same website.
  const [sessionId, setSessionId] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement;
      setSessionId((value) => value + 1);
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
    onClose();
    if (returnFocusRef.current instanceof HTMLElement) returnFocusRef.current.focus();
  }

  return (
    <dialog
      ref={dialogRef}
      className="inquiry-dialog"
      aria-labelledby="digital-cjenik-implementation-title"
      onClose={handleClose}
      onClick={(event) => { if (event.target === dialogRef.current) closeDialog(); }}
    >
      <div className="dialog-panel">
        <header className="dialog-header">
          <div><h2 id="digital-cjenik-implementation-title">{copy.formTitle}</h2><p>{copy.formLead}</p></div>
          <button type="button" className="icon-button" aria-label={copy.close} onClick={closeDialog}><X aria-hidden="true" /></button>
        </header>
        <div className="dialog-body">
          <DigitalCjenikLeadForm key={sessionId} lang={lang} initialWebsite={initialWebsite} firstFieldRef={firstFieldRef} />
          <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">{copy.legal}</p>
        </div>
      </div>
    </dialog>
  );
}

/** The checker mechanism itself, copied verbatim from src/DigitalPriceListPage.jsx's hero so
 * /sidrene-cijene can offer the same "provjeri svoju stranicu" tool. `onRequestImplementation`
 * replaces that page's `goTo(formRef, true)` — the caller decides what "request implementation"
 * means on its own page (there: scroll to the inline form; here: open the popup). */
export function DigitalCjenikChecker({ lang = "hr", onRequestImplementation }) {
  const copy = checkerCopy[lang];
  const inputId = useId();
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkedWebsite, setCheckedWebsite] = useState("");
  const [checkId, setCheckId] = useState(0);

  async function check(event) {
    event?.preventDefault();
    const normalized = normalizeCheckerUrl(url);
    if (!normalized) { setUrlError(copy.checkerInvalid); setResult(null); return; }
    setUrl(normalized); setUrlError("");
    const workerUrl = getContactWorkerUrl();
    if (!workerUrl) { setResult({ unavailable: true, status: "unavailable", message: copy.checkerMissing, details: {} }); return; }
    setChecking(true); setResult(null); setCheckId((value) => value + 1);
    trackEvent("start_price_list_check");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${workerUrl}/api/digitalni-cjenik/check`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: normalized }), signal: controller.signal });
      const payload = await response.json().catch(() => null);
      if (!payload || !["green", "yellow", "red"].includes(payload.status)) throw new Error("invalid_response");
      setCheckedWebsite(normalized);
      setResult(payload);
      trackEvent("price_list_check_result", { result: payload.status });
    } catch {
      setResult({ unavailable: true, status: "unavailable", message: copy.checkerMissing, details: {} });
    } finally {
      clearTimeout(timeout);
      setChecking(false);
    }
  }

  const resultTitle = result?.unavailable ? copy.checkerUnavailableTitle : result?.status === "green" ? copy.greenTitle : result?.status === "yellow" ? copy.yellowTitle : copy.redTitle;
  const resultBody = result?.unavailable || result?.status === "red" ? result?.message || copy.redBody : result?.status === "green" ? copy.greenBody : copy.yellowBody;
  const statusColor = result?.unavailable ? "border-slate-300 bg-slate-50" : result?.status === "green" ? "border-emerald-200 bg-emerald-50" : result?.status === "yellow" ? "border-amber-200 bg-amber-50" : "border-rose-200 bg-rose-50";

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white sm:p-7">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-300 text-blue-950"><Search size={20} aria-hidden="true" /></span>
        <div><h2 className="text-2xl font-semibold tracking-[-0.025em]">{copy.checkerTitle}</h2><p className="mt-1 max-w-xl text-sm leading-6 text-slate-300">{copy.checkerLead}</p></div>
      </div>
      <form onSubmit={check} noValidate className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor={inputId}>{copy.checkerTitle}</label>
        <input
          id={inputId}
          aria-invalid={Boolean(urlError)}
          aria-describedby={urlError ? `${helpId} ${errorId}` : helpId}
          className={`min-h-14 w-full rounded-xl border bg-white px-4 text-base font-medium text-slate-950 outline-none transition placeholder:text-slate-500 focus:ring-2 ${urlError ? "border-rose-400 focus:border-rose-400 focus:ring-rose-300" : "border-white/20 focus:border-cyan-300 focus:ring-cyan-300"}`}
          required type="text" value={url}
          onChange={(event) => { setUrl(event.target.value); if (urlError) setUrlError(""); }}
          onBlur={() => { const normalized = normalizeCheckerUrl(url); if (normalized) { setUrl(normalized); setUrlError(""); } }}
          placeholder={copy.checkerPlaceholder} inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck="false"
        />
        <button className="button min-h-14 shrink-0 bg-cyan-300 text-blue-950 hover:bg-cyan-200" disabled={checking} type="submit">
          {checking ? copy.checkerLoading : copy.checkerButton}
          {checking ? <motion.span animate={{ rotate: 360 }} transition={spinTransition} className="inline-flex"><Loader2 size={18} aria-hidden="true" /></motion.span> : <ArrowRight size={18} aria-hidden="true" />}
        </button>
      </form>
      <div className="mt-3 space-y-1">
        <p id={helpId} className="text-xs leading-5 text-slate-300">{lang === "hr" ? "Možete unijeti i samo vasadomena.hr — dodat ćemo https://." : "You can enter yourdomain.com — we will add https://."}</p>
        {urlError && <p id={errorId} role="alert" className="text-sm font-semibold text-rose-200">{urlError}</p>}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-300">{copy.checks.map((item) => <span key={item} className="inline-flex items-center gap-1.5"><Check size={15} className="text-cyan-300" aria-hidden="true" />{item}</span>)}</div>
      <p className="mt-4 max-w-xl text-xs leading-5 text-slate-400">{copy.technicalNotice}</p>
      <AnimatePresence>
        {result && (
          <motion.div key={checkId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={revealTransition} aria-live="polite" className={`mt-5 rounded-xl border p-5 ${statusColor}`}>
            <div className="flex gap-3">
              <div className="mt-0.5">{result.status === "green" ? <CheckCircle2 className="text-emerald-700" aria-hidden="true" /> : <CircleAlert className={result.unavailable ? "text-slate-700" : result.status === "red" ? "text-rose-700" : "text-amber-700"} aria-hidden="true" />}</div>
              <div>
                <h3 className="text-lg font-bold text-slate-950">{resultTitle}</h3>
                <p className="mt-1 leading-6 text-slate-700">{resultBody}</p>
                {!result.unavailable && (
                  <div className="mt-4 grid gap-1.5 text-sm text-slate-700">
                    {result.details?.pricePageUrl && <span>{copy.pricePage}: <strong title={result.details.pricePageUrl}>{displayUrl(result.details.pricePageUrl)}</strong></span>}
                    {result.details?.csvUrl ? <span>{copy.csvFoundLabel}: <strong title={result.details.csvUrl}>{displayUrl(result.details.csvUrl)}</strong></span> : result.details?.csvLinkDiscovered ? <span>{copy.csvUnconfirmed}</span> : <span>{copy.csvMissing}</span>}
                    {result.details?.xmlUrl ? <span>{copy.xmlFoundLabel}: <strong title={result.details.xmlUrl}>{displayUrl(result.details.xmlUrl)}</strong></span> : result.details?.xmlLinkDiscovered ? <span>{copy.xmlUnconfirmed}</span> : <span>{copy.xmlMissing}</span>}
                    {result.details?.archiveUrl ? <span>{copy.archiveFoundLabel}: <strong title={result.details.archiveUrl}>{displayUrl(result.details.archiveUrl)}</strong></span> : result.details?.archiveLinkDiscovered ? <span>{copy.archiveUnconfirmed}</span> : <span>{copy.archiveMissing}</span>}
                  </div>
                )}
                {result.status === "green" && (
                  <div className="mt-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-4">
                    <p className="text-sm font-bold text-amber-900">{copy.whyNotEnoughTitle}</p>
                    <p className="mt-1.5 text-sm leading-6 text-amber-950">{copy.whyNotEnoughIntro}</p>
                    <ul className="mt-3 grid gap-1.5 text-sm leading-6 text-amber-950">
                      {copy.whyNotEnoughItems.map(([label, description]) => (
                        <li key={label}><strong>{label}</strong> — {description}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs leading-5 text-amber-800">{copy.whyNotEnoughDisclaimer}</p>
                  </div>
                )}
                {result.unavailable ? (
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button className="button button-secondary" onClick={check}>{copy.checkerRetry}<ArrowRight size={17} aria-hidden="true" /></button>
                    <button className="button button-primary" onClick={() => onRequestImplementation(checkedWebsite)}>{copy.sendInquiry}<ArrowRight size={17} aria-hidden="true" /></button>
                  </div>
                ) : result.status === "green" ? (
                  <button className="button button-primary mt-5" onClick={() => onRequestImplementation(checkedWebsite)}>{copy.sendFoundUrl}<ArrowRight size={17} aria-hidden="true" /></button>
                ) : (
                  <button className="button button-primary mt-5" onClick={() => onRequestImplementation(checkedWebsite)}>{copy.requestImplementation}<ArrowRight size={17} aria-hidden="true" /></button>
                )}
                {result.status !== "green" && (
                  <p className="mt-4 text-xs leading-5 text-slate-600">{copy.technicalNotice}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
