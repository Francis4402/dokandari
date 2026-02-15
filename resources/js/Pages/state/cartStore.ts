import { CartItem, citytypes, zonetypes, areatypes } from '@/types'
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
    shipping_method?: 'standard' | 'pathao';
    pathao_city?: string;
    pathao_city_name?: string;
    pathao_zone?: string;
    pathao_zone_name?: string;
    pathao_area?: string;
    pathao_area_name?: string;
    pathao_charges?: {
        delivery_charge: number;
        cod_charge?: number;
        total_charge: number;
    } | null;
    estimated_delivery?: string;
    tracking_number?: string;
}

export interface PathaoCharges {
    delivery_charge: number;
    cod_charge?: number;
    total_charge: number;
}



type Store = {
    // Cart state
    cart: CartItem[];

    // Shipping state
    shippingMethod: 'standard' | 'pathao';
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

    // Shipping actions
    setShippingMethod: (method: 'standard' | 'pathao') => void;
    setPathaoCharges: (charges: PathaoCharges | null) => void;
    setSelectedCity: (cityId: string) => void;
    setSelectedZone: (zoneId: string) => void;
    setSelectedArea: (areaId: string) => void;
    setCities: (cities: citytypes[]) => void;
    setZonesCart: (zones: zonetypes[]) => void;
    setAreasCart: (areas: areatypes[]) => void;

    // Utility functions
    getFormattedCartItems: () => Array<{
        id: string;
        product_id: string;
        name: string;
        quantity: number;
        price: number;
        total: number;
        image: string;
        store_name?: string;
        store_id?: string;
    }>;

    getOrderSummary: () => {
        subtotal: number;
        shipping: number;
        tax: number;
        total: number;
        item_count: number;
        total_weight?: number;
        discount?: number;
    };

    processCheckout: (orderData: OrderData) => Promise<void>;
    resetShippingState: () => void;
    isChittagong: () => boolean;
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
                shippingMethod: 'standard',
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

                // Cart actions
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
                                        ? {
                                              ...item,
                                              cartQty: newQty,
                                          }
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
                            weight: product.weight || 0.5,
                            dimensions: product.dimensions || {
                                length: 10,
                                width: 10,
                                height: 10,
                            },
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
                                    ? {
                                          ...item,
                                          cartQty: Math.max((item.cartQty || 1) - 1, 1),
                                      }
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
                                    item.id === id
                                        ? { ...item, cartQty: quantity }
                                        : item
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
                        shippingMethod: 'standard',
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

                // Coupon actions
                setCoupon: (code, discount) =>
                    set({
                        couponCode: code,
                        discountAmount: discount,
                    }),

                removeCoupon: () =>
                    set({
                        couponCode: null,
                        discountAmount: 0,
                    }),

                // Getters
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

                getTax: () => {
                    const taxRate = 0.10;
                    return get().getSubTotal() * taxRate;
                },

                getShipping: () => {
                    const { shippingMethod, pathaoCharges, selectedCity, cities } = get();

                    if (shippingMethod === 'pathao' && pathaoCharges) {
                        return pathaoCharges.total_charge;
                    }

                    if (shippingMethod === 'pathao' && selectedCity) {
                        const selectedCityData = cities.find(city => city.city_id === parseInt(selectedCity));
                        const isChittagong = selectedCityData?.city_name?.toLowerCase().includes('chittagong') ||
                                            selectedCityData?.city_name?.toLowerCase().includes('chattogram');
                        return isChittagong ? 80 : 120;
                    }

                    return get().cart.length > 0 ? 120 : 0;
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

                // Shipping actions
                setShippingMethod: (method) =>
                    set({
                        shippingMethod: method,
                        ...(method === 'standard' ? {
                            pathaoCharges: null,
                            selectedCity: '',
                            selectedZone: '',
                            selectedArea: ''
                        } : {})
                    }),

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
                        shippingMethod: 'standard',
                        pathaoCharges: null,
                        selectedCity: '',
                        selectedZone: '',
                        selectedArea: ''
                    }),

                // Helper functions
                isChittagong: () => {
                    const { selectedCity, cities } = get();
                    if (!selectedCity) return false;

                    const selectedCityData = cities.find(city => city.city_id === parseInt(selectedCity));
                    return selectedCityData?.city_name?.toLowerCase().includes('chittagong') ||
                           selectedCityData?.city_name?.toLowerCase().includes('chattogram') ||
                           false;
                },

                // FIXED: getFormattedCartItems with guaranteed quantity
                getFormattedCartItems: () => {
                    const cart = get().cart;
                    return cart.map(item => {
                        try {
                            let imageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';

                            if (item.images) {
                                try {
                                    const parsed = JSON.parse(item.images as string);
                                    const firstImage = Array.isArray(parsed) ? parsed[0] : parsed;
                                    if (firstImage) {
                                        imageUrl = `/product_images/${firstImage}`;
                                    }
                                } catch {
                                    if (typeof item.images === 'string' && item.images) {
                                        imageUrl = `/product_images/${item.images}`;
                                    }
                                }
                            }

                            const price = item.sale_price || item.regular_price;
                            // Ensure quantity is always a positive number
                            const quantity = Math.max(1, item.cartQty || 1);

                            return {
                                id: item.id,
                                product_id: item.id,
                                name: item.name,
                                quantity: quantity,
                                price: price,
                                total: price * quantity,
                                image: imageUrl,
                                store_name: item.store_name,
                                store_id: item.store_id,
                            };
                        } catch (error) {
                            console.error('Error formatting cart item:', error);
                            const quantity = Math.max(1, item.cartQty || 1);
                            return {
                                id: item.id,
                                product_id: item.id,
                                name: item.name,
                                quantity: quantity,
                                price: item.sale_price || item.regular_price,
                                total: (item.sale_price || item.regular_price) * quantity,
                                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
                            };
                        }
                    });
                },

                getOrderSummary: () => {
                    const subtotal = get().getSubTotal();
                    const tax = get().getTax();
                    const shipping = get().getShipping();
                    const total = get().getTotal();
                    const item_count = get().getTotalItems();
                    const total_weight = get().cart.reduce((sum, item) =>
                        sum + ((item.weight || 0.5) * (item.cartQty || 1)), 0
                    );
                    const discount = get().discountAmount;

                    return {
                        subtotal,
                        tax,
                        shipping,
                        total,
                        item_count,
                        total_weight,
                        discount,
                    };
                },

                // FIXED: processCheckout with all required fields
                processCheckout: async (orderData: OrderData) => {
                    const state = get();

                    // Validate cart
                    if (state.cart.length === 0) {
                        toast.error('Your cart is empty');
                        return Promise.reject('Cart is empty');
                    }

                    // Get formatted items with guaranteed quantity
                    const formattedItems = state.getFormattedCartItems();

                    // Validate each item has quantity
                    for (const item of formattedItems) {
                        if (!item.quantity || item.quantity < 1) {
                            toast.error(`Invalid quantity for item: ${item.name}`);
                            return Promise.reject('Invalid quantity');
                        }
                    }

                    const summary = state.getOrderSummary();

                    // Get city, zone, area names and IDs
                    const selectedCityData = state.cities.find(c => c.city_id === parseInt(state.selectedCity));
                    const selectedZoneData = state.zones?.find(z => z.zone_id === parseInt(state.selectedZone));
                    const selectedAreaData = state.areas?.find(a => a.area_id === parseInt(state.selectedArea));

                    // Calculate estimated delivery date
                    const calculateEstimatedDelivery = () => {
                        const today = new Date();
                        const isChittagong = selectedCityData?.city_name?.toLowerCase().includes('chittagong') ||
                                            selectedCityData?.city_name?.toLowerCase().includes('chattogram');
                        const isDhaka = selectedCityData?.city_name?.toLowerCase().includes('dhaka');

                        if (state.shippingMethod === 'pathao') {
                            if (isDhaka) {
                                today.setDate(today.getDate() + 1);
                            } else if (isChittagong) {
                                today.setDate(today.getDate() + 2);
                            } else {
                                today.setDate(today.getDate() + 3);
                            }
                        } else {
                            today.setDate(today.getDate() + 7);
                        }

                        return today.toISOString().split('T')[0];
                    };

                    // Generate tracking number for Pathao orders
                    const generateTrackingNumber = () => {
                        if (state.shippingMethod === 'pathao') {
                            const prefix = 'PA-THAO';
                            const timestamp = Date.now().toString().slice(-8);
                            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                            return `${prefix}-${timestamp}-${random}`;
                        }
                        return null;
                    };

                    const trackingNumber = generateTrackingNumber();
                    const estimatedDelivery = calculateEstimatedDelivery();

                    // Calculate Pathao charges
                    const pathaoDeliveryCharge = state.pathaoCharges?.delivery_charge || (state.isChittagong() ? 80 : 120);
                    const pathaoCodCharge = state.pathaoCharges?.cod_charge || 0;
                    const pathaoTotalCharge = state.pathaoCharges?.total_charge || pathaoDeliveryCharge;

                    // Build complete order payload with ALL required fields
                    const orderPayload = {
                        // Customer/Recipient Information (frontend names)
                        customer_name: orderData.customer_name,
                        customer_phone: orderData.customer_phone,
                        customer_address: orderData.customer_address,
                        customer_email: orderData.customer_email,

                        // Optional recipient alt phone
                        recipient_phone_alt: null,

                        // Order items
                        items: formattedItems.map(item => ({
                            product_id: item.product_id,
                            name: item.name,
                            quantity: item.quantity,
                            price: item.price,
                            total: item.total,
                            store_id: item.store_id,
                        })),

                        // Order summary (frontend names)
                        subtotal: summary.subtotal,
                        shipping: summary.shipping, // This maps to delivery_charge in backend
                        tax: summary.tax,
                        total: summary.total,
                        item_count: summary.item_count,
                        total_weight: summary.total_weight || 0.5,
                        amount_to_collect: summary.total, // Required for COD

                        // Payment
                        payment_method: orderData.payment_method,

                        // Shipping
                        shipping_method: state.shippingMethod,
                        tracking_number: trackingNumber,
                        estimated_delivery: estimatedDelivery,

                        // Pathao specific (frontend names)
                        ...(state.shippingMethod === 'pathao' ? {
                            pathao_city: state.selectedCity,
                            pathao_city_name: selectedCityData?.city_name || '',
                            pathao_zone: state.selectedZone,
                            pathao_zone_name: selectedZoneData?.zone_name || '',
                            pathao_area: state.selectedArea,
                            pathao_area_name: selectedAreaData?.area_name || '',
                            pathao_delivery_charge: pathaoDeliveryCharge,
                            pathao_cod_charge: pathaoCodCharge,
                            pathao_total_charge: pathaoTotalCharge,
                        } : {}),

                        // Coupon
                        coupon_code: state.couponCode,
                        discount_amount: state.discountAmount,

                        // Additional
                        notes: orderData.notes || '',
                    };

                    // Debug log
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
                                // Show validation errors to user
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
                    cart: state.cart,
                    shippingMethod: state.shippingMethod,
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
        {
            name: 'CartStore',
            enabled: true,
            serialize: { options: true },
        }
    )
);
