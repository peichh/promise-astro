export async function onRequestPost(context){
  const {DB} = context.env;
  const auth = context.request.headers.get('Authorization')?.replace('Bearer ','');
  if (!auth) return new Response('unauth',{status:401});
  // TODO: verify JWT via jose.jwtVerify
  const body = await context.request.json();
  const {user_id, birth_date, birth_time, birth_province, lat, lng, gender, lgbtq_identity} = body;
  const id = crypto.randomUUID();
  const now = Date.now();
  // Upsert
  await DB.prepare(`INSERT INTO promise_profiles (id,user_id,birth_date,birth_time,birth_province,lat,lng,gender,lgbtq_identity,created_at) 
  VALUES (?,?,?,?,?,?,?,?,?,?) 
  ON CONFLICT(user_id) DO UPDATE SET birth_date=excluded.birth_date, birth_time=excluded.birth_time, birth_province=excluded.birth_province, lat=excluded.lat, lng=excluded.lng, gender=excluded.gender, lgbtq_identity=excluded.lgbtq_identity`)
  .bind(id,user_id,birth_date,birth_time,birth_province,lat,lng,gender,lgbtq_identity,now).run();
  return new Response(JSON.stringify({ok:true}),{headers:{'Content-Type':'application/json'}});
}