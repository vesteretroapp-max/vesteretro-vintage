-- ==================================================
-- VESTERETRO — SUPABASE MIGRATION 001
-- Banco de dados completo para loja virtual
-- ==================================================

-- ==================================================
-- 1. EXTENSIONS
-- ==================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==================================================
-- 2. TABELA PROFILES (ligada ao auth.users)
-- ==================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  cpf TEXT,
  birth_date TEXT,
  avatar_url TEXT,
  marketing_consent BOOLEAN DEFAULT FALSE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 3. TABELA PRODUCTS
-- ==================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_name TEXT,
  description TEXT,
  description_short TEXT,
  history TEXT,
  
  -- Classificação
  club TEXT,
  national_team TEXT,
  country TEXT,
  season TEXT,
  year INTEGER,
  decade TEXT,
  category TEXT,
  collection TEXT,
  kit_type TEXT DEFAULT 'home' CHECK (kit_type IN ('home', 'away', 'third', 'goalkeeper')),
  gender TEXT DEFAULT 'masculine' CHECK (gender IN ('masculine', 'feminine', 'kids')),
  sleeve_type TEXT DEFAULT 'short' CHECK (sleeve_type IN ('short', 'long')),
  
  -- Tipo de produto
  sport TEXT DEFAULT 'football' CHECK (sport IN ('football', 'basketball')),
  product_type TEXT DEFAULT 'retro' CHECK (product_type IN ('retro', 'current')),
  
  -- Flags
  is_retro BOOLEAN DEFAULT TRUE,
  is_launch BOOLEAN DEFAULT FALSE,
  is_on_sale BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_nba BOOLEAN DEFAULT FALSE,
  
  -- Preços
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  sale_starts_at TIMESTAMPTZ,
  sale_ends_at TIMESTAMPTZ,
  pix_discount DECIMAL(10,2),
  max_installments INTEGER DEFAULT 12,
  min_installment_value DECIMAL(10,2) DEFAULT 50.00,
  
  -- Personalização
  customizable BOOLEAN DEFAULT FALSE,
  customization_name_price DECIMAL(10,2) DEFAULT 0,
  customization_number_price DECIMAL(10,2) DEFAULT 0,
  customization_max_chars INTEGER DEFAULT 12,
  customization_allowed_numbers TEXT,
  customization_extra_days INTEGER DEFAULT 5,
  customization_warning TEXT,
  
  -- Modelo
  has_fan_model BOOLEAN DEFAULT TRUE,
  has_player_model BOOLEAN DEFAULT FALSE,
  fan_model_description TEXT,
  player_model_description TEXT,
  
  -- Imagens
  image_url TEXT,
  image_hover_url TEXT,
  
  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  
  -- Visibilidade
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'inactive', 'sold_out', 'archived')),
  homepage_order INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  
  -- Estatísticas
  views_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 4. TABELA PRODUCT_IMAGES
-- ==================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 5. TABELA PRODUCT_VARIANTS (tamanhos/estoque)
-- ==================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  model TEXT DEFAULT 'fan' CHECK (model IN ('fan', 'player')),
  size TEXT NOT NULL,
  sku TEXT,
  stock INTEGER DEFAULT 0,
  stock_minimum INTEGER DEFAULT 5,
  price_additional DECIMAL(10,2) DEFAULT 0,
  weight DECIMAL(10,3),
  height DECIMAL(10,2),
  width DECIMAL(10,2),
  length DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  supplier_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 6. TABELA CATEGORIES
-- ==================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 7. TABELA CLUBS
-- ==================================================
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  country TEXT,
  continent TEXT,
  logo_url TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 8. TABELA NATIONAL_TEAMS
-- ==================================================
CREATE TABLE IF NOT EXISTS national_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  country TEXT,
  flag_url TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 9. TABELA COLLECTIONS
