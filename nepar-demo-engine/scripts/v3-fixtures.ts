import type { DemoContent } from '../src/schema';
export function edgeFixture(original:DemoContent, name:string|null):DemoContent {
  const c=structuredClone(original);
  switch(name){
    case 'long':c.brand.name='Veterinarska ambulanta za male životinje i specijalističku dijagnostiku';c.hero.headline='Pažljiva veterinarska skrb za vaše male i velike prijatelje.';break;
    case 'one':c.services=c.services.slice(0,1);break;
    case 'eight':c.services=Array.from({length:8},(_,i)=>({...c.services[i%c.services.length],title:`Usluga ${i+1} — ${c.services[i%c.services.length].title}`}));break;
    case 'email':c.contact={email:'qa@example.com'};delete c.brand.location;break;
    case 'address':c.contact={address:'Testna lokacija, Zagreb'};break;
    case 'none':c.contact={};delete c.brand.location;c.proofPoints=[];break;
    case 'no-support':if(c.v3)delete c.v3.support;c.about={title:'O ambulanti',body:''};break;
  }
  return c;
}
