import * as bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

export async function onRequestPost(context: { request: Request; env: { DB?: D1Database; JWT_SECRET?: string } }) {
  try {
    const { DB, JWT_SECRET } = context.env;
    if (!DB) return json({ error: 'Login service is temporarily unavailable (database binding missing).' }, 503);
    if (!JWT_SECRET) return json({ error: 'Login service is temporarily unavailable (JWT secret is not configured).' }, 503);
    let body: any;
    try { body = await context.request.json(); } catch { return json({ error: 'Invalid JSON request.' }, 400); }
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    if (!email || !password) return json({ error: 'Email and password are required.' }, 400);

    const user: any = await DB.prepare('SELECT id, email, password_hash, role FROM users WHERE email = ?').bind(email).first();
    // Use the same response for unknown email and invalid password to avoid revealing account existence.
    if (!user || !(await bcrypt.compare(password, user.password_hash))) return json({ error: 'Invalid email or password.' }, 401);

    const now = Date.now();
    const jwt = await new SignJWT({ uid: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d')
      .sign(new TextEncoder().encode(JWT_SECRET));
    // Production D1 sessions schema: id, user_id, expires_at, created_at (created_at has a default).
    await DB.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', ? / 1000, 'unixepoch'))")
      .bind(crypto.randomUUID(), user.id, now + 7 * 24 * 60 * 60 * 1000).run();
    return json({ token: jwt, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login API error:', error);
    return json({ error: 'Login could not be completed. Please try again.' }, 500);
  }
}
