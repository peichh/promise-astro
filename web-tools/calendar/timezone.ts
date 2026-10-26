export function convertTimezone(dob:string,time:string,fromTz:string,toTz:string){
  // Cloudflare Workers รองรับ Intl
  const date=new Date(`${dob}T${time}:00`);
  return {
    original: date.toLocaleString("th-TH",{timeZone:fromTz}),
    converted: date.toLocaleString("th-TH",{timeZone:toTz}),
    offset: date.getTimezoneOffset()
  }
}
