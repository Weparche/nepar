import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import {
  ArrowRight,
  Bot,
  ChartNoAxesColumnIncreasing,
  ChevronLeft,
  ChevronRight,
  DatabaseZap,
  Heart,
  MapPin,
  RotateCw,
  Trophy,
  Zap,
} from "lucide-react";

const carouselContent = {
  hr: {
    cards: [
      {
        title: "BezStruje.hr",
        description: "Obavijesti o prekidima i kvarovima u opskrbi.",
        Icon: Zap,
        accent: "from-amber-300 to-orange-500",
        iconTone: "text-amber-200",
        preview: "outage",
        href: "https://bezstruje.hr",
      },
      {
        title: "VidimoSe.hr",
        description: "Dje\u010dji ro\u0111endani, pozivnice i igraonice. Sve na jednom mjestu!",
        Icon: Heart,
        accent: "from-fuchsia-300 to-violet-500",
        iconTone: "text-fuchsia-200",
        preview: "invite",
        href: "https://vidimose.hr",
      },
      {
        title: "KPDinfo.com",
        description: "KPD 2026 AI tražilica za točne KPD šifre.",
        Icon: Bot,
        accent: "from-blue-400 to-indigo-500",
        iconTone: "text-blue-200",
        preview: "ai",
        href: "https://kpdinfo.com",
      },
      {
        title: "GeoAdrese.net",
        description: "Pretraga adresa, koordinate i prostorni podaci.",
        Icon: MapPin,
        accent: "from-teal-300 to-cyan-500",
        iconTone: "text-teal-200",
        preview: "geo",
        href: "https://geoadrese.net",
      },
      {
        title: "KadigraHrvatska.hr",
        description: "Fanhub navija\u010da Hrvatske \u2014 Postani izbornik.",
        Icon: Trophy,
        accent: "from-red-400 to-rose-600",
        iconTone: "text-red-200",
        preview: "kadigra",
        href: "https://kadigrahrvatska.hr",
      },
    ],
    preview: {
      outageAlt: "Bezstruje.hr prikaz",
      outageLogoAlt: "Bezstruje.hr logo",
      outageTitle: "Prekidi i planirani radovi",
      outageSubtitle: "Pregled obavijesti po lokaciji",
      inviteAlt: "Vidimose.hr digitalna pozivnica",
      aiQuestion: "Kako mogu pomo\u0107i?",
      aiPrompt: "Analiziraj klasifikaciju djelatnosti za firmu.",
      aiClassification: "Klasifikacija",
      aiRisk: "Procjena rizika",
      aiRiskValue: "Niski",
      geoAlt: "GeoAdrese.com.hr prikaz",
      geoTitle: "Pretraga adresa",
      geoSubtitle: "Koordinate i prostorni podaci",
      kadigraAlt: "KadigraHrvatska.hr prikaz",
      more: "Pogledaj sve",
      rotating: "Rotiraju\u0107i prikaz projekata",
      previous: "Prethodni projekt",
      next: "Sljede\u0107i projekt",
      show: "Prika\u017ei",
    },
  },
  en: {
    cards: [
      {
        title: "BezStruje.hr",
        description: "Power outage alerts and supply interruption notices.",
        Icon: Zap,
        accent: "from-amber-300 to-orange-500",
        iconTone: "text-amber-200",
        preview: "outage",
        href: "https://bezstruje.hr",
      },
      {
        title: "VidimoSe.hr",
        description: "Kids' birthdays, invitations, and playrooms. All in one place!",
        Icon: Heart,
        accent: "from-fuchsia-300 to-violet-500",
        iconTone: "text-fuchsia-200",
        preview: "invite",
        href: "https://vidimose.hr",
      },
      {
        title: "KPDinfo.com",
        description: "KPD 2026 AI search for accurate KPD codes.",
        Icon: Bot,
        accent: "from-blue-400 to-indigo-500",
        iconTone: "text-blue-200",
        preview: "ai",
        href: "https://kpdinfo.com",
      },
      {
        title: "GeoAdrese.net",
        description: "Address search, coordinates, and spatial data.",
        Icon: MapPin,
        accent: "from-teal-300 to-cyan-500",
        iconTone: "text-teal-200",
        preview: "geo",
        href: "https://geoadrese.net",
      },
      {
        title: "KadigraHrvatska.hr",
        description: "Croatia fan hub — Become the coach.",
        Icon: Trophy,
        accent: "from-red-400 to-rose-600",
        iconTone: "text-red-200",
        preview: "kadigra",
        href: "https://kadigrahrvatska.hr",
      },
    ],
    preview: {
      outageAlt: "Bezstruje.hr preview",
      outageLogoAlt: "Bezstruje.hr logo",
      outageTitle: "Outages and planned works",
      outageSubtitle: "Location-based notice overview",
      inviteAlt: "Vidimose.hr digital invitation",
      aiQuestion: "How can I help?",
      aiPrompt: "Analyze activity classification for a company.",
      aiClassification: "Classification",
      aiRisk: "Risk estimate",
      aiRiskValue: "Low",
      geoAlt: "GeoAdrese.com.hr preview",
      geoTitle: "Address search",
      geoSubtitle: "Coordinates and spatial data",
      kadigraAlt: "KadigraHrvatska.hr preview",
      more: "View all",
      rotating: "Rotating project view",
      previous: "Previous project",
      next: "Next project",
      show: "Show",
    },
  },
};

