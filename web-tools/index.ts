// Astro Tools - Master Export รันบน Cloudflare Workers ได้
export * as Basic from './basic';
export * as Calendar from './calendar/thaiDate';
export * as Lunar from './calendar/lunar';
export * as Location from './location/geocode';
export * as Utils from './utils/seededRandom';

// ตัวอย่างใช้ทั้ง 3 กล่องตามหน้าเว็บพีช
// กล่อง 1 เครื่องคำนวณพื้นฐาน
// import { Basic } from './web-tools'
// Basic.calcWestern(dob,time,province)

// กล่อง 2 ปฏิทินและเวลา
// import { toThaiDate, toJulianDay } from './web-tools/calendar/thaiDate'

// กล่อง 3 พิกัดสถานที่
// import { geocodeProvince } from './web-tools/location/geocode'
