import {jsonResponse} from "../_lib.js";
export function onRequestGet({env}){return jsonResponse({service:"NEPAR Talk",model:"gpt-live-1.1",preview:true,voiceReady:!!(env.OPENAI_API_KEY&&env.TALK_PREVIEW_CODE),paymentsEnabled:false,adultsOnly:true});}
