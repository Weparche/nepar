import React from "react";
import {createRoot} from "react-dom/client";
import {motion,useReducedMotion} from "framer-motion";
import {ArrowRight,Check,ChevronDown,HeartPulse,MapPin,MessageCircle,Microscope,PawPrint,Phone,ShieldCheck,Stethoscope,Syringe} from "lucide-react";

const h=React.createElement;
const WA="https://wa.me/385994818128?text=Pozdrav%20Fabela%2C%20%C5%BEelio%2F%C5%BEeljela%20bih%20dogovoriti%20termin.";
const PHONE="tel:+38513095340";
const ease=[.23,1,.32,1];

const serviceRows=[
  ["02","Preventiva i cijepljenje","Preventivni pregledi, cijepljenje protiv zaraznih bolesti i bjesnoće te savjeti prilagođeni dobi i načinu života ljubimca."],
  ["03","Kirurgija","Abdominalni, ortopedski i drugi kirurški zahvati uz individualnu procjenu i praćenje pacijenta."],
  ["04","Kardiologija","EKG i ultrazvuk srca za detaljniju procjenu kardiološkog stanja."],
  ["05","Dermatologija i oftalmologija","Specijalistički pregledi i terapije kože, dlake i očiju."],
  ["06","Stomatologija","Oralni pregledi, čišćenje zubnog kamenca, vađenje zubi i drugi stomatološki zahvati."]
];

const faqs=[
  ["Gdje se nalazi Fabela?","Veterinarska ambulanta Fabela nalazi se u Tratinskoj 53/I u Zagrebu."],
  ["Koje dijagnostičke usluge su dostupne?","Fabela na službenoj stranici navodi UZV i RTG, EKG te laboratorijsku, virusološku i parazitološku dijagnostiku."],
  ["Postoji li dežurni kontakt?","Na službenoj stranici naveden je dežurni kontakt 00–24 na broju 01 3095 340."],
  ["Kako dogovoriti termin?","Za ovaj koncept prvi korak je jednostavan: pošaljite WhatsApp poruku ili nazovite ambulantu. Puni booking sustav može se dodati kasnije."]
];

function Fade({children,className="",delay=0}){const r=useReducedMotion();return h(motion.div,{className,initial:r?false:{opacity:0,y:22},whileInView:r?undefined:{opacity:1,y:0},viewport:{once:true,amount:.16},transition:{duration:.62,delay,ease}},children)}
function Btn({children,href,ghost=false}){return h(motion.a,{href,target:href.startsWith("http")?"_blank":undefined,rel:href.startsWith("http")?"noreferrer":undefined,className:`btn ${ghost?"ghost":"primary"}`,whileHover:{y:-2},whileTap:{scale:.985}},children)}

function Header(){return h(React.Fragment,null,
  h("div",{className:"demo"},"Koncept novog weba · Nepar Solutions demo · podaci se potvrđuju prije objave"),
  h("header",{className:"header"},h("div",{className:"shell headin"},
    h("a",{className:"brand",href:"#top"},h("span",{className:"brandMark"},h(PawPrint,{size:21})),h("span",null,h("span",{className:"brandName"},"Fabela"),h("small",{className:"brandSub"},"Veterinarska ambulanta"))),
    h("nav",{className:"nav"},h("a",{href:"#usluge"},"Usluge"),h("a",{href:"#iskustvo"},"O nama"),h("a",{href:"#kontakt"},"Kontakt")),
    h(Btn,{href:WA},h(MessageCircle,{size:16}),"Dogovor termina")
  ))
)}

