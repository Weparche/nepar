import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Coffee,
  ConciergeBell,
  Home,
  MonitorSmartphone,
  PartyPopper,
  Scissors,
  Send,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Background, MotionButton, Navbar, content as siteContent } from "./App.jsx";
import { usePageMeta } from "./usePageMeta.js";

const PILOT_FILLED = 6;
const PILOT_TOTAL = 10;

const pageCopy = {
  hr: {
    meta: {
      title: "Web stranica bez početnog troška | Nepar",
      description:
        "Moderna web stranica za male biznise bez početnog troška izrade. Prvih 7 dana pregled bez obveze, zatim mjesečna pretplata uz mogućnost otkazivanja.",
    },
    hero: {
      badge: "Pilot ponuda: 30 €/mj za prvih 10 klijenata",
      title: "Web stranica bez početnog troška",
      subtitle:
        "Napravimo vam modernu web stranicu, vi je pregledate bez rizika, a ako vam se sviđa — ostaje aktivna kroz mjesečnu pretplatu.",
      primary: "Želim besplatan prijedlog stranice",
      secondary: "Kako funkcionira",
      pilotLabel: "Pilot popunjenost",
      pilotNote: "30 €/mj — preostalo mjesta",
      pilotFilled: "mjesta popunjeno",
      pilotRemaining: "mjesta preostalo",
    },
    audience: {
      eyebrow: "ZA KOGA JE OVO?",
      title: "Profesionalan web za lokalne biznise koji ne žele veliku početnu investiciju.",
      items: [
        {
          title: "Obrti i lokalne usluge",
          description: "Predstavite usluge, radno vrijeme i kontakt na jednom mjestu.",
          Icon: Building2,
          iconCls: "bg-blue-500/15 text-blue-600 ring-blue-400/20",
        },
        {
          title: "Saloni i beauty djelatnosti",
          description: "Prikažite tretmane, cjenik i način rezervacije bez kompliciranog sustava.",
          Icon: Scissors,
          iconCls: "bg-fuchsia-500/15 text-fuchsia-600 ring-fuchsia-400/20",
        },
        {
          title: "Dječje igraonice i rođendaonice",
          description: "Roditeljima odmah pokažite pakete, lokacije i kako rezervirati rođendan.",
          Icon: PartyPopper,
          iconCls: "bg-violet-500/15 text-violet-600 ring-violet-400/20",
        },
        {
          title: "Restorani, kafići i dostava",
          description: "Jelovnik, lokacija i kontakt dostupni u nekoliko klikova s mobitela.",
          Icon: Coffee,
          iconCls: "bg-amber-500/15 text-amber-600 ring-amber-400/20",
        },
        {
          title: "Apartmani i turističke usluge",
          description: "Fotografije, sadržaj, kontakt i lokacija za goste koji traže smještaj.",
          Icon: Home,
          iconCls: "bg-cyan-500/15 text-cyan-600 ring-cyan-400/20",
        },
        {
          title: "Servisi i majstori",
          description: "Poziv na akciju, usluge i područje rada kad vas netko traži lokalno.",
          Icon: Wrench,
          iconCls: "bg-slate-500/15 text-slate-700 ring-slate-400/20",
        },
      ],
    },
    steps: {
      eyebrow: "KAKO FUNKCIONIRA?",
      title: "Od upita do aktivne stranice u četiri jasna koraka.",
      items: [
        {
          title: "Pošaljete osnovne podatke",
          description:
            "Naziv, djelatnost, usluge, lokaciju, kontakt, slike i što želite istaknuti.",
        },
        {
          title: "Pripremimo prijedlog stranice",
          description:
            "Dobivate moderan preview s tekstovima, dizajnom, kontakt gumbom i osnovnim SEO postavkama.",
        },
        {
          title: "Pregledate bez rizika",
          description: "Prvih 7 dana možete pregledati prijedlog bez obveze.",
        },
        {
          title: "Aktivirate samo ako vam odgovara",
          description:
            "Ako vam se sviđa, stranica ide online i plaća se mjesečna pretplata.",
        },
      ],
    },
    pricing: {
      eyebrow: "CIJENA",
      name: "Web Start",
      price: "30 €/mj",
      pilotNote: "Pilot cijena za prvih 10 klijenata",
      regular: "Redovna cijena: 49 €/mj",
      noUpfront: "Bez početnog troška izrade.",
      noContract: "Bez dugoročne ugovorne obveze.",
      included: [
        "moderna landing stranica",
        "desktop i mobile verzija",
        "osnovni SEO naslov i opis",
        "kontakt forma ili WhatsApp gumb",
        "Google mapa / lokacija",
        "hosting i SSL",
        "jedna manja izmjena mjesečno",
        "otkazivanje u bilo kojem trenutku",
      ],
    },
    risk: {
      eyebrow: "BEZ RIZIKA",
      title: "Aktivirate samo ako vam odgovara. Otkazujete kad god želite.",
      lead:
        "Ako ne vidite potrebu za webom, možete otkazati u bilo kojem trenutku. Pretplata se prekida, a stranica se deaktivira.",
      legal:
        "Stranica ostaje aktivna dok traje mjesečna pretplata. Klijent može otkazati uslugu u bilo kojem trenutku. Nakon otkazivanja stranica se deaktivira. Domena, ako je registrirana na ime klijenta, ostaje vlasništvo klijenta. Izvorni kod i dizajn nisu uključeni u pretplatu osim ako se posebno ne dogovori otkup stranice.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Česta pitanja",
      items: [
        {
          q: "Moram li platiti izradu stranice?",
          a: "Ne. Kod ove ponude nema početnog troška izrade. Plaća se samo mjesečna pretplata ako odlučite aktivirati stranicu.",
        },
        {
          q: "Koliko traje besplatan pregled?",
          a: "Prvih 7 dana možete pregledati prijedlog stranice bez obveze.",
        },
        {
          q: "Mogu li otkazati kad god želim?",
          a: "Da. Nema dugoročne ugovorne obveze. Ako otkažete, stranica se deaktivira.",
        },
        {
          q: "Što ako želim zadržati web bez pretplate?",
          a: "Moguć je jednokratni otkup stranice prema dogovoru.",
        },
        {
          q: "Za koje djelatnosti je ova ponuda najbolja?",
          a: "Najviše smisla ima za male obrte, salone, restorane, igraonice, servise, apartmane i lokalne usluge koje žele brzo dobiti profesionalnu online prisutnost.",
        },
      ],
    },
    finalCta: {
      title: "Želite da pripremimo prijedlog vaše stranice?",
      description:
        "Pošaljite osnovne podatke o poslu i pripremit ćemo vam prijedlog web stranice bez početnog troška.",
      button: "Pošaljite upit",
    },
    backHome: "← Natrag na početnu",
  },
  en: {
    meta: {
      title: "Website with no upfront cost | Nepar",
      description:
        "A modern website for small businesses with no upfront build cost. Review free for 7 days, then a monthly subscription you can cancel anytime.",
    },
    hero: {
      badge: "Pilot offer: €30/mo for the first 10 clients",
      title: "Website with no upfront cost",
      subtitle:
        "We build a modern website for you. You review it risk-free, and if you like it, it stays live through a monthly subscription.",
      primary: "I want a free website proposal",
      secondary: "How it works",
      pilotLabel: "Pilot availability",
      pilotNote: "€30/mo — spots remaining",
      pilotFilled: "spots taken",
      pilotRemaining: "spots left",
    },
    audience: {
      eyebrow: "WHO IS THIS FOR?",
      title: "A professional website for local businesses that don't want a large upfront investment.",
      items: [
        {
          title: "Trades and local services",
          description: "Present your services, opening hours, and contact in one place.",
          Icon: Building2,
          iconCls: "bg-blue-500/15 text-blue-600 ring-blue-400/20",
        },
        {
          title: "Salons and beauty businesses",
          description: "Show treatments, pricing, and booking without a complex system.",
          Icon: Scissors,
          iconCls: "bg-fuchsia-500/15 text-fuchsia-600 ring-fuchsia-400/20",
        },
        {
          title: "Kids' playrooms and party venues",
          description: "Show parents packages, locations, and how to book a birthday party.",
          Icon: PartyPopper,
          iconCls: "bg-violet-500/15 text-violet-600 ring-violet-400/20",
        },
        {
          title: "Restaurants, cafés, and delivery",
          description: "Menu, location, and contact available in a few taps on mobile.",
          Icon: Coffee,
          iconCls: "bg-amber-500/15 text-amber-600 ring-amber-400/20",
        },
        {
          title: "Apartments and tourism services",
          description: "Photos, content, contact, and location for guests looking for accommodation.",
          Icon: Home,
          iconCls: "bg-cyan-500/15 text-cyan-600 ring-cyan-400/20",
        },
        {
          title: "Repair services and tradespeople",
          description: "A clear call to action, services, and service area when locals search for you.",
          Icon: Wrench,
          iconCls: "bg-slate-500/15 text-slate-700 ring-slate-400/20",
        },
      ],
    },
    steps: {
      eyebrow: "HOW IT WORKS",
      title: "From inquiry to a live website in four clear steps.",
      items: [
        {
          title: "You send basic details",
          description: "Business name, activity, services, location, contact, images, and what to highlight.",
        },
        {
          title: "We prepare a website proposal",
          description:
            "You receive a modern preview with copy, design, a contact button, and basic SEO settings.",
        },
        {
          title: "You review risk-free",
          description: "For the first 7 days you can review the proposal with no obligation.",
        },
        {
          title: "You activate only if it fits",
          description: "If you like it, the site goes live and you pay a monthly subscription.",
        },
      ],
    },
    pricing: {
      eyebrow: "PRICING",
      name: "Web Start",
      price: "€30/mo",
      pilotNote: "Pilot price for the first 10 clients",
      regular: "Regular price: €49/mo",
      noUpfront: "No upfront build cost.",
      noContract: "No long-term contract.",
      included: [
        "modern landing page",
        "desktop and mobile version",
        "basic SEO title and description",
        "contact form or WhatsApp button",
        "Google map / location",
        "hosting and SSL",
        "one minor change per month",
        "cancel anytime",
      ],
    },
    risk: {
      eyebrow: "NO RISK",
      title: "Activate only if it works for you. Cancel whenever you want.",
      lead:
        "If you no longer need the website, you can cancel anytime. The subscription stops and the site is deactivated.",
      legal:
        "The website stays live while the monthly subscription is active. The client can cancel at any time. After cancellation the site is deactivated. If the domain is registered in the client's name, it remains the client's property. Source code and design are not included in the subscription unless a buyout is agreed separately.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common questions",
      items: [
        {
          q: "Do I have to pay for the website build?",
          a: "No. This offer has no upfront build cost. You only pay a monthly subscription if you decide to activate the site.",
        },
        {
          q: "How long is the free review period?",
          a: "You can review the proposal for the first 7 days with no obligation.",
        },
        {
          q: "Can I cancel whenever I want?",
          a: "Yes. There is no long-term contract. If you cancel, the site is deactivated.",
        },
        {
          q: "What if I want to keep the website without a subscription?",
          a: "A one-time buyout of the website is possible by agreement.",
        },
        {
          q: "Which businesses is this offer best for?",
          a: "It works best for small trades, salons, restaurants, playrooms, repair services, apartments, and local businesses that want a professional online presence quickly.",
        },
      ],
    },
    finalCta: {
      title: "Want us to prepare a proposal for your website?",
      description:
        "Send basic business details and we'll prepare a website proposal with no upfront cost.",
      button: "Send an inquiry",
    },
    backHome: "← Back to home",
  },
};

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

