// ==================================================
// VESTERETRO — Supabase TypeScript Types
// Tipagens reutilizáveis para todas as tabelas
// ==================================================

import type { User, Session } from "@supabase/supabase-js";

// ==================================================
// AUTH TYPES
// ==================================================
export type AuthUser = User;
export type AuthSession = Session;

export type AuthError = {
  message: string;
  status?: number;
};

// ==================================================
// PROFILE
// ==================================================
export type Profile = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  cpf: string | null;
  birth_date: string | null;
  avatar_url: string | null;
  marketing_consent: boolean;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
};

export type ProfileInsert = Omit<Profile, "created_at" | "updated_at">;
export type ProfileUpdate = Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;

// ==================================================
// PRODUCTS
// ==================================================
export type ProductStatus = "draft" | "active" | "inactive" | "sold_out" | "archived";
export type KitType = "home" | "away" | "third" | "goalkeeper";
export type Gender = "masculine" | "feminine" | "kids";
export type SleeveType = "short" | "long";
export type Sport = "football" | "basketball";
export type ProductType = "retro" | "current";

export type Product = {
  id: string;
  name: string;
  slug: string;
  short_name: string | null;
  description: string | null;
  description_short: string | null;
  history: string | null;
  club: string | null;
  national_team: string | null;
  country: string | null;
  season: string | null;
  year: number | null;
  decade: string | null;
  category: string | null;
  collection: string | null;
  kit_type: KitType;
  gender: Gender;
  sleeve_type: SleeveType;
  sport: Sport;
  product_type: ProductType;
  is_retro: boolean;
  is_launch: boolean;
  is_on_sale: boolean;
  is_featured: boolean;
  is_nba: boolean;
  price: number;
  cost_price: number | null;
  sale_price: number | null;
  sale_starts_at: string | null;
  sale_ends_at: string | null;
  pix_discount: number | null;
  max_installments: number;
  min_installment_value: number;
  customizable: boolean;
  customization_name_price: number;
  customization_number_price: number;
  customization_max_chars: number;
  customization_allowed_numbers: string | null;
  customization_extra_days: number;
  customization_warning: string | null;
  has_fan_model: boolean;
  has_player_model: boolean;
  fan_model_description: string | null;
  player_model_description: string | null;
  image_url: string | null;
  image_hover_url: string | null;
  /** Caminho relativo da imagem no Supabase Storage (bucket product-images).
   *  Ex.: "corinthians/1994-home/hero.webp.webp" */
  image_path: string | null;
  image_path_hover: string | null;
  image_path_back: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  status: ProductStatus;
  homepage_order: number;
  published_at: string | null;
  views_count: number;
  sales_count: number;
  favorites_count: number;
  created_at: string;
  updated_at: string;
};

export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at" | "views_count" | "sales_count" | "favorites_count">;
export type ProductUpdate = Partial<Omit<Product, "id" | "created_at" | "updated_at">>;

// ==================================================
// PRODUCT IMAGES
// ==================================================
export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

// ==================================================
// PRODUCT VARIANTS
// ==================================================
export type VariantModel = "fan" | "player";
export type VariantStatus = "active" | "inactive";

export type ProductVariant = {
  id: string;
  product_id: string;
  model: VariantModel;
  size: string;
  sku: string | null;
  stock: number;
  stock_minimum: number;
  price_additional: number;
  weight: number | null;
  height: number | null;
  width: number | null;
  length: number | null;
  status: VariantStatus;
  supplier_code: string | null;
  created_at: string;
  updated_at: string;
};

// ==================================================
// CATEGORIES
// ==================================================
export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

// ==================================================
// CLUBS
// ==================================================
export type Club = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  continent: string | null;
  logo_url: string | null;
  description: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

// ==================================================
// NATIONAL TEAMS
// ==================================================
export type NationalTeam = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  flag_url: string | null;
  description: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

// ==================================================
// COLLECTIONS
// ==================================================
export type Collection = {
  id: string;
  name: string;
  description: string | null;
  banner_url: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

// ==================================================
// FAVORITES
// ==================================================
export type Favorite = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
};

// ==================================================
// ADDRESSES
// ==================================================
export type Address = {
  id: string;
  user_id: string;
  recipient_name: string;
  zip_code: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  reference: string | null;
  phone: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type AddressInsert = Omit<Address, "id" | "created_at" | "updated_at">;
export type AddressUpdate = Partial<Omit<Address, "id" | "created_at" | "updated_at">>;

// ==================================================
// CARTS
// ==================================================
export type Cart = {
  id: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string | null;
  size: string;
  model: VariantModel;
  quantity: number;
  unit_price: number;
  custom_name: string | null;
  custom_number: string | null;
  created_at: string;
  updated_at: string;
};

// ==================================================
// ORDERS
// ==================================================
export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "payment_review"
  | "paid"
  | "processing"
  | "customizing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "awaiting"
  | "approved"
  | "in_review"
  | "declined"
  | "refunded"
  | "cancelled";

export type Order = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_cpf: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  total: number;
  coupon_code: string | null;
  shipping_method: string | null;
  shipping_address: Record<string, unknown> | null;
  tracking_code: string | null;
  tracking_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_slug: string | null;
  image_url: string | null;
  size: string;
  model: VariantModel;
  sku: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  custom_name: string | null;
  custom_number: string | null;
  created_at: string;
};

