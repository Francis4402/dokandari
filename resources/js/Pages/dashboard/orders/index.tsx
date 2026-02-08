import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  FaShoppingCart,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaBox,
  FaEnvelope,
  FaCreditCard,
  FaBoxOpen,
  FaStore,
  FaTimes,
  FaImage
} from 'react-icons/fa';
import { Orders, OrderItem } from '@/types';
import { toast } from 'sonner';

interface DashboardOrderType {
    auth: {
        user: any
    },
    orders: Orders[]
}

const DashboardOrders = ({ auth, orders }: DashboardOrderType) => {

    const {delete: deleteOrder} = useForm();

    const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'processing': 'bg-blue-100 text-blue-800',
        'shipped': 'bg-indigo-100 text-indigo-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800',
        'returned': 'bg-purple-100 text-purple-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
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
        'pending': <FaClock className="h-4 w-4" />,
        'processing': <FaBoxOpen className="h-4 w-4" />,
        'shipped': <FaTruck className="h-4 w-4" />,
        'delivered': <FaCheckCircle className="h-4 w-4" />,
        'cancelled': <FaTimesCircle className="h-4 w-4" />,
        'returned': <FaBoxOpen className="h-4 w-4" />
        };
        return icons[status] || <FaShoppingCart className="h-4 w-4" />;
    };

    const handleDeleteOrder = (orderId: string) => {
        deleteOrder(route('orders.delete', orderId), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Order Deleted Succesful')
            },
            onError: () => {
                toast.error('Order Deleted Unsucessful')
            }
        });
    };

    // Helper function to get image URL
    const getImageUrl = (imagePath: string | null | undefined) => {
        if (!imagePath) {
        return '/images/placeholder.jpg';
        }

        // If it's a full URL, return as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
        }

        return `/storage/${imagePath.replace(/^\/+/, '')}`;
    };

    return (
        <DashboardLayout user={auth.user}>
        <Head title="Orders Management" />

        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
                    <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
                </div>

                <Link
                    href="/dashboard/orders/create"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <FaPlus className="h-4 w-4 mr-2" />
                    Create New Order
                </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Orders List */}
                <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">All Orders</h2>
                    <div className="text-sm text-gray-600">
                        {orders.length} orders
                    </div>
                    </div>

                    {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <FaShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
                        <p className="text-gray-600 mb-6">
                        No orders available for your store
                        </p>
                        <Link
                        href="/dashboard/orders/create"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                        >
                        <FaPlus className="h-4 w-4 mr-2" />
                        Create Your First Order
                        </Link>
                    </div>
                    ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                        <div
                            key={order.id}
                            className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                            selectedOrder?.id === order.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                            }`}
                            onClick={() => setSelectedOrder(order)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Order Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center mb-2">
                                    <h3 className="font-bold text-gray-800">{order.order_number}</h3>
                                    <span className="ml-2 text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </span>
                                    </div>
                                    <div className="flex items-center space-x-3 mb-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.order_status)}`}>
                                        {getStatusIcon(order.order_status)}
                                        <span className="ml-1 capitalize">{order.order_status}</span>
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                        <FaCreditCard className="h-3 w-3 mr-1" />
                                        <span className="capitalize">{order.payment_status}</span>
                                    </span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle edit
                                        alert(`Editing order ${order.order_number}`);
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit order"
                                    >
                                    <FaEdit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteOrder(order.id);
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete order"
                                        >
                                        <FaTrash className="h-4 w-4" />
                                    </button>
                                </div>
                                </div>

                                {/* Customer & Store Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center text-sm text-gray-600 mb-1">
                                    <FaUser className="h-3 w-3 mr-2" />
                                    <span className="font-medium">{order.customer_name}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                    <FaEnvelope className="h-3 w-3 mr-2" />
                                    <span>{order.customer_email}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center text-sm text-gray-600 mb-1">
                                    <FaStore className="h-3 w-3 mr-2" />
                                    <span className="font-medium">{order.store_name}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                    <FaBox className="h-3 w-3 mr-2" />
                                    <span>{order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                                </div>

                                {/* Order Items Preview with Images */}
                                {order.order_items && order.order_items.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                                    {order.order_items.slice(0, 5).map((item: OrderItem) => (
                                        <div key={item.id} className="flex flex-col items-center">
                                        <div className="relative">
                                            <img
                                            src={(`/product_images/${item.product_image}`)}
                                            alt={item.product_name}
                                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                            }}
                                            />
                                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                            {item.quantity}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1 truncate max-w-[50px]">
                                            {item.product_name}
                                        </span>
                                        </div>
                                    ))}
                                    {order.order_items.length > 5 && (
                                        <div className="text-xs text-gray-500 flex items-center">
                                        +{order.order_items.length - 5} more
                                        </div>
                                    )}
                                    </div>
                                </div>
                                )}
                            </div>

                            {/* Order Total & Actions */}
                            <div className="flex flex-col items-end">
                                <div className="text-right mb-3">
                                <p className="text-2xl font-bold text-gray-800">${order.total}</p>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                </div>
                                <div className="flex space-x-2">
                                <button
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOrder(order);
                                    }}
                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                >
                                    <FaEye className="h-3 w-3 inline mr-1" />
                                    View Details
                                </button>
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
                    <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                        <button
                        onClick={() => setSelectedOrder(null)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        >
                        <FaTimes className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Order Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-lg font-bold text-gray-800">{selectedOrder.order_number}</h4>
                            <p className="text-sm text-gray-600">
                            Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800">${selectedOrder.total.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">Total Amount</p>
                        </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center space-x-3 mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.order_status)}`}>
                            {getStatusIcon(selectedOrder.order_status)}
                            <span className="ml-2 capitalize">{selectedOrder.order_status}</span>
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                            <FaCreditCard className="h-3 w-3 mr-2" />
                            <span className="capitalize">{selectedOrder.payment_status}</span>
                        </span>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="mb-6">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Customer Information</h5>
                        <div className="space-y-2">
                        <div className="flex items-center">
                            <FaUser className="h-4 w-4 text-gray-400 mr-3" />
                            <div>
                            <p className="font-medium text-gray-800">{selectedOrder.customer_name}</p>
                            <p className="text-sm text-gray-600">{selectedOrder.customer_email}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700">{selectedOrder.customer_phone}</span>
                        </div>
                        <div className="mt-2">
                            <span className="text-gray-700 text-sm">{selectedOrder.customer_address}</span>
                        </div>
                        </div>
                    </div>

                    {/* Store Information */}
                    <div className="mb-6">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Store Information</h5>
                        <div className="flex items-center">
                        <FaStore className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                            <p className="font-medium text-gray-800">{selectedOrder.store_name}</p>
                            <p className="text-sm text-gray-600">Store ID: {selectedOrder.store_id}</p>
                        </div>
                        </div>
                    </div>

                    {/* Order Items with Images */}
                    <div className="mb-6">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">
                        Order Items ({selectedOrder.order_items?.length || 0})
                        </h5>
                        <div className="space-y-3">
                        {selectedOrder.order_items?.map((item: OrderItem) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="relative mr-3">
                                {item.product_image ? (
                                    <img
                                    src={getImageUrl(item.product_image)}
                                    alt={item.product_name}
                                    className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                    }}
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <FaImage className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                                    {item.quantity}
                                </div>
                                </div>
                                <div>
                                <p className="font-medium text-gray-800 text-sm">{item.product_name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                <p className="text-xs text-gray-400">Price: ${item.price}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-gray-800">${item.total}</p>
                                <p className="text-xs text-gray-500">${item.price} × {item.quantity}</p>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 pt-4">
                        <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">${selectedOrder.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">${selectedOrder.shipping}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">${selectedOrder.tax}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Discount</span>
                            <span className="font-medium">${selectedOrder.discount}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                            <span>Total</span>
                            <span>${selectedOrder.total}</span>
                        </div>
                        </div>
                    </div>
                    </div>
                ) : (
                    <div className="bg-blue-50 rounded-lg shadow p-6 text-center">
                    <FaShoppingCart className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-blue-800 mb-2">Order Details</h3>
                    <p className="text-blue-600 text-sm">
                        Select an order from the list to view detailed information
                    </p>
                    </div>
                )}

                {/* Quick Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                    <div className="space-y-3">
                    {['pending', 'processing', 'shipped', 'delivered'].map(status => {
                        const count = orders.filter(order => order.order_status === status).length;
                        return (
                        <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mr-2 ${getStatusColor(status)}`}>
                                {getStatusIcon(status)}
                                <span className="ml-1 capitalize">{status}</span>
                            </span>
                            </div>
                            <span className="font-medium text-gray-800">{count} orders</span>
                        </div>
                        );
                    })}
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </DashboardLayout>
    );
};

export default DashboardOrders;
