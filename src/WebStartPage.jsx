import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  Coffee,
  Home,
  Link2,
  Megaphone,
  MessageCircle,
  MonitorSmartphone,
  PartyPopper,
  Scissors,
  Send,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Background, MotionButton, Navbar, content as siteContent } from "./App.jsx";
import PackageInquiryModal from "./PackageInquiryModal.jsx";
import { usePageMeta } from "./usePageMeta.js";

const PILOT_FILLED = 6;
const PILOT_TOTAL = 10;
const easeOut = [0.22, 1, 0.36, 1];

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: easeOut },
};

function formatPrice(amount, perMonthLabel) {
  return `${amount} €${perMonthLabel}`;
}

function getPackagePrice(pkg, billing) {
  return billing === "yearly" ? pkg.yearlyPrice : pkg.monthlyPrice;
}

function buildPriceLabel(pkg, billing, labels) {
  const price = getPackagePrice(pkg, billing);
  const per = formatPrice(price, labels.perMonth);
  if (billing === "yearly") {
    return `${per} (${price * 12} € ${labels.yearlyBilled})`;
  }
  return per;
}

const pageCopy = {
  hr: {
    meta: {
      title: "Web stranica bez početnog troška | Nepar",
      description:
        "Profesionalna web stranica za male biznise bez početnog troška izrade. Jedan link za Instagram, Facebook, Google Maps i WhatsApp, uz pakete od 30, 59 i 89 EUR mjesečno.",
    },
    hero: {
      badge: "Bez početnog troška izrade · od 30 €/mj u pilot ponudi",
      title: "Jedan profesionalni link za vaš posao",
      subtitle:
        "Povežite Instagram, Facebook, Google Maps i WhatsApp na jednu prodajnu stranicu koja klijentu odmah pokazuje što nudite i kako vas može kontaktirati.",
      highlight:
        "Jedan profesionalni link koji pretvara Instagram, Facebook i Google Maps posjete u konkretne upite.",
      primary: "Želim besplatan prijedlog stranice",
      secondary: "Pogledaj pakete",
      pilotLabel: "Pilot popunjenost",
      pilotNote: "30 €/mj — preostalo mjesta",
      pilotFilled: "mjesta popunjeno",
      pilotRemaining: "mjesta preostalo",
      channelsNote: "Jedan link za Instagram, Facebook, Google Maps, WhatsApp i oglase.",
    },
    objection: {
      title: "„Imamo Instagram i Google Maps. Treba li nam web?”",
      text: "Instagram, Facebook i Google Maps odlični su za vidljivost. Ali kada potencijalni klijent želi brzo vidjeti vašu ponudu, slike, lokaciju, najčešća pitanja i poslati upit — treba mu jedno jasno mjesto. Zato ova stranica nije zamjena za društvene mreže, nego profesionalni link koji ih povezuje i pretvara interes u konkretan kontakt.",
    },
    audience: {
      eyebrow: "ZA KOGA JE OVO?",
      title: "Profesionalan link za lokalne biznise koji već imaju društvene mreže, ali trebaju jasnu prodajnu stranicu.",
      items: [
        { title: "Obrti i lokalne usluge", description: "Jedan link s ponudom, radnim vremenom i kontaktom za sve kanale.", Icon: Building2, iconCls: "bg-blue-500/15 text-blue-600 ring-blue-400/20" },
        { title: "Saloni i beauty djelatnosti", description: "Tretmani, cjenik i način rezervacije na jednom mjestu.", Icon: Scissors, iconCls: "bg-fuchsia-500/15 text-fuchsia-600 ring-fuchsia-400/20" },
        { title: "Dječje igraonice i rođendaonice", description: "Paketi, lokacije i rezervacije roditeljima dostupni odmah.", Icon: PartyPopper, iconCls: "bg-violet-500/15 text-violet-600 ring-violet-400/20" },
        { title: "Restorani, kafići i dostava", description: "Jelovnik, lokacija i kontakt u nekoliko klikova s mobitela.", Icon: Coffee, iconCls: "bg-amber-500/15 text-amber-600 ring-amber-400/20" },
        { title: "Apartmani i turističke usluge", description: "Fotografije, sadržaj i kontakt za goste koji traže smještaj.", Icon: Home, iconCls: "bg-cyan-500/15 text-cyan-600 ring-cyan-400/20" },
        { title: "Servisi i majstori", description: "Jasna ponuda i poziv na akciju kad vas netko traži lokalno.", Icon: Wrench, iconCls: "bg-slate-500/15 text-slate-700 ring-slate-400/20" },
      ],
    },
    steps: {
      eyebrow: "KAKO FUNKCIONIRA?",
      title: "Od upita do aktivnog linka u četiri jasna koraka.",
      items: [
        { title: "Pošaljete osnovne podatke", description: "Naziv, djelatnost, usluge, lokaciju, kontakt, slike i što želite istaknuti." },
        { title: "Pripremimo prijedlog stranice", description: "Dobivate moderan preview s tekstovima, dizajnom, kontakt gumbom i osnovnim SEO postavkama." },
        { title: "Pregledate bez rizika", description: "Prvih 7 dana možete pregledati prijedlog bez obveze." },
        { title: "Aktivirate samo ako vam odgovara", description: "Ako vam se sviđa, stranica ide online i plaća se mjesečna pretplata." },
      ],
    },
    packages: {
      eyebrow: "PAKETI",
      title: "Tri razine — od jednostavnog linka do naprednih upita i analitike.",
      billing: {
        monthly: "Mjesečno",
        yearly: "Godišnje",
        yearlySave: "10 € jeftinije po mjesecu",
        yearlyBilled: "naplata godišnje",
        perMonth: "/mj",
        startPilotNote: "Pilot ponuda — 30 €/mj i za mjesečnu i godišnju naplatu",
      },
      chooseTitle: "Koji paket odabrati?",
      chooseItems: [
        { name: "Web Start", text: "ako želite jednostavnu i profesionalnu stranicu s kontaktom." },
        { name: "Web Business", text: "ako želite ozbiljniju prezentaciju, galeriju, više sadržaja i analitiku." },
        { name: "Web Pro", text: "ako želite upite, rezervacije, lead formu i mjesečni pregled rezultata." },
      ],
      items: [
        {
          id: "start",
          name: "Web Start",
          monthlyPrice: 30,
          yearlyPrice: 30,
          fixedPilot: true,
          note: "Pilot cijena za prvih 10 klijenata",
          regular: "Redovna cijena: 49 €/mj",
          description: "Za male obrte i lokalne usluge koje žele profesionalnu online prisutnost bez početnog troška.",
          included: [
            "moderna landing stranica",
            "desktop i mobile verzija",
            "osnovni SEO naslov i opis",
            "kontakt forma ili WhatsApp gumb",
            "Google mapa / lokacija",
            "hosting i SSL",
            "jedna manja izmjena mjesečno",
            "mogućnost otkazivanja u bilo kojem trenutku",
          ],
          cta: "Kreni sa Start paketom",
          featured: false,
        },
        {
          id: "business",
          name: "Web Business",
          monthlyPrice: 59,
          yearlyPrice: 49,
          fixedPilot: false,
          note: null,
          regular: null,
          description: "Za firme koje žele ozbiljniju prezentaciju, više sadržaja, galeriju, analitiku i bolju pripremu za upite.",
          included: [
            "sve iz Web Start paketa",
            "više sekcija na stranici",
            "galerija slika",
            "detaljniji prikaz usluga ili paketa",
            "Google mapa i kontakt blok",
            "kontakt obrazac ili lead forma",
            "osnovna analitika posjeta",
            "praćenje klikova na WhatsApp, poziv ili upit ako je tehnički moguće",
            "bolje SEO podešavanje naslova, opisa i sadržaja",
            "do 3 manje izmjene mjesečno",
          ],
          cta: "Želim Business paket",
          featured: true,
          badge: "Preporučeno",
          badgeLong: "Najbolji omjer cijene i koristi",
        },
        {
          id: "pro",
          name: "Web Pro",
          monthlyPrice: 89,
          yearlyPrice: 79,
          fixedPilot: false,
          note: null,
          regular: null,
          description: "Za igraonice, salone, restorane, apartmane i uslužne biznise koji žele više od same stranice — upite, rezervacije ili lead formu.",
          included: [
            "sve iz Web Business paketa",
            "naprednija upitna ili rezervacijska forma",
            "lead forma prilagođena djelatnosti",
            "mjesečni mini izvještaj",
            "pregled posjeta i klikova",
            "prijedlozi poboljšanja za više upita",
            "više sadržajnih blokova za usluge, cijene, FAQ ili ponudu",
            "prioritetnija manja podrška",
            "do 5 manjih izmjena mjesečno",
          ],
          cta: "Želim Pro paket",
          featured: false,
        },
      ],
    },
    benefits: {
      eyebrow: "ŠTO DOBIVATE",
      title: "Što dobivate osim web stranice?",
      items: [
        { title: "Jedan link za sve kanale", text: "Link možete staviti na Instagram, Facebook, Google Maps, WhatsApp, oglase, vizitke i QR kodove.", Icon: Link2 },
        { title: "Manje objašnjavanja u porukama", text: "Klijent odmah vidi osnovne informacije, lokaciju, ponudu, slike i način kontakta.", Icon: MessageCircle },
        { title: "Profesionalniji dojam", text: "Dobar web daje osjećaj da je posao ozbiljan, uređen i pouzdan.", Icon: Sparkles },
        { title: "Bolja priprema za oglase", text: "Kada plaćate oglas, bolje je voditi ljude na jasnu prodajnu stranicu nego samo na profil.", Icon: Megaphone },
        { title: "Mjerenje interesa", text: "Možete vidjeti koliko ljudi otvara stranicu i koliko ih klikne na poziv, WhatsApp ili upit.", Icon: BarChart3 },
        { title: "Bez dugoročne obveze", text: "Ako ne vidite korist, uslugu možete otkazati i stranica se deaktivira.", Icon: ShieldCheck },
      ],
    },
    risk: {
      eyebrow: "BEZ RIZIKA",
      title: "Isprobate bez velike početne investicije",
      lead: "Ne morate odmah plaćati nekoliko stotina eura za izradu web stranice. Prvo dobivate prijedlog, pregledate ga bez obveze, a ako vam odgovara — stranica ostaje aktivna kroz mjesečnu pretplatu.",
      legal: "Stranica ostaje aktivna dok traje mjesečna pretplata. Klijent može otkazati uslugu u bilo kojem trenutku. Nakon otkazivanja stranica se deaktivira. Domena, ako je registrirana na ime klijenta, ostaje vlasništvo klijenta. Izvorni kod i dizajn nisu uključeni u pretplatu osim ako se posebno ne dogovori otkup stranice.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Česta pitanja",
      items: [
        { q: "Zašto mi treba web ako imam Instagram, Facebook i Google Maps?", a: "Društvene mreže i Google Maps odlični su za vidljivost, ali web daje jedno jasno mjesto gdje klijent može brzo vidjeti vašu ponudu, slike, lokaciju, najčešća pitanja i poslati upit. Web nije zamjena za te kanale, nego profesionalni link koji ih povezuje." },
        { q: "Mogu li link staviti na Instagram i Google Maps?", a: "Da. Link možete koristiti na Instagram profilu, Facebook stranici, Google Business profilu, WhatsApp porukama, oglasima, QR kodovima i vizitkama." },
        { q: "Koji paket je najbolji za početak?", a: "Za većinu lokalnih firmi najbolji izbor je Web Business jer uključuje više sekcija, galeriju, bolju prezentaciju ponude, osnovnu analitiku i do 3 manje izmjene mjesečno." },
        { q: "Što znači da se stranica deaktivira nakon otkazivanja?", a: "Ako otkažete pretplatu, stranica se više ne prikazuje javno. Domena, ako je registrirana na ime klijenta, ostaje vlasništvo klijenta." },
        { q: "Mogu li kasnije prijeći na veći paket?", a: "Da. Možete krenuti s manjim paketom i kasnije prijeći na Business ili Pro ako želite više sekcija, analitiku, upite ili rezervacije." },
        { q: "Je li ovo jednako kao klasična izrada web stranice?", a: "Ne. Ovo je pretplatni model bez početnog troška izrade. Klasična jednokratna izrada web stranice može se dogovoriti posebno." },
        { q: "Moram li platiti izradu stranice?", a: "Ne. Kod ove ponude nema početnog troška izrade. Plaća se samo mjesečna pretplata ako odlučite aktivirati stranicu." },
        { q: "Koliko traje besplatan pregled?", a: "Prvih 7 dana možete pregledati prijedlog stranice bez obveze." },
      ],
    },
    finalCta: {
      title: "Želite da pripremimo prijedlog vaše stranice?",
      description: "Pošaljite osnovne podatke o poslu i pripremit ćemo vam prijedlog prodajne stranice bez početnog troška.",
      button: "Pošaljite upit",
    },
    backHome: "← Natrag na početnu",
  },
  en: {
    meta: {
      title: "Website with no upfront cost | Nepar",
      description:
        "A professional sales page for small businesses with no upfront build cost. One link for Instagram, Facebook, Google Maps, and WhatsApp, with plans from €30, €59, and €89 per month.",
    },
    hero: {
      badge: "No upfront build cost · from €30/mo in the pilot offer",
      title: "One professional link for your business",
      subtitle:
        "Connect Instagram, Facebook, Google Maps, and WhatsApp to one sales page that immediately shows clients what you offer and how to contact you.",
      highlight:
        "One professional link that turns Instagram, Facebook, and Google Maps visits into real inquiries.",
      primary: "I want a free website proposal",
      secondary: "View plans",
      pilotLabel: "Pilot availability",
      pilotNote: "€30/mo — spots remaining",
      pilotFilled: "spots taken",
      pilotRemaining: "spots left",
      channelsNote: "One link for Instagram, Facebook, Google Maps, WhatsApp, and ads.",
    },
    objection: {
      title: "“We have Instagram and Google Maps. Do we need a website?”",
      text: "Social profiles and Google Maps are great for visibility. But when a potential client wants to quickly see your offer, photos, location, FAQs, and send an inquiry, they need one clear place. This page is not a replacement for social media — it is the professional link that connects them and turns interest into contact.",
    },
    audience: {
      eyebrow: "WHO IS THIS FOR?",
      title: "A professional link for local businesses that already use social media but need a clear sales page.",
      items: [
        { title: "Trades and local services", description: "One link with your offer, hours, and contact for every channel.", Icon: Building2, iconCls: "bg-blue-500/15 text-blue-600 ring-blue-400/20" },
        { title: "Salons and beauty businesses", description: "Treatments, pricing, and booking in one place.", Icon: Scissors, iconCls: "bg-fuchsia-500/15 text-fuchsia-600 ring-fuchsia-400/20" },
        { title: "Kids' playrooms and party venues", description: "Packages, locations, and bookings for parents instantly.", Icon: PartyPopper, iconCls: "bg-violet-500/15 text-violet-600 ring-violet-400/20" },
        { title: "Restaurants, cafés, and delivery", description: "Menu, location, and contact in a few taps on mobile.", Icon: Coffee, iconCls: "bg-amber-500/15 text-amber-600 ring-amber-400/20" },
        { title: "Apartments and tourism services", description: "Photos, content, and contact for guests looking for accommodation.", Icon: Home, iconCls: "bg-cyan-500/15 text-cyan-600 ring-cyan-400/20" },
        { title: "Repair services and tradespeople", description: "A clear offer and call to action when locals search for you.", Icon: Wrench, iconCls: "bg-slate-500/15 text-slate-700 ring-slate-400/20" },
      ],
    },
    steps: {
      eyebrow: "HOW IT WORKS",
      title: "From inquiry to a live link in four clear steps.",
      items: [
        { title: "You send basic details", description: "Business name, activity, services, location, contact, images, and what to highlight." },
        { title: "We prepare a website proposal", description: "You receive a modern preview with copy, design, a contact button, and basic SEO settings." },
        { title: "You review risk-free", description: "For the first 7 days you can review the proposal with no obligation." },
        { title: "You activate only if it fits", description: "If you like it, the site goes live and you pay a monthly subscription." },
      ],
    },
    packages: {
      eyebrow: "PLANS",
      title: "Three levels — from a simple link to advanced inquiries and analytics.",
      billing: {
        monthly: "Monthly",
        yearly: "Yearly",
        yearlySave: "€10 cheaper per month",
        yearlyBilled: "billed annually",
        perMonth: "/mo",
        startPilotNote: "Pilot offer — €30/mo for both monthly and yearly billing",
      },
      chooseTitle: "Which plan should you choose?",
      chooseItems: [
        { name: "Web Start", text: "if you want a simple, professional page with contact options." },
        { name: "Web Business", text: "if you want a stronger presentation, gallery, more content, and analytics." },
        { name: "Web Pro", text: "if you want inquiries, bookings, lead forms, and monthly performance review." },
      ],
      items: [
        {
          id: "start",
          name: "Web Start",
          monthlyPrice: 30,
          yearlyPrice: 30,
          fixedPilot: true,
          note: "Pilot price for the first 10 clients",
          regular: "Regular price: €49/mo",
          description: "For small trades and local services that want a professional online presence with no upfront cost.",
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
          cta: "Start with Web Start",
          featured: false,
        },
        {
          id: "business",
          name: "Web Business",
          monthlyPrice: 59,
          yearlyPrice: 49,
          fixedPilot: false,
          note: null,
          regular: null,
          description: "For businesses that want a stronger presentation, more content, a gallery, analytics, and better inquiry preparation.",
          included: [
            "everything in Web Start",
            "more page sections",
            "image gallery",
            "detailed service or package presentation",
            "Google map and contact block",
            "contact form or lead form",
            "basic visit analytics",
            "WhatsApp, call, or inquiry click tracking where technically possible",
            "better SEO setup for titles, descriptions, and content",
            "up to 3 minor changes per month",
          ],
          cta: "I want Web Business",
          featured: true,
          badge: "Recommended",
          badgeLong: "Best value for most businesses",
        },
        {
          id: "pro",
          name: "Web Pro",
          monthlyPrice: 89,
          yearlyPrice: 79,
          fixedPilot: false,
          note: null,
          regular: null,
          description: "For playrooms, salons, restaurants, apartments, and service businesses that need more than a page — inquiries, bookings, or lead forms.",
          included: [
            "everything in Web Business",
            "advanced inquiry or booking form",
            "lead form tailored to your business",
            "monthly mini report",
            "visit and click overview",
            "improvement suggestions for more inquiries",
            "more content blocks for services, pricing, FAQ, or offers",
            "priority minor support",
            "up to 5 minor changes per month",
          ],
          cta: "I want Web Pro",
          featured: false,
        },
      ],
    },
    benefits: {
      eyebrow: "WHAT YOU GET",
      title: "What you get beyond the website",
      items: [
        { title: "One link for every channel", text: "Use the link on Instagram, Facebook, Google Maps, WhatsApp, ads, business cards, and QR codes.", Icon: Link2 },
        { title: "Less explaining in messages", text: "Clients immediately see key information, location, offer, photos, and how to contact you.", Icon: MessageCircle },
        { title: "A more professional impression", text: "A good website signals that the business is serious, organized, and trustworthy.", Icon: Sparkles },
        { title: "Better ad preparation", text: "When you pay for ads, it is better to send people to a clear sales page than only to a profile.", Icon: Megaphone },
        { title: "Interest measurement", text: "You can see how many people open the page and how many click call, WhatsApp, or inquiry.", Icon: BarChart3 },
        { title: "No long-term commitment", text: "If you do not see the value, you can cancel and the page is deactivated.", Icon: ShieldCheck },
      ],
    },
    risk: {
      eyebrow: "NO RISK",
      title: "Try it without a large upfront investment",
      lead: "You do not have to pay several hundred euros upfront for a website build. First you receive a proposal, review it with no obligation, and if it fits, the page stays live through a monthly subscription.",
      legal: "The website stays live while the monthly subscription is active. The client can cancel at any time. After cancellation the site is deactivated. If the domain is registered in the client's name, it remains the client's property. Source code and design are not included in the subscription unless a buyout is agreed separately.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common questions",
      items: [
        { q: "Why do I need a website if I have Instagram, Facebook, and Google Maps?", a: "Social profiles and Google Maps are great for visibility, but a website gives one clear place where clients can quickly see your offer, photos, location, FAQs, and send an inquiry. It is not a replacement for those channels — it is the professional link that connects them." },
        { q: "Can I put the link on Instagram and Google Maps?", a: "Yes. You can use the link on your Instagram profile, Facebook page, Google Business profile, WhatsApp messages, ads, QR codes, and business cards." },
        { q: "Which plan is best to start with?", a: "For most local businesses, Web Business is the best choice because it includes more sections, a gallery, stronger offer presentation, basic analytics, and up to 3 minor changes per month." },
        { q: "What does it mean that the page is deactivated after cancellation?", a: "If you cancel the subscription, the page is no longer publicly visible. If the domain is registered in the client's name, it remains the client's property." },
        { q: "Can I upgrade to a larger plan later?", a: "Yes. You can start with a smaller plan and move to Business or Pro later if you want more sections, analytics, inquiries, or bookings." },
        { q: "Is this the same as a classic website build?", a: "No. This is a subscription model with no upfront build cost. A classic one-time website build can be agreed separately." },
        { q: "Do I have to pay for the website build?", a: "No. This offer has no upfront build cost. You only pay a monthly subscription if you decide to activate the site." },
        { q: "How long is the free review period?", a: "You can review the proposal for the first 7 days with no obligation." },
      ],
    },
    finalCta: {
      title: "Want us to prepare a proposal for your page?",
      description: "Send basic business details and we will prepare a sales page proposal with no upfront cost.",
      button: "Send an inquiry",
    },
    backHome: "← Back to home",
  },
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
      transition={{ delay: 0.42, duration: 0.6, ease: easeOut }}
      className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-white/90 p-5 shadow-xl shadow-blue-200/35 backdrop-blur-md sm:p-6"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-cyan-400/15 blur-2xl" />
      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-blue-600">{copy.hero.pilotLabel}</p>
            <p className="mt-1 text-sm text-slate-600">{copy.hero.pilotNote}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/80">
            <Sparkles size={13} />
            30 €/mj
          </span>
        </div>
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: PILOT_TOTAL }, (_, index) => (
            <motion.span
              key={index}
              initial={{ scaleY: 0.4, opacity: 0.5 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.04, duration: 0.35, ease: easeOut }}
              className={`block h-9 origin-bottom rounded-md ${
                index < PILOT_FILLED
                  ? "bg-gradient-to-t from-blue-600 to-violet-500 shadow-sm shadow-blue-500/25"
                  : "bg-slate-100 ring-1 ring-slate-200/80"
              }`}
              aria-hidden="true"
            />
          ))}
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

