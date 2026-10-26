import { Solar } from 'lunar-javascript';
export function calcBaZi(dob:string,time:string){
  const [y,m,d]=dob.split('-').map(Number);
  const [hh,mm]=time.split(':').map(Number);
  const solar=Solar.fromYmdHms(y,m,d,hh,mm,0);
  const lunar=solar.getLunar();
  const ec=lunar.getEightChar();
  const dm=ec.getDay().charAt(0);
  const map:any={甲:'ไม้หยาง',乙:'ไม้หยิน',丙:'ไฟหยาง',丁:'ไฟหยิน',戊:'ดินหยาง',己:'ดินหยิน',庚:'ทองหยาง',辛:'ทองหยิน',壬:'น้ำหยาง',癸:'น้ำหยิน'};
  return { system:'bazi', year:ec.getYear(), month:ec.getMonth(), day:ec.getDay(), hour:ec.getTime(), dayMaster:dm, dayMasterTh:map[dm], element:map[dm]?.replace(/หยาง|หยิน/,'') }
}
