import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/assets/backgrounds");

mkdirSync(outDir, { recursive: true });

const shell = (body, skyA = "#bfeeff", skyB = "#effbd2") => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1600" width="900" height="1600">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1600">
      <stop stop-color="${skyA}"/>
      <stop offset=".55" stop-color="${skyB}"/>
      <stop offset="1" stop-color="#f8f0c9"/>
    </linearGradient>
    <linearGradient id="grass" x1="0" y1="750" x2="0" y2="1600">
      <stop stop-color="#8fd268"/>
      <stop offset="1" stop-color="#54a64f"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="840" x2="900" y2="1460">
      <stop stop-color="#7ce4f4"/>
      <stop offset="1" stop-color="#2a8fd0"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#3a2b21" flood-opacity=".18"/>
    </filter>
  </defs>
  <rect width="900" height="1600" fill="url(#sky)"/>
  ${body}
</svg>`;

const meadow = `
  <path d="M0 1040c160-95 330-134 510-116 151 15 281 62 390 141v535H0Z" fill="url(#grass)"/>
  <path d="M0 1237c162-55 330-64 503-25 151 34 284 36 397 5v383H0Z" fill="#6fb957" opacity=".9"/>
  <circle cx="742" cy="180" r="60" fill="#ffd86d"/>
