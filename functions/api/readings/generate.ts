import { jwtVerify } from 'jose';
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
const advice:Record<string,string[]>={
 'งาน':['ลองเลือกงานสำคัญหนึ่งเรื่อง แล้วสื่อสารขอบเขตและขั้นตอนให้ชัด ความก้าวหน้าจะมาจากความสม่ำเสมอมากกว่าการเร่งทุกอย่างพร้อมกัน','ช่วงนี้เหมาะกับการทบทวนคุณค่าของทักษะที่มี และเสนอแนวทางที่จับต้องได้ก่อนรับภาระใหม่','การร่วมมือจะเป็นจุดแข็ง แต่ควรกำหนดเวลาและความรับผิดชอบให้ชัดเพื่อรักษาพลังของตัวเอง'],
 'ความรัก':['ความสัมพันธ์จะชัดขึ้นเมื่อพูดความต้องการอย่างตรงไปตรงมา โดยไม่คาดหวังให้อีกฝ่ายอ่านใจ สังเกตการกระทำที่สม่ำเสมอควบคู่กับคำพูด','ถ้ามีคู่ ลองสร้างเวลาคุณภาพและถามกันว่าอะไรทำให้รู้สึกได้รับการใส่ใจ หากกำลังคุยกับใคร ให้เปิดใจโดยยังรักษาขอบเขตที่สบายใจ','พลังความรักช่วงนี้ชวนให้กลับมาฟังความรู้สึกของตัวเอง ความสัมพันธ์ที่ดีควรมีทั้งความอบอุ่น ความเคารพ และพื้นที่เป็นตัวเอง'],
 'การเงิน':['การทบทวนรายจ่ายและจัดลำดับเป้าหมายจะช่วยให้ตัดสินใจได้มั่นใจขึ้น หลีกเลี่ยงการตัดสินใจเร่งด่วนจากแรงกดดัน','ค่อยๆ สร้างแผนที่ทำได้จริงและเผื่อความไม่แน่นอน ตรวจสอบรายละเอียดก่อนผูกพันกับค่าใช้จ่ายระยะยาว'],
 'สุขภาพ':['ให้ความสำคัญกับการพักผ่อนและกิจวัตรที่ทำได้ต่อเนื่อง หากกังวลเรื่องอาการ ควรปรึกษาผู้เชี่ยวชาญด้านสุขภาพแทนการพึ่งคำทำนาย']
};
export async function onRequestPost({request,env}:{request:Request;env:{DB?:D1Database;JWT_SECRET?:string}}){
 if(!env.DB)return json({error:'Reading database unavailable.',code:'DB_UNAVAILABLE'},503);
 if(!env.JWT_SECRET)return json({error:'Session service unavailable.',code:'AUTH_CONFIG'},503);
 const auth=request.headers.get('Authorization')||'';if(!auth.startsWith('Bearer '))return json({error:'Please sign in again.',code:'AUTH_REQUIRED'},401);
 let uid='';try{uid=String((await jwtVerify(auth.slice(7),new TextEncoder().encode(env.JWT_SECRET))).payload.uid||'')}catch{return json({error:'Session expired. Please sign in again.',code:'AUTH_INVALID'},401)}if(!uid)return json({error:'Invalid session.',code:'AUTH_INVALID'},401);
 let body:any;try{body=await request.json()}catch{return json({error:'Invalid JSON request.',code:'INVALID_JSON'},400)}
 const type=typeof body?.type==='string'&&advice[body.type]?body.type:'ความรัก';const question=typeof body?.question==='string'?body.question.trim().slice(0,1000):'';
 try{
  const profile=await env.DB.prepare('SELECT birth_date,birth_time,birth_province,birth_place FROM promise_birth_profiles WHERE user_id=?').bind(uid).first<any>();
  if(!profile)return json({error:'กรุณาผูกข้อมูลดวงกำเนิดก่อนสร้างคำพยากรณ์',code:'BIRTH_PROFILE_REQUIRED'},409);
  const seed=crypto.getRandomValues(new Uint32Array(1))[0];const options=advice[type];const selected=options[seed%options.length];const place=profile.birth_place||profile.birth_province||'ไม่ระบุสถานที่';
  const result=`คำอ่านเรื่อง${type}\n\n${selected}\n\nคำถามของคุณ: ${question||'แนวโน้มโดยรวม'}\n\nข้อมูลดวงกำเนิดที่ใช้ประกอบ: ${profile.birth_date}${profile.birth_time?' เวลา '+profile.birth_time:''} • ${place}\n\nใช้เป็นแนวทางเพื่อการใคร่ครวญและความบันเทิง ไม่ใช่คำแนะนำจากผู้เชี่ยวชาญ`;
  const id=crypto.randomUUID();const payload=JSON.stringify({question,type,text:result,seed,birth_profile_used:true});
  // Production D1 schema uses reading_type/title/payload/created_at (not the legacy columns in schema.sql).
  await env.DB.prepare('INSERT INTO promise_readings (id,user_id,reading_type,title,payload) VALUES (?,?,?,?,?)').bind(id,uid,type,question||`คำอ่านเรื่อง${type}`,payload).run();
  return json({id,seed,text:result,blocks:1,q:type});
 }catch(e){console.error('Reading generation failed',e);return json({error:'บันทึกคำทำนายไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',code:'READING_STORAGE_FAILED'},500)}
}