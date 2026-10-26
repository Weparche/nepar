import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const args=process.argv.slice(2),i=args.indexOf('--url');
const targets=i>=0?[{slug:'fabela-production',url:args[i+1]}]:['fabela-v3','goldi-doctor-first-v3','bond-clinic-first-v3'].map(slug=>({slug,url:`http://127.0.0.1:8793/?demo=${slug}`}));
await mkdir('qa-output/health-trust-v3/lighthouse',{recursive:true});
for(const target of targets){
  const chrome=await launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--no-sandbox']});
  try{
    const result=await lighthouse(target.url,{port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance','accessibility']});
    if(!result)throw new Error('No Lighthouse result');
    const r=result.lhr;
    await writeFile(`qa-output/health-trust-v3/lighthouse/${target.slug}.json`,JSON.stringify(r,null,2));
    const lcp=r.audits['largest-contentful-paint'].numericValue!,cls=r.audits['cumulative-layout-shift'].numericValue!;
    console.log(JSON.stringify({slug:target.slug,performance:r.categories.performance.score,accessibility:r.categories.accessibility.score,lcpMs:lcp,cls,profile:r.configSettings,passed:lcp<=2500&&cls<=.1}));
    if(lcp>2500||cls>.1||r.runtimeError)process.exitCode=1;
  }finally{await chrome.kill();}
}
