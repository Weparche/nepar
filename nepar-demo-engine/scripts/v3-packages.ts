import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildDemoPayload } from '../src/generation';
import { researchedLeadSchema, createDemoSchema } from '../src/schema';
import { displayFields, preparedPackageSchema } from '../src/prepared-package';
import type { ResponsiveImage } from '../src/health-trust-v3-contract';

type Asset = {id:string;url:string;sha256:string;kind:'image'|'font';width?:number;height?:number};
const manifest: Asset[] = JSON.parse(await readFile('assets/health-trust-v3/manifest.json','utf8'));
const asset = (id: string) => { const a=manifest.find(a=>a.id===id); if(!a)throw new Error(`Missing ${id}`);return a; };
const variant = (id:string) => { const a=asset(id);return {url:a.url,width:a.width!,height:a.height!,focalPoint:{x:.5,y:.5}}; };
const pets: ResponsiveImage = {
  desktop:variant('pet-desktop'), mobile:variant('pet-mobile'), alt:'Zlatni retriver i sivo-bijela mačka u toplom svjetlu.',
  origin:{provenance:'ai-generated-decorative',sourceUrl:asset('pet-master').url,masterAssetId:'fabela-pets-master-v3',depictsNamedPerson:false},
};
const fonts={serif:asset('cormorant-garamond-latin').url,sans:asset('dm-sans-latin').url,serifExtended:asset('cormorant-garamond-latin-ext').url,sansExtended:asset('dm-sans-latin-ext').url};
const prompts=JSON.parse(await readFile('assets/health-trust-v3/prompts.json','utf8'));
const out=resolve('packages/health-trust-v3');await mkdir(out,{recursive:true});
const verifiedAt='2026-09-14T12:00:00.000Z';
const bondUrl='https://bondvet.com/c/east-86th-street-animal-hospital';
for(const direction of ['pet-first','doctor-first','clinic-first'] as const){
  const fabela=direction==='pet-first';
  const lead=researchedLeadSchema.parse(JSON.parse(await readFile('fixtures/fabela-research.json','utf8')));
  lead.slug=fabela?'fabela-v3':`bond-${direction}-v3`;
  const payload=await buildDemoPayload(lead);
  payload.slug=lead.slug;payload.attachDomain=false;payload.designVersion='health-trust-v3';payload.visualDirection=direction;payload.artDirection=direction;
  payload.generationVersion='astra-codex-prepared-v3';payload.artDirectionReason=fabela?'Pet-first: no verified real portrait or facility photograph in the Fabela lead.':'Local QA specimen using verified official Bond Vet imagery; never an outreach target.';
  const c=payload.content;
  c.hero={headline:'Njihov mali svijet. Naša velika briga.',description:'Veterinarska ambulanta Fabela u Zagrebu. Od preventivnog pregleda do dijagnostike i kirurgije — razgovarajmo o skrbi za vašeg ljubimca.'};
  c.about={title:'Blizu vama. Posvećeni njima.',body:'Na Tratinskoj 53/I, Fabela okuplja veterinarsku skrb pod vodstvom dr. Alana Jurce. Ambulanta ima više od 15 godina iskustva u skrbi za kućne ljubimce.\n\nZa informacije o pregledu i uslugama nazovite nas. Prvi korak počinje razgovorom.'};
  const descriptions=['Preventivni pregledi i cijepljenje za vašeg ljubimca.','Ultrazvučna i rendgenska dijagnostika u ambulanti.','Kardiološka obrada vašeg ljubimca.','Kirurški zahvati dio su usluga naše ambulante.','Dermatološka i oftalmološka skrb.','Laboratorijske, virusološke i parazitološke pretrage.'];
  c.services=c.services.map((s,i)=>({...s,description:descriptions[i]}));
  c.proofPoints=[{value:'15+ godina',label:'Iskustva u veterinarskoj skrbi',sourceField:'fabela.experience'},{value:'dr. Alan Jurca',label:'Stručni voditelj ambulante',sourceField:'fabela.lead'},{value:'Tratinska 53/I',label:'Zagreb',sourceField:'fabela.location'}];
  c.assets=[];delete c.secondaryCta;
  const support={...pets,desktop:variant('pet-support'),mobile:variant('pet-support'),alt:'Zlatni retriver i sivo-bijela mačka odmaraju zajedno.'};
  c.v3={hero:pets,heroRole:'pet',support,fonts,assetManifest:[]};
  if(!fabela){
    lead.businessName='Bond Vet';lead.websiteUrl=bondUrl;lead.publicPhone=undefined;lead.city='New York';lead.source='official-business-site / local QA specimen';
    lead.facts={location:'1535 3rd Ave, Manhattan, NY 10028',doctor:'Dr. Dan Bloomfield'};
    lead.sources=[{field:'bond.services',url:bondUrl,verifiedAt},{field:'bond.location',url:bondUrl,verifiedAt},{field:'bond.doctor',url:'https://bondvet.com/careers/opportunities/veterinarians',verifiedAt}];
    lead.services=[{title:'Preventivni pregledi',description:'Redoviti veterinarski pregledi.',sourceField:'bond.services'},{title:'Cijepljenje',description:'Cijepljenje kućnih ljubimaca.',sourceField:'bond.services'},{title:'Laboratorijske pretrage',description:'Laboratorijska dijagnostika.',sourceField:'bond.services'}];
    lead.visualAssets=[];lead.verifiedObservations=['Lokalni QA primjer s fotografijama službene stranice Bond Vet.'];lead.proposedServiceAngle='Lokalna provjera renderera; bez slanja ponude.';
    payload.businessName=lead.businessName;payload.sourceUrl=bondUrl;payload.leadEmail=undefined;payload.outreach={prospectName:'Bond Vet — QA only',verifiedObservations:lead.verifiedObservations,proposedServiceAngle:lead.proposedServiceAngle};
    c.brand={name:'Bond Vet',industry:'Veterinarska skrb',location:'New York'};c.contact={address:lead.facts.location as string,website:bondUrl};
    c.primaryCta={label:'Kontakt i lokacija',href:'#kontakt'};c.services=lead.services;c.sources=lead.sources;c.verifiedObservations=lead.verifiedObservations;
    c.hero={headline:direction==='doctor-first'?'Stručnost s osobnim pristupom.':'Prostor za pažljivu skrb.',description:'Preventivni pregledi, cijepljenje i laboratorijska dijagnostika za vaše ljubimce.'};
    c.about={title:direction==='doctor-first'?'Upoznajte naš pristup.':'Dobro došli u Bond Vet.',body:direction==='doctor-first'?'Dr. Dan Bloomfield veterinar je u Bond Vetu. Ovaj lokalni primjer predstavlja profesionalni portret i ponudu veterinarskih usluga.':'Bond Vet na Upper East Sideu pruža veterinarsku skrb na adresi 1535 3rd Ave u New Yorku.'};
    c.proofPoints=direction==='doctor-first'?[{value:'Dr. Dan Bloomfield',label:'Veterinar · Bond Vet',sourceField:'bond.doctor'}]:[{value:'Upper East Side',label:'1535 3rd Ave · New York',sourceField:'bond.location'}];
    const clinic:ResponsiveImage={desktop:variant('clinic'),mobile:variant('clinic-mobile'),alt:'Stvarna čekaonica Bond Vet ambulante na Upper East Sideu.',origin:{provenance:'business-website',sourceUrl:bondUrl,verifiedAt,depictsNamedPerson:false}};
    const doctor:ResponsiveImage={desktop:variant('doctor'),mobile:variant('doctor-mobile'),alt:'Dr. Dan Bloomfield, veterinar u Bond Vetu.',origin:{provenance:'business-website',sourceUrl:'https://bondvet.com/careers/opportunities/veterinarians',verifiedAt,depictsNamedPerson:true,namedPerson:'Dr. Dan Bloomfield'}};
    c.v3.hero=direction==='doctor-first'?doctor:clinic;c.v3.heroRole=direction==='doctor-first'?'doctor':'clinic';c.v3.support=direction==='doctor-first'?clinic:{...clinic,desktop:variant('clinic-support'),mobile:variant('clinic-support'),alt:'Prostor za veterinarski pregled u Bond Vet ambulanti.'};
  }
  if(direction==='doctor-first'){
    const url='https://goldi-vet.hr/nas-tim/';
    lead.slug='goldi-doctor-first-v3';lead.businessName='Goldi';lead.websiteUrl=url;lead.city='Zagreb';lead.publicPhone='+385 1 4854725';lead.source='official-business-site / local QA specimen';
    lead.facts={location:'Medvedgradska ul. 1c, Zagreb',doctor:'Alan Fleck, dr. med. vet.',since:'1996.'};
    lead.sources=[{field:'goldi.services',url,verifiedAt},{field:'goldi.location',url,verifiedAt},{field:'goldi.doctor',url,verifiedAt},{field:'goldi.since',url,verifiedAt}];
    lead.services=[{title:'Preventiva',description:'Preventivna veterinarska skrb.',sourceField:'goldi.services'},{title:'Interna medicina',description:'Internistička obrada ljubimaca.',sourceField:'goldi.services'},{title:'Kardiologija',description:'Kardiološka obrada.',sourceField:'goldi.services'},{title:'Kirurgija i ortopedija',description:'Opća kirurgija i ortopedija.',sourceField:'goldi.services'}];
    lead.verifiedObservations=['Lokalni QA primjer s provjerenim portretom Alana Flecka.'];
    payload.slug=lead.slug;payload.businessName='Goldi';payload.sourceUrl=url;payload.artDirectionReason='Doctor-first: verified high-resolution portrait of Alan Fleck from the official Goldi team page.';payload.outreach={prospectName:'Goldi · local QA only',verifiedObservations:lead.verifiedObservations,proposedServiceAngle:'Lokalna provjera renderera; bez slanja ponude.'};
    c.brand={name:'Goldi',industry:'Veterinarska ambulanta',location:'Zagreb'};c.contact={phone:lead.publicPhone,address:lead.facts.location as string,website:url};c.primaryCta={label:'Nazovite ambulantu',href:`tel:${lead.publicPhone}`};
    c.services=lead.services;c.sources=lead.sources;c.about={title:'Znanje koje susreće pažnju.',body:'Alan Fleck dio je Goldi tima od 2007. godine. Njegova područja rada obuhvaćaju kirurgiju, rentgenologiju i internu medicinu.\n\nAmbulanta Goldi nalazi se u Medvedgradskoj ulici u Zagrebu.'};
    c.proofPoints=[{value:'Od 1996.',label:'Veterinarska ambulanta Goldi',sourceField:'goldi.since'},{value:'Alan Fleck',label:'Doktor veterinarske medicine',sourceField:'goldi.doctor'},{value:'Medvedgradska 1c',label:'Zagreb',sourceField:'goldi.location'}];
    c.v3.hero.origin={provenance:'business-website',sourceUrl:url,verifiedAt,depictsNamedPerson:true,namedPerson:'Alan Fleck, dr. med. vet.'};c.v3.hero.alt='Alan Fleck, veterinar u ambulanti Goldi.';c.v3.support=support;
    c.verifiedObservations=lead.verifiedObservations;
  }
  const used=new Set([...Object.values(fonts),c.v3.hero.desktop.url,c.v3.hero.mobile.url,...(c.v3.support?[c.v3.support.desktop.url,c.v3.support.mobile.url]:[])]);
  c.v3.assetManifest=manifest.filter(a=>used.has(a.url)).map(({url,sha256,kind})=>({url,sha256,kind}));
  // Sources support facts in the prepared package, not public-facing boilerplate.
  const evidence=Object.entries(displayFields(c)).map(([path,value])=>({path,value,kind:'fact' as const,sources:[{field:path,url:direction==='doctor-first'?'https://goldi-vet.hr/nas-tim/':fabela?'https://www.fabela.hr/':bondUrl,verifiedAt}]}));
  for(const ev of evidence){if(['hero.headline','about.title'].includes(ev.path))Object.assign(ev,{kind:'editorial',sources:[]});}
  const pkg=preparedPackageSchema.parse({packageVersion:1,lead,brief:{directionReason:payload.artDirectionReason,intent:'Premium presentation and immediate contact; distinct desktop and mobile composition.',audience:'Vlasnici ambulanti i vlasnici ljubimaca.'},payload:createDemoSchema.parse(payload),assetManifest:c.v3.assetManifest,prompts,evidence});
  await writeFile(resolve(out,`${lead.slug}.json`),JSON.stringify(pkg,null,2)+'\n');
}
console.log(`Prepared packages: ${out}`);
