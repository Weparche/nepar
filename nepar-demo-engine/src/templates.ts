import type { DemoRow, DesignSystemKey, DemoEventType } from './models';
import type { DemoContent } from './schema';
import { escapeHtml, safeColor, safeHref, safeImageUrl } from './schema';

interface Theme {
  ink: string;
  paper: string;
  surface: string;
  muted: string;
  line: string;
  radius: string;
  display: string;
  body: string;
  thesis: string;
  world: string;
  viewport: string;
}

const THEMES: Record<DesignSystemKey, Theme> = {
  'automotive-performance': {
    ink: '#f4f3eb', paper: '#0b0d0f', surface: '#171a1d', muted: '#a8adb2', line: '#34393e', radius: '4px',
    display: '"Arial Narrow", "Helvetica Neue", sans-serif', body: 'Arial, Helvetica, sans-serif',
    thesis: 'Radionica kao precizan tehnički zapis; odbija generički servisni hero i jednake kartice.',
    world: 'Grafitne plohe, signalna boja, tehničke oznake i rezani industrijski blokovi.',
    viewport: 'Veliki tipografski iskaz lijevo, dijagnostički dokaz i fotografija desno, CTA u osi naslova.',
  },
  'health-trust': {
    ink: '#17312d', paper: '#edf4f0', surface: '#ffffff', muted: '#567069', line: '#c9dad3', radius: '16px',
    display: 'Georgia, "Times New Roman", serif', body: 'Arial, Helvetica, sans-serif',
    thesis: 'Mirna jasnoća prije medicinskog marketinga; odbija hladnu kliničku mrežu kartica.',
    world: 'Kadulja, kredasto bijele plohe, mekani lukovi i uredna tipografska mjera.',
    viewport: 'Prostran naslov i akcija uz desni vertikalni stup provjerenih činjenica.',
  },
  'beauty-editorial': {
    ink: '#32181e', paper: '#f4e8ea', surface: '#fffafb', muted: '#795b62', line: '#dbc3c8', radius: '0px',
    display: 'Didot, Bodoni MT, Georgia, serif', body: '"Trebuchet MS", Arial, sans-serif',
    thesis: 'Naslovnica studija ljepote, ne katalog tretmana; odbija pastelni gradient i ikone u karticama.',
    world: 'Duboka višnja, puderasti papir, strogi hairline rubovi i fotografija u redakcijskom rezu.',
    viewport: 'Asimetrična naslovnica s okomitim nazivom, velikim naslovom i uskim fotografskim kadrom.',
  },
  'hospitality-immersive': {
    ink: '#fffdf7', paper: '#16251f', surface: '#20352d', muted: '#c7d1c9', line: '#486056', radius: '2px',
    display: 'Garamond, Georgia, serif', body: 'Arial, Helvetica, sans-serif',
    thesis: 'Mjesto se doživljava prije nego se opisuje; odbija hotelski template s galerijom jednakih kartica.',
    world: 'Tamno zelenilo, fotografski kadar preko cijelog polja i mirne bakrene akcije.',
    viewport: 'Fotografija nosi cijeli prvi ekran; copy i kontakt sjede u donjoj, čitljivoj zoni.',
  },
  'trade-local': {
    ink: '#172238', paper: '#f4f1e8', surface: '#fffdf7', muted: '#596273', line: '#c9c5b8', radius: '8px',
    display: 'Verdana, Arial, sans-serif', body: 'Arial, Helvetica, sans-serif',
    thesis: 'Dokaz izvedbe prije slogana; odbija polirani agency izgled bez lokalnog karaktera.',
    world: 'Radni papir, kobaltna polja, narančasta oznaka i čvrsti blokovi poput radnog naloga.',
    viewport: 'Naslov i kontakt su veliki i izravni, a odmah uz njih stoji raspored usluga i provjereni tragovi.',
  },
  'professional-authority': {
    ink: '#14213a', paper: '#f1f3f6', surface: '#ffffff', muted: '#566174', line: '#cbd1da', radius: '12px',
    display: 'Cambria, Georgia, serif', body: 'Arial, Helvetica, sans-serif',
    thesis: 'Autoritet kroz disciplinu i sadržaj; odbija korporativni gradient i anonimne stock ljude.',
    world: 'Mornarska tinta, arhivska siva, precizna pravila i tipografski stupci.',
    viewport: 'Naziv tvrtke kao zaglavlje dokumenta, naslov u dva stupca i dokaz u rubnim bilješkama.',
  },
};

