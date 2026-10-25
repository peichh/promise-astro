-- promise-db schema (already created, this is for reference & future migrate)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at INTEGER NOT NULL,
  status TEXT DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  jwt_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS promise_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
  birth_date TEXT NOT NULL,
  birth_time TEXT,
  birth_province TEXT,
  lat REAL,
  lng REAL,
  -- Detailed gender & pronoun system
  gender_birth TEXT, -- เพศกำเนิด: ชาย, หญิง, Intersex
  gender_current TEXT, -- เพศปัจจุบัน: ชาย, หญิง, ทรานส์หญิง, ทรานส์ชาย, Non-binary, Genderfluid, อื่นๆ
  pronouns_th TEXT, -- สรรพนามไทย: เขา, เธอ, คุณ, น้อง, พี่, เค้า
  pronouns_en TEXT, -- he/him, she/her, they/them, etc
  pronouns_custom TEXT, -- สรรพนามกำหนดเอง
  sexual_orientation TEXT, -- รสนิยม: ชอบผู้ชาย, ชอบผู้หญิง, ชอบทุกเพศ, ชอบตัวเอง, Asexual, Pansexual, Bisexual, ฯลฯ
  attracted_to TEXT, -- ชอบเพศไหน: ชาย, หญิง, ทรานส์, Non-binary, ทุกเพศ
  relationship_status TEXT, -- โสด, มีแฟน, คุยๆ, แต่งงาน, เปิด
  lgbtq_identity TEXT, -- Bottom, Top, Vers, Fem, Masc, Androgynous, ฯลฯ
  lgbtq_role_detail TEXT, -- รายละเอียดเพิ่มเติม เช่น Power Bottom, Soft Fem
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS promise_readings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL, -- tarot, book, daily
  question TEXT,
  seed INTEGER,
  blocks_json TEXT NOT NULL,
  result_text TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS promise_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  expires_at INTEGER
);
CREATE TABLE IF NOT EXISTS promise_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  amount INTEGER,
  slip_r2_key TEXT,
  status TEXT DEFAULT 'pending',
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS promise_admin_allowlist (
  email TEXT PRIMARY KEY,
  role TEXT DEFAULT 'admin'
);
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER,
  reset_at INTEGER
);