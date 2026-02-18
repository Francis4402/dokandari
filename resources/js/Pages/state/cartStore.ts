import { CartItem, citytypes, zonetypes, areatypes, Orders } from '@/types'
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface OrderData {
    // Customer Info
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    notes?: string;
    payment_method: 'cash_on_delivery' | 'bikash';

    // Pathao fields (for frontend use)
    pathao_city?: string;
    pathao_city_name?: string;
    pathao_zone?: string;
    pathao_zone_name?: string;
    pathao_area?: string;
    pathao_area_name?: string;
}

export interface PathaoCharges {
    delivery_charge: number;
}


export type OrderPayload = {

    store_id: string;

    merchant_order_id?: string | null;
    order_number: string;

    // Sender Info
    sender_name: string;
    sender_phone: string;

    // Recipient Info
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    recipient_city: number;
    recipient_zone: number;
    recipient_area: number;

    // Pathao Settings
    delivery_type: number;
    item_type: number;
    special_instruction?: string | null;

    // Order Details
    item_quantity: number;
    item_weight: number;
    amount_to_collect: number;
    item_description: string;
    store_name: string;

    // Financials
    subtotal: number;
    delivery_charge: number;
    total: number;
    coupon_code?: string | null;
    discount_amount?: number;

    // Tracking
    tracking_number?: string | null;
    shipping_method: string;

    // Status
    payment_method: string;
    payment_status: string;
    order_status: string;

    // Additional
    notes?: string | null;
    items: Array<{
        product_id: string;
        name: string;
        quantity: number;
        price: number;
        total: number;
        store_id: string;
        item_weight: number;
    }>;

    // Customer info (for reference)
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    customer_address?: string;
}

