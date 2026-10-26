// แปลง ค.ศ. เป็น พ.ศ. และวันไทย
export function toThaiDate(dob:string){
  const d=new Date(dob);
  return {
    buddhistYear: d.getFullYear()+543,
    thaiMonths: ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"],
    day: d.getDate(),
    weekday: ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัส","ศุกร์","เสาร์"][d.getDay()]
  }
}
export function toJulianDay(dob:string,time:string){
  const date=new Date(`${dob}T${time}:00`);
  return date.getTime()/86400000 + 2440587.5;
}
