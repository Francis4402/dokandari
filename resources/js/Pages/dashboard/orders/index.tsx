import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import {
    FaShoppingCart, FaEye, FaTrash, FaTruck, FaCheckCircle,
    FaTimesCircle, FaClock, FaUser, FaBox, FaEnvelope,
    FaCreditCard, FaBoxOpen, FaStore, FaImage, FaPhone,
    FaHashtag, FaBan, FaSearch,
} from 'react-icons/fa';
import { Orders, OrderItem } from '@/types';
import { toast } from 'sonner';
import DeleteConfirmationDialog from '@/Pages/buttons/DeleteConfirmationDialog';
import FormatPrice from '@/Pages/utils/FormatePrice';

interface DashboardOrderType {
    auth: { user: any };
    orders: (Orders & { order_items?: OrderItem[] })[];
}

const NON_CANCELLABLE_STATUSES = ['shipped', 'delivered', 'confirmed', 'cancelled'];

const STATUS_CONFIG: Record<string, { badge: string; border: string; dot: string; icon: JSX.Element }> = {
    pending:    { badge: 'bg-yellow-100 text-yellow-800', border: 'border-l-yellow-400',  dot: 'bg-yellow-400',  icon: <FaClock className="h-3 w-3" />       },
    processing: { badge: 'bg-blue-100 text-blue-800',    border: 'border-l-blue-400',    dot: 'bg-blue-400',    icon: <FaBoxOpen className="h-3 w-3" />     },
    confirmed:  { badge: 'bg-indigo-100 text-indigo-800',border: 'border-l-indigo-400',  dot: 'bg-indigo-400',  icon: <FaCheckCircle className="h-3 w-3" /> },
    shipped:    { badge: 'bg-purple-100 text-purple-800', border: 'border-l-purple-400', dot: 'bg-purple-400',  icon: <FaTruck className="h-3 w-3" />       },
    delivered:  { badge: 'bg-green-100 text-green-800',  border: 'border-l-green-400',   dot: 'bg-green-400',   icon: <FaCheckCircle className="h-3 w-3" /> },
    cancelled:  { badge: 'bg-red-100 text-red-800',      border: 'border-l-red-400',     dot: 'bg-red-400',     icon: <FaTimesCircle className="h-3 w-3" /> },
    returned:   { badge: 'bg-gray-100 text-gray-700',    border: 'border-l-gray-400',    dot: 'bg-gray-400',    icon: <FaBoxOpen className="h-3 w-3" />     },
};

const PAYMENT_CONFIG: Record<string, string> = {
    paid:     'bg-green-100 text-green-800',
    pending:  'bg-yellow-100 text-yellow-800',
    failed:   'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800',
};

const getStatus   = (s: string) => STATUS_CONFIG[s]  ?? STATUS_CONFIG['returned'];
const getPayColor = (s: string) => PAYMENT_CONFIG[s] ?? 'bg-gray-100 text-gray-700';

