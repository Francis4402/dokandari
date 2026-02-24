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

interface PageProps {
  auth: {
    user: any;
  };
  shippedOrders: Order[];
}

const Shipping = ({ shippedOrders: initialOrders, auth }: PageProps) => {
  const [orders] = useState<Order[]>(initialOrders || []);
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
      <Head title="Shipping Management" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Shipping Management</h1>
                <p className="text-gray-600 mt-1">View and manage all shipped orders</p>
              </div>

              <div className="flex space-x-3">
                <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:-translate-y-0.5">
                  <FaPrint className="h-4 w-4 mr-2" />
                  Print Shipping Labels
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Shipped</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalShipped}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaTruck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Transit</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.inTransit}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <FaTruck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Out for Delivery</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.outForDelivery}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <FaShippingFast className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered Today</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.deliveredToday}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FaCheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Shipped Orders</h2>
                  <div className="text-sm text-gray-600">
                    {orders.length} orders
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FaTruck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Shipped Orders</h3>
                    <p className="text-gray-600">
                      No orders have been shipped yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className={`border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer ${
                          selectedOrder?.id === order.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-bold text-gray-800">Order #{order.orderNumber}</h3>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(order.shipping.status)}`}>
                                    {getStatusIcon(order.shipping.status)}
                                    <span className="ml-1">{getStatusLabel(order.shipping.status)}</span>
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  <FaCalendarAlt className="h-3 w-3 inline mr-1" />
                                  Shipped: {new Date(order.shippedDate).toLocaleDateString()}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="font-bold text-gray-800">${order.totalAmount.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">Total Amount</p>
                              </div>
                            </div>

                            {/* Customer Info */}
                            <div className="mb-3">
                              <div className="flex items-center text-sm text-gray-600 mb-1">
                                <FaUser className="h-3 w-3 mr-2" />
                                <span className="font-medium">{order.customer.name}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <FaMapMarkerAlt className="h-3 w-3 mr-2" />
                                <span>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
                              </div>
                            </div>

                            {/* Shipping Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <FaTruck className="h-3 w-3 text-gray-500 mr-1" />
                                  <span className="text-xs text-gray-600">Carrier</span>
                                </div>
                                <p className="font-medium text-gray-800 text-sm">{order.shipping.carrier}</p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <FaBox className="h-3 w-3 text-gray-500 mr-1" />
                                  <span className="text-xs text-gray-600">Tracking</span>
                                </div>
                                <p className="font-medium text-gray-800 text-sm truncate" title={order.shipping.trackingNumber}>
                                  {order.shipping.trackingNumber}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <FaWeightHanging className="h-3 w-3 text-gray-500 mr-1" />
                                  <span className="text-xs text-gray-600">Weight</span>
                                </div>
                                <p className="font-medium text-gray-800 text-sm">{order.shipping.weight} kg</p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <FaDollarSign className="h-3 w-3 text-gray-500 mr-1" />
                                  <span className="text-xs text-gray-600">Shipping Cost</span>
                                </div>
                                <p className="font-medium text-gray-800 text-sm">${order.shipping.shippingCost.toFixed(2)}</p>
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
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <FaEye className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Order Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">Order #{selectedOrder.orderNumber}</h4>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.shipping.status)}`}>
                            {getStatusIcon(selectedOrder.shipping.status)}
                            <span className="ml-2">{getStatusLabel(selectedOrder.shipping.status)}</span>
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCarrierColor(selectedOrder.shipping.carrier)}`}>
                            {selectedOrder.shipping.carrier}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">${selectedOrder.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Total Amount</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Customer Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FaUser className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-800">{selectedOrder.customer.name}</p>
                          <p className="text-xs text-gray-500">Customer Name</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FaEnvelope className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-800">{selectedOrder.customer.email}</p>
                          <p className="text-xs text-gray-500">Email Address</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FaPhone className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-800">{selectedOrder.customer.phone}</p>
                          <p className="text-xs text-gray-500">Phone Number</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Shipping Information</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaMapMarkerAlt className="h-4 w-4 text-blue-400 mr-2" />
                          <span className="font-medium text-gray-800">Delivery Address</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.shippingAddress.street}<br />
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                          {selectedOrder.shippingAddress.country} {selectedOrder.shippingAddress.zipCode}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Contact: {selectedOrder.shippingAddress.contactName} ({selectedOrder.shippingAddress.contactPhone})
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Tracking Number</p>
                          <p className="font-medium text-gray-800 truncate" title={selectedOrder.shipping.trackingNumber}>
                            {selectedOrder.shipping.trackingNumber}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Shipping Method</p>
                          <p className="font-medium text-gray-800">{selectedOrder.shipping.method}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Estimated Delivery</p>
                          <p className="font-medium text-gray-800">
                            {new Date(selectedOrder.shipping.estimatedDelivery).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Actual Delivery</p>
                          <p className="font-medium text-gray-800">
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
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Order Items ({selectedOrder.items.length})</h5>
                    <div className="space-y-2">
                      {selectedOrder.items.map(item => (
                        <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 rounded overflow-hidden mr-3">
                            <img
                              src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-800">${item.price.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Shipping Details</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Package Weight</p>
                        <p className="font-medium text-gray-800">{selectedOrder.shipping.weight} kg</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Dimensions</p>
                        <p className="font-medium text-gray-800">{selectedOrder.shipping.dimensions}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Shipping Cost</p>
                        <p className="font-medium text-gray-800">${selectedOrder.shipping.shippingCost.toFixed(2)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Insurance</p>
                        <p className="font-medium text-gray-800">
                          {selectedOrder.shipping.insurance ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Signature Required</p>
                        <p className="font-medium text-gray-800">
                          {selectedOrder.shipping.signatureRequired ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      <button className="text-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                        Track Shipment
                      </button>
                      <button className="text-center px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors font-medium">
                        Print Label
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Order Details</h3>
                  <p className="text-sm opacity-90 mb-6">
                    Select an order from the list to view detailed shipping information, tracking details, and customer information.
                  </p>
                  <div className="text-center">
                    <FaTruck className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-75">No order selected</p>
                  </div>
                </div>
              )}

              {/* Shipping Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Shipping Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaTruck className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">Average Transit Time</span>
                    </div>
                    <span className="font-bold text-gray-800">3.2 days</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">On-Time Delivery</span>
                    </div>
                    <span className="font-bold text-gray-800">94.5%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaGlobe className="h-4 w-4 text-purple-500 mr-2" />
                      <span className="text-sm text-gray-600">International Shipments</span>
                    </div>
                    <span className="font-bold text-gray-800">{orders.filter(o => o.shippingAddress.country !== 'USA').length}</span>
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

export default Shipping;
