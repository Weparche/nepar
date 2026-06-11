import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/assets/homes");

mkdirSync(outDir, { recursive: true });

const svgShell = (body) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#3a2b21" flood-opacity=".18"/>
    </filter>
    <linearGradient id="sky" x1="0" y1="24" x2="0" y2="210" gradientUnits="userSpaceOnUse">
      <stop stop-color="#b9e8ff"/>
      <stop offset="1" stop-color="#eaf8ff"/>
    </linearGradient>
    <linearGradient id="grass" x1="0" y1="120" x2="0" y2="230" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7ccc4e"/>
      <stop offset="1" stop-color="#3c9142"/>
    </linearGradient>
    <linearGradient id="wood" x1="56" y1="60" x2="200" y2="216" gradientUnits="userSpaceOnUse">
      <stop stop-color="#c9823d"/>
      <stop offset="1" stop-color="#74411f"/>
    </linearGradient>
    <linearGradient id="water" x1="40" y1="118" x2="210" y2="214" gradientUnits="userSpaceOnUse">
      <stop stop-color="#67d8f1"/>
      <stop offset="1" stop-color="#2586c7"/>
    </linearGradient>
  </defs>
  ${body}
</svg>`;

const baseGround = `<ellipse cx="128" cy="214" rx="88" ry="20" fill="#4d6d35" opacity=".18"/>`;

const icons = {
  "farm.webp": svgShell(`
    <g filter="url(#softShadow)">
      ${baseGround}
      <path d="M24 184c36-33 77-50 123-50 35 0 64 9 88 28v50H24Z" fill="url(#grass)"/>
      <path d="M68 100h86v87H68Z" fill="#d95337"/>
      <path d="M61 103l50-44 61 44Z" fill="#b7372c"/>
      <path d="M157 122h37v65h-37Z" fill="#f4d6a0"/>
      <path d="M148 122l37-31 44 31Z" fill="#c84c34"/>
      <path d="M90 139h35v48H90Z" fill="#6b341d"/>
      <path d="M93 143h29M107 143v44" stroke="#f4d6a0" stroke-width="5"/>
      <path d="M84 112h28v21H84Z" fill="#9ee2ff"/>
      <path d="M35 174c45-9 91-9 138 0" fill="none" stroke="#f5d06d" stroke-width="9" stroke-linecap="round"/>
      <path d="M49 156c42-9 83-9 122 0" fill="none" stroke="#f5d06d" stroke-width="7" stroke-linecap="round"/>
      <circle cx="205" cy="70" r="20" fill="#ffd45c"/>
    </g>`),
  "barn.webp": svgShell(`
    <g filter="url(#softShadow)">
      ${baseGround}
      <path d="M47 109h162v97H47Z" fill="#c64434"/>
      <path d="M37 111l91-72 91 72Z" fill="#8b2e27"/>
      <path d="M78 142h50v64H78Z" fill="#74331f"/>
      <path d="M82 147h44M104 147v58M80 203l48-58M128 203L80 145" stroke="#f4d4a3" stroke-width="6" stroke-linecap="round"/>
      <path d="M146 139h39v30h-39Z" fill="#9fe1ff"/>
      <path d="M44 207h168" stroke="#4d6d35" stroke-width="11" stroke-linecap="round"/>
    </g>`),
  "savanna.webp": svgShell(`
    <g filter="url(#softShadow)">
      <circle cx="57" cy="73" r="28" fill="#ffd35b"/>
      <path d="M19 177c42-36 84-47 126-33 34 11 68 8 103-9v76H19Z" fill="#d7a73e"/>
      <path d="M22 199c44-17 89-17 135 0 28 10 55 9 80-2v25H22Z" fill="#b9822f"/>
      <path d="M165 145c0-31 12-52 35-64-5 26-12 44-35 64Z" fill="#688d3a"/>
      <path d="M165 145c-20-21-27-44-20-69 18 17 26 38 20 69Z" fill="#587b37"/>
      <path d="M164 145v64" stroke="#6b3e23" stroke-width="10" stroke-linecap="round"/>
      <path d="M53 181c15-17 25-37 31-60M87 184c14-20 22-42 25-67M119 187c12-18 20-36 24-56" stroke="#7d5a22" stroke-width="6" stroke-linecap="round"/>
    </g>`),
  "chicken-coop.webp": svgShell(`
    <g filter="url(#softShadow)">
      ${baseGround}
      <path d="M58 110h140v92H58Z" fill="#c96535"/>
      <path d="M46 111l82-58 84 58Z" fill="#8c3d28"/>
      <path d="M89 145h43v57H89Z" fill="#704020"/>
      <path d="M92 148h37M110 148v54" stroke="#f3c77e" stroke-width="5"/>
      <circle cx="165" cy="151" r="20" fill="#f5d782"/>
      <path d="M153 139c5-15 23-15 29 0" fill="#f05b3c"/>
      <path d="M180 151l17 8-17 8Z" fill="#f0a02c"/>
      <circle cx="171" cy="148" r="3" fill="#2b2118"/>
      <path d="M32 202h200" stroke="#5c8f39" stroke-width="9" stroke-linecap="round"/>
    </g>`),
  "pigsty.webp": svgShell(`
    <g filter="url(#softShadow)">
      ${baseGround}
      <path d="M42 126h172v79H42Z" fill="#9c6740"/>
      <path d="M36 128l58-46h117l-42 46Z" fill="#805033"/>
      <path d="M61 151h42v54H61Z" fill="#5f3828"/>
      <path d="M120 154h70v22h-70Z" fill="#d49b65"/>
      <circle cx="155" cy="157" r="23" fill="#ef8fa5"/>
      <circle cx="140" cy="152" r="5" fill="#40221f"/>
      <circle cx="170" cy="152" r="5" fill="#40221f"/>
      <ellipse cx="155" cy="164" rx="13" ry="9" fill="#d86f86"/>
      <circle cx="150" cy="164" r="3" fill="#5f2e32"/>
      <circle cx="160" cy="164" r="3" fill="#5f2e32"/>
      <path d="M49 207c43 14 93 15 155 1" stroke="#8b5b38" stroke-width="10" stroke-linecap="round"/>
    </g>`),
  "fish-pond.webp": svgShell(`
    <g filter="url(#softShadow)">
      <ellipse cx="128" cy="157" rx="88" ry="55" fill="url(#water)"/>
      <path d="M47 160c47 18 90 18 128 0" fill="none" stroke="#b8f3ff" stroke-width="9" stroke-linecap="round"/>
      <path d="M94 153c17-17 41-18 58 0-17 18-41 19-58 0Z" fill="#f2b43d"/>
      <path d="M152 153l26-16v32Z" fill="#e58d31"/>
      <circle cx="113" cy="149" r="4" fill="#27333a"/>
      <path d="M78 122c-14-10-28-10-42 0M184 122c15-11 29-11 43 0" stroke="#73b34d" stroke-width="10" stroke-linecap="round"/>
      <ellipse cx="128" cy="216" rx="79" ry="12" fill="#4d6d35" opacity=".2"/>
    </g>`),
  "pond-lilies.webp": svgShell(`
    <g filter="url(#softShadow)">
      <ellipse cx="128" cy="159" rx="90" ry="58" fill="url(#water)"/>
      <path d="M57 162c45 13 88 13 130 0" fill="none" stroke="#baf1ff" stroke-width="8" stroke-linecap="round"/>
      <path d="M68 143c21-12 41-10 60 7-22 10-42 8-60-7Z" fill="#3da853"/>
      <path d="M151 177c24-16 47-14 68 4-25 13-47 12-68-4Z" fill="#2f8d50"/>
      <g fill="#f4bad7">
        <ellipse cx="124" cy="126" rx="9" ry="18" transform="rotate(-22 124 126)"/>
        <ellipse cx="136" cy="126" rx="9" ry="18" transform="rotate(22 136 126)"/>
        <ellipse cx="130" cy="116" rx="8" ry="17"/>
        <ellipse cx="130" cy="135" rx="8" ry="17"/>
      </g>
      <circle cx="130" cy="127" r="6" fill="#ffe57c"/>
      <ellipse cx="128" cy="216" rx="79" ry="12" fill="#4d6d35" opacity=".2"/>
    </g>`),
  "forest-burrow.webp": svgShell(`
    <g filter="url(#softShadow)">
      <path d="M30 174c32-51 75-77 129-77 35 0 66 11 94 34v84H30Z" fill="url(#grass)"/>
      <path d="M60 151c17-27 42-41 75-41 37 0 64 17 82 51-46 18-91 18-137 1Z" fill="#7b4e2e"/>
      <ellipse cx="134" cy="164" rx="42" ry="30" fill="#2b2118"/>
      <path d="M19 142c27-21 49-33 67-37M190 119c25-18 42-29 52-34" stroke="#5a3924" stroke-width="11" stroke-linecap="round"/>
      <path d="M48 116c19 20 31 42 37 66M206 94c-18 28-28 57-30 86" stroke="#5f7f37" stroke-width="9" stroke-linecap="round"/>
    </g>`),
  "dam.webp": svgShell(`
    <g filter="url(#softShadow)">
      <path d="M27 146c37-20 75-20 114 0 34 17 70 17 108 0v73H27Z" fill="url(#water)"/>
      <path d="M49 130c20 20 47 31 80 31 32 0 61-10 87-31v71c-21 17-50 26-86 26-35 0-64-9-81-26Z" fill="#8a5a32"/>
      <path d="M59 138c37 18 78 18 123 0M59 165c38 14 79 14 124 0M59 191c39 12 81 12 126 0" stroke="#5b351e" stroke-width="9" stroke-linecap="round"/>
      <path d="M72 127v82M109 137v87M148 137v87M187 126v84" stroke="#6a3d22" stroke-width="13" stroke-linecap="round"/>
      <path d="M41 213c38 12 76 12 114 0" stroke="#c9f1ff" stroke-width="8" stroke-linecap="round"/>
      <path d="M209 158c12 14 22 31 30 50" stroke="#bdefff" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="128" cy="222" rx="82" ry="10" fill="#356a87" opacity=".22"/>
    </g>`),
  "mouse-hole.webp": svgShell(`
    <g filter="url(#softShadow)">
      <path d="M31 190c29-43 71-64 125-64 31 0 58 8 80 24v64H31Z" fill="url(#grass)"/>
      <path d="M49 160c18-28 45-43 80-43 39 0 68 18 87 54-47 17-95 17-144 0Z" fill="#9c7245"/>
      <ellipse cx="132" cy="171" rx="41" ry="31" fill="#2c221b"/>
      <path d="M71 150c37-15 78-16 122-2" fill="none" stroke="#d1a66e" stroke-width="8" stroke-linecap="round"/>
      <path d="M42 214h188" stroke="#4f8f42" stroke-width="11" stroke-linecap="round"/>
    </g>`),
  "underground.webp": svgShell(`
    <g filter="url(#softShadow)">
      <path d="M32 95c30-28 62-42 96-42 35 0 68 14 99 42v110H32Z" fill="#6f4a2e"/>
      <path d="M32 95c54 25 119 25 195 0v35c-61 20-126 20-195 0Z" fill="url(#grass)"/>
      <path d="M69 151c23-23 47-23 72 0 22 20 43 20 64 0" fill="none" stroke="#3a271b" stroke-width="18" stroke-linecap="round"/>
      <path d="M69 151c23-23 47-23 72 0 22 20 43 20 64 0" fill="none" stroke="#a27146" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="128" cy="216" rx="82" ry="13" fill="#4d3828" opacity=".2"/>
      <path d="M63 190c19-12 40-15 63-8M145 190c21-14 42-17 64-8" stroke="#a98757" stroke-width="7" stroke-linecap="round"/>
    </g>`),
  "river.webp": svgShell(`
    <g filter="url(#softShadow)">
      <path d="M31 86c31-23 64-34 98-34 39 0 73 12 102 36v129H31Z" fill="url(#grass)"/>
      <path d="M77 54c30 40 26 74-12 103-19 15-23 34-12 58h129c-17-27-13-51 12-71 29-24 34-54 13-90Z" fill="url(#water)"/>
      <path d="M79 83c25 25 24 48-4 69M187 78c16 21 12 40-12 57" fill="none" stroke="#c8f5ff" stroke-width="8" stroke-linecap="round"/>
      <path d="M44 216h182" stroke="#4d8f40" stroke-width="11" stroke-linecap="round"/>
      <path d="M44 123c21-14 42-20 63-18M152 189c25-10 48-10 69 0" stroke="#66aa45" stroke-width="9" stroke-linecap="round"/>
    </g>`),
  "mountain-cave.webp": svgShell(`
    <g filter="url(#softShadow)">
      <path d="M28 209 118 48l110 161Z" fill="#8a8f86"/>
      <path d="M118 48 80 209H28Z" fill="#6e776f"/>
      <path d="M118 48 228 209h-67Z" fill="#a6aaa0"/>
      <path d="M86 209c5-45 28-70 64-70 34 0 55 25 61 70Z" fill="#2b2a2a"/>
      <path d="M101 108l20 18 23-31 19 34" fill="none" stroke="#f3f1df" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M36 211h196" stroke="#4e7f3a" stroke-width="11" stroke-linecap="round"/>
    </g>`),
  "rainforest.webp": svgShell(`
    <g filter="url(#softShadow)">
      <rect x="25" y="55" width="206" height="165" rx="32" fill="#3b9a57"/>
      <path d="M38 195c25-55 54-93 88-114 39 23 68 61 88 114Z" fill="#1f6f47"/>
      <path d="M69 199c5-55 18-105 38-150M137 200c-2-59 9-111 33-156M191 200c-20-45-25-88-15-129" stroke="#714424" stroke-width="14" stroke-linecap="round"/>
      <path d="M79 83c31-34 63-38 96-13-37 9-68 14-96 13ZM117 74c38-29 70-24 97 13-39 0-70-4-97-13ZM48 124c36-30 73-31 111-4-43 8-79 9-111 4ZM113 124c43-35 83-33 120 7-45 2-85 0-120-7Z" fill="#65c751"/>
      <path d="M38 177c45 17 91 18 138 4 27-8 49-8 65 0v40H38Z" fill="#2d7c45"/>
      <circle cx="91" cy="119" r="9" fill="#e35042"/>
      <circle cx="183" cy="143" r="8" fill="#ffd75e"/>
    </g>`),
  "sea.webp": svgShell(`
    <g filter="url(#softShadow)">
      <circle cx="194" cy="67" r="25" fill="#ffd45c"/>
      <path d="M27 118c40-19 81-19 122 0 35 17 70 17 105 0v86H27Z" fill="url(#water)"/>
      <path d="M35 144c39 16 78 16 117 0 33-14 65-14 98 0M31 177c42 15 83 15 124 0 30-11 60-11 90 0" fill="none" stroke="#c9f5ff" stroke-width="10" stroke-linecap="round"/>
      <path d="M43 206h210" stroke="#2a7bb3" stroke-width="9" stroke-linecap="round"/>
    </g>`),
};

for (const [fileName, svg] of Object.entries(icons)) {
  await sharp(Buffer.from(svg))
    .resize(256, 256, { fit: "contain" })
    .webp({ quality: 92 })
    .toFile(join(outDir, fileName));
}

console.log(`Generated ${Object.keys(icons).length} home icons in ${outDir}`);
