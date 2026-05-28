import { useState } from 'react';
import { OrderItem, Orders } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
    IoChevronDown,
    IoChevronUp,
    IoCartOutline,
    IoPersonOutline,
    IoLocationOutline,
    IoPricetagOutline,
    IoTimeOutline,
    IoRefreshOutline
} from 'react-icons/io5';
import {
    MdPayment,
    MdOutlineTrackChanges
} from 'react-icons/md';
import {
    FaBox,
    FaWeightHanging,
    FaTruck,
    FaCreditCard
} from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { BiPhone } from 'react-icons/bi';
import DashboardLayout from '@/Layouts/DashboardLayout';
import FormatPrice from '@/Pages/utils/FormatePrice';

interface AdminOrderProps {
    auth: {
        user: any;
    };
    orders: (Orders & {
        order_items?: OrderItem[];
    })[];
}

// Tracks which specific field on which order is currently being updated
interface UpdatingState {
    id: string;
    field: 'payment_status' | 'order_status';
}

const AdminOrders = ({ orders, auth }: AdminOrderProps) => {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [updating, setUpdating] = useState<UpdatingState | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');

    const paymentStatusOptions = [
        { value: 'pending',  label: 'Pending',  color: 'bg-yellow-100 text-yellow-800' },
        { value: 'paid',     label: 'Paid',     color: 'bg-green-100 text-green-800'  },
        { value: 'failed',   label: 'Failed',   color: 'bg-red-100 text-red-800'      },
        { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800'    },
    ];

    const orderStatusOptions = [
        { value: 'pending',    label: 'Pending',    color: 'bg-yellow-100 text-yellow-800' },
        { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800'    },
        { value: 'confirmed',  label: 'Confirmed',  color: 'bg-indigo-100 text-indigo-800'},
        { value: 'shipped',    label: 'Shipped',    color: 'bg-purple-100 text-purple-800'},
        { value: 'delivered',  label: 'Delivered',  color: 'bg-green-100 text-green-800'  },
        { value: 'cancelled',  label: 'Cancelled',  color: 'bg-red-100 text-red-800'      },
    ];

    const handleUpdateStatus = (
        orderId: string,
        field: 'payment_status' | 'order_status',
        value: string
    ) => {
        setUpdating({ id: orderId, field });
        router.patch(
            route('admin.orders.update', orderId),
            { [field]: value },
            {
                onFinish: () => setUpdating(null),
                onSuccess: () => console.log('Status updated successfully'),
                onError: (errors) => console.error('Failed to update status:', errors),
                preserveScroll: true,
            }
        );
    };

    const isUpdating = (orderId: string, field: 'payment_status' | 'order_status') =>
        updating?.id === orderId && updating?.field === field;

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const getStatusColor = (status: string, type: 'payment' | 'order') => {
        const options = type === 'payment' ? paymentStatusOptions : orderStatusOptions;
        return options.find(opt => opt.value === status)?.color ?? 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleString();

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            searchTerm === '' ||
            order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.store_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus  = statusFilter  === 'all' || order.order_status   === statusFilter;
        const matchesPayment = paymentFilter === 'all' || order.payment_status  === paymentFilter;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    const stats = {
        total:      orders.length,
        pending:    orders.filter(o => o.order_status === 'pending').length,
        processing: orders.filter(o => o.order_status === 'processing').length,
        delivered:  orders.filter(o => o.order_status === 'delivered').length,
        revenue:    orders.reduce((sum, o) => sum + o.total, 0),
    };

    return (
        <DashboardLayout user={auth.user}>
            <Head title="Orders Management" />

            <div className="min-h-screen bg-gray-50 p-4 md:p-6">

                {/* ── Header ───────────────────────────────────────────── */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <IoCartOutline className="h-6 w-6 text-blue-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                            </div>
                            <p className="text-gray-600 ml-12">Manage and track all customer orders</p>
                        </div>
                    </div>
                </div>

                {/* ── Stats Cards ──────────────────────────────────────── */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 mb-8">
                    {[
                        {
                            label: 'Total Orders',
                            value: stats.total,
                            icon: <IoCartOutline className="h-6 w-6 text-blue-600" />,
                            bg: 'bg-blue-100',
                        },
                        {
                            label: 'Pending Orders',
                            value: stats.pending,
                            icon: <IoTimeOutline className="h-6 w-6 text-yellow-600" />,
                            bg: 'bg-yellow-100',
                        },
                        {
                            label: 'Processing',
                            value: stats.processing,
                            icon: <FaTruck className="h-6 w-6 text-purple-600" />,
                            bg: 'bg-purple-100',
                        }
                    ].map(({ label, value, icon, bg }) => (
                        <div
                            key={label}
                            className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 p-3 ${bg} rounded-lg`}>{icon}</div>
                                <div className="ml-5 w-0 flex-1">
                                    <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Filters ──────────────────────────────────────────── */}
                <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2"
                        >
                            <option value="all">All Order Status</option>
                            {orderStatusOptions.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>

                        <select
                            value={paymentFilter}
                            onChange={e => setPaymentFilter(e.target.value)}
                            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2"
                        >
                            <option value="all">All Payment Status</option>
                            {paymentStatusOptions.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by order #, customer, or store..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-80 rounded-lg border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-blue-500 text-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ── Orders Table ─────────────────────────────────────── */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Order #', 'Customer', 'Store', 'Total', 'Payment Status', 'Order Status', 'Date', 'Actions'].map(col => (
                                        <th
                                            key={col}
                                            scope="col"
                                            className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${col === 'Actions' ? 'text-right' : 'text-left'}`}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map(order => (
                                    <Fragment key={order.id}>
                                        <tr className="hover:bg-gray-50 transition-colors duration-150">

                                            {/* Order # */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <MdOutlineTrackChanges className="h-5 w-5 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">{order.order_number}</span>
                                                </div>
                                            </td>

                                            {/* Customer */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white font-medium text-sm">
                                                            {order.recipient_name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{order.recipient_name}</div>
                                                        <div className="text-sm text-gray-500">{order.recipient_phone}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Store */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.store_name}
                                            </td>

                                            {/* Total */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                <FormatPrice price={order.total} />
                                            </td>

                                            {/* ── Payment Status Dropdown ── */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Menu as="div" className="relative inline-block text-left">
                                                    <Menu.Button
                                                        disabled={isUpdating(order.id, 'payment_status')}
                                                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium
                                                            ${getStatusColor(order.payment_status, 'payment')}
                                                            hover:opacity-80 transition-opacity cursor-pointer
                                                            disabled:opacity-60 disabled:cursor-not-allowed`}
                                                    >
                                                        {isUpdating(order.id, 'payment_status') ? (
                                                            <>
                                                                <IoRefreshOutline className="h-3 w-3 animate-spin" />
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MdPayment className="h-3 w-3" />
                                                                {paymentStatusOptions.find(o => o.value === order.payment_status)?.label}
                                                            </>
                                                        )}
                                                        <IoChevronDown className="h-3 w-3" />
                                                    </Menu.Button>

                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="absolute left-0 z-10 mt-2 w-36 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            <div className="py-1">
                                                                {paymentStatusOptions.map(option => (
                                                                    <Menu.Item key={option.value}>
                                                                        {({ active }) => (
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleUpdateStatus(order.id, 'payment_status', option.value)
                                                                                }
                                                                                className={`${active ? 'bg-gray-100' : ''} block w-full px-4 py-2 text-left text-sm text-gray-700`}
                                                                            >
                                                                                <span className={`inline-flex items-center gap-2`}>
                                                                                    <span className={`h-2 w-2 rounded-full ${option.color.split(' ')[0]}`} />
                                                                                    {option.label}
                                                                                </span>
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                ))}
                                                            </div>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            </td>

                                            {/* ── Order Status Dropdown ── */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Menu as="div" className="relative inline-block text-left">
                                                    <Menu.Button
                                                        disabled={isUpdating(order.id, 'order_status')}
                                                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium
                                                            ${getStatusColor(order.order_status, 'order')}
                                                            hover:opacity-80 transition-opacity cursor-pointer
                                                            disabled:opacity-60 disabled:cursor-not-allowed`}
                                                    >
                                                        {isUpdating(order.id, 'order_status') ? (
                                                            <>
                                                                <IoRefreshOutline className="h-3 w-3 animate-spin" />
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaTruck className="h-3 w-3" />
                                                                {orderStatusOptions.find(o => o.value === order.order_status)?.label}
                                                            </>
                                                        )}
                                                        <IoChevronDown className="h-3 w-3" />
                                                    </Menu.Button>

                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="absolute left-0 z-10 mt-2 w-36 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            <div className="py-1">
                                                                {orderStatusOptions.map(option => (
                                                                    <Menu.Item key={option.value}>
                                                                        {({ active }) => (
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleUpdateStatus(order.id, 'order_status', option.value)
                                                                                }
                                                                                className={`${active ? 'bg-gray-100' : ''} block w-full px-4 py-2 text-left text-sm text-gray-700`}
                                                                            >
                                                                                <span className="inline-flex items-center gap-2">
                                                                                    <span className={`h-2 w-2 rounded-full ${option.color.split(' ')[0]}`} />
                                                                                    {option.label}
                                                                                </span>
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                ))}
                                                            </div>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order.created_at)}
                                            </td>

                                            {/* Toggle details */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => toggleOrderDetails(order.id)}
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 transition-colors"
                                                >
                                                    {expandedOrder === order.id ? (
                                                        <><IoChevronUp className="h-4 w-4" />Hide</>
                                                    ) : (
                                                        <><IoChevronDown className="h-4 w-4" />Details</>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>

                                        {/* ── Expanded Details Row ─────────────────────────── */}
                                        {expandedOrder === order.id && (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-6 bg-gray-50">
                                                    <div className="space-y-6">
                                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                                                            {/* Order Information */}
                                                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                                                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                                                                    <FaBox className="h-4 w-4 text-blue-500" />
                                                                    Order Information
                                                                </h4>
                                                                <dl className="space-y-2 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <dt className="text-gray-500">Tracking #:</dt>
                                                                        <dd className="font-medium">{order.tracking_number || 'N/A'}</dd>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <dt className="text-gray-500">Shipping Method:</dt>
                                                                        <dd>{order.shipping_method}</dd>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <dt className="text-gray-500">Payment Method:</dt>
                                                                        <dd className="flex items-center gap-1">
                                                                            <FaCreditCard className="h-3 w-3" />
                                                                            {order.payment_method}
                                                                        </dd>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <dt className="text-gray-500">Item Quantity:</dt>
                                                                        <dd>{order.item_quantity}</dd>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <dt className="text-gray-500">Total Weight:</dt>
                                                                        <dd className="flex items-center gap-1">
                                                                            <FaWeightHanging className="h-3 w-3" />
                                                                            {order.item_weight} kg
                                                                        </dd>
                                                                    </div>
                                                                </dl>
                                                            </div>

                                                            {/* Recipient Details */}
                                                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                                                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                                                                    <IoPersonOutline className="h-4 w-4 text-blue-500" />
                                                                    Recipient Details
                                                                </h4>
                                                                <dl className="space-y-2 text-sm">
                                                                    <div>
                                                                        <dt className="text-gray-500">Name</dt>
                                                                        <dd className="font-medium">{order.recipient_name}</dd>
                                                                    </div>
                                                                    <div>
                                                                        <dt className="text-gray-500 flex items-center gap-1">
                                                                            <HiOutlineMail className="h-3 w-3" /> Email
                                                                        </dt>
                                                                        <dd>{order.recipient_email}</dd>
                                                                    </div>
                                                                    <div>
                                                                        <dt className="text-gray-500 flex items-center gap-1">
                                                                            <BiPhone className="h-3 w-3" /> Phone
                                                                        </dt>
                                                                        <dd>{order.recipient_phone}</dd>
                                                                    </div>
                                                                    <div>
                                                                        <dt className="text-gray-500 flex items-center gap-1">
                                                                            <IoLocationOutline className="h-3 w-3" /> Address
                                                                        </dt>
                                                                        <dd>{order.recipient_address}</dd>
                                                                    </div>
                                                                </dl>
                                                            </div>

                                                            {/* Order Summary */}
                                                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                                                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                                                                    <IoPricetagOutline className="h-4 w-4 text-blue-500" />
                                                                    Order Summary
                                                                </h4>
                                                                <dl className="space-y-2 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <dt className="text-gray-500">Subtotal:</dt>
                                                                        <dd><FormatPrice price={order.subtotal} /></dd>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <dt className="text-gray-500">Delivery Charge:</dt>
                                                                        <dd><FormatPrice price={order.delivery_charge} /></dd>
                                                                    </div>
                                                                    {order.discount_amount > 0 && (
                                                                        <div className="flex justify-between text-red-600">
                                                                            <dt>Discount:</dt>
                                                                            <dd>-<FormatPrice price={order.discount_amount} /></dd>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex justify-between border-t pt-2 font-semibold">
                                                                        <dt>Total:</dt>
                                                                        <dd className="text-lg text-blue-600">
                                                                            <FormatPrice price={order.total} />
                                                                        </dd>
                                                                    </div>
                                                                </dl>
                                                            </div>
                                                        </div>

                                                        {/* Order Items */}
                                                        {order.order_items && order.order_items.length > 0 && (
                                                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                                                <h4 className="text-sm font-semibold text-gray-900 px-4 py-3 border-b">
                                                                    Order Items
                                                                </h4>
                                                                <div className="overflow-x-auto">
                                                                    <table className="min-w-full divide-y divide-gray-200">
                                                                        <thead className="bg-gray-50">
                                                                            <tr>
                                                                                {['Product', 'Quantity', 'Price', 'Total'].map(col => (
                                                                                    <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                                                        {col}
                                                                                    </th>
                                                                                ))}
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-gray-200">
                                                                            {order.order_items.map(item => (
                                                                                <tr key={item.id} className="hover:bg-gray-50">
                                                                                    <td className="px-4 py-3">
                                                                                        <div className="flex items-center gap-3">
                                                                                            {item.product_image && (
                                                                                                <img
                                                                                                    src={item.product_image}
                                                                                                    alt={item.product_name}
                                                                                                    className="h-10 w-10 object-cover rounded"
                                                                                                />
                                                                                            )}
                                                                                            <span className="font-medium text-sm">{item.product_name}</span>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="px-4 py-3 text-sm">{item.quantity}</td>
                                                                                    <td className="px-4 py-3 text-sm"><FormatPrice price={item.price} /></td>
                                                                                    <td className="px-4 py-3 text-sm font-medium"><FormatPrice price={item.total} /></td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Notes */}
                                                        {order.notes && (
                                                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes</h4>
                                                                <p className="text-sm text-gray-600">{order.notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>

                        {/* Empty State */}
                        {filteredOrders.length === 0 && (
                            <div className="text-center py-12">
                                <IoCartOutline className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminOrders;
