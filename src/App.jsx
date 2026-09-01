import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CarFront,
  CheckCircle2,
  CloudSun,
  Database,
  Globe,
  Grid3X3,
  Heart,
  Layers,
  Mail,
  MapPin,
  Menu,
  Monitor,
  Play,
  Puzzle,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wand2,
  X,
  Zap,
  BadgeEuro,
} from "lucide-react";
import OrbitalProjectCarousel from "./OrbitalProjectCarousel.jsx";
import ComputerEvolutionIntro from "./ComputerEvolutionIntro.jsx";
import ConsentManager, { ConsentSettingsLink } from "./ConsentManager.jsx";
import { subscribeConsentChanges, trackPageView } from "./analytics.js";
import { usePageMeta } from "./usePageMeta.js";
import "./legacyLanding.css";

const ContactPage = lazy(() => import("./ContactPage.jsx"));
const AdminPage = lazy(() => import("./AdminPage.jsx"));
const WebStartPage = lazy(() => import("./WebStartPage.jsx"));
const PrivacyPage = lazy(() => import("./PrivacyPage.jsx"));
const MozgalicaPage = lazy(() => import("./mozgalica/MozgalicaPage.jsx"));
const NjamkoPage = lazy(() => import("./njamko/NjamkoPage.jsx"));

const easeOut = [0.23, 1, 0.32, 1];
const revealTransition = { duration: 0.48, ease: easeOut };
const quickRevealTransition = { duration: 0.32, ease: easeOut };
const cardHoverProps = {
  whileHover: { y: -3, scale: 1.008 },
  transition: { type: "spring", stiffness: 380, damping: 30 },
};
const eyebrowClass = "text-xs font-bold uppercase tracking-[0.18em] text-blue-600";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => (
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  ));

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

