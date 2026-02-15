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
  FaUser
} from 'react-icons/fa';
import AppLayout from '@/Layouts/AppLayout';

const Confirmation = ({ auth, order }: any) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2
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
      pending:    'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped:    'bg-indigo-100 text-indigo-800',
      delivered:  'bg-green-100 text-green-800',
      cancelled:  'bg-red-100 text-red-800',
      returned:   'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid:     'bg-green-100 text-green-800',
      pending:  'bg-yellow-100 text-yellow-800',
      failed:   'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Laravel serializes orderItems relation as order_items in JSON
  const items = order.order_items ?? [];

  return (
    <AppLayout user={auth.user}>
      <Head title={`Order Confirmation - ${order.order_number}`} />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Thank you for your order!{' '}
              {order.payment_method === 'cash_on_delivery'
                ? `You'll pay ${formatPrice(order.total)} when your order is delivered.`
                : 'Your payment is being processed.'}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                <FaReceipt className="h-4 w-4 mr-2" />
                Order #: {order.order_number}
              </span>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                <FaShoppingBag className="h-3 w-3 mr-1" />
                {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
              </span>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                <FaCreditCard className="h-3 w-3 mr-1" />
                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">

              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FaPrint className="h-4 w-4 mr-2" />
                    Print Invoice
                  </button>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Items ({items.length})</h3>
                  {items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
                          {item.product_image ? (
                            <img
                              src={`/storage/product_images/${item.product_image}`}
                              alt={item.product_name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
                              }}
                            />
                          ) : (
                            <FaBox className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{item.product_name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Qty: {item.quantity}</span>
                            <span>Price: {formatPrice(item.price)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">{formatPrice(item.total)}</p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      {/* DB field: subtotal */}
                      <span className="font-medium">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      {/* DB field: delivery_charge (not "shipping") */}
                      <span className="font-medium">{formatPrice(order.delivery_charge)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (10%)</span>
                      {/* Tax is not stored — calculate it */}
                      <span className="font-medium">{formatPrice(order.subtotal * 0.10)}</span>
                    </div>
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between text-green-600">
                        {/* DB field: discount_amount (not "discount") */}
                        <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                        <span className="font-medium">-{formatPrice(order.discount_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                      <span>Total Amount</span>
                      <span className="text-green-600">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
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
                          ? `Pay ${formatPrice(order.total)} when you receive your order`
                          : 'Payment will be verified within 24 hours'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <FaCheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="absolute left-4 top-8 h-full w-0.5 bg-green-200"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Order Confirmed</p>
                      <p className="text-sm text-gray-500">Your order has been received and confirmed</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <FaShoppingBag className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="absolute left-4 top-8 h-full w-0.5 bg-gray-200"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Processing</p>
                      <p className="text-sm text-gray-500">Store is preparing your order</p>
                      <p className="text-xs text-gray-400 mt-1">Estimated: Today</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                        <FaTruck className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="absolute left-4 top-8 h-full w-0.5 bg-gray-200"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Shipping</p>
                      <p className="text-sm text-gray-500">
                        {/* DB field: shipping_method */}
                        {order.shipping_method === 'pathao' ? 'Pathao Express Delivery' : 'Standard Delivery'}
                      </p>
                      {order.tracking_number && (
                        <p className="text-xs text-blue-600 mt-1">Tracking: {order.tracking_number}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                      <FaHome className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Delivery</p>
                      <p className="text-sm text-gray-500">
                        {order.payment_method === 'cash_on_delivery'
                          ? `Pay on delivery: ${formatPrice(order.total)}`
                          : 'Order will be delivered'}
                      </p>
                      {order.estimated_delivery && (
                        <p className="text-xs text-gray-400 mt-1">
                          Estimated: {new Date(order.estimated_delivery).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">

              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaShieldAlt className="h-4 w-4 text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium text-gray-900">{order.order_number}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaUser className="h-4 w-4 text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{order.customer_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      {/* DB field: customer_phone */}
                      <p className="font-medium text-gray-900">{order.customer_phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Delivery Address</p>
                      {/* DB field: recipient_address (not customer_address) */}
                      <p className="font-medium text-gray-900">{order.recipient_address}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaCalendar className="h-4 w-4 text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Information */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaStore className="h-5 w-5 mr-2 text-blue-600" />
                  Store Information
                </h2>
                <div className="space-y-3">
                  <p className="font-medium text-gray-900">{order.store_name}</p>
                  {order.store && (
                    <>
                      {order.store.address && (
                        <p className="text-sm text-gray-600">{order.store.address}</p>
                      )}
                      {/* DB field: store.mobile or store.phone */}
                      {(order.store.mobile || order.store.phone) && (
                        <p className="text-sm text-gray-600">
                          Phone: {order.store.mobile ?? order.store.phone}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Notes</h2>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-gray-700">{order.notes}</p>
                  </div>
                </div>
              )}

              {/* Need Help */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-3">Need help with your order?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Our customer support team is available 24/7 to assist you.
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

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={route('orders.index')}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <FaShoppingBag className="h-4 w-4 mr-2" />
              View My Orders
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all font-medium"
            >
              Continue Shopping
              <FaArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Confirmation;