function trackedHref(slug: string, eventType: DemoEventType, target: string): string {
  return `/__event?demo=${encodeURIComponent(slug)}&type=${eventType}&to=${encodeURIComponent(safeHref(target))}`;
}

function imageStyle(content: DemoContent): string {
  const image = safeImageUrl(content.hero.imageUrl || content.assets.find((asset) => asset.kind === 'hero')?.url);
  return image ? ` style="background-image:url('${escapeHtml(image)}')"` : '';
}

function renderHero(key: DesignSystemKey, demo: DemoRow, content: DemoContent): string {
  const name = escapeHtml(content.brand.name);
  const headline = escapeHtml(content.hero.headline);
  const description = escapeHtml(content.hero.description);
  const primary = `<a data-primary-cta class="button primary" href="${trackedHref(demo.slug, 'primary_cta_click', content.primaryCta.href)}">${escapeHtml(content.primaryCta.label)}</a>`;
  const secondary = content.secondaryCta
    ? `<a class="button secondary" href="${trackedHref(demo.slug, 'secondary_cta_click', content.secondaryCta.href)}">${escapeHtml(content.secondaryCta.label)}</a>`
    : '';
  const location = escapeHtml(content.brand.location || 'Hrvatska');
  const firstProof = content.proofPoints[0];

  if (key === 'automotive-performance') {
    return `<section class="hero auto-hero"><div class="auto-code" aria-hidden="true">RPM / 01<br>READY</div><div class="hero-copy"><h1>${headline}</h1><p>${description}</p><div class="actions">${primary}${secondary}</div></div><div class="hero-media"${imageStyle(content)}><div class="diag"><span>${name}</span><strong>${escapeHtml(firstProof?.value || 'Precizno')}</strong><small>${escapeHtml(firstProof?.label || location)}</small></div></div></section>`;
  }
  if (key === 'health-trust') {
    return `<section class="hero health-hero"><div class="hero-copy"><h1>${headline}</h1><p>${description}</p><div class="actions">${primary}${secondary}</div></div><aside class="trust-rail"><div class="trust-mark" aria-hidden="true">+</div><p>${escapeHtml(content.about.body)}</p><strong>${location}</strong></aside></section>`;
  }
  if (key === 'beauty-editorial') {
    return `<section class="hero beauty-hero"><div class="vertical-name" aria-hidden="true">${name}</div><div class="hero-media"${imageStyle(content)}></div><div class="hero-copy"><h1>${headline}</h1><p>${description}</p><div class="actions">${primary}${secondary}</div></div></section>`;
  }
  if (key === 'hospitality-immersive') {
    return `<section class="hero stay-hero"${imageStyle(content)}><div class="stay-scrim"></div><div class="hero-copy"><span>${location}</span><h1>${headline}</h1><p>${description}</p><div class="actions">${primary}${secondary}</div></div></section>`;
  }
  if (key === 'professional-authority') {
    return `<section class="hero authority-hero"><div class="authority-index"><span>${name}</span><span>${location}</span></div><div class="hero-copy"><h1>${headline}</h1><p>${description}</p><div class="actions">${primary}${secondary}</div></div><aside>${content.proofPoints.slice(0, 2).map((proof) => `<div><strong>${escapeHtml(proof.value)}</strong><span>${escapeHtml(proof.label)}</span></div>`).join('')}</aside></section>`;
  }
  return `<section class="hero trade-hero"><div class="hero-copy"><h1>${headline}</h1><p>${description}</p><div class="actions">${primary}${secondary}</div></div><div class="trade-board"><strong>${name}</strong><span>${location}</span><div>${content.services.slice(0, 3).map((service) => `<b>${escapeHtml(service.title)}</b>`).join('')}</div></div></section>`;
}

function renderProof(content: DemoContent): string {
  if (!content.proofPoints.length) return '';
  return `<section class="proof" aria-label="Provjerene činjenice">${content.proofPoints.map((proof) => `<div><strong>${escapeHtml(proof.value)}</strong><span>${escapeHtml(proof.label)}</span></div>`).join('')}</section>`;
}

function renderServices(content: DemoContent): string {
  return `<section id="usluge" class="services section"><header><h2>Kako vam možemo pomoći</h2><p>${escapeHtml(content.about.title)}</p></header><div class="service-list">${content.services.map((service) => `<article><div><h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.description)}</p></div></article>`).join('')}</div></section>`;
}

