import { describe, expect, it } from 'vitest';
import { buildDemoPayload, chooseHealthTrustArtDirection } from '../src/generation';
import type { DemoRow } from '../src/models';
import { createDemoSchema, researchedLeadSchema, visualAssetSchema } from '../src/schema';
import { renderHealthTrustDemo } from '../src/health-trust';
import { isOutreachReady, scoreVisualChecks, visualStatus } from '../src/visual-qa';

const verifiedAt='2026-08-23T10:00:00.000Z';
const baseLead={businessName:'Vet Test',slug:'vet-test',websiteUrl:'https://example.com',publicPhone:'+385 1 555 0100',city:'Zagreb',industry:'veterinarska ambulanta',source:'test',score:90,scoreReasons:['verified'],services:[{title:'Pregled',description:'Veterinarski pregled.',sourceField:'services'}],facts:{location:'Zagreb'},sources:[{field:'services',url:'https://example.com/services',verifiedAt},{field:'location',url:'https://example.com/contact',verifiedAt}],verifiedObservations:['Provjeren testni zapis.'],proposedServiceAngle:'Test.'};
const leadWith=(visualAssets:unknown[])=>researchedLeadSchema.parse({...baseLead,visualAssets});
const doctorAsset={kind:'hero',role:'doctor',url:'https://example.com/doctor.jpg',alt:'Dr. Test',sourceUrl:'https://example.com/team',provenance:'business-website',verifiedAt,depictsNamedPerson:true,namedPerson:'dr. Test',heroEligible:true};
const clinicAsset={kind:'hero',role:'clinic',url:'https://example.com/clinic.jpg',alt:'Ambulanta',sourceUrl:'https://example.com/clinic',provenance:'business-website',verifiedAt,depictsNamedPerson:false,heroEligible:true};

describe('health-trust v2 art direction',()=>{
  it('chooses doctor-first only for verified real named portrait',()=>{expect(chooseHealthTrustArtDirection(leadWith([doctorAsset])).artDirection).toBe('doctor-first');expect(chooseHealthTrustArtDirection(leadWith([])).artDirection).toBe('pet-first')});
  it('chooses clinic-first for verified clinic imagery',()=>{const s=chooseHealthTrustArtDirection(leadWith([clinicAsset]));expect(s.artDirection).toBe('clinic-first');expect(s.reason).toContain('verified clinic')});
  it('rejects synthetic named-person impersonation',()=>{expect(visualAssetSchema.safeParse({...doctorAsset,provenance:'ai-generated-decorative'}).success).toBe(false)});
  it('blocks doctor-first without verified portrait',async()=>{const input=await buildDemoPayload(leadWith([]));expect(createDemoSchema.safeParse({...input,artDirection:'doctor-first'}).success).toBe(false)});
  it('falls back legacy health-trust to pet-first',async()=>{const input=await buildDemoPayload(leadWith([]));const demo:DemoRow={id:1,slug:'vet-test',business_name:'Vet Test',template_key:'health-trust',content_json:JSON.stringify(input.content),source_url:null,lead_email:null,status:'active',custom_domain_id:null,created_at:verifiedAt,updated_at:verifiedAt,expires_at:null,lead_id:null,design_system_key:'health-trust',generation_version:'legacy',qa_status:'pending',qa_report_json:null,desktop_screenshot_key:null,mobile_screenshot_key:null,approved_at:null,sent_at:null,first_viewed_at:null,last_viewed_at:null,view_count:0,idempotency_key:null,idempotency_hash:null,outreach_json:null};expect(renderHealthTrustDemo(demo,input.content)).toContain('data-art-direction="pet-first"')});
});

describe('visual quality gate',()=>{
  it('requires both thresholds',()=>{expect(isOutreachReady(96,92,'passed')).toBe(true);expect(isOutreachReady(89,95,'passed')).toBe(false);expect(isOutreachReady(99,87,'needs_visual_review')).toBe(false)});
  it('scores weighted checks',()=>{const score=scoreVisualChecks([{viewport:'desktop',name:'a',passed:true,weight:9},{viewport:'desktop',name:'b',passed:false,weight:1}]);expect(score).toBe(90);expect(visualStatus(score)).toBe('passed');expect(visualStatus(87)).toBe('needs_visual_review')});
});
