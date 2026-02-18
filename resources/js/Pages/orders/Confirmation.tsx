import { Head, Link } from '@inertiajs/react';
import {
  FaCheckCircle,
  FaShoppingBag,
  FaTruck,
  FaMoneyBill,
  FaHome,
  FaPrint,
  FaArrowRight,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaStore,
  FaCalendar,
  FaReceipt,
  FaBox,
  FaShieldAlt,
  FaCreditCard,
  FaUser,
  FaClock,
  FaMapPin
} from 'react-icons/fa';
import AppLayout from '@/Layouts/AppLayout';

interface OrderProps {
  auth: {
    user: any;
  };
  order: {
    id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    recipient_city?: number;
    recipient_zone?: number;
    recipient_area?: number;
    subtotal: number;
    delivery_charge: number;
    total: number;
    amount_to_collect: number;
    payment_method: 'cash_on_delivery' | 'bikash';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    shipping_method: string;
    tracking_number?: string;
    estimated_delivery?: string;
    coupon_code?: string;
    discount_amount: number;
    notes?: string;
    store_name: string;
    created_at: string;
    updated_at: string;
    order_items: Array<{
      id: number;
      product_id: string;
      product_name: string;
      product_image: string;
      quantity: number;
      price: number;
      total: number;
    }>;
    store?: {
      id: number;
      name: string;
      address?: string;
      phone?: string;
      mobile?: string;
      email?: string;
    };
    // Pathao specific fields
    pathao_city_name?: string;
    pathao_zone_name?: string;
    pathao_area_name?: string;
    delivery_type?: number;
    item_type?: number;
    special_instruction?: string;
  };
}

