
import DashboardLayout from '@/Layouts/DashboardLayout'
import { Head, Link } from '@inertiajs/react'
import { FiPackage, FiShoppingCart, FiTrendingUp, FiUsers } from 'react-icons/fi'
import { useState } from 'react'
import { Orders } from '@/types'
import FormatPrice from '../utils/FormatePrice'
import { BsFillPeopleFill } from 'react-icons/bs'
import RecentOrders from './recentOrders/RecentOrders'
import { AiFillMessage } from 'react-icons/ai'
import { FaTrophy } from 'react-icons/fa'

interface dashboardhometypes {
    auth: {
        user: any;
    },
    totalUsers: number,
    orders: Orders[],
}

const DashboardHome = ({ auth, totalUsers, orders }: dashboardhometypes) => {
    const userRole = auth?.user?.role;
    const isAdmin = userRole === 'admin' || userRole === 'superadmin';
    const isAgent = userRole === 'agent';
    const isDeliveryMan = userRole === 'deliveryman';
    const isRegularUser = userRole === 'user';

    const [stats, setStats] = useState({
        totalRevenue: 15420.75,
        totalOrders: 342,
        totalCustomers: 128,
        totalProducts: 56,
        conversionRate: 4.2,
        averageOrderValue: 125.85,
    })

    const [topProducts, setTopProducts] = useState([
        {
            id: 1,
            name: 'Premium Wireless Headphones',
            sales: 150,
            revenue: 15000,
        },
        {
            id: 2,
            name: 'Smart Watch Series X',
            sales: 120,
            revenue: 12000,
        },
        {
            id: 3,
            name: 'Gaming Laptop Pro',
            sales: 85,
            revenue: 25500,
        },
        {
            id: 4,
            name: 'Bluetooth Speaker',
            sales: 200,
            revenue: 8000,
        },
        {
            id: 5,
            name: 'USB-C Charging Cable',
            sales: 350,
            revenue: 1750,
        },
    ]);

    const totalRevenue = isAdmin
        ? orders?.reduce((sum, order) => sum + (Number(order?.total) || 0), 0) || 0
        : orders
            ?.filter(order => order.user_id === auth?.user?.id)
            ?.reduce((sum, order) => sum + (Number(order?.total) || 0), 0) || 0;

    return (
        <DashboardLayout user={auth.user}>
            <Head title='Dashboard'>
                <meta name="description" content="Multivendor Store Dashboard" />
                <meta name="keywords" content="dashboard, analytics, ecommerce" />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-marigold to-marigold-dark rounded-2xl shadow-hard-sm p-6 text-white border border-line/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-display font-extrabold uppercase tracking-[-0.01em] mb-2">
                                Welcome back, {auth.user.name}
                            </h1>
                            <p className="opacity-90 text-sm">Here's what's happening with your store today.</p>
                            <div className="mt-4 flex items-center">
                                <FiTrendingUp className="h-5 w-5 mr-2" />
                                <span className="text-sm">Sales are up by 15% compared to last week</span>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                                <FaTrophy className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                                <span className="text-xs font-mono uppercase tracking-wide">Good Job!</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {(isAdmin || isAgent) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Revenue</h3>
                                    <p className="text-2xl font-bold text-ink mt-2"><FormatPrice price={totalRevenue} /></p>
                                    <p className="text-xs text-text-soft mt-1">Total Sales</p>
                                </div>
                                <div className="bg-marigold/10 p-3 rounded-xl">
                                    <FiTrendingUp className="h-6 w-6 text-marigold" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Users</h3>
                                    <p className="text-2xl font-bold text-ink mt-2">{totalUsers}</p>
                                    <p className="text-xs text-text-soft mt-1">Registered Users</p>
                                </div>
                                <div className="bg-marigold/10 p-3 rounded-xl">
                                    <BsFillPeopleFill className="h-6 w-6 text-marigold" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-mono text-text-soft uppercase tracking-wide">Conversion Rate</h3>
                                    <p className="text-2xl font-bold text-ink mt-2">{stats.conversionRate}%</p>
                                    <p className="text-xs text-text-soft mt-1">Visitors to Customers</p>
                                </div>
                                <div className="bg-marigold/10 p-3 rounded-xl">
                                    <AiFillMessage className="h-6 w-6 text-marigold" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Orders</h3>
                                    <p className="text-2xl font-bold text-ink mt-2">{orders.length}</p>
                                    <p className="text-xs text-text-soft mt-1">Orders Placed</p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-xl">
                                    <FiShoppingCart className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts and Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                        <div className="px-6 py-5 border-b border-line flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Recent Orders</h3>
                                <p className="mt-1 text-sm text-text-soft">Latest orders from your store</p>
                            </div>
                            <Link
                                href={route('dashboard.orders')}
                                className="text-xs font-mono uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold hover:text-marigold transition-colors flex items-center"
                            >
                                View all →
                            </Link>
                        </div>

                        <RecentOrders orders={orders} user={auth.user} />
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                        <div className="px-6 py-5 border-b border-line flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Top Selling Products</h3>
                                <p className="mt-1 text-sm text-text-soft">Best performing products this month</p>
                            </div>
                            <Link
                                href={route('products.index')}
                                className="text-xs font-mono uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold hover:text-marigold transition-colors flex items-center"
                            >
                                View all →
                            </Link>
                        </div>
                        <div className="p-4">
                            <ul className="divide-y divide-line">
                                {topProducts.map((product, index) => (
                                    <li key={product.id} className="py-4 hover:bg-paper-dim transition-colors rounded-lg px-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl font-bold text-sm ${
                                                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                                    index === 1 ? 'bg-gray-100 text-gray-800' :
                                                    index === 2 ? 'bg-orange-100 text-orange-800' :
                                                    'bg-marigold/10 text-marigold'
                                                }`}>
                                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                                </div>
                                                <div className="ml-4">
                                                    <Link
                                                        href={`/dashboard/products/${product.id}`}
                                                        className="text-sm font-medium text-ink hover:text-marigold transition-colors"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <p className="text-xs text-text-soft">{product.sales.toLocaleString()} units sold</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-ink">${product.revenue.toLocaleString()}</p>
                                                <p className="text-xs text-text-soft">Revenue</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                    <div className="px-6 py-5 border-b border-line">
                        <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Quick Actions</h3>
                        <p className="mt-1 text-sm text-text-soft">Common tasks you might want to do</p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link
                                href="/dashboard/products/create"
                                className="flex flex-col items-center justify-center p-4 border border-line rounded-xl hover:border-marigold hover:bg-marigold/5 transition-all duration-300 hover:shadow-hard-sm group"
                            >
                                <FiPackage className="h-8 w-8 text-marigold mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-ink">Add Product</span>
                                <span className="text-xs text-text-soft mt-1">Add new items</span>
                            </Link>
                            <Link
                                href="/dashboard/orders/create"
                                className="flex flex-col items-center justify-center p-4 border border-line rounded-xl hover:border-marigold hover:bg-marigold/5 transition-all duration-300 hover:shadow-hard-sm group"
                            >
                                <FiShoppingCart className="h-8 w-8 text-marigold mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-ink">Create Order</span>
                                <span className="text-xs text-text-soft mt-1">Manual order entry</span>
                            </Link>
                            <Link
                                href="/dashboard/customers/create"
                                className="flex flex-col items-center justify-center p-4 border border-line rounded-xl hover:border-marigold hover:bg-marigold/5 transition-all duration-300 hover:shadow-hard-sm group"
                            >
                                <FiUsers className="h-8 w-8 text-marigold mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-ink">Add Customer</span>
                                <span className="text-xs text-text-soft mt-1">New customer profile</span>
                            </Link>
                            <Link
                                href="/dashboard/analytics"
                                className="flex flex-col items-center justify-center p-4 border border-line rounded-xl hover:border-marigold hover:bg-marigold/5 transition-all duration-300 hover:shadow-hard-sm group"
                            >
                                <FiTrendingUp className="h-8 w-8 text-marigold mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-ink">View Reports</span>
                                <span className="text-xs text-text-soft mt-1">Detailed analytics</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Performance Summary */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                    <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-4">Performance Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <FiTrendingUp className="h-5 w-5 text-green-600 mr-2" />
                                <span className="font-medium text-green-800">Best Day</span>
                            </div>
                            <p className="text-2xl font-bold text-ink mt-2">$3,450</p>
                            <p className="text-xs text-text-soft">Monday, Jan 8</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <FiUsers className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="font-medium text-blue-800">New Customers</span>
                            </div>
                            <p className="text-2xl font-bold text-ink mt-2">24</p>
                            <p className="text-xs text-text-soft">This week</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <FiShoppingCart className="h-5 w-5 text-purple-600 mr-2" />
                                <span className="font-medium text-purple-800">Order Fulfillment</span>
                            </div>
                            <p className="text-2xl font-bold text-ink mt-2">98.5%</p>
                            <p className="text-xs text-text-soft">On-time delivery rate</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default DashboardHome
