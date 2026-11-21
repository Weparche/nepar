// TEMPORARY internal-only voice-demo render endpoint.
// Remove from the repository immediately after embedding the generated static MP3 files.
import {sameOrigin,authorized,errorResponse} from "../_lib.js";
const TEXT={
 interview:"Dobro došli! Ja sam vaš AI trener i danas glumim voditelja intervjua. Zašto ste se prijavili baš za ovu poziciju?",
 salary:"Dobar dan. Rekli ste da želite razgovarati o plaći. Što ste imali na umu?",
 difficult:"Vježbamo važan razgovor. Ja ću glumiti partnera. Što mi želiš reći?"
};
export async function onRequestPost({request,env}){
 if(!sameOrigin(request)||!authorized(request,env))return errorResponse("Pristup odbijen.",403);
 if(!env.OPENAI_API_KEY)return errorResponse("Glas nije konfiguriran.",503);
 let data;try{data=await request.json();}catch{return errorResponse("Neispravan zahtjev.");}
 const mode=typeof data?.mode==="string"?data.mode:"";
 if(!Object.hasOwn(TEXT,mode))return errorResponse("Nepoznat primjer.");
 const out=await fetch("https://api.openai.com/v1/audio/speech",{
  method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},
  body:JSON.stringify({model:"gpt-4o-mini-tts",voice:"marin",input:TEXT[mode],response_format:"mp3",instructions:"Govori hrvatskim jezikom jasno i prirodno, uz topao profesionalni ton razgovora, sa smislom za pitanja. Ne naglašavaj neprirodno, ostavi kratku pauzu prije pitanja.",speed:1}),
  signal:AbortSignal.timeout(25000)
 });
 if(!out.ok)return errorResponse("Generiranje audio primjera nije uspjelo ("+out.status+").",502);
 const audio=await out.arrayBuffer();
 if(audio.byteLength<500||audio.byteLength>750000)return errorResponse("Neispravna veličina zvučnog zapisa.",502);
 return new Response(audio,{status:200,headers:{"Content-Type":"audio/mpeg","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
}
export function onRequestGet(){return errorResponse("Metoda nije dostupna.",405);}
