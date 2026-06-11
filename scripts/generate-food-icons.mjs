import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/assets/foods");

mkdirSync(outDir, { recursive: true });

const svgShell = (body) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#4f3b28" flood-opacity=".18"/>
    </filter>
    <linearGradient id="leafLight" x1="40" y1="24" x2="188" y2="216" gradientUnits="userSpaceOnUse">
      <stop stop-color="#bdf06a"/>
      <stop offset="1" stop-color="#42aa35"/>
    </linearGradient>
    <linearGradient id="leafDark" x1="74" y1="34" x2="202" y2="210" gradientUnits="userSpaceOnUse">
      <stop stop-color="#8ed94a"/>
      <stop offset="1" stop-color="#247b31"/>
    </linearGradient>
    <linearGradient id="straw" x1="42" y1="64" x2="212" y2="206" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffe68b"/>
      <stop offset="1" stop-color="#ca8d24"/>
    </linearGradient>
    <linearGradient id="nut" x1="74" y1="50" x2="188" y2="210" gradientUnits="userSpaceOnUse">
      <stop stop-color="#c88343"/>
      <stop offset=".55" stop-color="#8f4d24"/>
      <stop offset="1" stop-color="#5d2e18"/>
    </linearGradient>
  </defs>
  ${body}
</svg>`;

const icons = {
  "lettuce.webp": svgShell(`
    <g filter="url(#softShadow)" transform="translate(26 28) scale(.8)">
      <path d="M127 32c-22 15-34 34-36 58-19-8-41-3-59 14 6 34 27 56 61 66-7 21 0 42 19 60 28-6 48-22 60-48 24 2 47-8 64-31-8-30-30-50-64-59 0-27-15-48-45-60Z" fill="url(#leafDark)"/>
      <path d="M129 46c-17 24-17 56 0 93 15-33 15-64 0-93Z" fill="#d9ff83"/>
      <path d="M51 111c32 2 56 14 75 37-36 1-61-11-75-37Z" fill="#9ade47"/>
      <path d="M210 144c-32 5-60-2-83-23 35-5 62 3 83 23Z" fill="#5dbb3f"/>
      <path d="M111 219c0-34 12-62 38-82 4 36-9 63-38 82Z" fill="#82d247"/>
      <path d="M129 56c-4 40 1 80 18 118M62 118c25 8 51 20 78 35M199 141c-23 0-45 4-68 12" fill="none" stroke="#2b7a30" stroke-width="7" stroke-linecap="round" opacity=".44"/>
    </g>`),
  "grass.webp": svgShell(`
    <g filter="url(#softShadow)">
      <ellipse cx="128" cy="196" rx="67" ry="16" fill="#6a4a2b" opacity=".45"/>
      <path d="M69 190c21 15 93 18 121 0l-8 23c-30 17-82 17-106 0Z" fill="#76502e"/>
      <path d="M57 190c25 13 116 14 143 0-10 15-38 24-72 24-32 0-58-9-71-24Z" fill="#8b6538"/>
      <g stroke-linecap="round">
        <path d="M76 188c3-30 10-53 23-73-1 31 4 55 14 74" stroke="#32943a" stroke-width="7"/>
        <path d="M94 190c-2-38 7-66 27-95 0 41 6 72 17 95" stroke="#70c845" stroke-width="8"/>
        <path d="M118 190c-1-42 8-73 29-101 1 44 5 76 17 101" stroke="#23823a" stroke-width="8"/>
        <path d="M145 190c5-34 16-61 35-81-5 35-5 61 4 81" stroke="#78cb4a" stroke-width="8"/>
        <path d="M86 190c-14-24-19-47-16-70 15 25 30 49 45 70" stroke="#48a83c" stroke-width="6"/>
        <path d="M166 190c15-27 27-49 42-64-6 29-16 50-31 64" stroke="#3c9b36" stroke-width="6"/>
        <path d="M107 190c-8-25-8-47 2-67M133 190c5-27 14-50 27-68M154 190c-2-23 3-42 14-57" stroke="#95df57" stroke-width="5"/>
      </g>
      <path d="M67 190c31 9 91 9 124 0" fill="none" stroke="#9be45b" stroke-width="6" stroke-linecap="round"/>
    </g>`),
  "algae.webp": svgShell(`
    <g filter="url(#softShadow)" stroke-linecap="round" stroke-linejoin="round" transform="translate(23 18) scale(.82)">
      <ellipse cx="128" cy="211" rx="62" ry="16" fill="#315b44" opacity=".3"/>
      <path d="M83 205c-16-46 8-67-5-106-8-25-2-43 18-58" fill="none" stroke="#2f9b76" stroke-width="13"/>
      <path d="M126 207c-10-55 16-78 4-124-6-23 2-42 24-55" fill="none" stroke="#1c7d65" stroke-width="14"/>
      <path d="M170 205c19-43-1-69 17-109 10-23 6-42-13-57" fill="none" stroke="#45b783" stroke-width="13"/>
      <path d="M92 114c18 2 30 13 38 31M76 159c17-4 30 1 41 13M139 96c16 5 27 17 31 35M124 154c20-3 35 4 48 22M179 114c-19 2-32 13-42 31M166 162c-17-4-31 1-44 15" fill="none" stroke="#83ddb3" stroke-width="8"/>
      <circle cx="74" cy="81" r="7" fill="#75d7ad"/>
      <circle cx="157" cy="57" r="7" fill="#8ee4bf"/>
      <circle cx="190" cy="77" r="6" fill="#75d7ad"/>
    </g>`),
  "hazelnut.webp": svgShell(`
    <g filter="url(#softShadow)" transform="translate(16 18) scale(.88)">
      <circle cx="128" cy="141" r="68" fill="url(#nut)"/>
      <circle cx="128" cy="92" r="26" fill="#d4a066"/>
      <path d="M106 90c12 10 28 15 47 8" fill="none" stroke="#8a4d27" stroke-width="8" stroke-linecap="round" opacity=".45"/>
      <path d="M84 151c15 32 45 50 88 54-17 17-50 23-78 5-22-14-30-35-10-59Z" fill="#663419" opacity=".34"/>
      <ellipse cx="105" cy="127" rx="14" ry="8" fill="#efbf83" opacity=".45" transform="rotate(-25 105 127)"/>
      <path d="M150 103c22 14 36 35 42 62" fill="none" stroke="#5d2e18" stroke-width="7" stroke-linecap="round" opacity=".28"/>
    </g>`),
  "hay.webp": svgShell(`
    <g filter="url(#softShadow)" transform="translate(14 26) scale(.9)">
      <path d="M49 93c10-18 37-29 81-29 47 0 77 12 91 34v75c-14 23-45 35-93 35-45 0-72-12-79-35Z" fill="url(#straw)"/>
      <path d="M49 101c17 21 49 31 96 31 34 0 59-7 76-21v62c-14 23-45 35-93 35-45 0-72-12-79-35Z" fill="#e4a83c"/>
      <path d="M51 103c22 18 53 27 94 27 32 0 57-7 75-20" fill="none" stroke="#fff0a9" stroke-width="10" stroke-linecap="round"/>
      <path d="M72 78c19 29 32 67 39 120M126 68c-7 39-5 82 7 126M184 85c-20 32-31 67-33 103" fill="none" stroke="#bd7625" stroke-width="7" stroke-linecap="round" opacity=".68"/>
      <path d="M65 121c37 7 85 7 143-1M62 159c40 9 88 9 146 0" fill="none" stroke="#ffe48a" stroke-width="7" stroke-linecap="round"/>
      <path d="M43 103c58 36 120 37 181 2" fill="none" stroke="#8b5d2a" stroke-width="8" stroke-linecap="round"/>
    </g>`),
  "seeds.webp": svgShell(`
    <g filter="url(#softShadow)" transform="translate(22 23) scale(.82)">
      <ellipse cx="128" cy="198" rx="72" ry="24" fill="#6f4526" opacity=".16"/>
      <g>
        <ellipse cx="98" cy="174" rx="16" ry="29" fill="#6a4223" transform="rotate(-43 98 174)"/>
        <ellipse cx="116" cy="155" rx="13" ry="24" fill="#2f2419" transform="rotate(17 116 155)"/>
        <ellipse cx="139" cy="165" rx="14" ry="27" fill="#9d6632" transform="rotate(36 139 165)"/>
        <ellipse cx="159" cy="180" rx="12" ry="22" fill="#d4a45a" transform="rotate(64 159 180)"/>
        <ellipse cx="80" cy="193" rx="12" ry="21" fill="#c38a43" transform="rotate(74 80 193)"/>
        <ellipse cx="122" cy="193" rx="15" ry="26" fill="#47301c" transform="rotate(-80 122 193)"/>
        <ellipse cx="178" cy="199" rx="12" ry="22" fill="#7b4e27" transform="rotate(82 178 199)"/>
        <ellipse cx="148" cy="206" rx="11" ry="21" fill="#ebc36b" transform="rotate(-70 148 206)"/>
        <ellipse cx="104" cy="211" rx="10" ry="19" fill="#8d5a2f" transform="rotate(-100 104 211)"/>
      </g>
      <path d="M93 161c5 11 13 20 25 27M134 149c2 13 9 24 20 34M69 189c12 6 25 9 40 10M153 195c10 4 21 6 35 5" fill="none" stroke="#f3d58b" stroke-width="5" stroke-linecap="round" opacity=".65"/>
    </g>`),
  "acorn.webp": svgShell(`
    <g filter="url(#softShadow)" transform="translate(19 20) scale(.86)">
      <path d="M91 108c13-31 61-40 89-10 27 29 24 75-5 110-27 32-67 35-94 2-25-31-17-70 10-102Z" fill="url(#nut)"/>
      <path d="M73 103c10-39 105-62 128-12 6 13 0 25-14 30-39 12-77 9-113-4-8-3-9-8-1-14Z" fill="#8b552f"/>
      <path d="M78 101c43-24 84-29 123-10" fill="none" stroke="#d69b5a" stroke-width="9" stroke-linecap="round"/>
      <path d="M104 84c-5-24 6-40 34-48" fill="none" stroke="#6a3f23" stroke-width="10" stroke-linecap="round"/>
      <path d="M91 110c18 5 35 7 52 7M124 89c-9 11-15 22-17 33M160 82c-3 14-4 26-1 38" fill="none" stroke="#5d351d" stroke-width="6" stroke-linecap="round" opacity=".55"/>
      <path d="M106 148c12 18 30 30 54 35" fill="none" stroke="#edc085" stroke-width="7" stroke-linecap="round" opacity=".45"/>
    </g>`),
  "plankton.webp": svgShell(`
    <g filter="url(#softShadow)">
      <ellipse cx="128" cy="132" rx="44" ry="58" fill="#8fe8dc" opacity=".92"/>
      <ellipse cx="128" cy="132" rx="28" ry="39" fill="#44b9c2"/>
      <circle cx="116" cy="122" r="7" fill="#0b5365"/>
      <circle cx="143" cy="122" r="7" fill="#0b5365"/>
      <path d="M117 149c10 8 22 8 33 0" fill="none" stroke="#0b5365" stroke-width="6" stroke-linecap="round"/>
      <path d="M91 99c-21-18-35-34-43-58M165 99c20-20 34-39 42-62M82 134c-28-3-49-13-65-31M174 134c28-4 50-15 65-34M91 168c-22 15-43 22-64 22M164 168c24 15 46 21 66 18" fill="none" stroke="#5bd0d1" stroke-width="10" stroke-linecap="round"/>
      <circle cx="49" cy="39" r="8" fill="#7dddf2"/>
      <circle cx="209" cy="36" r="8" fill="#7dddf2"/>
      <circle cx="20" cy="101" r="7" fill="#a2eee9"/>
      <circle cx="234" cy="99" r="7" fill="#a2eee9"/>
      <circle cx="27" cy="190" r="7" fill="#7dddf2"/>
      <circle cx="231" cy="186" r="7" fill="#7dddf2"/>
      <ellipse cx="143" cy="97" rx="12" ry="7" fill="#d7fff9" opacity=".5" transform="rotate(28 143 97)"/>
    </g>`),
  "leaves.webp": svgShell(`
    <g filter="url(#softShadow)" transform="translate(18 28) scale(.86)">
      <path d="M53 154c20-51 66-79 130-80-8 66-43 108-103 121-28 6-47-12-27-41Z" fill="url(#leafDark)"/>
      <path d="M72 140c35-14 70-38 106-72" fill="none" stroke="#226f32" stroke-width="8" stroke-linecap="round"/>
      <path d="M91 130c-3-19 2-37 14-56M116 113c10 17 23 29 40 37M138 94c4 16 14 28 29 38" fill="none" stroke="#bdf06a" stroke-width="7" stroke-linecap="round" opacity=".72"/>
      <path d="M70 91c25-34 60-48 104-40-11 40-38 67-80 80-22 7-38-11-24-40Z" fill="#77c944"/>
      <path d="M82 101c27-11 53-27 78-50" fill="none" stroke="#2f7f32" stroke-width="7" stroke-linecap="round"/>
      <path d="M108 75c3 15 11 27 25 37" fill="none" stroke="#d4ff84" stroke-width="6" stroke-linecap="round" opacity=".72"/>
      <path d="M114 179c30-25 63-33 100-24-22 37-53 55-93 55-21 0-27-13-7-31Z" fill="#5eb43d"/>
      <path d="M129 178c24-4 49-12 76-25" fill="none" stroke="#2a7733" stroke-width="7" stroke-linecap="round"/>
    </g>`),
};

for (const [fileName, svg] of Object.entries(icons)) {
  await sharp(Buffer.from(svg))
    .resize(256, 256, { fit: "contain" })
    .webp({ quality: 92 })
    .toFile(join(outDir, fileName));
}

console.log(`Generated ${Object.keys(icons).length} food icons in ${outDir}`);
