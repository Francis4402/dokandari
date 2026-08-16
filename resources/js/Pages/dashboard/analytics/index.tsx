// Analytics.tsx
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
  FaChartLine,
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaFilter,
  FaDownload,
  FaArrowUp,
  FaArrowDown,
  FaChartBar,
  FaChartPie,
  FaMapMarkerAlt,
  FaProductHunt,
  FaTag,
  FaPercentage,
  FaRegClock,
  FaStar,
  FaExchangeAlt,
  FaShoppingBag,
  FaChevronDown
} from 'react-icons/fa';
import { PageProps } from '@/types';
import FormatPrice from '@/Pages/utils/FormatePrice';
import Eyebrow from '@/Pages/Components/Eyebrow';

interface SalesDataPoint {
  date?: string;
  month?: string;
  sales: number;
  orders: number;
  customers: number;
}

interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

interface CategoryData {
  category: string;
  sales: number;
  percentage: number;
}

interface RegionData {
  region: string;
  revenue: number;
  percentage: number;
}

interface CustomerMetrics {
  acquisitionCost: number;
  lifetimeValue: number;
  retentionRate: number;
  churnRate: number;
}

interface SalesData {
  daily: SalesDataPoint[];
  monthly: SalesDataPoint[];
  topProducts: TopProduct[];
  topCategories: CategoryData[];
  revenueByRegion: RegionData[];
  customerMetrics: CustomerMetrics;
}

const salesData: SalesData = {
  daily: [
    { date: 'Mon', sales: 4500, orders: 45, customers: 38 },
    { date: 'Tue', sales: 5200, orders: 52, customers: 42 },
    { date: 'Wed', sales: 4800, orders: 48, customers: 40 },
    { date: 'Thu', sales: 6100, orders: 61, customers: 52 },
    { date: 'Fri', sales: 7200, orders: 72, customers: 60 },
    { date: 'Sat', sales: 8900, orders: 89, customers: 74 },
    { date: 'Sun', sales: 6800, orders: 68, customers: 58 }
  ],
  monthly: [
    { month: 'Jan', sales: 125000, orders: 1250, customers: 1050 },
    { month: 'Feb', sales: 132000, orders: 1320, customers: 1120 },
    { month: 'Mar', sales: 141000, orders: 1410, customers: 1180 },
    { month: 'Apr', sales: 156000, orders: 1560, customers: 1320 },
    { month: 'May', sales: 145000, orders: 1450, customers: 1220 },
    { month: 'Jun', sales: 162000, orders: 1620, customers: 1380 },
    { month: 'Jul', sales: 178000, orders: 1780, customers: 1520 },
    { month: 'Aug', sales: 165000, orders: 1650, customers: 1420 },
    { month: 'Sep', sales: 182000, orders: 1820, customers: 1580 },
    { month: 'Oct', sales: 195000, orders: 1950, customers: 1680 },
    { month: 'Nov', sales: 210000, orders: 2100, customers: 1820 },
    { month: 'Dec', sales: 245000, orders: 2450, customers: 2120 }
  ],
  topProducts: [
    { id: 1, name: 'Wireless Earbuds Pro', sales: 1250, revenue: 62450, growth: 24 },
    { id: 2, name: 'Smart Watch Series 5', sales: 980, revenue: 78400, growth: 18 },
    { id: 3, name: 'Laptop Backpack', sales: 2150, revenue: 107500, growth: 32 },
    { id: 4, name: 'Phone Case Premium', sales: 3420, revenue: 68400, growth: -5 },
    { id: 5, name: 'Bluetooth Speaker', sales: 890, revenue: 35600, growth: 12 },
    { id: 6, name: 'Gaming Mouse', sales: 1250, revenue: 62500, growth: 28 },
    { id: 7, name: '4K Webcam', sales: 760, revenue: 53200, growth: 15 }
  ],
  topCategories: [
    { category: 'Electronics', sales: 245000, percentage: 35 },
    { category: 'Fashion', sales: 168000, percentage: 24 },
    { category: 'Home & Kitchen', sales: 125000, percentage: 18 },
    { category: 'Books', sales: 89000, percentage: 13 },
    { category: 'Sports', sales: 72000, percentage: 10 }
  ],
  revenueByRegion: [
    { region: 'North America', revenue: 425000, percentage: 42 },
    { region: 'Europe', revenue: 312000, percentage: 31 },
    { region: 'Asia Pacific', revenue: 185000, percentage: 18 },
    { region: 'Latin America', revenue: 78000, percentage: 8 },
    { region: 'Middle East', revenue: 25000, percentage: 2 }
  ],
  customerMetrics: {
    acquisitionCost: 45.50,
    lifetimeValue: 420.75,
    retentionRate: 72.5,
    churnRate: 3.2
  }
};

