import {MODES,safeContext,sameOrigin,authorized,errorResponse,jsonResponse,promptFor} from "../_lib.js";
export async function onRequestPost({request,env}){
 if(!sameOrigin(request))return errorResponse("Zahtjev nije s ove web-stranice.",403);
 if(!env.OPENAI_API_KEY||!env.TALK_PREVIEW_CODE)return errorResponse("Glasovni preview još nije konfiguriran.",503);
 if(!authorized(request,env))return errorResponse("Pristupni kod nije ispravan.",401);
 if(!request.headers.get("Content-Type")?.includes("application/json"))return errorResponse("Neispravan format zahtjeva.",415);
 if(Number(request.headers.get("Content-Length")||0)>160000)return errorResponse("Zahtjev je prevelik.",413);
 let data;try{data=await request.json();}catch{return errorResponse("Neispravan JSON.");}
 if(data.ageConfirmed!==true||data.consent!==true)return errorResponse("Potrebna je potvrda punoljetnosti i privole.",403);
 if(!Object.hasOwn(MODES,data.mode))return errorResponse("Nepoznat trening.");
 const scenario=safeContext(data.scenario);if(scenario.length<5)return errorResponse("Opiši situaciju s nekoliko riječi.");
 if(typeof data.sdp!=="string"||data.sdp.length<100||data.sdp.length>128000||!data.sdp.includes("v=0"))return errorResponse("Neispravan WebRTC zahtjev.");
 const payload={session:{model:"gpt-live-1.1",instructions:promptFor(data.mode,scenario,data.difficulty),input:[{type:"message",role:"developer",content:[{type:"input_text",text:"Na početku sesije pozdravi na hrvatskom, objasni da je ovo simulacija i postavi prvo kratko pitanje. Zatim stani i slušaj."}]}],store:false,audio:{output:{voice:"marin"}},delegation:{type:"client"}},transport:{type:"webrtc",sdp:data.sdp}};
 try{
  const res=await fetch("https://api.openai.com/v1/live/sessions",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify(payload),signal:AbortSignal.timeout(25000)});
  const result=await res.json().catch(()=>null);
  if(!res.ok)return errorResponse("AI servis ne može pokrenuti sesiju. Provjeri API pristup i ograničenja.",502);
  if(typeof result?.transport?.sdp!=="string")return errorResponse("AI servis nije vratio WebRTC odgovor.",502);
  return jsonResponse({sdp:result.transport.sdp,sessionId:result.session?.id||null});
 }catch{return errorResponse("Povezivanje s AI servisom nije uspjelo.",502);}
}
export function onRequestGet(){return errorResponse("Metoda nije dostupna.",405);}
