import { calcWestern } from './western';
export function calcSynastry(a:{dob:string,time:string,province:string}, b:{dob:string,time:string,province:string}){
  const chartA=calcWestern(a.dob,a.time,a.province);
  const chartB=calcWestern(b.dob,b.time,b.province);
  const diff=Math.abs(chartA.sun_long-chartB.sun_long);
  const score=100-Math.min(diff,360-diff)/3.6;
  return { system:'synastry', compatibility:Math.round(score), sun_diff:diff, chartA, chartB }
}