function Hero(){const r=useReducedMotion();return h("section",{className:"hero",id:"top"},
  h("div",{className:"shell heroInner"},
    h(motion.div,{className:"heroCopy",initial:r?false:{opacity:0,y:24},animate:r?undefined:{opacity:1,y:0},transition:{duration:.72,ease}},
      h("div",{className:"eyebrow"},h(HeartPulse,{size:15}),"Veterinarska ambulanta za male životinje · Zagreb"),
      h("h1",null,"Stručna skrb. Mirniji vlasnici. Zdraviji ljubimci."),
      h("p",{className:"heroLead"},"Više od 15 godina Fabela spaja iskustvo, suvremenu dijagnostiku i osoban pristup svakom pacijentu."),
      h("div",{className:"heroActions"},h(Btn,{href:WA},h(MessageCircle,{size:17}),"Pošaljite WhatsApp"),h(Btn,{href:PHONE,ghost:true},h(Phone,{size:17}),"01 3095 340")),
      h("p",{className:"microcopy"},"Za planirani pregled termin se dogovara direktno s ambulantom.")
    )
  ),
  h("div",{className:"heroSignal"},h("div",{className:"shell signalGrid"},
    h("div",null,h("strong",null,"15+ godina"),h("span",null,"iskustva u skrbi za kućne ljubimce")),
    h("div",null,h("strong",null,"00–24"),h("span",null,"dežurni telefonski kontakt")),
    h("div",null,h("strong",null,"UZV · RTG · EKG"),h("span",null,"suvremena dijagnostika")),
    h("div",null,h("strong",null,"Tratinska 53/I"),h("span",null,"Zagreb"))
  ))
)}

