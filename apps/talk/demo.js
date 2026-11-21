// The demo is a scripted example. It NEVER calls OpenAI or consumes paid minutes.
const EXAMPLES={
 interview:[
 ["ai","Dobro došli! Ja sam vaš AI trener i danas glumim voditelja intervjua. Zašto ste se prijavili baš za ovu poziciju?"],
 ["user","Zato što imam iskustva s Reactom i volim rješavati probleme."],
 ["ai","Odlično, a možeš li mi opisati konkretan projekt na kojem si ti osobno riješio neki težak problem?"],
 ["user","Na zadnjem projektu pojednostavio sam obrazac narudžbe i smanjio broj koraka s pet na tri."],
 ["ai","To je koristan primjer! Kako si provjerio da su korisnici zbog promjene lakše dovršavali narudžbu?"]
 ],
 salary:[
 ["ai","Dobar dan. Rekli ste da želite razgovarati o plaći. Što ste imali na umu?"],
 ["user","Želio bih razgovarati o povišici od 15 posto jer sam preuzeo dva nova projekta."],
 ["ai","Trenutačno nemamo budžet za takvu promjenu. Što biste izdvojili kao svoj najvažniji rezultat?"],
 ["user","U zadnja četiri mjeseca samostalno sam preuzeo održavanje i ubrzao isporuku dva tjedna."],
 ["ai","Razumijem. Ako danas ne možemo donijeti odluku, kakav biste plan i rok za novu procjenu predložili?"]
 ],
 difficult:[
 ["ai","Vježbamo važan razgovor. Ja ću glumiti partnera. Što mi želiš reći?"],
 ["user","Osjećam se preopterećeno kad kućanski poslovi ostanu na meni."],
 ["ai","Nije mi bila namjera ostaviti sve tebi. Ali i ja imam puno obveza. Što bi ti konkretno pomoglo?"],
 ["user","Volio bih da nedjeljom zajedno dogovorimo podjelu poslova za sljedeći tjedan."],
 ["ai","To mi zvuči izvedivo. Možemo li odmah dogovoriti koje bismo zadatke preuzeli?"]
 ]
};
let current="interview",cursor=0,timer=null,opener=null,voicesStarted=false;
const byId=id=>document.getElementById(id);
function cancelTimers(){clearTimeout(timer);timer=null;if("speechSynthesis" in window)window.speechSynthesis.cancel();}
function closeDemo(){cancelTimers();byId("demoOverlay").classList.add("hidden");byId("demoOverlay").setAttribute("aria-hidden","true");document.body.style.overflow="";opener?.focus?.();}
function renderLine([who,text]){const bubble=document.createElement("div");bubble.className="demo-line "+(who==="ai"?"demo-ai":"demo-user");const name=document.createElement("span");name.className="demo-line-who";name.textContent=who==="ai"?"AI TRENER":"KORISNIK";const body=document.createElement("p");body.textContent=text;bubble.append(name,body);byId("demoConversation").append(bubble);byId("demoConversation").scrollTop=byId("demoConversation").scrollHeight;}
function runExample(){cancelTimers();cursor=0;byId("demoConversation").replaceChildren();const lines=EXAMPLES[current];function step(){if(byId("demoOverlay").classList.contains("hidden"))return;if(cursor>=lines.length){byId("demoReplay").disabled=false;return;}renderLine(lines[cursor++]);timer=setTimeout(step,1750);}byId("demoReplay").disabled=false;step();}
function pick(mode){if(!EXAMPLES[mode])return;current=mode;document.querySelectorAll("[data-demo-mode]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.demoMode===mode)));runExample();}
function openDemo(trigger){opener=trigger;byId("demoOverlay").classList.remove("hidden");byId("demoOverlay").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";pick(current);byId("demoOverlay").querySelector(".modal-close").focus();}
function speak(){
 const note=byId("demoAudioNote");if(!("speechSynthesis" in window)){note.textContent="Ovaj preglednik nema ugrađeno čitanje teksta naglas. Tekstualni primjer radi bez zvuka.";return;}
 window.speechSynthesis.cancel();
 const lines=EXAMPLES[current];const voice=window.speechSynthesis.getVoices().find(v=>v.lang?.toLowerCase().startsWith("hr"));
 const utter=new SpeechSynthesisUtterance(lines[2][1]);utter.lang="hr-HR";utter.rate=.94;if(voice)utter.voice=voice;
 utter.onstart=()=>note.textContent="Čuješ ogledni glas preglednika, a ne stvarni glas GPT-Live-1.1.";
 utter.onerror=()=>note.textContent="Čitanje naglas nije uspjelo. Tekstualni demo je i dalje dostupan.";
 window.speechSynthesis.speak(utter);
}
document.addEventListener("click",e=>{
 const open=e.target.closest("[data-demo-open]");if(open){e.preventDefault();openDemo(open);return;}
 if(e.target.closest("[data-demo-close]")){e.preventDefault();closeDemo();return;}
 const mode=e.target.closest("[data-demo-mode]");if(mode){pick(mode.dataset.demoMode);return;}
});
byId("demoReplay").addEventListener("click",runExample);
byId("demoSpeak").addEventListener("click",speak);
byId("demoStart").addEventListener("click",()=>{const mode=current;closeDemo();document.querySelector('.quick-mode-list [data-open="'+mode+'"]')?.click();});
document.addEventListener("keydown",e=>{const overlay=byId("demoOverlay");if(overlay.classList.contains("hidden"))return;if(e.key==="Escape"){closeDemo();return;}if(e.key!=="Tab")return;const f=[...overlay.querySelectorAll("button:not(:disabled)")].filter(x=>x.getClientRects().length);if(!f.length)return;if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus();}else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus();}});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&"speechSynthesis" in window)window.speechSynthesis.cancel();});
