import { calcBaZi, calcWestern, calcZiWei, calcNumerology, calcHumanDesign, drawTarot, drawLenormand, castIChing, calcSynastry } from '../../../web-tools/basic/index';
import bazi from '../../../knowledge-detailed-14/per_system/bazi.json';
import humanDesign from '../../../knowledge-detailed-14/per_system/human_design.json';
import iching from '../../../knowledge-detailed-14/per_system/iching.json';
import lenormand from '../../../knowledge-detailed-14/per_system/lenormand.json';
import numerology from '../../../knowledge-detailed-14/per_system/numerology.json';
import synastry from '../../../knowledge-detailed-14/per_system/synastry.json';
import tarot from '../../../knowledge-detailed-14/per_system/tarot.json';
import western from '../../../knowledge-detailed-14/per_system/western_natal.json';
import ziwei from '../../../knowledge-detailed-14/per_system/ziwei.json';
import vedic from '../../../knowledge-detailed-14/per_system/vedic.json';
import thai from '../../../knowledge-detailed-14/per_system/thai.json';
import thai79 from '../../../knowledge-detailed-14/per_system/thai_7_9.json';
import geneKeys from '../../../knowledge-detailed-14/per_system/gene_keys.json';
import astrocartography from '../../../knowledge-detailed-14/per_system/astrocartography.json';
const knowledge: Record<string, unknown> = { bazi, human_design: humanDesign, iching, lenormand, numerology, synastry, tarot, western_natal: western, ziwei, vedic, thai, thai_7_9: thai79, gene_keys: geneKeys, astrocartography };
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=300'}});
export async function onRequestGet({request,params}: {request:Request;params:{path?:string}}){const system=String(params.path||'').replace(/\\/$/,'');if(!system||system==='index')return json({systems:Object.keys(knowledge),usage:'GET /api/systems/{system}?knowledge=1 or provide birth_date, birth_time, birth_place'});if(!(system in knowledge))return json({error:'Unknown system',systems:Object.keys(knowledge)},404);const url=new URL(request.url);if(url.searchParams.get('knowledge')==='1')return json({system,knowledge:knowledge[system]});const birth_date=url.searchParams.get('birth_date')||'';const birth_time=url.searchParams.get('birth_time')||'12:00';const birth_place=url.searchParams.get('birth_place')||'';if(!birth_date)return json({system,knowledge:knowledge[system],error:'birth_date is required for calculation'},400);try{let result:unknown;switch(system){case'bazi':result=calcBaZi(birth_date,birth_time);break;case'western_natal':result=calcWestern(birth_date,birth_time,birth_place);break;case'ziwei':result=calcZiWei(birth_date,birth_time);break;case'numerology':result=calcNumerology(birth_date);break;case'human_design':result=calcHumanDesign(birth_date,birth_time,birth_place);break;case'tarot':result=drawTarot();break;case'lenormand':result=drawLenormand();break;case'iching':result=castIChing();break;case'synastry':result={error:'Requires two birth profiles'};break;default:result={note:'Knowledge available; this system calculator is not exported by the current web-tools package.'}}return json({system,result,knowledge:knowledge[system]})}catch(e){return json({system,error:e instanceof Error?e.message:'Calculation failed'},400)}}