
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
    FaCreditCard,
    FaSearch
} from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { BiPhone } from 'react-icons/bi';
import DashboardLayout from '@/Layouts/DashboardLayout';
import FormatPrice from '@/Pages/utils/FormatePrice';
import Eyebrow from '@/Pages/Components/Eyebrow';


interface AdminOrderProps {
    auth: {
        user: any;
    };
    orders: (Orders & {
        order_items?: OrderItem[];
    })[];
}

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

            <div>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <Eyebrow>Manage customer orders</Eyebrow>
                            <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Orders</h1>
                            <p className="text-text-soft mt-1">Manage and track all customer orders</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-marigold/10 rounded-xl">
                                    <IoCartOutline className="h-6 w-6 text-marigold" />
                                </div>
                                <div className="ml-4">
                                    <dt className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Orders</dt>
                                    <dd className="text-2xl font-bold text-ink">{stats.total}</dd>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-xl">
                                    <IoTimeOutline className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <dt className="text-xs font-mono text-text-soft uppercase tracking-wide">Pending</dt>
                                    <dd className="text-2xl font-bold text-ink">{stats.pending}</dd>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-purple-100 rounded-xl">
                                    <FaTruck className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <dt className="text-xs font-mono text-text-soft uppercase tracking-wide">Processing</dt>
                                    <dd className="text-2xl font-bold text-ink">{stats.processing}</dd>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-green-100 rounded-xl">
                                    <MdPayment className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <dt className="text-xs font-mono text-text-soft uppercase tracking-wide">Revenue</dt>
                                    <dd className="text-2xl font-bold text-ink">
                                        <FormatPrice price={stats.revenue} />
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8">
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex flex-wrap gap-3">
                                <select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink focus:ring-2 focus:ring-marigold focus:border-transparent"
                                >
                                    <option value="all">All Order Status</option>
                                    {orderStatusOptions.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>

                                <select
                                    value={paymentFilter}
                                    onChange={e => setPaymentFilter(e.target.value)}
                                    className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink focus:ring-2 focus:ring-marigold focus:border-transparent"
                                >
                                    <option value="all">All Payment Status</option>
                                    {paymentStatusOptions.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search by order #, customer, or store..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-80 rounded-xl border border-line pl-10 pr-4 py-2 text-sm text-ink placeholder:text-text-soft focus:ring-2 focus:ring-marigold focus:border-transparent bg-white"
                                />
                            </div>
                        </div>

                        {filteredOrders.length > 0 && (
                            <div className="mt-4 text-sm text-text-soft">
                                Showing <span className="font-semibold text-ink">{filteredOrders.length}</span> of <span className="font-semibold text-ink">{orders.length}</span> orders
                            </div>
                        )}
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-line">
                                <thead className="bg-paper-dim">
                                    <tr>
                                        {['Order #', 'Customer', 'Store', 'Total', 'Payment Status', 'Order Status', 'Date', 'Actions'].map(col => (
                                            <th
                                                key={col}
                                                scope="col"
                                                className={`px-6 py-3 text-xs font-mono text-text-soft uppercase tracking-wide ${col === 'Actions' ? 'text-right' : 'text-left'}`}
                                            >
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-line">
                                    {filteredOrders.map(order => (
                                        <Fragment key={order.id}>
                                            <tr className="hover:bg-paper-dim/50 transition-colors duration-150">

                                                {/* Order # */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <MdOutlineTrackChanges className="h-5 w-5 text-text-soft" />
                                                        <span className="text-sm font-medium text-ink">{order.order_number}</span>
                                                    </div>
                                                </td>

                                                {/* Customer */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-marigold to-marigold-dark flex items-center justify-center flex-shrink-0">
                                                            <span className="text-white font-medium text-sm">
                                                                {order.recipient_name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-ink">{order.recipient_name}</div>
                                                            <div className="text-sm text-text-soft">{order.recipient_phone}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Store */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">
                                                    {order.store_name}
                                                </td>

                                                {/* Total */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-ink">
                                                    <FormatPrice price={order.total} />
                                                </td>

                                                {/* Payment Status Dropdown */}
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
                                                            <Menu.Items className="absolute left-0 z-10 mt-2 w-36 origin-top-left rounded-xl bg-white shadow-hard-sm border border-line focus:outline-none">
                                                                <div className="py-1">
                                                                    {paymentStatusOptions.map(option => (
                                                                        <Menu.Item key={option.value}>
                                                                            {({ active }) => (
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleUpdateStatus(order.id, 'payment_status', option.value)
                                                                                    }
                                                                                    className={`${active ? 'bg-paper-dim' : ''} block w-full px-4 py-2 text-left text-sm text-ink`}
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

                                                {/* Order Status Dropdown */}
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
                                                            <Menu.Items className="absolute left-0 z-10 mt-2 w-36 origin-top-left rounded-xl bg-white shadow-hard-sm border border-line focus:outline-none">
                                                                <div className="py-1">
                                                                    {orderStatusOptions.map(option => (
                                                                        <Menu.Item key={option.value}>
                                                                            {({ active }) => (
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleUpdateStatus(order.id, 'order_status', option.value)
                                                                                    }
                                                                                    className={`${active ? 'bg-paper-dim' : ''} block w-full px-4 py-2 text-left text-sm text-ink`}
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-soft">
                                                    {formatDate(order.created_at)}
                                                </td>

                                                {/* Toggle details */}
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => toggleOrderDetails(order.id)}
                                                        className="inline-flex items-center gap-1 text-marigold hover:text-marigold-dark transition-colors"
                                                    >
                                                        {expandedOrder === order.id ? (
                                                            <><IoChevronUp className="h-4 w-4" />Hide</>
                                                        ) : (
                                                            <><IoChevronDown className="h-4 w-4" />Details</>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Expanded Details Row */}
                                            {expandedOrder === order.id && (
                                                <tr>
                                                    <td colSpan={8} className="px-6 py-6 bg-paper-dim/50">
                                                        <div className="space-y-6">
                                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                                                                {/* Order Information */}
                                                                <div className="bg-white rounded-xl p-4 shadow-hard-sm border border-line">
                                                                    <h4 className="text-sm font-semibold text-ink flex items-center gap-2 mb-3">
                                                                        <FaBox className="h-4 w-4 text-marigold" />
                                                                        Order Information
                                                                    </h4>
                                                                    <dl className="space-y-2 text-sm">
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Tracking #:</dt>
                                                                            <dd className="font-medium text-ink">{order.tracking_number || 'N/A'}</dd>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Shipping Method:</dt>
                                                                            <dd className="text-ink">{order.shipping_method}</dd>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Payment Method:</dt>
                                                                            <dd className="flex items-center gap-1 text-ink">
                                                                                <FaCreditCard className="h-3 w-3" />
                                                                                {order.payment_method}
                                                                            </dd>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Item Quantity:</dt>
                                                                            <dd className="text-ink">{order.item_quantity}</dd>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Total Weight:</dt>
                                                                            <dd className="flex items-center gap-1 text-ink">
                                                                                <FaWeightHanging className="h-3 w-3" />
                                                                                {order.item_weight} kg
                                                                            </dd>
                                                                        </div>
                                                                    </dl>
                                                                </div>

                                                                {/* Recipient Details */}
                                                                <div className="bg-white rounded-xl p-4 shadow-hard-sm border border-line">
                                                                    <h4 className="text-sm font-semibold text-ink flex items-center gap-2 mb-3">
                                                                        <IoPersonOutline className="h-4 w-4 text-marigold" />
                                                                        Recipient Details
                                                                    </h4>
                                                                    <dl className="space-y-2 text-sm">
                                                                        <div>
                                                                            <dt className="text-text-soft">Name</dt>
                                                                            <dd className="font-medium text-ink">{order.recipient_name}</dd>
                                                                        </div>
                                                                        <div>
                                                                            <dt className="text-text-soft flex items-center gap-1">
                                                                                <HiOutlineMail className="h-3 w-3" /> Email
                                                                            </dt>
                                                                            <dd className="text-ink">{order.recipient_email}</dd>
                                                                        </div>
                                                                        <div>
                                                                            <dt className="text-text-soft flex items-center gap-1">
                                                                                <BiPhone className="h-3 w-3" /> Phone
                                                                            </dt>
                                                                            <dd className="text-ink">{order.recipient_phone}</dd>
                                                                        </div>
                                                                        <div>
                                                                            <dt className="text-text-soft flex items-center gap-1">
                                                                                <IoLocationOutline className="h-3 w-3" /> Address
                                                                            </dt>
                                                                            <dd className="text-ink">{order.recipient_address}</dd>
                                                                        </div>
                                                                    </dl>
                                                                </div>

                                                                {/* Order Summary */}
                                                                <div className="bg-white rounded-xl p-4 shadow-hard-sm border border-line">
                                                                    <h4 className="text-sm font-semibold text-ink flex items-center gap-2 mb-3">
                                                                        <IoPricetagOutline className="h-4 w-4 text-marigold" />
                                                                        Order Summary
                                                                    </h4>
                                                                    <dl className="space-y-2 text-sm">
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Subtotal:</dt>
                                                                            <dd className="text-ink"><FormatPrice price={order.subtotal} /></dd>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Delivery Charge:</dt>
                                                                            <dd className="text-ink"><FormatPrice price={order.delivery_charge} /></dd>
                                                                        </div>
                                                                        {order.discount_amount > 0 && (
                                                                            <div className="flex justify-between text-red-600">
                                                                                <dt>Discount:</dt>
                                                                                <dd>-<FormatPrice price={order.discount_amount} /></dd>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex justify-between border-t border-line pt-2 font-semibold">
                                                                            <dt className="text-ink">Total:</dt>
                                                                            <dd className="text-lg font-bold text-marigold">
                                                                                <FormatPrice price={order.total} />
                                                                            </dd>
                                                                        </div>
                                                                    </dl>
                                                                </div>
                                                            </div>

                                                            {/* Order Items */}
                                                            {order.order_items && order.order_items.length > 0 && (
                                                                <div className="bg-white rounded-xl shadow-hard-sm border border-line overflow-hidden">
                                                                    <h4 className="text-sm font-semibold text-ink px-4 py-3 border-b border-line">
                                                                        Order Items
                                                                    </h4>
                                                                    <div className="overflow-x-auto">
                                                                        <table className="min-w-full divide-y divide-line">
                                                                            <thead className="bg-paper-dim">
                                                                                <tr>
                                                                                    {['Product', 'Quantity', 'Price', 'Total'].map(col => (
                                                                                        <th key={col} className="px-4 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide">
                                                                                            {col}
                                                                                        </th>
                                                                                    ))}
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="divide-y divide-line">
                                                                                {order.order_items.map(item => (
                                                                                    <tr key={item.id} className="hover:bg-paper-dim/30">
                                                                                        <td className="px-4 py-3">
                                                                                            <div className="flex items-center gap-3">
                                                                                                {item.product_image && (
                                                                                                    <img
                                                                                                        src={item.product_image}
                                                                                                        alt={item.product_name}
                                                                                                        className="h-10 w-10 object-cover rounded border border-line"
                                                                                                    />
                                                                                                )}
                                                                                                <span className="font-medium text-sm text-ink">{item.product_name}</span>
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="px-4 py-3 text-sm text-ink">{item.quantity}</td>
                                                                                        <td className="px-4 py-3 text-sm text-ink"><FormatPrice price={item.price} /></td>
                                                                                        <td className="px-4 py-3 text-sm font-medium text-ink"><FormatPrice price={item.total} /></td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Notes */}
                                                            {order.notes && (
                                                                <div className="bg-white rounded-xl p-4 shadow-hard-sm border border-line">
                                                                    <h4 className="text-sm font-semibold text-ink mb-2">Notes</h4>
                                                                    <p className="text-sm text-text-soft">{order.notes}</p>
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
                                    <IoCartOutline className="mx-auto h-12 w-12 text-text-soft" />
                                    <h3 className="mt-2 text-sm font-medium text-ink">No orders found</h3>
                                    <p className="mt-1 text-sm text-text-soft">Try adjusting your search or filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminOrders;
