import { CartItem } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type Store = {
    items: CartItem[]
    addToCart: (item: Omit<CartItem, 'quantity'>) => void
    removeFromCart: (id: string) => void
    clearCart: () => void
    updateQuantity: (id: string, quantity: number) => void
    totalPrice: () => number
    getItemCount: () => number
}

export const useStore = create<Store>()(
    devtools(
        persist(
            (set, get) => ({
                items: [],

                addToCart: (item) =>
                    set((state) => {
                        const existing = state.items.find(
                            (i) => i.id === item.id
                        )

                        if (existing) {
                            return {
                                items: state.items.map((i) =>
                                    i.id === item.id
                                        ? { ...i, quantity: i.quantity + 1 }
                                        : i
                                ),
                            }
                        }

                        return {
                            items: [...state.items, { ...item, quantity: 1 }],
                        }
                    }),

                removeFromCart: (id) =>
                    set((state) => ({
                        items: state.items.filter((i) => i.id !== id),
                    })),

                updateQuantity: (id, quantity) =>
                    set((state) => ({
                        items: state.items.map((item) =>
                            item.id === id
                                ? { ...item, quantity: Math.max(1, quantity) }
                                : item
                        ),
                    })),

                clearCart: () => set({ items: [] }),

                totalPrice: () =>
                    get().items.reduce(
                        (total, item) => {
                            const price = parseFloat(item.sale_price) || parseFloat(item.regular_price);
                            return total + (price * item.quantity);
                        },
                        0
                    ),

                getItemCount: () =>
                    get().items.reduce((count, item) => count + item.quantity, 0),
            }),
            {
                name: 'cart-store',
            }
        )
    )
)
