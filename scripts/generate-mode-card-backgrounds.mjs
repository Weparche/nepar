import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/assets/modes");

mkdirSync(outDir, { recursive: true });

const shell = (body) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 420" width="900" height="420">
  <defs>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#3a2b21" flood-opacity=".18"/>
    </filter>
    <linearGradient id="foodSky" x1="0" y1="0" x2="900" y2="420">
      <stop stop-color="#fff0b8"/>
      <stop offset="1" stop-color="#b7e87e"/>
    </linearGradient>
    <linearGradient id="homeSky" x1="0" y1="0" x2="900" y2="420">
      <stop stop-color="#bcecff"/>
      <stop offset="1" stop-color="#dff3b5"/>
    </linearGradient>
    <linearGradient id="soundSky" x1="0" y1="0" x2="900" y2="420">
      <stop stop-color="#e6d7ff"/>
      <stop offset="1" stop-color="#b9ecff"/>
    </linearGradient>
    <linearGradient id="babySky" x1="0" y1="0" x2="900" y2="420">
      <stop stop-color="#ffe8a8"/>
      <stop offset="1" stop-color="#ffd3dd"/>
    </linearGradient>
  </defs>
  ${body}
</svg>`;

const scenes = {
  "food.webp": shell(`
    <rect width="900" height="420" rx="48" fill="url(#foodSky)"/>
    <path d="M0 300c132-48 255-53 369-15 132 44 265 36 398-25 48-22 92-32 133-31v191H0Z" fill="#75bd55"/>
    <path d="M560 292c34-67 103-95 208-84-23 84-76 129-160 135-36 2-57-16-48-51Z" fill="#62b947" filter="url(#soft)"/>
    <path d="M600 281c47-18 92-45 136-81" fill="none" stroke="#2f7c37" stroke-width="17" stroke-linecap="round"/>
    <circle cx="217" cy="252" r="64" fill="#f28f31" filter="url(#soft)"/>
    <path d="M193 204c18-49 58-74 118-75-10 59-45 91-105 98" fill="#4fae48"/>
    <path d="M183 238c39 11 76 5 112-18" fill="none" stroke="#ffd18b" stroke-width="13" stroke-linecap="round" opacity=".65"/>
    <path d="M90 343c75-22 151-22 228 0M500 350c82-28 165-28 249 0" fill="none" stroke="#f8d66a" stroke-width="14" stroke-linecap="round" opacity=".82"/>
  `),
  "home.webp": shell(`
    <rect width="900" height="420" rx="48" fill="url(#homeSky)"/>
    <circle cx="755" cy="85" r="42" fill="#ffd66b"/>
    <path d="M0 306c102-55 219-67 350-35 133 33 274 11 423-65 47-24 89-36 127-38v252H0Z" fill="#6dbc55"/>
    <g filter="url(#soft)">
      <path d="M248 162h238v153H248Z" fill="#dd5739"/>
      <path d="M221 166 367 55l151 111Z" fill="#a83a30"/>
      <path d="M315 223h77v92h-77Z" fill="#6a351f"/>
      <path d="M322 230h64M354 230v85M316 314l78-84M394 314l-78-84" stroke="#f4d6a0" stroke-width="10" stroke-linecap="round"/>
      <path d="M418 216h66v48h-66Z" fill="#9ee5ff"/>
    </g>
    <path d="M560 303c45-38 92-47 143-28 35 13 69 9 102-12" fill="none" stroke="#fbce62" stroke-width="17" stroke-linecap="round"/>
    <path d="M87 311c36-26 75-35 116-27" fill="none" stroke="#3e8f45" stroke-width="18" stroke-linecap="round"/>
  `),
  "sound.webp": shell(`
    <rect width="900" height="420" rx="48" fill="url(#soundSky)"/>
    <path d="M0 310c116-35 218-37 306-7 104 36 204 27 300-27 90-51 188-64 294-39v183H0Z" fill="#70c785"/>
    <g filter="url(#soft)">
      <circle cx="260" cy="234" r="72" fill="#fff5c6"/>
      <path d="M228 228c25-55 66-77 123-66-9 63-44 96-104 100" fill="#f08a42"/>
      <circle cx="304" cy="207" r="9" fill="#3c2a21"/>
      <path d="M332 226c23 10 41 27 53 50" fill="none" stroke="#e2793d" stroke-width="18" stroke-linecap="round"/>
    </g>
    <path d="M528 145c43 39 65 87 65 145M606 101c67 58 101 128 101 210M448 188c22 27 33 61 33 102" fill="none" stroke="#6a5be8" stroke-width="22" stroke-linecap="round" opacity=".74"/>
    <path d="M533 145c36 39 54 87 54 145M611 101c57 58 86 128 86 210M453 188c18 27 27 61 27 102" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity=".65"/>
  `),
  "baby.webp": shell(`
    <rect width="900" height="420" rx="48" fill="url(#babySky)"/>
    <path d="M0 304c109-49 217-55 323-19 127 44 251 36 372-24 68-34 136-45 205-33v192H0Z" fill="#8bcf66"/>
    <g filter="url(#soft)">
      <circle cx="304" cy="232" r="69" fill="#f3b37d"/>
      <circle cx="257" cy="204" r="26" fill="#d98451"/>
      <circle cx="351" cy="204" r="26" fill="#d98451"/>
      <circle cx="281" cy="229" r="8" fill="#3b2b21"/>
      <circle cx="327" cy="229" r="8" fill="#3b2b21"/>
      <ellipse cx="304" cy="251" rx="23" ry="16" fill="#f7d0b0"/>
      <path d="M290 271c13 10 28 10 43 0" fill="none" stroke="#5a3326" stroke-width="9" stroke-linecap="round"/>
      <circle cx="581" cy="221" r="88" fill="#fff1c9"/>
      <circle cx="548" cy="208" r="10" fill="#3b2b21"/>
      <circle cx="610" cy="208" r="10" fill="#3b2b21"/>
      <path d="M559 243c18 12 39 12 61 0" fill="none" stroke="#5a3326" stroke-width="10" stroke-linecap="round"/>
    </g>
    <path d="M99 338c84-28 168-28 253 0M500 344c89-34 179-34 269 0" fill="none" stroke="#f4c957" stroke-width="14" stroke-linecap="round" opacity=".82"/>
  `),
};

for (const [name, svg] of Object.entries(scenes)) {
  await sharp(Buffer.from(svg))
    .resize(900, 420, { fit: "cover" })
    .webp({ quality: 90 })
    .toFile(join(outDir, name));
}

console.log(`Generated ${Object.keys(scenes).length} mode card backgrounds in ${outDir}`);
