import { citytypes, zonetypes, areatypes, CartItem, storeType } from '@/types'
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface OrderData {
    user_id: string;
    sender_name: string;
    sender_email: string;
    sender_phone: string;

    // Recipient Info
    recipient_name: string;
    recipient_phone: string;
    recipient_email: string;
    recipient_address: string;

    // Pathao fields
    pathao_city: string;
    pathao_city_name?: string;
    pathao_zone: string;
    pathao_zone_name?: string;
    pathao_area?: string;
    pathao_area_name?: string;

    // Additional
    notes?: string;
    payment_method: 'cash_on_delivery' | 'bikash';
}

export interface PathaoCharges {
    delivery_charge: number;
}

type Store = {
    // Cart state
    cart: CartItem[];

    // Shipping state
    pathaoCharges: PathaoCharges | null;
    selectedCity: string;
    selectedZone: string;
    selectedArea: string;
    cities: citytypes[];
    zones: zonetypes[];
    areas: areatypes[];

    // Cart actions
    addToCart: (product: CartItem, store: storeType, quantity?: number) => void;
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
        store_name: string;
        store_phone: string;
        store_email: string;
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

    processCheckout: (orderData: OrderData) => Promise<void>;

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

                // Updated addToCart to accept store parameter
                addToCart: (product, store, quantity = 1) =>
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

                        // Create cart item with store information
                        const cartItem: CartItem = {
                            ...product,
                            store: store, // Store the full store object
                            cartQty: quantity,
                            item_weight: product.item_weight || 0.5,
                            store_id: store.id, // Ensure store_id is set
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

                // Updated to include store information
                getFormattedCartItems: () => {
                    const cart = get().cart;
                    return cart.map(item => {
                        const price = item.sale_price || item.regular_price;
                        const quantity = Math.max(1, item.cartQty || 1);
                        const weight = item.item_weight || 0.5;

                        return {
                            product_id: item.id,
                            name: item.name,
                            quantity: quantity,
                            price: price,
                            total: price * quantity,
                            store_id: item.store_id || item.store?.id || '',
                            store_name: item.store?.name || '',
                            store_phone: item.store?.mobile,
                            store_email: item.store?.email || '',
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

                processCheckout: async (orderData: OrderData) => {
                    const state = get();

                    if (state.cart.length === 0) {
                        toast.error('Your cart is empty');
                        return Promise.reject('Cart is empty');
                    }

                    const formattedItems = state.getFormattedCartItems();
                    const summary = state.getOrderSummary();

                    // Get store information from cart items (assuming all items are from same store)
                    const storeInfo = state.cart[0]?.store;
                    if (!storeInfo) {
                        toast.error('Store information missing');
                        return Promise.reject('Store information missing');
                    }

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
                    if (!state.selectedCity || !state.selectedZone) {
                        toast.error('Please select city and zone');
                        return Promise.reject('Incomplete delivery info');
                    }

                    if (!state.pathaoCharges) {
                        toast.error('Please calculate shipping charges');
                        return Promise.reject('Shipping charges are required');
                    }

                    const selectedCityData = state.cities.find(c => c.city_id === parseInt(state.selectedCity));
                    const selectedZoneData = state.zones?.find(z => z.zone_id === parseInt(state.selectedZone));
                    const selectedAreaData = state.selectedArea
                        ? state.areas?.find(a => a.area_id === parseInt(state.selectedArea))
                        : null;

                    const generateOrderNumber = () => {
                        const prefix = 'ORD';
                        const timestamp = Date.now().toString().slice(-8);
                        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                        return `${prefix}-${timestamp}-${random}`;
                    };

                    const generateTrackingNumber = () => {
                        const prefix = 'TRK';
                        const timestamp = Date.now().toString().slice(-8);
                        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                        return `${prefix}-${timestamp}-${random}`;
                    };

                    const orderNumber = generateOrderNumber();
                    const trackingNumber = generateTrackingNumber();

                    // Create order payload
                    const orderPayload: any = {
                        // Store ID (from store)
                        store_id: storeInfo.id,
                        // User ID from orderData
                        user_id: orderData.user_id,

                        // Order Identifiers
                        order_number: orderNumber,
                        merchant_order_id: orderNumber,

                        // Sender Info - FROM THE STORE (store owner)
                        sender_name: storeInfo.name,
                        sender_phone: storeInfo.mobile || '',
                        sender_email: storeInfo.email || '',

                        // Recipient Info - FROM THE CUSTOMER (person ordering)
                        recipient_name: orderData.recipient_name,
                        recipient_phone: orderData.recipient_phone,
                        recipient_email: orderData.recipient_email,
                        recipient_address: selectedAreaData
                            ? `${orderData.recipient_address}, ${selectedAreaData.area_name}, ${selectedZoneData?.zone_name}, ${selectedCityData?.city_name}`
                            : `${orderData.recipient_address}, ${selectedZoneData?.zone_name}, ${selectedCityData?.city_name}`,
                        recipient_city: parseInt(state.selectedCity),
                        recipient_zone: parseInt(state.selectedZone),

                        // Only include recipient_area if area is selected
                        ...(state.selectedArea && { recipient_area: parseInt(state.selectedArea) }),

                        // Pathao Settings
                        delivery_type: 48,
                        item_type: 2,
                        special_instruction: orderData.notes || null,

                        // Order Details
                        item_quantity: summary.item_count,
                        item_weight: summary.total_weight,
                        amount_to_collect: summary.total,
                        item_description: 'Products order',
                        store_name: storeInfo.name,

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
                        // Keep items as array
                        items: formattedItems,
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
                        store: item.store,
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
