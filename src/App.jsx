import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import ContactPage from "./ContactPage.jsx";
import AdminPage from "./AdminPage.jsx";
import WebStartPage from "./WebStartPage.jsx";
import MozgalicaPage from "./mozgalica/MozgalicaPage.jsx";
import NjamkoPage from "./njamko/NjamkoPage.jsx";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Database,
  DatabaseZap,
  ExternalLink,
  Globe,
  Grid3X3,
  Heart,
  Layers,
  Mail,
  Map,
  MapPin,
  Menu,
  Monitor,
  Plus,
  Puzzle,
  Rocket,
  Search,
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
import { PILOT_TOTAL, usePilotFillCount } from "./usePilotFillCount.js";
import { trackPageView } from "./analytics.js";

const easeOut = [0.23, 1, 0.32, 1];
const easeInOut = [0.77, 0, 0.175, 1];
const revealTransition = { duration: 0.48, ease: easeOut };
const quickRevealTransition = { duration: 0.32, ease: easeOut };

const content = {
  hr: {
    navLinks: [
      ["Projekti", "#projekti"],
      ["Usluge", "#usluge"],
      ["Cjenik", "/usluge/web-stranica-bez-pocetnog-troska#paketi", BadgeEuro],
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
    ],
    services: [
      {
        title: "Web aplikacije",
        description: "Pretvaramo ideje u brze, sigurne i skalabilne web aplikacije prilago\u0111ene va\u0161em poslovanju \u2014 od prototipa do produkcije.",
        Icon: Globe,
        iconCls: "bg-blue-500/15 text-blue-300 ring-blue-400/20",
        blurCls: "bg-blue-400/12",
      },
      {
        title: "Portali i alati",
        description: "Specijalizirani portali i pametni alati koji rje\u0161avaju prave probleme va\u0161ih korisnika \u2014 br\u017ee, jednostavnije, u\u010dinkovitije.",
        Icon: Layers,
        iconCls: "bg-violet-500/15 text-violet-300 ring-violet-400/20",
        blurCls: "bg-violet-400/12",
      },
      {
        title: "AI i automatizacija",
        description: "AI asistenti i automatizacija koja preuzima repetitivne zadatke, ubrzava procese i osloba\u0111a va\u0161 tim za ono \u0161to je zaista va\u017eno.",
        Icon: Wand2,
        iconCls: "bg-cyan-500/15 text-cyan-300 ring-cyan-400/20",
        blurCls: "bg-cyan-400/12",
      },
      {
        title: "Mape i podaci",
        description: "Geo rje\u0161enja, pretraga adresa i prostorne analize integrirane direktno u va\u0161 sustav \u2014 precizno, pouzdano i u stvarnom vremenu.",
        Icon: Database,
        iconCls: "bg-amber-500/15 text-amber-300 ring-amber-400/20",
        blurCls: "bg-amber-400/12",
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
      eyebrow: "NOVA USLUGA",
      title: "Jedan profesionalni link za va\u0161 posao",
      description:
        "Instagram, Facebook i Google Maps ve\u0107 vam donose vidljivost. Mi dodajemo prodajnu stranicu koja sve to povezuje i pretvara posjete u konkretne upite \u2014 bez po\u010detnog tro\u0161ka izrade.",
      highlight:
        "Jedan profesionalni link koji pretvara Instagram, Facebook i Google Maps posjete u konkretne upite.",
      trustStat:
        "potro\u0161a\u010da smatra da je poslovanje s web stranicom vjerodostojnije od poslovanja koje ima samo profil na dru\u0161tvenim mre\u017eama.",
      trustSource: "Izvor: Verisign Online Survey",
      cta: "Pogledaj pakete",
      secondaryNote:
        "Pilot ponuda od 30 \u20ac/mj za prvih 10 klijenata. Business paket od 59 \u20ac/mj i Pro paket od 89 \u20ac/mj za firme koje \u017eele vi\u0161e upita, rezervacija i analitiku.",
      pilotLabel: "Pilot popunjenost",
      pilotNote: "30 \u20ac/mj za prvih 10 klijenata",
      pilotFilledLabel: "mjesta popunjeno",
      pilotRemainingLabel: "mjesta preostalo",
      redesignTitle: "Redizajn postojećeg weba",
      redesignText: "Već imate web, ali izgleda zastarjelo ili loše na mobitelu? Osvježimo ga od 200 €.",
      redesignCta: "Pogledaj redizajn pakete",
    },
    featured: {
      eyebrow: "IZDVOJENI PROJEKTI",
      link: "Pogledaj sve projekte",
    },
    about: {
      eyebrow: "O NAMA",
      imageLabel: "Otvori Nepar Solutions sliku",
      closeLabel: "Zatvori Nepar Solutions sliku",
      title: "Tehni\u010dka izvedba, jasna komunikacija i fokus na proizvod koji radi.",
      description:
        "Nepar Solutions spaja razvoj web aplikacija, AI rje\u0161enja, portala, integracija i rada s podacima u jedan prakti\u010dan proces.",
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
    },
  },
  en: {
    navLinks: [
      ["Projects", "#projekti"],
      ["Services", "#usluge"],
      ["Pricing", "/usluge/web-stranica-bez-pocetnog-troska#paketi", BadgeEuro],
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
    ],
    services: [
      {
        title: "Web applications",
        description: "We turn ideas into fast, secure, and scalable web applications built for your business — from prototype to production.",
        Icon: Globe,
        iconCls: "bg-blue-500/15 text-blue-300 ring-blue-400/20",
        blurCls: "bg-blue-400/12",
      },
      {
        title: "Portals and tools",
        description: "Specialized portals and smart tools that solve real user problems — faster, simpler, and more effectively.",
        Icon: Layers,
        iconCls: "bg-violet-500/15 text-violet-300 ring-violet-400/20",
        blurCls: "bg-violet-400/12",
      },
      {
        title: "AI and automation",
        description: "AI assistants and automation that take over repetitive tasks, speed up processes, and free your team for what truly matters.",
        Icon: Wand2,
        iconCls: "bg-cyan-500/15 text-cyan-300 ring-cyan-400/20",
        blurCls: "bg-cyan-400/12",
      },
      {
        title: "Maps and data",
        description: "Geo solutions, address search, and spatial analytics integrated directly into your system — precise, reliable, and real-time.",
        Icon: Database,
        iconCls: "bg-amber-500/15 text-amber-300 ring-amber-400/20",
        blurCls: "bg-amber-400/12",
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
      eyebrow: "NEW SERVICE",
      title: "One professional link for your business",
      description:
        "Instagram, Facebook, and Google Maps already bring visibility. We add a sales page that connects them and turns visits into real inquiries \u2014 with no upfront build cost.",
      highlight:
        "One professional link that turns Instagram, Facebook, and Google Maps visits into real inquiries.",
      trustStat:
        "of consumers believe a business with a website is more credible than one with social media profiles only.",
      trustSource: "Source: Verisign Online Survey",
      cta: "View plans",
      secondaryNote:
        "Pilot offer from \u20ac30/mo for the first 10 clients. Business plan from \u20ac59/mo and Pro plan from \u20ac89/mo for businesses that want more inquiries, bookings, and analytics.",
      pilotLabel: "Pilot availability",
      pilotNote: "\u20ac30/mo for the first 10 clients",
      pilotFilledLabel: "spots taken",
      pilotRemainingLabel: "spots left",
      redesignTitle: "Redesign of your existing website",
      redesignText: "Already have a website that looks outdated or poor on mobile? Refresh it from €200.",
      redesignCta: "View redesign plans",
    },
    featured: {
      eyebrow: "FEATURED PROJECTS",
      link: "View all projects",
    },
    about: {
      eyebrow: "ABOUT US",
      imageLabel: "Open Nepar Solutions image",
      closeLabel: "Close Nepar Solutions image",
      title: "Technical delivery, clear communication, and focus on a product that works.",
      description:
        "Nepar Solutions brings together web app development, AI solutions, portals, integrations, and data work into one practical process.",
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
    },
  },
};

export { content };

export function LanguageToggle({ lang, setLang }) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="relative inline-flex shrink-0 rounded-full border border-slate-200/80 bg-white/90 p-0.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur"
    >
      {["hr", "en"].map((value) => {
        const isActive = lang === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setLang(value)}
            className="pressable relative z-10 rounded-full px-2.5 py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
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
    if (!onHome) {
      setActiveSection(null);
      return;
    }
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
          className="premium-button pressable hidden select-all items-center gap-2.5 rounded-xl px-4 py-2.5 text-base font-semibold text-white lg:inline-flex"
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
              <MotionButton href="/kontakt" className="mt-1 justify-self-start rounded-xl px-5 py-3 text-sm sm:mt-2 sm:justify-self-stretch sm:rounded-xl sm:px-6 sm:py-4 sm:text-base">
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

export function MotionButton({ href, onClick, children, className = "", variant = "primary", type = "button" }) {
  const primary = variant === "primary";
  const cls = `pressable inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition ${
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

function ProjectPreviewSmall({ type, copy }) {
  if (type === "invite") {
    return (
      <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-fuchsia-300/50 bg-slate-100">
        <img
          src="/brand/vidimose.webp"
          alt={copy.previewAlts.invite}
          loading="lazy"
          className="h-full w-full object-cover object-top"
        />
      </div>
    );
  }

  if (type === "ai") {
    return (
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-blue-300/50 bg-slate-100">
        <img
          src="/brand/kpdinfo.webp"
          alt="KPDinfo.com"
          loading="lazy"
          className="absolute inset-0 size-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
        <div className="absolute inset-x-1.5 bottom-1.5 flex h-4 items-end gap-0.5">
          {[35, 62, 50, 74].map((height) => (
            <span
              key={height}
              className="flex-1 rounded-t bg-gradient-to-t from-blue-600 to-cyan-300 opacity-80"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === "geo") {
    return (
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-blue-300/50 bg-slate-100">
        <img
          src="/brand/geoadrese.webp"
          alt={copy.previewAlts.geo}
          loading="lazy"
          className="absolute inset-0 size-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent" />
        <MapPin className="absolute bottom-2 right-2 text-cyan-200 drop-shadow" size={18} />
      </div>
    );
  }

  if (type === "kadigra") {
    return (
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-red-300/50 bg-slate-100">
        <img
          src="/brand/kadigrahrvatska.webp"
          alt={copy.previewAlts.kadigra}
          loading="lazy"
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-blue-300/50 bg-slate-100">
      <img
        src="/brand/bezstruje.png"
        alt={copy.previewAlts.outage}
        loading="lazy"
        className="absolute inset-0 size-full object-cover object-top opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent" />
      <img
        src="/brand/bezstruje_logo.png"
        alt=""
        loading="lazy"
        className="absolute bottom-1.5 left-1.5 h-5 w-auto rounded bg-white/85 p-0.5"
      />
    </div>
  );
}

function Hero({ copy, lang }) {
  return (
    <section id="top" className="relative px-4 pt-24 sm:pt-32 lg:pt-[7.25rem]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[540px] bg-[radial-gradient(ellipse_at_52%_8%,rgba(59,130,246,0.13),transparent_56%)]" />
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
            className="text-4xl font-semibold leading-[1.03] tracking-normal text-slate-950 sm:text-5xl xl:text-[4rem]"
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

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...quickRevealTransition, delay: 0.22 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <MotionButton href="#projekti" className="inline-flex px-6 py-4">
              {copy.hero.primary}
              <ArrowRight size={18} />
            </MotionButton>
            <MotionButton href="/kontakt" variant="secondary" className="inline-flex px-6 py-4">
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
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-sm text-slate-600 shadow-sm backdrop-blur"
              >
                <Icon size={16} className="text-blue-600" />
                {point}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...quickRevealTransition, delay: 0.34 }}
            className="mt-3 -mb-3 lg:hidden"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/50 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg shadow-cyan-500/10 backdrop-blur">
              <motion.span
                aria-hidden="true"
                animate={{ scale: [1, 1.25, 1], opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="size-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.8)]"
              />
              {copy.hero.mobileProjects}
              <motion.span
                aria-hidden="true"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="h-px w-8 bg-gradient-to-r from-cyan-300 to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>

        <OrbitalProjectCarousel lang={lang} />
      </div>
    </section>
  );
}

function StatsBar({ copy }) {
  return (
    <section className="px-4 py-3 sm:py-5">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={quickRevealTransition}
        className="premium-card mx-auto max-w-[1180px] px-5 py-4 lg:max-w-[1380px]"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-slate-200/80">
          {copy.stats.map(([value, label, Icon]) => (
            <div key={label} className="group flex items-center justify-center gap-4 rounded-xl px-2 py-2 transition-colors duration-200 hover:bg-slate-50/80 lg:px-6">
              <Icon size={32} className="text-blue-600 transition-transform duration-200 group-hover:scale-105" />
              <div>
                <p className="text-3xl font-semibold leading-none text-slate-900">{value}</p>
                <p className="mt-1 text-sm text-slate-600">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Services({ copy }) {
  return (
    <section id="usluge" className="overflow-x-hidden px-4 py-8 scroll-mt-24 sm:py-10">
      <div className="mx-auto grid max-w-[1180px] gap-6 lg:max-w-[1380px] xl:grid-cols-[280px_1fr]">
        <div className="xl:pt-3">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            {copy.servicesSection.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-normal text-slate-900 sm:text-4xl">
            {copy.servicesSection.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {copy.servicesSection.description}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {copy.services.map(({ title, description, Icon, iconCls, blurCls }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -120px 0px", amount: 0.24 }}
              transition={{ duration: 0.42, delay: index * 0.055, ease: easeOut }}
              whileHover={{ y: -4, scale: 1.008 }}
              whileTap={{ scale: 0.99 }}
              className="premium-card service-card group relative min-h-[230px] overflow-hidden p-5"
            >
              <div className={`absolute -right-10 -top-10 size-28 rounded-full opacity-70 blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${blurCls}`} />
              <div className="relative mb-4 flex items-center gap-3">
                <div className={`grid size-12 place-items-center rounded-2xl ring-1 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:rotate-3 group-hover:scale-105 ${iconCls}`}>
                  <Icon size={23} />
                </div>
                <h3 className="text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-blue-700">{title}</h3>
              </div>
              <p className="relative text-sm leading-6 text-slate-600">{description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PilotCapacitySlider({ promo }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduceMotion = useReducedMotion();
  const filledCount = usePilotFillCount(inView);
  const fillPercent = (filledCount / PILOT_TOTAL) * 100;
  const remaining = PILOT_TOTAL - filledCount;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-blue-200/75 bg-white/90 p-4 shadow-lg shadow-blue-200/30 sm:p-5"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-cyan-400/12 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-4 size-20 rounded-full bg-violet-400/10 blur-2xl" />

      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-blue-600">{promo.pilotLabel}</p>
            <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">{promo.pilotNote}</p>
          </div>
          <motion.span
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.35, ease: easeOut, delay: 0.1 }}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200/80 sm:text-xs"
          >
            <Sparkles size={12} />
            30 €/mj
          </motion.span>
        </div>

        <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80">
          <motion.div
            initial={{ width: reduceMotion ? `${fillPercent}%` : "0%" }}
            animate={{ width: inView ? `${fillPercent}%` : reduceMotion ? `${fillPercent}%` : "0%" }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: easeOut }}
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500 shadow-sm shadow-blue-500/30"
          />
          {!reduceMotion && (
            <motion.div
              aria-hidden="true"
              initial={{ x: "-120%" }}
              animate={inView ? { x: "320%" } : { x: "-120%" }}
              transition={{ duration: 1.6, ease: "linear", repeat: Infinity, repeatDelay: 0.8 }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
          )}
          <motion.div
            aria-hidden="true"
            initial={{ left: "0%" }}
            animate={{ left: inView ? `${fillPercent}%` : "0%" }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: easeOut }}
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-violet-600 shadow-md shadow-blue-500/35"
          />
        </div>

        <div className="mt-4 grid grid-cols-10 gap-1 sm:gap-1.5">
          {Array.from({ length: PILOT_TOTAL }, (_, index) => {
            const filled = index < filledCount;
            return (
              <motion.span
                key={index}
                initial={{ scaleY: 0.35, opacity: 0.45 }}
                animate={
                  inView
                    ? { scaleY: filled ? 1 : 0.85, opacity: filled ? 1 : 0.55 }
                    : { scaleY: 0.35, opacity: 0.45 }
                }
                transition={{
                  duration: reduceMotion ? 0 : 0.35,
                  ease: easeOut,
                }}
                className={`block h-8 origin-bottom rounded-md sm:h-9 ${
                  filled
                    ? "bg-gradient-to-t from-blue-600 to-violet-500 shadow-sm shadow-blue-500/20"
                    : "bg-slate-100 ring-1 ring-slate-200/80"
                }`}
                aria-hidden="true"
              />
            );
          })}
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: easeOut, delay: 0.55 }}
            className="text-xl font-semibold tabular-nums text-slate-900 sm:text-2xl"
          >
            {filledCount}
            <span className="text-base font-medium text-slate-400 sm:text-lg"> / {PILOT_TOTAL}</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: easeOut, delay: 0.62 }}
            className="text-right text-xs text-slate-600 sm:text-sm"
          >
            <span className="block font-medium text-slate-800">{promo.pilotFilledLabel}</span>
            {remaining} {promo.pilotRemainingLabel}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

function WebStartPromo({ copy }) {
  const promo = copy.webStartPromo;
  return (
    <section className="px-4 py-2 sm:py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-[1180px] overflow-hidden rounded-2xl border border-blue-200/70 bg-white/85 p-5 shadow-xl shadow-blue-200/35 backdrop-blur-md sm:p-7 lg:max-w-[1380px]"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-cyan-400/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 size-32 rounded-full bg-violet-400/10 blur-2xl" />
        <div className="relative grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(220px,300px)_auto] lg:items-center lg:gap-6 xl:gap-8">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{promo.eyebrow}</p>
            <h2 className="text-xl font-semibold leading-tight text-slate-900 sm:text-2xl lg:text-3xl">{promo.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{promo.description}</p>
            <p className="mt-3 max-w-3xl rounded-xl border border-blue-200/70 bg-blue-50/60 px-3.5 py-3 text-sm font-medium leading-6 text-slate-800 sm:px-4 sm:text-base">
              {promo.highlight}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, ease: easeOut, delay: 0.08 }}
              className="mt-3 max-w-3xl rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-3 sm:px-4"
            >
              <p className="text-sm leading-6 text-slate-700">
                <span className="font-semibold text-blue-600">84%</span> {promo.trustStat}
              </p>
              <p className="mt-1 text-xs text-slate-500">{promo.trustSource}</p>
            </motion.div>
            <p className="mt-3 max-w-3xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">{promo.secondaryNote}</p>
            <a
              href="/usluge/web-stranica-bez-pocetnog-troska#redizajn-weba"
              className="mt-4 flex max-w-3xl flex-col gap-2 rounded-xl border border-violet-200/70 bg-violet-50/50 px-4 py-3 transition hover:border-violet-300 hover:bg-violet-50/80 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="min-w-0 text-left">
                <p className="text-sm font-semibold text-slate-900">{promo.redesignTitle}</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-600 sm:text-sm">{promo.redesignText}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-violet-700">
                {promo.redesignCta}
                <ArrowRight size={16} />
              </span>
            </a>
          </div>

          <PilotCapacitySlider promo={promo} />

          <MotionButton
            href="/usluge/web-stranica-bez-pocetnog-troska#paketi"
            className="inline-flex w-full px-5 py-3.5 text-sm sm:px-6 sm:py-4 sm:text-base lg:w-auto lg:shrink-0 lg:self-center"
          >
            {promo.cta}
            <ArrowRight size={18} />
          </MotionButton>
        </div>
      </motion.div>
    </section>
  );
}

function FeaturedProjects({ copy }) {
  return (
    <section id="projekti" className="px-4 py-8 scroll-mt-24 sm:py-10">
      <div className="mx-auto max-w-[1180px] border-t border-slate-200/80 pt-5 lg:max-w-[1380px]">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-900 sm:mb-5">
          {copy.featured.eyebrow}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {copy.projects.map((project, index) => {
              const Icon = project.Icon;
              const ProjectShell = project.href ? motion.a : motion.article;
              const linkProps = project.href
                ? { href: project.href, target: "_blank", rel: "noreferrer" }
                : {};

              return (
                <ProjectShell
                  {...linkProps}
                  key={project.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.34, delay: index * 0.045, ease: easeOut }}
                  whileHover={{ y: -3, scale: 1.006 }}
                  whileTap={{ scale: 0.99 }}
                  className="premium-card group flex min-h-[112px] items-center gap-3 p-3"
                >
                  <ProjectPreviewSmall type={project.preview} copy={copy} />
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`grid size-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${project.accent} text-white`}>
                        <Icon size={15} />
                      </span>
                      <h3 className="truncate text-sm font-semibold text-slate-900 transition-colors duration-200 group-hover:text-blue-700">{project.title}</h3>
                    </div>
                    <p className="text-sm leading-5 text-slate-600">{project.description}</p>
                  </div>
                </ProjectShell>
              );
            })}
        </div>
      </div>
    </section>
  );
}

function About({ copy, lang }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const brandImg = lang === "en" ? "/brand/nepar-eng.webp" : "/brand/nepar.webp";

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) triggerRef.current?.focus();
  }, [open]);

  return (
    <section id="onama" className="px-4 py-10 scroll-mt-24 sm:py-12">
      <div className="premium-card mx-auto grid max-w-[1180px] gap-6 p-5 lg:max-w-[1380px] lg:grid-cols-[0.72fr_1.28fr]">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="pressable group relative min-h-56 overflow-hidden rounded-2xl border border-blue-300/30 bg-slate-100 text-left shadow-inner shadow-slate-900/5"
          aria-label={copy.about.imageLabel}
        >
          <img
            src={brandImg}
            alt="Nepar Solutions brand"
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-95 transition-transform duration-300 group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/18 via-transparent to-violet-500/18" />
        </button>
        <div className="flex flex-col justify-center p-2 lg:p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            {copy.about.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-normal text-slate-900">
            {copy.about.title}
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
            {copy.about.description}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={copy.about.imageLabel}
            className="fixed inset-0 z-[80] grid place-items-center bg-slate-900/45 px-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.button
              type="button"
              autoFocus
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-blue-500/25"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ type: "spring", duration: 0.34, bounce: 0.12 }}
              onClick={() => setOpen(false)}
              aria-label={copy.about.closeLabel}
            >
              <img
                src={brandImg}
                alt="Nepar Solutions brand"
                className="block max-h-[82vh] w-full object-contain"
              />
              <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-slate-200 bg-white/85 text-slate-700 backdrop-blur">
                <X size={18} />
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function BottomCta({ copy }) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="kontakt" className="fixed inset-x-0 bottom-0 z-40 px-2 pb-2 sm:px-5 sm:pb-5">
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
                animate={reduceMotion ? false : { rotate: 360 }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 rounded-full border border-blue-300/25 shadow-[0_0_14px_rgba(59,130,246,0.18)] sm:-inset-2 sm:border-blue-300/35 sm:shadow-[0_0_28px_rgba(59,130,246,0.26)]"
              />
              <motion.div
                animate={reduceMotion ? false : { y: [0, -3, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-violet-500/20 sm:size-14 sm:shadow-xl sm:shadow-violet-500/30"
              >
                <Rocket className="size-4 sm:size-6" />
              </motion.div>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-normal text-slate-900 sm:text-2xl">
                {copy.cta.title}
              </h2>
              <p className="mt-0.5 max-w-2xl text-xs leading-4 text-slate-600 sm:mt-1 sm:text-sm sm:leading-normal">
                {copy.cta.description}
              </p>
            </div>
          </div>
          <MotionButton
            href="/kontakt"
            className="inline-flex w-full px-4 py-2 text-xs sm:w-auto sm:px-5 sm:py-3 sm:text-sm"
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
  const copy = content[lang];

  return (
    <main className="relative min-h-screen overflow-x-hidden font-sans text-slate-800">
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={copy} />
      <Hero copy={copy} lang={lang} />
      <StatsBar copy={copy} />
      <Services copy={copy} />
      <WebStartPromo copy={copy} />
      <FeaturedProjects copy={copy} />
      <About copy={copy} lang={lang} />
      <BottomCta copy={copy} />
      <footer className="px-4 pb-20 sm:pb-32">
        <div className="mx-auto max-w-[1180px] lg:max-w-[1380px]">
          <div className="border-t border-slate-200 pt-8 sm:pt-10">
            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-blue-700">
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
              <a href="#top" className="transition hover:text-slate-900">
                {copy.footer.top}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
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

function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (hash && window.history.replaceState) {
        window.history.replaceState(null, "", pathname);
      }
      forceScrollTop();
      const t1 = setTimeout(forceScrollTop, 100);
      const t2 = setTimeout(forceScrollTop, 400);
      const t3 = setTimeout(forceScrollTop, 900);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
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
  const { pathname, search } = useLocation();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      trackPageView({
        path: `${pathname}${search}`,
        title: document.title,
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageViewTracker />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kontakt" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/usluge/web-stranica-bez-pocetnog-troska" element={<WebStartPage />} />
        <Route path="/mozgalica" element={<MozgalicaPage />} />
        <Route path="/njamko" element={<NjamkoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
