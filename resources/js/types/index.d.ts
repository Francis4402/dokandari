export interface User {
    id: number;
    name: string;
    images: string;
    email: string;
    role: string;
    email_verified_at: string;
}

export interface storeType {
    id: string;
    name: string;
    logo: string;
    storetype: string;
    license: string;
}

export interface Product {
  id: string;
  user_id: string;
  store_id: string;
  name: string;
  images: string;
  slug: string;
  category: string;
  quantity: number;
  regular_price: string;
  sale_price: string | null;
  description: string;
  inStock: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