const content = {
  hr: {
    navLinks: [
      ["Projekti", "#projekti"],
      ["Usluge", "#usluge"],
      ["Cjenik", "/usluge/izrada-web-stranica#paketi", BadgeEuro],
      ["O nama", "#onama"],
      ["Kontakt", "/kontakt", Mail],
    ],
    navCta: "Javite se",
    menuLabel: "Otvori navigaciju",
    projects: [
      {
        title: "BezStruje.hr",
        description: "Obavijesti o kvarovima i planiranim radovima.",
        Icon: Zap,
        accent: "from-amber-300 to-orange-500",
        preview: "outage",
        href: "https://bezstruje.hr",
      },
      {
        title: "VidimoSe.hr",
        description: "Dje\u010dji ro\u0111endani, pozivnice i igraonice. Sve na jednom mjestu!",
        Icon: Heart,
        accent: "from-fuchsia-300 to-violet-500",
        preview: "invite",
        href: "https://vidimose.hr",
      },
      {
        title: "KPDinfo.com",
        description: "KPD 2026 AI tra\u017eilica za to\u010dne KPD \u0161ifre.",
        Icon: Bot,
        accent: "from-blue-400 to-indigo-500",
        preview: "ai",
        href: "https://kpdinfo.com",
      },
      {
        title: "GeoAdrese.net",
        description: "Pretraga adresa i geo podaci.",
        Icon: MapPin,
        accent: "from-teal-300 to-cyan-500",
        preview: "geo",
        href: "https://geoadrese.net",
      },
      {
        title: "KadigraHrvatska.hr",
        description: "Fanhub navijača Hrvatske — Postani izbornik.",
        Icon: Trophy,
        accent: "from-red-400 to-rose-600",
        preview: "kadigra",
        href: "https://kadigrahrvatska.hr",
      },
      {
        title: "VremenskaPrognoza.hr",
        description: "Točna vremenska prognoza za Hrvatsku — temperature, oborine i upozorenja.",
        Icon: CloudSun,
        accent: "from-sky-300 to-blue-600",
        preview: "weather",
        href: "https://vremenskaprognoza.hr",
      },
      {
        title: "Njamko",
        description: "Igra u kojoj djeca kroz zabavne zadatke uče o životinjama.",
        accent: "from-lime-400 to-emerald-500",
        preview: "njamko",
        href: "https://njamko.nepar.hr",
      },
      {
        title: "Bajkoteka",
        description: "Interaktivna edukativna aplikacija o djelima Ivane Brlić-Mažuranić.",
        accent: "from-rose-400 to-amber-500",
        preview: "bajkoteka",
        href: "https://bajkoteka.nepar.hr",
      },
      {
        title: "Handyman",
        description: "Digitalni projekt za usluge, upite i jednostavniju organizaciju posla.",
        accent: "from-orange-400 to-amber-500",
        preview: "handyman",
        href: "https://handyman.nepar.hr",
      },
      {
        title: "Hackosaur",
        description: "Digitalni proizvod iz svijeta programiranja i tehnologije.",
        accent: "from-emerald-400 to-cyan-500",
        preview: "hackosaur",
      },
    ],
    featuredOnlyProjects: [
      {
        title: "Auto Gubić",
        description: "Web-stranica za specijalizirani Volvo servis u Zagrebu.",
        Icon: CarFront,
        accent: "from-blue-500 to-cyan-500",
        preview: "autogubic",
        href: "https://autogubic.hr/",
      },
    ],
    services: [
      {
        title: "Web aplikacije",
        description: "Pretvaramo ideje u brze, sigurne i skalabilne web aplikacije prilago\u0111ene va\u0161em poslovanju \u2014 od prototipa do produkcije.",
        Icon: Globe,
        iconCls: "bg-white/90 text-blue-700 ring-blue-200/80",
        backgroundSrc: "/brand/service-web-apps-light.webp",
        artCls: "service-card-art-emphasis",
      },
      {
        title: "Portali i alati",
        description: "Specijalizirani portali i pametni alati koji rje\u0161avaju prave probleme va\u0161ih korisnika \u2014 br\u017ee, jednostavnije, u\u010dinkovitije.",
        Icon: Layers,
        iconCls: "bg-white/90 text-violet-700 ring-violet-200/80",
        backgroundSrc: "/brand/service-portals-light.webp",
        artCls: "service-card-art-emphasis",
      },
      {
        title: "AI i automatizacija",
        description: "AI asistenti i automatizacija koja preuzima repetitivne zadatke, ubrzava procese i osloba\u0111a va\u0161 tim za ono \u0161to je zaista va\u017eno.",
        Icon: Wand2,
        iconCls: "bg-white/90 text-cyan-700 ring-cyan-200/80",
        backgroundSrc: "/brand/service-ai-automation-light.webp",
      },
      {
        title: "Mape i podaci",
        description: "Geo rje\u0161enja, pretraga adresa i prostorne analize integrirane direktno u va\u0161 sustav \u2014 precizno, pouzdano i u stvarnom vremenu.",
        Icon: Database,
        iconCls: "bg-white/90 text-amber-700 ring-amber-200/80",
        backgroundSrc: "/brand/service-maps-data-light.webp",
      },
    ],
    stats: [
      ["20+", "Portali i platforme", Grid3X3],
      ["40+", "Web aplikacija", Monitor],
      ["15+", "AI alata i asistenata", BrainCircuit],
      ["30+", "Integracija i API-ja", Puzzle],
    ],
    hero: {
      kicker: "DIGITALNA RJE\u0160ENJA KOJA RADE",
      lead: "Gradimo korisne",
      highlight: "digitalne proizvode",
      rest: "za stvarni svijet.",
      description: "Web aplikacije, AI alati, portali i specijalizirana rje\u0161enja od ideje do produkcije.",
      primary: "Pregled projekata",
      secondary: "Kontakt",
      mobileProjects: "Izdvojeni projekti",
      trust: [
        ["Prakti\u010dni proizvodi", ShieldCheck],
        ["Brza izvedba", CheckCircle2],
        ["Fokus na rezultat", Sparkles],
      ],
    },
    servicesSection: {
      eyebrow: "\u0160TO RADIMO?",
      title: "Rje\u0161enja koja donose vrijednost.",
      description: "Od ideje do stabilnog proizvoda, brzo i fokusirano na korisnika.",
    },
    webStartPromo: {
      eyebrow: "JASNA PONUDA",
      title: "Web-stranica koja pripada va\u0161em poslovanju",
      description:
        "Izradu pla\u0107ate jednokratno, a odr\u017eavanje birate samo ako vam treba. Opseg, cijena i broj dorada poznati su prije po\u010detka rada.",
      highlight: "Paketi izrade kre\u0107u od 300 \u20ac jednokratno.",
      cta: "Pogledaj pakete",
      ctaLabel: "Paketi web-stranica",
      ctaNote: "Usporedite opseg, cijene i što je uključeno u svaki paket.",
      secondaryNote: "Odr\u017eavanje nije obavezno i ugovara se zasebno.",
    },
    featured: {
      eyebrow: "IZDVOJENI PROJEKTI",
      link: "Pogledaj sve projekte",
      summary: "11 proizvoda \u00b7 stvarni radovi",
    },
    about: {
      eyebrow: "O NAMA",
      imageLabel: "Pokreni priču o evoluciji tehnologije",
      playLabel: "Pokreni animaciju",
      title: "Tehni\u010dka izvedba, jasna komunikacija i fokus na proizvod koji radi.",
      description:
        "Nepar Solutions spaja razvoj web aplikacija, AI rje\u0161enja, portala, integracija i rada s podacima u jedan prakti\u010dan proces.",
      process: [
        ["01", "Razumijemo problem", "Cilj, korisnici i realan opseg prije prve linije koda."],
        ["02", "Gradimo i provjeravamo", "Jasne faze, vidljiv napredak i provjera na stvarnim ure\u0111ajima."],
        ["03", "Isporu\u010dujemo proizvod", "Stabilna objava, vlasni\u0161tvo i konkretan sljede\u0107i korak."],
      ],
    },
    cta: {
      title: "Imate ideju? Pretvorimo je u proizvod.",
      description: "Od prvog razgovora do lansiranja, tu smo da va\u0161a ideja postane stvarnost.",
      button: "Javite se i pokrenimo projekt",
    },
    footer: {
      copyright: "\u00a9 2026 Nepar Solutions. Digitalna rje\u0161enja po mjeri.",
      top: "Povratak na vrh",
      infoLabel: "Poslovni podaci",
      companyName: "Nepar, obrt za digitalna rje\u0161enja i usluge",
      owner: "vl. Ivan Gorupi\u0107",
      mbo: "MBO: 99267101",
      email: "nepar@nepar.hr",
    },
    previewAlts: {
      invite: "Vidimose.hr digitalna pozivnica",
      geo: "GeoAdrese.com.hr prikaz",
      outage: "Bezstruje.hr prikaz",
      kadigra: "KadigraHrvatska.hr prikaz",
      weather: "VremenskaPrognoza.hr prikaz",
    },
  },
  en: {
    navLinks: [
      ["Projects", "#projekti"],
      ["Services", "#usluge"],
      ["Pricing", "/usluge/izrada-web-stranica#paketi", BadgeEuro],
      ["About us", "#onama"],
      ["Contact", "/kontakt", Mail],
    ],
    navCta: "Contact us",
    menuLabel: "Open navigation",
    projects: [
      {
        title: "BezStruje.hr",
        description: "Outage alerts and planned maintenance notices.",
        Icon: Zap,
        accent: "from-amber-300 to-orange-500",
        preview: "outage",
        href: "https://bezstruje.hr",
      },
      {
        title: "VidimoSe.hr",
        description: "Kids' birthdays, invitations, and playrooms. All in one place!",
        Icon: Heart,
        accent: "from-fuchsia-300 to-violet-500",
        preview: "invite",
        href: "https://vidimose.hr",
      },
      {
        title: "KPDinfo.com",
        description: "KPD 2026 AI search for accurate KPD codes.",
        Icon: Bot,
        accent: "from-blue-400 to-indigo-500",
        preview: "ai",
        href: "https://kpdinfo.com",
      },
      {
        title: "GeoAdrese.net",
        description: "Address search and geospatial data.",
        Icon: MapPin,
        accent: "from-teal-300 to-cyan-500",
        preview: "geo",
        href: "https://geoadrese.net",
      },
      {
        title: "KadigraHrvatska.hr",
        description: "Croatia fan hub — Become the coach.",
        Icon: Trophy,
        accent: "from-red-400 to-rose-600",
        preview: "kadigra",
        href: "https://kadigrahrvatska.hr",
      },
      {
        title: "VremenskaPrognoza.hr",
        description: "Accurate weather forecasts for Croatia — temperatures, rainfall, and alerts.",
        Icon: CloudSun,
        accent: "from-sky-300 to-blue-600",
        preview: "weather",
        href: "https://vremenskaprognoza.hr",
      },
      {
        title: "Njamko",
        description: "A game where children learn about animals through playful activities.",
        accent: "from-lime-400 to-emerald-500",
        preview: "njamko",
        href: "https://njamko.nepar.hr",
      },
      {
        title: "Bajkoteka",
        description: "An interactive educational app about the works of Ivana Brlić-Mažuranić.",
        accent: "from-rose-400 to-amber-500",
        preview: "bajkoteka",
        href: "https://bajkoteka.nepar.hr",
      },
      {
        title: "Handyman",
        description: "A digital project for services, inquiries, and simpler work organization.",
        accent: "from-orange-400 to-amber-500",
        preview: "handyman",
        href: "https://handyman.nepar.hr",
      },
      {
        title: "Hackosaur",
        description: "A digital product from the world of coding and technology.",
        accent: "from-emerald-400 to-cyan-500",
        preview: "hackosaur",
      },
    ],
    featuredOnlyProjects: [
      {
        title: "Auto Gubić",
        description: "Website for a specialized Volvo service center in Zagreb.",
        Icon: CarFront,
        accent: "from-blue-500 to-cyan-500",
        preview: "autogubic",
        href: "https://autogubic.hr/",
      },
    ],
    services: [
      {
        title: "Web applications",
        description: "We turn ideas into fast, secure, and scalable web applications built for your business — from prototype to production.",
        Icon: Globe,
        iconCls: "bg-white/90 text-blue-700 ring-blue-200/80",
        backgroundSrc: "/brand/service-web-apps-light.webp",
        artCls: "service-card-art-emphasis",
      },
      {
        title: "Portals and tools",
        description: "Specialized portals and smart tools that solve real user problems — faster, simpler, and more effectively.",
        Icon: Layers,
        iconCls: "bg-white/90 text-violet-700 ring-violet-200/80",
        backgroundSrc: "/brand/service-portals-light.webp",
        artCls: "service-card-art-emphasis",
      },
      {
        title: "AI and automation",
        description: "AI assistants and automation that take over repetitive tasks, speed up processes, and free your team for what truly matters.",
        Icon: Wand2,
        iconCls: "bg-white/90 text-cyan-700 ring-cyan-200/80",
        backgroundSrc: "/brand/service-ai-automation-light.webp",
      },
      {
        title: "Maps and data",
        description: "Geo solutions, address search, and spatial analytics integrated directly into your system — precise, reliable, and real-time.",
        Icon: Database,
        iconCls: "bg-white/90 text-amber-700 ring-amber-200/80",
        backgroundSrc: "/brand/service-maps-data-light.webp",
      },
    ],
    stats: [
      ["20+", "Portals and platforms", Grid3X3],
      ["40+", "Web applications", Monitor],
      ["15+", "AI tools and assistants", BrainCircuit],
      ["30+", "Integrations and APIs", Puzzle],
    ],
    hero: {
      kicker: "DIGITAL SOLUTIONS THAT WORK",
      lead: "We build useful",
      highlight: "digital products",
      rest: "for the real world.",
      description: "Web applications, AI tools, portals, and specialized solutions from idea to production.",
      primary: "View projects",
      secondary: "Contact",
      mobileProjects: "Featured projects",
      trust: [
        ["Practical products", ShieldCheck],
        ["Fast delivery", CheckCircle2],
        ["Result focused", Sparkles],
      ],
    },
    servicesSection: {
      eyebrow: "WHAT WE DO",
      title: "Solutions that create value.",
      description: "From idea to stable product, fast and focused on the user.",
    },
    webStartPromo: {
      eyebrow: "CLEAR OFFER",
      title: "A website that belongs to your business",
      description:
        "Development is paid once, while maintenance remains your choice. Scope, price, and revision rounds are agreed before work begins.",
      highlight: "Website development packages start at \u20ac300, paid once.",
      cta: "View plans",
      ctaLabel: "Website packages",
      ctaNote: "Compare the scope, pricing, and what is included in each package.",
      secondaryNote: "Maintenance is optional and contracted separately.",
    },
    featured: {
      eyebrow: "FEATURED PROJECTS",
      link: "View all projects",
      summary: "11 products \u00b7 real work",
    },
    about: {
      eyebrow: "ABOUT US",
      imageLabel: "Play the story of technology's evolution",
      playLabel: "Play animation",
      title: "Technical delivery, clear communication, and focus on a product that works.",
      description:
        "Nepar Solutions brings together web app development, AI solutions, portals, integrations, and data work into one practical process.",
      process: [
        ["01", "Understand the problem", "Goals, users, and realistic scope before the first line of code."],
        ["02", "Build and verify", "Clear stages, visible progress, and checks on real devices."],
        ["03", "Ship the product", "A stable launch, clear ownership, and a concrete next step."],
      ],
    },
    cta: {
      title: "Have an idea? Let\u2019s turn it into a product.",
      description: "From the first conversation to launch, we are here to turn your idea into reality.",
      button: "Reach out and start the project",
    },
    footer: {
      copyright: "\u00a9 2026 Nepar Solutions. Tailored digital solutions.",
      top: "Back to top",
      infoLabel: "Business info",
      companyName: "Nepar, sole proprietorship for digital solutions and services",
      owner: "Prop. Ivan Gorupi\u0107",
      mbo: "MBO: 99267101",
      email: "nepar@nepar.hr",
    },
    previewAlts: {
      invite: "Vidimose.hr digital invitation",
      geo: "GeoAdrese.com.hr preview",
      outage: "Bezstruje.hr preview",
      kadigra: "KadigraHrvatska.hr preview",
      weather: "VremenskaPrognoza.hr preview",
    },
  },
};

