import { calcBaZi } from './bazi';
export function calcZiWei(dob:string,time:string,gender:string){
  const bazi=calcBaZi(dob,time);
  const lifePalace=(new Date(dob).getMonth()+parseInt(time.split(':')[0]))%12;
  const palaces=["命宫","兄弟","夫妻","子女","财帛","疾厄","迁移","奴仆","官禄","田宅","福德","父母"];
  return { system:'ziwei', bazi_ref:bazi, lifePalace, lifePalaceName:palaces[lifePalace], gender, majorStars:14, minorStars:100 }
}