-- ==================================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 10. TABELA FAVORITES
-- ==================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ==================================================
-- 11. TABELA ADDRESSES
-- ==================================================
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  reference TEXT,
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 12. TABELA CARTS
-- ==================================================
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 13. TABELA CART_ITEMS
-- ==================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id),
  size TEXT NOT NULL,
  model TEXT DEFAULT 'fan' CHECK (model IN ('fan', 'player')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  custom_name TEXT,
  custom_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 14. TABELA ORDERS
-- ==================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  
  -- Dados do cliente (visitante ou logado)
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_cpf TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'awaiting_payment', 'payment_review', 'paid',
    'processing', 'customizing', 'shipped', 'delivered',
    'cancelled', 'refunded'
  )),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'awaiting', 'approved', 'in_review',
    'declined', 'refunded', 'cancelled'
  )),
  payment_method TEXT,
  
  -- Valores
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  coupon_code TEXT,
  
  -- Entrega
  shipping_method TEXT,
  shipping_address JSONB,
  tracking_code TEXT,
  tracking_url TEXT,
  
  -- Notas
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 15. TABELA ORDER_ITEMS
-- ==================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  product_name TEXT NOT NULL,
  product_slug TEXT,
  image_url TEXT,
  size TEXT NOT NULL,
  model TEXT DEFAULT 'fan',
  sku TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  custom_name TEXT,
  custom_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 16. TABELA ORDER_STATUS_HISTORY
-- ==================================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 17. TABELA PAYMENTS
-- ==================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'mercadopago',
  external_payment_id TEXT,
  external_reference TEXT,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  installments INTEGER DEFAULT 1,
  installment_amount DECIMAL(10,2),
  
  -- PIX
  pix_qr_code TEXT,
  pix_qr_code_base64 TEXT,
  pix_expiration TIMESTAMPTZ,
  
  -- Boleto
  boleto_url TEXT,
  boleto_barcode TEXT,
  boleto_expiration TIMESTAMPTZ,
  
  -- Resposta do gateway
  gateway_response JSONB,
  
  paid_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 18. TABELA STOCK_RESERVATIONS
-- ==================================================
CREATE TABLE IF NOT EXISTS stock_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'released', 'converted', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  released_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ
);

-- ==================================================
-- 19. TABELA INVENTORY_MOVEMENTS
-- ==================================================
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  type TEXT NOT NULL CHECK (type IN (
    'entry', 'sale', 'adjustment', 'return',
    'cancellation', 'reservation', 'release'
  )),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER,
  new_stock INTEGER,
  reason TEXT,
  order_id UUID REFERENCES orders(id),
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 20. TABELA COUPONS
-- ==================================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_shipping')),
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_order_value DECIMAL(10,2) DEFAULT 0,
  maximum_discount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_per_customer INTEGER DEFAULT 1,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 21. TABELA COUPON_USAGE
-- ==================================================
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  order_id UUID REFERENCES orders(id),
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 22. TABELA BANNERS
-- ==================================================
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  subtitle TEXT,
  image_url TEXT,
  mobile_image_url TEXT,
  button_text TEXT,
  button_link TEXT,
  sort_order INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 23. TABELA REVIEWS
-- ==================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  image_url TEXT,
  verified_purchase BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 24. TABELA NEWSLETTER
-- ==================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  marketing_consent BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 25. TABELA SHIPPING_METHODS
-- ==================================================
CREATE TABLE IF NOT EXISTS shipping_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  carrier TEXT,
  service TEXT,
  description TEXT,
  base_cost DECIMAL(10,2) DEFAULT 0,
  per_kg_cost DECIMAL(10,2) DEFAULT 0,
  estimated_days_min INTEGER DEFAULT 7,
  estimated_days_max INTEGER DEFAULT 12,
  free_shipping_min DECIMAL(10,2),
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 26. TABELA PAYMENT_SETTINGS
-- ==================================================
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  environment TEXT DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'production')),
  public_key TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  config JSONB DEFAULT '{}',
  last_test_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 27. TABELA SITE_SETTINGS
-- ==================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 28. TABELA WEBHOOK_EVENTS
-- ==================================================
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  event_id TEXT,
  event_type TEXT,
  payload JSONB,
  processed BOOLEAN DEFAULT FALSE,
  processing_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- ==================================================
