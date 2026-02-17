import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
  FaLock,
  FaArrowLeft,
  FaMoneyBill,
  FaTruck,
  FaUser,
  FaShieldAlt,
  FaShoppingCart,
  FaExclamationCircle,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBox,
  FaTag,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaHome
} from 'react-icons/fa';
import AppLayout from '@/Layouts/AppLayout';
import { useStore, OrderData } from '../state/cartStore';
import { toast } from 'sonner';

const Checkout = ({ auth }: any) => {
  const {
    cart: cartItems,
    processCheckout,
    getOrderSummary,
    shippingMethod,
    pathaoCharges,
    selectedCity,
    selectedZone,
    selectedArea,
    cities,
    zones,
    areas,
  } = useStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { data, setData, processing } = useForm({
    customer_name: auth.user?.name || '',
    customer_email: auth.user?.email || '',
    customer_phone: '',
    customer_address: '',
    notes: '',
    payment_method: 'cash_on_delivery' as 'cash_on_delivery' | 'bikash'
  });

  const summary = getOrderSummary();


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getFirstImage = (images: string) => {
    try {
      const parsed = JSON.parse(images);
      const imageName = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
      if (imageName) {
        return `${window.location.origin}/product_images/${imageName}`;
      }
    } catch {
      if (typeof images === 'string' && images) {
        const matches = images.match(/"([^"]+)"/);
        if (matches && matches[1]) {
          return `${window.location.origin}/product_images/${matches[1]}`;
        }
        if (images && !images.includes('"')) {
          return `${window.location.origin}/product_images/${images}`;
        }
      }
    }
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
  };

  const getSelectedCityName = () => {
    const city = cities.find(c => c.city_id === parseInt(selectedCity));
    return city?.city_name || '';
  };

  const getSelectedZoneName = () => {
    const zone = zones.find(z => z.zone_id === parseInt(selectedZone));
    return zone?.zone_name || '';
  };

  const getSelectedAreaName = () => {
    const area = areas.find(a => a.area_id === parseInt(selectedArea));
    return area?.area_name || '';
  };

  const getFullAddress = () => {
    if (shippingMethod === 'pathao' && selectedCity && selectedZone && selectedArea) {
      return `${data.customer_address}, ${getSelectedAreaName()}, ${getSelectedZoneName()}, ${getSelectedCityName()}`;
    }
    return data.customer_address;
  };

  const getEstimatedDelivery = () => {
    if (shippingMethod === 'pathao') {
      const cityName = getSelectedCityName().toLowerCase();
      if (cityName.includes('dhaka')) return '1-2 business days';
      if (cityName.includes('chittagong') || cityName.includes('chattogram')) return '2-3 business days';
      return '3-4 business days';
    }
    return '5-7 business days';
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!data.customer_name.trim()) errors.customer_name = 'Full name is required';
    if (!data.customer_email.trim()) errors.customer_email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.customer_email)) errors.customer_email = 'Email is invalid';
    if (!data.customer_phone.trim()) errors.customer_phone = 'Phone number is required';
    else if (!/^01[3-9]\d{8}$/.test(data.customer_phone)) errors.customer_phone = 'Phone number must be 11 digits and start with 01';
    if (!data.customer_address.trim()) errors.customer_address = 'Delivery address is required';

    if (shippingMethod === 'pathao') {
      if (!selectedCity) errors.pathao_city = 'Please select a city';
      if (!selectedZone) errors.pathao_zone = 'Please select a zone';
      if (!selectedArea) errors.pathao_area = 'Please select an area';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsProcessing(true);
        setError('');
        setValidationErrors({});

        // Ensure we have all required Pathao data
        if (shippingMethod === 'pathao') {
            if (!selectedCity || !selectedZone || !selectedArea || !pathaoCharges) {
                toast.error('Please complete all delivery information');
                setIsProcessing(false);
                return;
            }
        }

        const orderData: OrderData = {
            customer_name: data.customer_name,
            customer_email: data.customer_email,
            customer_phone: data.customer_phone,
            customer_address: getFullAddress(),
            notes: data.notes,
            payment_method: data.payment_method,
            shipping_method: shippingMethod,

            amount_to_collect: summary.total,

            ...(shippingMethod === 'pathao' && selectedCity && selectedZone && selectedArea && pathaoCharges ? {
                // Use field names that match validation
                pathao_city: selectedCity,  // Send as string ID
                pathao_city_name: getSelectedCityName(),
                pathao_zone: selectedZone,  // Send as string ID
                pathao_zone_name: getSelectedZoneName(),
                pathao_area: selectedArea,  // Send as string ID
                pathao_area_name: getSelectedAreaName(),
                pathao_delivery_charge: pathaoCharges.delivery_charge,
                pathao_total_charge: pathaoCharges.delivery_charge, // Same as delivery charge
                delivery_charge: pathaoCharges.delivery_charge,
                estimated_delivery: getEstimatedDelivery()
            } : {})
        };

        try {
            await processCheckout(orderData);
        } catch (err: any) {
            console.error('Checkout error:', err);
            if (err && typeof err === 'object') {
                setValidationErrors(err);
                setError('Please fix the validation errors below');
            } else {
                setError('Failed to process checkout. Please try again.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <AppLayout user={auth.user}>
        <Head title="Checkout" />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                <FaShoppingCart className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add items to your cart before checkout</p>
              <a
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
              >
                <FaArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={auth.user}>
      <Head title="Checkout - Secure Checkout" />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shadow-lg">
                  1
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Cart</p>
                  <p className="text-xs text-gray-500">Review items</p>
                </div>
              </div>

              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-500 mx-4"></div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white flex items-center justify-center font-semibold shadow-lg">
                  2
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Checkout</p>
                  <p className="text-xs text-gray-500">Shipping & Payment</p>
                </div>
              </div>

              <div className="w-24 h-1 bg-gray-300 mx-4"></div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-semibold">
                  3
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Confirmation</p>
                  <p className="text-xs text-gray-500">Order complete</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start shadow-md">
              <FaExclamationCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{error}</p>
                {Object.keys(validationErrors).length > 0 && (
                  <ul className="text-sm mt-1 list-disc list-inside">
                    {Object.entries(validationErrors).map(([field, message]) => (
                      <li key={field} className="text-red-600">
                        {field.replace(/_/g, ' ')}: {message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Information */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <FaHome className="h-5 w-5 mr-2" />
                      Shipping Information
                    </h2>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaUser className="h-4 w-4 inline mr-1 text-blue-600" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={data.customer_name}
                          onChange={e => setData('customer_name', e.target.value)}
                          className={`w-full px-4 py-3 border ${
                            validationErrors.customer_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="Enter your full name"
                        />
                        {validationErrors.customer_name && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <FaExclamationCircle className="h-3 w-3 mr-1" />
                            {validationErrors.customer_name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaPhone className="h-4 w-4 inline mr-1 text-blue-600" />
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={data.customer_phone}
                          onChange={e => setData('customer_phone', e.target.value)}
                          className={`w-full px-4 py-3 border ${
                            validationErrors.customer_phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="01XXXXXXXXX"
                        />
                        {validationErrors.customer_phone && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <FaExclamationCircle className="h-3 w-3 mr-1" />
                            {validationErrors.customer_phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaEnvelope className="h-4 w-4 inline mr-1 text-blue-600" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={data.customer_email}
                        onChange={e => setData('customer_email', e.target.value)}
                        className={`w-full px-4 py-3 border ${
                          validationErrors.customer_email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="your@email.com"
                      />
                      {validationErrors.customer_email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <FaExclamationCircle className="h-3 w-3 mr-1" />
                          {validationErrors.customer_email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaMapMarkerAlt className="h-4 w-4 inline mr-1 text-blue-600" />
                        Delivery Address *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={data.customer_address}
                        onChange={e => setData('customer_address', e.target.value)}
                        className={`w-full px-4 py-3 border ${
                          validationErrors.customer_address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="House #, Road #, Area, City, Postal Code"
                      />
                      {validationErrors.customer_address && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <FaExclamationCircle className="h-3 w-3 mr-1" />
                          {validationErrors.customer_address}
                        </p>
                      )}
                    </div>

                    {/* Pathao Location Summary */}
                    {shippingMethod === 'pathao' && selectedCity && selectedZone && selectedArea && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                        <div className="flex items-start">
                          <FaCheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-800">Pathao Delivery Location</p>
                            <p className="text-sm text-green-700 mt-1">
                              {getSelectedAreaName()}, {getSelectedZoneName()}, {getSelectedCityName()}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              Estimated delivery: {getEstimatedDelivery()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={data.notes}
                        onChange={e => setData('notes', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Special instructions for delivery, gate code, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <FaMoneyBill className="h-5 w-5 mr-2" />
                      Payment Method
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      <label className={`block p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        data.payment_method === 'cash_on_delivery'
                          ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                      }`}>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="payment_method"
                            value="cash_on_delivery"
                            checked={data.payment_method === 'cash_on_delivery'}
                            onChange={e => setData('payment_method', 'cash_on_delivery')}
                            className="h-5 w-5 text-green-600"
                          />
                          <div className="ml-3 flex-grow">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FaMoneyBill className="h-5 w-5 text-green-600 mr-2" />
                                <p className="font-bold text-gray-900">Cash on Delivery (COD)</p>
                              </div>
                              {data.payment_method === 'cash_on_delivery' && (
                                <FaCheckCircle className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Pay with cash when your order is delivered to your doorstep
                            </p>
                          </div>
                        </div>
                      </label>

                      <label className={`block p-5 border-2 rounded-xl cursor-not-allowed transition-all ${
                        data.payment_method === 'bikash'
                          ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-red-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="payment_method"
                            value="bikash"
                            checked={data.payment_method === 'bikash'}
                            onChange={e => setData('payment_method', 'bikash')}
                            className="h-5 w-5 text-pink-600"
                            disabled
                          />
                          <div className="ml-3 flex-grow">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-pink-100 rounded flex items-center justify-center mr-2">
                                <span className="text-pink-600 font-bold text-xs">bKash</span>
                              </div>
                              <p className="font-bold text-gray-900">bKash (Coming Soon)</p>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Pay securely with bKash mobile banking
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Secure Payment Badge */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center">
                        <FaShieldAlt className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                          <p className="font-semibold text-blue-800">100% Secure Payment</p>
                          <p className="text-xs text-blue-600">
                            Your payment information is encrypted and secure
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-6">
                  {/* Order Summary Card */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <FaShoppingCart className="h-5 w-5 mr-2" />
                        Order Summary
                      </h2>
                    </div>

                    <div className="p-6">
                      {/* Cart Items Preview */}
                      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                        {cartItems.map((item) => {
                          const imageUrl = getFirstImage(item.images);
                          const quantity = item.cartQty || 1;
                          const price = item.sale_price || item.regular_price;

                          return (
                            <div key={item.id} className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="relative">
                                  <img
                                    src={imageUrl}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
                                    }}
                                  />
                                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {quantity}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-grow">
                                <p className="font-medium text-gray-900 text-sm line-clamp-2">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatPrice(price)} each
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                {formatPrice(price * quantity)}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-3 border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 flex items-center">
                            <FaBox className="h-4 w-4 mr-1 text-gray-500" />
                            Subtotal ({summary.item_count} items)
                          </span>
                          <span className="font-medium text-gray-900">{formatPrice(summary.subtotal)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 flex items-center">
                            <FaTruck className="h-4 w-4 mr-1 text-blue-500" />
                            Shipping
                          </span>
                          <span className={`font-medium ${summary.shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {summary.shipping === 0 ? (
                              <span className="flex items-center">
                                <FaCheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                FREE
                              </span>
                            ) : formatPrice(summary.shipping)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 flex items-center">
                            <FaTag className="h-4 w-4 mr-1 text-orange-500" />
                            Tax (10%)
                          </span>
                          <span className="font-medium text-gray-900">{formatPrice(summary.tax)}</span>
                        </div>



                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                          <span className="text-lg font-bold text-gray-900">Total</span>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-green-600">
                              {formatPrice(summary.total)}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              Including VAT
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="flex items-start">
                          <FaClock className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">Estimated Delivery</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {getEstimatedDelivery()}
                            </p>
                            {shippingMethod === 'pathao' && (
                              <p className="text-xs text-blue-600 mt-2 flex items-center">
                                <FaCheckCircle className="h-3 w-3 mr-1" />
                                Pathao Express Delivery
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Terms and Place Order */}
                      <div className="mt-6">
                        <div className="flex items-start mb-4">
                          <input
                            type="checkbox"
                            required
                            id="terms"
                            className="h-4 w-4 text-blue-600 mt-1 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="terms" className="ml-2 text-xs text-gray-600">
                            I agree to the{' '}
                            <a href="/terms" className="text-blue-600 hover:underline" target="_blank">
                              Terms & Conditions
                            </a>{' '}
                            and confirm that the order information is correct
                          </label>
                        </div>

                        <button
                          type="submit"
                          disabled={processing || isProcessing || cartItems.length === 0}
                          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center shadow-lg"
                        >
                          <FaLock className="h-5 w-5 mr-2" />
                          {(processing || isProcessing) ? (
                            <span className="flex items-center">
                              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            `Place Order • ${formatPrice(summary.total)}`
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => window.history.back()}
                          className="w-full mt-3 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <FaArrowLeft className="h-4 w-4 mr-2" />
                          Return to Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Customer Support Card */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <FaPhone className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">Need help?</h3>
                        <p className="text-blue-100 text-sm">24/7 Customer Support</p>
                      </div>
                    </div>
                    <p className="text-blue-100 text-sm mb-4">
                      Our support team is available 24/7 to assist you with your order
                    </p>
                    <div className="space-y-2">
                      <a
                        href="tel:1234567890"
                        className="block w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors text-center"
                      >
                        Call Us
                      </a>
                      <a
                        href="/contact"
                        className="block w-full py-2.5 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors text-center"
                      >
                        Contact Support
                      </a>
                    </div>
                  </div>

                  {/* Secure Checkout Badge */}
                  <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
                    <div className="flex items-center justify-center space-x-4">
                      <FaLock className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Secure SSL Checkout</span>
                      <FaShieldAlt className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Your information is protected by 256-bit SSL encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default Checkout;