function BillingToggle({ billing, onChange, labels }) {
  return (
    <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="group"
        aria-label={`${labels.monthly} / ${labels.yearly}`}
        className="relative inline-flex rounded-full border border-slate-200/80 bg-white/90 p-1 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur"
      >
        {["monthly", "yearly"].map((value) => {
          const isActive = billing === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              className="pressable relative z-10 rounded-full px-4 py-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.span
                  layoutId="billing-toggle-pill"
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 shadow-md shadow-blue-500/25"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className={isActive ? "text-white" : "transition-colors hover:text-slate-900"}>
                {value === "monthly" ? labels.monthly : labels.yearly}
              </span>
            </button>
          );
        })}
      </div>
      {billing === "yearly" && (
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/80"
        >
          {labels.yearlySave}
        </motion.span>
      )}
    </div>
  );
}

function PackageCard({ pkg, index, billing, labels, onSelect }) {
  const featured = pkg.featured;
  const price = getPackagePrice(pkg, billing);
  const showSave = billing === "yearly" && pkg.monthlyPrice > pkg.yearlyPrice;
  const priceLabel = buildPriceLabel(pkg, billing, labels);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: easeOut }}
      whileHover={{ y: featured ? -6 : -4 }}
      className={`relative flex h-full flex-col rounded-2xl border bg-white/85 p-5 shadow-xl backdrop-blur-md sm:p-6 ${
        featured
          ? "border-blue-300/80 shadow-blue-200/40 ring-1 ring-blue-200/60 lg:scale-[1.03]"
          : "border-slate-200/80 shadow-slate-300/30"
      }`}
    >
      {featured && pkg.badge && (
        <motion.span
          initial={{ opacity: 0, y: -6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4, ease: easeOut }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-1 text-[11px] font-semibold text-white shadow-md shadow-blue-500/25"
        >
          {pkg.badge}
        </motion.span>
      )}
      <div className="mb-1 flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-900">{pkg.name}</h3>
        {featured && pkg.badgeLong && (
          <span className="hidden text-right text-[11px] font-medium leading-tight text-blue-700 sm:block sm:max-w-[8rem]">
            {pkg.badgeLong}
          </span>
        )}
      </div>
      <div className="mt-2">
        {showSave && (
          <p className="text-sm text-slate-400 line-through">{formatPrice(pkg.monthlyPrice, labels.perMonth)}</p>
        )}
        <p className="text-3xl font-semibold text-slate-900">{formatPrice(price, labels.perMonth)}</p>
        {billing === "yearly" && (
          <p className="mt-1 text-xs text-slate-500">
            {price * 12} € {labels.yearlyBilled}
          </p>
        )}
      </div>
      {pkg.note && <p className="mt-1 text-sm font-medium text-blue-700">{pkg.note}</p>}
      {pkg.fixedPilot && billing === "yearly" && (
        <p className="mt-1 text-xs font-medium text-blue-600">{labels.startPilotNote}</p>
      )}
      {pkg.regular && <p className="mt-0.5 text-sm text-slate-500">{pkg.regular}</p>}
      <p className="mt-4 text-sm leading-6 text-slate-600">{pkg.description}</p>
      <ul className="mt-5 flex-1 space-y-2.5">
        {pkg.included.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
            <Check size={15} className="mt-0.5 shrink-0 text-blue-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <MotionButton
        onClick={() => onSelect(pkg, priceLabel)}
        variant={featured ? "primary" : "secondary"}
        className="mt-6 inline-flex w-full px-5 py-3.5 text-sm"
      >
        {pkg.cta}
        <ArrowRight size={16} />
      </MotionButton>
    </motion.article>
  );
}

