export function calcNumerology(dob:string){
  const nums=dob.replace(/-/g,'').split('').map(Number);
  let lp=nums.reduce((a,b)=>a+b,0);
  while(lp>9 && ![11,22,33].includes(lp)){ lp=String(lp).split('').map(Number).reduce((a,b)=>a+b,0); }
  const day=new Date(dob).getDate();
  return { system:'numerology', lifePath:lp, birthDay:day, expression: (lp+day)%9||9 }
}
