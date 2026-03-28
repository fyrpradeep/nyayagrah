-- Settings table (phone, email, contact details)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  phone1 TEXT DEFAULT '7878407950',
  phone2 TEXT DEFAULT '6350136833',
  whatsapp TEXT DEFAULT '6350136833',
  email TEXT DEFAULT 'info@nyayagrah.com',
  address_bikaner TEXT DEFAULT 'Opp. Vivekananda School, Murti Circle, JNV Colony, Bikaner, Rajasthan',
  address_jaipur TEXT DEFAULT 'B-301, Maruti Nagar, Sanganer, Jaipur, Rajasthan',
  brand_name TEXT DEFAULT 'Nyaya Grah',
  tagline TEXT DEFAULT 'Legal & Business Solutions',
  hero_title TEXT DEFAULT 'Your Trusted Legal & Business Partner',
  logo_url TEXT DEFAULT '/logo.png',
  gstin TEXT DEFAULT '',
  bank_name TEXT DEFAULT '',
  account_no TEXT DEFAULT '',
  ifsc TEXT DEFAULT '',
  upi_id TEXT DEFAULT '',
  payment_mode TEXT DEFAULT 'manual',
  razorpay_key_id TEXT DEFAULT '',
  invoice_footer TEXT DEFAULT 'Thank you for choosing Nyaya Grah.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'Registration',
  excerpt TEXT,
  content TEXT,
  author TEXT DEFAULT 'Nyaya Grah Team',
  read_time TEXT DEFAULT '3 min read',
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services_custom (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'registration',
  icon TEXT DEFAULT '📋',
  tagline TEXT,
  price TEXT DEFAULT '',
  timeline TEXT DEFAULT '',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT UNIQUE NOT NULL,
  email TEXT,
  password TEXT DEFAULT '666666',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client services table
CREATE TABLE IF NOT EXISTS client_services (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id),
  title TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'In Progress',
  progress INTEGER DEFAULT 0,
  notes TEXT,
  timeline TEXT,
  total_amount NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  due_amount NUMERIC DEFAULT 0,
  steps JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  client_service_id TEXT REFERENCES client_services(id),
  client_id TEXT REFERENCES clients(id),
  amount NUMERIC NOT NULL,
  mode TEXT DEFAULT 'UPI',
  txn_id TEXT,
  status TEXT DEFAULT 'Confirmed',
  invoice_no TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  client_id TEXT REFERENCES clients(id),
  service_id TEXT,
  text TEXT NOT NULL,
  sender TEXT DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id),
  service_id TEXT,
  name TEXT NOT NULL,
  size INTEGER,
  file_type TEXT,
  data TEXT,
  uploaded_by TEXT DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for easy access (you can enable later)
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE services_custom DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
