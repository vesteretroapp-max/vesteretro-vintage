-- =============================================
-- VesteRetro — Supabase Initial Schema
-- Execute this SQL in the Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  cpf TEXT,
  birth_date DATE,
  avatar_url TEXT,
  marketing_consent BOOLEAN DEFAULT false,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =============================================
-- ADDRESSES
-- =============================================
CREATE TABLE addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cep TEXT NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  reference TEXT,
  phone TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL
  USING (auth.uid() = user_id);

-- =============================================
-- PRODUCTS (mirror from Convex for checkout snapshots)
-- =============================================
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  club TEXT NOT NULL,
  year INTEGER,
  type TEXT,
  category TEXT,
  country TEXT,
  description TEXT,
  history TEXT,
  price DECIMAL(10,2) NOT NULL,
  promotional_price DECIMAL(10,2),
  is_new BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_promotion BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  image_url TEXT,
  decade INTEGER,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published products"
  ON products FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- PRODUCT VARIANTS
-- =============================================
CREATE TABLE product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  sku TEXT,
  stock INTEGER DEFAULT 0,
  price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view variants"
  ON product_variants FOR SELECT
  USING (true);

-- =============================================
-- FAVORITES
-- =============================================
CREATE TABLE favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id);

-- =============================================
-- CARTS
-- =============================================
CREATE TABLE carts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TRIGGER carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON carts FOR ALL
  USING (auth.uid() = user_id);

-- =============================================
-- CART ITEMS
-- =============================================
CREATE TABLE cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id),
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id, size)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart items"
  ON cart_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM carts WHERE id = cart_id AND user_id = auth.uid())
  );

-- =============================================
-- ORDERS
-- =============================================
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_cpf TEXT,
  status TEXT NOT NULL DEFAULT 'awaiting_payment' 
    CHECK (status IN ('pending','awaiting_payment','payment_review','paid','processing','shipped','delivered','cancelled','refunded')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending','awaiting','approved','declined','refunded','cancelled')),
  payment_method TEXT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  coupon_code TEXT,
  shipping_method TEXT,
  shipping_address TEXT NOT NULL,
  notes TEXT,
  tracking_code TEXT,
  is_guest BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR (is_guest = true AND customer_email IS NOT NULL));

CREATE POLICY "Admins can manage orders"
  ON orders FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- ORDER ITEMS
-- =============================================
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID,
  product_name TEXT NOT NULL,
  product_slug TEXT,
  image_url TEXT,
  size TEXT NOT NULL,
  sku TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (user_id = auth.uid() OR is_guest = true))
  );

-- =============================================
-- ORDER STATUS HISTORY
-- =============================================
CREATE TABLE order_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order history"
  ON order_status_history FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (user_id = auth.uid() OR is_guest = true))
  );

-- =============================================
-- COUPONS
-- =============================================
CREATE TABLE coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage','fixed_amount','free_shipping')),
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_order_value DECIMAL(10,2) DEFAULT 0,
  usage_limit INTEGER,
  usage_per_customer INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (active = true);

-- =============================================
-- COUPON USAGE
-- =============================================
CREATE TABLE coupon_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  user_id UUID REFERENCES profiles(id),
  order_id UUID REFERENCES orders(id),
  customer_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coupon usage"
  ON coupon_usage FOR SELECT
  USING (auth.uid() = user_id OR customer_email IS NOT NULL);

-- =============================================
-- SHIPPING METHODS
-- =============================================
CREATE TABLE shipping_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  estimated_days_min INTEGER,
  estimated_days_max INTEGER,
  free_above DECIMAL(10,2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shipping methods"
  ON shipping_methods FOR SELECT
  USING (active = true);

-- =============================================
-- SITE SETTINGS
-- =============================================
CREATE TABLE site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  USING (true);

-- =============================================
-- SEED DATA
-- =============================================

-- Shipping methods
INSERT INTO shipping_methods (name, code, description, price, estimated_days_min, estimated_days_max, free_above)
VALUES
  ('Frete Padrão', 'standard', 'Entrega em todo o Brasil', 19.90, 7, 15, 299.00),
  ('Frete Expresso', 'express', 'Entrega prioritária', 39.90, 3, 7, NULL),
  ('Frete Grátis', 'free', 'Frete grátis para pedidos acima de R$ 299', 0, 10, 20, NULL);

-- Demo coupon
INSERT INTO coupons (code, description, discount_type, discount_value, minimum_order_value, usage_limit, active)
VALUES ('BEMVINDO10', '10% de desconto na primeira compra', 'percentage', 10, 0, 100, true);

-- Site settings
INSERT INTO site_settings (key, value) VALUES
  ('store_name', '"VesteRetro"'),
  ('store_slogan', '"Vista a História."'),
  ('whatsapp', '"5511987516823"'),
  ('max_installments', '12'),
  ('free_shipping_threshold', '299.00'),
  ('pix_discount_percentage', '5'),
  ('store_description', '"Camisas retrô premium de clubes brasileiros, internacionais e seleções."'),
  ('payment_provider', '"demo"'),
  ('sandbox_mode', 'true');
