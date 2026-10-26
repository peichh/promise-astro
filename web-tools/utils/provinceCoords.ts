export const THAI_PROVINCES: Record<string,{lat:number,lng:number,tz:string}> = {
"กรุงเทพ": {lat:13.7563,lng:100.5018,tz:"Asia/Bangkok"},
"เชียงใหม่": {lat:18.7883,lng:98.9853,tz:"Asia/Bangkok"},
"ภูเก็ต": {lat:7.8804,lng:98.3923,tz:"Asia/Bangkok"},
"ชลบุรี": {lat:13.3611,lng:100.9847,tz:"Asia/Bangkok"},
"ขอนแก่น": {lat:16.4322,lng:102.8236,tz:"Asia/Bangkok"},
"นครราชสีมา": {lat:14.9799,lng:102.0977,tz:"Asia/Bangkok"},
"อุบลราชธานี": {lat:15.2287,lng:104.8564,tz:"Asia/Bangkok"},
"สงขลา": {lat:7.1985,lng:100.5951,tz:"Asia/Bangkok"},
}
export function getCoords(province:string){return THAI_PROVINCES[province]||THAI_PROVINCES["กรุงเทพ"]}
