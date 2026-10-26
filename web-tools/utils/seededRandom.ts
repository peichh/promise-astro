export function seededRandom(seed:string){
  let h=2166136261;
  for(let i=0;i<seed.length;i++){h^=seed.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);}
  return ()=>{h+=0x6D2B79F5;let t=Math.imul(h^(h>>>15),1|h);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296;}
}
export function hashBirth(dob:string,time:string,province:string){return `${dob}|${time}|${province}`}
