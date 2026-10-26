import { seededRandom } from '../utils/seededRandom';
const MAJOR=["The Fool","The Magician","High Priestess","Empress","Emperor","Hierophant","Lovers","Chariot","Strength","Hermit","Wheel","Justice","Hanged","Death","Temperance","Devil","Tower","Star","Moon","Sun","Judgement","World"];
export function drawTarot(dob:string,time:string,province:string,count=3){
  const rand=seededRandom(`${dob}|${time}|${province}|tarot`);
  const deck=[...MAJOR]; // ย่อเหลือ Major ก่อน 78 ใบเต็มค่อยเพิ่ม Minor
  const result=[];
  for(let i=0;i<count;i++){ const idx=Math.floor(rand()*deck.length); result.push({name:deck.splice(idx,1)[0], reversed:rand()>0.7, position:i===0?'อดีต':i===1?'ปัจจุบัน':'อนาคต'}); }
  return { system:'tarot', cards:result, seed:`${dob}|${time}` }
}
