import * as bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function onRequestPost(context) {
  const { DB } = context.env;
  const body = await context.request.json();
  const { email, password, display_name } = body;
  if (!email || !password) return new Response(JSON.stringify({error:'missing'}), {status:400});
  
  // Check exists
  const existing = await DB.prepare('SELECT id FROM users WHERE email=?').bind(email).first();
  if (existing) return new Response(JSON.stringify({error:'email exists'}), {status:409});
  
  const id = crypto.randomUUID();
  const hash = await bcrypt.hash(password, 10);
  const now = Date.now();
  await DB.prepare('INSERT INTO users (id,email,password_hash,display_name,created_at) VALUES (?,?,?,?,?)').bind(id,email,hash,display_name||email.split('@')[0],now).run();
  
  // Auto create session JWT
  const secret = new TextEncoder().encode(context.env.JWT_SECRET);
  const jwt = await new SignJWT({ uid:id, email }).setProtectedHeader({alg:'HS256'}).setExpirationTime('7d').sign(secret);
  
  await DB.prepare('INSERT INTO sessions (id,user_id,jwt_id,created_at,expires_at) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(), id, jwt.slice(-20), now, now+7*24*3600*1000).run();
  
  return new Response(JSON.stringify({token:jwt, user:{id,email,display_name}}), {headers:{'Content-Type':'application/json'}});
}