function renderAbout(content: DemoContent): string {
  return `<section id="o-nama" class="about section"><h2>${escapeHtml(content.about.title)}</h2><p>${escapeHtml(content.about.body)}</p></section>`;
}

function renderContact(demo: DemoRow, content: DemoContent): string {
  const phone = content.contact.phone;
  const email = content.contact.email;
  const links = [
    phone ? `<a href="${trackedHref(demo.slug, 'phone_click', `tel:${phone}`)}"><span>Telefon</span><strong>${escapeHtml(phone)}</strong></a>` : '',
    email ? `<a href="${trackedHref(demo.slug, 'email_click', `mailto:${email}`)}"><span>E-mail</span><strong>${escapeHtml(email)}</strong></a>` : '',
    content.contact.address ? `<div><span>Lokacija</span><strong>${escapeHtml(content.contact.address)}</strong></div>` : '',
  ].join('');
  return `<section id="kontakt" class="contact section"><div><h2>Razgovarajmo.</h2><p>Javite se izravno — bez nepotrebnih koraka i skrivenih obrazaca.</p></div><address>${links}</address></section>`;
}

export function renderDemo(demo: DemoRow, content: DemoContent): string {
  const key = demo.design_system_key in THEMES ? demo.design_system_key : 'trade-local';
  const theme = THEMES[key];
  const accent = safeColor(content.visual.accent);
  const name = escapeHtml(content.brand.name);
  const contract = `<!-- THESIS: ${theme.thesis}\nOWN-WORLD: ${theme.world}\nSTORY: Posjetitelj razumije ponudu, vidi provjereni dokaz i uspostavlja kontakt.\nFIRST VIEWPORT: ${theme.viewport}\nFORM: Vertikalni sustav ${key}; seed brief-six-verticals.\nFINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->`;
  return `<!doctype html>
<html lang="hr" data-design-system="${key}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>${name} — ${escapeHtml(content.brand.industry)}</title>
  <style>
    :root{--ink:${theme.ink};--paper:${theme.paper};--surface:${theme.surface};--muted:${theme.muted};--line:${theme.line};--accent:${accent};--radius:${theme.radius};--display:${theme.display};--body:${theme.body}}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--body);line-height:1.65}a{color:inherit}img{max-width:100%}.shell{width:min(1180px,calc(100% - 48px));margin-inline:auto}.nav{min-height:76px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line)}.brand{font-family:var(--display);font-size:1.25rem;font-weight:800;text-decoration:none}.nav-links{display:flex;align-items:center;gap:26px}.nav-links a{text-decoration:none;font-size:.88rem}.button{display:inline-flex;min-height:48px;align-items:center;justify-content:center;padding:12px 21px;border:1px solid var(--ink);border-radius:var(--radius);font-weight:800;text-decoration:none}.button.primary{background:var(--accent);border-color:var(--accent);color:#fff}.button.secondary{background:transparent}.button:focus-visible,a:focus-visible{outline:3px solid var(--accent);outline-offset:4px}.hero{min-height:650px;position:relative}.hero-copy h1,.section h2{font-family:var(--display);letter-spacing:-.035em;line-height:.98}.hero-copy h1{font-size:clamp(3.5rem,8vw,6rem);margin:0;max-width:12ch}.hero-copy>p{font-size:clamp(1rem,1.6vw,1.22rem);max-width:58ch;color:var(--muted);margin:24px 0 0}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:32px}.hero-media{background-color:var(--surface);background-position:${content.visual.imagePosition};background-size:cover}.proof{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));border-block:1px solid var(--line)}.proof div{padding:28px;border-right:1px solid var(--line)}.proof div:last-child{border-right:0}.proof strong,.proof span{display:block}.proof strong{font-family:var(--display);font-size:1.6rem}.proof span{font-size:.85rem;color:var(--muted)}.section{padding:clamp(72px,9vw,120px) 0}.section>header{display:grid;grid-template-columns:1fr 1fr;align-items:end;gap:40px;margin-bottom:48px}.section h2{font-size:clamp(2.6rem,5vw,4.8rem);margin:0;max-width:13ch}.section>header>p{max-width:52ch;color:var(--muted)}.service-list{border-top:1px solid var(--line)}.service-list article{display:grid;grid-template-columns:80px 1fr;gap:24px;padding:28px 0;border-bottom:1px solid var(--line)}.service-list article>span{color:var(--muted);font-size:.8rem}.service-list h3{font-family:var(--display);font-size:clamp(1.35rem,2.6vw,2rem);line-height:1.15;margin:0 0 8px}.service-list p{margin:0;color:var(--muted);max-width:70ch}.about{display:grid;grid-template-columns:1fr 1fr;gap:70px;border-block:1px solid var(--line)}.about>p{font-size:clamp(1.15rem,2vw,1.4rem);color:var(--muted);margin:0;max-width:65ch}.contact{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:start}.contact p{color:var(--muted);max-width:45ch}.contact address{display:grid;font-style:normal;border-top:1px solid var(--line)}.contact address>*{display:flex;justify-content:space-between;gap:20px;padding:20px 0;border-bottom:1px solid var(--line);text-decoration:none}.contact address span{color:var(--muted)}.footer{min-height:100px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--line);font-size:.8rem;color:var(--muted)}
    .auto-hero{display:grid;grid-template-columns:70px 1fr 46%;border-bottom:1px solid var(--line)}.auto-code{padding-top:56px;border-right:1px solid var(--line);font:700 11px/1.5 Consolas,monospace;color:var(--accent)}.auto-hero .hero-copy{align-self:center;padding:60px 48px}.auto-hero .hero-media{margin:28px 0 28px 20px;position:relative;clip-path:polygon(9% 0,100% 0,100% 100%,0 100%,0 9%)}.diag{position:absolute;left:22px;right:22px;bottom:22px;background:var(--paper);padding:18px;border-top:3px solid var(--accent);display:grid}.diag strong{font:800 2rem/1 var(--display)}.diag small{color:var(--muted)}
    .health-hero{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(260px,.55fr);gap:70px;align-items:center}.health-hero .hero-copy{padding:70px 0}.trust-rail{align-self:stretch;border-left:1px solid var(--line);padding:70px 0 70px 42px;display:flex;flex-direction:column;justify-content:center}.trust-mark{width:68px;height:68px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:#fff;font-size:2.4rem;margin-bottom:44px}.trust-rail p{font-family:var(--display);font-size:1.25rem}.trust-rail strong{margin-top:24px}
    .beauty-hero{display:grid;grid-template-columns:72px 42% 1fr;gap:0;border-bottom:1px solid var(--line)}.vertical-name{writing-mode:vertical-rl;transform:rotate(180deg);padding:38px 18px;text-align:right;border-right:1px solid var(--line);font:700 .75rem/1 var(--body);letter-spacing:.16em;text-transform:uppercase}.beauty-hero .hero-media{min-height:650px}.beauty-hero .hero-copy{align-self:end;padding:52px 0 60px 56px}.beauty-hero .hero-copy h1{font-weight:400}.beauty-hero .button.primary{background:var(--ink);border-color:var(--ink)}
    .stay-hero{min-height:min(820px,calc(100vh - 30px));margin-top:24px;background-color:var(--surface);background-size:cover;background-position:center;display:flex;align-items:end}.stay-scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,15,11,.05) 25%,rgba(5,15,11,.88) 100%)}.stay-hero .hero-copy{position:relative;padding:80px 64px;max-width:850px}.stay-hero .hero-copy>span{display:block;margin-bottom:22px}.stay-hero .hero-copy>p{color:var(--muted)}.stay-hero .button.secondary{border-color:var(--ink)}
    .trade-hero{display:grid;grid-template-columns:1.15fr .85fr;gap:24px;align-items:center}.trade-hero .hero-copy{padding:70px 30px 70px 0}.trade-board{background:var(--accent);color:#fff;min-height:500px;padding:42px;display:flex;flex-direction:column;justify-content:space-between;clip-path:polygon(0 0,100% 0,100% 92%,90% 100%,0 100%)}.trade-board>strong{font:800 clamp(2rem,4vw,4rem)/1 var(--display)}.trade-board>span{font-size:1rem}.trade-board>div{display:grid}.trade-board b{padding:17px 0;border-top:1px solid rgba(255,255,255,.45)}
    .authority-hero{display:grid;grid-template-columns:190px 1fr 260px;gap:46px;padding:72px 0;border-bottom:1px solid var(--line)}.authority-index{display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid var(--line);padding-right:30px;font-size:.75rem;text-transform:uppercase;letter-spacing:.12em}.authority-hero .hero-copy{align-self:center}.authority-hero>aside{align-self:end;border-top:3px solid var(--ink)}.authority-hero>aside div{padding:18px 0;border-bottom:1px solid var(--line)}.authority-hero>aside strong,.authority-hero>aside span{display:block}.authority-hero>aside strong{font:700 1.45rem var(--display)}.authority-hero>aside span{color:var(--muted);font-size:.8rem;margin-top:5px}
    @media(max-width:800px){.shell{width:min(100% - 28px,680px)}.nav{min-height:68px}.nav-links>a:not(.button){display:none}.hero{min-height:auto}.hero-copy h1{font-size:clamp(2.65rem,13vw,4.25rem);max-width:11ch}.section{padding:68px 0}.section>header,.about,.contact{grid-template-columns:1fr;gap:26px}.section>header{margin-bottom:30px}.proof{grid-template-columns:1fr 1fr}.proof div{padding:20px 14px}.proof div:nth-child(2n){border-right:0}.service-list article{grid-template-columns:42px 1fr;padding:23px 0}.auto-hero{grid-template-columns:38px 1fr}.auto-code{padding-top:42px}.auto-hero .hero-copy{padding:52px 18px 34px}.auto-hero .hero-media{grid-column:1/-1;min-height:380px;margin:0 0 14px}.health-hero{grid-template-columns:1fr;gap:0}.health-hero .hero-copy{padding:54px 0 38px}.trust-rail{border-left:0;border-top:1px solid var(--line);padding:34px 0}.trust-mark{width:54px;height:54px;margin-bottom:20px}.beauty-hero{grid-template-columns:38px 1fr}.beauty-hero .hero-media{min-height:410px}.beauty-hero .hero-copy{grid-column:1/-1;padding:34px 0 56px}.stay-hero{min-height:670px;margin-top:14px}.stay-hero .hero-copy{padding:44px 24px}.trade-hero{grid-template-columns:1fr}.trade-hero .hero-copy{padding:54px 0 26px}.trade-board{min-height:360px;padding:28px}.authority-hero{grid-template-columns:1fr;padding:48px 0;gap:30px}.authority-index{min-height:auto;flex-direction:row;border-right:0;border-bottom:1px solid var(--line);padding:0 0 18px}.authority-hero>aside{display:grid;grid-template-columns:1fr 1fr}.authority-hero>aside div{padding-right:16px}.contact address>*{display:grid;gap:2px}.footer{align-items:flex-start;flex-direction:column;justify-content:center;gap:4px}}
    @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
    .service-list article{display:block;grid-template-columns:none;gap:0}.service-list article>span{display:none}
    @media(max-width:800px){.service-list article{display:block;grid-template-columns:none}}
  </style>
</head>
<body>
${contract}
  <header class="shell nav"><a class="brand" href="#vrh">${name}</a><nav class="nav-links" aria-label="Glavna navigacija"><a href="#usluge">Usluge</a><a href="#o-nama">O nama</a><a class="button primary" href="#kontakt">Kontakt</a></nav></header>
  <main id="vrh" class="shell">
    ${renderHero(key, demo, content)}
    ${renderProof(content)}
    ${renderServices(content)}
    ${renderAbout(content)}
    ${renderContact(demo, content)}
  </main>
  <footer class="shell footer"><span>${name}</span><span>Privremeni NEPAR demo · nije indeksiran</span></footer>
</body>
</html>`;
}

export function pageHeaders(): HeadersInit {
  return {
    'Content-Type': 'text/html; charset=UTF-8',
    'Cache-Control': 'private, max-age=60',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'none'; img-src https: data:; style-src 'unsafe-inline'; font-src https: data:; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  };
}

export function renderNotFound(message: string): string {
  return `<!doctype html><html lang="hr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>NEPAR demo</title><style>body{font-family:Arial,sans-serif;background:#07111f;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0}main{max-width:580px;padding:32px;text-align:center}p{color:#a9b7c9}a{color:#71d5eb;min-height:44px;display:inline-flex;align-items:center}</style></head><body><main><h1>${escapeHtml(message)}</h1><p>Ova privremena prezentacija više nije dostupna.</p><a href="https://nepar.hr">Natrag na nepar.hr</a></main></body></html>`;
}