const DashboardOrders = ({ auth, orders }: DashboardOrderType) => {
    const [expandedId,    setExpandedId]    = useState<string | null>(null);
    const [deletingId,    setDeletingId]    = useState<string | null>(null);
    const [cancellingId,  setCancellingId]  = useState<string | null>(null);
    const [isDeleteOpen,  setIsDeleteOpen]  = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
    const [isCancelOpen,  setIsCancelOpen]  = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
    const [search,        setSearch]        = useState('');
    const [statusFilter,  setStatusFilter]  = useState('all');

    const isAdmin   = auth.user.role === 'superadmin' || auth.user.role === 'admin';
    const canCancel = (o: Orders) =>
        !isAdmin && o.user_id === auth.user.id && !NON_CANCELLABLE_STATUSES.includes(o.order_status);

    const stats = {
        total:      orders.length,
        pending:    orders.filter(o => o.order_status === 'pending').length,
        shipped:    orders.filter(o => o.order_status === 'shipped').length,
        delivered:  orders.filter(o => o.order_status === 'delivered').length,
        cancelled:  orders.filter(o => o.order_status === 'cancelled').length,
    };

    const filtered = orders.filter(o => {
        const matchSearch = !search ||
            o.order_number.toLowerCase().includes(search.toLowerCase()) ||
            o.recipient_name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || o.order_status === statusFilter;
        return matchSearch && matchStatus;
    });

    const getImageUrl = (p: string | null | undefined) => {
        if (!p) return '/otherplaceholder.jpg';
        const c = p.replace(/\/+/g, '/');
        if (c.startsWith('http://') || c.startsWith('https://')) return c;
        if (c.includes('/storage/')) return c;
        const b = window.location.origin;
        if (c.startsWith('product_images/')) return `${b}/storage/${c}`;
        if (c.includes('product_images')) return `${b}/storage/product_images/${c.split('/').pop()}`;
        if (!c.includes('/')) return `${b}/storage/product_images/${c}`;
        return `${b}/storage/${c}`;
    };

    const formatDate = (d: string | null) => {
        if (!d) return 'N/A';
        return new Date(d).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' });
    };
    const formatTime = (d: string | null) => {
        if (!d) return '';
        return new Date(d).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' });
    };

    const openDelete  = (id: string, e: React.MouseEvent) => { e.stopPropagation(); setOrderToDelete(id); setIsDeleteOpen(true); };
    const closeDelete = () => { setIsDeleteOpen(false); setOrderToDelete(null); };
    const handleDelete = () => {
        if (!orderToDelete) return;
        setDeletingId(orderToDelete);
        router.delete(`/orders/${orderToDelete}`, {
            preserveScroll: true, preserveState: true,
            onSuccess: () => { toast.success('Order deleted'); if (expandedId === orderToDelete) setExpandedId(null); },
            onError:   (e) => toast.error(typeof e === 'string' ? e : (e as any).message ?? 'Failed to delete'),
            onFinish:  () => { setDeletingId(null); closeDelete(); },
        });
    };

    const openCancel  = (id: string, e: React.MouseEvent) => { e.stopPropagation(); setOrderToCancel(id); setIsCancelOpen(true); };
    const closeCancel = () => { setIsCancelOpen(false); setOrderToCancel(null); };
    const handleCancel = () => {
        if (!orderToCancel) return;
        setCancellingId(orderToCancel);
        router.patch(`/orders/${orderToCancel}/cancel`, {}, {
            preserveScroll: true, preserveState: true,
            onSuccess: () => { toast.success('Order cancelled'); if (expandedId === orderToCancel) setExpandedId(null); },
            onError:   (e) => toast.error(typeof e === 'string' ? e : (e as any).message ?? 'Failed to cancel'),
            onFinish:  () => { setCancellingId(null); closeCancel(); },
        });
    };

    return (
        <DashboardLayout user={auth.user}>
            <Head title="Orders" />

            <div className="min-h-screen bg-gray-50">

                {/* ── Header ──────────────────────────────────────────────── */}
                <div className="bg-white border-b border-gray-200 px-6 py-5">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Orders</h1>
                                <p className="text-sm text-gray-500 mt-0.5">Track and manage your purchases</p>
                            </div>

                            {/* Stat pills */}
                            <div className="flex flex-wrap gap-2 text-xs font-medium">
                                {[
                                    { label: 'All',       val: stats.total,     color: 'bg-gray-100 text-gray-700',     key: 'all'       },
                                    { label: 'Pending',   val: stats.pending,   color: 'bg-yellow-100 text-yellow-800', key: 'pending'   },
                                    { label: 'Shipped',   val: stats.shipped,   color: 'bg-purple-100 text-purple-800', key: 'shipped'   },
                                    { label: 'Delivered', val: stats.delivered, color: 'bg-green-100 text-green-800',   key: 'delivered' },
                                    { label: 'Cancelled', val: stats.cancelled, color: 'bg-red-100 text-red-800',       key: 'cancelled' },
                                ].map(s => (
                                    <button
                                        key={s.key}
                                        onClick={() => setStatusFilter(s.key)}
                                        className={`px-3 py-1.5 rounded-full transition-all ${
                                            statusFilter === s.key
                                                ? `${s.color} ring-2 ring-offset-1 ring-current`
                                                : `${s.color} opacity-60 hover:opacity-100`
                                        }`}
                                    >
                                        {s.label} · {s.val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search + filter */}
                        <div className="mt-4 flex gap-3">
                            <div className="relative flex-1 max-w-sm">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search order # or name…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Statuses</option>
                                {Object.keys(STATUS_CONFIG).map(s => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── Order Cards ──────────────────────────────────────────── */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-3">

                    {filtered.length === 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center">
                            <FaShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No orders found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
                        </div>
                    )}

                    {filtered.map((order) => {
                        const sc          = getStatus(order.order_status);
                        const isOpen      = expandedId === order.id;
                        const isDeleting  = deletingId  === order.id;
                        const isCancelling = cancellingId === order.id;

                        return (
                            <div
                                key={order.id}
                                className={`bg-white rounded-xl border border-gray-200 border-l-4 ${sc.border} shadow-sm hover:shadow-md transition-shadow duration-200`}
                            >
                                {/* Card top row */}
                                <div
                                    className="px-5 py-4 cursor-pointer select-none"
                                    onClick={() => setExpandedId(isOpen ? null : order.id)}
                                >
                                    <div className="flex items-start justify-between gap-4">

                                        {/* Left content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Badges */}
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${sc.badge}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${getPayColor(order.payment_status)}`}>
                                                    <FaCreditCard className="h-2.5 w-2.5" />
                                                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                                </span>
                                                {order.shipping_method && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                                        <FaTruck className="h-2.5 w-2.5" />
                                                        {order.shipping_method === 'pathao' ? 'Pathao' : 'Standard'}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Order # + date */}
                                            <div className="flex flex-wrap items-baseline gap-2">
                                                <span className="font-bold text-gray-900 text-sm tracking-wide">{order.order_number}</span>
                                                <span className="text-xs text-gray-400">{formatDate(order.created_at)} · {formatTime(order.created_at)}</span>
                                            </div>

                                            {/* Meta row */}
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                                                <span className="flex items-center gap-1"><FaUser className="h-2.5 w-2.5" />{order.recipient_name}</span>
                                                <span className="flex items-center gap-1"><FaPhone className="h-2.5 w-2.5" />{order.recipient_phone}</span>
                                                <span className="flex items-center gap-1"><FaStore className="h-2.5 w-2.5" />{order.store_name}</span>
                                                <span className="flex items-center gap-1"><FaBox className="h-2.5 w-2.5" />{order.item_quantity} item{order.item_quantity !== 1 ? 's' : ''}</span>
                                            </div>

                                            {/* Product images strip */}
                                            {order.order_items && order.order_items.length > 0 && (
                                                <div className="flex items-center gap-2 mt-3">
                                                    {order.order_items.slice(0, 6).map(item => (
                                                        <div key={item.id} className="relative flex-shrink-0">
                                                            {item.product_image ? (
                                                                <img
                                                                    src={getImageUrl(item.product_image)}
                                                                    alt={item.product_name}
                                                                    title={item.product_name}
                                                                    className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                                                    onError={e => { (e.target as HTMLImageElement).src = '/otherplaceholder.jpg'; }}
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                                                    <FaImage className="h-4 w-4 text-gray-300" />
                                                                </div>
                                                            )}
                                                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                                                {item.quantity}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {order.order_items.length > 6 && (
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                            <span className="text-xs text-gray-500 font-medium">+{order.order_items.length - 6}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: price + actions */}
                                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-gray-900 leading-none">
                                                    <FormatPrice price={order.total} />
                                                </p>
                                                {order.payment_method === 'cash_on_delivery' && (
                                                    <p className="text-xs text-green-600 mt-1 font-medium">
                                                        COD: <FormatPrice price={order.amount_to_collect} />
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1">
                                                {/* View */}
                                                <button
                                                    onClick={e => { e.stopPropagation(); router.visit(`/orders/${order.id}/confirmation`); }}
                                                    title="View details"
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <FaEye className="h-3.5 w-3.5" />
                                                </button>

                                                {/* Delete — admin only */}
                                                {isAdmin && (
                                                    <button
                                                        onClick={e => openDelete(order.id, e)}
                                                        disabled={isDeleting}
                                                        title="Delete order"
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                                                    >
                                                        {isDeleting
                                                            ? <div className="h-3.5 w-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                            : <FaTrash className="h-3.5 w-3.5" />}
                                                    </button>
                                                )}

                                                {/* Cancel — owner, cancellable */}
                                                {canCancel(order) && (
                                                    <button
                                                        onClick={e => openCancel(order.id, e)}
                                                        disabled={isCancelling}
                                                        title="Cancel order"
                                                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-40"
                                                    >
                                                        {isCancelling
                                                            ? <div className="h-3.5 w-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                                            : <FaBan className="h-3.5 w-3.5" />}
                                                    </button>
                                                )}

                                                {/* Locked — non-cancellable */}
                                                {!isAdmin && order.user_id === auth.user.id &&
                                                    NON_CANCELLABLE_STATUSES.includes(order.order_status) && (
                                                    <span title={`Cannot cancel — order is ${order.order_status}`} className="p-2 text-gray-300 cursor-default">
                                                        <FaBan className="h-3.5 w-3.5" />
                                                    </span>
                                                )}

                                                {/* Expand chevron */}
                                                <button
                                                    onClick={e => { e.stopPropagation(); setExpandedId(isOpen ? null : order.id); }}
                                                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Expanded Detail Panel ─────────────────────── */}
                                {isOpen && (
                                    <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-5 rounded-b-xl">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                            {/* Recipient */}
                                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Recipient</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <FaUser className="h-3 w-3 text-gray-300 flex-shrink-0" />
                                                        <span className="font-semibold text-gray-800">{order.recipient_name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <FaEnvelope className="h-3 w-3 text-gray-300 flex-shrink-0" />
                                                        <span className="truncate">{order.recipient_email || order.sender_email || '—'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <FaPhone className="h-3 w-3 text-gray-300 flex-shrink-0" />
                                                        {order.recipient_phone}
                                                    </div>
                                                    <div className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                                                        <FaHashtag className="h-3 w-3 text-gray-300 flex-shrink-0 mt-0.5" />
                                                        {order.recipient_address}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Shipping */}
                                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Shipping</p>
                                                <div className="space-y-2.5">
                                                    {[
                                                        { label: 'Method',   val: order.shipping_method || '—'   },
                                                        { label: 'Tracking', val: order.tracking_number || 'N/A' },
                                                        { label: 'Payment',  val: order.payment_method           },
                                                        { label: 'Weight',   val: `${order.item_weight} kg`      },
                                                    ].map(row => (
                                                        <div key={row.label} className="flex justify-between text-sm">
                                                            <span className="text-gray-400">{row.label}</span>
                                                            <span className="font-medium text-gray-700 text-xs text-right max-w-[60%] truncate">{row.val}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Summary */}
                                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Summary</p>
                                                <div className="space-y-2.5 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Subtotal</span>
                                                        <span className="text-gray-700"><FormatPrice price={order.subtotal} /></span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Delivery</span>
                                                        <span className="text-gray-700"><FormatPrice price={order.delivery_charge} /></span>
                                                    </div>
                                                    {order.discount_amount > 0 && (
                                                        <div className="flex justify-between text-red-500">
                                                            <span>Discount</span>
                                                            <span>−<FormatPrice price={order.discount_amount} /></span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between pt-2.5 border-t border-gray-100 font-bold">
                                                        <span className="text-gray-700">Total</span>
                                                        <span className="text-blue-600"><FormatPrice price={order.total} /></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items table */}
                                        {order.order_items && order.order_items.length > 0 && (
                                            <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        Order Items
                                                    </p>
                                                    <span className="text-xs text-gray-400">{order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}</span>
                                                </div>
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-t border-gray-100 bg-gray-50">
                                                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product</th>
                                                            <th className="text-center px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Qty</th>
                                                            <th className="text-right px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                                            <th className="text-right px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {order.order_items.map(item => (
                                                            <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-3">
                                                                        {item.product_image ? (
                                                                            <img
                                                                                src={getImageUrl(item.product_image)}
                                                                                alt={item.product_name}
                                                                                className="w-9 h-9 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                                                                                onError={e => { (e.target as HTMLImageElement).src = '/otherplaceholder.jpg'; }}
                                                                            />
                                                                        ) : (
                                                                            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                                                <FaImage className="h-3.5 w-3.5 text-gray-300" />
                                                                            </div>
                                                                        )}
                                                                        <span className="font-medium text-gray-800 truncate">{item.product_name}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-gray-500">{item.quantity}</td>
                                                                <td className="px-4 py-3 text-right text-gray-500"><FormatPrice price={item.price} /></td>
                                                                <td className="px-4 py-3 text-right font-semibold text-gray-800"><FormatPrice price={item.total} /></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <DeleteConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={closeDelete}
                onConfirm={handleDelete}
                title="Delete Order"
                message="Are you sure you want to delete this order? This action cannot be undone. All order items will also be deleted."
                isDeleting={deletingId === orderToDelete}
            />

            <DeleteConfirmationDialog
                isOpen={isCancelOpen}
                onClose={closeCancel}
                onConfirm={handleCancel}
                title="Cancel Order"
                message="Are you sure you want to cancel this order? This action cannot be undone."
                isDeleting={cancellingId === orderToCancel}
            />
        </DashboardLayout>
    );
};

export default DashboardOrders;
