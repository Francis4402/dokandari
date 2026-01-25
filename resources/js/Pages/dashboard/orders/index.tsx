import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
  FaShoppingCart,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaDollarSign,
  FaUser,
  FaBox,
  FaArrowRight,
  FaDownload,
  FaPrint,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaBoxOpen,
  FaChartLine,
  FaCalendar,
  FaStore,
  FaTimes
} from 'react-icons/fa';
import { PageProps } from '@/types';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  store_id: string;
  store_name: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  payment_method: string;
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  shipping_method: string;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  estimated_delivery: string;
}

const Orders = ({auth}: PageProps) => {
  // Dummy orders data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      order_number: 'ORD-001234',
      customer_id: 'CUST-001',
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      customer_phone: '+1 (555) 123-4567',
      customer_address: '123 Main St, New York, NY 10001',
      store_id: 'STORE-001',
      store_name: 'Tech Gadgets Hub',
      items: [
        { id: '1', product_id: 'PROD-001', product_name: 'Wireless Headphones', quantity: 1, price: 199.99, total: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
        { id: '2', product_id: 'PROD-002', product_name: 'Phone Case', quantity: 2, price: 24.99, total: 49.98, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&h=100&fit=crop' }
      ],
      subtotal: 249.97,
      shipping: 9.99,
      tax: 20.00,
      total: 279.96,
      payment_method: 'credit_card',
      payment_status: 'paid',
      order_status: 'delivered',
      shipping_method: 'Express',
      tracking_number: 'TRK123456789',
      notes: 'Leave at front door',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-16T14:20:00Z',
      estimated_delivery: '2024-01-18'
    },
    {
      id: '2',
      order_number: 'ORD-001235',
      customer_id: 'CUST-002',
      customer_name: 'Jane Smith',
      customer_email: 'jane@example.com',
      customer_phone: '+1 (555) 987-6543',
      customer_address: '456 Oak Ave, Los Angeles, CA 90001',
      store_id: 'STORE-002',
      store_name: 'Fashion Boutique',
      items: [
        { id: '3', product_id: 'PROD-003', product_name: 'Summer Dress', quantity: 1, price: 89.99, total: 89.99, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop' }
      ],
      subtotal: 89.99,
      shipping: 5.99,
      tax: 7.20,
      total: 103.18,
      payment_method: 'paypal',
      payment_status: 'paid',
      order_status: 'processing',
      shipping_method: 'Standard',
      tracking_number: null,
      notes: 'Gift wrapping requested',
      created_at: '2024-01-15T09:15:00Z',
      updated_at: '2024-01-15T09:15:00Z',
      estimated_delivery: '2024-01-22'
    },
    {
      id: '3',
      order_number: 'ORD-001236',
      customer_id: 'CUST-003',
      customer_name: 'Robert Johnson',
      customer_email: 'robert@example.com',
      customer_phone: '+1 (555) 456-7890',
      customer_address: '789 Pine Rd, Chicago, IL 60601',
      store_id: 'STORE-003',
      store_name: 'Home Essentials',
      items: [
        { id: '4', product_id: 'PROD-004', product_name: 'Throw Pillow', quantity: 2, price: 29.99, total: 59.98, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop' },
        { id: '5', product_id: 'PROD-005', product_name: 'Coffee Table', quantity: 1, price: 199.99, total: 199.99, image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=100&h=100&fit=crop' }
      ],
      subtotal: 259.97,
      shipping: 19.99,
      tax: 22.40,
      total: 302.36,
      payment_method: 'credit_card',
      payment_status: 'pending',
      order_status: 'pending',
      shipping_method: 'Express',
      tracking_number: null,
      notes: 'Contact before delivery',
      created_at: '2024-01-14T16:45:00Z',
      updated_at: '2024-01-14T16:45:00Z',
      estimated_delivery: '2024-01-19'
    },
    {
      id: '4',
      order_number: 'ORD-001237',
      customer_id: 'CUST-004',
      customer_name: 'Emily Wilson',
      customer_email: 'emily@example.com',
      customer_phone: '+1 (555) 234-5678',
      customer_address: '101 Maple St, Miami, FL 33101',
      store_id: 'STORE-004',
      store_name: 'Sports Gear Pro',
      items: [
        { id: '6', product_id: 'PROD-006', product_name: 'Running Shoes', quantity: 1, price: 119.99, total: 119.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop' }
      ],
      subtotal: 119.99,
      shipping: 7.99,
      tax: 9.60,
      total: 137.58,
      payment_method: 'apple_pay',
      payment_status: 'paid',
      order_status: 'shipped',
      shipping_method: 'Standard',
      tracking_number: 'TRK987654321',
      notes: null,
      created_at: '2024-01-14T14:20:00Z',
      updated_at: '2024-01-15T11:30:00Z',
      estimated_delivery: '2024-01-21'
    },
    {
      id: '5',
      order_number: 'ORD-001238',
      customer_id: 'CUST-005',
      customer_name: 'Michael Brown',
      customer_email: 'michael@example.com',
      customer_phone: '+1 (555) 876-5432',
      customer_address: '202 Elm St, Dallas, TX 75201',
      store_id: 'STORE-005',
      store_name: 'Beauty Corner',
      items: [
        { id: '7', product_id: 'PROD-007', product_name: 'Face Cream', quantity: 3, price: 34.99, total: 104.97, image: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=100&h=100&fit=crop' },
        { id: '8', product_id: 'PROD-008', product_name: 'Lipstick Set', quantity: 1, price: 49.99, total: 49.99, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100&h=100&fit=crop' }
      ],
      subtotal: 154.96,
      shipping: 8.99,
      tax: 12.40,
      total: 176.35,
      payment_method: 'credit_card',
      payment_status: 'failed',
      order_status: 'cancelled',
      shipping_method: 'Standard',
      tracking_number: null,
      notes: 'Payment declined',
      created_at: '2024-01-13T11:10:00Z',
      updated_at: '2024-01-13T11:30:00Z',
      estimated_delivery: '2024-01-20'
    },
    {
      id: '6',
      order_number: 'ORD-001239',
      customer_id: 'CUST-006',
      customer_name: 'Sarah Davis',
      customer_email: 'sarah@example.com',
      customer_phone: '+1 (555) 345-6789',
      customer_address: '303 Birch Ln, Seattle, WA 98101',
      store_id: 'STORE-006',
      store_name: 'Book Haven',
      items: [
        { id: '9', product_id: 'PROD-009', product_name: 'Novel Collection', quantity: 2, price: 19.99, total: 39.98, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop' }
      ],
      subtotal: 39.98,
      shipping: 4.99,
      tax: 3.60,
      total: 48.57,
      payment_method: 'paypal',
      payment_status: 'refunded',
      order_status: 'returned',
      shipping_method: 'Standard',
      tracking_number: null,
      notes: 'Customer requested return',
      created_at: '2024-01-13T09:45:00Z',
      updated_at: '2024-01-14T15:20:00Z',
      estimated_delivery: '2024-01-18'
    },
    {
      id: '7',
      order_number: 'ORD-001240',
      customer_id: 'CUST-007',
      customer_name: 'David Miller',
      customer_email: 'david@example.com',
      customer_phone: '+1 (555) 567-8901',
      customer_address: '404 Cedar Dr, Denver, CO 80201',
      store_id: 'STORE-007',
      store_name: 'Food Market',
      items: [
        { id: '10', product_id: 'PROD-010', product_name: 'Organic Coffee', quantity: 2, price: 24.99, total: 49.98, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop' },
        { id: '11', product_id: 'PROD-011', product_name: 'Tea Collection', quantity: 1, price: 19.99, total: 19.99, image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=100&h=100&fit=crop' }
      ],
      subtotal: 69.97,
      shipping: 6.99,
      tax: 5.60,
      total: 82.56,
      payment_method: 'credit_card',
      payment_status: 'paid',
      order_status: 'delivered',
      shipping_method: 'Express',
      tracking_number: 'TRK456789123',
      notes: 'Deliver to reception',
      created_at: '2024-01-12T13:30:00Z',
      updated_at: '2024-01-13T16:45:00Z',
      estimated_delivery: '2024-01-15'
    },
    {
      id: '8',
      order_number: 'ORD-001241',
      customer_id: 'CUST-008',
      customer_name: 'Lisa Taylor',
      customer_email: 'lisa@example.com',
      customer_phone: '+1 (555) 678-9012',
      customer_address: '505 Redwood Way, Phoenix, AZ 85001',
      store_id: 'STORE-008',
      store_name: 'Toy World',
      items: [
        { id: '12', product_id: 'PROD-012', product_name: 'Educational Toy Set', quantity: 1, price: 89.99, total: 89.99, image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=100&h=100&fit=crop' }
      ],
      subtotal: 89.99,
      shipping: 8.99,
      tax: 7.20,
      total: 106.18,
      payment_method: 'google_pay',
      payment_status: 'paid',
      order_status: 'processing',
      shipping_method: 'Standard',
      tracking_number: null,
      notes: 'Birthday gift - add card',
      created_at: '2024-01-12T10:15:00Z',
      updated_at: '2024-01-12T10:15:00Z',
      estimated_delivery: '2024-01-19'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dateRange, setDateRange] = useState('all');

  // Calculate statistics
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter(order => order.order_status === 'pending').length,
    deliveredOrders: orders.filter(order => order.order_status === 'delivered').length,
    averageOrderValue: orders.reduce((sum, order) => sum + order.total, 0) / orders.length,
    recentOrders: orders.slice(0, 5),
    topStores: Array.from(new Set(orders.map(order => order.store_name))).slice(0, 3)
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch =
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.store_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;

      // Date filtering
      const orderDate = new Date(order.created_at);
      const now = new Date();
      const matchesDate =
        dateRange === 'all' ? true :
        dateRange === 'today' ? orderDate.toDateString() === now.toDateString() :
        dateRange === 'week' ? orderDate >= new Date(now.setDate(now.getDate() - 7)) :
        dateRange === 'month' ? orderDate >= new Date(now.setMonth(now.getMonth() - 1)) :
        dateRange === 'year' ? orderDate >= new Date(now.setFullYear(now.getFullYear() - 1)) : true;

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'total-high':
          return b.total - a.total;
        case 'total-low':
          return a.total - b.total;
        case 'customer-asc':
          return a.customer_name.localeCompare(b.customer_name);
        case 'customer-desc':
          return b.customer_name.localeCompare(a.customer_name);
        case 'store-asc':
          return a.store_name.localeCompare(b.store_name);
        case 'store-desc':
          return b.store_name.localeCompare(a.store_name);
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

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
      'returned': <FaArrowRight className="h-4 w-4" />
    };
    return icons[status] || <FaShoppingCart className="h-4 w-4" />;
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['order_status']) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, order_status: newStatus, updated_at: new Date().toISOString() }
        : order
    ));
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      setOrders(orders.filter(order => order.id !== orderId));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  const exportOrders = () => {
    // In a real app, this would generate a CSV or PDF
    alert('Exporting orders...');
  };

  const printOrder = (order: Order) => {
    // In a real app, this would open print dialog
    alert(`Printing order ${order.order_number}...`);
  };

  return (
    <DashboardLayout user={auth.user}>
      <Head title="Orders Management" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
                <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={exportOrders}
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <FaDownload className="h-4 w-4 mr-2" />
                  Export
                </button>

              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FaDollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pendingOrders}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <FaClock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    ${stats.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <FaChartLine className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
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

              {/* Payment Filter */}
              <div className="relative">
                <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending Payment</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="relative">
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sort */}
              <div className="relative">
                <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="total-high">Total: High to Low</option>
                  <option value="total-low">Total: Low to High</option>
                  <option value="customer-asc">Customer A-Z</option>
                  <option value="customer-desc">Customer Z-A</option>
                  <option value="store-asc">Store A-Z</option>
                  <option value="store-desc">Store Z-A</option>
                </select>
              </div>

              {/* Quick Status Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${statusFilter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Pending ({orders.filter(o => o.order_status === 'pending').length})
                </button>
                <button
                  onClick={() => setStatusFilter('processing')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${statusFilter === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Processing ({orders.filter(o => o.order_status === 'processing').length})
                </button>
                <button
                  onClick={() => setStatusFilter('delivered')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${statusFilter === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Delivered ({orders.filter(o => o.order_status === 'delivered').length})
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredOrders.length}</span> of <span className="font-semibold">{stats.totalOrders}</span> orders
              </p>
              {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' || dateRange !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPaymentFilter('all');
                    setDateRange('all');
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">All Orders</h2>
                  <div className="text-sm text-gray-600">
                    {filteredOrders.length} orders
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <FaShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm ? `No results for "${searchTerm}"` : 'No orders available'}
                    </p>
                    <Link
                      href="/dashboard/orders/create"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      <FaPlus className="h-4 w-4 mr-2" />
                      Create Your First Order
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map(order => (
                      <div
                        key={order.id}
                        className={`border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer ${
                          selectedOrder?.id === order.id ? 'ring-2 ring-purple-500 bg-purple-50' : ''
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
                                    printOrder(order);
                                  }}
                                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Print order"
                                >
                                  <FaPrint className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle edit
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
                                  <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                                </div>
                              </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="mt-4">
                              <div className="flex items-center space-x-2">
                                {order.items.slice(0, 3).map(item => (
                                  <div key={item.id} className="flex items-center">
                                    <img
                                      src={item.image}
                                      alt={item.product_name}
                                      className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                                    />
                                  </div>
                                ))}
                                {order.items.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{order.items.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Order Total & Actions */}
                          <div className="flex flex-col items-end">
                            <div className="text-right mb-3">
                              <p className="text-2xl font-bold text-gray-800">${order.total.toFixed(2)}</p>
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
                                View
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle status update
                                }}
                                className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                              >
                                Update
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
                <div className="bg-white rounded-xl shadow-lg p-6">
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

                    {/* Status Update */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Order Status
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'].map(status => (
                          <button
                            key={status}
                            onClick={() => handleUpdateStatus(selectedOrder.id, status as Order['order_status'])}
                            className={`px-3 py-2 rounded-lg text-xs font-medium capitalize ${
                              selectedOrder.order_status === status
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
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
                        <FaPhone className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-gray-700">{selectedOrder.customer_phone}</span>
                      </div>
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mr-3 mt-1" />
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

                  {/* Shipping & Payment */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Shipping</h5>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{selectedOrder.shipping_method}</p>
                        {selectedOrder.tracking_number && (
                          <p className="text-gray-600">Tracking: {selectedOrder.tracking_number}</p>
                        )}
                        <p className="text-gray-600">Est. Delivery: {selectedOrder.estimated_delivery}</p>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Payment</h5>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800 capitalize">
                          {selectedOrder.payment_method.replace('_', ' ')}
                        </p>
                        <p className="text-gray-600">Status: <span className="capitalize">{selectedOrder.payment_status}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Order Items ({selectedOrder.items.length})</h5>
                    <div className="space-y-3">
                      {selectedOrder.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <img
                              src={item.image}
                              alt={item.product_name}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{item.product_name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-800">${item.total.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
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
                        <span className="font-medium">${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">${selectedOrder.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                        <span>Total</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => printOrder(selectedOrder)}
                        className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        <FaPrint className="h-4 w-4 mr-2" />
                        Print
                      </button>
                      <button
                        onClick={() => {
                          // Handle invoice generation
                          alert(`Generating invoice for ${selectedOrder.order_number}...`);
                        }}
                        className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                      >
                        <FaDownload className="h-4 w-4 mr-2" />
                        Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Order Details</h3>
                  <p className="text-sm opacity-90 mb-6">
                    Select an order from the list to view detailed information, update status, and manage order processing.
                  </p>
                  <div className="text-center">
                    <FaShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-75">No order selected</p>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Order Status Overview</h3>
                <div className="space-y-3">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'].map(status => {
                    const count = orders.filter(order => order.order_status === status).length;
                    const percentage = (count / stats.totalOrders) * 100;
                    return (
                      <div key={status} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mr-2 ${getStatusColor(status)}`}>
                              {getStatusIcon(status)}
                              <span className="ml-1 capitalize">{status}</span>
                            </span>
                            <span className="text-gray-600">{count} orders</span>
                          </div>
                          <span className="font-medium text-gray-800">{Math.round(percentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getStatusColor(status).split(' ')[0]}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {stats.recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">{order.order_number}</h4>
                        <p className="text-xs text-gray-500">
                          {order.customer_name} • ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-purple-600 hover:text-purple-700 text-xs font-medium"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Need advanced order management?</h3>
                <p className="opacity-90">Upgrade to our premium plan for bulk operations and advanced analytics</p>
              </div>
              <Link
                href="/dashboard/upgrade"
                className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-purple-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Upgrade Now
                <FaArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
