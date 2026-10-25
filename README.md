# PROMISE - Master Astrology Cloudflare Full Stack

Modern, wow, Gen-Z friendly but professional. No-AI LEGO engine + ready for MCP AI future.

## What you already have in Cloudflare:
- D1: promise-db (users, sessions, promise_profiles, promise_readings, promise_subscriptions, promise_transactions, promise_admin_allowlist)
- R2: promise-slips (Private)
- Pages: promise (binding DB + SLIPS)

## What's in this ZIP:
- public/ : Landing, Register, Login, Onboarding (set birth date + 77 provinces + LGBTQ), Dashboard, Book (Canvas anti-copy), Admin
- functions/ : Cloudflare Pages Functions (TypeScript) - Auth, Profile, Readings (LEGO v2), MCP Gateway (admin only), _middleware (security headers, rate limit, admin check)
- src/data/ : Copy your master_astrology_db JSONs here for frontend use (optional, backend already has LEGO)
- wrangler.toml, package.json, schema.sql

## Features built:
1. Register with email + password (bcrypt) + display_name as {name} - auto JWT session stored in D1 sessions
2. Onboarding after register: birth_date, birth_time, birth_province (77 provinces), lat/lng, gender, lgbtq_identity -> saved to promise_profiles linked to user_id
3. Book Generation: /api/readings/generate uses LEGO v2 (no AI) - seeded random, blocks: 4, q: ความรัก, seed: 381904 - same style as screenshot you sent, but fixed grammar
4. Book Page: /book.html - Canvas rendering, no text selection, right-click disabled, Ctrl+C/S/P blocked, watermark with {name} + ID floating, clears on tab hidden, devtools detection
5. Tarot + Birth binding: Every reading saves to promise_readings with user_id + seed + blocks_json + result_text - history page can load
6. MCP Future: /api/mcp/generate is admin-only, checks Authorization, ready to call Workers AI (@cf/meta/llama) later. Hidden from public.
7. Anti-scrape: _middleware.ts sets CSP, X-Frame DENY, Permissions-Policy no clipboard, rate limit placeholder, R2 private

## Tech Stack (modern, wow, cheap):
- Cloudflare Pages Functions (TypeScript) - no server needed
- Tailwind CDN + Glassmorphism + Noto Serif Thai + Framer Motion ready (add via unpkg)
- Canvas API for anti-copy (like Netflix)
- jose for JWT, bcryptjs for hashing
- D1 + R2 native bindings

## How to deploy to Cloudflare:
1. Unzip, cd promise-cloudflare-full
2. npm install
3. npx wrangler pages deploy public --project-name=promise
   (or connect GitHub repo to Pages, it will auto deploy)
4. In Cloudflare Dashboard > Pages > promise > Settings > Bindings: ensure D1 promise-db bound as DB and R2 promise-slips as SLIPS (you already did)
5. Set env var JWT_SECRET in Pages > Settings > Variables to random 32 chars
6. Add your email to promise_admin_allowlist table: INSERT INTO promise_admin_allowlist (email,role) VALUES ('your@email.com','admin');

## What you need to create in Cloudflare (if not yet):
- If you want rate limit KV: Create KV namespace promise-rate and bind as RATE_LIMIT
- If you want AI in future: Enable Workers AI and bind as AI in wrangler.toml: [ai] binding = "AI"

## Security - Prevent data pulling:
- All /api/ checks JWT
- /api/mcp/* and /api/admin/* check allowlist
- Book text never in DOM as text, only Canvas pixels
- Watermark with user ID prevents screenshot sharing (traceable)
- R2 bucket is Private, only signed URLs
- No technique JSON exposed to frontend except LEGO demo (keep master DB in D1 or R2 private if you want)

## Next steps you asked:
- This ZIP is ready to upload to Cloudflare Pages (drag public folder)
- If you want me to add Stripe/PromptPay payment -> tell me, I will add functions/api/payment
- If you want Workers AI connected now -> I can add AI binding and replace LEGO with AI in /api/mcp/generate