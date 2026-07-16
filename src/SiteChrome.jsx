import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Mail, Menu, Send, X } from "lucide-react";

export const siteContent = {
  hr: {
    navLinks: [
      ["Usluge", "#usluge"],
      ["Projekti", "#projekti"],
      ["Proces", "#proces"],
      ["Cjenik", "/usluge/izrada-web-stranica#paketi"],
      ["Kontakt", "/kontakt"],
    ],
    navCta: "Pošaljite upit",
    menuLabel: "Otvori navigaciju",
    closeMenuLabel: "Zatvori navigaciju",
    footer: {
      copyright: "© 2026 Nepar Solutions. Digitalna rješenja po mjeri.",
      top: "Povratak na vrh",
      infoLabel: "Poslovni podaci",
      companyName: "Nepar, obrt za digitalna rješenja i usluge",
      owner: "vl. Ivan Gorupić",
      mbo: "MBO: 99267101",
      email: "nepar@nepar.hr",
    },
  },
  en: {
    navLinks: [
      ["Services", "#usluge"],
      ["Projects", "#projekti"],
      ["Process", "#proces"],
      ["Pricing", "/usluge/izrada-web-stranica#paketi"],
      ["Contact", "/kontakt"],
    ],
    navCta: "Send an inquiry",
    menuLabel: "Open navigation",
    closeMenuLabel: "Close navigation",
    footer: {
      copyright: "© 2026 Nepar Solutions. Tailored digital solutions.",
      top: "Back to top",
      infoLabel: "Business information",
      companyName: "Nepar, sole proprietorship for digital solutions and services",
      owner: "Prop. Ivan Gorupić",
      mbo: "MBO: 99267101",
      email: "nepar@nepar.hr",
    },
  },
};

export function LanguageToggle({ lang, setLang }) {
  return (
    <div className="language-toggle" role="group" aria-label="Language">
      {[
        ["hr", "HR"],
        ["en", "ENG"],
      ].map(([value, label]) => (
        <button
          key={value}
          type="button"
          className={lang === value ? "is-active" : ""}
          aria-pressed={lang === value}
          onClick={() => setLang(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function Navbar({ lang, setLang, copy = siteContent[lang] }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const onHome = location.pathname === "/";

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const resolveHref = (href) => (href.startsWith("#") && !onHome ? `/${href}` : href);

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label={lang === "hr" ? "Glavna navigacija" : "Main navigation"}>
        <Link to="/" className="brand-link" aria-label="Nepar Solutions">
          <img src="/brand/nepar_logo.png" alt="Nepar Solutions" />
        </Link>

        <div className="desktop-nav">
          {copy.navLinks.map(([label, href]) => {
            const resolved = resolveHref(href);
            const isRoute = resolved.startsWith("/");
            return isRoute ? (
              <Link key={href} to={resolved} className="nav-link">
                {label}
              </Link>
            ) : (
              <a key={href} href={resolved} className="nav-link">
                {label}
              </a>
            );
          })}
        </div>

        <div className="nav-actions">
          <LanguageToggle lang={lang} setLang={setLang} />
          <Link to="/kontakt" className="nav-cta">
            <Mail aria-hidden="true" size={17} />
            <span>{copy.navCta}</span>
          </Link>
          <button
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? copy.closeMenuLabel : copy.menuLabel}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-navigation" className="mobile-nav">
          {copy.navLinks.map(([label, href]) => {
            const resolved = resolveHref(href);
            const isRoute = resolved.startsWith("/");
            return isRoute ? (
              <Link key={href} to={resolved} className="mobile-nav-link" onClick={() => setOpen(false)}>
                {label}
              </Link>
            ) : (
              <a key={href} href={resolved} className="mobile-nav-link" onClick={() => setOpen(false)}>
                {label}
              </a>
            );
          })}
          <Link to="/kontakt" className="button button-primary mobile-nav-cta" onClick={() => setOpen(false)}>
            {copy.navCta}
            <Send aria-hidden="true" size={17} />
          </Link>
        </div>
      )}
    </header>
  );
}

/**
 * @param {{
 *   href?: string,
 *   onClick?: import("react").MouseEventHandler<HTMLButtonElement>,
 *   children: import("react").ReactNode,
 *   className?: string,
 *   variant?: "primary" | "secondary",
 *   type?: "button" | "submit" | "reset",
 *   target?: string,
 *   rel?: string
 * }} props
 */
export function MotionButton({ href, onClick, children, className = "", variant = "primary", type = "button", target, rel }) {
  const classes = `button button-${variant} ${className}`.trim();

  if (onClick) {
    return (
      <button type={type} className={classes} onClick={onClick}>
        {children}
      </button>
    );
  }

  if (href?.startsWith("/") && !target) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} target={target} rel={rel}>
      {children}
    </a>
  );
}

export function Background() {
  return (
    <div className="site-background" aria-hidden="true">
      <span className="site-glow site-glow-one" />
      <span className="site-glow site-glow-two" />
    </div>
  );
}

export function SiteFooter({ copy, homeLink = true }) {
  return (
    <footer className="site-footer">
      <div className="section-shell">
        <div className="footer-main">
          <div>
            <p className="footer-label">{copy.footer.infoLabel}</p>
            <p className="footer-company">{copy.footer.companyName}</p>
            <div className="footer-details">
              <span>{copy.footer.owner}</span>
              <span>{copy.footer.mbo}</span>
              <a href="mailto:nepar@nepar.hr">{copy.footer.email}</a>
            </div>
          </div>
          <a href="mailto:nepar@nepar.hr" className="footer-contact">
            nepar@nepar.hr
            <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </div>
        <div className="footer-bottom">
          <p>{copy.footer.copyright}</p>
          <a href={homeLink ? "#top" : "/"}>{copy.footer.top}</a>
        </div>
      </div>
    </footer>
  );
}
