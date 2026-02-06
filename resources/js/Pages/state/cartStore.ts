import { CartItem } from '@/types'
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface OrderData {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    notes?: string;
    payment_method: string;
}

type Store = {
    cart: CartItem[],
    addToCart: (product: CartItem) => void
    removeFromCart: (id: string) => void
    clearCart: () => void
    getTotalItems: () => number
    getItemById: (id: string) => CartItem | undefined
    getSubTotal: () => number
    getTax: () => number
    getShipping: () => number
    getTotal: () => number
    increaseQty: (id:string) => void
    decreaseQty: (id:string) => void
    getFormattedCartItems: () => Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
        total: number;
        image: string;
    }>
    getOrderSummary: () => {
        subtotal: number;
        shipping: number;
        tax: number;
        total: number;
        item_count: number;
    }
    processCheckout: (orderData: OrderData) => Promise<void>
}


export const useStore = create<Store>()(
    devtools(
        persist(
            (set, get) => ({
                cart: [],

                addToCart: (product) =>
                    set((state) => {
                        const existing = state.cart.find(
                            (item) => item.id === product.id
                        )

                        // If already in cart → increase by 1
                        if (existing) {
                            if (existing.cartQty! >= existing.quantity) {
                                return state // stop at DB quantity
                            }

                            return {
                                cart: state.cart.map((item) =>
                                    item.id === product.id
                                        ? {
                                              ...item,
                                              cartQty: item.cartQty! + 1,
                                          }
                                        : item
                                ),
                            }
                        }

                        // First time add → cartQty starts at 1
                        return {
                            cart: [
                                ...state.cart,
                                {
                                    ...product,
                                    cartQty: 1,
                                },
                            ],
                        }
                    }),

                    increaseQty: (id) =>
                    set((state) => ({
                        cart: state.cart.map((item) =>
                            item.id === id && item.cartQty! < item.quantity
                                ? { ...item, cartQty: item.cartQty! + 1 }
                                : item
                        ),
                    })),

                    decreaseQty: (id) =>
                    set((state) => ({
                        cart: state.cart
                            .map((item) =>
                                item.id === id
                                    ? {
                                          ...item,
                                          cartQty: item.cartQty! - 1,
                                      }
                                    : item
                            )
                            .filter((item) => item.cartQty! > 0),
                    })),

                removeFromCart: (id) =>
                    set((state) => ({
                        cart: state.cart.filter((item) => item.id !== id),
                    })),


                clearCart: () => set({ cart: [] }),

                getTotalItems: () =>
                    get().cart.reduce((sum, item) => sum + item.cartQty!, 0),

                getItemById: (id) =>
                    get().cart.find((item) => item.id === id),

                getSubTotal: () =>
                    get().cart.reduce(
                        (sum, item) =>
                            sum + (item.sale_price || item.regular_price) * item.cartQty!,
                        0
                    ),

                getTax: () => {
                    const taxRate = 0.10 // 10%
                    return get().getSubTotal() * taxRate
                },

                getShipping: () => (get().cart.length > 0 ? 120 : 0),

                getTotal: () =>
                    get().getSubTotal() +
                    get().getTax() +
                    get().getShipping(),


                getFormattedCartItems: () => {
                    const cart = get().cart;
                    return cart.map(item => {
                        const images = JSON.parse(item.images);
                        const firstImage = Array.isArray(images) ? images[0] : images;
                        const price = item.sale_price || item.regular_price;

                        return {
                            id: item.id,
                            name: item.name,
                            quantity: item.cartQty!,
                            price: price,
                            total: price * item.cartQty!,
                            image: firstImage
                        };
                    });
                },

                getOrderSummary: () => {
                    const subtotal = get().getSubTotal();
                    const tax = get().getTax();
                    const shipping = get().getShipping();
                    const total = get().getTotal();
                    const item_count = get().getTotalItems();

                    return {
                        subtotal,
                        tax,
                        shipping,
                        total,
                        item_count
                    };
                },

                processCheckout: async (orderData: OrderData) => {
                    const summary = get().getOrderSummary();

                    const orderPayload = {
                        customer_name: orderData.customer_name,
                        customer_email: orderData.customer_email,
                        customer_phone: orderData.customer_phone,
                        customer_address: orderData.customer_address,
                        notes: orderData.notes || '',

                        items: get().cart.map(item => ({
                            product_id: item.id,
                            quantity: item.cartQty!,
                            price: item.sale_price || item.regular_price,
                        })),

                        subtotal: summary.subtotal,
                        shipping: summary.shipping,
                        tax: summary.tax,
                        total: summary.total,
                        item_count: summary.item_count,

                        payment_method: orderData.payment_method,
                    };

                    return new Promise<void>((resolve, reject) => {
                        router.post('/orders', orderPayload, {
                        onSuccess: () => {
                            toast.success('Order successfully placed');
                            get().clearCart();
                            resolve();
                        },
                        onError: (errors) => reject(errors),
                        });
                    });
                }
            }),
            {
                name: 'cart-store',
                partialize: (state) => ({
                    cart: state.cart
                })
            }
        )
    )
)
