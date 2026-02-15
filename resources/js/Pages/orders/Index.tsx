// resources/js/Pages/orders/Index.tsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  FaShoppingBag,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaMoneyBill,
  FaCreditCard,
  FaBox,
  FaCalendar,
  FaReceipt,
  FaArrowRight,
  FaFilter,
  FaSearch,
  FaStore,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaWeight,
  FaTag,
  FaInfoCircle
} from 'react-icons/fa';
import AppLayout from '@/Layouts/AppLayout';
import type { OrderItem, Orders } from '@/types';


interface OrdersProps {
  orders: {
    data: Orders[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  auth: {
    user: any;
  };
}

const Orders: React.FC<OrdersProps> = ({ orders, auth }) => {
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [expandedOrder, setExpandedOrder] = React.useState<string | null>(null);

  const formatPrice = (price: number) => {
    return `৳${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
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
      'pending': <FaBox className="h-4 w-4" />,
      'processing': <FaShoppingBag className="h-4 w-4" />,
      'shipped': <FaTruck className="h-4 w-4" />,
      'delivered': <FaCheckCircle className="h-4 w-4" />,
      'cancelled': <FaTimesCircle className="h-4 w-4" />,
      'returned': <FaTimesCircle className="h-4 w-4" />
    };
    return icons[status] || <FaBox className="h-4 w-4" />;
  };

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) {
      return '/images/placeholder.jpg';
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    if (imagePath.startsWith('/storage/')) {
      return imagePath;
    }

    if (!imagePath.includes('/')) {
      return `/storage/product_images/${imagePath}`;
    }

    return `/storage/${imagePath.replace(/^\/+/, '')}`;
  };

  const filteredOrders = orders.data.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
    const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.recipient_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const orderStatusCounts = orders.data.reduce((acc, order) => {
    acc[order.order_status] = (acc[order.order_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (orders.data.length === 0) {
    return (
      <AppLayout user={auth.user}>
        <Head title="My Orders" />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                <FaShoppingBag className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
              <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaShoppingBag className="h-4 w-4 mr-2" />
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={auth.user}>
      <Head title="My Orders" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.total}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{orderStatusCounts.pending || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <FaBox className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Shipped</p>
                  <p className="text-2xl font-bold text-indigo-600">{orderStatusCounts.shipped || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FaTruck className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">{orderStatusCounts.delivered || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FaCheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by order number or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                {/* Order Header */}
                <div
                  className="p-6 border-b border-gray-200 cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FaReceipt className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-900">
                          Order #{order.order_number}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaCalendar className="h-3 w-3 mr-1" />
                          {formatDate(order.created_at)}
                        </div>
                        <div className="flex items-center">
                          <FaBox className="h-3 w-3 mr-1" />
                          {order.item_quantity} item{order.item_quantity !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center">
                          <FaStore className="h-3 w-3 mr-1" />
                          {order.store_name}
                        </div>
                        <div className="flex items-center">
                          {order.payment_method === 'cash_on_delivery' ? (
                            <FaMoneyBill className="h-3 w-3 mr-1" />
                          ) : (
                            <FaCreditCard className="h-3 w-3 mr-1" />
                          )}
                          {order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'bKash'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.order_status)}`}>
                          {getStatusIcon(order.order_status)}
                          <span className="ml-1 capitalize">{order.order_status}</span>
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                          <span className="capitalize">{order.payment_status}</span>
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="bg-gray-50">
                    {/* Recipient Information */}
                    <div className="p-6 border-b border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <FaUser className="mr-2" /> Delivery Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Recipient</p>
                          <p className="font-medium">{order.recipient_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium flex items-center">
                            <FaPhone className="h-3 w-3 mr-1 text-gray-400" />
                            {order.recipient_phone}
                          </p>
                        </div>
                        {order.recipient_phone_alt && (
                          <div>
                            <p className="text-sm text-gray-600">Alternative Phone</p>
                            <p className="font-medium flex items-center">
                              <FaPhone className="h-3 w-3 mr-1 text-gray-400" />
                              {order.recipient_phone_alt}
                            </p>
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Delivery Address</p>
                          <p className="font-medium flex items-start">
                            <FaMapMarkerAlt className="h-3 w-3 mr-1 mt-1 text-gray-400" />
                            {order.recipient_address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pathao Tracking (if applicable) */}
                    {order.shipping_method === 'pathao' && order.tracking_number && (
                      <div className="p-6 border-b border-gray-200 bg-blue-50">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <FaTruck className="mr-2" /> Pathao Tracking
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-600">Tracking Number</p>
                            <p className="font-medium">{order.tracking_number}</p>
                          </div>
                          {order.pathao_city_name && (
                            <div>
                              <p className="text-xs text-gray-600">City</p>
                              <p className="font-medium">{order.pathao_city_name}</p>
                            </div>
                          )}
                          {order.pathao_zone_name && (
                            <div>
                              <p className="text-xs text-gray-600">Zone</p>
                              <p className="font-medium">{order.pathao_zone_name}</p>
                            </div>
                          )}
                          {order.estimated_delivery && (
                            <div>
                              <p className="text-xs text-gray-600">Estimated Delivery</p>
                              <p className="font-medium">{formatDate(order.estimated_delivery)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div className="p-6 border-b border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <FaBox className="mr-2" /> Order Items ({order.order_items?.length || 0})
                      </h4>
                      <div className="space-y-3">
                        {order.order_items?.map((item: OrderItem) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-lg">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                              {item.product_image ? (
                                <img
                                  src={getImageUrl(item.product_image)}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FaBox className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{item.product_name}</p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-800">{formatPrice(item.total)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="p-6 border-b border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h4>
                      <div className="space-y-2 max-w-md ml-auto">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Delivery Charge</span>
                          <span className="font-medium">{formatPrice(order.delivery_charge)}</span>
                        </div>
                        {order.cod_charge > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">COD Charge</span>
                            <span className="font-medium">{formatPrice(order.cod_charge)}</span>
                          </div>
                        )}
                        {order.discount_amount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Discount</span>
                            <span className="font-medium text-green-600">-{formatPrice(order.discount_amount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                          <span>Total</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                        {order.amount_to_collect > 0 && order.payment_method === 'cash_on_delivery' && (
                          <div className="flex justify-between text-sm text-blue-600">
                            <span>Amount to Collect</span>
                            <span className="font-medium">{formatPrice(order.amount_to_collect)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Information */}
                    {(order.item_weight > 0 || order.coupon_code || order.notes) && (
                      <div className="p-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {order.item_weight > 0 && (
                            <div className="flex items-center">
                              <FaWeight className="h-3 w-3 mr-2 text-gray-400" />
                              <span>Weight: {order.item_weight} kg</span>
                            </div>
                          )}
                          {order.coupon_code && (
                            <div className="flex items-center">
                              <FaTag className="h-3 w-3 mr-2 text-gray-400" />
                              <span>Coupon: {order.coupon_code}</span>
                            </div>
                          )}
                          {order.shipped_at && (
                            <div className="flex items-center">
                              <FaCalendar className="h-3 w-3 mr-2 text-gray-400" />
                              <span>Shipped: {formatDate(order.shipped_at)}</span>
                            </div>
                          )}
                          {order.delivered_at && (
                            <div className="flex items-center">
                              <FaCheckCircle className="h-3 w-3 mr-2 text-green-400" />
                              <span>Delivered: {formatDate(order.delivered_at)}</span>
                            </div>
                          )}
                        </div>
                        {order.notes && (
                          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                            <p className="text-xs font-medium text-yellow-800 mb-1 flex items-center">
                              <FaInfoCircle className="mr-1" /> Notes:
                            </p>
                            <p className="text-sm text-yellow-700">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Order Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaEye className="h-4 w-4 mr-2" />
                      View Full Details
                    </Link>
                    {order.order_status === 'delivered' && (
                      <button
                        onClick={() => window.location.href = `/products?reorder=${order.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FaShoppingBag className="h-4 w-4 mr-2" />
                        Order Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {orders.last_page > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                {Array.from({ length: orders.last_page }, (_, i) => i + 1).map(page => (
                  <Link
                    key={page}
                    href={`/orders?page=${page}`}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      page === orders.current_page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State for Filtered Results */}
          {filteredOrders.length === 0 && orders.data.length > 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FaSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Orders;
