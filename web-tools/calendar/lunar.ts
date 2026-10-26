import { Solar } from 'lunar-javascript';
// แปลงสุริยะเป็นจันทรคติจีน-ไทย
export function toLunar(dob:string,time:string){
  const [y,m,d]=dob.split('-').map(Number);
  const [hh,mm]=time.split(':').map(Number);
  const solar=Solar.fromYmdHms(y,m,d,hh,mm,0);
  const lunar=solar.getLunar();
  return {
    lunarYear: lunar.getYear(),
    lunarMonth: lunar.getMonth(),
    lunarDay: lunar.getDay(),
    chineseYear: lunar.getYearInChinese(),
    zodiac: lunar.getYearShengXiao(),
    eightChar: lunar.getEightChar().toString()
  }
}
