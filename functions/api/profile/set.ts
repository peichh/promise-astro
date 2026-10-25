import { jwtVerify } from 'jose';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

export async function onRequestPost(context: { request: Request; env: { DB?: D1Database; JWT_SECRET?: string } }) {
  try {
    const { DB, JWT_SECRET } = context.env;
    if (!DB) return json({ error: 'Profile service is unavailable (database binding missing).' }, 503);
    if (!JWT_SECRET) return json({ error: 'Profile service is unavailable (JWT secret is not configured).' }, 503);
    const auth = context.request.headers.get('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return json({ error: 'Please sign in again.' }, 401);
    let uid: string;
    try { uid = String((await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))).payload.uid || ''); }
    catch { return json({ error: 'Your session expired. Please sign in again.' }, 401); }
    if (!uid) return json({ error: 'Invalid user session.' }, 401);
    let body: any;
    try { body = await context.request.json(); } catch { return json({ error: 'Invalid JSON request.' }, 400); }
    const birth_date = typeof body?.birth_date === 'string' ? body.birth_date : '';
    const birth_time = typeof body?.birth_time === 'string' && body.birth_time ? body.birth_time : null;
    const birth_province = typeof body?.birth_province === 'string' ? body.birth_province.trim() : '';
    const lat = Number(body?.lat), lng = Number(body?.lng);
    const timezone = typeof body?.timezone === 'string' && body.timezone ? body.timezone : 'Asia/Bangkok';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birth_date) || !birth_province || !Number.isFinite(lat) || !Number.isFinite(lng)) return json({ error: 'Please enter a valid birth date and birth location.' }, 400);
    const gender_current = typeof body?.gender_current === 'string' ? body.gender_current : null;
    const sexual_orientation = typeof body?.sexual_orientation === 'string' ? body.sexual_orientation : null;
    const lgbtq_identity = typeof body?.lgbtq_identity === 'string' ? body.lgbtq_identity : null;
    const now = Date.now();
    await DB.prepare(`INSERT INTO promise_birth_profiles (id,user_id,birth_date,birth_time,birth_province,lat,lng,timezone,gender_current,sexual_orientation,lgbtq_identity,created_at,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(user_id) DO UPDATE SET birth_date=excluded.birth_date,birth_time=excluded.birth_time,birth_province=excluded.birth_province,lat=excluded.lat,lng=excluded.lng,timezone=excluded.timezone,gender_current=excluded.gender_current,sexual_orientation=excluded.sexual_orientation,lgbtq_identity=excluded.lgbtq_identity,updated_at=excluded.updated_at`)
      .bind(crypto.randomUUID(), uid, birth_date, birth_time, birth_province, lat, lng, timezone, gender_current, sexual_orientation, lgbtq_identity, now, now).run();
    return json({ ok: true });
  } catch (error) {
    console.error('Profile save error:', error);
    return json({ error: 'Could not save your birth details. Please try again.' }, 500);
  }
}
