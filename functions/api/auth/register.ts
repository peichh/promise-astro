import * as bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

export async function onRequestPost(context: { request: Request; env: { DB?: D1Database; JWT_SECRET?: string } }) {
  try {
    const { DB, JWT_SECRET } = context.env;
    if (!DB) return json({ error: 'Registration service is temporarily unavailable (database binding missing).' }, 503);
    if (!JWT_SECRET) return json({ error: 'Registration service is temporarily unavailable (JWT secret is not configured).' }, 503);
    let body: any;
    try { body = await context.request.json(); } catch { return json({ error: 'Invalid JSON request.' }, 400); }
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    const displayName = typeof body?.display_name === 'string' ? body.display_name.trim() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || !displayName) {
      return json({ error: 'Please provide a valid email, a password of at least 8 characters, and a display name.' }, 400);
    }
    const existing = await DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (existing) return json({ error: 'email exists' }, 409);

    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    // Production D1 users schema has no display_name column; store only the schema-supported fields.
    await DB.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').bind(id, email, passwordHash).run();
    const now = Date.now();
    const jwt = await new SignJWT({ uid: id, email })
      .setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d')
      .sign(new TextEncoder().encode(JWT_SECRET));
    // Production D1 sessions table has only id, user_id, expires_at, created_at.
    await DB.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', ? / 1000, 'unixepoch'))")
      .bind(crypto.randomUUID(), id, now + 7 * 24 * 60 * 60 * 1000).run();
    return json({ token: jwt, user: { id, email, display_name: displayName } }, 201);
  } catch (error) {
    console.error('Registration API error:', error);
    return json({ error: 'Registration could not be completed. Please try again.' }, 500);
  }
}