function SectionEyebrow({ children }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{children}</p>
  );
}

function PilotCapacityBox({ copy }) {
  const remaining = PILOT_TOTAL - PILOT_FILLED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.42, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-white/90 p-5 shadow-xl shadow-blue-200/35 backdrop-blur-md sm:p-6"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-cyan-400/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 size-24 rounded-full bg-violet-400/12 blur-2xl" />
      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-blue-600">
              {copy.hero.pilotLabel}
            </p>
            <p className="mt-1 text-sm text-slate-600">{copy.hero.pilotNote}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/80">
            <Sparkles size={13} />
            30 €/mj
          </span>
        </div>

        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: PILOT_TOTAL }, (_, index) => {
            const filled = index < PILOT_FILLED;
            return (
              <motion.span
                key={index}
                initial={{ scaleY: 0.4, opacity: 0.5 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`block h-9 origin-bottom rounded-md ${
                  filled
                    ? "bg-gradient-to-t from-blue-600 to-violet-500 shadow-sm shadow-blue-500/25"
                    : "bg-slate-100 ring-1 ring-slate-200/80"
                }`}
                aria-hidden="true"
              />
            );
          })}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="text-2xl font-semibold tabular-nums text-slate-900">
            {PILOT_FILLED}
            <span className="text-lg font-medium text-slate-400"> / {PILOT_TOTAL}</span>
          </p>
          <p className="text-right text-sm text-slate-600">
            <span className="block font-medium text-slate-800">{copy.hero.pilotFilled}</span>
            {remaining} {copy.hero.pilotRemaining}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function FaqItem({ question, answer, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div {...reveal} transition={{ ...reveal.transition, delay: index * 0.05 }} className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-slate-900 sm:text-base">{question}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-sm leading-6 text-slate-600">{answer}</p>
      </motion.div>
    </motion.div>
  );
}

