// Fixed scripted demo. Spoken samples are recorded AI-generated TTS audio,
// cached in a private R2 bucket. The demo is not a recording of an actual GPT-Live call.
const EXAMPLES={
 interview:[
  ["ai","Dobro došli! Ja sam vaš AI trener i danas glumim voditelja intervjua. Zašto ste se prijavili baš za ovu poziciju?"],
  ["user","Zato što imam iskustva s Reactom i volim rješavati probleme."],
  ["ai","Možeš li mi opisati konkretan projekt na kojem si riješio težak problem?"],
  ["user","Pojednostavio sam obrazac narudžbe i smanjio broj koraka s pet na tri."],
  ["ai","Kako si provjerio da je korisnicima zbog promjene bilo lakše dovršiti narudžbu?"]
 ],
 salary:[
  ["ai","Dobar dan. Rekli ste da želite razgovarati o plaći. Što ste imali na umu?"],
  ["user","Želio bih povišicu od 15 posto jer sam preuzeo dva nova projekta."],
  ["ai","Trenutačno nemamo budžet za takvu promjenu. Koji biste rezultat izdvojili?"],
  ["user","Preuzeo sam održavanje i ubrzao isporuku dva tjedna."],
  ["ai","Ako danas ne možemo donijeti odluku, koji plan i rok predlažete?"]
 ],
 difficult:[
  ["ai","Vježbamo važan razgovor. Ja ću glumiti partnera. Što mi želiš reći?"],
  ["user","Osjećam se preopterećeno kad kućanski poslovi ostanu na meni."],
  ["ai","Nije mi bila namjera ostaviti sve tebi. Što bi ti konkretno pomoglo?"],
  ["user","Volio bih da nedjeljom zajedno podijelimo poslove za idući tjedan."],
  ["ai","To mi zvuči izvedivo. Možemo li odmah dogovoriti koje zadatke preuzimamo?"]
 ]
};
const DEMO_AUDIO={
 interview:"/api/demo-audio?mode=interview",
 salary:"/api/demo-audio?mode=salary",
 difficult:"/api/demo-audio?mode=difficult"
};
let current="interview",cursor=0,timer=null,opener=null;
const byId=id=>document.getElementById(id);
const player=byId("demoAudio");
function stopDemo(){
 clearTimeout(timer);timer=null;
 player.pause();
 try{player.currentTime=0;}catch{}
 updatePlayer();
}
function closeDemo(){
 stopDemo();
 byId("demoOverlay").classList.add("hidden");byId("demoOverlay").setAttribute("aria-hidden","true");
 document.body.style.overflow="";opener?.focus?.();
}
function renderLine([who,text]){
 const bubble=document.createElement("div");bubble.className="demo-line "+(who==="ai"?"demo-ai":"demo-user");
 const name=document.createElement("span");name.className="demo-line-who";name.textContent=who==="ai"?"AI TRENER":"KORISNIK";
 const body=document.createElement("p");body.textContent=text;bubble.append(name,body);byId("demoConversation").append(bubble);
 byId("demoConversation").scrollTop=byId("demoConversation").scrollHeight;
}
function runExample(){
 clearTimeout(timer);cursor=0;byId("demoConversation").replaceChildren();const lines=EXAMPLES[current];
 function step(){if(byId("demoOverlay").classList.contains("hidden"))return;if(cursor>=lines.length)return;renderLine(lines[cursor++]);timer=setTimeout(step,1750);}
 step();
}
function pick(mode){
 if(!EXAMPLES[mode])return;
 stopDemo();current=mode;byId("demoAudioNote").textContent="AI-generirani hrvatski glas (TTS), ne snimka stvarnog Live razgovora.";
 document.querySelectorAll("[data-demo-mode]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.demoMode===mode)));
 player.src=DEMO_AUDIO[mode];player.load();runExample();
}
function openDemo(trigger){
 opener=trigger;byId("demoOverlay").classList.remove("hidden");byId("demoOverlay").setAttribute("aria-hidden","false");
 document.body.style.overflow="hidden";pick(current);byId("demoOverlay").querySelector(".modal-close").focus();
}
function formattedSeconds(n){if(!Number.isFinite(n))return"0:00";return Math.floor(n/60)+":"+String(Math.floor(n%60)).padStart(2,"0");}
function updatePlayer(){
 const playing=!player.paused&&!player.ended;const btn=byId("demoSpeak");
 btn.setAttribute("aria-pressed",String(playing));btn.textContent=playing?"Pauziraj glas":"▶ Poslušaj glas";
 const duration=Number.isFinite(player.duration)?player.duration:0;
 byId("demoAudioProgress").value=duration?Math.min(1,player.currentTime/duration):0;
 byId("demoAudioTime").textContent=formattedSeconds(player.currentTime)+(duration?" / "+formattedSeconds(duration):"");
}
async function togglePlayback(){
 const note=byId("demoAudioNote");if(!player.paused){player.pause();updatePlayer();return;}
 if(!player.src){note.textContent="Audio primjer nije dostupan.";return;}
 note.textContent="Uvodno pitanje iz simulacije. Glas je sintetiziran; stvarni trener odgovara uživo.";
 const btn=byId("demoSpeak");btn.disabled=true;btn.textContent="Učitavam glas...";
 try{await player.play();}catch{note.textContent="Reprodukcija trenutačno nije moguća. Tekstualni demo je i dalje dostupan.";}
 finally{btn.disabled=false;updatePlayer();}
}
for(const event of ["play","pause","ended","timeupdate","loadedmetadata"])player.addEventListener(event,updatePlayer);
player.addEventListener("error",()=>{
 byId("demoAudioNote").textContent="Snimljeni glas trenutačno nije dostupan. Tekstualni primjer i dalje radi.";
 updatePlayer();
});
document.addEventListener("click",e=>{
 const open=e.target.closest("[data-demo-open]");if(open){e.preventDefault();openDemo(open);return;}
 if(e.target.closest("[data-demo-close]")){e.preventDefault();closeDemo();return;}
 const mode=e.target.closest("[data-demo-mode]");if(mode){pick(mode.dataset.demoMode);}
});
byId("demoReplay").addEventListener("click",runExample);
byId("demoSpeak").addEventListener("click",togglePlayback);
byId("demoStart").addEventListener("click",()=>{const mode=current;closeDemo();document.querySelector('.quick-mode-list [data-open="'+mode+'"]')?.click();});
document.addEventListener("keydown",e=>{
 const overlay=byId("demoOverlay");if(overlay.classList.contains("hidden"))return;
 if(e.key==="Escape"){closeDemo();return;}if(e.key!=="Tab")return;
 const f=[...overlay.querySelectorAll("button:not(:disabled)")].filter(x=>x.getClientRects().length);
 if(!f.length)return;if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus();}
 else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus();}
});
document.addEventListener("visibilitychange",()=>{if(document.hidden)player.pause();});
