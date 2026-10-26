import { seededRandom } from '../utils/seededRandom';
const CARDS=["Rider","Clover","Ship","House","Tree","Clouds","Snake","Coffin","Bouquet","Scythe","Whip","Birds","Child","Fox","Bear","Stars","Stork","Dog","Tower","Garden","Mountain","Crossroad","Mice","Heart","Ring","Book","Letter","Man","Woman","Lily","Sun","Moon","Key","Fish","Anchor","Cross"];
export function drawLenormand(dob:string,time:string,province:string,count=3){
  const rand=seededRandom(`${dob}|${time}|${province}|lenormand`);
  const deck=[...CARDS]; const res=[];
  for(let i=0;i<count;i++){ const idx=Math.floor(rand()*deck.length); res.push({name:deck.splice(idx,1)[0], position:i}); }
  return { system:'lenormand', cards:res }
}