export type OrderStatusHistory = {
  id: string;
  order_id: string;
  status: string;
  message: string | null;
  created_by: string | null;
  created_at: string;
};

// ==================================================
// PAYMENTS
// ==================================================
export type Payment = {
  id: string;
  order_id: string;
  provider: string;
  external_payment_id: string | null;
  external_reference: string | null;
  payment_method: string | null;
  status: string;
  amount: number;
  currency: string;
  installments: number;
  installment_amount: number | null;
  pix_qr_code: string | null;
  pix_qr_code_base64: string | null;
  pix_expiration: string | null;
  boleto_url: string | null;
  boleto_barcode: string | null;
  boleto_expiration: string | null;
  gateway_response: Record<string, unknown> | null;
  paid_at: string | null;
  cancelled_at: string | null;
  refunded_at: string | null;
  created_at: string;
  updated_at: string;
};

// ==================================================
// COUPONS
// ==================================================
export type DiscountType = "percentage" | "fixed_amount" | "free_shipping";

export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  minimum_order_value: number;
  maximum_discount: number | null;
  usage_limit: number | null;
  usage_per_customer: number;
  starts_at: string | null;
  expires_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

// ==================================================
// REVIEWS
// ==================================================
export type ReviewStatus = "pending" | "approved" | "rejected" | "hidden";

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  image_url: string | null;
  verified_purchase: boolean;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
};

// ==================================================
// BANNERS
// ==================================================
export type Banner = {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string | null;
  mobile_image_url: string | null;
  button_text: string | null;
  button_link: string | null;
  sort_order: number;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

// ==================================================
// SHIPPING METHODS
// ==================================================
export type ShippingMethod = {
  id: string;
  name: string;
  carrier: string | null;
  service: string | null;
  description: string | null;
  base_cost: number;
  per_kg_cost: number;
  estimated_days_min: number;
  estimated_days_max: number;
  free_shipping_min: number | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// ==================================================
// STOCK RESERVATIONS
// ==================================================
export type ReservationStatus = "active" | "released" | "converted" | "expired";

export type StockReservation = {
  id: string;
  order_id: string;
  product_variant_id: string;
  quantity: number;
  status: ReservationStatus;
  expires_at: string | null;
  created_at: string;
  released_at: string | null;
  converted_at: string | null;
};

// ==================================================
// INVENTORY MOVEMENTS
// ==================================================
export type MovementType = "entry" | "sale" | "adjustment" | "return" | "cancellation" | "reservation" | "release";

export type InventoryMovement = {
  id: string;
  product_id: string;
  variant_id: string | null;
  type: MovementType;
  quantity: number;
  previous_stock: number | null;
  new_stock: number | null;
  reason: string | null;
  order_id: string | null;
  created_by: string | null;
  created_at: string;
};

// ==================================================
// NEWSLETTER
// ==================================================
export type NewsletterSubscriber = {
  id: string;
  name: string | null;
  email: string;
  marketing_consent: boolean;
  status: "active" | "unsubscribed";
  created_at: string;
};

// ==================================================
// SITE SETTINGS
// ==================================================
export type SiteSetting = {
  id: string;
  key: string;
  value: unknown;
  created_at: string;
  updated_at: string;
};

// ==================================================
// WEBHOOK EVENTS
// ==================================================
export type WebhookEvent = {
  id: string;
  provider: string;
  event_id: string | null;
  event_type: string | null;
  payload: Record<string, unknown> | null;
  processed: boolean;
  processing_error: string | null;
  created_at: string;
  processed_at: string | null;
};

// ==================================================
// INTEGRATION LOGS
// ==================================================
export type IntegrationLog = {
  id: string;
  service: string;
  action: string;
  request_reference: string | null;
  response_status: number | null;
  success: boolean;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

// ==================================================
// AUDIT LOGS
// ==================================================
export type AuditLog = {
  id: string;
  admin_id: string | null;
  action: string;
  resource: string;
  resource_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
};

// ==================================================
// ABANDONED CARTS
// ==================================================
export type AbandonedCart = {
  id: string;
  user_id: string | null;
  email: string | null;
  phone: string | null;
  cart_id: string | null;
  subtotal: number;
  recovery_token: string | null;
  status: "active" | "recovered" | "expired";
  abandoned_at: string;
  recovered_at: string | null;
  reminder_sent_at: string | null;
  created_at: string;
};

// ==================================================
// IMPORT JOBS
// ==================================================
export type ImportJob = {
  id: string;
  source_url: string | null;
  category: string | null;
  club: string | null;
  national_team: string | null;
  season: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  result: Record<string, unknown> | null;
  created_by: string | null;
  created_at: string;
  completed_at: string | null;
};

// ==================================================
// PAYMENT SETTINGS
// ==================================================
export type PaymentSetting = {
  id: string;
  provider: string;
  environment: "sandbox" | "production";
  public_key: string | null;
  is_active: boolean;
  config: Record<string, unknown>;
  last_test_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

// ==================================================
// HELPER TYPES
// ==================================================
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  error: string | null;
};

// ==================================================
// STORAGE TYPES
// ==================================================
export type StorageBucket = "products" | "avatars" | "banners" | "reviews";

export type UploadResult = {
  path: string;
  url: string;
  error: string | null;
};
