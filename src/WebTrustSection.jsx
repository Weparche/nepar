import { motion } from "framer-motion";
import { BarChart3, Link2 } from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1];

const trustCopy = {
  hr: {
    eyebrow: "POVJERENJE",
    title: "Zašto web još uvijek ima smisla?",
    text: "Instagram, Facebook i Google Maps odlični su za vidljivost. Ali kada potencijalni klijent želi brzo provjeriti ponudu, lokaciju, slike, kontakt i poslati upit, vlastita web stranica daje ozbiljniji i profesionalniji dojam.",
    stat: "potrošača smatra da je poslovanje s web stranicom vjerodostojnije od poslovanja koje ima samo profil na društvenim mrežama.",
    statSource: "Izvor: Verisign Online Survey",
    slogan: "Instagram donosi pažnju. Google Maps donosi lokaciju. Web donosi povjerenje i upit.",
    highlight:
      "Jedan profesionalni link koji pretvara Instagram, Facebook i Google Maps posjete u konkretne upite.",
  },
  en: {
    eyebrow: "TRUST",
    title: "Why a website still makes sense",
    text: "Instagram, Facebook, and Google Maps are great for visibility. But when a potential client wants to quickly check your offer, location, photos, contact details, and send an inquiry, your own website creates a more serious and professional impression.",
    stat: "of consumers believe a business with a website is more credible than one with social media profiles only.",
    statSource: "Source: Verisign Online Survey",
    slogan: "Instagram brings attention. Google Maps brings location. Your website brings trust and inquiries.",
    highlight:
      "One professional link that turns Instagram, Facebook, and Google Maps visits into real inquiries.",
  },
};

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: easeOut },
};

export default function WebTrustSection({ lang = "hr", className = "", showHighlight = true }) {
  const copy = trustCopy[lang];

  return (
    <section className={`px-4 py-2 sm:py-4 ${className}`}>
      <motion.div
        {...reveal}
        className="relative mx-auto max-w-[1180px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-xl shadow-slate-300/30 backdrop-blur-md sm:p-7 lg:max-w-[1380px]"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-blue-500/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 size-36 rounded-full bg-violet-500/8 blur-3xl" />

        <div className="relative">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{copy.eyebrow}</p>
          <h2 className="max-w-3xl text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">{copy.title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{copy.text}</p>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: easeOut, delay: 0.08 }}
            className="relative mt-6 overflow-hidden rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50/90 via-white/80 to-violet-50/70 p-5 shadow-lg shadow-blue-100/40 sm:p-7"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-blue-400/10 blur-2xl" />
            <div className="relative flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:gap-5 sm:text-left">
              <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25">
                <BarChart3 size={26} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-4xl font-semibold tabular-nums tracking-tight text-slate-900 sm:text-5xl">
                  <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">84%</span>
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-800 sm:text-base">{copy.stat}</p>
                <p className="mt-2 text-xs text-slate-500">{copy.statSource}</p>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.45, ease: easeOut, delay: 0.14 }}
            className="mt-5 rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5 text-sm font-medium leading-6 text-slate-800 sm:text-base"
          >
            {copy.slogan}
          </motion.p>

          {showHighlight && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, ease: easeOut, delay: 0.2 }}
              className="mt-3 flex items-start gap-3 rounded-xl border border-blue-200/70 bg-blue-50/60 px-4 py-3.5"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-500/15 text-blue-600 ring-1 ring-blue-400/20">
                <Link2 size={18} />
              </span>
              <p className="text-sm font-medium leading-6 text-slate-800 sm:text-base">{copy.highlight}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
