import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  DatabaseZap,
  ExternalLink,
  Grid3X3,
  Heart,
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
  X,
  Zap,
} from "lucide-react";
import OrbitalProjectCarousel from "./OrbitalProjectCarousel.jsx";

const content = {
  hr: {
    navLinks: [
      ["Projekti", "#projekti"],
      ["Usluge", "#usluge"],
      ["O nama", "#onama"],
      ["Kontakt", "#kontakt", Mail],
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
      },
      {
        title: "VidimoSe.hr",
        description: "Digitalne pozivnice i event rje\u0161enja.",
        Icon: Heart,
        accent: "from-fuchsia-300 to-violet-500",
        preview: "invite",
        href: "https://vidimose.hr",
      },
      {
        title: "KPDinfo.com",
        description: "AI poslovni asistent i analiti\u010dki uvidi.",
        Icon: Bot,
        accent: "from-blue-400 to-indigo-500",
        preview: "ai",
      },
      {
        title: "GeoAdrese.net",
        description: "Pretraga adresa i geo podaci.",
        Icon: MapPin,
        accent: "from-teal-300 to-cyan-500",
        preview: "geo",
      },
    ],
    services: [
      {
        title: "Web aplikacije",
        description: "Moderne web aplikacije po mjeri va\u0161eg poslovanja. Brze, sigurne i skalabilne.",
        Icon: Cpu,
      },
      {
        title: "Portali i alati",
        description: "Specijalizirani portali i alati koji rje\u0161avaju konkretne potrebe va\u0161ih korisnika.",
        Icon: Grid3X3,
      },
      {
        title: "AI i automatizacija",
        description: "AI asistenti, obrada dokumenata i automatizacija procesa koji \u0161tede vrijeme.",
        Icon: Bot,
      },
      {
        title: "Mape i podaci",
        description: "Geo rje\u0161enja, pretraga adresa, karte, koordinate i rad s prostornim podacima.",
        Icon: Map,
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
    },
    previewAlts: {
      invite: "Vidimose.hr digitalna pozivnica",
      geo: "GeoAdrese.com.hr prikaz",
      outage: "Bezstruje.hr prikaz",
    },
  },
  en: {
    navLinks: [
      ["Projects", "#projekti"],
      ["Services", "#usluge"],
      ["About us", "#onama"],
      ["Contact", "#kontakt", Mail],
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
      },
      {
        title: "VidimoSe.hr",
        description: "Digital invitations and event solutions.",
        Icon: Heart,
        accent: "from-fuchsia-300 to-violet-500",
        preview: "invite",
        href: "https://vidimose.hr",
      },
      {
        title: "KPDinfo.com",
        description: "AI business assistant and analytical insights.",
        Icon: Bot,
        accent: "from-blue-400 to-indigo-500",
        preview: "ai",
      },
      {
        title: "GeoAdrese.net",
        description: "Address search and geospatial data.",
        Icon: MapPin,
        accent: "from-teal-300 to-cyan-500",
        preview: "geo",
      },
    ],
    services: [
      {
        title: "Web applications",
        description: "Modern web apps tailored to your business. Fast, secure, and scalable.",
        Icon: Cpu,
      },
      {
        title: "Portals and tools",
        description: "Specialized portals and tools that solve concrete user needs.",
        Icon: Grid3X3,
      },
      {
        title: "AI and automation",
        description: "AI assistants, document processing, and process automation that saves time.",
        Icon: Bot,
      },
      {
        title: "Maps and data",
        description: "Geo solutions, address search, maps, coordinates, and spatial data workflows.",
        Icon: Map,
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
    },
    previewAlts: {
      invite: "Vidimose.hr digital invitation",
      geo: "GeoAdrese.com.hr preview",
      outage: "Bezstruje.hr preview",
    },
  },
};