type TimeRange = 'daily' | 'monthly';
type MetricType = 'sales' | 'orders' | 'customers';

const Analytics = ({ auth }: PageProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('sales');
  const [showMobileMetricSelector, setShowMobileMetricSelector] = useState(false);

  const currentData = salesData[timeRange];
  const totalSales = currentData.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = currentData.reduce((sum, item) => sum + item.orders, 0);
  const totalCustomers = currentData.reduce((sum, item) => sum + item.customers, 0);

  const salesGrowth = 24.5;
  const orderGrowth = 18.2;
  const customerGrowth = 12.8;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  const getMetricColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getMetricIcon = (value: number) => {
    return value >= 0 ? <FaArrowUp className="h-4 w-4" /> : <FaArrowDown className="h-4 w-4" />;
  };

  const getTimeLabel = (item: SalesDataPoint) => {
    return timeRange === 'daily' ? item.date : item.month;
  };

  const getChartValue = (item: SalesDataPoint) => {
    switch (selectedMetric) {
      case 'sales':
        return item.sales;
      case 'orders':
        return item.orders;
      case 'customers':
        return item.customers;
      default:
        return item.sales;
    }
  };

  const formatChartValue = (value: number) => {
    if (selectedMetric === 'sales') {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}k`;
      }
      return `$${value}`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  return (
    <DashboardLayout user={auth.user}>
      <Head title="Sales Analytics Dashboard" />

      <div className="bg-paper-dim">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <Eyebrow>Performance insights</Eyebrow>
              <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Analytics</h1>
              <p className="text-text-soft mt-1">Comprehensive insights into your sales performance</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                  className="pl-10 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink text-sm"
                >
                  <option value="daily">Last 7 Days</option>
                  <option value="monthly">Last 12 Months</option>
                </select>
              </div>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm">
                <FaDownload className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Revenue</p>
                  <p className="text-2xl font-bold text-ink mt-1">
                    <FormatPrice price={totalSales} />
                  </p>
                  <div className={`flex items-center mt-2 ${getMetricColor(salesGrowth)}`}>
                    {getMetricIcon(salesGrowth)}
                    <span className="ml-1 font-medium text-sm">{salesGrowth}%</span>
                    <span className="text-text-soft text-xs ml-2 hidden sm:inline">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center">
                  <FaDollarSign className="h-6 w-6 text-marigold" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Orders</p>
                  <p className="text-2xl font-bold text-ink mt-1">{totalOrders.toLocaleString()}</p>
                  <div className={`flex items-center mt-2 ${getMetricColor(orderGrowth)}`}>
                    {getMetricIcon(orderGrowth)}
                    <span className="ml-1 font-medium text-sm">{orderGrowth}%</span>
                    <span className="text-text-soft text-xs ml-2 hidden sm:inline">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <FaShoppingCart className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Customers</p>
                  <p className="text-2xl font-bold text-ink mt-1">{totalCustomers.toLocaleString()}</p>
                  <div className={`flex items-center mt-2 ${getMetricColor(customerGrowth)}`}>
                    {getMetricIcon(customerGrowth)}
                    <span className="ml-1 font-medium text-sm">{customerGrowth}%</span>
                    <span className="text-text-soft text-xs ml-2 hidden sm:inline">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <FaUsers className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-ink mt-1">
                    <FormatPrice price={avgOrderValue} />
                  </p>
                  <div className={`flex items-center mt-2 ${getMetricColor(8.5)}`}>
                    {getMetricIcon(8.5)}
                    <span className="ml-1 font-medium text-sm">8.5%</span>
                    <span className="text-text-soft text-xs ml-2 hidden sm:inline">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <FaChartLine className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sales Trend Chart */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                  <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Sales Trend</h3>

                  {/* Mobile metric selector */}
                  <div className="relative sm:hidden">
                    <button
                      onClick={() => setShowMobileMetricSelector(!showMobileMetricSelector)}
                      className="flex items-center justify-between w-full px-3 py-2 border border-line rounded-xl bg-white text-sm font-medium text-text-soft"
                    >
                      <span>{selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}</span>
                      <FaChevronDown className={`h-4 w-4 transition-transform ${showMobileMetricSelector ? 'transform rotate-180' : ''}`} />
                    </button>

                    {showMobileMetricSelector && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-line rounded-xl shadow-hard-sm z-10">
                        {(['sales', 'orders', 'customers'] as MetricType[]).map(metric => (
                          <button
                            key={metric}
                            onClick={() => {
                              setSelectedMetric(metric);
                              setShowMobileMetricSelector(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              selectedMetric === metric
                                ? 'bg-marigold/10 text-marigold'
                                : 'text-text-soft hover:bg-paper-dim'
                            }`}
                          >
                            {metric.charAt(0).toUpperCase() + metric.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Desktop metric selector */}
                  <div className="hidden sm:flex space-x-2">
                    {(['sales', 'orders', 'customers'] as MetricType[]).map(metric => (
                      <button
                        key={metric}
                        onClick={() => setSelectedMetric(metric)}
                        className={`px-3 py-1 rounded-xl text-sm font-medium ${
                          selectedMetric === metric
                            ? 'bg-marigold/10 text-marigold'
                            : 'text-text-soft hover:bg-paper-dim'
                        }`}
                      >
                        {metric.charAt(0).toUpperCase() + metric.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-48 sm:h-56 md:h-64 w-full overflow-x-auto">
                  <div className="min-w-min">
                    <div className="flex justify-between mb-2 px-1">
                      <div className="text-sm font-medium text-text-soft">Period</div>
                      <div className="text-sm font-medium text-text-soft">{selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}</div>
                    </div>

                    <div className="flex items-end justify-between h-32 sm:h-40 md:h-48 space-x-1 sm:space-x-2 px-1">
                      {currentData.map((item, index) => {
                        const maxValue = Math.max(...currentData.map(d => getChartValue(d)));
                        const value = getChartValue(item);
                        const height = maxValue > 0 ? (value / maxValue) * 100 : 0;

                        return (
                          <div
                            key={index}
                            className="flex-1 min-w-[40px] sm:min-w-[50px] flex flex-col items-center"
                          >
                            <div
                              className="w-full max-w-[40px] sm:max-w-[50px] bg-gradient-to-t from-marigold to-marigold-dark rounded-t-lg transition-all duration-300 hover:from-marigold-dark hover:to-marigold"
                              style={{ height: `${height}%` }}
                            ></div>
                            <div className="mt-2 text-center w-full">
                              <div className="text-xs text-text-soft font-medium truncate">
                                {getTimeLabel(item)}
                              </div>
                              <div className="text-xs font-bold text-ink truncate">
                                {formatChartValue(value)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-4 border-t border-line">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-text-soft">
                          Total {selectedMetric}: {formatChartValue(
                            selectedMetric === 'sales' ? totalSales :
                            selectedMetric === 'orders' ? totalOrders :
                            totalCustomers
                          )}
                        </div>
                        <div className={`flex items-center ${getMetricColor(
                          selectedMetric === 'sales' ? salesGrowth :
                          selectedMetric === 'orders' ? orderGrowth :
                          customerGrowth
                        )}`}>
                          {getMetricIcon(
                            selectedMetric === 'sales' ? salesGrowth :
                            selectedMetric === 'orders' ? orderGrowth :
                            customerGrowth
                          )}
                          <span className="ml-1 font-medium">
                            {selectedMetric === 'sales' ? salesGrowth :
                             selectedMetric === 'orders' ? orderGrowth :
                             customerGrowth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
              <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-6">Top Products</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {salesData.topProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 hover:bg-paper-dim rounded-xl transition-colors border border-transparent hover:border-line">
                    <div className="flex items-center min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-marigold/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <FaProductHunt className="h-5 w-5 text-marigold" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-ink text-sm truncate">{product.name}</h4>
                        <p className="text-xs text-text-soft">{product.sales.toLocaleString()} units</p>
                      </div>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <p className="font-bold text-ink text-sm">
                        <FormatPrice price={product.revenue} />
                      </p>
                      <div className={`flex items-center justify-end ${getMetricColor(product.growth)}`}>
                        {getMetricIcon(product.growth)}
                        <span className="text-xs ml-1">{Math.abs(product.growth)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue by Category */}
            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
              <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-6">Revenue by Category</h3>
              <div className="space-y-4">
                {salesData.topCategories.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-marigold/10 flex items-center justify-center mr-3 flex-shrink-0">
                          <FaTag className="h-4 w-4 text-marigold" />
                        </div>
                        <span className="font-medium text-ink text-sm truncate">{category.category}</span>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <span className="font-bold text-ink text-sm">
                          <FormatPrice price={category.sales} />
                        </span>
                        <span className="text-text-soft text-xs ml-2">({category.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-paper-dim rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-marigold to-marigold-dark"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue by Region */}
            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
              <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-6">Revenue by Region</h3>
              <div className="space-y-4">
                {salesData.revenueByRegion.map((region, index) => {
                  const colors = [
                    'from-marigold to-marigold-dark',
                    'from-blue-500 to-blue-600',
                    'from-purple-500 to-purple-600',
                    'from-green-500 to-green-600',
                    'from-orange-500 to-orange-600'
                  ];
                  return (
                    <div key={region.region} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-marigold/10 flex items-center justify-center mr-3 flex-shrink-0">
                            <FaMapMarkerAlt className="h-4 w-4 text-marigold" />
                          </div>
                          <span className="font-medium text-ink text-sm truncate">{region.region}</span>
                        </div>
                        <div className="text-right ml-2 flex-shrink-0">
                          <span className="font-bold text-ink text-sm">
                            <FormatPrice price={region.revenue} />
                          </span>
                          <span className="text-text-soft text-xs ml-2">({region.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-paper-dim rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${colors[index]}`}
                          style={{ width: `${region.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Customer Analytics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">CAC</p>
                  <p className="text-2xl font-bold text-ink mt-1">
                    <FormatPrice price={salesData.customerMetrics.acquisitionCost} />
                  </p>
                  <div className={`flex items-center mt-2 ${getMetricColor(-5.2)}`}>
                    {getMetricIcon(-5.2)}
                    <span className="ml-1 font-medium text-sm">5.2%</span>
                    <span className="text-text-soft text-xs ml-2 hidden sm:inline">decrease</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center">
                  <FaPercentage className="h-6 w-6 text-marigold" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">CLV</p>
                  <p className="text-2xl font-bold text-ink mt-1">
                    <FormatPrice price={salesData.customerMetrics.lifetimeValue} />
                  </p>
                  <div className={`flex items-center mt-2 ${getMetricColor(15.5)}`}>
                    {getMetricIcon(15.5)}
                    <span className="ml-1 font-medium text-sm">15.5%</span>
                    <span className="text-text-soft text-xs ml-2 hidden sm:inline">increase</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <FaChartLine className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Retention Rate</p>
                  <p className="text-2xl font-bold text-ink mt-1">{salesData.customerMetrics.retentionRate}%</p>
                  <div className={`flex items-center mt-2 ${getMetricColor(4.8)}`}>
                    {getMetricIcon(4.8)}
                    <span className="ml-1 font-medium text-sm">4.8%</span>
                    <span className="text-text-soft text-xs ml-2 hidden sm:inline">increase</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <FaStar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Churn Rate</p>
                  <p className="text-2xl font-bold text-ink mt-1">{salesData.customerMetrics.churnRate}%</p>
                  <div className={`flex items-center mt-2 ${getMetricColor(-2.1)}`}>
                    {getMetricIcon(-2.1)}
                    <span className="ml-1 font-medium text-sm">2.1%</span>
                    <span className="text-text-soft text-xs ml-2 hidden sm:inline">decrease</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <FaExchangeAlt className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
            <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-6">Performance Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-paper-dim rounded-xl border border-line hover:shadow-hard-sm transition-all duration-300">
                <FaRegClock className="h-8 w-8 text-marigold mx-auto mb-3" />
                <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Avg Order Processing</p>
                <p className="text-xl font-bold text-ink mt-1">2.4 hours</p>
              </div>
              <div className="text-center p-4 bg-paper-dim rounded-xl border border-line hover:shadow-hard-sm transition-all duration-300">
                <FaShoppingBag className="h-8 w-8 text-marigold mx-auto mb-3" />
                <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Conversion Rate</p>
                <p className="text-xl font-bold text-ink mt-1">3.8%</p>
              </div>
              <div className="text-center p-4 bg-paper-dim rounded-xl border border-line hover:shadow-hard-sm transition-all duration-300">
                <FaChartBar className="h-8 w-8 text-marigold mx-auto mb-3" />
                <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Bounce Rate</p>
                <p className="text-xl font-bold text-ink mt-1">42.5%</p>
              </div>
              <div className="text-center p-4 bg-paper-dim rounded-xl border border-line hover:shadow-hard-sm transition-all duration-300">
                <FaChartPie className="h-8 w-8 text-marigold mx-auto mb-3" />
                <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Profit Margin</p>
                <p className="text-xl font-bold text-ink mt-1">28.7%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