-- 29. TABELA INTEGRATION_LOGS
-- ==================================================
CREATE TABLE IF NOT EXISTS integration_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service TEXT NOT NULL,
  action TEXT NOT NULL,
  request_reference TEXT,
  response_status INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 30. TABELA AUDIT_LOGS
-- ==================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 31. TABELA ABANDONED_CARTS
-- ==================================================
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  phone TEXT,
  cart_id UUID REFERENCES carts(id),
  subtotal DECIMAL(10,2) DEFAULT 0,
  recovery_token TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'recovered', 'expired')),
  abandoned_at TIMESTAMPTZ DEFAULT NOW(),
  recovered_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- 32. TABELA IMPORT_JOBS
-- ==================================================
CREATE TABLE IF NOT EXISTS import_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_url TEXT,
  category TEXT,
  club TEXT,
  national_team TEXT,
  season TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ==================================================
-- TRIGGERS — updated_at automático
-- ==================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_national_teams_updated_at BEFORE UPDATE ON national_teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipping_methods_updated_at BEFORE UPDATE ON shipping_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_settings_updated_at BEFORE UPDATE ON payment_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================================================
-- TRIGGER — Criar profile automaticamente após cadastro
-- ==================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ==================================================
-- ÍNDICES para performance
-- ==================================================
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_club ON products(club);
CREATE INDEX idx_products_national_team ON products(national_team);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_retro ON products(is_retro);
CREATE INDEX idx_products_is_launch ON products(is_launch);
CREATE INDEX idx_products_is_on_sale ON products(is_on_sale);
CREATE INDEX idx_products_sport ON products(sport);
CREATE INDEX idx_products_product_type ON products(product_type);
CREATE INDEX idx_products_is_nba ON products(is_nba);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_size ON product_variants(size);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_external_payment_id ON payments(external_payment_id);

CREATE INDEX idx_stock_reservations_order_id ON stock_reservations(order_id);
CREATE INDEX idx_stock_reservations_variant_id ON stock_reservations(product_variant_id);

CREATE INDEX idx_inventory_movements_product_id ON inventory_movements(product_id);
CREATE INDEX idx_inventory_movements_variant_id ON inventory_movements(variant_id);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user_id ON coupon_usage(user_id);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);

CREATE INDEX idx_webhook_events_provider_event_id ON webhook_events(provider, event_id);
CREATE INDEX idx_integration_logs_service ON integration_logs(service);

CREATE INDEX idx_abandoned_carts_user_id ON abandoned_carts(user_id);
CREATE INDEX idx_abandoned_carts_status ON abandoned_carts(status);

-- ==================================================
-- DADOS DEMONSTRATIVOS — Cupom de boas-vindas
-- ==================================================
INSERT INTO coupons (code, description, discount_type, discount_value, minimum_order_value, usage_limit, active)
VALUES ('BEMVINDO10', '10% de desconto na primeira compra', 'percentage', 10, 100, NULL, TRUE)
ON CONFLICT (code) DO NOTHING;

-- ==================================================
-- DADOS DEMONSTRATIVOS — Métodos de frete
-- ==================================================
INSERT INTO shipping_methods (name, carrier, service, base_cost, estimated_days_min, estimated_days_max, free_shipping_min, active)
VALUES
  ('Frete Padrão', 'Correios', 'PAC', 25.90, 7, 12, 299.90, TRUE),
  ('Frete Expresso', 'Correios', 'SEDEX', 45.90, 3, 6, NULL, TRUE)
ON CONFLICT DO NOTHING;

-- ==================================================
-- DADOS DEMONSTRATIVOS — Configurações da loja
-- ==================================================
INSERT INTO site_settings (key, value)
VALUES
  ('store_name', '"VesteRetro"'),
  ('store_slogan', '"Vista a História"'),
  ('store_whatsapp', '"+5511987516823"'),
  ('store_email', '"contato@vesteretro.com.br"'),
  ('max_installments', '12'),
  ('min_installment_value', '50'),
  ('pix_discount_percent', '10'),
  ('free_shipping_min', '299.90'),
  ('order_prefix', '"VR-"'),
  ('abandonment_hours', '24')
ON CONFLICT (key) DO NOTHING;

-- ==================================================
-- CONCLUIDO
-- ==================================================