function LanguageToggle({ lang, setLang }) {
  return (
    <div className="inline-flex shrink-0 rounded-full border border-blue-200/15 bg-white/5 p-0.5 text-[11px] font-semibold text-slate-300">
      {["hr", "en"].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setLang(value)}
          className={`rounded-full px-2.5 py-1 transition ${
            lang === value ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" : "hover:text-white"
          }`}
          aria-pressed={lang === value}
        >
          {value === "hr" ? "HR" : "ENG"}
        </button>
      ))}
    </div>
  );
}

function Navbar({ lang, setLang, copy }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-2">
      <nav className="mx-auto flex max-w-[1180px] items-center justify-between rounded-[0.8rem] border border-blue-200/14 bg-slate-950/64 px-2 py-1.5 shadow-xl shadow-blue-950/25 backdrop-blur-xl sm:rounded-[0.9rem] sm:px-3 sm:py-1 lg:max-w-[1380px] lg:px-4">
        <a href="#top" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="grid h-10 w-[7.35rem] place-items-center overflow-hidden rounded-[0.75rem] border border-blue-300/20 bg-black shadow-md shadow-blue-500/15 sm:h-[3.85rem] sm:w-[11.25rem] sm:rounded-[0.95rem] sm:shadow-lg">
            <img
              src="/brand/nepar_logo.png"
              alt="Nepar Solutions logo"
              className="size-full object-contain px-2 py-1 sm:px-3 sm:py-2"
            />
          </span>
          {/* <span className="min-w-0">
            <span className="block truncate text-base font-semibold tracking-normal text-white sm:text-2xl">
              Nepar Solutions
            </span>
            <span className="block truncate text-xs text-slate-400 sm:text-base">
              obrt za digitalna rje&#353;enja
            </span>
          </span> */}
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {copy.navLinks.map(([label, href, Icon]) => (
            <a
              key={href}
              href={href}
              className="inline-flex items-center gap-2 text-base font-medium text-slate-200 transition hover:text-white"
            >
              {Icon && <Icon size={20} className="text-blue-200" />}
              {label}
            </a>
          ))}
        </div>

        <div className="ml-auto mr-2 lg:ml-0">
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>

        <MotionButton href="#kontakt" className="!hidden px-7 py-4 text-base 2xl:!inline-flex">
          <Send className="size-4 xl:size-5" />
          {copy.navCta}
        </MotionButton>

        <button
          className="grid size-10 shrink-0 place-items-center rounded-[0.8rem] border border-blue-200/15 bg-white/5 text-slate-200 sm:size-14 sm:rounded-[1.1rem] lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={copy.menuLabel}
        >
          {open ? <X className="size-5 sm:size-[26px]" /> : <Menu className="size-5 sm:size-[26px]" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 max-w-[1180px] rounded-[0.9rem] border border-blue-200/14 bg-slate-950/90 p-3 shadow-xl shadow-blue-950/25 backdrop-blur-xl sm:mt-3 sm:rounded-[1.25rem] sm:p-5 sm:shadow-2xl sm:backdrop-blur-2xl lg:max-w-[1380px] lg:hidden"
          >
            <div className="grid gap-1 sm:gap-2">
              {copy.navLinks.map(([label, href, Icon]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-3 rounded-[0.8rem] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 sm:rounded-[1rem] sm:px-5 sm:py-4 sm:text-base"
                >
                  {Icon && <Icon size={20} className="text-blue-200" />}
                  {label}
                </a>
              ))}
              <MotionButton href="#kontakt" className="mt-1 justify-self-start rounded-[0.75rem] px-5 py-3 text-sm sm:mt-2 sm:justify-self-stretch sm:rounded-[0.8rem] sm:px-6 sm:py-4 sm:text-base">
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

function MotionButton({ href, children, className = "", variant = "primary" }) {
  const primary = variant === "primary";

  return (
    <motion.a
      href={href}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-[0.8rem] font-semibold transition ${
        primary
          ? "bg-gradient-to-r from-blue-500 via-blue-500 to-violet-600 text-white shadow-xl shadow-blue-500/25"
          : "border border-blue-200/20 bg-white/[0.03] text-slate-200 backdrop-blur hover:bg-white/[0.07]"
      } ${className}`}
    >
      {children}
    </motion.a>
  );
}

function ProjectPreviewSmall({ type, copy }) {
  if (type === "invite") {
    return (
      <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-[0.7rem] border border-fuchsia-300/20 bg-slate-950">
        <img
          src="/brand/pozivnica-home-cura.jpg"
          alt={copy.previewAlts.invite}
          loading="lazy"
          className="h-full w-full object-cover object-top"
        />
      </div>
    );
  }

  if (type === "ai") {
    return (
      <div className="size-20 shrink-0 rounded-[0.7rem] border border-blue-300/20 bg-slate-950/85 p-2">
        <div className="mb-2 h-2 w-12 rounded bg-blue-400/40" />
        <div className="space-y-1">
          <span className="block h-2 rounded bg-white/10" />
          <span className="block h-2 w-4/5 rounded bg-white/10" />
          <span className="block h-2 w-3/5 rounded bg-blue-400/40" />
        </div>
        <div className="mt-3 flex h-5 items-end gap-1">
          {[35, 62, 50, 74].map((height) => (
            <span
              key={height}
              className="flex-1 rounded-t bg-gradient-to-t from-blue-600 to-cyan-300"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === "geo") {
    return (
      <div className="relative size-20 shrink-0 overflow-hidden rounded-[0.7rem] border border-blue-300/20 bg-slate-900">
        <img
          src="/brand/geoadrese.png"
          alt={copy.previewAlts.geo}
          loading="lazy"
          className="absolute inset-0 size-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-transparent to-transparent" />
        <MapPin className="absolute bottom-2 right-2 text-cyan-200 drop-shadow" size={18} />
      </div>
    );
  }

  return (
    <div className="relative size-20 shrink-0 overflow-hidden rounded-[0.7rem] border border-blue-300/20 bg-slate-950/85">
      <img
        src="/brand/bezstruje.png"
        alt={copy.previewAlts.outage}
        loading="lazy"
        className="absolute inset-0 size-full object-cover object-top opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
      <img
        src="/brand/bezstruje_logo.png"
        alt=""
        loading="lazy"
        className="absolute bottom-1.5 left-1.5 h-5 w-auto rounded bg-slate-950/70 p-0.5"
      />
    </div>
  );
}

function Hero({ copy, lang }) {
  return (
    <section id="top" className="relative px-4 pt-24 sm:pt-36 lg:pt-[7.75rem]">
      <div className="mx-auto grid max-w-[1180px] items-center gap-0 sm:gap-8 lg:max-w-[1380px] lg:grid-cols-[minmax(320px,0.62fr)_minmax(0,1.38fr)]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="relative z-10 max-w-[620px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.65 }}
            className="hero-kicker mb-5 inline-flex items-center gap-2 rounded-full bg-slate-950/82 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] shadow-lg shadow-violet-500/10"
          >
            <Zap size={15} />
            <span className="hero-kicker-text">{copy.hero.kicker}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.75 }}
            className="text-4xl font-semibold leading-[1.06] tracking-normal text-white sm:text-5xl xl:text-[3.65rem]"
          >
            {copy.hero.lead}{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              {copy.hero.highlight}
            </span>{" "}
            {copy.hero.rest}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.75 }}
            className="mt-5 max-w-xl text-lg leading-8 text-slate-300"
          >
            {copy.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.75 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <MotionButton href="#projekti" className="inline-flex px-6 py-4">
              {copy.hero.primary}
              <ArrowRight size={18} />
            </MotionButton>
            <MotionButton href="#kontakt" variant="secondary" className="inline-flex px-6 py-4">
              {copy.hero.secondary}
              <Mail size={18} />
            </MotionButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.75 }}
            className="mt-7 flex flex-wrap gap-3"
          >
            {copy.hero.trust.map(([point, Icon]) => (
              <span
                key={point}
                className="inline-flex items-center gap-2 text-sm text-slate-300"
              >
                <Icon size={16} className="text-blue-300" />
                {point}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.48, duration: 0.65, ease: "easeOut" }}
            className="mt-3 -mb-3 lg:hidden"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/25 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 backdrop-blur">
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
    <section className="px-4 py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="mx-auto max-w-[1180px] rounded-[1rem] border border-blue-200/12 bg-slate-950/54 px-5 py-4 shadow-2xl shadow-blue-950/20 backdrop-blur-xl lg:max-w-[1380px]"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-blue-200/10">
          {copy.stats.map(([value, label, Icon]) => (
            <div key={label} className="flex items-center justify-center gap-4 lg:px-6">
              <Icon size={32} className="text-blue-300" />
              <div>
                <p className="text-3xl font-semibold leading-none text-white">{value}</p>
                <p className="mt-1 text-sm text-slate-300">{label}</p>
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
    <section id="usluge" className="overflow-x-hidden px-4 py-5">
      <div className="mx-auto grid max-w-[1180px] gap-4 lg:max-w-[1380px] xl:grid-cols-[240px_1fr]">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
            {copy.servicesSection.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-normal text-white sm:text-4xl">
            {copy.servicesSection.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            {copy.servicesSection.description}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {copy.services.map(({ title, description, Icon }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, x: 220 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -180px 0px", amount: 0.2 }}
              transition={{ duration: 0.8, delay: index * 1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group relative overflow-hidden rounded-[1rem] border border-blue-200/12 bg-slate-950/52 p-5 shadow-xl shadow-black/20 backdrop-blur-xl"
            >
              <div className="absolute -right-10 -top-10 size-28 rounded-full bg-blue-400/10 blur-2xl transition group-hover:bg-violet-400/14" />
              <div className="relative mb-4 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-[0.85rem] bg-blue-500/14 text-blue-200 ring-1 ring-blue-200/12">
                  <Icon size={23} />
                </div>
                <h3 className="text-base font-semibold text-white">{title}</h3>
              </div>
              <p className="relative text-sm leading-6 text-slate-400">{description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjects({ copy }) {
  return (
    <section id="projekti" className="px-4 py-5">
      <div className="mx-auto max-w-[1180px] border-t border-blue-200/10 pt-5 lg:max-w-[1380px]">
        <div className="grid gap-4 xl:grid-cols-[220px_1fr] xl:items-start">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
              {copy.featured.eyebrow}
            </p>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-white"
            >
              {copy.featured.link}
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="flex min-h-[96px] items-center gap-3 rounded-[0.9rem] border border-blue-200/12 bg-slate-950/52 p-3 shadow-lg shadow-black/15 backdrop-blur-xl"
                >
                  <ProjectPreviewSmall type={project.preview} copy={copy} />
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`grid size-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${project.accent} text-white`}>
                        <Icon size={15} />
                      </span>
                      <h3 className="truncate text-sm font-semibold text-white">{project.title}</h3>
                    </div>
                    <p className="text-sm leading-5 text-slate-400">{project.description}</p>
                  </div>
                </ProjectShell>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function About({ copy }) {
  const [open, setOpen] = useState(false);

  return (
    <section id="onama" className="px-4 py-10">
      <div className="mx-auto grid max-w-[1180px] gap-6 rounded-[1rem] border border-blue-200/12 bg-white/[0.035] p-5 shadow-2xl shadow-blue-950/20 backdrop-blur-xl lg:max-w-[1380px] lg:grid-cols-[0.65fr_1.35fr]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative min-h-56 overflow-hidden rounded-[0.9rem] border border-blue-300/15 bg-slate-950/70 text-left"
          aria-label={copy.about.imageLabel}
        >
          <img
            src="/brand/nepar.png"
            alt="Nepar Solutions brand"
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-95 transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/18 via-transparent to-violet-500/18" />
        </button>
        <div className="flex flex-col justify-center p-2 lg:p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
            {copy.about.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-normal text-white">
            {copy.about.title}
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-400">
            {copy.about.description}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/82 px-4 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.button
              type="button"
              className="relative w-full max-w-4xl overflow-hidden rounded-[1rem] border border-blue-200/20 bg-slate-950 shadow-2xl shadow-blue-500/25"
              initial={{ opacity: 0, scale: 0.82, y: 28, rotateX: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 18 }}
              transition={{ type: "spring", stiffness: 210, damping: 22 }}
              onClick={() => setOpen(false)}
              aria-label={copy.about.closeLabel}
            >
              <img
                src="/brand/nepar.png"
                alt="Nepar Solutions brand"
                className="block max-h-[82vh] w-full object-contain"
              />
              <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-white/15 bg-slate-950/75 text-white backdrop-blur">
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
  return (
    <section id="kontakt" className="fixed inset-x-0 bottom-0 z-40 px-2 pb-2 sm:px-5 sm:pb-5">
      <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[0.85rem] border border-blue-300/20 bg-slate-950/84 px-3 py-2.5 shadow-xl shadow-blue-500/15 backdrop-blur-xl sm:rounded-[1rem] sm:border-blue-300/25 sm:px-6 sm:py-4 sm:shadow-2xl sm:shadow-blue-500/25 sm:backdrop-blur-2xl lg:max-w-[1380px]">
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
                  stroke="rgba(96,165,250,0.26)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id={`footerWaveCyan${copy}`} x1="0%" x2="100%" y1="50%" y2="50%">
                    <stop offset="0%" stopColor="rgba(59,130,246,0)" />
                    <stop offset="18%" stopColor="rgba(59,130,246,0.42)" />
                    <stop offset="42%" stopColor="rgba(34,211,238,0.82)" />
                    <stop offset="62%" stopColor="rgba(255,255,255,0.48)" />
                    <stop offset="82%" stopColor="rgba(124,58,237,0.42)" />
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/30 to-transparent" />
        <div className="relative flex flex-col items-center justify-between gap-2 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="relative shrink-0">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 rounded-full border border-blue-300/35 shadow-[0_0_14px_rgba(59,130,246,0.26)] sm:-inset-2 sm:border-blue-300/45 sm:shadow-[0_0_28px_rgba(59,130,246,0.42)]"
              />
              <motion.div
                animate={{ y: [0, -4, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-violet-500/20 sm:size-14 sm:shadow-xl sm:shadow-violet-500/30"
              >
                <Rocket className="size-4 sm:size-6" />
              </motion.div>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-normal text-white sm:text-2xl">
                {copy.cta.title}
              </h2>
              <p className="mt-0.5 max-w-2xl text-xs leading-4 text-slate-300 sm:mt-1 sm:text-sm sm:leading-normal">
                {copy.cta.description}
              </p>
            </div>
          </div>
          <MotionButton
            href="mailto:nepar@nepar.hr"
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

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(37,99,235,0.28),transparent_30%),radial-gradient(circle_at_78%_12%,rgba(124,58,237,0.24),transparent_28%),radial-gradient(circle_at_55%_72%,rgba(6,182,212,0.16),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(148,163,184,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.18)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-blue-500/12 to-transparent" />
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("hr");
  const copy = content[lang];

  return (
    <main className="relative min-h-screen overflow-x-hidden font-sans text-white">
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={copy} />
      <Hero copy={copy} lang={lang} />
      <StatsBar copy={copy} />
      <Services copy={copy} />
      <FeaturedProjects copy={copy} />
      <About copy={copy} />
      <BottomCta copy={copy} />
      <footer className="px-4 pb-20 sm:pb-32">
        <div className="mx-auto max-w-[1180px] lg:max-w-[1380px]">
          <div className="border-t border-blue-200/10 pt-8 sm:pt-10">
            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-blue-400/60">
                  {copy.footer.infoLabel}
                </p>
                <p className="text-sm font-medium text-slate-300">{copy.footer.companyName}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-0.5 text-xs text-slate-500">
                  <span>{copy.footer.owner}</span>
                  <span>{copy.footer.mbo}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-2 border-t border-blue-200/10 pt-4 text-xs text-slate-500 sm:flex-row sm:gap-4 sm:pt-5 sm:text-sm">
              <p>{copy.footer.copyright}</p>
              <a href="#top" className="transition hover:text-slate-200">
                {copy.footer.top}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
