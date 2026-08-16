// Payments.tsx
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaBox,
  FaDollarSign,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaEye,
  FaPrint,
  FaUser,
  FaGlobe,
  FaShippingFast,
  FaWeightHanging
} from 'react-icons/fa';
import { PageProps } from '@/types';
import FormatPrice from '@/Pages/utils/FormatePrice';
import Eyebrow from '@/Pages/Components/Eyebrow';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    contactName: string;
    contactPhone: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    sku: string;
    image: string;
  }>;
  shipping: {
    method: string;
    carrier: string;
    trackingNumber: string;
    estimatedDelivery: string;
    actualDelivery: string | null;
    status: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed' | 'exception';
    weight: number;
    dimensions: string;
    shippingCost: number;
    insurance: boolean;
    signatureRequired: boolean;
  };
  orderDate: string;
  shippedDate: string;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  notes: string | null;
}

interface ShippingProps extends PageProps {
  shippedOrders: Order[];
}

const Payments: React.FC<ShippingProps> = ({ shippedOrders, auth }) => {
  const [orders] = useState<Order[]>(shippedOrders || []);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: Order['shipping']['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-blue-100 text-blue-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      delayed: 'bg-orange-100 text-orange-800',
      exception: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const getStatusIcon = (status: Order['shipping']['status']) => {
    const icons = {
      pending: <FaClock className="h-4 w-4" />,
      in_transit: <FaTruck className="h-4 w-4" />,
      out_for_delivery: <FaShippingFast className="h-4 w-4" />,
      delivered: <FaCheckCircle className="h-4 w-4" />,
      delayed: <FaExclamationTriangle className="h-4 w-4" />,
      exception: <FaExclamationTriangle className="h-4 w-4" />,
    };
    return icons[status];
  };

  const getStatusLabel = (status: Order['shipping']['status']) => {
    const labels = {
      pending: 'Pending',
      in_transit: 'In Transit',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      delayed: 'Delayed',
      exception: 'Exception',
    };
    return labels[status];
  };

  const getCarrierColor = (carrier: string) => {
    const carrierLower = carrier.toLowerCase();
    if (carrierLower.includes('fedex')) return 'bg-purple-100 text-purple-800';
    if (carrierLower.includes('ups')) return 'bg-yellow-100 text-yellow-800';
    if (carrierLower.includes('dhl')) return 'bg-red-100 text-red-800';
    if (carrierLower.includes('usps')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const stats = {
    totalShipped: orders.length,
    inTransit: orders.filter(o => o.shipping.status === 'in_transit').length,
    outForDelivery: orders.filter(o => o.shipping.status === 'out_for_delivery').length,
    deliveredToday: orders.filter(o =>
      o.shipping.actualDelivery &&
      new Date(o.shipping.actualDelivery).toDateString() === new Date().toDateString()
    ).length,
  };

  return (
    <DashboardLayout user={auth.user}>
      <Head title="Payment Management" />

      <div className="bg-paper-dim">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <Eyebrow>Manage payments</Eyebrow>
              <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Payments</h1>
              <p className="text-text-soft mt-1">View and manage all shipped orders</p>
            </div>

            <div className="flex space-x-3">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
                <FaPrint className="h-4 w-4" />
                Print Shipping Labels
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Shipped</p>
                  <p className="text-2xl font-bold text-ink mt-1">{stats.totalShipped}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center">
                  <FaTruck className="h-6 w-6 text-marigold" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">In Transit</p>
                  <p className="text-2xl font-bold text-ink mt-1">{stats.inTransit}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <FaTruck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Out for Delivery</p>
                  <p className="text-2xl font-bold text-ink mt-1">{stats.outForDelivery}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <FaShippingFast className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Delivered Today</p>
                  <p className="text-2xl font-bold text-ink mt-1">{stats.deliveredToday}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <FaCheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Shipped Orders</h2>
                  <span className="text-sm text-text-soft font-mono">{orders.length} orders</span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FaTruck className="h-16 w-16 text-text-soft mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-ink mb-2">No Shipped Orders</h3>
                    <p className="text-text-soft">No orders have been shipped yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className={`border border-line rounded-xl p-4 hover:shadow-hard-sm transition-all duration-300 cursor-pointer ${
                          selectedOrder?.id === order.id ? 'ring-2 ring-marigold bg-marigold/5' : ''
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-bold text-ink">Order #{order.orderNumber}</h3>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.shipping.status)}`}>
                                    {getStatusIcon(order.shipping.status)}
                                    <span>{getStatusLabel(order.shipping.status)}</span>
                                  </span>
                                </div>
                                <p className="text-sm text-text-soft mt-1">
                                  <FaCalendarAlt className="h-3 w-3 inline mr-1" />
                                  Shipped: {new Date(order.shippedDate).toLocaleDateString()}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="font-bold text-ink">
                                  <FormatPrice price={order.totalAmount} />
                                </p>
                                <p className="text-xs text-text-soft">Total Amount</p>
                              </div>
                            </div>

                            {/* Customer Info */}
                            <div className="mb-3">
                              <div className="flex items-center text-sm text-text-soft mb-1">
                                <FaUser className="h-3 w-3 mr-2" />
                                <span className="font-medium text-ink">{order.customer.name}</span>
                              </div>
                              <div className="flex items-center text-sm text-text-soft">
                                <FaMapMarkerAlt className="h-3 w-3 mr-2" />
                                <span>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
                              </div>
                            </div>

                            {/* Shipping Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div className="p-2 bg-paper-dim rounded-xl">
                                <div className="flex items-center">
                                  <FaTruck className="h-3 w-3 text-text-soft mr-1" />
                                  <span className="text-xs text-text-soft">Carrier</span>
                                </div>
                                <p className="font-medium text-ink text-sm">{order.shipping.carrier}</p>
                              </div>
                              <div className="p-2 bg-paper-dim rounded-xl">
                                <div className="flex items-center">
                                  <FaBox className="h-3 w-3 text-text-soft mr-1" />
                                  <span className="text-xs text-text-soft">Tracking</span>
                                </div>
                                <p className="font-medium text-ink text-sm truncate" title={order.shipping.trackingNumber}>
                                  {order.shipping.trackingNumber}
                                </p>
                              </div>
                              <div className="p-2 bg-paper-dim rounded-xl">
                                <div className="flex items-center">
                                  <FaWeightHanging className="h-3 w-3 text-text-soft mr-1" />
                                  <span className="text-xs text-text-soft">Weight</span>
                                </div>
                                <p className="font-medium text-ink text-sm">{order.shipping.weight} kg</p>
                              </div>
                              <div className="p-2 bg-paper-dim rounded-xl">
                                <div className="flex items-center">
                                  <FaDollarSign className="h-3 w-3 text-text-soft mr-1" />
                                  <span className="text-xs text-text-soft">Cost</span>
                                </div>
                                <p className="font-medium text-ink text-sm">
                                  <FormatPrice price={order.shipping.shippingCost} />
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order Details Sidebar */}
            <div className="space-y-6">
              {selectedOrder ? (
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Order Details</h3>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-1 text-text-soft hover:text-marigold rounded-lg hover:bg-paper-dim transition-colors"
                    >
                      <FaEye className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Order Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-ink">Order #{selectedOrder.orderNumber}</h4>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.shipping.status)}`}>
                            {getStatusIcon(selectedOrder.shipping.status)}
                            <span>{getStatusLabel(selectedOrder.shipping.status)}</span>
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCarrierColor(selectedOrder.shipping.carrier)}`}>
                            {selectedOrder.shipping.carrier}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-ink">
                          <FormatPrice price={selectedOrder.totalAmount} />
                        </p>
                        <p className="text-sm text-text-soft">Total Amount</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="mb-6">
                    <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Customer Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center p-3 bg-paper-dim rounded-xl border border-line">
                        <FaUser className="h-4 w-4 text-text-soft mr-3" />
                        <div>
                          <p className="font-medium text-ink">{selectedOrder.customer.name}</p>
                          <p className="text-xs text-text-soft">Customer Name</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-paper-dim rounded-xl border border-line">
                        <FaEnvelope className="h-4 w-4 text-text-soft mr-3" />
                        <div>
                          <p className="font-medium text-ink">{selectedOrder.customer.email}</p>
                          <p className="text-xs text-text-soft">Email Address</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-paper-dim rounded-xl border border-line">
                        <FaPhone className="h-4 w-4 text-text-soft mr-3" />
                        <div>
                          <p className="font-medium text-ink">{selectedOrder.customer.phone}</p>
                          <p className="text-xs text-text-soft">Phone Number</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="mb-6">
                    <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Shipping Information</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-marigold/5 rounded-xl border border-marigold/20">
                        <div className="flex items-center mb-2">
                          <FaMapMarkerAlt className="h-4 w-4 text-marigold mr-2" />
                          <span className="font-medium text-ink">Delivery Address</span>
                        </div>
                        <p className="text-sm text-text-soft">
                          {selectedOrder.shippingAddress.street}<br />
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                          {selectedOrder.shippingAddress.country} {selectedOrder.shippingAddress.zipCode}
                        </p>
                        <p className="text-xs text-text-soft mt-2">
                          Contact: {selectedOrder.shippingAddress.contactName} ({selectedOrder.shippingAddress.contactPhone})
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-paper-dim rounded-xl border border-line">
                          <p className="text-xs text-text-soft">Tracking Number</p>
                          <p className="font-medium text-ink truncate" title={selectedOrder.shipping.trackingNumber}>
                            {selectedOrder.shipping.trackingNumber}
                          </p>
                        </div>
                        <div className="p-3 bg-paper-dim rounded-xl border border-line">
                          <p className="text-xs text-text-soft">Shipping Method</p>
                          <p className="font-medium text-ink">{selectedOrder.shipping.method}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-paper-dim rounded-xl border border-line">
                          <p className="text-xs text-text-soft">Estimated Delivery</p>
                          <p className="font-medium text-ink">
                            {new Date(selectedOrder.shipping.estimatedDelivery).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="p-3 bg-paper-dim rounded-xl border border-line">
                          <p className="text-xs text-text-soft">Actual Delivery</p>
                          <p className="font-medium text-ink">
                            {selectedOrder.shipping.actualDelivery
                              ? new Date(selectedOrder.shipping.actualDelivery).toLocaleDateString()
                              : 'Not delivered yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Order Items ({selectedOrder.items.length})</h5>
                    <div className="space-y-2">
                      {selectedOrder.items.map(item => (
                        <div key={item.id} className="flex items-center p-3 bg-paper-dim rounded-xl border border-line">
                          <div className="w-10 h-10 rounded overflow-hidden mr-3 border border-line">
                            <img
                              src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-ink text-sm">{item.name}</p>
                            <p className="text-xs text-text-soft">SKU: {item.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-ink">
                              <FormatPrice price={item.price} />
                            </p>
                            <p className="text-xs text-text-soft">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="mb-6">
                    <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Shipping Details</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-paper-dim rounded-xl border border-line">
                        <p className="text-xs text-text-soft">Package Weight</p>
                        <p className="font-medium text-ink">{selectedOrder.shipping.weight} kg</p>
                      </div>
                      <div className="p-3 bg-paper-dim rounded-xl border border-line">
                        <p className="text-xs text-text-soft">Dimensions</p>
                        <p className="font-medium text-ink">{selectedOrder.shipping.dimensions}</p>
                      </div>
                      <div className="p-3 bg-paper-dim rounded-xl border border-line">
                        <p className="text-xs text-text-soft">Shipping Cost</p>
                        <p className="font-medium text-ink">
                          <FormatPrice price={selectedOrder.shipping.shippingCost} />
                        </p>
                      </div>
                      <div className="p-3 bg-paper-dim rounded-xl border border-line">
                        <p className="text-xs text-text-soft">Insurance</p>
                        <p className="font-medium text-ink">
                          {selectedOrder.shipping.insurance ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="p-3 bg-paper-dim rounded-xl border border-line">
                        <p className="text-xs text-text-soft">Signature Required</p>
                        <p className="font-medium text-ink">
                          {selectedOrder.shipping.signatureRequired ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-line">
                    <div className="grid grid-cols-2 gap-3">
                      <button className="text-center px-4 py-2 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-all duration-300 font-medium border border-line">
                        Track Shipment
                      </button>
                      <button className="text-center px-4 py-2 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-all duration-300 font-medium border border-line">
                        Print Label
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm border border-line p-6 text-white sticky top-6">
                  <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] mb-4">Order Details</h3>
                  <p className="text-sm text-gray-300 mb-6">
                    Select an order from the list to view detailed shipping information, tracking details, and customer information.
                  </p>
                  <div className="text-center">
                    <FaTruck className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm text-gray-400">No order selected</p>
                  </div>
                </div>
              )}

              {/* Shipping Stats */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-4">Shipping Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line">
                    <div className="flex items-center">
                      <FaTruck className="h-4 w-4 text-marigold mr-2" />
                      <span className="text-sm text-text-soft">Average Transit Time</span>
                    </div>
                    <span className="font-bold text-ink">3.2 days</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line">
                    <div className="flex items-center">
                      <FaCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-text-soft">On-Time Delivery</span>
                    </div>
                    <span className="font-bold text-ink">94.5%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line">
                    <div className="flex items-center">
                      <FaGlobe className="h-4 w-4 text-purple-500 mr-2" />
                      <span className="text-sm text-text-soft">International Shipments</span>
                    </div>
                    <span className="font-bold text-ink">{orders.filter(o => o.shippingAddress.country !== 'USA').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