const Confirmation = ({ auth, order }: OrderProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price ?? 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-BD', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending:    'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped:    'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered:  'bg-green-100 text-green-800 border-green-200',
      cancelled:  'bg-red-100 text-red-800 border-red-200',
      returned:   'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid:     'bg-green-100 text-green-800 border-green-200',
      pending:  'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed:   'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getFullDeliveryAddress = () => {
    let address = order.recipient_address;
    if (order.pathao_area_name || order.pathao_zone_name || order.pathao_city_name) {
      const parts = [];
      if (order.pathao_area_name) parts.push(order.pathao_area_name);
      if (order.pathao_zone_name) parts.push(order.pathao_zone_name);
      if (order.pathao_city_name) parts.push(order.pathao_city_name);
      if (parts.length > 0) {
        address += `, ${parts.join(', ')}`;
      }
    }
    return address;
  };

  // Calculate tax (10% of subtotal)
  const taxAmount = order.subtotal * 0.10;

  // Determine items array
  const items = order.order_items || [];

  return (
    <AppLayout user={auth.user}>
      <Head title={`Order Confirmation - ${order.order_number}`} />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-green-200 rounded-full opacity-20 animate-ping"></div>
              </div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaCheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Order Confirmed! 🎉
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Thank you for your order!{' '}
              {order.payment_method === 'cash_on_delivery'
                ? `You'll pay ${formatPrice(order.amount_to_collect)} when your order is delivered.`
                : 'Your payment is being processed.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center items-center">
              <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                <FaReceipt className="h-4 w-4 mr-2" />
                Order #: {order.order_number}
              </span>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.order_status)}`}>
                <FaShoppingBag className="h-3 w-3 mr-1" />
                {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
              </span>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getPaymentStatusColor(order.payment_status)}`}>
                <FaCreditCard className="h-3 w-3 mr-1" />
                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </span>
              {order.tracking_number && (
                <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200">
                  <FaTruck className="h-3 w-3 mr-1" />
                  Tracking: {order.tracking_number}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-8">

              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <FaShoppingBag className="h-5 w-5 mr-2" />
                      Order Summary
                    </h2>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                    >
                      <FaPrint className="h-4 w-4 mr-2" />
                      Print Invoice
                    </button>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {/* Items List */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <FaBox className="h-4 w-4 mr-2 text-blue-600" />
                      Items ({items.length})
                    </h3>
                    <div className="space-y-4">
                      {items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center flex-1">
                            <div className="w-20 h-20 rounded-lg bg-white border border-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                              {item.product_image ? (
                                <img
                                  src={`/product_images/${item.product_image}`}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
                                  }}
                                />
                              ) : (
                                <FaBox className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{item.product_name}</h4>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="text-gray-600">Qty: <span className="font-medium">{item.quantity}</span></span>
                                <span className="text-gray-600">Price: <span className="font-medium">{formatPrice(item.price)}</span></span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">{formatPrice(item.total)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center">
                          <FaTruck className="h-4 w-4 mr-1 text-blue-500" />
                          Shipping (Pathao)
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(order.delivery_charge)}
                          <span className="text-xs text-green-600 ml-1">includes +20 BDT</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tax (10%)</span>
                        <span className="font-medium text-gray-900">{formatPrice(taxAmount)}</span>
                      </div>
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between items-center text-green-600">
                          <span className="flex items-center">
                            Discount {order.coupon_code && `(${order.coupon_code})`}
                          </span>
                          <span className="font-medium">-{formatPrice(order.discount_amount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-3 mt-3">
                        <span>Total Amount</span>
                        <span className="text-2xl text-green-600">{formatPrice(order.total)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded-lg">
                        <span className="text-gray-600">Amount to Collect (COD)</span>
                        <span className="font-bold text-blue-600">{formatPrice(order.amount_to_collect)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center mr-4">
                        {order.payment_method === 'cash_on_delivery'
                          ? <FaMoneyBill className="h-6 w-6 text-green-600" />
                          : <FaCreditCard className="h-6 w-6 text-blue-600" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'bKash Payment'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.payment_method === 'cash_on_delivery'
                            ? `Pay ${formatPrice(order.amount_to_collect)} when you receive your order`
                            : 'Payment will be verified within 24 hours'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <FaClock className="h-5 w-5 mr-2" />
                    Order Timeline
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 border-2 border-green-200">
                          <FaCheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="absolute left-5 top-10 h-full w-0.5 bg-gradient-to-b from-green-200 to-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Order Confirmed</p>
                        <p className="text-sm text-gray-500">Your order has been received and confirmed</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center">
                          <FaCalendar className="h-3 w-3 mr-1" />
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 border-2 ${
                          order.order_status === 'processing' || order.order_status === 'shipped' || order.order_status === 'delivered'
                            ? 'bg-blue-100 border-blue-200'
                            : 'bg-gray-100 border-gray-200'
                        }`}>
                          <FaShoppingBag className={`h-5 w-5 ${
                            order.order_status === 'processing' || order.order_status === 'shipped' || order.order_status === 'delivered'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="absolute left-5 top-10 h-full w-0.5 bg-gradient-to-b from-gray-200 to-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Processing</p>
                        <p className="text-sm text-gray-500">Store is preparing your order</p>
                        {order.order_status === 'processing' && (
                          <p className="text-xs text-blue-600 mt-1">In progress</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 border-2 ${
                          order.order_status === 'shipped' || order.order_status === 'delivered'
                            ? 'bg-indigo-100 border-indigo-200'
                            : 'bg-gray-100 border-gray-200'
                        }`}>
                          <FaTruck className={`h-5 w-5 ${
                            order.order_status === 'shipped' || order.order_status === 'delivered'
                              ? 'text-indigo-600'
                              : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="absolute left-5 top-10 h-full w-0.5 bg-gradient-to-b from-gray-200 to-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Shipping</p>
                        <p className="text-sm text-gray-500">
                          {order.shipping_method === 'pathao' ? 'Pathao Express Delivery' : 'Standard Delivery'}
                        </p>
                        {order.tracking_number && (
                          <p className="text-xs text-blue-600 mt-1 flex items-center">
                            <FaTruck className="h-3 w-3 mr-1" />
                            Tracking: {order.tracking_number}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 border-2 ${
                        order.order_status === 'delivered'
                          ? 'bg-green-100 border-green-200'
                          : 'bg-gray-100 border-gray-200'
                      }`}>
                        <FaHome className={`h-5 w-5 ${
                          order.order_status === 'delivered'
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Delivery</p>
                        <p className="text-sm text-gray-500">
                          {order.payment_method === 'cash_on_delivery'
                            ? `Pay on delivery: ${formatPrice(order.amount_to_collect)}`
                            : 'Order will be delivered'}
                        </p>
                        {order.estimated_delivery && (
                          <p className="text-xs text-gray-400 mt-1 flex items-center">
                            <FaCalendar className="h-3 w-3 mr-1" />
                            Estimated: {new Date(order.estimated_delivery).toLocaleDateString('en-BD', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Customer & Delivery Info */}
            <div className="space-y-8">

              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <FaUser className="h-5 w-5 mr-2" />
                    Customer Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <FaReceipt className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Order ID</p>
                        <p className="font-medium text-gray-900">{order.order_number}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <FaUser className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Recipient Name</p>
                        <p className="font-medium text-gray-900">{order.recipient_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <FaPhone className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">{order.recipient_phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                        <FaEnvelope className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{order.customer_email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <FaMapMarkerAlt className="h-5 w-5 mr-2" />
                    Delivery Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaMapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Delivery Address</p>
                        <p className="font-medium text-gray-900">{getFullDeliveryAddress()}</p>
                      </div>
                    </div>

                    {order.special_instruction && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-xs text-yellow-800 font-medium mb-1">Special Instructions:</p>
                        <p className="text-sm text-gray-700">{order.special_instruction}</p>
                      </div>
                    )}

                    {order.shipping_method === 'pathao' && (order.pathao_city_name || order.pathao_zone_name || order.pathao_area_name) && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-800 font-medium mb-1">Pathao Delivery Details:</p>
                        <p className="text-sm text-gray-700">
                          {[order.pathao_area_name, order.pathao_zone_name, order.pathao_city_name]
                            .filter(Boolean)
                            .join(' → ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Store Information */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <FaStore className="h-5 w-5 mr-2" />
                    Store Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <p className="font-bold text-gray-900 text-lg">{order.store_name}</p>
                    {order.store && (
                      <>
                        {order.store.address && (
                          <p className="text-sm text-gray-600 flex items-start">
                            <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                            {order.store.address}
                          </p>
                        )}
                        {(order.store.mobile || order.store.phone) && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <FaPhone className="h-4 w-4 text-gray-400 mr-2" />
                            {order.store.mobile ?? order.store.phone}
                          </p>
                        )}
                        {order.store.email && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <FaEnvelope className="h-4 w-4 text-gray-400 mr-2" />
                            {order.store.email}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      Order Notes
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-gray-700">{order.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Need Help */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <FaShieldAlt className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Need help?</h3>
                    <p className="text-sm opacity-90">24/7 Customer Support</p>
                  </div>
                </div>
                <p className="text-sm text-blue-100 mb-4">
                  Our customer support team is available 24/7 to assist you with your order.
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:1234567890"
                    className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors text-center"
                  >
                    <FaPhone className="h-4 w-4 inline mr-2" />
                    Call Support
                  </a>
                  <Link
                    href="/contact"
                    className="block w-full py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors text-center"
                  >
                    Contact Support
                    <FaArrowRight className="h-4 w-4 inline ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={route('orders.index')}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-md hover:shadow-lg"
            >
              <FaShoppingBag className="h-5 w-5 mr-2" />
              View My Orders
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-md hover:shadow-lg"
            >
              Continue Shopping
              <FaArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Confirmation;
