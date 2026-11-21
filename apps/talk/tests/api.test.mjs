import test from "node:test";
import assert from "node:assert/strict";
import {MODES,safeContext,sameOrigin,authorized,promptFor} from "../functions/_lib.js";
import {onRequestPost as start} from "../functions/api/session.js";
import {onRequestPost as report} from "../functions/api/report.js";
import {onRequestPost as preflight} from "../functions/api/preflight.js";
const url="https://talk.nepar.hr/api/session";
const key="test-only-password";
function req(url,body,origin="https://talk.nepar.hr",code=key){return new Request(url,{method:"POST",headers:{"Content-Type":"application/json","Origin":origin,"X-Preview-Code":code},body:JSON.stringify(body)});}
const good={mode:"interview",scenario:"Prijavljujem se na posao",sdp:"v=0"+("a".repeat(130)),consent:true,ageConfirmed:true};
test("tri dostupna specijalizirana scenarija",()=>{assert.deepEqual(Object.keys(MODES),["interview","salary","difficult"]);});
test("korisnički scenarij se ograničava",()=>{assert.equal(safeContext(" \u0000Pozdrav \n",8),"Pozdrav");assert.equal(safeContext(null),"");});
test("upute simulacije ne mogu biti samo generički chat",()=>{for(const m of Object.keys(MODES)){const p=promptFor(m,"Realna situacija","challenging");assert.ok(p.includes("simulacije"));assert.ok(p.includes("112"));assert.ok(p.includes("Realna situacija"));}});
test("porijeklo mora biti isto",()=>{assert.equal(sameOrigin(req(url,good)),true);assert.equal(sameOrigin(req(url,good,"https://attacker.example")),false);});
test("pristupni kod najmanje 10 znakova",()=>{assert.equal(authorized(req(url,good),{TALK_PREVIEW_CODE:key}),true);assert.equal(authorized(req(url,good),{TALK_PREVIEW_CODE:"short"}),false);});
test("bez API konfiguracije nikad ne kreće Live",async()=>{const r=await start({request:req(url,good),env:{}});assert.equal(r.status,503);});
test("loš kod se odbija prije poziva OpenAI-ju",async()=>{const r=await start({request:req(url,good,"https://talk.nepar.hr","wrong"),env:{OPENAI_API_KEY:"dummy",TALK_PREVIEW_CODE:key}});assert.equal(r.status,401);});
test("maloljetnički zahtjev se odbija",async()=>{const r=await start({request:req(url,{...good,ageConfirmed:false}),env:{OPENAI_API_KEY:"dummy",TALK_PREVIEW_CODE:key}});assert.equal(r.status,403);});
test("neispravan SDP se odbija",async()=>{const r=await start({request:req(url,{...good,sdp:"invalid"}),env:{OPENAI_API_KEY:"dummy",TALK_PREVIEW_CODE:key}});assert.equal(r.status,400);});
test("bez dovoljno prijepisa nema lažne AI analize",async()=>{const r=await report({request:req("https://talk.nepar.hr/api/report",{mode:"salary",transcript:[{role:"user",text:"Bok"}]}),env:{OPENAI_API_KEY:"dummy",TALK_PREVIEW_CODE:key}});assert.equal(r.status,400);});

test("preflight ne traži mikrofon prije uspješne provjere pristupa",async()=>{let noKey=await preflight({request:req("https://talk.nepar.hr/api/preflight",{}),env:{}});assert.equal(noKey.status,503);let denied=await preflight({request:req("https://talk.nepar.hr/api/preflight",{},"https://talk.nepar.hr","wrong"),env:{OPENAI_API_KEY:"dummy",TALK_PREVIEW_CODE:key}});assert.equal(denied.status,401);let ok=await preflight({request:req("https://talk.nepar.hr/api/preflight",{}),env:{OPENAI_API_KEY:"dummy",TALK_PREVIEW_CODE:key}});assert.equal(ok.status,200);});
