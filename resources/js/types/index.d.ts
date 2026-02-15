export interface ProductFilters {
    category: string;
    product_type: string;
    search: string;
    sort_by: string;
}

export interface User {
    id: number;
    name: string;
    images: string;
    email: string;
    role: string;
    email_verified_at: string;
}

export type CartItem = {
    id: string;
    user_id: string;
    store_id: string;
    store_name?: string;
    store_slug?: string;
    name: string;
    images: string;
    slug: string;
    category: string;
    quantity: number;
    regular_price: number;
    sale_price: number | null;
    description: string;
    color?: string;
    product_type: 'top-selling' | 'trending' | 'featured' | 'new-arrival' | 'regular';
    inStock: boolean;
    rating: number;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    store?: {
        id: string;
        name: string;
        slug: string;
    };
    created_at: string;
    updated_at: string;
    cartQty?: number;
}


export interface storeType {
    id: string;
    name: string;
    logo: string;
    storetype: string;
    license: string;
    address: string;
    mobile: string;
    rating: number;
    review_count: string;
    national_id: string;
    created_at: string;
    updated_at: string;
}

export interface categoryType {
    id: string;
    categories: string;
    subcategory: string;
    image: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    user_id: string;
    store_id: string;
    name: string;
    images: string;
    slug: string;
    category: string;
    subcategory: string;
    quantity: number;
    regular_price: number;
    sale_price: number;
    description: string;
    color: string;
    product_type: 'top-selling' | 'trending' | 'featured' | 'new-arrival' | 'regular';
    inStock: boolean;
    rating: number;
    review?: number;
    created_at: string;
    updated_at: string;
}

export interface Orders {
  // Core fields
  id: string;
  store_id: string;
  user_id: string;
  store_name: string;
  order_number: string;


  customer_name: string;
  customer_phone: string;
  customer_email: string | null;


  recipient_name: string;
  recipient_phone: string;
  recipient_phone_alt: string | null;
  recipient_address: string;

  // Pathao Location IDs
  pathao_city_id: number | null;
  pathao_city_name: string | null;
  pathao_zone_id: number | null;
  pathao_zone_name: string | null;
  pathao_area_id: number | null;
  pathao_area_name: string | null;

  // Pathao Delivery Settings
  delivery_type: 48 | 12;
  item_type: 1 | 2;
  special_instruction: string | null;
  item_description: string | null;

  // Order Items & Financials
  item_quantity: number;
  item_weight: number;
  amount_to_collect: number;
  subtotal: number;
  delivery_charge: number;
  cod_charge: number;
  total_charge: number;
  total: number;

  // Discount/Coupon
  coupon_code: string | null;
  discount_amount: number;

  // Tracking
  tracking_number: string | null;
  shipping_method: 'standard' | 'pathao';

  // Pathao Tracking
  pathao_order_id: string | null;
  pathao_consignment_id: string | null;
  pathao_order_status: string | null;
  pathao_response: any | null;

  // Order Status
  payment_method: 'cash_on_delivery' | 'bikash';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

  // Additional Fields
  notes: string | null;
  estimated_delivery: string | null;
  items: any | null;
  shipped_at: string | null;
  delivered_at: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Relationships
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  total: number;
  created_at?: string;
  updated_at?: string;
}

export interface citytypes {
    city_id: number;
    city_name: string;
}

export interface zonetypes {
    zone_id: number;
    zone_name: string;
}

export interface areatypes {
    area_id: number;
    area_name: string;
    home_delivery_available: boolean;
    pickup_available: boolean;
}

export interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  averageOrderValue: number;
  recentOrders: Orders[];
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
