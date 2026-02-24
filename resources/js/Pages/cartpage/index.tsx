import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowRight,
  FaArrowLeft,
  FaCreditCard,
  FaTag,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaHeart,
  FaCheckCircle,
  FaLock,
  FaBox,
  FaTimes,
  FaStar,
  FaMapMarkerAlt,
  FaTruckLoading,
} from 'react-icons/fa';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import { areatypes, citytypes, zonetypes } from '@/types';
import { toast } from 'sonner';
import { useStore } from '../state/cartStore';
import ClearCartDialog from '../dialogpopups/ClearCartDialog';

interface CartPageProps {
  auth: {
    user: any;
  };
  wishlist: any
}

const CartPage = ({ auth, wishlist }: CartPageProps) => {


  const {
    cart: cartItems,
    removeFromCart,
    clearCart,
    getTotalItems,
    getSubTotal,
    getTax,
    getShipping,
    increaseQty,
    decreaseQty,
    getItemById,
    pathaoCharges,
    selectedCity,
    selectedZone,
    selectedArea,
    setPathaoCharges,
    setSelectedCity,
    setSelectedZone,
    setSelectedArea,
    setCities,
    setZonesCart,
    setAreasCart,
    getFormattedCartItems
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null>(null);


  const [cities, setLocalCities] = useState<citytypes[]>([]);
  const [zones, setZones] = useState<zonetypes[]>([]);
  const [areas, setAreas] = useState<areatypes[]>([]);
  const [loadingPathao, setLoadingPathao] = useState(false);


  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoadingPathao(true);
    try {
      const res = await axios.get('/api/pathao/cities');
      const citiesData = res.data.data.data.map((city: any) => ({
        city_id: city.city_id,
        city_name: city.city_name
      }));
      setLocalCities(citiesData);
      setCities(citiesData);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('Failed to load cities');
    } finally {
      setLoadingPathao(false);
    }
  }

  const fetchZone = async (cityId: string) => {
    if (!cityId) return;

    setLoadingPathao(true);
    try {
      const res = await axios.get(`/api/pathao/zones/${cityId}`);
      const zonesData = res.data.data.data.map((zone: any) => ({
        zone_id: zone.zone_id,
        zone_name: zone.zone_name
      }));
      setZones(zonesData);
      setZonesCart(zonesData);
      setAreas([]);
    } catch (error) {
      console.error('Error fetching zones:', error);
      setZones([]);
      toast.error('Failed to load zones');
    } finally {
      setLoadingPathao(false);
    }
  }

  const fetchArea = async (zoneId: string) => {
    if (!zoneId) return;

    setLoadingPathao(true);
    try {
      const res = await axios.get(`/api/pathao/areas/${zoneId}`);
      const areasData = res.data.data.data.map((area: any) => ({
        area_id: area.area_id,
        area_name: area.area_name,
        home_delivery_available: area.home_delivery_available || false,
        pickup_available: area.pickup_available || false
      }));
      setAreas(areasData);
      setAreasCart(areasData);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
      toast.error('Failed to load areas');
    } finally {
      setLoadingPathao(false);
    }
  }

    const calculatePathaoPrice = async (cityId: string, zoneId: string, areaId?: string) => {
        if (!cityId || !zoneId) {
            toast.error('Please select city and zone');
            return;
        }

        setLoadingPathao(true);

        try {
            const subtotal = getSubTotal();
            const itemCount = getTotalItems();
            const items = getFormattedCartItems();

            const totalWeight = items.reduce((sum, item) => {
                return sum + ((item.item_weight || 0.5) * item.quantity);
            }, 0);


            const priceRequest: any = {
                store_id: 367082,
                sender_city: 2,
                recipient_city: parseInt(cityId),
                recipient_zone: parseInt(zoneId),
                item_type: 2,
                item_weight: Math.max(0.5, totalWeight),
                item_quantity: itemCount,
                amount_to_collect: subtotal,
                delivery_type: 48
            };

            // Only add area if provided
            if (areaId) {
                priceRequest.recipient_area = parseInt(areaId);
            }

            const response = await axios.post('/api/pathao/calculate-price', priceRequest);

            if (response.data?.data?.data) {
                const priceData = response.data.data.data;
                const baseDeliveryCharge = priceData.price || priceData.final_price || 0;
                const totalDeliveryCharge = baseDeliveryCharge + 20;

                setPathaoCharges({ delivery_charge: totalDeliveryCharge });
                toast.success(`Shipping price: ${formatPrice(totalDeliveryCharge)}`);
            }
        } catch (error: any) {

            if (error.response?.data?.message?.includes('area')) {
                toast.error('Please select an area to calculate shipping');
            } else {
                toast.error(error.response?.data?.message || 'Failed to calculate shipping price');
            }
            setPathaoCharges(null);
        } finally {
            setLoadingPathao(false);
        }
    };


  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setSelectedZone('');
    setSelectedArea('');
    setZones([]);
    setAreas([]);
    setPathaoCharges(null);

    if (cityId) {
      await fetchZone(cityId);
    }
  };

    const handleZoneChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const zoneId = e.target.value;
        setSelectedZone(zoneId);
        setSelectedArea('');
        setAreas([]);
        setPathaoCharges(null);

        if (zoneId) {
            await fetchArea(zoneId);

            if (selectedCity) {
                await calculatePathaoPrice(selectedCity, zoneId);
            }
        }
    };

    const handleAreaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const areaId = e.target.value;
        setSelectedArea(areaId);

        if (selectedCity && selectedZone) {
            await calculatePathaoPrice(selectedCity, selectedZone, areaId);
        }
    };

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    const confirmClearCart = () => {
        clearCart();
        close();
    };

    const calculateTotals = () => {
        const subtotal = getSubTotal();
        const tax = getTax();
        const shipping = getShipping();
        const item_count = getTotalItems();

        let discount = 0;
        if (appliedCoupon) {
        discount = appliedCoupon.type === 'percentage'
            ? subtotal * (appliedCoupon.discount / 100)
            : Math.min(appliedCoupon.discount, subtotal);
        }

        const total = Math.max(0, subtotal + tax + shipping - discount);

        return { subtotal, tax, shipping, discount, total, item_count };
    };

    const cartTotals = calculateTotals();

    const handleIncreaseQuantity = async (itemId: string) => {
        const item = getItemById(itemId);
        if (item && item.cartQty && item.cartQty < item.quantity) {
        increaseQty(itemId);
        if (selectedCity && selectedZone && selectedArea) {
            await calculatePathaoPrice(selectedCity, selectedZone, selectedArea);
        }
        }
    };

    const handleDecreaseQuantity = async (itemId: string) => {
        const item = getItemById(itemId);
        if (item && item.cartQty && item.cartQty > 1) {
        decreaseQty(itemId);
        if (selectedCity && selectedZone && selectedArea) {
            await calculatePathaoPrice(selectedCity, selectedZone, selectedArea);
        }
        } else {
        removeFromCart(itemId);
        }
    };

    const moveToWishlist = (itemId: string) => {
        const item = cartItems?.find(item => item.id === itemId);
        if (item) {
        removeFromCart(itemId);
        toast.success(`${item.name} moved to wishlist`);
        }
    };

    const applyCoupon = () => {
        if (!couponCode.trim()) return;

        const validCoupons = [
        { code: 'fdagd', discount: 10, type: 'percentage' as const },
        { code: 'dsagag', discount: 20, type: 'percentage' as const },
        { code: 'fegdaf', discount: 5.99, type: 'fixed' as const },
        { code: 'gdafeagds', discount: 15, type: 'percentage' as const }
        ];

        const coupon = validCoupons.find(c => c.code === couponCode.toUpperCase());

        if (coupon) {
        setAppliedCoupon(coupon);
        setCouponCode('');
        toast.success(`Coupon ${coupon.code} applied!`);
        } else {
        toast.error('Invalid coupon code');
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        toast.success('Coupon removed');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 2
        }).format(price);
    };

    const calculateDiscountPercentage = (regular: number, sale: number | null) => {
        if (!sale || sale >= regular) return 0;
        return Math.round(((regular - sale) / regular) * 100);
    };

    const getStockStatus = (inStock: boolean) => {
        if (inStock) return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
        return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    };

    const getFirstImage = (images: string) => {
        try {
        const parsed = JSON.parse(images);
        let imageName = '';
        if (Array.isArray(parsed) && parsed.length > 0) {
            imageName = parsed[0];
        } else if (typeof parsed === 'string' && parsed) {
            imageName = parsed;
        }

        if (imageName) {
            return `${window.location.origin}/storage/${imageName}`;
        }
        } catch (error) {
        if (typeof images === 'string' && images) {
            const matches = images.match(/"([^"]+)"/);
            if (matches && matches[1]) {
            return `${window.location.origin}/storage/${matches[1]}`;
            }
        }
        }

        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
    };

    const calculateSaleSavings = () => {
        return (cartItems || []).reduce((sum, item) => {
        const regular = (item.regular_price);
        const sale = (item.sale_price);
        const quantity = item.cartQty || 1;

        if (sale && sale < regular) {
            return sum + ((regular - sale) * quantity);
        }
        return sum;
        }, 0);
    };

    const getSelectedCityName = () => {
        const city = cities.find(c => c.city_id === parseFloat(selectedCity));
        return city?.city_name || '';
    };

    const isCheckoutDisabled = () => {
        return !selectedCity || !selectedZone || !pathaoCharges || loadingPathao;
    };


  if (!cartItems || cartItems.length === 0) {
    return (
      <AppLayout user={auth.user} wishlist={wishlist}>
        <Head title="Shopping Cart" />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                <FaShoppingCart className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet. Start shopping to discover amazing products!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaArrowRight className="h-4 w-4 mr-2" />
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={auth.user} wishlist={wishlist}>
      <Head title="Shopping Cart" />

      <ClearCartDialog isOpen={isOpen} confirmClearCart={confirmClearCart} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FaShoppingCart className="h-8 w-8 mr-3 text-blue-600" />
                  Shopping Cart
                </h1>
                <p className="text-gray-600 mt-2">
                  Review your items and select delivery location for Pathao shipping
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>

                {cartItems.length > 0 && (
                  <button
                    onClick={open}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <FaTrash className="h-4 w-4 mr-2" />
                    Clear Cart
                  </button>
                )}
              </div>
            </div>

            {/* Cart Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Items in Cart</p>
                    <p className="text-2xl font-bold text-gray-900">{cartTotals.item_count}</p>
                  </div>
                  <FaBox className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(cartTotals.subtotal)}</p>
                  </div>
                  <FaCreditCard className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Savings</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(cartTotals.discount + calculateSaleSavings())}
                    </p>
                  </div>
                  <FaTag className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Your Items ({cartTotals.item_count})
                    </h2>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => {
                    const regularPrice = (item.regular_price);
                    const salePrice = item.sale_price ? (item.sale_price) : null;
                    const discountPercent = calculateDiscountPercentage(regularPrice, salePrice);
                    const stockStatus = getStockStatus(item.inStock);
                    const currentPrice = salePrice || regularPrice;
                    const quantity = item.cartQty || 1;
                    const totalPrice = currentPrice * quantity;
                    const imageUrl = getFirstImage(item.images);
                    const rating = item.rating || 0;

                    return (
                      <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="relative group">
                              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
                                  }}
                                />
                              </div>
                              {discountPercent > 0 && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  -{discountPercent}%
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-grow">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <Link href={`/products/${item.slug}`}>
                                      <h3 className="font-semibold text-gray-900 text-lg mb-1 hover:text-blue-600 transition-colors cursor-pointer">
                                        {item.name}
                                      </h3>
                                    </Link>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                      {item.description}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-gray-900">
                                      {formatPrice(currentPrice)}
                                    </div>
                                    {salePrice && (
                                      <div className="text-sm text-gray-500 line-through">
                                        {formatPrice(regularPrice)}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Product Meta */}
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {item.category}
                                  </span>
                                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${stockStatus.color}`}>
                                    {stockStatus.label}
                                  </span>
                                  {rating > 0 && (
                                    <span className="flex items-center text-xs text-gray-600">
                                      <FaStar className="h-3 w-3 text-yellow-400 mr-1" />
                                      {rating}
                                    </span>
                                  )}
                                </div>

                                {/* Quantity Controls & Actions */}
                                <div className="flex flex-wrap items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                                      <button
                                        onClick={() => handleDecreaseQuantity(item.id)}
                                        disabled={quantity <= 1}
                                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg transition-colors"
                                      >
                                        <FaMinus className="h-3 w-3" />
                                      </button>
                                      <span className="w-12 text-center py-2 text-gray-900 font-medium border-x border-gray-300">
                                        {quantity}
                                      </span>
                                      <button
                                        onClick={() => handleIncreaseQuantity(item.id)}
                                        disabled={quantity >= item.quantity}
                                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg transition-colors"
                                      >
                                        <FaPlus className="h-3 w-3" />
                                      </button>
                                    </div>

                                    {/* Item Total */}
                                    <div className="text-sm font-semibold text-gray-900">
                                      Total: {formatPrice(totalPrice)}
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                                    <button
                                      onClick={() => moveToWishlist(item.id)}
                                      className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors"
                                    >
                                      <FaHeart className="h-4 w-4 mr-2" />
                                      Save
                                    </button>
                                    <button
                                      onClick={() => removeFromCart(item.id)}
                                      className="inline-flex items-center text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                    >
                                      <FaTrash className="h-4 w-4 mr-2" />
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex items-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <FaShieldAlt className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Secure Checkout</p>
                    <p className="text-sm text-gray-600">Your data is protected</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex items-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <FaTruck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Pathao Delivery</p>
                    <p className="text-sm text-gray-600">Fast & reliable shipping</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex items-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                    <FaUndo className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Order Summary Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <FaCreditCard className="h-5 w-5 mr-2 text-gray-500" />
                      Order Summary
                    </h2>
                  </div>

                  <div className="p-6">
                    {/* Pricing Breakdown */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">{formatPrice(cartTotals.subtotal)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Shipping (Pathao)</span>
                        <span className="font-medium text-gray-900">
                          {pathaoCharges ? (
                            <div className="text-right">
                              <div>{formatPrice(pathaoCharges.delivery_charge)}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">
                              {loadingPathao ? 'Calculating...' : 'Select area to calculate'}
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tax (10%)</span>
                        <span className="font-medium text-gray-900">{formatPrice(cartTotals.tax)}</span>
                      </div>

                      {appliedCoupon && (
                        <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <FaTag className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-gray-700">
                              Discount ({appliedCoupon.code})
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-green-600 mr-2">
                              -{formatPrice(cartTotals.discount)}
                            </span>
                            <button
                              onClick={removeCoupon}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label="Remove coupon"
                            >
                              <FaTimes className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pathao Delivery Configuration */}
                    <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl shadow-lg p-6 border-2 border-green-200 mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <FaTruck className="h-5 w-5 mr-2 text-green-600" />
                        Pathao Delivery
                      </h2>

                      <div className="space-y-4">
                        {/* Pathao Configuration */}
                        <div className="mt-2">
                          <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                            <FaMapMarkerAlt className="h-4 w-4 text-green-600 mr-2" />
                            Select Delivery Location
                          </h3>

                          {/* Loading State */}
                          {loadingPathao && (
                            <div className="mb-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                              <p className="text-xs text-blue-700 font-medium flex items-center">
                                <FaTruckLoading className="h-3 w-3 mr-2 animate-spin" />
                                Loading locations...
                              </p>
                            </div>
                          )}

                          {/* Location Selectors */}
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                City *
                              </label>
                              <select
                                value={selectedCity}
                                onChange={handleCityChange}
                                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                disabled={loadingPathao}
                              >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                  <option key={city.city_id} value={city.city_id}>
                                    {city.city_name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Zone *
                              </label>
                              <select
                                value={selectedZone}
                                onChange={handleZoneChange}
                                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                disabled={!selectedCity || loadingPathao}
                              >
                                <option value="">Select Zone</option>
                                {zones.map((zone) => (
                                  <option key={zone.zone_id} value={zone.zone_id}>
                                    {zone.zone_name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Area *
                              </label>
                              <select
                                value={selectedArea}
                                onChange={handleAreaChange}
                                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                disabled={!selectedZone || loadingPathao}
                            >
                                <option value="">Select Area (Optional)</option>
                                {areas.map((area) => (
                                    <option key={area.area_id} value={area.area_id}>
                                        {area.area_name}
                                    </option>
                                ))}
                            </select>
                            </div>
                          </div>

                          {/* Shipping Rate Display */}
                          {selectedCity && (
                            <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-sm">
                              <div className="flex items-center mb-3">
                                <FaCheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                <h4 className="font-bold text-green-800 text-sm">Delivery Charges</h4>
                              </div>

                              {/* Loading State for Price Calculation */}
                              {loadingPathao && (
                                <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <p className="text-xs text-blue-700 flex items-center">
                                    <FaTruckLoading className="h-3 w-3 mr-2 animate-spin" />
                                    Calculating best shipping rate...
                                  </p>
                                </div>
                              )}

                              {/* City Info */}
                              <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-700 flex items-center">
                                  <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                                  Delivering to: {getSelectedCityName()}
                                </p>
                              </div>

                              {/* Main Display */}
                              <div className="text-center p-4 bg-green-100 rounded-lg border-2 border-green-300">
                                <p className="text-xs text-green-700 font-semibold mb-1">
                                  {loadingPathao ? 'Calculating...' : pathaoCharges ? 'Total Delivery Charge' : 'Select area to calculate'}
                                </p>
                                <p className="text-2xl font-bold text-green-700">
                                  {loadingPathao ? (
                                    <FaTruckLoading className="h-6 w-6 mx-auto animate-spin" />
                                  ) : (
                                    pathaoCharges ? formatPrice(pathaoCharges.delivery_charge) : '---'
                                  )}
                                </p>
                              </div>

                              {/* Estimated Delivery */}
                              {selectedArea && pathaoCharges && (
                                <div className="mt-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
                                  <p className="text-xs text-purple-700 flex items-center">
                                    <FaTruck className="h-3 w-3 mr-1" />
                                    Estimated delivery: {
                                      getSelectedCityName().toLowerCase().includes('dhaka') ? '3-5' :
                                      getSelectedCityName().toLowerCase().includes('chittagong') ? '2-3' : '3-4'
                                    } business days
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Coupon Code */}
                    {!appliedCoupon && (
                      <div className="mb-6">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={applyCoupon}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatPrice(cartTotals.total)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {cartTotals.item_count} item{cartTotals.item_count !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={() => {
                        if (!isCheckoutDisabled()) {
                          router.visit('/checkout');
                        }
                      }}
                      disabled={isCheckoutDisabled()}
                      className={`w-full py-3 px-4 font-semibold rounded-lg transition-colors text-center mb-4 flex items-center justify-center ${
                        isCheckoutDisabled()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <FaLock className="h-5 w-5 mr-2" />
                      {isCheckoutDisabled()
                        ? 'Complete delivery details to continue'
                        : 'Proceed to Checkout'}
                    </button>

                    {/* Payment Methods */}
                    <div className="text-center pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-3">We accept</p>
                      <div className="flex justify-center space-x-3">
                        <div className="w-10 h-6 bg-gray-100 rounded border border-gray-300"></div>
                        <div className="w-10 h-6 bg-gray-100 rounded border border-gray-300"></div>
                        <div className="w-10 h-6 bg-gray-100 rounded border border-gray-300"></div>
                        <div className="w-10 h-6 bg-gray-100 rounded border border-gray-300"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Need Help */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Need help?</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Our customer support team is available 24/7 to assist you with your order.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Contact Support
                    <FaArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CartPage;
