import {sameOrigin,authorized,errorResponse,jsonResponse} from "../_lib.js";
export async function onRequestPost({request,env}){
 if(!sameOrigin(request))return errorResponse("Zahtjev nije s ove web-stranice.",403);
 if(!env.OPENAI_API_KEY||!env.TALK_PREVIEW_CODE)return errorResponse("Glasovni preview još nije aktiviran. Možeš pogledati ogledni izvještaj.",503);
 if(!authorized(request,env))return errorResponse("Pristupni kod nije ispravan.",401);
 return jsonResponse({ready:true});
}
export function onRequestGet(){return errorResponse("Metoda nije dostupna.",405);}
