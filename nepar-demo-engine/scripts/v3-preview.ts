import { edgeFixture } from './v3-fixtures';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import { preparedPackageSchema } from '../src/prepared-package';
import { renderDemo, pageHeaders } from '../src/templates-v2';
import type { DemoRow } from '../src/models';
import { contentFingerprint } from '../src/health-trust-v3-qa';

export function packageRow(pkg: ReturnType<typeof preparedPackageSchema.parse>): DemoRow {
  const p=pkg.payload;
  return {id:1,slug:p.slug,business_name:p.businessName,design_version:p.designVersion,art_direction:p.visualDirection,template_key:p.designSystemKey,design_system_key:p.designSystemKey,content_json:JSON.stringify(p.content),source_url:p.sourceUrl??null,lead_email:null,status:'active',custom_domain_id:null,created_at:'',updated_at:'',expires_at:null,lead_id:null,generation_version:p.generationVersion,qa_status:'pending',qa_report_json:null,desktop_screenshot_key:null,mobile_screenshot_key:null,approved_at:null,sent_at:null,first_viewed_at:null,last_viewed_at:null,view_count:0,idempotency_key:null,idempotency_hash:null,outreach_json:null};
}
const slugs=['fabela-v3','goldi-doctor-first-v3','bond-clinic-first-v3'];
const port=Number(process.env.V3_PREVIEW_PORT||8793);
const server=createServer(async(req,res)=>{
  try{
    const u=new URL(req.url||'/',`http://127.0.0.1:${port}`);
    if(u.pathname.startsWith('/health-trust-v3/')){
      const name=basename(u.pathname);
      if(!/^[a-z0-9.-]+\.(webp|woff2)$/.test(name)){res.writeHead(404).end();return;}
      const bytes=await readFile(resolve('../public/health-trust-v3',name));
      res.writeHead(200,{'Content-Type':name.endsWith('.webp')?'image/webp':'font/woff2','Cache-Control':'public,max-age=31536000,immutable'}).end(bytes);return;
    }
    if(u.pathname==='/__event'){
      const target=u.searchParams.get('to')||'#kontakt';
      if(!/^(#|tel:|mailto:)/.test(target)){res.writeHead(400).end();return;}
      res.writeHead(302,{Location:target.startsWith('#')?`/?demo=${encodeURIComponent(u.searchParams.get('demo')||slugs[0])}${target}`:target}).end();return;
    }
    const slug=u.searchParams.get('demo')||slugs[0];
    if(!slugs.includes(slug)){res.writeHead(404).end();return;}
    const pkg=preparedPackageSchema.parse(JSON.parse(await readFile(resolve('packages/health-trust-v3',`${slug}.json`),'utf8')));
    pkg.payload.content=edgeFixture(pkg.payload.content,u.searchParams.get('fixture'));
    const row=packageRow(pkg);
    const html=renderDemo(row,pkg.payload.content).replaceAll('https://nepar.hr/health-trust-v3/',`http://127.0.0.1:${port}/health-trust-v3/`);
    // Preview-only mapping. The deployable renderer always retains HTTPS URLs and CSP.
    const headers=new Headers(pageHeaders());headers.set('Content-Security-Policy',"default-src 'none'; img-src 'self'; font-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'");headers.set('X-V3-Content-Fingerprint',await contentFingerprint(row));
    res.writeHead(200,Object.fromEntries(headers.entries())).end(html);
  }catch(error){res.writeHead(500).end(String(error));}
});
server.listen(port,'127.0.0.1',()=>console.log(`V3 preview: http://127.0.0.1:${port}/?demo=fabela-v3`));
