// LEGO v2 Engine - No AI, pure deterministic + seeded random
const LEGO = {
  openers_trait: [
    "{name} ไม่เคยเข้าใจว่าทำไมบางประตูถึงเปิดยาก ทั้งที่กุญแจอยู่ในมือมาตลอด",
    "{name} เกิดมาพร้อมคำถามที่ไม่มีใครสอนวิธีตอบ ต้องทดลองเจ็บเอง",
    "ตั้งแต่เด็ก {name} จะรู้ก่อนเสมอว่าใครกำลังไม่โอเค แม้เขาจะยิ้มอยู่",
    "มีบางอย่างในตัว {name} ที่ทำให้คนอื่นอยากเล่าเรื่องลึกๆ ให้ฟังตั้งแต่ครั้งแรกที่เจอ"
  ],
  current_situation_work: [
    "โปรเจกต์ที่ {name} ดองไว้ 2 ปีกำลังจะกลับมามีชีวิต มีคนพร้อมจ่ายเพื่อไอเดียเดิมนั้น",
    "งานของ {name} ตอนนี้มีรายละเอียดเยอะจนต้องทำเช็กลิสต์ทุกเช้า",
    "มีอีเมลหรือข้อความที่ {name} รอคอยมานาน กำลังจะเด้งเข้ามาใน 2 อาทิตย์นี้"
  ],
  opportunity_work: [
    "และนี่คือจังหวะที่ {name} จะได้ขยับไปตำแหน่งที่มั่นคงขึ้น ไม่ใช่แค่เงินเดือน แต่เป็นที่นั่งที่คนฟัง {name} มากขึ้น",
    "จังหวะนี้เหมาะให้ {name} เรียกราคาใหม่ได้เลย คนที่เห็นค่าจะไม่ต่อ"
  ],
  caution_single: [
    "แต่ต้องระวังคำพูดในที่ประชุม คำเดียวที่พูดด้วยอีโก้จะย้อนกลับมาใน 3 เดือน",
    "ระวังการรับงานของคนอื่นมาแบกจนลืมงานตัวเอง"
  ],
  emotional_safety: [
    "ในจังหวะเดียวกัน คนที่เข้ามาจะไม่ได้ทำให้ {name} รู้สึกตื่นเต้น แต่ทำให้รู้สึกปลอดภัยจนหลับลึกได้",
    "คนที่ใช่จะทำให้ {name} ไม่ต้องเก่งตลอดเวลาก็ได้"
  ],
  closers: [
    "บทนี้ยังไม่จบ แต่ {name} ไม่ต้องเป็นคนเดิมเพื่ออ่านหน้าต่อไปแล้ว",
    "การปล่อยมือก็เป็นการรักตัวเองรูปแบบหนึ่งที่จักรวาลกำลังสอน {name}"
  ]
};

function seededRandom(seed){
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
function pick(arr, seed){
  const idx = Math.floor(seededRandom(seed) * arr.length);
  return arr[idx % arr.length];
}

export async function onRequestPost(context){
  const {DB} = context.env;
  const {user_id, name, question, type} = await context.request.json(); // type: work | love
  const seed = Math.floor(Math.random()*1000000);
  const r1 = pick(LEGO.openers_trait, seed+1).replaceAll('{name}', name);
  const r2 = type==='งาน' ? pick(LEGO.current_situation_work, seed+2).replaceAll('{name}', name) : '';
  const r3 = type==='งาน' ? pick(LEGO.opportunity_work, seed+3).replaceAll('{name}', name) : pick(LEGO.emotional_safety, seed+3).replaceAll('{name}', name);
  const r4 = pick(LEGO.caution_single, seed+4).replaceAll('{name}', name);
  const r5 = pick(LEGO.closers, seed+5).replaceAll('{name}', name);
  
  let finalText = type==='งาน' ? `${r1}\n\n${r2} ${r3}\n\n${r4}\n\n${r5}` : `${r1}\n\n${r3}\n\n${r5}`;
  
  const id = crypto.randomUUID();
  await DB.prepare('INSERT INTO promise_readings (id,user_id,type,question,seed,blocks_json,result_text,created_at) VALUES (?,?,?,?,?,?,?,?)')
    .bind(id, user_id, type, question, seed, JSON.stringify({r1,r2,r3,r4,r5}), finalText, Date.now()).run();
  
  return new Response(JSON.stringify({id, seed, text:finalText, blocks:4, q:type}), {headers:{'Content-Type':'application/json'}});
}