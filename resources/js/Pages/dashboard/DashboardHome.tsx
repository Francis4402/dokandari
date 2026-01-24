import DashboardLayout from '@/Layouts/DashboardLayout'
import { Head, Link } from '@inertiajs/react'
import { FiDollarSign, FiPackage, FiShoppingCart, FiTrendingUp, FiUsers } from 'react-icons/fi'
import { useState, useEffect } from 'react'

// Remove the props interface since we're using fake data
const DashboardHome = () => {
  // Fake data for stats
  const [stats, setStats] = useState({
    totalRevenue: 15420.75,
    totalOrders: 342,
    totalCustomers: 128,
    totalProducts: 56,
    conversionRate: 4.2,
    averageOrderValue: 125.85,
  })

  // Fake data for recent orders
  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'ORD-001',
      customer_name: 'John Doe',
      total: 199.99,
      status: 'delivered',
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 'ORD-002',
      customer_name: 'Jane Smith',
      total: 299.50,
      status: 'processing',
      created_at: '2024-01-15T09:15:00Z',
    },
    {
      id: 'ORD-003',
      customer_name: 'Robert Johnson',
      total: 89.99,
      status: 'pending',
      created_at: '2024-01-14T16:45:00Z',
    },
    {
      id: 'ORD-004',
      customer_name: 'Emily Wilson',
      total: 450.25,
      status: 'delivered',
      created_at: '2024-01-14T14:20:00Z',
    },
    {
      id: 'ORD-005',
      customer_name: 'Michael Brown',
      total: 125.00,
      status: 'cancelled',
      created_at: '2024-01-13T11:10:00Z',
    },
  ])

  // Fake data for top products
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
  ])

  const statCards = [
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: FiDollarSign,
      color: 'bg-green-500',
      href: '/dashboard/analytics'
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: '+8.2%',
      icon: FiShoppingCart,
      color: 'bg-blue-500',
      href: '/dashboard/orders'
    },
    {
      name: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      change: '+5.7%',
      icon: FiUsers,
      color: 'bg-purple-500',
      href: '/dashboard/customers'
    },
    {
      name: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      change: '+3.4%',
      icon: FiPackage,
      color: 'bg-orange-500',
      href: '/dashboard/products'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Optional: Simulate loading data (if needed for future API calls)
  useEffect(() => {
    // In the future, you can replace this with actual API calls
    // fetch('/api/dashboard/stats').then(res => res.json()).then(data => setStats(data))
  }, [])

  return (
    <DashboardLayout>
        <Head title='Dashboard'>
            <meta name="description" content="Multivendor Store Dashboard" />
            <meta name="keywords" content="dashboard, analytics, ecommerce" />
            <meta name="robots" content="noindex, nofollow" />
        </Head>

         <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="opacity-90">Here's what's happening with your store today.</p>
            <div className="mt-4 flex items-center">
              <FiTrendingUp className="h-5 w-5 mr-2" />
              <span className="text-sm">Sales are up by 15% compared to last week</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.name}
                  href={stat.href}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 hover:-translate-y-1 transform"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className={`${stat.color} p-3 rounded-md`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                          <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <span className="font-medium text-green-600">{stat.change}</span> from last month
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Additional Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Conversion Rate</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{stats.conversionRate}%</p>
                  <p className="text-sm text-gray-500 mt-1">Website visitors to customers</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FiTrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Average Order Value</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">${stats.averageOrderValue.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mt-1">Per customer transaction</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FiDollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Orders</h3>
                  <p className="mt-1 text-sm text-gray-500">Latest orders from your store</p>
                </div>
                <Link
                  href="/dashboard/orders"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                >
                  View all <span className="ml-1">→</span>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
                            {order.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customer_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Top Selling Products</h3>
                  <p className="mt-1 text-sm text-gray-500">Best performing products this month</p>
                </div>
                <Link
                  href="/dashboard/products"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                >
                  View all <span className="ml-1">→</span>
                </Link>
              </div>
              <div className="p-6">
                <ul className="divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <li key={product.id} className="py-4 hover:bg-gray-50 transition-colors rounded-lg px-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            <span className="font-bold">#{index + 1}</span>
                          </div>
                          <div className="ml-4">
                            <Link
                              href={`/dashboard/products/${product.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600"
                            >
                              {product.name}
                            </Link>
                            <p className="text-sm text-gray-500">{product.sales.toLocaleString()} units sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">${product.revenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Revenue</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
              <p className="mt-1 text-sm text-gray-500">Common tasks you might want to do</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/dashboard/products/create"
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors hover:shadow-md"
                >
                  <FiPackage className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Add Product</span>
                  <span className="text-xs text-gray-500 mt-1">Add new items</span>
                </Link>
                <Link
                  href="/dashboard/orders/create"
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors hover:shadow-md"
                >
                  <FiShoppingCart className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Create Order</span>
                  <span className="text-xs text-gray-500 mt-1">Manual order entry</span>
                </Link>
                <Link
                  href="/dashboard/customers/create"
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors hover:shadow-md"
                >
                  <FiUsers className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Add Customer</span>
                  <span className="text-xs text-gray-500 mt-1">New customer profile</span>
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors hover:shadow-md"
                >
                  <FiTrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">View Reports</span>
                  <span className="text-xs text-gray-500 mt-1">Detailed analytics</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <FiTrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Best Day</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-2">$3,450</p>
                <p className="text-sm text-gray-600">Monday, Jan 8</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <FiUsers className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">New Customers</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-2">24</p>
                <p className="text-sm text-gray-600">This week</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <FiShoppingCart className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="font-medium text-purple-800">Order Fulfillment</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-2">98.5%</p>
                <p className="text-sm text-gray-600">On-time delivery rate</p>
              </div>
            </div>
          </div>
        </div>
    </DashboardLayout>
  )
}

export default DashboardHome
