import * as bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
export async function onRequestPost(context){
  const {DB} = context.env;
  const {email,password} = await context.request.json();
  const user = await DB.prepare('SELECT * FROM users WHERE email=?').bind(email).first();
  if (!user) return new Response(JSON.stringify({error:'not found'}),{status:404});
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return new Response(JSON.stringify({error:'wrong password'}),{status:401});
  const secret = new TextEncoder().encode(context.env.JWT_SECRET);
  const jwt = await new SignJWT({uid:user.id,email}).setProtectedHeader({alg:'HS256'}).setExpirationTime('7d').sign(secret);
  const now = Date.now();
  await DB.prepare('INSERT INTO sessions (id,user_id,jwt_id,created_at,expires_at) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(), user.id, jwt.slice(-20), now, now+7*24*3600*1000).run();
  return new Response(JSON.stringify({token:jwt, user}),{headers:{'Content-Type':'application/json'}});
}