export default function WebStartPage() {
  const [lang, setLang] = useState("hr");
  const navCopy = siteContent[lang];
  const copy = pageCopy[lang];

  usePageMeta({
    title: copy.meta.title,
    description: copy.meta.description,
    path: "/usluge/web-stranica-bez-pocetnog-troska",
  });

  const contactHref = `/kontakt?tema=${encodeURIComponent("Web Start — besplatan prijedlog stranice")}`;

  return (
    <main className="relative min-h-screen overflow-x-hidden font-sans text-slate-800">
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={navCopy} />

      <section className="px-4 pt-24 pb-10 sm:pt-32 sm:pb-14">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:max-w-[1380px] lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.55fr)] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="hero-kicker mb-5 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] shadow-lg shadow-violet-500/10">
              <ConciergeBell size={15} />
              <span className="hero-kicker-text">{copy.hero.badge}</span>
            </div>

            <h1 className="text-4xl font-semibold leading-[1.06] tracking-normal text-slate-900 sm:text-5xl xl:text-[3.35rem]">
              {copy.hero.title}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{copy.hero.subtitle}</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <MotionButton href={contactHref} className="inline-flex px-6 py-4">
                {copy.hero.primary}
                <Send size={18} />
              </MotionButton>
              <MotionButton href="#kako-funkcionira" variant="secondary" className="inline-flex px-6 py-4">
                {copy.hero.secondary}
                <ArrowRight size={18} />
              </MotionButton>
            </div>
          </motion.div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-500/10 via-cyan-400/10 to-violet-500/10 blur-2xl" />
            <PilotCapacityBox copy={copy} />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.55 }}
              className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-lg shadow-slate-200/40"
            >
              <MonitorSmartphone size={18} className="shrink-0 text-blue-600" />
              <span>{lang === "hr" ? "Desktop i mobile verzija uključeni u paket." : "Desktop and mobile versions included."}</span>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-[1180px] lg:max-w-[1380px]">
          <motion.div {...reveal} className="mb-8 max-w-2xl">
            <SectionEyebrow>{copy.audience.eyebrow}</SectionEyebrow>
            <h2 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">{copy.audience.title}</h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.audience.items.map(({ title, description, Icon, iconCls }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-xl shadow-slate-300/35 backdrop-blur-md"
              >
                <div className={`mb-4 grid size-12 place-items-center rounded-2xl ring-1 ${iconCls}`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="kako-funkcionira" className="scroll-mt-28 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-[1180px] lg:max-w-[1380px]">
          <motion.div {...reveal} className="mb-8 max-w-2xl">
            <SectionEyebrow>{copy.steps.eyebrow}</SectionEyebrow>
            <h2 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">{copy.steps.title}</h2>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-2">
            {copy.steps.items.map(({ title, description }, index) => (
              <motion.article
                key={title}
                {...reveal}
                transition={{ ...reveal.transition, delay: index * 0.08 }}
                className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-lg shadow-slate-300/30"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white shadow-md shadow-blue-500/25">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-[1180px] lg:max-w-[1380px]">
          <motion.div
            {...reveal}
            className="relative overflow-hidden rounded-2xl border border-blue-200/70 bg-white/85 p-6 shadow-2xl shadow-blue-200/35 backdrop-blur-md sm:p-8 lg:max-w-xl"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-blue-500/10 blur-3xl" />
            <SectionEyebrow>{copy.pricing.eyebrow}</SectionEyebrow>
            <h2 className="text-2xl font-semibold text-slate-900">{copy.pricing.name}</h2>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{copy.pricing.price}</p>
            <p className="mt-2 text-sm font-medium text-blue-700">{copy.pricing.pilotNote}</p>
            <p className="mt-1 text-sm text-slate-500">{copy.pricing.regular}</p>

            <ul className="mt-6 space-y-3">
              {copy.pricing.included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <Check size={16} className="mt-0.5 shrink-0 text-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-1 border-t border-slate-200 pt-5 text-sm text-slate-600">
              <p>{copy.pricing.noUpfront}</p>
              <p>{copy.pricing.noContract}</p>
            </div>

            <MotionButton href={contactHref} className="mt-6 inline-flex w-full px-6 py-4 sm:w-auto">
              {copy.hero.primary}
              <ArrowRight size={18} />
            </MotionButton>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-[1180px] rounded-2xl border border-slate-200/80 bg-white/75 p-6 shadow-xl shadow-slate-300/30 sm:p-8 lg:max-w-[1380px]">
          <motion.div {...reveal}>
            <SectionEyebrow>{copy.risk.eyebrow}</SectionEyebrow>
            <h2 className="max-w-3xl text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">{copy.risk.title}</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{copy.risk.lead}</p>
            <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-500">{copy.risk.legal}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 ring-1 ring-blue-200/70">
              <ShieldCheck size={16} />
              {lang === "hr" ? "Bez skrivenih troškova izrade" : "No hidden build fees"}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-[1180px] lg:max-w-[1380px]">
          <motion.div {...reveal} className="mb-6">
            <SectionEyebrow>{copy.faq.eyebrow}</SectionEyebrow>
            <h2 className="text-3xl font-semibold text-slate-900">{copy.faq.title}</h2>
          </motion.div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/75 px-5 shadow-xl shadow-slate-300/30 sm:px-6">
            {copy.faq.items.map((item, index) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-4 sm:pb-24">
        <motion.div
          {...reveal}
          className="relative mx-auto max-w-[1180px] overflow-hidden rounded-2xl border border-blue-300/40 bg-white/85 px-6 py-8 text-center shadow-2xl shadow-blue-200/35 sm:px-10 sm:py-10 lg:max-w-[1380px]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/8 via-violet-500/8 to-cyan-400/8" />
          <div className="relative">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{copy.finalCta.title}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">{copy.finalCta.description}</p>
            <MotionButton href={contactHref} className="mt-6 inline-flex px-6 py-4">
              {copy.finalCta.button}
              <Send size={18} />
            </MotionButton>
          </div>
        </motion.div>
      </section>

      <footer className="px-4 pb-10">
        <div className="mx-auto max-w-[1180px] lg:max-w-[1380px]">
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
                {copy.backHome}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
