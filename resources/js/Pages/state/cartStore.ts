import { CartItem } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

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
                            sum + Number(item.sale_price) * item.cartQty!,
                        0
                    ),

                getTax: () => {
                    const taxRate = 0.10 // 5%
                    return get().getSubTotal() * taxRate
                },

                getShipping: () => (get().cart.length > 0 ? 120 : 0),

                getTotal: () =>
                    get().getSubTotal() +
                    get().getTax() +
                    get().getShipping(),
            }),
            {
                name: 'cart-store',
            }
        )
    )
)
