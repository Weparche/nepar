// Static, fixed-script audio previews; generated once and persisted in private R2.
// No user text is accepted and OpenAI API credentials remain server-side.
const SCRIPTS = {
 interview:"Dobro došli! Ja sam vaš AI trener i danas glumim voditelja intervjua. Zašto ste se prijavili baš za ovu poziciju?",
 salary:"Dobar dan. Rekli ste da želite razgovarati o plaći. Što ste imali na umu?",
 difficult:"Vježbamo važan razgovor. Ja ću glumiti partnera. Što mi želiš reći?"
};
const HEADERS={
 "Content-Type":"audio/mpeg",
 "Cache-Control":"public, max-age=604800, immutable",
 "X-Content-Type-Options":"nosniff",
 "Cross-Origin-Resource-Policy":"same-origin"
};
export async function onRequestGet({request,env}){
 const url=new URL(request.url);const mode=url.searchParams.get("mode")||"";
 if(!Object.hasOwn(SCRIPTS,mode))return new Response("Nepoznat primjer.",{status:400,headers:{"Cache-Control":"no-store"}});
 const site=request.headers.get("Sec-Fetch-Site");
 if(site&&site!=="same-origin"&&site!=="none")return new Response("Pristup odbijen.",{status:403});
 if(!env.TALK_DEMO_AUDIO)return new Response("Audio spremište nije konfigurirano.",{status:503});
 const path="v1/"+mode+".mp3";
 try{
  const existing=await env.TALK_DEMO_AUDIO.get(path);
  if(existing){
   return new Response(existing.body,{status:200,headers:{...HEADERS,"Content-Length":String(existing.size),"X-Preview-Cache":"R2-HIT"}});
  }
  if(!env.OPENAI_API_KEY)return new Response("AI servis nije konfiguriran.",{status:503});
  const result=await fetch("https://api.openai.com/v1/audio/speech",{
   method:"POST",
   headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},
   body:JSON.stringify({model:"gpt-4o-mini-tts",voice:"marin",input:SCRIPTS[mode],response_format:"mp3",instructions:"Govori hrvatskim jezikom jasno, prirodno, razgovorno i profesionalno. Izgovori tekst kao uvodno pitanje tijekom razgovora za vježbu, bez dodatnih rečenica.",speed:1}),
   signal:AbortSignal.timeout(25000)
  });
  if(!result.ok)return new Response("Audio primjer trenutačno nije dostupan.",{status:502,headers:{"Cache-Control":"no-store"}});
  const audio=await result.arrayBuffer();
  if(audio.byteLength<500||audio.byteLength>900000)return new Response("Neispravan audio zapis.",{status:502});
  await env.TALK_DEMO_AUDIO.put(path,audio,{httpMetadata:{contentType:"audio/mpeg"},customMetadata:{source:"openai-tts",voice:"marin",demo:"true"}});
  return new Response(audio,{status:200,headers:{...HEADERS,"Content-Length":String(audio.byteLength),"X-Preview-Cache":"GENERATED"}});
 }catch{
  return new Response("Audio primjer trenutačno nije dostupan.",{status:502,headers:{"Cache-Control":"no-store"}});
 }
}
export function onRequestPost(){return new Response("Metoda nije dostupna.",{status:405});}
