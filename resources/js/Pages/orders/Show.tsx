// resources/js/Pages/orders/Show.tsx
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  FaCheckCircle,
  FaShoppingBag,
  FaTruck,
  FaMoneyBill,
  FaHome,
  FaPrint,
  FaArrowLeft,
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
  FaTimesCircle,
  FaExclamationCircle,
  FaDownload
} from 'react-icons/fa';
import AppLayout from '@/Layouts/AppLayout';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
}

interface Store {
  id: string;
  name: string;
  address?: string;
  mobile?: string;
}

interface Order {
  id: string;
  user_id: string;
  store_id: string;
  store_name: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  transaction_id?: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  shipping_method?: string;
  tracking_number?: string;
  notes?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  store?: Store;
}

interface ShowProps {
  order: Order;
  auth: {
    user: any;
  };
}

const Show: React.FC<ShowProps> = ({ order, auth }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString: string) => {
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
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'processing': 'bg-blue-100 text-blue-800 border-blue-200',
      'shipped': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
      'returned': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'paid': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      'pending': <FaBox className="h-4 w-4 text-yellow-600" />,
      'processing': <FaShoppingBag className="h-4 w-4 text-blue-600" />,
      'shipped': <FaTruck className="h-4 w-4 text-indigo-600" />,
      'delivered': <FaCheckCircle className="h-4 w-4 text-green-600" />,
      'cancelled': <FaTimesCircle className="h-4 w-4 text-red-600" />,
      'returned': <FaExclamationCircle className="h-4 w-4 text-purple-600" />
    };
    return icons[status] || <FaBox className="h-4 w-4 text-gray-400" />;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancelOrder = () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      router.put(`/orders/${order.id}`, { status: 'cancelled' }, {
        onSuccess: () => {
          alert('Order cancelled successfully');
        }
      });
    }
  };

  const canCancelOrder = ['pending', 'processing'].includes(order.order_status);

  return (
    <AppLayout user={auth.user}>
      <Head title={`Order #${order.order_number}`} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Actions */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              href="/orders"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaPrint className="h-4 w-4 mr-2" />
                Print
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <FaDownload className="h-4 w-4 mr-2" />
                Download Invoice
              </button>
            </div>
          </div>

          {/* Order Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Order #{order.order_number}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <FaCalendar className="h-4 w-4 mr-2" />
                  <span>Placed on {formatDate(order.created_at)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.order_status)}`}>
                    {getStatusIcon(order.order_status)}
                    <span className="ml-2">{order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}</span>
                  </span>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                    <FaCreditCard className="h-3 w-3 mr-1" />
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600 mb-2">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">{formatPrice(order.total)}</p>
                {canCancelOrder && (
                  <button
                    onClick={handleCancelOrder}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaTimesCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaBox className="h-5 w-5 mr-2 text-blue-600" />
                  Order Items ({order.order_items.length})
                </h2>

                <div className="space-y-4">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                        {item.product_image ? (
                          <img
                            src={`/product_images/${item.product_image}`}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaBox className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {item.product_name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span>Quantity: {item.quantity}</span>
                          <span>Price: {formatPrice(item.price)}</span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h2>
                <div className="space-y-6">
                  {/* Order Placed */}
                  <div className="flex items-start">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        order.order_status !== 'cancelled' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <FaCheckCircle className={`h-5 w-5 ${
                          order.order_status !== 'cancelled' ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      {order.order_status !== 'cancelled' && (
                        <div className="absolute left-5 top-10 h-full w-0.5 bg-green-200"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Order Placed</p>
                      <p className="text-sm text-gray-600">Your order has been received</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  {/* Processing */}
                  <div className="flex items-start">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        ['processing', 'shipped', 'delivered'].includes(order.order_status) ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <FaShoppingBag className={`h-5 w-5 ${
                          ['processing', 'shipped', 'delivered'].includes(order.order_status) ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                      </div>
                      {['processing', 'shipped', 'delivered'].includes(order.order_status) && (
                        <div className="absolute left-5 top-10 h-full w-0.5 bg-blue-200"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Processing</p>
                      <p className="text-sm text-gray-600">Store is preparing your order</p>
                      {['processing', 'shipped', 'delivered'].includes(order.order_status) && (
                        <p className="text-xs text-gray-500 mt-1">{formatDate(order.updated_at)}</p>
                      )}
                    </div>
                  </div>

                  {/* Shipped */}
                  <div className="flex items-start">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        ['shipped', 'delivered'].includes(order.order_status) ? 'bg-indigo-100' : 'bg-gray-100'
                      }`}>
                        <FaTruck className={`h-5 w-5 ${
                          ['shipped', 'delivered'].includes(order.order_status) ? 'text-indigo-600' : 'text-gray-400'
                        }`} />
                      </div>
                      {['shipped', 'delivered'].includes(order.order_status) && (
                        <div className="absolute left-5 top-10 h-full w-0.5 bg-indigo-200"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Shipped</p>
                      <p className="text-sm text-gray-600">Order is on the way</p>
                      {order.tracking_number && (
                        <p className="text-xs text-blue-600 mt-1">Tracking: {order.tracking_number}</p>
                      )}
                    </div>
                  </div>

                  {/* Delivered/Cancelled */}
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      order.order_status === 'delivered' ? 'bg-green-100' :
                      order.order_status === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {order.order_status === 'delivered' ? (
                        <FaHome className="h-5 w-5 text-green-600" />
                      ) : order.order_status === 'cancelled' ? (
                        <FaTimesCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <FaHome className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {order.order_status === 'cancelled' ? 'Cancelled' : 'Delivered'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.order_status === 'cancelled'
                          ? 'Order has been cancelled'
                          : order.payment_method === 'cash_on_delivery'
                          ? `Pay on delivery: ${formatPrice(order.total)}`
                          : 'Order delivered successfully'}
                      </p>
                      {order.estimated_delivery && order.order_status !== 'delivered' && (
                        <p className="text-xs text-gray-500 mt-1">
                          Estimated: {new Date(order.estimated_delivery).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({order.order_items.length} items)</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Fee</span>
                    <span className="font-medium">{formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span className="font-medium">{formatPrice(order.tax)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-600">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      {order.payment_method === 'cash_on_delivery' ? (
                        <FaMoneyBill className="h-6 w-6 text-green-600" />
                      ) : (
                        <FaCreditCard className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'bKash Payment'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.payment_method === 'cash_on_delivery'
                          ? `Pay ${formatPrice(order.total)} when you receive your order`
                          : order.transaction_id
                          ? `Transaction ID: ${order.transaction_id}`
                          : 'Payment pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Customer & Store Info */}
            <div className="space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaUser className="h-5 w-5 mr-2 text-blue-600" />
                  Customer Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaUser className="h-4 w-4 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaEnvelope className="h-4 w-4 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 break-all">{order.customer_email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaPhone className="h-4 w-4 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{order.customer_phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Delivery Address</p>
                      <p className="font-medium text-gray-900">{order.customer_address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaStore className="h-5 w-5 mr-2 text-blue-600" />
                  Store Information
                </h2>
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900">{order.store_name}</p>
                  {order.store && (
                    <>
                      {order.store.address && (
                        <p className="text-sm text-gray-600 flex items-start">
                          <FaMapMarkerAlt className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          {order.store.address}
                        </p>
                      )}
                      {order.store.mobile && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <FaPhone className="h-4 w-4 mr-2" />
                          {order.store.mobile}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FaReceipt className="h-5 w-5 mr-2 text-blue-600" />
                    Order Notes
                  </h2>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-gray-700">{order.notes}</p>
                  </div>
                </div>
              )}

              {/* Help Card */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center mb-3">
                  <FaShieldAlt className="h-6 w-6 mr-2" />
                  <h3 className="text-lg font-bold">Need Help?</h3>
                </div>
                <p className="text-sm opacity-90 mb-4">
                  Our customer support team is ready to assist you with any questions about your order.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center w-full py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Show;
