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
    name: string;
    images: string;
    slug: string;
    category: string;
    quantity: number;
    regular_price: number;
    sale_price: number;
    description: string;
    color: string;
    product_type: 'top-selling' | 'trending' | 'featured' | 'new-arrival' | 'regular';
    inStock: boolean;
    rating: number;
    cartQty?: number;
    increaseQty?: number;
    decreaseQty?: number;
    created_at: string;
    updated_at: string;
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
  id: string;
  store_id: string;
  user_id: string;
  store_name: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  transaction_id: string;
  shipping_method: string;
  tracking_number: string;
  notes: string;
  estimated_delivery: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  product_image: string;
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
