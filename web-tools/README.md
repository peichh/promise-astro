# Web Tools - สำหรับหน้าเครื่องมือ

มี 3 กล่องตามดีไซน์หน้าเว็บพี่

## กล่อง 1: เครื่องคำนวณพื้นฐาน
basic/
- western.ts - โหรสากล ใช้ astronomy-engine
- bazi.ts - ปาจื่อ ใช้ lunar-javascript
- ziwei.ts - จื่อวี่ 12 ภพ
- numerology.ts - เลขศาสตร์ Life Path
- humanDesign.ts - 88 วันก่อนเกิด
- tarot.ts - สุ่มไพ่ 78 ใบด้วย seededRandom
- lenormand.ts - สุ่ม 36 ใบ
- iching.ts - สุ่ม 64 กว้า
- synastry.ts - เทียบ 2 คน

## กล่อง 2: ปฏิทินและเวลา
calendar/
- thaiDate.ts - แปลง พ.ศ. วันไทย Julian Day
- lunar.ts - แปลงจันทรคติจีน-ไทย
- timezone.ts - แปลงเขตเวลา

## กล่อง 3: พิกัดสถานที่
location/
- geocode.ts - แปลงจังหวัด -> lat/lng + timezone

## วิธีใช้บน Cloudflare Workers
import { Basic, Location } from './web-tools'
const coords = Location.geocodeProvince('กรุงเทพ')
const chart = Basic.calcWestern('2000-05-15','14:30','กรุงเทพ')

## ติดกับ D1 knowledge ที่อัพแล้ว
chart.sun_long -> ไป query knowledge_nodes WHERE system_id='western_natal' AND topic='sun_in_aries' AND for_identity='lesbian'
