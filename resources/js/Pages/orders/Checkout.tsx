import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
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
  FaCreditCard
} from 'react-icons/fa';
import AppLayout from '@/Layouts/AppLayout';
import { useStore, OrderData } from '../state/cartStore';

const Checkout = ({ auth }: any) => {
  const { cart: cartItems, processCheckout, getOrderSummary } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const { data, setData, errors, processing } = useForm({
    customer_name: auth.user?.name || '',
    customer_email: auth.user?.email || '',
    customer_phone: '',
    customer_address: '',
    notes: '',
    payment_method: 'cash_on_delivery'
  });

  const summary = getOrderSummary();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getFirstImage = (images: string) => {
    try {
      const parsed = JSON.parse(images);
      const imageName = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
      return `${window.location.origin}/product_images/${imageName}`;
    } catch {
      if (typeof images === 'string' && images) {
        const matches = images.match(/"([^"]+)"/);
        if (matches && matches[1]) {
          return `${window.location.origin}/product_images/${matches[1]}`;
        }
      }
      return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    const orderData: OrderData = {
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      customer_address: data.customer_address,
      notes: data.notes,
      payment_method: data.payment_method,
    };

    try {
      await processCheckout(orderData);
      // Navigation will be handled by Inertia in the store
    } catch (err) {
      setError('Failed to process checkout. Please try again.');
      console.error('Checkout error:', err);
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
            <div className="bg-white rounded-xl shadow-lg p-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                <FaShoppingCart className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add items to your cart before checkout</p>
              <a
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
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
      <Head title="Checkout - Cash on Delivery" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  1
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Cart</p>
                  <p className="text-xs text-gray-500">Review items</p>
                </div>
              </div>

              <div className="w-24 h-1 bg-blue-600 mx-4"></div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
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

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <FaExclamationCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Information */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaUser className="h-5 w-5 mr-2 text-blue-600" />
                    Shipping Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={data.customer_name}
                        onChange={e => setData('customer_name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                      {errors.customer_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={data.customer_email}
                          onChange={e => setData('customer_email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                        {errors.customer_email && (
                          <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={data.customer_phone}
                          onChange={e => setData('customer_phone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="01XXXXXXXXX"
                        />
                        {errors.customer_phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={data.customer_address}
                        onChange={e => setData('customer_address', e.target.value)}
                        placeholder="House #, Road #, Area, City, Postal Code"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.customer_address && (
                        <p className="text-red-500 text-sm mt-1">{errors.customer_address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={data.notes}
                        onChange={e => setData('notes', e.target.value)}
                        placeholder="Special instructions for delivery"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaMoneyBill className="h-5 w-5 mr-2 text-green-600" />
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 border-2 border-green-500 rounded-lg bg-green-50">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment_method"
                          value="cash_on_delivery"
                          checked={data.payment_method === 'cash_on_delivery'}
                          onChange={e => setData('payment_method', e.target.value)}
                          className="h-5 w-5 text-green-600"
                        />
                        <div className="ml-3">
                          <p className="font-bold text-gray-900">Cash on Delivery (COD)</p>
                          <p className="text-sm text-gray-600">
                            Pay with cash when your order is delivered
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-300 rounded-lg">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment_method"
                          value="credit_card"
                          checked={data.payment_method === 'credit_card'}
                          onChange={e => setData('payment_method', e.target.value)}
                          className="h-5 w-5 text-blue-600"
                          disabled
                        />
                        <div className="ml-3">
                          <div className="flex items-center">
                            <FaCreditCard className="h-5 w-5 text-gray-400 mr-2" />
                            <p className="font-bold text-gray-900 opacity-50">Credit/Debit Card</p>
                          </div>
                          <p className="text-sm text-gray-500 opacity-50">
                            Coming soon
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
                  {/* Order Summary */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Order Summary
                    </h2>

                    {/* Cart Items */}
                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                      {cartItems.map((item) => {
                        const imageUrl = getFirstImage(item.images);
                        const quantity = item.cartQty || 1;
                        const price = item.sale_price || item.regular_price;

                        return (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img
                                src={imageUrl}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover mr-3"
                              />
                              <div>
                                <p className="font-medium text-gray-900 text-sm line-clamp-1">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {quantity} × {formatPrice(price)}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium text-gray-900">
                              {formatPrice(price * quantity)}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatPrice(summary.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">{formatPrice(summary.shipping)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (10%)</span>
                        <span className="font-medium">{formatPrice(summary.tax)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                        <span>Total</span>
                        <span className="text-green-600">{formatPrice(summary.total)}</span>
                      </div>
                    </div>

                    {/* Security Info */}
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <FaShieldAlt className="h-5 w-5 text-green-600 mr-2" />
                        <p className="text-sm text-green-700">
                          <span className="font-semibold">Cash on Delivery:</span> Pay only when you receive your order
                        </p>
                      </div>
                    </div>

                    {/* Terms and Place Order */}
                    <div className="mt-6">
                      <div className="flex items-start mb-4">
                        <input
                          type="checkbox"
                          required
                          id="terms"
                          className="h-4 w-4 text-blue-600 mt-1"
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                          I agree to pay <span className="font-bold">{formatPrice(summary.total)}</span> when my order is delivered
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={processing || isProcessing}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <FaLock className="h-5 w-5 mr-2" />
                        {(processing || isProcessing) ? 'Processing...' : `Place Order - ${formatPrice(summary.total)}`}
                      </button>

                      <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="w-full mt-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                      >
                        <FaArrowLeft className="h-4 w-4 mr-2" />
                        Return to Cart
                      </button>
                    </div>
                  </div>

                  {/* Cart Stats */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaShoppingCart className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="text-gray-600">Items in Cart</span>
                        </div>
                        <span className="font-bold text-gray-900">{summary.item_count}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaTruck className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-gray-600">Delivery Charge</span>
                        </div>
                        <span className="font-bold text-gray-900">{formatPrice(summary.shipping)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaCheckCircle className="h-5 w-5 text-yellow-500 mr-2" />
                          <span className="text-gray-600">Payment Method</span>
                        </div>
                        <span className="font-bold text-gray-900">Cash on Delivery</span>
                      </div>
                    </div>
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
