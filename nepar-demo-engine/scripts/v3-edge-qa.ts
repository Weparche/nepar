import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser=await chromium.launch();
const results=[];
try {
  for(const slug of ['fabela-v3','goldi-doctor-first-v3','bond-clinic-first-v3']) for(const fixture of ['long','one','eight','email','address','none','no-support']) for(const width of [360,390,768,1440,1920]) {
    const page=await browser.newPage({viewport:{width,height:844}});
    await page.addInitScript('globalThis.__name = (fn) => fn');
    await page.goto(`http://127.0.0.1:8793/?demo=${slug}&fixture=${fixture}`,{waitUntil:'networkidle'});
    await page.emulateMedia({reducedMotion:'reduce'});
    const result=await page.evaluate(async()=>{
      await document.fonts.ready;
      window.scrollTo(0,document.body.scrollHeight);
      const sticky=document.querySelector<HTMLElement>('.sticky');
      const footer=document.querySelector('footer')!.getBoundingClientRect();
      const rect=sticky?.getBoundingClientRect();
      return {overflow:document.documentElement.scrollWidth>innerWidth+1,footerVisible:!rect||!rect.height||footer.bottom<=rect.top+1,sticky:!!sticky,padding:parseFloat(getComputedStyle(document.body).paddingBottom),services:document.querySelectorAll('.service-list article').length,href:sticky?.querySelector('a')?.getAttribute('href'),story:!!document.querySelector('.story')};
    });
    const passed=!result.overflow&&result.footerVisible&&(fixture!=='none'||(!result.sticky&&result.padding===0))&&(fixture!=='one'||result.services===1)&&(fixture!=='eight'||result.services===8)&&(fixture!=='email'||result.href?.includes('mailto'))&&(fixture!=='address'||result.href?.includes('%23kontakt'))&&(fixture!=='no-support'||!result.story);
    results.push({slug,fixture,width,passed,...result});
    await page.close();
  }
}finally{await browser.close();}
await mkdir('qa-output/health-trust-v3',{recursive:true});
await writeFile('qa-output/health-trust-v3/edge-cases.json',JSON.stringify(results,null,2));
const failed=results.filter(r=>!r.passed);console.log(JSON.stringify({cases:results.length,failed},null,2));if(failed.length)process.exitCode=1;
