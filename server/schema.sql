-- =========================================================
-- RMU SRC — PostgreSQL schema
-- =========================================================

CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  reset_token       TEXT,
  reset_token_expires TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS executives (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(150) NOT NULL,
  position     VARCHAR(150) NOT NULL,
  bio          TEXT,
  image_url    TEXT,
  order_index  INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  image_url    TEXT,
  category     VARCHAR(100),
  featured     BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  event_date   DATE NOT NULL,
  start_time   VARCHAR(20),
  end_time     VARCHAR(20),
  location     VARCHAR(255),
  image_url    TEXT,
  register_url TEXT,
  featured     BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketplace_items (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  description  TEXT,
  price_ghs    NUMERIC(10,2) NOT NULL,
  image_url    TEXT,
  category     VARCHAR(100),
  stock        INTEGER NOT NULL DEFAULT 0,
  featured     BOOLEAN NOT NULL DEFAULT false,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id                  SERIAL PRIMARY KEY,
  item_id             INTEGER REFERENCES marketplace_items(id) ON DELETE SET NULL,
  buyer_name          VARCHAR(150) NOT NULL,
  buyer_email         VARCHAR(150) NOT NULL,
  buyer_phone         VARCHAR(50),
  quantity            INTEGER NOT NULL DEFAULT 1,
  total_amount_ghs    NUMERIC(10,2) NOT NULL,
  paystack_reference  VARCHAR(150) UNIQUE,
  status              VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending | paid | failed
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS industry_partners (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(150) NOT NULL,
  partner_type VARCHAR(100) DEFAULT 'Industry connection',
  logo_url     TEXT,
  order_index  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_services (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(150) NOT NULL,
  description  TEXT,
  icon         VARCHAR(50) DEFAULT 'HelpCircle', -- lucide-react icon name
  order_index  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(150) NOT NULL,
  subject      VARCHAR(255),
  message      TEXT NOT NULL,
  is_read      BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key          VARCHAR(100) PRIMARY KEY,
  value        TEXT
);

CREATE TABLE IF NOT EXISTS constitution (
  id           SERIAL PRIMARY KEY,
  pdf_url      TEXT NOT NULL,
  version_label VARCHAR(50),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
