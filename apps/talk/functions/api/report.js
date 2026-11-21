import {MODES,safeContext,sameOrigin,authorized,errorResponse,jsonResponse} from "../_lib.js";
function parseOutput(data){
 const text=(data?.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("\n").trim();
 try{return JSON.parse(text);}catch{return null;}
}
export async function onRequestPost({request,env}){
 if(!sameOrigin(request))return errorResponse("Zahtjev nije s ove web-stranice.",403);
 if(!env.OPENAI_API_KEY||!env.TALK_PREVIEW_CODE)return errorResponse("Analiza još nije konfigurirana.",503);
 if(!authorized(request,env))return errorResponse("Pristupni kod nije ispravan.",401);
 if(!request.headers.get("Content-Type")?.includes("application/json"))return errorResponse("Neispravan format zahtjeva.",415);
 if(Number(request.headers.get("Content-Length")||0)>45000)return errorResponse("Prijepis je predug.",413);
 let body;try{body=await request.json();}catch{return errorResponse("Neispravan JSON.");}
 if(!Object.hasOwn(MODES,body.mode))return errorResponse("Nepoznat trening.");
 if(!Array.isArray(body.transcript)||body.transcript.length<1||body.transcript.length>80)return errorResponse("Nema valjanog prijepisa.");
 const transcript=body.transcript.map(x=>({role:x.role==="ai"?"AI":"Korisnik",text:safeContext(x.text,1200)})).filter(x=>x.text).slice(0,80);
 if(transcript.map(x=>x.text).join("").length<40)return errorResponse("Nema dovoljno govora za analizu.");
 const input={scenario:safeContext(body.scenario),mode:body.mode,transcript};
 const instructions="Ti si analitičar KOMUNIKACIJSKIH vještina za odrasle. Izradi korisnu, empatičnu povratnu informaciju isključivo na osnovi vidljivog prijepisa, koji može biti pogrešan. Ne izmišljaj rečenice koje nisu izgovorene. Ne zaključuj o mentalnom zdravlju, osobnosti ili inteligenciji. Ocjene su subjektivne vježbovne procjene, ne objektivna mjera. Vrati ISKLJUČIVO valjani JSON objekt bez markdowna s poljima headline:string, summary:string, scores:array od 3 objekta {label:string,score:integer 1-10}, strengths:array 2-3 kratke rečenice, improvements:array 2-3 kratke rečenice, rewrite:string primjer bolje formulacije, nextStep:string jedan zadatak.";
 try{
  const res=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-5.6-luna",instructions,input:JSON.stringify(input),max_output_tokens:1050,store:false}),signal:AbortSignal.timeout(25000)});
  if(!res.ok)return errorResponse("AI analiza trenutačno nije dostupna.",502);
  const raw=parseOutput(await res.json());
  if(!raw||typeof raw.headline!=="string"||!Array.isArray(raw.strengths)||!Array.isArray(raw.improvements))return errorResponse("AI analiza nije vratila očekivani format.",502);
  const report={headline:safeContext(raw.headline,140),summary:safeContext(raw.summary,400),scores:(raw.scores||[]).slice(0,4).map(s=>({label:safeContext(s.label,40),score:Math.max(1,Math.min(10,Math.round(Number(s.score)||5)))})),strengths:raw.strengths.slice(0,4).map(s=>safeContext(s,250)),improvements:raw.improvements.slice(0,4).map(s=>safeContext(s,250)),rewrite:safeContext(raw.rewrite,500),nextStep:safeContext(raw.nextStep,350)};
  return jsonResponse({report});
 }catch{return errorResponse("Analiza nije dovršena. Pokušaj ponovno.",502);}
}
export function onRequestGet(){return errorResponse("Metoda nije dostupna.",405);}
