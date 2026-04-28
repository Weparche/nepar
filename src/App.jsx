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

const projects = [
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
];

const services = [
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
];

const stats = [
  ["20+", "Portali i platforme", Grid3X3],
  ["40+", "Web aplikacija", Monitor],
  ["15+", "AI alata i asistenata", BrainCircuit],
  ["30+", "Integracija i API-ja", Puzzle],
];

const navLinks = [
  ["Projekti", "#projekti"],
  ["Usluge", "#usluge"],
  ["O nama", "#onama"],
  ["Kontakt", "#kontakt", Mail],
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-3">
      <nav className="mx-auto flex max-w-[1180px] items-center justify-between rounded-[0.8rem] border border-blue-200/14 bg-slate-950/64 px-2 py-1.5 shadow-xl shadow-blue-950/25 backdrop-blur-xl sm:rounded-[1rem] sm:px-4 sm:py-2 lg:max-w-[1380px] lg:px-5">
        <a href="#top" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="grid h-10 w-[7.35rem] place-items-center overflow-hidden rounded-[0.75rem] border border-blue-300/20 bg-black shadow-md shadow-blue-500/15 sm:h-20 sm:w-[14.7rem] sm:rounded-[1.15rem] sm:shadow-lg">
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
          {navLinks.map(([label, href, Icon]) => (
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

        <MotionButton href="#kontakt" className="!hidden px-7 py-4 text-base 2xl:!inline-flex">
          <Send className="size-4 xl:size-5" />
          Javite se
        </MotionButton>

        <button
          className="grid size-10 shrink-0 place-items-center rounded-[0.8rem] border border-blue-200/15 bg-white/5 text-slate-200 sm:size-14 sm:rounded-[1.1rem] lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Otvori navigaciju"
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
              {navLinks.map(([label, href, Icon]) => (
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
                Javite se
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

function ProjectPreviewSmall({ type }) {
  if (type === "invite") {
    return (
      <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-[0.7rem] border border-fuchsia-300/20 bg-slate-950">
        <img
          src="/brand/pozivnica-home-cura.jpg"
          alt="Vidimose.hr digitalna pozivnica"
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
          alt="GeoAdrese.com.hr prikaz"
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
        alt="Bezstruje.hr prikaz"
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

function Hero() {
  const trustPoints = [
    ["Prakti\u010dni proizvodi", ShieldCheck],
    ["Brza izvedba", CheckCircle2],
    ["Fokus na rezultat", Sparkles],
  ];

  return (
    <section id="top" className="relative px-4 pt-28 sm:pt-52 lg:pt-[11rem]">
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
            <span className="hero-kicker-text">DIGITALNA RJE&#352;ENJA KOJA RADE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.75 }}
            className="text-4xl font-semibold leading-[1.06] tracking-normal text-white sm:text-5xl xl:text-[3.65rem]"
          >
            Gradimo korisne{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              digitalne proizvode
            </span>{" "}
            za stvarni svijet.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.75 }}
            className="mt-5 max-w-xl text-lg leading-8 text-slate-300"
          >
            Web aplikacije, AI alati, portali i specijalizirana rje&#353;enja od ideje do produkcije.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.75 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <MotionButton href="#projekti" className="inline-flex px-6 py-4">
              Pregled projekata
              <ArrowRight size={18} />
            </MotionButton>
            <MotionButton href="#kontakt" variant="secondary" className="inline-flex px-6 py-4">
              Kontakt
              <Mail size={18} />
            </MotionButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.75 }}
            className="mt-7 flex flex-wrap gap-3"
          >
            {trustPoints.map(([point, Icon]) => (
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
              Izdvojeni projekti
              <motion.span
                aria-hidden="true"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="h-px w-8 bg-gradient-to-r from-cyan-300 to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>

        <OrbitalProjectCarousel />
      </div>
    </section>
  );
}

function StatsBar() {
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
          {stats.map(([value, label, Icon]) => (
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

function Services() {
  return (
    <section id="usluge" className="px-4 py-5">
      <div className="mx-auto grid max-w-[1180px] gap-4 lg:max-w-[1380px] xl:grid-cols-[240px_1fr]">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
            &#352;TO RADIMO
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-normal text-white sm:text-4xl">
            Rje&#353;enja koja donose vrijednost.
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Od ideje do stabilnog proizvoda, brzo i fokusirano na korisnika.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map(({ title, description, Icon }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
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

function FeaturedProjects() {
  return (
    <section id="projekti" className="px-4 py-5">
      <div className="mx-auto max-w-[1180px] border-t border-blue-200/10 pt-5 lg:max-w-[1380px]">
        <div className="grid gap-4 xl:grid-cols-[220px_1fr] xl:items-start">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
              IZDVOJENI PROJEKTI
            </p>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-white"
            >
              Pogledaj sve projekte
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {projects.map((project, index) => {
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
                  <ProjectPreviewSmall type={project.preview} />
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

function About() {
  const [open, setOpen] = useState(false);

  return (
    <section id="onama" className="px-4 py-10">
      <div className="mx-auto grid max-w-[1180px] gap-6 rounded-[1rem] border border-blue-200/12 bg-white/[0.035] p-5 shadow-2xl shadow-blue-950/20 backdrop-blur-xl lg:max-w-[1380px] lg:grid-cols-[0.65fr_1.35fr]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative min-h-56 overflow-hidden rounded-[0.9rem] border border-blue-300/15 bg-slate-950/70 text-left"
          aria-label="Otvori Nepar Solutions sliku"
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
            O NAMA
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-normal text-white">
            Tehni&#269;ka izvedba, jasna komunikacija i fokus na proizvod koji radi.
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-400">
            Nepar Solutions spaja razvoj web aplikacija, AI rje&#353;enja, portala, integracija i rada s podacima u jedan prakti&#269;an proces.
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
              aria-label="Zatvori Nepar Solutions sliku"
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

function BottomCta() {
  return (
    <section id="kontakt" className="fixed inset-x-0 bottom-0 z-40 px-2 pb-2 sm:px-5 sm:pb-5">
      <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[0.85rem] border border-blue-300/20 bg-slate-950/84 px-3 py-2.5 shadow-xl shadow-blue-500/15 backdrop-blur-xl sm:rounded-[1rem] sm:border-blue-300/25 sm:px-6 sm:py-4 sm:shadow-2xl sm:shadow-blue-500/25 sm:backdrop-blur-2xl lg:max-w-[1380px]">
        <motion.div
          aria-hidden="true"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 left-0 hidden w-[200%] opacity-[0.20] sm:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,.16) 1px, transparent 1px), radial-gradient(circle, rgba(34,211,238,.14) 1px, transparent 1px), linear-gradient(90deg, transparent, rgba(59,130,246,.06), transparent)",
            backgroundPosition: "0 0, 28px 18px, 0 0",
            backgroundSize: "70px 46px, 112px 72px, 260px 100%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-cyan-400/10" />
        <motion.svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 hidden h-full w-[46%] opacity-[0.82] sm:block"
          viewBox="0 0 720 132"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ctaWaveCyan" x1="0%" x2="100%" y1="50%" y2="50%">
              <stop offset="0%" stopColor="rgba(59,130,246,0)" />
              <stop offset="24%" stopColor="rgba(37,99,235,0.40)" />
              <stop offset="52%" stopColor="rgba(34,211,238,0.70)" />
              <stop offset="78%" stopColor="rgba(124,58,237,0.50)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </linearGradient>
            <linearGradient id="ctaWaveViolet" x1="0%" x2="100%" y1="50%" y2="50%">
              <stop offset="0%" stopColor="rgba(168,85,247,0)" />
              <stop offset="30%" stopColor="rgba(168,85,247,0.42)" />
              <stop offset="54%" stopColor="rgba(255,255,255,0.42)" />
              <stop offset="74%" stopColor="rgba(34,211,238,0.42)" />
              <stop offset="100%" stopColor="rgba(168,85,247,0)" />
            </linearGradient>
            <filter id="ctaWaveGlow" x="-10%" y="-120%" width="120%" height="340%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          <motion.g
            animate={{ x: [-180, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            <path
              d="M -180 88 C -96 42 -12 122 72 88 S 240 42 324 88 S 492 122 576 88 S 744 42 828 88"
              fill="none"
              stroke="url(#ctaWaveCyan)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#ctaWaveGlow)"
            />
            <path
              d="M -180 58 C -84 98 -36 22 60 58 S 252 98 348 58 S 540 22 636 58 S 828 98 924 58"
              fill="none"
              stroke="url(#ctaWaveViolet)"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.78"
            />
            <path
              d="M -180 108 C -74 74 -26 128 80 108 S 292 74 398 108 S 610 128 716 108 S 928 74 1034 108"
              fill="none"
              stroke="rgba(96,165,250,0.34)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </motion.g>
        </motion.svg>
        <motion.svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[46%] opacity-[0.78] sm:block"
          viewBox="0 0 720 132"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ctaWaveRight" x1="0%" x2="100%" y1="50%" y2="50%">
              <stop offset="0%" stopColor="rgba(124,58,237,0)" />
              <stop offset="28%" stopColor="rgba(124,58,237,0.50)" />
              <stop offset="58%" stopColor="rgba(37,99,235,0.62)" />
              <stop offset="82%" stopColor="rgba(34,211,238,0.42)" />
              <stop offset="100%" stopColor="rgba(124,58,237,0)" />
            </linearGradient>
            <filter id="ctaWaveRightGlow" x="-10%" y="-120%" width="120%" height="340%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          <motion.g
            animate={{ x: [0, -180] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <path
              d="M -120 86 C -20 44 34 124 134 86 S 334 44 434 86 S 634 124 734 86 S 934 44 1034 86"
              fill="none"
              stroke="url(#ctaWaveRight)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#ctaWaveRightGlow)"
            />
            <path
              d="M -120 108 C -18 68 30 138 132 108 S 336 68 438 108 S 642 138 744 108 S 948 68 1050 108"
              fill="none"
              stroke="rgba(139,92,246,0.38)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </motion.g>
        </motion.svg>
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
                Imate ideju? Pretvorimo je u proizvod.
              </h2>
              <p className="mt-0.5 max-w-2xl text-xs leading-4 text-slate-300 sm:mt-1 sm:text-sm sm:leading-normal">
                Od prvog razgovora do lansiranja, tu sam da va&#353;a ideja postane stvarnost.
              </p>
            </div>
          </div>
          <MotionButton
            href="mailto:hello@nepar.solutions"
            className="inline-flex w-full px-4 py-2 text-xs sm:w-auto sm:px-5 sm:py-3 sm:text-sm"
          >
            Javite se i pokrenimo projekt
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
  return (
    <main className="relative min-h-screen overflow-x-hidden font-sans text-white">
      <Background />
      <Navbar />
      <Hero />
      <StatsBar />
      <Services />
      <FeaturedProjects />
      <About />
      <BottomCta />
      <footer className="px-4 pb-20 sm:pb-32">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-2 border-t border-blue-200/10 pt-4 text-xs text-slate-500 sm:flex-row sm:gap-4 sm:pt-6 sm:text-sm lg:max-w-[1380px]">
          <p>&copy; 2026 Nepar Solutions. Digitalna rje&#353;enja po mjeri.</p>
          <a href="#top" className="transition hover:text-slate-200">
            Povratak na vrh
          </a>
        </div>
      </footer>
    </main>
  );
}
