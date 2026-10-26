import { seededRandom } from '../utils/seededRandom';
export function castIChing(dob:string,time:string,province:string){
  const rand=seededRandom(`${dob}|${time}|${province}|iching`);
  let binary=""; let changing=[];
  for(let i=0;i<6;i++){ const v=Math.floor(rand()*4)+6; binary=(v%2)+binary; if(v===6||v===9) changing.push(i); }
  const hexNum=parseInt(binary,2)+1;
  return { system:'iching', hexagram:hexNum, binary, changing_lines:changing, question_seed:`${dob}|${time}` }
}