function FaqItem({ question, answer, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div {...reveal} transition={{ ...reveal.transition, delay: index * 0.04 }} className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-slate-900 sm:text-base">{question}</span>
        <ChevronDown size={18} className={`shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: easeOut }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-sm leading-6 text-slate-600">{answer}</p>
      </motion.div>
    </motion.div>
  );
}

export default function WebStartPage() {
  const [lang, setLang] = useState("hr");
  const [billing, setBilling] = useState("monthly");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navCopy = siteContent[lang];
  const copy = pageCopy[lang];
  const defaultPackage = copy.packages.items[0];

  function openInquiry(pkg = defaultPackage, priceLabel = "") {
    setSelectedPackage({ name: pkg.name, priceLabel });
    setModalOpen(true);
  }

  function openDefaultInquiry() {
    const priceLabel = buildPriceLabel(defaultPackage, billing, copy.packages.billing);
    openInquiry(defaultPackage, priceLabel);
  }

  usePageMeta({
    title: copy.meta.title,
    description: copy.meta.description,
    path: "/usluge/web-stranica-bez-pocetnog-troska",
  });

  return (
    <main className="relative min-h-screen overflow-x-hidden font-sans text-slate-800">
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={navCopy} />

      <section className="px-4 pt-24 pb-8 sm:pt-32 sm:pb-10">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:max-w-[1380px] lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.55fr)] lg:gap-12">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="hero-kicker mb-5 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] shadow-lg shadow-violet-500/10">
              <Link2 size={15} />
              <span className="hero-kicker-text">{copy.hero.badge}</span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.06] text-slate-900 sm:text-5xl xl:text-[3.35rem]">{copy.hero.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{copy.hero.subtitle}</p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: easeOut }}
              className="mt-5 max-w-2xl rounded-xl border border-blue-200/70 bg-blue-50/60 px-4 py-3 text-sm font-medium leading-6 text-slate-800 sm:text-base"
            >
              {copy.hero.highlight}
            </motion.p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <MotionButton onClick={openDefaultInquiry} className="inline-flex px-6 py-4">
                {copy.hero.primary}
                <Send size={18} />
              </MotionButton>
              <MotionButton href="#paketi" variant="secondary" className="inline-flex px-6 py-4">
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
              <span>{copy.hero.channelsNote}</span>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-6 sm:pb-8">
        <motion.div
          {...reveal}
          className="mx-auto max-w-[1180px] rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-lg shadow-slate-300/25 sm:p-7 lg:max-w-[1380px]"
        >
          <h2 className="text-lg font-semibold leading-snug text-slate-900 sm:text-xl">{copy.objection.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{copy.objection.text}</p>
        </motion.div>
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
                transition={{ duration: 0.5, delay: index * 0.06, ease: easeOut }}
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
              <motion.article key={title} {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }} className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-lg shadow-slate-300/30">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white shadow-md shadow-blue-500/25">{index + 1}</span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="paketi" className="scroll-mt-28 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-[1180px] lg:max-w-[1380px]">
          <motion.div {...reveal} className="mb-8 max-w-2xl">
            <SectionEyebrow>{copy.packages.eyebrow}</SectionEyebrow>
            <h2 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">{copy.packages.title}</h2>
          </motion.div>
          <BillingToggle billing={billing} onChange={setBilling} labels={copy.packages.billing} />
          <div className="grid items-stretch gap-5 lg:grid-cols-3 lg:gap-4 xl:gap-6">
            {copy.packages.items.map((pkg, index) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                index={index}
                billing={billing}
                labels={copy.packages.billing}
                onSelect={(selected, priceLabel) => openInquiry(selected, priceLabel)}
              />
            ))}
          </div>
          <motion.div {...reveal} className="mt-8 rounded-2xl border border-slate-200/80 bg-white/75 p-5 sm:p-6">
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{copy.packages.chooseTitle}</h3>
            <ul className="mt-4 space-y-3">
              {copy.packages.chooseItems.map(({ name, text }) => (
                <li key={name} className="flex gap-2 text-sm leading-6 text-slate-600 sm:text-base">
                  <span className="font-semibold text-slate-900">{name}:</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-[1180px] lg:max-w-[1380px]">
          <motion.div {...reveal} className="mb-8 max-w-2xl">
            <SectionEyebrow>{copy.benefits.eyebrow}</SectionEyebrow>
            <h2 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">{copy.benefits.title}</h2>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.benefits.items.map(({ title, text, Icon }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.05, ease: easeOut }}
                className="rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-lg shadow-slate-300/25"
              >
                <div className="mb-3 grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-600 ring-1 ring-blue-400/20">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="cijena" className="scroll-mt-28 px-4 py-8 sm:py-10">
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
        <motion.div {...reveal} className="relative mx-auto max-w-[1180px] overflow-hidden rounded-2xl border border-blue-300/40 bg-white/85 px-6 py-8 text-center shadow-2xl shadow-blue-200/35 sm:px-10 sm:py-10 lg:max-w-[1380px]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/8 via-violet-500/8 to-cyan-400/8" />
          <div className="relative">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{copy.finalCta.title}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">{copy.finalCta.description}</p>
            <MotionButton onClick={openDefaultInquiry} className="mt-6 inline-flex px-6 py-4">
              {copy.finalCta.button}
              <Send size={18} />
            </MotionButton>
          </div>
        </motion.div>
      </section>

      <PackageInquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        lang={lang}
        packageName={selectedPackage?.name ?? defaultPackage.name}
        billing={billing}
        priceLabel={selectedPackage?.priceLabel ?? buildPriceLabel(defaultPackage, billing, copy.packages.billing)}
      />

      <footer className="px-4 pb-10">
        <div className="mx-auto max-w-[1180px] lg:max-w-[1380px]">
          <div className="border-t border-slate-200 pt-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-blue-700">{navCopy.footer.infoLabel}</p>
                <p className="text-sm font-medium text-slate-700">{navCopy.footer.companyName}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-0.5 text-xs text-slate-500">
                  <span>{navCopy.footer.owner}</span>
                  <span>{navCopy.footer.mbo}</span>
                  <a href="mailto:nepar@nepar.hr" className="transition hover:text-slate-900">{navCopy.footer.email}</a>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 sm:flex-row sm:gap-4 sm:pt-5 sm:text-sm">
              <p>{navCopy.footer.copyright}</p>
              <a href="/" className="transition hover:text-slate-900">{copy.backHome}</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
