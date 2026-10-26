import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { preparedPackageSchema } from '../src/prepared-package';
import { qaReportSchema, type QaReport } from '../src/schema';
import { contentFingerprint, digest, reviewFingerprint, v3ReportReady } from '../src/health-trust-v3-qa';
import { verifyLocalAssets } from './v3-package-io';

const args=process.argv.slice(2);
const option=(key:string)=>{const i=args.indexOf(key);return i<0?undefined:args[i+1];};
const packagePath=option('--package');
const names=packagePath?[packagePath]:['fabela-v3','goldi-doctor-first-v3','bond-clinic-first-v3'].map(s=>`packages/health-trust-v3/${s}.json`);
const output=resolve(option('--output')||'qa-output/health-trust-v3');
const api=option('--api'),token=process.env.DEMO_ENGINE_ADMIN_TOKEN;
if(api&&!token)throw new Error('DEMO_ENGINE_ADMIN_TOKEN is required for upload.');
const bytesHash=(b:Buffer)=>digest(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength) as ArrayBuffer);

async function measure(page:Page){return page.evaluate(()=>{
  const box=(selector:string)=>{const el=document.querySelector(selector);if(!el)return null;const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};
  const imgs=Array.from(document.images);
  const sticky=document.querySelector<HTMLElement>('.sticky');
  const stickyHeight=sticky?.getBoundingClientRect().height||0;
  return {
    hero:box('[data-qa=hero]'),image:box('[data-qa=hero-image]'),heading:box('h1'),intro:box('.intro'),cta:box('.intro .button'),trust:box('.trust'),services:box('.services'),story:box('.story'),
    overflow:document.documentElement.scrollWidth>innerWidth+1,
    broken:imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),
    anchors:Array.from(document.querySelectorAll('a[href^="#"]')).map(a=>a.getAttribute('href')!).filter(h=>!document.getElementById(h.slice(1))),
    imageLoading:imgs.every(i=>i.closest('[data-qa=hero-image]')?i.fetchPriority==='high'&&i.loading!=='lazy':i.loading==='lazy'),
    reserved:imgs.every(i=>Number(i.getAttribute('width'))>0&&Number(i.getAttribute('height'))>0),
    stickyHeight,stickyReserved:parseFloat(getComputedStyle(document.body).paddingBottom)>=stickyHeight,
    servicesCount:document.querySelectorAll('.service-list article').length,
    hasScript:document.scripts.length>0,
  };
});}
async function settle(page:Page){
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.images).filter(i=>i.loading!=='lazy').map(i=>i.decode().catch(()=>{})));});
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,35));}window.scrollTo(0,0);});
  await page.waitForTimeout(900);
}
const browser=await chromium.launch({headless:true});
try{
for(const file of names){
  const pkg=preparedPackageSchema.parse(JSON.parse(await readFile(resolve(file),'utf8')));await verifyLocalAssets(pkg);
  const p=pkg.payload,slug=p.slug,direction=p.visualDirection!;
  const url=option('--url')||`http://127.0.0.1:8793/?demo=${slug}`;
  const fp=await contentFingerprint({slug,design_version:p.designVersion,art_direction:direction,content_json:JSON.stringify(p.content)});
  const dir=resolve(output,slug);await mkdir(dir,{recursive:true});
  const viewports:QaReport['viewports']=[],captures:NonNullable<QaReport['v3']>['captures']=[],allErrors:string[]=[],allBroken:string[]=[],visualChecks:QaReport['visualChecks']=[];
  const matrix=[];
  for(const width of [360,390,768,1440,1920]){
    const height=width<800?844:1000,viewport:'desktop'|'mobile'=width<800?'mobile':'desktop';
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});const page=await context.newPage();
    await page.addInitScript('globalThis.__name = (fn) => fn'); // tsx/esbuild callback naming helper, test harness only
    const errors:string[]=[];const network:string[]=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('request',r=>network.push(r.url()));
    const response=await page.goto(url,{waitUntil:'networkidle'});await settle(page);
    const m=await measure(page);
    const checks=[{name:'http_200',passed:response?.status()===200},{name:'no_overflow',passed:!m.overflow},{name:'images_loaded',passed:!m.broken.length},{name:'anchors_resolve',passed:!m.anchors.length},{name:'hero_priority_and_lazy_support',passed:m.imageLoading},{name:'image_dimensions',passed:m.reserved},{name:'sticky_space_reserved',passed:m.stickyReserved},{name:'all_services_visible',passed:m.servicesCount===p.content.services.length},{name:'no_runtime_reference_or_script',passed:!m.hasScript&&!network.some(u=>u.includes('reference-designs'))},{name:'no_console_errors',passed:!errors.length}];
    const image=m.image!,heading=m.heading!,hero=m.hero!,cta=m.cta;
    const geometry=[
      {name:'hero_image_dominance',passed:width<=800?image.width/width>.8:direction==='clinic-first'?image.width/width>.95:image.width/Math.min(width,1440)>.3,weight:3},
      {name:'responsive_composition',passed:width<=800?image.y>heading.y:direction==='clinic-first'?image.y>heading.y:image.x>heading.x+heading.width*.6,weight:3},
      {name:'contact_first_view',passed:!cta||cta.y<height*.9,weight:2},
      {name:'hero_balance',passed:hero.height>300&&hero.height<(width<=800?1450:1100),weight:1},
      {name:'trust_before_services',passed:!m.trust||m.trust.y<m.services!.y,weight:1},
    ];
    const geometryScore=Math.round(100*geometry.filter(c=>c.passed).reduce((s,c)=>s+c.weight,0)/geometry.reduce((s,c)=>s+c.weight,0));
    const technicalScore=Math.round(100*checks.filter(c=>c.passed).length/checks.length);
    matrix.push({width,height,checks,geometryScore,measurement:m});
    if(width===390||width===1440){
      const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      await writeFile(resolve(dir,`${viewport}-accessibility.json`),JSON.stringify(axe.violations,null,2));
      checks.push({name:'wcag_axe',passed:!axe.violations.length});
      await page.screenshot({path:resolve(dir,`${viewport}-first.png`)});
      const png=await page.screenshot({path:resolve(dir,`${viewport}.png`),fullPage:true});
      let referenceSha256:string|undefined;try{referenceSha256=await bytesHash(await readFile(resolve(`reference-designs/health-trust-v3/${direction}-${viewport}.png`)));}catch{/* Pending reference cannot be approved. */}
      captures.push({viewport,technicalScore:axe.violations.length?Math.min(technicalScore,89):technicalScore,geometryScore,screenshotSha256:await bytesHash(png),referenceSha256});
      let screenshotKey:string|undefined;
      if(api){const uploaded=await fetch(`${api}/__admin/demos/${slug}/screenshots/${viewport}`,{method:'PUT',headers:{Authorization:`Bearer ${token}`,'Content-Type':'image/png'},body:new Uint8Array(png)});if(!uploaded.ok)throw new Error(`Upload failed ${uploaded.status}`);screenshotKey=(await uploaded.json() as {key:string}).key;}
      viewports.push({name:viewport,width,height,checks,screenshotKey});allErrors.push(...errors);allBroken.push(...m.broken);visualChecks.push(...geometry.map(c=>({...c,viewport})));
      await page.keyboard.press('Tab');const focused=await page.evaluate(()=>getComputedStyle(document.activeElement!).outlineStyle);checks.push({name:'keyboard_focus_visible',passed:focused!=='none'});
      await page.emulateMedia({reducedMotion:'reduce'});const animation=await page.locator('[data-qa=hero-image]').evaluate(el=>getComputedStyle(el).animationName);checks.push({name:'reduced_motion',passed:animation==='none'});
      await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});await page.waitForTimeout(100);const zoom=await measure(page);checks.push({name:'text_200_percent_no_overlap',passed:!zoom.overflow&&zoom.stickyReserved});
    }
    await context.close();
  }
  const matrixPassed=matrix.every(v=>v.checks.every(c=>c.passed)&&v.geometryScore>=88);
  const report=qaReportSchema.parse({status:matrixPassed&&viewports.every(v=>v.checks.every(c=>c.passed))?'passed':'failed',checkedAt:new Date().toISOString(),url,technicalScore:Math.min(...captures.map(c=>c.technicalScore)),visualScore:Math.min(...captures.map(c=>c.geometryScore)),visualStatus:'needs_visual_review',referenceKey:`health-trust-v3/${direction}`,visualChecks,viewports,consoleErrors:allErrors,brokenImages:allBroken,v3:{contentFingerprint:fp,captures}});
  if(report.status==='failed')process.exitCode=1;
  await writeFile(resolve(dir,'report.json'),JSON.stringify(report,null,2)+'\n');await writeFile(resolve(dir,'matrix.json'),JSON.stringify(matrix,null,2)+'\n');
  await writeFile(resolve(dir,'review-request.json'),JSON.stringify({reviewFingerprint:await reviewFingerprint(report.v3!),instruction:'Astra must inspect both saved screenshots. Supply independent design judgments; do not infer them from geometry.',captures:report.v3!.captures},null,2)+'\n');
  if(api){const r=await fetch(`${api}/__admin/demos/${slug}/qa`,{method:'PATCH',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(report)});if(!r.ok)throw new Error(`QA report upload failed ${r.status}`);}
  console.log(JSON.stringify({slug,technical:report.technicalScore,geometry:report.visualScore,technicalStatus:report.status,reviewReady:await v3ReportReady(report,fp),failed:viewports.flatMap(v=>v.checks.filter(c=>!c.passed).map(c=>`${v.name}:${c.name}`))}));
}
}finally{await browser.close();}
