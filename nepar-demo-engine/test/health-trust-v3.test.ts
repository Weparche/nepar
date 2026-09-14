import { env, exports } from 'cloudflare:workers';
import { beforeEach, describe, expect, it } from 'vitest';
import raw from '../packages/health-trust-v3/fabela-v3.json';
import { preparedPackageSchema } from '../src/prepared-package';
import { createDemoSchema, qaReportSchema, type QaReport } from '../src/schema';
import { contentFingerprint, digest, reviewFingerprint, v3ReportReady } from '../src/health-trust-v3-qa';
import { renderDemo } from '../src/templates-v2';
import { renderHealthTrustDemo } from '../src/health-trust';
import type { DemoRow } from '../src/models';

const payload = () => structuredClone(raw.payload);
const headers={Authorization:'Bearer test-admin-token-123','Content-Type':'application/json'};
async function request(path:string,method='GET',body?:unknown){return exports.default.fetch(new Request(`http://localhost${path}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body)}));}
async function create(){const r=await request('/__admin/demos','POST',payload());expect(r.status).toBe(201);return (await env.DB.prepare('SELECT * FROM demos WHERE slug=?').bind(raw.payload.slug).first<DemoRow>())!;}
const buffer=(text:string)=>new TextEncoder().encode(text).buffer;
async function reportFor(d:DemoRow):Promise<QaReport>{
  const viewports=[];const captures=[];
  for(const viewport of ['desktop','mobile'] as const){
    const bytes=buffer(`fake PNG bytes ${viewport}`);
    const r=await exports.default.fetch(new Request(`http://localhost/__admin/demos/${d.slug}/screenshots/${viewport}`,{method:'PUT',headers:{Authorization:headers.Authorization,'Content-Type':'image/png'},body:bytes}));
    expect(r.status).toBe(201);const {key}=await r.json() as {key:string};
    viewports.push({name:viewport,width:viewport==='desktop'?1440:390,height:viewport==='desktop'?1000:844,screenshotKey:key,checks:[{name:'visible',passed:true}]});
    captures.push({viewport,technicalScore:100,geometryScore:96,screenshotSha256:await digest(bytes),referenceSha256:'a'.repeat(64)});
  }
  const r=qaReportSchema.parse({status:'passed',checkedAt:new Date().toISOString(),url:'http://localhost',technicalScore:100,visualScore:96,visualStatus:'passed',viewports,consoleErrors:[],brokenImages:[],v3:{contentFingerprint:await contentFingerprint(d),captures}});
  const hash=await reviewFingerprint(r.v3!);
  for(const c of r.v3!.captures)c.designJudgment={score:94,reviewer:'gpt-6-astra',checkedAt:new Date().toISOString(),reviewFingerprint:hash,rationale:'Unit-test review record; not a real visual assessment.',findings:[]};
  return r;
}
beforeEach(async()=>{await env.DB.batch([env.DB.prepare('DELETE FROM workflow_events'),env.DB.prepare('DELETE FROM demo_events'),env.DB.prepare('DELETE FROM demos'),env.DB.prepare('DELETE FROM leads')]);});

describe('V3 contract and compatibility',()=>{
  it('validates the prepared package and rejects missing or stale evidence',()=>{
    expect(preparedPackageSchema.safeParse(raw).success).toBe(true);
    const p=structuredClone(raw);p.evidence=p.evidence.slice(1);expect(preparedPackageSchema.safeParse(p).success).toBe(false);
    const q=structuredClone(raw);q.payload.content.hero.description='Changed factual copy.';expect(preparedPackageSchema.safeParse(q).success).toBe(false);
  });
  it('rejects unknown versions, missing direction, missing image and conflicting aliases',()=>{
    const p=payload();
    for(const patch of [{designVersion:'health-trust-v99'},{visualDirection:undefined},{artDirection:'clinic-first'},{content:{...p.content,v3:undefined}}])expect(createDemoSchema.safeParse({...p,...patch}).success).toBe(false);
  });
  it('rejects invalid imagery and missing manifest entries',()=>{
    const p=payload();p.visualDirection='doctor-first';p.artDirection='doctor-first';expect(createDemoSchema.safeParse(p).success).toBe(false);
    p.visualDirection='clinic-first';p.artDirection='clinic-first';expect(createDemoSchema.safeParse(p).success).toBe(false);
    const q=payload();q.content.v3.assetManifest=[];expect(createDemoSchema.safeParse(q).success).toBe(false);
    const a=payload();a.content.v3.hero.mobile.focalPoint.x=2;expect(createDemoSchema.safeParse(a).success).toBe(false);
  });
  it('persists the renderer version and routes legacy without altering HTML',async()=>{
    const d=await create();expect(d.design_version).toBe('health-trust-v3');expect(d.art_direction).toBe('pet-first');
    const c=createDemoSchema.parse(payload()).content;
    expect(renderDemo(d,c)).toContain('data-design-version="health-trust-v3"');
    const legacy={...d,design_version:null};expect(renderDemo(legacy,c)).toBe(renderHealthTrustDemo(legacy,c));
    expect(()=>renderDemo({...d,design_version:'unknown'},c)).toThrow();
  });
  it('serves no scripts, evidence, references or synthetic named people',async()=>{
    await create();const response=await request('/?demo=fabela-v3');const html=await response.text();
    expect(response.status).toBe(200);expect(html).toContain('fetchpriority="high" loading="eager"');expect(html).toContain('loading="lazy"');
    expect(html).not.toContain('<script');expect(html).not.toContain('sourceField');expect(html).not.toContain('verifiedAt');expect(html).not.toContain('reference-designs');
    expect(html).not.toContain('provjeren');expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'none'");
    expect(response.headers.get('Link')).toContain('<https://nepar.hr>; rel=preconnect; crossorigin');
  });
  it('renders all eight services and handles absent contacts',async()=>{
    const d=await create();const c=createDemoSchema.parse(payload()).content;
    c.services=Array.from({length:8},(_,i)=>({...c.services[0],title:`Usluga ${i+1}`}));c.contact={};delete c.brand.location;
    const html=renderDemo(d,c);expect(html.match(/<article>/g)).toHaveLength(8);expect(html).not.toContain('class="sticky"');expect(html).not.toContain('id="kontakt"');
    c.contact.email='hello@example.com';expect(renderDemo(d,c)).toContain('Pošaljite upit');expect(renderDemo(d,c)).toContain('class="sticky"');
  });
  it('keeps prepared inputs part of idempotency',async()=>{
    const p=payload();const make=(body:unknown)=>exports.default.fetch(new Request('http://localhost/__admin/demos',{method:'POST',headers:{...headers,'Idempotency-Key':'v3-test-key'},body:JSON.stringify(body)}));
    expect((await make(p)).status).toBe(201);expect((await make(p)).status).toBe(200);
    p.content.hero.headline='Drugi naslov';expect((await make(p)).status).toBe(409);
  });
});
describe('V3 approval bound to captured inputs',()=>{
  it('requires actual judgment on both viewports and never averages away failure',async()=>{
    const d=await create(),r=await reportFor(d),fp=await contentFingerprint(d);
    expect(await v3ReportReady(r,fp)).toBe(true);
    const no=structuredClone(r);delete no.v3!.captures[0].designJudgment;expect(await v3ReportReady(no,fp)).toBe(false);
    const low=structuredClone(r);low.v3!.captures[1].designJudgment!.score=89;expect(await v3ReportReady(low,fp)).toBe(false);
    const critical=structuredClone(r);critical.v3!.captures[0].designJudgment!.findings=[{severity:'critical',detail:'Unreadable heading'}];expect(await v3ReportReady(critical,fp)).toBe(false);
    const geometry=structuredClone(r);geometry.v3!.captures[0].geometryScore=87;expect(await v3ReportReady(geometry,fp)).toBe(false);
    expect(await v3ReportReady(r,'b'.repeat(64))).toBe(false);
  });
  it('blocks legacy-shaped reports for V3 and accepts current bound review',async()=>{
    const d=await create(),r=await reportFor(d);
    const legacy=structuredClone(r);delete legacy.v3;expect((await request(`/__admin/demos/${d.slug}/qa`,'PATCH',legacy)).status).toBe(409);
    expect((await request(`/__admin/demos/${d.slug}/qa`,'PATCH',r)).status).toBe(200);
    expect((await request(`/__admin/demos/${d.slug}/approve`,'POST')).status).toBe(200);
    const bytes=buffer('replacement');await exports.default.fetch(new Request(`http://localhost/__admin/demos/${d.slug}/screenshots/mobile`,{method:'PUT',headers:{Authorization:headers.Authorization,'Content-Type':'image/png'},body:bytes}));
    expect((await request(`/__admin/demos/${d.slug}/approve`,'POST')).status).toBe(409);
    expect((await request(`/__admin/demos/${d.slug}/qa`,'PATCH',r)).status).toBe(409);
    const saved=await env.DB.prepare('SELECT approved_at,qa_status FROM demos WHERE id=?').bind(d.id).first<DemoRow>();expect(saved?.approved_at).toBeNull();expect(saved?.qa_status).toBe('pending');
  });
  it('rejects a review after content or asset manifest changes',async()=>{
    const d=await create(),r=await reportFor(d);const c=JSON.parse(d.content_json);c.v3.assetManifest[0].sha256='c'.repeat(64);
    await env.DB.prepare('UPDATE demos SET content_json=? WHERE id=?').bind(JSON.stringify(c),d.id).run();
    expect((await request(`/__admin/demos/${d.slug}/qa`,'PATCH',r)).status).toBe(409);
  });
});