type Store = {
    // Cart state
    cart: CartItem[];

    // Shipping state - only Pathao now
    pathaoCharges: PathaoCharges | null;
    selectedCity: string;
    selectedZone: string;
    selectedArea: string;
    cities: citytypes[];
    zones: zonetypes[];
    areas: areatypes[];

    // Cart actions
    addToCart: (product: CartItem, quantity?: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getSubTotal: () => number;
    getTax: () => number;
    getShipping: () => number;
    getTotal: () => number;
    increaseQty: (id: string) => void;
    decreaseQty: (id: string) => void;
    updateCartItemQty: (id: string, quantity: number) => void;

    // Pathao shipping actions
    setPathaoCharges: (charges: PathaoCharges | null) => void;
    setSelectedCity: (cityId: string) => void;
    setSelectedZone: (zoneId: string) => void;
    setSelectedArea: (areaId: string) => void;
    setCities: (cities: citytypes[]) => void;
    setZonesCart: (zones: zonetypes[]) => void;
    setAreasCart: (areas: areatypes[]) => void;

    // Utility functions
    getFormattedCartItems: () => Array<{
        product_id: string;
        name: string;
        quantity: number;
        price: number;
        total: number;
        store_id: string;
        item_weight: number;
    }>;

    getOrderSummary: () => {
        subtotal: number;
        shipping: number;
        tax: number;
        total: number;
        item_count: number;
        total_weight: number;
        discount?: number;
    };

    processCheckout: (orderData: OrderData, store: { name: string; phone?: string; mobile?: string; id: string }) => Promise<void>;
    resetShippingState: () => void;
    getItemById: (id: string) => CartItem | undefined;

    // Cart metadata
    lastUpdated: string | null;
    couponCode: string | null;
    discountAmount: number;
    setCoupon: (code: string, discount: number) => void;
    removeCoupon: () => void;
}

export const useStore = create<Store>()(
    devtools(
        persist(
            (set, get) => ({
                cart: [],
                pathaoCharges: null,
                selectedCity: '',
                selectedZone: '',
                selectedArea: '',
                cities: [],
                zones: [],
                areas: [],
                lastUpdated: null,
                couponCode: null,
                discountAmount: 0,

                addToCart: (product, quantity = 1) =>
                    set((state) => {
                        const existing = state.cart.find(
                            (item) => item.id === product.id
                        );

                        if (existing) {
                            const newQty = (existing.cartQty || 1) + quantity;
                            if (newQty > (product.quantity || 0)) {
                                toast.error('Maximum quantity reached');
                                return state;
                            }

                            return {
                                cart: state.cart.map((item) =>
                                    item.id === product.id
                                        ? { ...item, cartQty: newQty }
                                        : item
                                ),
                                lastUpdated: new Date().toISOString(),
                            };
                        }

                        const cartItem: CartItem = {
                            ...product,
                            cartQty: quantity,
                            store_name: product.store?.name || product.store_name,
                            store_slug: product.store?.slug || product.store_slug,
                            item_weight: product.item_weight || 0.5,
                        };

                        toast.success(`${product.name} added to cart`);
                        return {
                            cart: [...state.cart, cartItem],
                            lastUpdated: new Date().toISOString(),
                        };
                    }),

                increaseQty: (id) =>
                    set((state) => {
                        const item = state.cart.find(item => item.id === id);
                        if (item) {
                            if (item.cartQty! >= (item.quantity || 0)) {
                                toast.error('Maximum quantity reached');
                                return state;
                            }

                            return {
                                cart: state.cart.map((item) =>
                                    item.id === id
                                        ? { ...item, cartQty: (item.cartQty || 1) + 1 }
                                        : item
                                ),
                                lastUpdated: new Date().toISOString(),
                            };
                        }
                        return state;
                    }),

                decreaseQty: (id) =>
                    set((state) => ({
                        cart: state.cart
                            .map((item) =>
                                item.id === id
                                    ? { ...item, cartQty: Math.max((item.cartQty || 1) - 1, 1) }
                                    : item
                            )
                            .filter((item) => (item.cartQty || 0) > 0),
                        lastUpdated: new Date().toISOString(),
                    })),

                updateCartItemQty: (id, quantity) =>
                    set((state) => {
                        const item = state.cart.find(item => item.id === id);
                        if (item) {
                            if (quantity > (item.quantity || 0)) {
                                toast.error('Maximum quantity reached');
                                return state;
                            }

                            return {
                                cart: state.cart.map((item) =>
                                    item.id === id ? { ...item, cartQty: quantity } : item
                                ),
                                lastUpdated: new Date().toISOString(),
                            };
                        }
                        return state;
                    }),

                removeFromCart: (id) =>
                    set((state) => {
                        const item = state.cart.find(item => item.id === id);
                        if (item) {
                            toast.success(`${item.name} removed from cart`);
                        }
                        return {
                            cart: state.cart.filter((item) => item.id !== id),
                            lastUpdated: new Date().toISOString(),
                        };
                    }),

                clearCart: () => {
                    set({
                        cart: [],
                        pathaoCharges: null,
                        selectedCity: '',
                        selectedZone: '',
                        selectedArea: '',
                        couponCode: null,
                        discountAmount: 0,
                        lastUpdated: new Date().toISOString(),
                    });
                    toast.success('Cart cleared');
                },

                setCoupon: (code, discount) =>
                    set({ couponCode: code, discountAmount: discount }),

                removeCoupon: () =>
                    set({ couponCode: null, discountAmount: 0 }),

                getTotalItems: () =>
                    get().cart.reduce((sum, item) => sum + (item.cartQty || 1), 0),

                getItemById: (id: string) =>
                    get().cart.find((item) => item.id === id),

                getSubTotal: () =>
                    get().cart.reduce(
                        (sum, item) =>
                            sum + ((item.sale_price || item.regular_price) * (item.cartQty || 1)),
                        0
                    ),

                getTax: () => get().getSubTotal() * 0.10,

                getShipping: () => {
                    const { pathaoCharges } = get();
                    return pathaoCharges ? pathaoCharges.delivery_charge : 0;
                },

                getTotal: () => {
                    const subtotal = get().getSubTotal();
                    const tax = get().getTax();
                    const shipping = get().getShipping();
                    const discount = get().discountAmount;

                    let discountValue = 0;
                    if (get().couponCode) {
                        discountValue = (subtotal * discount) / 100;
                    }

                    return subtotal + tax + shipping - discountValue;
                },

                setPathaoCharges: (charges) =>
                    set({ pathaoCharges: charges }),

                setSelectedCity: (cityId) =>
                    set({
                        selectedCity: cityId,
                        selectedZone: '',
                        selectedArea: '',
                        pathaoCharges: null
                    }),

                setSelectedZone: (zoneId) =>
                    set({
                        selectedZone: zoneId,
                        selectedArea: '',
                        pathaoCharges: null
                    }),

                setSelectedArea: (areaId) =>
                    set({ selectedArea: areaId }),

                setCities: (cities) =>
                    set({ cities }),

                setZonesCart: (zones) =>
                    set({ zones }),

                setAreasCart: (areas) =>
                    set({ areas }),

                resetShippingState: () =>
                    set({
                        pathaoCharges: null,
                        selectedCity: '',
                        selectedZone: '',
                        selectedArea: ''
                    }),

                getFormattedCartItems: () => {
                    const cart = get().cart;
                    return cart.map(item => {
                        const price = item.sale_price || item.regular_price;
                        const quantity = Math.max(1, item.cartQty || 1);
                        const weight = item.item_weight || 0.5;

                        return {
                            product_id: item.id, // Use item.id as product_id
                            name: item.name,
                            quantity: quantity,
                            price: price,
                            total: price * quantity,
                            store_id: item.store_id,
                            item_weight: weight,
                        };
                    });
                },

                getOrderSummary: () => {
                    const subtotal = get().getSubTotal();
                    const tax = get().getTax();
                    const shipping = get().getShipping();
                    const total = get().getTotal();
                    const item_count = get().getTotalItems();

                    const total_weight = get().cart.reduce((sum, item) => {
                        const weight = item.item_weight || 0.5;
                        const quantity = item.cartQty || 1;
                        return sum + (weight * quantity);
                    }, 0);

                    return {
                        subtotal,
                        tax,
                        shipping,
                        total,
                        item_count,
                        total_weight,
                        discount: get().discountAmount,
                    };
                },

                processCheckout: async (orderData: OrderData, store: { name: string; phone?: string; mobile?: string; id: string }) => {
                    const state = get();

                    if (state.cart.length === 0) {
                        toast.error('Your cart is empty');
                        return Promise.reject('Cart is empty');
                    }

                    const formattedItems = state.getFormattedCartItems();
                    const summary = state.getOrderSummary();

                    // Validate items
                    for (const item of formattedItems) {
                        if (!item.quantity || item.quantity < 1) {
                            toast.error(`Invalid quantity for item: ${item.name}`);
                            return Promise.reject('Invalid quantity');
                        }
                        if (!item.item_weight || item.item_weight < 0.1) {
                            toast.error(`Invalid weight for item: ${item.name}`);
                            return Promise.reject('Invalid weight');
                        }
                    }

                    // Validate Pathao data
                    if (!state.selectedCity || !state.selectedZone || !state.selectedArea || !state.pathaoCharges) {
                        toast.error('Please complete all delivery information');
                        return Promise.reject('Incomplete delivery info');
                    }

                    const selectedCityData = state.cities.find(c => c.city_id === parseInt(state.selectedCity));
                    const selectedZoneData = state.zones?.find(z => z.zone_id === parseInt(state.selectedZone));
                    const selectedAreaData = state.areas?.find(a => a.area_id === parseInt(state.selectedArea));

                    const generateOrderNumber = () => {
                        const prefix = 'ORD';
                        const timestamp = Date.now().toString().slice(-8);
                        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                        return `${prefix}-${timestamp}-${random}`;
                    };

                    const generateTrackingNumber = () => {
                        const prefix = 'PA-THAO';
                        const timestamp = Date.now().toString().slice(-8);
                        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                        return `${prefix}-${timestamp}-${random}`;
                    };

                    const orderNumber = generateOrderNumber();
                    const trackingNumber = generateTrackingNumber();

                    // Build payload matching your Orders interface (without product_id)
                    const orderPayload = {
                        // Store ID
                        store_id: store.id,

                        // Order Identifiers
                        order_number: orderNumber,
                        merchant_order_id: orderNumber,

                        // Sender Info
                        sender_name: store.name,
                        sender_phone: store.phone || store.mobile || '',

                        // Recipient Info
                        recipient_name: orderData.customer_name,
                        recipient_phone: orderData.customer_phone,
                        recipient_address: `${orderData.customer_address}, ${selectedAreaData?.area_name || ''}, ${selectedZoneData?.zone_name || ''}, ${selectedCityData?.city_name || ''}`,
                        recipient_city: parseInt(state.selectedCity),
                        recipient_zone: parseInt(state.selectedZone),
                        recipient_area: parseInt(state.selectedArea),

                        // Pathao Settings
                        delivery_type: 48,
                        item_type: 2,
                        special_instruction: orderData.notes || null,

                        // Order Details
                        item_quantity: summary.item_count,
                        item_weight: summary.total_weight,
                        amount_to_collect: summary.total,
                        item_description: 'Products order',
                        store_name: store.name,

                        // Financials
                        subtotal: summary.subtotal,
                        delivery_charge: state.pathaoCharges.delivery_charge,
                        total: summary.total,
                        coupon_code: state.couponCode || null,
                        discount_amount: state.discountAmount || 0,

                        // Tracking
                        tracking_number: trackingNumber,
                        shipping_method: 'pathao',

                        // Status
                        payment_method: orderData.payment_method,
                        payment_status: 'pending',
                        order_status: 'pending',

                        // Additional
                        notes: orderData.notes || null,
                        items: formattedItems,

                        // Customer info (for reference)
                        customer_name: orderData.customer_name,
                        customer_email: orderData.customer_email,
                        customer_phone: orderData.customer_phone,
                        customer_address: orderData.customer_address,
                    };

                    console.log('📦 Order Payload:', JSON.stringify(orderPayload, null, 2));

                    return new Promise<void>((resolve, reject) => {
                        router.post('/orders', orderPayload, {
                            onSuccess: () => {
                                toast.success('Order successfully placed!');
                                get().clearCart();
                                resolve();
                            },
                            onError: (errors) => {
                                console.error('❌ Checkout error:', errors);
                                if (typeof errors === 'object') {
                                    Object.entries(errors).forEach(([field, message]) => {
                                        toast.error(`${field}: ${message}`);
                                    });
                                } else {
                                    toast.error('Failed to place order. Please try again.');
                                }
                                reject(errors);
                            },
                        });
                    });
                }
            }),
            {
                name: 'cart-storage',
                version: 1,
                partialize: (state) => ({
                    cart: state.cart.map(item => ({
                        ...item,
                        item_weight: item.item_weight || 0.5,
                    })),
                    pathaoCharges: state.pathaoCharges,
                    selectedCity: state.selectedCity,
                    selectedZone: state.selectedZone,
                    selectedArea: state.selectedArea,
                    cities: state.cities,
                    zones: state.zones,
                    areas: state.areas,
                    couponCode: state.couponCode,
                    discountAmount: state.discountAmount,
                    lastUpdated: state.lastUpdated,
                }),
            }
        ),
        { name: 'CartStore', enabled: true }
    )
);
