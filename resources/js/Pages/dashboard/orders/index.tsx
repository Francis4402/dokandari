
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import {
  FaShoppingCart,
  FaEye,
  FaTrash,
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
  FaImage,
  FaPhone,
  FaHashtag,
} from 'react-icons/fa';
import { Orders, OrderItem } from '@/types';
import { toast } from 'sonner';
import DeleteConfirmationDialog from '@/Pages/buttons/DeleteConfirmationDialog';


interface DashboardOrderType {
    auth: {
        user: any
    },
    orders: (Orders & {
        order_items?: OrderItem[];
    })[];
}

const DashboardOrders = ({ auth, orders }: DashboardOrderType) => {
    const [selectedOrder, setSelectedOrder] = useState<(Orders & { order_items?: OrderItem[] }) | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Delete dialog state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

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

    // Open delete confirmation dialog
    const openDeleteDialog = (orderId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOrderToDelete(orderId);
        setIsDeleteDialogOpen(true);
    };

    // Close delete dialog
    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setOrderToDelete(null);
    };

    // Handle delete order
    const handleDeleteOrder = () => {
        if (!orderToDelete) return;

        setDeletingId(orderToDelete);

        // Log the URL being called
        const deleteUrl = `/dashboard/orders/${orderToDelete}`;
        console.log('Deleting order at URL:', deleteUrl);

        router.delete(deleteUrl, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                console.log('Delete success:', page);
                toast.success('Order deleted successfully');
                setDeletingId(null);
                closeDeleteDialog();

                // Clear selected order if it was deleted
                if (selectedOrder?.id === orderToDelete) {
                    setSelectedOrder(null);
                }
            },
            onError: (errors) => {
                console.error('Delete error details:', errors);

                // Handle different error formats
                if (typeof errors === 'string') {
                    toast.error(errors);
                } else if (errors.message) {
                    toast.error(errors.message);
                } else {
                    toast.error('Failed to delete order');
                }

                setDeletingId(null);
                closeDeleteDialog();
            },
            onFinish: () => {
                setDeletingId(null);
            }
        });
    };

    const getImageUrl = (imagePath: string | null | undefined) => {
        if (!imagePath) {
            return '/otherplaceholder.jpg';
        }

        const cleanPath = imagePath.replace(/\/+/g, '/');

        if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
            return cleanPath;
        }

        if (cleanPath.includes('/storage/')) {
            return cleanPath;
        }

        const baseUrl = window.location.origin;

        if (cleanPath.startsWith('product_images/')) {
            return `${baseUrl}/storage/${cleanPath}`;
        }

        if (cleanPath.includes('product_images')) {
            const filename = cleanPath.split('/').pop();
            return `${baseUrl}/storage/product_images/${filename}`;
        }

        if (!cleanPath.includes('/')) {
            return `${baseUrl}/storage/product_images/${cleanPath}`;
        }

        return `${baseUrl}/storage/${cleanPath}`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
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
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    Total: {orders.length}
                                </span>
                            </div>
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
                                        {orders.length} order{orders.length !== 1 ? 's' : ''}
                                    </div>
                                </div>

                                {orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FaShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
                                        <p className="text-gray-600 mb-6">
                                            No orders available for your store
                                        </p>
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
                                                                    <span className="ml-2 text-xs text-gray-500">
                                                                        {formatDate(order.created_at)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.order_status)}`}>
                                                                        {getStatusIcon(order.order_status)}
                                                                        <span className="ml-1 capitalize">{order.order_status}</span>
                                                                    </span>
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                                                        <FaCreditCard className="h-3 w-3 mr-1" />
                                                                        <span className="capitalize">{order.payment_status}</span>
                                                                    </span>
                                                                    {order.shipping_method && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                                            <FaTruck className="h-3 w-3 mr-1" />
                                                                            {order.shipping_method === 'pathao' ? 'Pathao' : 'Standard'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    onClick={(e) => openDeleteDialog(order.id, e)}
                                                                    disabled={deletingId === order.id}
                                                                    className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
                                                                        deletingId === order.id ? 'opacity-50 cursor-not-allowed' : ''
                                                                    }`}
                                                                    title="Delete order"
                                                                >
                                                                    {deletingId === order.id ? (
                                                                        <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                                    ) : (
                                                                        <FaTrash className="h-4 w-4" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Customer & Store Info */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                                            <div>
                                                                <div className="flex items-center text-sm text-gray-600 mb-1">
                                                                    <FaUser className="h-3 w-3 mr-2" />
                                                                    <span className="font-medium">{order.recipient_name}</span>
                                                                </div>
                                                                <div className="flex items-center text-sm text-gray-600">
                                                                    <FaEnvelope className="h-3 w-3 mr-2" />
                                                                    <span>{order.sender_email || 'No email'}</span>
                                                                </div>
                                                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                                                    <FaPhone className="h-3 w-3 mr-2" />
                                                                    <span>{order.recipient_phone}</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center text-sm text-gray-600 mb-1">
                                                                    <FaStore className="h-3 w-3 mr-2" />
                                                                    <span className="font-medium">{order.store_name}</span>
                                                                </div>
                                                                <div className="flex items-center text-sm text-gray-600">
                                                                    <FaBox className="h-3 w-3 mr-2" />
                                                                    <span>{order.item_quantity} item{order.item_quantity !== 1 ? 's' : ''}</span>
                                                                </div>
                                                                {order.tracking_number && (
                                                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                                                        <FaHashtag className="h-3 w-3 mr-2" />
                                                                        <span className="text-xs">Track: {order.tracking_number}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Order Items Preview with Images */}
                                                        {order.order_items && order.order_items.length > 0 && (
                                                            <div className="mt-4">
                                                                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                                                                    {order.order_items.slice(0, 5).map((item) => (
                                                                        <div key={item.id} className="flex flex-col items-center">
                                                                            <div className="relative">
                                                                                {item.product_image ? (
                                                                                    <img
                                                                                        src={getImageUrl(item.product_image)}
                                                                                        alt={item.product_name}
                                                                                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                                                                        onError={(e) => {
                                                                                            (e.target as HTMLImageElement).src = '/otherplaceholder.jpg';
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                                                        <FaImage className="h-6 w-6 text-gray-400" />
                                                                                    </div>
                                                                                )}
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
                                                            <p className="text-2xl font-bold text-gray-800">{formatCurrency(order.total)}</p>
                                                            <p className="text-sm text-gray-500">Total Amount</p>
                                                            {order.payment_method === 'cash_on_delivery' && (
                                                                <p className="text-xs text-green-600 mt-1">
                                                                    COD: {formatCurrency(order.amount_to_collect)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.visit(`/orders/${order.id}/confirmation`);
                                                            }}
                                                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                                        >
                                                            <FaEye className="h-3 w-3 inline mr-1" />
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={handleDeleteOrder}
                title="Delete Order"
                message="Are you sure you want to delete this order? This action cannot be undone. All order items will also be deleted."
                isDeleting={deletingId === orderToDelete}
            />
        </DashboardLayout>
    );
};

export default DashboardOrders;