const CARD_COUNT = carouselContent.hr.cards.length;
const easeOut = [0.23, 1, 0.32, 1];

function computeCarouselSize(width) {
  if (width < 480) return { radiusX: 124, radiusY: 24, orbitCenterY: 252, sceneHeight: 318, isMobile: true };
  if (width < 768) return { radiusX: 178, radiusY: 28, orbitCenterY: 270, sceneHeight: 344, isMobile: true };
  if (width < 1180) return { radiusX: 318, radiusY: 42, orbitCenterY: 356, sceneHeight: 486, isMobile: false };
  return { radiusX: 408, radiusY: 48, orbitCenterY: 356, sceneHeight: 492, isMobile: false };
}

function useCarouselSize() {
  const [size, setSize] = useState(() =>
    computeCarouselSize(typeof window === "undefined" ? 1280 : window.innerWidth),
  );

  useEffect(() => {
    const update = () => setSize(computeCarouselSize(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

function getOrbitalPosition(baseAngle, index, radiusX, radiusY) {
  const theta = baseAngle + index * (360 / CARD_COUNT);
  const radians = (theta * Math.PI) / 180;
  const x = Math.cos(radians) * radiusX;
  const y = Math.sin(radians) * radiusY;
  const depth = (Math.sin(radians) + 1) / 2;

  return {
    x,
    y,
    depth,
    scale: 0.82 + depth * 0.18,
    opacity: 0.62 + depth * 0.38,
    rotateY: Math.cos(radians) * -7,
    zIndex: Math.round(depth * 100),
  };
}

function OutagePreview({ copy }) {
  return (
    <div className="relative h-[138px] overflow-hidden rounded-xl border border-cyan-400/40 bg-slate-100 sm:h-[238px] sm:rounded-2xl">
      <img
        src="/brand/bezstruje.webp"
        alt={copy.outageAlt}
        loading="lazy"
        className="absolute inset-0 size-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/5 to-transparent" />
      <img
        src="/brand/bezstruje_logo.png"
        alt={copy.outageLogoAlt}
        loading="lazy"
        className="absolute left-2 top-2 h-7 w-auto rounded-md bg-white/85 p-1 shadow-lg shadow-slate-300/60 sm:left-3 sm:top-3 sm:h-9"
      />
    </div>
  );
}

function InvitePreview({ compact = false, copy }) {
  return (
    <div className="relative grid h-[138px] place-items-center overflow-hidden rounded-xl border border-fuchsia-400/50 bg-gradient-to-br from-fuchsia-50 via-pink-50 to-slate-100 p-2 sm:h-[238px] sm:rounded-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,rgba(250,204,21,.22),transparent_8%),radial-gradient(circle_at_80%_24%,rgba(167,139,250,.18),transparent_7%),radial-gradient(circle_at_28%_78%,rgba(244,114,182,.22),transparent_10%)]" />
      <motion.img
        src="/brand/vidimose.webp"
        alt={copy.inviteAlt}
        loading="lazy"
        animate={compact ? false : { y: [0, -3, 0], scale: [1, 1.01, 1] }}
        transition={compact ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full max-h-full w-auto rounded-xl border border-fuchsia-300/40 object-contain shadow-lg shadow-fuchsia-300/30 sm:shadow-2xl sm:shadow-fuchsia-400/30"
      />
    </div>
  );
}

function AiPreview({ compact = false, copy }) {
  return (
    <div className="relative h-[138px] overflow-hidden rounded-xl border border-blue-400/40 bg-slate-100 sm:h-[238px] sm:rounded-2xl">
      <img
        src="/brand/kpdinfo.webp"
        alt={copy.aiAlt ?? "KPDinfo.com prikaz"}
        loading="lazy"
        className="absolute inset-0 size-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex h-10 items-end gap-1 px-2 pb-2 sm:h-20 sm:px-3 sm:pb-3">
        {[36, 58, 46, 64, 52, 72].map((h, i) => (
          <motion.span
            key={i}
            animate={compact ? false : { scaleY: [(h - 8) / h, 1, (h - 8) / h] }}
            transition={compact ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ height: `${h}%`, transformOrigin: "bottom" }}
            className="flex-1 rounded-t bg-gradient-to-t from-blue-600 to-cyan-300 opacity-80"
          />
        ))}
      </div>
    </div>
  );
}

function GeoPreview({ copy }) {
  return (
    <div className="h-[138px] rounded-xl border border-teal-400/40 bg-white/70 p-2 sm:h-[238px] sm:rounded-2xl sm:p-3">
      <div className="relative h-full overflow-hidden rounded-lg border border-blue-200/60 bg-blue-50 sm:rounded-xl">
        <img
          src="/brand/geoadrese.webp"
          alt={copy.geoAlt}
          loading="lazy"
          className="absolute inset-0 size-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent" />
        <MapPin className="absolute right-3 top-3 text-cyan-700 drop-shadow" size={20} />
      </div>
    </div>
  );
}

function KadigraPreview({ compact = false, copy }) {
  return (
    <div className="relative h-[138px] overflow-hidden rounded-xl border border-red-400/40 bg-slate-100 sm:h-[238px] sm:rounded-2xl">
      <motion.img
        src="/brand/kadigrahrvatska.webp"
        alt={copy.kadigraAlt}
        loading="lazy"
        animate={compact ? false : { scale: [1, 1.025, 1] }}
        transition={compact ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-slate-900/5 to-transparent" />
    </div>
  );
}

function MorePreview({ compact = false, copy }) {
  return (
    <div className="h-[138px] rounded-xl border border-violet-400/40 bg-white/70 p-2 sm:h-[238px] sm:rounded-2xl sm:p-3">
      <div className="grid grid-cols-3 gap-2">
        {[Zap, Heart, Bot, MapPin, DatabaseZap, ChartNoAxesColumnIncreasing].map((Icon, index) => (
          <motion.div
            key={index}
            animate={compact ? false : { y: [0, index % 2 ? 2 : -2, 0] }}
            transition={compact ? undefined : { duration: 4 + index * 0.18, repeat: Infinity, ease: "easeInOut" }}
            className="grid h-9 place-items-center rounded-lg border border-violet-200/70 bg-violet-50 sm:h-16"
          >
            <Icon className="text-violet-600" size={17} />
          </motion.div>
        ))}
      </div>
      <div className="mt-3 border-t border-slate-200 pt-3 sm:mt-4 sm:pt-4">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700">
          {copy.more} <ArrowRight size={13} />
        </span>
      </div>
    </div>
  );
}

function Preview({ type, compact = false, copy }) {
  if (type === "outage") return <OutagePreview copy={copy} />;
  if (type === "invite") return <InvitePreview compact={compact} copy={copy} />;
  if (type === "ai") return <AiPreview compact={compact} copy={copy} />;
  if (type === "geo") return <GeoPreview copy={copy} />;
  if (type === "kadigra") return <KadigraPreview compact={compact} copy={copy} />;
  return <MorePreview compact={compact} copy={copy} />;
}

function OrbitalCard({ card, opacity, filter, boxShadow, borderColor, isMobile, copy }) {
  const Icon = card.Icon;
  const CardShell = card.href ? motion.a : motion.article;
  const linkProps = card.href
    ? { href: card.href, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <CardShell
      {...linkProps}
      className={`orbital-card premium-card relative block w-[158px] overflow-hidden p-2 sm:w-[230px] sm:p-3 xl:w-[246px] ${
        card.href ? "cursor-pointer" : ""
      }`}
      style={{
        opacity,
        filter,
        boxShadow,
        borderColor,
      }}
      whileHover={isMobile ? undefined : { y: -5, scale: 1.012 }}
      whileTap={card.href ? { scale: 0.985 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
    >
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
      <div className="pointer-events-none absolute -right-10 -top-12 hidden size-28 rounded-full bg-blue-400/10 blur-2xl sm:block" />
      <div className="mb-2 flex items-start gap-2 sm:mb-3">
        <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${card.accent} text-white shadow-lg`}>
          <Icon size={17} />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-xs font-semibold text-slate-900 sm:text-lg">{card.title}</h3>
          <p className="mt-0.5 line-clamp-2 text-[10px] leading-3.5 text-slate-600 sm:mt-1 sm:text-xs sm:leading-5">{card.description}</p>
        </div>
      </div>
      <Preview type={card.preview} compact={isMobile} copy={copy} />
    </CardShell>
  );
}

function OrbitalItem({ card, index, angle, radiusX, radiusY, orbitCenterY, isMobile, isAnimating, copy }) {
  const x = useTransform(angle, (value) => getOrbitalPosition(value, index, radiusX, radiusY).x);
  const y = useTransform(angle, (value) => getOrbitalPosition(value, index, radiusX, radiusY).y);
  const scale = useTransform(angle, (value) => getOrbitalPosition(value, index, radiusX, radiusY).scale);
  const rotateY = useTransform(angle, (value) => getOrbitalPosition(value, index, radiusX, radiusY).rotateY);
  const zIndex = useTransform(
    angle,
    (value) => getOrbitalPosition(value, index, radiusX, radiusY).zIndex + 20,
  );
  const opacity = useTransform(angle, (value) => getOrbitalPosition(value, index, radiusX, radiusY).opacity);
  const filter = useTransform(angle, (value) => {
    const depth = getOrbitalPosition(value, index, radiusX, radiusY).depth;
    const brightness = 0.72 + depth * 0.36;
    const saturation = 0.9 + depth * 0.18;
    return `brightness(${brightness}) saturate(${saturation})`;
  });
  const boxShadow = useTransform(angle, (value) => {
    const depth = getOrbitalPosition(value, index, radiusX, radiusY).depth;
    const alpha = 0.1 + depth * 0.18;
    return `0 ${10 + depth * 14}px ${22 + depth * 24}px rgba(15,23,42,${alpha})`;
  });
  const borderColor = useTransform(angle, (value) => {
    const depth = getOrbitalPosition(value, index, radiusX, radiusY).depth;
    const alpha = 0.24 + depth * 0.56;
    return `rgba(147,197,253,${alpha})`;
  });

  return (
    <motion.div
      className="orbital-item absolute left-1/2"
      style={{
        top: orbitCenterY,
        x,
        y,
        scale,
        rotateY,
        zIndex,
        transformStyle: "preserve-3d",
        willChange: isAnimating ? "transform" : "auto",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="-translate-x-1/2 -translate-y-full">
        <OrbitalCard
          card={card}
          opacity={opacity}
          filter={isMobile ? "brightness(0.96) saturate(1)" : filter}
          boxShadow={isMobile ? "0 6px 18px rgba(15,23,42,0.28)" : boxShadow}
          borderColor={borderColor}
          isMobile={isMobile}
          copy={copy}
        />
      </div>
    </motion.div>
  );
}

function MobileOrbitalItem({ card, index, angle, radiusX, radiusY, orbitCenterY, isAnimating, copy }) {
  const x = useTransform(angle, (value) => getOrbitalPosition(value, index, radiusX, radiusY).x);
  const y = useTransform(angle, (value) => getOrbitalPosition(value, index, radiusX, radiusY).y);
  const scale = useTransform(angle, (value) => getOrbitalPosition(value, index, radiusX, radiusY).scale);
  const zIndex = useTransform(
    angle,
    (value) => getOrbitalPosition(value, index, radiusX, radiusY).zIndex + 20,
  );

  return (
    <motion.div
      className="orbital-item absolute left-1/2"
      style={{
        top: orbitCenterY,
        x,
        y,
        scale,
        zIndex,
        willChange: isAnimating ? "transform" : "auto",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="-translate-x-1/2 -translate-y-full">
        <OrbitalCard
          card={card}
          opacity={1}
          filter="none"
          boxShadow="0 4px 10px rgba(15,23,42,0.16)"
          borderColor="rgba(147,197,253,0.62)"
          isMobile
          copy={copy}
        />
      </div>
    </motion.div>
  );
}

function OrbitDot({ card, index, angle, radiusX, radiusY, onClick, label }) {
  const opacity = useTransform(angle, (value) => {
    const depth = getOrbitalPosition(value, index, radiusX, radiusY).depth;
    return 0.42 + depth * 0.58;
  });
  const width = useTransform(angle, (value) => {
    const depth = getOrbitalPosition(value, index, radiusX, radiusY).depth;
    return 10 + depth * 8;
  });

  return (
    <motion.button
      type="button"
      onClick={onClick}
      style={{ opacity, width }}
      whileTap={{ scale: 0.92 }}
      className="pressable h-2.5 rounded-full bg-blue-500 transition-colors duration-200 hover:bg-cyan-500"
      aria-label={`${label} ${card.title}`}
    />
  );
}

function StaticOrbitDot({ card, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pressable h-2.5 w-3.5 rounded-full bg-blue-500 transition-colors duration-200 active:scale-90"
      aria-label={`${label} ${card.title}`}
    />
  );
}

function OrbitButton({ direction, onClick, children, copy }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 500, damping: 34 }}
      className={`pressable absolute top-[46%] z-[140] grid size-10 -translate-y-1/2 place-items-center rounded-full border border-blue-200/80 bg-white/[0.88] text-blue-700 shadow-lg shadow-blue-200/30 backdrop-blur-xl transition-colors duration-200 hover:border-blue-400 hover:text-blue-900 sm:size-12 ${
        direction === "left" ? "-left-2 sm:left-0" : "-right-2 sm:right-0"
      }`}
      aria-label={direction === "left" ? copy.previous : copy.next}
    >
      {children}
    </motion.button>
  );
}

export default function OrbitalProjectCarousel({ lang = "hr" }) {
  const { cards, preview } = carouselContent[lang] || carouselContent.hr;
  const angle = useMotionValue(90);
  const { radiusX, radiusY, orbitCenterY, sceneHeight, isMobile } = useCarouselSize();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { margin: "0px 0px -20% 0px" });
  useAnimationFrame((time, delta) => {
    if (prefersReducedMotion) return;
    if (!inView) return;
    if (document.visibilityState !== "visible") return;
    const next = (angle.get() + delta * (isMobile ? 0.0066 : 0.0046)) % 360;
    angle.set(next);
  });

  const moveBy = (steps) => {
    const next = (angle.get() + steps * (360 / cards.length)) % 360;
    angle.set(next);
  };

  const jumpTo = (index) => {
    const next = 90 - index * (360 / cards.length);
    angle.set(next);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: 36 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.52, delay: 0.12, ease: easeOut }}
      className="relative mx-auto mt-1 w-full min-w-0 max-w-[1010px] sm:mt-6 lg:mt-0"
    >
      <div className="absolute inset-x-8 top-20 hidden h-72 rounded-full bg-blue-500/10 opacity-70 blur-3xl sm:block" />
      <div className="relative" style={{ height: sceneHeight, perspective: isMobile ? 900 : 1450 }}>
        <div
          className="absolute left-1/2 rounded-[50%] bg-gradient-to-r from-transparent via-blue-400/12 to-transparent blur-lg sm:blur-2xl"
          style={{
            top: orbitCenterY - radiusY - 18,
            width: radiusX * 2.05,
            height: radiusY * 2.3,
            transform: "translateX(-50%)",
          }}
        />

        <OrbitButton direction="left" onClick={() => moveBy(-1)} copy={preview}>
          <ChevronLeft size={23} />
        </OrbitButton>
        <OrbitButton direction="right" onClick={() => moveBy(1)} copy={preview}>
          <ChevronRight size={23} />
        </OrbitButton>

        <div
          className="absolute left-1/2 z-[3] rounded-[50%]"
          style={{
            top: orbitCenterY - radiusY,
            width: radiusX * 2,
            height: radiusY * 2,
            transform: "translateX(-50%)",
          }}
        >
          <div className="absolute -inset-4 rounded-[50%] bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(6,182,212,0.11)_57%,rgba(37,99,235,0.13)_63%,rgba(217,70,239,0.08)_70%,transparent_78%)] blur-md sm:-inset-10 sm:bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(6,182,212,0.14)_57%,rgba(37,99,235,0.16)_63%,rgba(217,70,239,0.10)_70%,transparent_78%)] sm:blur-2xl" />
          <svg
            className="absolute overflow-visible"
            style={{
              inset: -24,
              width: "calc(100% + 48px)",
              height: "calc(100% + 48px)",
            }}
            viewBox="0 0 1000 180"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="orbitBase"
                x1="0%"
                x2="100%"
                y1="48%"
                y2="52%"
              >
                <stop offset="0%" stopColor="rgba(37,99,235,0.05)" />
              <stop offset="14%" stopColor="rgba(56,189,248,0.48)" />
              <stop offset="34%" stopColor="rgba(34,211,238,0.62)" />
              <stop offset="55%" stopColor="rgba(99,102,241,0.58)" />
              <stop offset="74%" stopColor="rgba(217,70,239,0.42)" />
              <stop offset="90%" stopColor="rgba(250,204,21,0.28)" />
                <stop offset="100%" stopColor="rgba(37,99,235,0.08)" />
              </linearGradient>
              <linearGradient
                id="orbitSheen"
                x1="100%"
                x2="0%"
                y1="10%"
                y2="90%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="26%" stopColor="rgba(34,211,238,0.34)" />
                <stop offset="50%" stopColor="rgba(37,99,235,0.7)" />
                <stop offset="72%" stopColor="rgba(217,70,239,0.44)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <filter id="orbitBlur" x="-20%" y="-120%" width="140%" height="340%">
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>

            <ellipse
              cx="500"
              cy="90"
              rx="470"
              ry="50"
              fill="none"
              stroke="rgba(59,130,246,0.22)"
              strokeWidth={isMobile ? 12 : 26}
              filter={isMobile ? undefined : "url(#orbitBlur)"}
            />
            <ellipse
              cx="500"
              cy="90"
              rx="470"
              ry="50"
              fill="none"
              stroke="url(#orbitBase)"
              strokeWidth={isMobile ? 6 : 12}
              strokeLinecap="round"
            />
            {!isMobile && (
              <motion.ellipse
                cx="500"
                cy="90"
                rx="470"
                ry="50"
                fill="none"
                stroke="url(#orbitSheen)"
                strokeWidth="7"
                strokeLinecap="round"
                animate={{ opacity: [0.26, 0.72, 0.26] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <ellipse
              cx="500"
              cy="90"
              rx="470"
              ry="50"
              fill="none"
              stroke="rgba(30,58,138,0.28)"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.75"
            />
          </svg>
        </div>

        {cards.map((card, index) => {
          const Item = isMobile ? MobileOrbitalItem : OrbitalItem;
          return (
            <Item
              key={card.title}
              card={card}
              index={index}
              angle={angle}
              radiusX={radiusX}
              radiusY={radiusY}
              orbitCenterY={orbitCenterY}
              isMobile={isMobile}
              isAnimating={inView && !prefersReducedMotion}
              copy={preview}
            />
          );
        })}

        {!isMobile && (
          <svg
            className="pointer-events-none absolute left-1/2 z-[132] overflow-visible"
            style={{
              top: orbitCenterY - radiusY - 24,
              width: radiusX * 2 + 48,
              height: radiusY * 2 + 48,
              transform: "translateX(-50%)",
            }}
            viewBox="0 0 1000 180"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
          <defs>
            <motion.linearGradient
              id="orbitFront"
              x1="0%"
              x2="100%"
              y1="40%"
              y2="60%"
              animate={{
                x1: ["0%", "100%", "100%", "0%", "0%"],
                y1: ["40%", "20%", "84%", "60%", "40%"],
                x2: ["100%", "0%", "0%", "100%", "100%"],
                y2: ["60%", "80%", "16%", "40%", "60%"],
              }}
              transition={{ duration: 7.2, repeat: Infinity, ease: "linear" }}
            >
              <stop offset="0%" stopColor="rgba(37,99,235,0)" />
              <stop offset="12%" stopColor="rgba(59,130,246,0.34)" />
              <stop offset="30%" stopColor="rgba(34,211,238,0.62)" />
              <stop offset="52%" stopColor="rgba(37,99,235,0.54)" />
              <stop offset="68%" stopColor="rgba(217,70,239,0.52)" />
              <stop offset="84%" stopColor="rgba(250,204,21,0.34)" />
              <stop offset="100%" stopColor="rgba(37,99,235,0)" />
            </motion.linearGradient>
            <filter id="orbitFrontGlow" x="-20%" y="-140%" width="140%" height="360%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
          <path
            d="M 42 90 C 218 148 782 148 958 90"
            fill="none"
            stroke="rgba(59,130,246,0.25)"
            strokeWidth="26"
            strokeLinecap="round"
            filter="url(#orbitFrontGlow)"
          />
          <path
            d="M 42 90 C 218 148 782 148 958 90"
            fill="none"
            stroke="url(#orbitFront)"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d="M 42 90 C 218 148 782 148 958 90"
            fill="none"
            stroke="rgba(30,58,138,0.34)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          </svg>
        )}

        <div className="pointer-events-none absolute left-1/2 z-[126] h-3 w-3 -translate-x-1/2 rounded-full border border-blue-400/45 bg-white/85 shadow-[0_0_12px_rgba(59,130,246,0.18)] sm:h-5 sm:w-5 sm:border-blue-400/55 sm:shadow-[0_0_24px_rgba(59,130,246,0.22)]"
          style={{
            top: orbitCenterY + radiusY - 10,
            transform: "translateX(-50%)",
          }}
        />
        <div className="absolute bottom-2 left-1/2 z-[120] flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 sm:bottom-4 sm:gap-4">
          <div className="flex items-center gap-2">
            {cards.map((card, index) => (
              isMobile ? (
                <StaticOrbitDot
                  key={card.title}
                  card={card}
                  onClick={() => jumpTo(index)}
                  label={preview.show}
                />
              ) : (
                <OrbitDot
                  key={card.title}
                  card={card}
                  index={index}
                  angle={angle}
                  radiusX={radiusX}
                  radiusY={radiusY}
                  onClick={() => jumpTo(index)}
                  label={preview.show}
                />
              )
            ))}
          </div>
          {!isMobile && (
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs text-slate-700 shadow-sm backdrop-blur-xl">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                className="text-violet-600"
              >
                <RotateCw size={15} />
              </motion.span>
              {preview.rotating}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