`;

const scenes = {
  "home-l1-05-rabbit-mobile.webp": shell(`
    ${meadow}
    <g filter="url(#soft)">
      <ellipse cx="440" cy="900" rx="130" ry="94" fill="#f6f1e4"/>
      <ellipse cx="348" cy="812" rx="36" ry="126" fill="#f6f1e4" transform="rotate(-13 348 812)"/>
      <ellipse cx="442" cy="800" rx="36" ry="132" fill="#f6f1e4" transform="rotate(13 442 800)"/>
      <ellipse cx="440" cy="894" rx="78" ry="60" fill="#fff9ef"/>
      <circle cx="405" cy="878" r="12" fill="#3e2c25"/>
      <circle cx="480" cy="878" r="12" fill="#3e2c25"/>
      <ellipse cx="444" cy="910" rx="18" ry="12" fill="#e6a6a6"/>
      <path d="M384 1080c61 35 132 35 212 0" stroke="#f7df8a" stroke-width="22" stroke-linecap="round"/>
    </g>
  `),
  "home-l1-06-cat-mobile.webp": shell(`
    ${meadow}
    <g filter="url(#soft)">
      <path d="M230 780h270v245H230Z" fill="#e96d3d"/>
      <path d="M200 786 365 650l174 136Z" fill="#a93b2e"/>
      <rect x="315" y="875" width="100" height="150" rx="12" fill="#6d3b25"/>
      <circle cx="590" cy="930" r="96" fill="#ee9d54"/>
      <path d="M524 864l30-72 42 66M654 862l39-68 29 78" fill="#ee9d54"/>
      <circle cx="555" cy="912" r="12" fill="#3e2c25"/>
      <circle cx="625" cy="912" r="12" fill="#3e2c25"/>
      <path d="M574 958c24 18 51 18 80 0" stroke="#6a3927" stroke-width="12" stroke-linecap="round"/>
    </g>
  `),
  "home-l1-08-mouse-mobile.webp": shell(`
    ${meadow}
    <g filter="url(#soft)">
      <path d="M210 1016c52-96 135-144 248-144 87 0 154 34 201 102-139 58-288 65-449 42Z" fill="#9a6f46"/>
      <ellipse cx="444" cy="1007" rx="104" ry="78" fill="#2b221d"/>
      <ellipse cx="474" cy="860" rx="103" ry="74" fill="#b7b0a4"/>
      <circle cx="407" cy="806" r="38" fill="#d6d1c5"/>
      <circle cx="541" cy="806" r="38" fill="#d6d1c5"/>
      <circle cx="444" cy="852" r="10" fill="#30251f"/>
      <circle cx="503" cy="852" r="10" fill="#30251f"/>
      <ellipse cx="474" cy="887" rx="20" ry="13" fill="#e6a6a6"/>
    </g>
  `),
  "home-l1-09-butterfly-mobile.webp": shell(`
    ${meadow}
    <g filter="url(#soft)">
      <ellipse cx="376" cy="820" rx="96" ry="142" fill="#f06bb0" transform="rotate(-26 376 820)"/>
      <ellipse cx="524" cy="820" rx="96" ry="142" fill="#7acdf0" transform="rotate(26 524 820)"/>
      <ellipse cx="399" cy="1008" rx="78" ry="98" fill="#ffca66" transform="rotate(28 399 1008)"/>
      <ellipse cx="501" cy="1008" rx="78" ry="98" fill="#8ed96a" transform="rotate(-28 501 1008)"/>
      <rect x="430" y="790" width="40" height="280" rx="22" fill="#46301f"/>
      <path d="M443 798c-28-67-74-99-139-97M459 798c28-67 74-99 139-97" stroke="#46301f" stroke-width="10" stroke-linecap="round"/>
      <circle cx="386" cy="806" r="20" fill="#ffd7eb" opacity=".7"/>
      <circle cx="535" cy="808" r="20" fill="#d6f5ff" opacity=".7"/>
    </g>
  `),
  "home-l1-10-mole-mobile.webp": shell(`
    <path d="M0 0h900v1600H0Z" fill="#dff4cb"/>
    <path d="M0 760c160-72 310-93 450-64 154 32 304 18 450-43v947H0Z" fill="#8bcf66"/>
    <path d="M0 1030c180 45 360 48 540 8 135-30 255-30 360 0v562H0Z" fill="#7b5133"/>
    <g filter="url(#soft)">
      <ellipse cx="450" cy="1020" rx="170" ry="96" fill="#6a442b"/>
      <ellipse cx="450" cy="970" rx="112" ry="78" fill="#8a5a3d"/>
      <circle cx="408" cy="946" r="11" fill="#251b16"/>
      <circle cx="491" cy="946" r="11" fill="#251b16"/>
      <ellipse cx="450" cy="980" rx="24" ry="15" fill="#e59b91"/>
      <path d="M350 1110c62 18 130 18 203 0" stroke="#b58a58" stroke-width="15" stroke-linecap="round"/>
    </g>
  `, "#d7f0ff", "#dff4cb"),
  "home-l2-07-turkey-mobile.webp": shell(`
    ${meadow}
    <g filter="url(#soft)">
      <path d="M185 760h292v270H185Z" fill="#db573a"/>
      <path d="M158 766 331 620l185 146Z" fill="#a33a2c"/>
      <rect x="286" y="884" width="92" height="146" fill="#6d3b25"/>
      <circle cx="610" cy="930" r="86" fill="#8b5631"/>
      <path d="M534 898c-72-112-25-206 75-109 52-128 133-110 115 31 119-35 154 57 45 110" fill="#b76a34"/>
      <circle cx="640" cy="842" r="34" fill="#a64c32"/>
      <path d="M673 842l42 20-42 18Z" fill="#f0a02c"/>
      <circle cx="650" cy="833" r="7" fill="#2b2118"/>
    </g>
  `),
  "home-l3-09-wild-boar-mobile.webp": shell(`
    <rect width="900" height="1600" fill="#cdeec9"/>
    <path d="M0 895c153-124 329-177 529-159 142 13 266 62 371 146v718H0Z" fill="#5aa05d"/>
    <g filter="url(#soft)">
      <path d="M230 910c60-97 191-132 330-76 81 33 124 88 129 166-137 66-278 77-423 32-65-21-77-62-36-122Z" fill="#6a4531"/>
      <path d="M620 873c40 5 69 27 87 66" stroke="#4b2f22" stroke-width="28" stroke-linecap="round"/>
      <circle cx="566" cy="888" r="12" fill="#251b16"/>
      <path d="M637 943c26 20 52 22 78 5" stroke="#f0e3c2" stroke-width="11" stroke-linecap="round"/>
      <path d="M225 815c-56-47-92-101-108-162M699 803c43-50 78-104 106-163" stroke="#714424" stroke-width="30" stroke-linecap="round"/>
    </g>
  `, "#d5f0ff", "#cdeec9"),
  "home-l4-01-crocodile-mobile.webp": shell(`
    <rect width="900" height="1600" fill="#c9f4ff"/>
    <path d="M0 855c144-74 291-82 441-24 169 65 322 55 459-30v799H0Z" fill="url(#water)"/>
    <path d="M0 1160c151-40 300-36 447 12 150 49 301 47 453-7v435H0Z" fill="#2b98c8"/>
    <g filter="url(#soft)">
      <path d="M178 900c183-92 353-97 510-13 54 29 58 68 13 115-142 47-309 43-501-12-56-16-64-47-22-90Z" fill="#4cae47"/>
      <path d="M617 875c86 7 144 33 174 78-48 24-105 30-172 18Z" fill="#6bc457"/>
      <circle cx="646" cy="909" r="12" fill="#20331f"/>
      <path d="M645 960c46 17 93 17 140 0" stroke="#eff7d5" stroke-width="10" stroke-linecap="round"/>
      <path d="M249 874c22-30 45-49 69-58M342 849c23-29 47-46 73-53M448 842c20-27 43-43 70-48" stroke="#d9ef7d" stroke-width="14" stroke-linecap="round"/>
    </g>
  `, "#bfeeff", "#ddf7f2"),
};

for (const [fileName, svg] of Object.entries(scenes)) {
  await sharp(Buffer.from(svg))
    .resize(900, 1600, { fit: "cover" })
    .webp({ quality: 88 })
    .toFile(join(outDir, fileName));
}

console.log(`Generated ${Object.keys(scenes).length} home mobile backgrounds in ${outDir}`);