export { content };

export function LanguageToggle({ lang, setLang }) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="language-toggle relative inline-flex shrink-0 rounded-full border border-slate-200/80 bg-white/90 p-0.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur"
    >
      {["hr", "en"].map((value) => {
        const isActive = lang === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setLang(value)}
            className="pressable relative z-10 rounded-full px-2.5 py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-pressed={isActive}
          >
            {isActive && (
              <motion.span
                layoutId="lang-toggle-pill"
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-full bg-slate-950 shadow-md shadow-blue-500/20"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className={isActive ? "text-white" : "transition-colors hover:text-slate-900"}>
              {value === "hr" ? "HR" : "ENG"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Navbar({ lang, setLang, copy }) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  function resolveHref(href) {
    if (href.startsWith("#") && !onHome) return `/${href}`;
    return href;
  }

  useEffect(() => {
    if (!onHome) return undefined;
    const ids = ["projekti", "usluge", "onama"];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-2">
      <nav className="premium-nav mx-auto flex max-w-[1180px] items-center justify-between rounded-xl px-2 py-1.5 sm:rounded-2xl sm:px-3 sm:py-1 lg:max-w-[1380px] lg:px-4">
        {(() => {
          const logoInner = (
            <span className="grid h-12 w-[8.82rem] place-items-center overflow-hidden rounded-xl sm:h-[4.62rem] sm:w-[13.5rem] sm:rounded-2xl">
              <img
                src="/brand/nepar_logo.png"
                alt="Nepar Solutions logo"
                className="size-full object-contain px-2 py-1 sm:px-3 sm:py-2"
              />
            </span>
          );
          return onHome ? (
            <a href="#top" className="flex min-w-0 items-center gap-2 sm:gap-3">
              {logoInner}
            </a>
          ) : (
            <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
              {logoInner}
            </Link>
          );
        })()}

        <div className="hidden items-center gap-2 lg:flex">
          {copy.navLinks.map(([label, href, Icon]) => {
            const resolved = resolveHref(href);
            const isRouter = resolved.startsWith("/") && !resolved.startsWith("//") && !resolved.includes(":");
            const Comp = isRouter ? Link : "a";
            const linkProp = isRouter ? { to: resolved } : { href: resolved };
            const isActive = href.startsWith("#") && activeSection === href.slice(1);
            return (
              <Comp
                key={href}
                {...linkProp}
                aria-current={isActive ? "true" : undefined}
                className={`pressable group relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium transition-colors duration-200 hover:text-slate-950 ${
                  isActive ? "text-slate-950" : "text-slate-700"
                }`}
              >
                {Icon && (
                  <Icon
                    size={20}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-blue-600" : "text-blue-500 group-hover:text-blue-600"
                    }`}
                  />
                )}
                <span className="relative">
                  {label}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-transform duration-200 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </span>
              </Comp>
            );
          })}
        </div>

        <div className="ml-auto mr-2 lg:ml-0">
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>

        <a
          href="mailto:nepar@nepar.hr"
          className="premium-button pressable hidden items-center gap-2.5 rounded-xl px-4 py-2.5 text-base font-semibold text-white lg:inline-flex"
        >
          <Mail className="shrink-0" size={18} />
          nepar@nepar.hr
        </a>

        <button
          className="pressable grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white/80 text-slate-700 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 sm:size-14 sm:rounded-2xl lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={copy.menuLabel}
          aria-expanded={open}
        >
          {open ? <X className="size-5 sm:size-[26px]" /> : <Menu className="size-5 sm:size-[26px]" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: easeOut }}
            style={{ transformOrigin: "top right" }}
            className="mx-auto mt-2 max-w-[1180px] rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-xl shadow-blue-200/30 backdrop-blur-xl sm:mt-3 sm:rounded-2xl sm:p-5 sm:shadow-2xl lg:max-w-[1380px] lg:hidden"
          >
            <div className="grid gap-1 sm:gap-2">
              {copy.navLinks.map(([label, href, Icon]) => {
                const resolved = resolveHref(href);
                const isRouter = resolved.startsWith("/") && !resolved.startsWith("//") && !resolved.includes(":");
                const Comp = isRouter ? Link : "a";
                const linkProp = isRouter ? { to: resolved } : { href: resolved };
                const isActive = href.startsWith("#") && activeSection === href.slice(1);
                return (
                  <Comp
                    key={href}
                    {...linkProp}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "true" : undefined}
                    className={`pressable group inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {Icon && (
                      <Icon
                        size={20}
                        className={`transition-transform duration-200 group-hover:translate-x-0.5 ${
                          isActive ? "text-blue-600" : "text-blue-500"
                        }`}
                      />
                    )}
                    {label}
                  </Comp>
                );
              })}
              <MotionButton href="/kontakt" size="md" className="mt-1 justify-self-start sm:mt-2 sm:justify-self-stretch">
                <Send className="size-4 sm:size-5" />
                {copy.navCta}
              </MotionButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

const MotionLink = motion(Link);

const buttonSizes = {
  sm: "min-h-11 px-4 py-2.5 text-sm",
  md: "min-h-11 px-5 py-3 text-base",
  lg: "min-h-12 px-6 py-4 text-base",
};

export function MotionButton({ href, onClick, children, className = "", variant = "primary", size = "md", type = "button" }) {
  const primary = variant === "primary";
  const cls = `pressable inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition ${buttonSizes[size] ?? buttonSizes.md} ${
    primary
      ? "premium-button text-white"
      : "border border-slate-200 bg-white/85 text-slate-700 shadow-sm backdrop-blur hover:border-blue-200 hover:bg-white hover:text-slate-950 hover:shadow-blue-200/30"
  } ${className}`;
  const motionProps = {
    whileHover: { y: -1, scale: 1.01 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 460, damping: 32 },
  };

  if (onClick) {
    return (
      <motion.button type={type} onClick={onClick} {...motionProps} className={cls}>
        {children}
      </motion.button>
    );
  }

  const isRouterLink = href && href.startsWith("/") && !href.includes(":");

  return isRouterLink ? (
    <MotionLink to={href} {...motionProps} className={cls}>{children}</MotionLink>
  ) : (
    <motion.a href={href} {...motionProps} className={cls}>{children}</motion.a>
  );
}

function FeaturedProjectImage({ type, copy }) {
  const frameClass = "featured-project-media";

  if (type === "njamko") {
    return (
      <div className={`${frameClass} featured-project-media-njamko`}>
        <img
          src="/njamko.png"
          alt="Njamko"
          loading="lazy"
          className="featured-project-media-image featured-project-media-image-contain"
        />
      </div>
    );
  }

  if (type === "bajkoteka" || type === "handyman" || type === "hackosaur") {
    const imageSrc = {
      bajkoteka: "/brand/bajkoteka-project.jpg",
      handyman: "/brand/handyman-project.jpg",
      hackosaur: "/brand/hackosaur-project.jpg",
    }[type];
    return (
      <div className={frameClass}>
        <img
          src={imageSrc}
          alt=""
          loading="lazy"
          className="featured-project-media-image featured-project-media-image-center"
        />
      </div>
    );
  }

  if (type === "autogubic") {
    return (
      <div className={frameClass}>
        <img
          src="/brand/autogubic.webp"
          alt="Auto Gubić web-stranica"
          loading="lazy"
          className="featured-project-media-image"
        />
      </div>
    );
  }

  if (type === "invite") {
    return (
      <div className={frameClass}>
        <img
          src="/brand/vidimose.webp"
          alt={copy.previewAlts.invite}
          loading="lazy"
          className="featured-project-media-image"
        />
      </div>
    );
  }

  if (type === "ai") {
    return (
      <div className={frameClass}>
        <img
          src="/brand/kpdinfo.webp"
          alt="KPDinfo.com"
          loading="lazy"
          className="featured-project-media-image"
        />
      </div>
    );
  }

  if (type === "geo") {
    return (
      <div className={frameClass}>
        <img
          src="/brand/geoadrese.webp"
          alt={copy.previewAlts.geo}
          loading="lazy"
          className="featured-project-media-image"
        />
      </div>
    );
  }

  if (type === "kadigra") {
    return (
      <div className={frameClass}>
        <img
          src="/brand/kadigrahrvatska.webp"
          alt={copy.previewAlts.kadigra}
          loading="lazy"
          className="featured-project-media-image featured-project-media-image-center"
        />
      </div>
    );
  }

  if (type === "weather") {
    return (
      <div className={frameClass}>
        <img
          src="/brand/vremenskaprognoza.webp"
          alt={copy.previewAlts.weather}
          loading="lazy"
          className="featured-project-media-image featured-project-media-image-center"
        />
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <img
        src="/brand/bezstruje.webp"
        alt={copy.previewAlts.outage}
        loading="lazy"
        className="featured-project-media-image"
      />
    </div>
  );
}

const HERO_MEDIA = {
  desktop: {
    webm: "/brand/hero-desktop.webm",
    mp4: "/brand/hero-desktop.mp4",
  },
  mobile: {
    webm: "/brand/hero-mobile.webm",
    mp4: "/brand/hero-mobile.mp4",
  },
};

function Hero({ copy, lang }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const sourceGenerationRef = useRef(0);
  const isHeroInViewportRef = useRef(true);
  const [enabledSourceKey, setEnabledSourceKey] = useState(null);
  const [playingSourceKey, setPlayingSourceKey] = useState(null);
  const sourceKey = isMobile ? "mobile" : "desktop";
  const videoSources = HERO_MEDIA[sourceKey];
  const showHeroVideo = reduceMotion !== true;
  const videoEnabled = showHeroVideo && enabledSourceKey === sourceKey;
  const videoPlaying = videoEnabled && playingSourceKey === sourceKey;

  useEffect(() => {
    if (!showHeroVideo) return undefined;

    let cancelled = false;
    const activateVideo = () => {
      if (!cancelled) {
        setEnabledSourceKey(sourceKey);
      }
    };
    const supportsIdleCallback = typeof window.requestIdleCallback === "function";
    const idleHandle = supportsIdleCallback
      ? window.requestIdleCallback(activateVideo, { timeout: 450 })
      : window.setTimeout(activateVideo, 250);

    return () => {
      cancelled = true;
      if (supportsIdleCallback) window.cancelIdleCallback?.(idleHandle);
      else window.clearTimeout(idleHandle);
    };
  }, [showHeroVideo, sourceKey]);

  useEffect(() => {
    if (!showHeroVideo || !sectionRef.current || !videoRef.current) return undefined;
    const video = videoRef.current;
    const generation = sourceGenerationRef.current + 1;
    sourceGenerationRef.current = generation;
    let active = true;

    const isCurrentGeneration = () => active && generation === sourceGenerationRef.current;
    const showPoster = () => {
      if (isCurrentGeneration()) setPlayingSourceKey(null);
    };
    const handlePlaying = () => {
      if (!isCurrentGeneration()) return;
      let currentPath;
      try {
        currentPath = new URL(video.currentSrc, window.location.href).pathname;
      } catch {
        showPoster();
        return;
      }
      if (currentPath === videoSources.webm || currentPath === videoSources.mp4) {
        setPlayingSourceKey(sourceKey);
      } else {
        showPoster();
      }
    };
    const syncPlayback = () => {
      if (videoEnabled && isHeroInViewportRef.current && document.visibilityState === "visible") {
        video.play().catch(showPoster);
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isHeroInViewportRef.current = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.05 },
    );

    video.pause();
    setPlayingSourceKey(null);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", showPoster);
    video.addEventListener("abort", showPoster);
    video.addEventListener("emptied", showPoster);
    observer.observe(sectionRef.current);
    document.addEventListener("visibilitychange", syncPlayback);
    video.load();
    syncPlayback();

    return () => {
      active = false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", showPoster);
      video.removeEventListener("abort", showPoster);
      video.removeEventListener("emptied", showPoster);
      video.pause();
    };
  }, [showHeroVideo, sourceKey, videoEnabled, videoSources.mp4, videoSources.webm]);

  return (
    <section ref={sectionRef} id="top" className="relative overflow-hidden px-4 pt-24 sm:pt-32 lg:pt-[7.25rem]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <picture className="hero-background-poster absolute inset-0 block size-full">
          <source media="(max-width: 767px)" srcSet="/nepar-background-mobile-900x1600.webp" />
          <img
            src="/nepar-background-desktop-2400x900.webp"
            alt=""
            width="2400"
            height="900"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover"
          />
        </picture>
        {showHeroVideo && (
          <video
            ref={videoRef}
            className={`hero-background-video absolute inset-0 size-full object-cover${videoPlaying ? " hero-background-video--visible" : ""}`}
            data-source-key={sourceKey}
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            disableRemotePlayback
          >
            {videoEnabled && (
              <>
                <source src={videoSources.webm} type="video/webm; codecs=vp9" />
                <source src={videoSources.mp4} type='video/mp4; codecs="hvc1"' />
              </>
            )}
          </video>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.48)_0%,rgba(255,255,255,0.02)_24%,rgba(255,255,255,0.04)_60%,rgba(255,255,255,0.72)_86%,#fff_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0.08)_44%,transparent_72%)]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[540px] bg-[radial-gradient(ellipse_at_52%_8%,rgba(37,99,235,0.12),transparent_56%)]" />
      <div className="mx-auto grid max-w-[1180px] items-center gap-2 sm:gap-8 lg:max-w-[1380px] lg:grid-cols-[minmax(360px,0.72fr)_minmax(0,1.28fr)]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition}
          className="relative z-10 max-w-[650px] lg:pb-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...quickRevealTransition, delay: 0.05 }}
            className="hero-kicker mb-5 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] shadow-lg shadow-violet-500/10"
          >
            <Zap size={15} />
            <span className="hero-kicker-text">{copy.hero.kicker}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.1 }}
            className="text-4xl font-semibold leading-[1.03] tracking-[-0.03em] text-slate-950 sm:text-5xl xl:text-[4rem]"
          >
            {copy.hero.lead}{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
              {copy.hero.highlight}
            </span>{" "}
            {copy.hero.rest}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.16 }}
            className="mt-5 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl"
          >
            {copy.hero.description}
          </motion.p>

          {!isDesktop && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...quickRevealTransition, delay: 0.2 }}
              className="sm:mt-2"
              data-testid="mobile-project-carousel"
            >
              <h2 className="sr-only">{copy.hero.mobileProjects}</h2>
              <OrbitalProjectCarousel lang={lang} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...quickRevealTransition, delay: 0.22 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <MotionButton href="#projekti" size="lg">
              {copy.hero.primary}
              <ArrowRight size={18} />
            </MotionButton>
            <MotionButton href="/kontakt" variant="secondary" size="lg">
              {copy.hero.secondary}
              <Mail size={18} />
            </MotionButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...quickRevealTransition, delay: 0.28 }}
            className="mt-7 flex flex-wrap gap-2.5"
          >
            {copy.hero.trust.map(([point, Icon]) => (
              <span
                key={point}
                className="hero-trust-chip inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-sm text-slate-600 shadow-sm backdrop-blur"
              >
                <Icon size={16} className="text-blue-600" />
                {point}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {isDesktop && (
          <div className="min-w-0">
            <h2 className="sr-only">{copy.hero.mobileProjects}</h2>
            <OrbitalProjectCarousel lang={lang} />
          </div>
        )}
      </div>
    </section>
  );
}

function StatsBar({ copy }) {
  return (
    <section className="proof-strip-section px-4 py-3 sm:py-5" aria-label="Product proof">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={quickRevealTransition}
        className="proof-strip mx-auto max-w-[1180px] lg:max-w-[1380px]"
      >
        <div className="proof-strip-grid">
          {copy.stats.map(([value, label, Icon]) => (
            <div key={label} className="proof-strip-item">
              <Icon size={20} aria-hidden="true" />
              <div className="min-w-0">
                <p className="proof-strip-value">{value}</p>
                <p className="proof-strip-label">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Services({ copy }) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <section id="usluge" className="overflow-x-hidden px-4 py-8 scroll-mt-24 sm:py-12">
      <div className="mx-auto grid max-w-[1180px] gap-6 lg:max-w-[1380px] xl:grid-cols-[280px_1fr]">
        <div className="xl:pt-3">
          <p className={`mb-3 ${eyebrowClass}`}>
            {copy.servicesSection.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-slate-900 sm:text-4xl">
            {copy.servicesSection.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {copy.servicesSection.description}
          </p>
        </div>

        <div className="services-bento">
          {copy.services.map(({ title, description, Icon, iconCls, backgroundSrc, artCls = "" }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: isMobile ? 8 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -120px 0px", amount: 0.24 }}
              transition={{ duration: isMobile ? 0.28 : 0.42, delay: index * (isMobile ? 0.025 : 0.055), ease: easeOut }}
              whileHover={isMobile ? undefined : cardHoverProps.whileHover}
              whileTap={{ scale: 0.99 }}
              className={`premium-card service-card service-card-${index + 1} group relative overflow-hidden p-5`}
            >
              <img src={backgroundSrc} alt="" loading="eager" className={`service-card-art ${artCls}`} />
              <div className="service-card-shade" aria-hidden="true" />
              <div className="service-card-content">
                <div className="flex items-center gap-3">
                  <div className={`grid size-12 place-items-center rounded-xl ring-1 backdrop-blur-sm transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:rotate-3 group-hover:scale-105 ${iconCls}`}>
                    <Icon size={23} aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                </div>
                <p className="text-sm leading-6 text-slate-700">{description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}


function WebStartPromo({ copy }) {
  const promo = copy.webStartPromo;
  return (
    <section className="offer-bridge px-4 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={revealTransition}
        className="offer-bridge-shell mx-auto max-w-[1180px] lg:max-w-[1380px]"
      >
        <div className="offer-bridge-copy">
          <p className={eyebrowClass}>{promo.eyebrow}</p>
          <h2>{promo.title}</h2>
          <p>{promo.description}</p>
        </div>
        <div className="offer-bridge-proof">
          <strong>{promo.highlight}</strong>
          <span>{promo.secondaryNote}</span>
        </div>
        <div className="offer-bridge-action">
          <div>
            <p className={eyebrowClass}>{promo.ctaLabel}</p>
            <p>{promo.ctaNote}</p>
          </div>
          <MotionButton href="/usluge/izrada-web-stranica#paketi" size="lg" className="w-full sm:w-auto">
            {promo.cta}
            <ArrowRight size={18} />
          </MotionButton>
        </div>
      </motion.div>
    </section>
  );
}

function FeaturedProjectCard({ project, copy, duplicate = false }) {
  const ProjectShell = project.internal ? MotionLink : project.href ? motion.a : motion.article;
  const linkProps = project.internal
    ? { to: project.href }
    : project.href
    ? {
        href: project.href,
        target: "_blank",
        rel: "noreferrer",
        ...(duplicate ? { tabIndex: -1 } : {}),
      }
    : {};

  return (
    <ProjectShell
      {...linkProps}
      className="featured-project-card group"
    >
      <FeaturedProjectImage type={project.preview} copy={copy} />
      <div className="featured-project-card-copy">
        <div className="featured-project-card-heading">
          <h3 className={project.title.length > 18 ? "featured-project-title-long" : undefined}>
            {project.title.split(/(?=[A-Z])/).map((part, index) => (
              <span key={`${part}-${index}`}>{index > 0 && <wbr />}{part}</span>
            ))}
          </h3>
        </div>
        <p>{project.description}</p>
      </div>
    </ProjectShell>
  );
}

function FeaturedProjects({ copy }) {
  const projects = [...copy.projects, ...copy.featuredOnlyProjects];

  return (
    <section id="projekti" className="project-lab-section px-4 py-3 scroll-mt-24 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={revealTransition}
        className="project-lab mx-auto max-w-[1180px] lg:max-w-[1380px]"
      >
        <div className="project-lab-header">
          <div>
            <p className="project-lab-kicker">PRODUCT LAB</p>
            <h2>{copy.featured.eyebrow}</h2>
          </div>
          <p>{copy.featured.summary}</p>
        </div>
        <div className="featured-projects-grid" role="list" aria-label={copy.featured.eyebrow}>
          {projects.map((project) => (
            <div key={project.title} role="listitem">
              <FeaturedProjectCard project={project} copy={copy} />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function About({ copy, isEvolutionOpen, onPlayEvolution }) {
  const triggerRef = useRef(null);
  const wasEvolutionOpenRef = useRef(false);

  useEffect(() => {
    if (wasEvolutionOpenRef.current && !isEvolutionOpen) triggerRef.current?.focus();
    wasEvolutionOpenRef.current = isEvolutionOpen;
  }, [isEvolutionOpen]);

  return (
    <section id="onama" className="px-4 py-8 scroll-mt-24 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={revealTransition}
        className="premium-card mx-auto grid max-w-[1180px] gap-6 p-5 lg:max-w-[1380px] lg:grid-cols-[0.72fr_1.28fr]"
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={onPlayEvolution}
          className="about-animation-trigger pressable group relative min-h-56 overflow-hidden rounded-2xl bg-slate-950 text-left"
          aria-label={copy.about.imageLabel}
        >
          <img
            src="/evolution-frames/evolution-frame-120.webp"
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-transparent to-slate-950/12" />
          <span className="about-animation-play">
            <span aria-hidden="true"><Play size={19} fill="currentColor" /></span>
            {copy.about.playLabel}
          </span>
        </button>
        <div className="flex flex-col justify-center p-2 lg:p-5">
          <p className={`mb-3 ${eyebrowClass}`}>
            {copy.about.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-slate-900 sm:text-4xl">
            {copy.about.title}
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
            {copy.about.description}
          </p>
          <ol className="about-process" aria-label={copy.about.eyebrow}>
            {copy.about.process.map(([step, title, description]) => (
              <li key={step}>
                <span>{step}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    </section>
  );
}

function BottomCta({ copy }) {
  const animateDecoration = false;

  return (
    <section id="kontakt" className="product-lab-cta px-4 py-6 sm:py-10">
      <div className="cta-shell relative mx-auto max-w-[1180px] overflow-hidden rounded-2xl px-3 py-2.5 sm:px-6 sm:py-4 lg:max-w-[1380px]">
        <div className="footer-motion-field" aria-hidden="true">
          <div className="footer-stars-track" />
          <div className="footer-stars-track footer-stars-track-alt" />
          <div className="footer-wave-track footer-wave-track-cyan">
            {[0, 1].map((copy) => (
              <svg
                key={copy}
                className="footer-wave-panel"
                viewBox="0 0 1000 140"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 76 C 84 24 166 128 250 76 S 416 24 500 76 S 666 128 750 76 S 916 24 1000 76"
                  fill="none"
                  stroke={`url(#footerWaveCyan${copy})`}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 102 C 104 62 146 128 250 102 S 396 62 500 102 S 646 128 750 102 S 896 62 1000 102"
                  fill="none"
                  stroke="rgba(37,99,235,0.32)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id={`footerWaveCyan${copy}`} x1="0%" x2="100%" y1="50%" y2="50%">
                    <stop offset="0%" stopColor="rgba(59,130,246,0)" />
                    <stop offset="18%" stopColor="rgba(59,130,246,0.55)" />
                    <stop offset="42%" stopColor="rgba(8,145,178,0.7)" />
                    <stop offset="62%" stopColor="rgba(37,99,235,0.55)" />
                    <stop offset="82%" stopColor="rgba(124,58,237,0.55)" />
                    <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                  </linearGradient>
                </defs>
              </svg>
            ))}
          </div>
          <div className="footer-wave-track footer-wave-track-violet">
            {[0, 1].map((copy) => (
              <svg
                key={copy}
                className="footer-wave-panel"
                viewBox="0 0 1000 140"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 48 C 96 92 154 6 250 48 S 404 92 500 48 S 654 6 750 48 S 904 92 1000 48"
                  fill="none"
                  stroke={`url(#footerWaveViolet${copy})`}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id={`footerWaveViolet${copy}`} x1="0%" x2="100%" y1="50%" y2="50%">
                    <stop offset="0%" stopColor="rgba(217,70,239,0)" />
                    <stop offset="22%" stopColor="rgba(217,70,239,0.45)" />
                    <stop offset="50%" stopColor="rgba(124,58,237,0.72)" />
                    <stop offset="76%" stopColor="rgba(34,211,238,0.38)" />
                    <stop offset="100%" stopColor="rgba(217,70,239,0)" />
                  </linearGradient>
                </defs>
              </svg>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-cyan-400/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/30 to-transparent" />
        <div className="relative flex flex-col items-center justify-between gap-2 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="relative shrink-0">
              <motion.div
                animate={animateDecoration ? { rotate: 360 } : false}
                transition={animateDecoration ? { duration: 9, repeat: Infinity, ease: "linear" } : undefined}
                className="absolute -inset-1 rounded-full border border-blue-300/25 shadow-[0_0_14px_rgba(59,130,246,0.18)] sm:-inset-2 sm:border-blue-300/35 sm:shadow-[0_0_28px_rgba(59,130,246,0.26)]"
              />
              <motion.div
                animate={animateDecoration ? { y: [0, -3, 0], rotate: [0, 3, 0] } : false}
                transition={animateDecoration ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
                className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-violet-500/20 sm:size-14 sm:shadow-xl sm:shadow-violet-500/30"
              >
                <Rocket className="size-4 sm:size-6" />
              </motion.div>
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-tight tracking-[-0.02em] text-slate-900 sm:text-2xl">
                {copy.cta.title}
              </h2>
              <p className="mt-0.5 max-w-2xl text-xs leading-4 text-slate-600 sm:mt-1 sm:text-sm sm:leading-normal">
                {copy.cta.description}
              </p>
            </div>
          </div>
          <MotionButton
            href="/kontakt"
            size="sm"
            className="w-full sm:w-auto"
          >
            {copy.cta.button}
            <Send className="size-4 sm:size-[17px]" />
          </MotionButton>
        </div>
      </div>
    </section>
  );
}

export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#f8fafc]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.10),transparent_32%),linear-gradient(315deg,rgba(14,165,233,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.85),rgba(248,250,252,0.98))]" />
      <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(100,116,139,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,.14)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white/70 to-transparent" />
    </div>
  );
}

function HomePage() {
  const [lang, setLang] = useState("hr");
  const [showEvolutionIntro, setShowEvolutionIntro] = useState(false);
  const copy = content[lang];
  usePageMeta("/", lang);

  const completeEvolutionIntro = useCallback(() => {
    setShowEvolutionIntro(false);
  }, []);

  return (
    <>
      {showEvolutionIntro && <ComputerEvolutionIntro onComplete={completeEvolutionIntro} />}
      <main
        className={`legacy-home relative min-h-screen overflow-x-hidden font-sans text-slate-800${showEvolutionIntro ? " landing-is-inert" : ""}`}
        data-testid="landing-page"
        inert={showEvolutionIntro ? true : undefined}
        aria-hidden={showEvolutionIntro ? "true" : undefined}
      >
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={copy} />
      <Hero copy={copy} lang={lang} />
      <StatsBar copy={copy} />
      <Services copy={copy} />
      <FeaturedProjects copy={copy} />
      <WebStartPromo copy={copy} />
      <About
        copy={copy}
        isEvolutionOpen={showEvolutionIntro}
        onPlayEvolution={() => setShowEvolutionIntro(true)}
      />
      <BottomCta copy={copy} />
      <footer className="px-4 pb-8 sm:pb-12">
        <div className="mx-auto max-w-[1180px] lg:max-w-[1380px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            transition={revealTransition}
            className="border-t border-slate-200 pt-8 sm:pt-10"
          >
            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={`mb-2 ${eyebrowClass}`}>
                  {copy.footer.infoLabel}
                </p>
                <p className="text-sm font-medium text-slate-700">{copy.footer.companyName}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-0.5 text-xs text-slate-500">
                  <span>{copy.footer.owner}</span>
                  <span>{copy.footer.mbo}</span>
                  <a href="mailto:nepar@nepar.hr" className="transition hover:text-slate-900">
                    {copy.footer.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 sm:flex-row sm:gap-4 sm:pt-5 sm:text-sm">
              <p>{copy.footer.copyright}</p>
              <div className="footer-utility-links">
                <Link to="/privatnost">{lang === "hr" ? "Privatnost" : "Privacy"}</Link>
                <ConsentSettingsLink lang={lang} />
                <a href="#top" className="transition hover:text-slate-900">{copy.footer.top}</a>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
      </main>
    </>
  );
}

function forceScrollTop() {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      root.style.scrollBehavior = prev;
    });
  });
}

const NON_SCROLLING_HASHES = new Set(["#redizajn", "#odrzavanje"]);

function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (hash && !NON_SCROLLING_HASHES.has(hash) && window.history.replaceState) {
        window.history.replaceState(null, "", pathname);
      }
      if (document.querySelector('[data-testid="evolution-intro"]')) {
        forceScrollTop();
        return undefined;
      }
      forceScrollTop();
      const t1 = setTimeout(forceScrollTop, 100);
      const t2 = setTimeout(forceScrollTop, 400);
      const t3 = setTimeout(forceScrollTop, 900);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    if (NON_SCROLLING_HASHES.has(hash)) return undefined;
    if (hash) {
      const id = hash.slice(1);
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else forceScrollTop();
      }, 50);
      return () => clearTimeout(timer);
    }
    forceScrollTop();
  }, [pathname, hash, key]);
  return null;
}

function PageViewTracker() {
  const { pathname, key } = useLocation();

  useEffect(() => {
    const sendCurrentPageView = () => trackPageView({
      path: pathname,
      title: document.title,
      navigationKey: key,
    });
    const timer = window.setTimeout(() => {
      void sendCurrentPageView();
    }, 250);
    const unsubscribe = subscribeConsentChanges((state) => {
      if (state.analytics) void sendCurrentPageView();
    });

    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, [key, pathname]);

  return null;
}

function LegacyWebRedirect() {
  const { hash } = useLocation();
  return <Navigate to={`/usluge/izrada-web-stranica${hash || ""}`} replace />;
}

function RouteFallback() {
  return <div className="route-fallback" role="status" aria-live="polite">Učitavanje…</div>;
}

function NotFoundPage() {
  usePageMeta("/404", "hr");
  return (
    <main className="not-found-page">
      <div>
        <p>404</p>
        <h1>Stranica nije pronađena.</h1>
        <span>Provjerite adresu ili se vratite na naslovnicu.</span>
        <Link to="/" className="button button-primary">Natrag na naslovnicu</Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageViewTracker />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/privatnost" element={<PrivacyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/usluge/izrada-web-stranica" element={<WebStartPage />} />
          <Route path="/usluge/web-stranica-bez-pocetnog-troska" element={<LegacyWebRedirect />} />
          <Route path="/mozgalica" element={<MozgalicaPage />} />
          <Route path="/njamko" element={<NjamkoPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ConsentManager />
    </BrowserRouter>
  );
}
