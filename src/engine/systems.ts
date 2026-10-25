export type SystemKind = 'random' | 'birth-data';
export interface DivinationSystem { id:string; name:string; nativeName?:string; kind:SystemKind; requirement:string; }
export const DIVINATION_SYSTEMS:DivinationSystem[]=[
{id:'tarot-rider-waite',name:'Tarot Rider–Waite',kind:'random',requirement:'ไม่ต้องใช้วันเกิด · สำรับ 78 ใบ'},
{id:'lenormand',name:'Lenormand',kind:'random',requirement:'ไม่ต้องใช้วันเกิด · สำรับ 36 ใบ'},
{id:'iching',name:'I Ching',nativeName:'อี้จิง · 64 กว้า',kind:'random',requirement:'ไม่ต้องใช้วันเกิด · 64 hexagrams'},
{id:'western',name:'Western Tropical Natal',kind:'birth-data',requirement:'ข้อมูลวัน เวลา และสถานที่เกิด'},
{id:'vedic',name:'Vedic Astrology',nativeName:'โหราศาสตร์ภารตะ',kind:'birth-data',requirement:'ข้อมูลวัน เวลา และสถานที่เกิด'},
{id:'thai',name:'Thai Astrology',nativeName:'สุริยยาตร์ · 12 ภพ · เกษตร · อุจจ์',kind:'birth-data',requirement:'ข้อมูลวัน เวลา และสถานที่เกิด'},
{id:'เลข-7-ตัว-9-ฐาน',name:'เลข 7 ตัว 9 ฐาน',kind:'birth-data',requirement:'ข้อมูลวันเกิดและกติกาปฏิทินที่ระบุชัดเจน'},
{id:'bazi',name:'BaZi 4 Pillars',nativeName:'ปาจื่อ 4 เสา',kind:'birth-data',requirement:'ข้อมูลวัน เวลา และสถานที่เกิด'},
{id:'ziwei',name:'Zi Wei Dou Shu',nativeName:'จื่อเวยโต่วซู่ · 12 วัง',kind:'birth-data',requirement:'ข้อมูลวัน เวลา และสถานที่เกิด'},
{id:'numerology',name:'Numerology',nativeName:'เลขศาสตร์',kind:'birth-data',requirement:'ข้อมูลวันเกิด; ชื่อใช้เมื่อระบบนั้นกำหนด'},
{id:'human-design',name:'Human Design',nativeName:'ฮิวแมนดีไซน์',kind:'birth-data',requirement:'ข้อมูลวัน เวลา และสถานที่เกิด'},
{id:'gene-keys',name:'Gene Keys',nativeName:'จีนคีย์ส · 64 รหัสพันธุกรรม',kind:'birth-data',requirement:'ข้อมูลวัน เวลา และสถานที่เกิด'},
{id:'synastry',name:'Synastry',nativeName:'ดวงสมพงษ์คู่แมตช์',kind:'birth-data',requirement:'ข้อมูลเกิดของบุคคลทั้งสองและความยินยอม'},
{id:'astrocartography',name:'Astrocartography',nativeName:'แอสโตรคาร์โตกราฟี',kind:'birth-data',requirement:'ข้อมูลวัน เวลา และสถานที่เกิดที่แม่นยำ'}
];
