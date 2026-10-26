import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import sharp from 'sharp';

// Only optimizes/reformats already approved source images; never generates imagery.
const root = resolve('assets/health-trust-v3');
const out = resolve('../public/health-trust-v3');
await mkdir(out, { recursive: true });
const files = ['pet-desktop.png', 'pet-mobile.png', 'pet-master.png', 'pet-support.png', 'doctor.jpg', 'doctor-mobile.jpg', 'clinic.jpg', 'clinic-mobile.jpg', 'clinic-support.jpg'];
const manifest: Array<{id:string;url:string;sha256:string;kind:'image'|'font';width?:number;height?:number}> = [];
for (const file of files) {
  const source = resolve(root, 'sources', file.replace(/-mobile\.jpg$/, '.jpg'));
  const maxWidth = file.includes('mobile') ? 720 : file === 'pet-master.png' ? 1200 : 1600;
  const { data, info } = await sharp(source).rotate().resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality: 84, effort: 6 }).toBuffer({ resolveWithObject: true });
  const sha256 = createHash('sha256').update(data).digest('hex');
  const id = basename(file).replace(/\.[^.]+$/, '');
  const name = `${id}-${sha256.slice(0,16)}.webp`;
  await writeFile(resolve(out, name), data);
  manifest.push({ id, url: `https://nepar.hr/health-trust-v3/${name}`, sha256, kind:'image', width: info.width, height: info.height });
}
for (const family of ['cormorant-garamond','dm-sans']) {
  // Latin + Latin Extended are separate font subsets and both are shipped.
  for (const subset of ['latin','latin-ext']) {
    const source = resolve(root, `fonts/${family}-${subset}.woff2`);
    const data = await readFile(source), sha256 = createHash('sha256').update(data).digest('hex');
    const name = `${family}-${subset}-${sha256.slice(0,16)}.woff2`;
    await writeFile(resolve(out,name), data);
    manifest.push({ id:`${family}-${subset}`, url:`https://nepar.hr/health-trust-v3/${name}`, sha256, kind:'font' });
  }
  await copyFile(resolve(`node_modules/@fontsource-variable/${family}/LICENSE`), resolve(out,`${family}-LICENSE.txt`));
}
await writeFile(resolve(root,'manifest.json'), JSON.stringify(manifest,null,2)+'\n');
console.log(`Prepared ${manifest.length} immutable assets in ${out}`);
