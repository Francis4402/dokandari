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
    product_id: string;
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
    item_weight: number;
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
    item_weight: number;
    review?: number;
    created_at: string;
    updated_at: string;
}

export interface Orders {
    id: string;
    store_id: string;
    user_id: string;
    merchant_order_id: string;
    sender_name: string;
    sender_phone: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    recipient_city: number;
    recipient_zone: number;
    recipient_area: number;
    delivery_type: number;
    item_type: number;
    special_instruction?: string;
    item_quantity: number;
    item_weight: number;
    amount_to_collect: number;
    item_description: string;
    store_name: string;
    order_number: string;
    subtotal: number;
    delivery_charge: number;
    total: number;
    coupon_code: string;
    discount_amount: number;
    tracking_number: string;
    shipping_method: string;
    payment_method: string;
    payment_status: string;
    order_status: string;
    notes: string;
    items: string;

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
  weight: number;
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