function Services(){return h("section",{className:"section servicesSection",id:"usluge"},h("div",{className:"shell"},
  h(Fade,{className:"sectionIntro"},h("div",null,h("span",{className:"kicker"},"Stručne usluge"),h("h2",null,"Od preventive do specijalističke dijagnostike.")),h("p",null,"Usluge su organizirane tako da vlasnik brzo pronađe odgovor, bez pretraživanja kroz desetke jednakih kartica.")),
  h("div",{className:"servicesEditorial"},
    h(Fade,{className:"serviceFeature"},h("div",{className:"serviceNo"},"01"),h("div",{className:"serviceIcon"},h(Microscope,{size:25})),h("h3",null,"Dijagnostika koja vodi do jasnije odluke."),h("p",null,"UZV i RTG, laboratorijske pretrage krvi i mokraće te virusološka i parazitološka dijagnostika omogućuju detaljniju obradu pacijenta."),h("a",{href:"#kontakt",className:"textLink"},"Dogovorite pregled",h(ArrowRight,{size:15}))),
    h("div",{className:"serviceList"},...serviceRows.map(([n,title,text],i)=>h(Fade,{className:"serviceRow",delay:i*.035,key:title},h("span",{className:"rowNo"},n),h("div",null,h("h3",null,title),h("p",null,text)),h(ArrowRight,{size:18,className:"rowArrow"})))
  )
))}

function CareJourney(){return h("section",{className:"section careSection"},h("div",{className:"shell"},
  h(Fade,{className:"sectionIntro compact"},h("div",null,h("span",{className:"kicker"},"Jednostavan put do pregleda"),h("h2",null,"Bez nepotrebnog trenja.")),h("p",null,"Najbolji zdravstveni webovi vode korisnika kroz nekoliko jasnih koraka. Ovdje prvi korak ostaje jednostavan i poznat.")),
  h("div",{className:"careSteps"},
    h(Fade,{className:"careStep"},h("span",null,"01"),h(MessageCircle,{size:22}),h("h3",null,"Pošaljite poruku ili nazovite"),h("p",null,"Opišite razlog dolaska i javite koji termin vam odgovara.")),
    h(Fade,{className:"careStep",delay:.05},h("span",null,"02"),h(Stethoscope,{size:22}),h("h3",null,"Dogovorite pregled"),h("p",null,"Ambulanta potvrđuje termin i po potrebi daje uputu prije dolaska.")),
    h(Fade,{className:"careStep",delay:.1},h("span",null,"03"),h(ShieldCheck,{size:22}),h("h3",null,"Pregled i plan skrbi"),h("p",null,"Nakon pregleda slijedi dijagnostika, terapija ili plan daljnjih koraka prema potrebi pacijenta."))
  )
))}

function Expertise(){return h("section",{className:"section expertise",id:"iskustvo"},h("div",{className:"shell expertiseGrid"},
  h(Fade,{className:"expertiseStatement"},h("span",{className:"kicker light"},"Fabela"),h("h2",null,"Suvremena oprema. Osoban pristup."),h("p",null,"Ambulantu vodi Alan Jurca, dr. vet. med., a Fabela na svojoj službenoj stranici ističe suradnju sa stručnjacima Veterinarskog fakulteta, ambulantama, institutima i specijaliziranim laboratorijima."),h("div",{className:"expertQuote"},"Povjerenje se gradi jasnoćom, stručnošću i osjećajem da je ljubimac u dobrim rukama.")),
  h(Fade,{className:"expertiseFacts",delay:.08},
    h("div",{className:"fact"},h(Check,{size:19}),h("div",null,h("strong",null,"Preventivna i specijalistička skrb"),h("span",null,"Od cijepljenja do kardiologije, kirurgije i dermatologije."))),
    h("div",{className:"fact"},h(Check,{size:19}),h("div",null,h("strong",null,"Dijagnostička oprema u ambulanti"),h("span",null,"UZV, RTG, EKG i laboratorijska obrada."))),
    h("div",{className:"fact"},h(Check,{size:19}),h("div",null,h("strong",null,"Savjeti za svakodnevnu skrb"),h("span",null,"Prehrana, držanje, njega i uzgoj pasa, mačaka i drugih kućnih ljubimaca."))),
    h("div",{className:"fact"},h(MapPin,{size:19}),h("div",null,h("strong",null,"Tratinska 53/I, Zagreb"),h("span",null,"Kontakt i lokacija uvijek su jedan klik udaljeni.")))
  )
))}

function FAQ(){return h("section",{className:"section faqSection"},h("div",{className:"shell faqGrid"},
  h(Fade,null,h("span",{className:"kicker"},"Česta pitanja"),h("h2",null,"Odgovori prije prvog poziva."),h("p",{className:"faqLead"},"Jasan FAQ pomaže vlasnicima, ali i Googleu i AI tražilicama bolje razumjeti usluge i lokaciju ambulante.")),
  h(Fade,{className:"faqList",delay:.08},...faqs.map(([q,a],i)=>h("details",{key:q,open:i===0},h("summary",null,q,h(ChevronDown,{size:18})),h("p",null,a))))
))}

function Contact(){return h("section",{className:"section contactSection",id:"kontakt"},h("div",{className:"shell"},h(Fade,{className:"contactPanel"},
  h("div",null,h("span",{className:"kicker light"},"Dogovor termina"),h("h2",null,"Treba li vaš ljubimac pregled?"),h("p",null,"Za početak je dovoljan direktan kontakt. WhatsApp ili poziv danas; puni booking i podsjetnici mogu doći kasnije ako ih ambulanta želi.")),
  h("div",{className:"contactActions"},h(Btn,{href:WA},h(MessageCircle,{size:17}),"WhatsApp"),h(Btn,{href:PHONE,ghost:true},h(Phone,{size:17}),"01 3095 340"))
)))}

function App(){return h(React.Fragment,null,
  h(Header),h("main",null,h(Hero),h(Services),h(CareJourney),h(Expertise),h(FAQ),h(Contact)),
  h("footer",null,h("div",{className:"shell footerInner"},h("span",null,"Fabela · Veterinarska ambulanta za male životinje · Tratinska 53/I, Zagreb"),h("span",null,"Koncept dizajna · Nepar Solutions"))),
  h("div",{className:"mobileCta"},h(Btn,{href:WA},h(MessageCircle,{size:17}),"Dogovor termina"))
)}

createRoot(document.getElementById("root")).render(h(App));