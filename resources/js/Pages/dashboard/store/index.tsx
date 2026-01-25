import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
  FaStore,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaChartLine,
  FaDollarSign,
  FaUsers,
  FaShoppingCart,
  FaStar,
  FaIdCard,
  FaArrowRight,
  FaTimes,
  FaExclamationCircle,
  FaBox,
  FaTags,
  FaCalendarAlt,
  FaEye,
  FaBuilding,
} from 'react-icons/fa';

// Define interfaces
interface User {
  name: string;
  email: string;
}

interface StoreStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
}

interface Store {
  id: number;
  user_id: number;
  name: string;
  logo: string | null;
  storetype: string;
  license: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  stats?: StoreStats;
}

// Fake data
const fakeStores: Store[] = [
  {
    id: 1,
    user_id: 101,
    name: 'Tech Gadgets Hub',
    logo: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
    storetype: 'Electronics',
    license: 'BUS-001234',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    user: { name: 'John Doe', email: 'john@example.com' },
    stats: { totalProducts: 45, totalOrders: 120, totalRevenue: 12500, averageRating: 4.5 }
  },
  {
    id: 2,
    user_id: 102,
    name: 'Fashion Boutique',
    logo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
    storetype: 'Fashion',
    license: 'BUS-001235',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:20:00Z',
    user: { name: 'Jane Smith', email: 'jane@example.com' },
    stats: { totalProducts: 32, totalOrders: 85, totalRevenue: 8900, averageRating: 4.3 }
  },
  {
    id: 3,
    user_id: 103,
    name: 'Home Essentials',
    logo: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
    storetype: 'Home & Living',
    license: 'BUS-001236',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    user: { name: 'Robert Johnson', email: 'robert@example.com' },
    stats: { totalProducts: 28, totalOrders: 65, totalRevenue: 7200, averageRating: 4.7 }
  },
  {
    id: 4,
    user_id: 104,
    name: 'Sports Gear Pro',
    logo: 'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=400&h=400&fit=crop',
    storetype: 'Sports',
    license: 'BUS-001237',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z',
    user: { name: 'Emily Wilson', email: 'emily@example.com' },
    stats: { totalProducts: 21, totalOrders: 45, totalRevenue: 5600, averageRating: 4.4 }
  },
  {
    id: 5,
    user_id: 105,
    name: 'Beauty Corner',
    logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
    storetype: 'Beauty',
    license: 'BUS-001238',
    created_at: '2024-01-11T11:20:00Z',
    updated_at: '2024-01-11T11:20:00Z',
    user: { name: 'Michael Brown', email: 'michael@example.com' },
    stats: { totalProducts: 18, totalOrders: 32, totalRevenue: 4300, averageRating: 4.6 }
  },
  {
    id: 6,
    user_id: 106,
    name: 'Book Haven',
    logo: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    storetype: 'Books',
    license: 'BUS-001239',
    created_at: '2024-01-10T13:30:00Z',
    updated_at: '2024-01-10T13:30:00Z',
    user: { name: 'Sarah Davis', email: 'sarah@example.com' },
    stats: { totalProducts: 15, totalOrders: 28, totalRevenue: 3100, averageRating: 4.8 }
  },
  {
    id: 7,
    user_id: 107,
    name: 'Food Market',
    logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    storetype: 'Food & Beverage',
    license: 'BUS-001240',
    created_at: '2024-01-09T08:45:00Z',
    updated_at: '2024-01-09T08:45:00Z',
    user: { name: 'David Miller', email: 'david@example.com' },
    stats: { totalProducts: 12, totalOrders: 25, totalRevenue: 2800, averageRating: 4.2 }
  },
  {
    id: 8,
    user_id: 108,
    name: 'Toy World',
    logo: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop',
    storetype: 'Toys',
    license: 'BUS-001241',
    created_at: '2024-01-08T10:15:00Z',
    updated_at: '2024-01-08T10:15:00Z',
    user: { name: 'Lisa Taylor', email: 'lisa@example.com' },
    stats: { totalProducts: 9, totalOrders: 18, totalRevenue: 1900, averageRating: 4.1 }
  }
];

const Store = () => {
  const [stores, setStores] = useState<Store[]>(fakeStores);
  const [searchTerm, setSearchTerm] = useState('');
  const [storeTypeFilter, setStoreTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Calculate statistics
  const stats = {
    totalStores: stores.length,
    totalProducts: stores.reduce((sum, store) => sum + (store.stats?.totalProducts || 0), 0),
    totalOrders: stores.reduce((sum, store) => sum + (store.stats?.totalOrders || 0), 0),
    totalRevenue: stores.reduce((sum, store) => sum + (store.stats?.totalRevenue || 0), 0),
    averageRating: stores.length > 0
      ? stores.reduce((sum, store) => sum + (store.stats?.averageRating || 0), 0) / stores.length
      : 0,
    storeTypes: Array.from(new Set(stores.map(store => store.storetype)))
  };

  // Filter and sort stores
  const filteredStores = stores
    .filter(store => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.storetype.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.license?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.user?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = storeTypeFilter === 'all' || store.storetype === storeTypeFilter;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'products-high':
          return (b.stats?.totalProducts || 0) - (a.stats?.totalProducts || 0);
        case 'products-low':
          return (a.stats?.totalProducts || 0) - (b.stats?.totalProducts || 0);
        case 'revenue-high':
          return (b.stats?.totalRevenue || 0) - (a.stats?.totalRevenue || 0);
        case 'revenue-low':
          return (a.stats?.totalRevenue || 0) - (b.stats?.totalRevenue || 0);
        case 'rating-high':
          return (b.stats?.averageRating || 0) - (a.stats?.averageRating || 0);
        case 'rating-low':
          return (a.stats?.averageRating || 0) - (b.stats?.averageRating || 0);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const getStoreTypeColor = (storetype: string) => {
    const colors: Record<string, string> = {
      'Electronics': 'bg-blue-100 text-blue-800 border-blue-200',
      'Fashion': 'bg-purple-100 text-purple-800 border-purple-200',
      'Home & Living': 'bg-green-100 text-green-800 border-green-200',
      'Sports': 'bg-orange-100 text-orange-800 border-orange-200',
      'Beauty': 'bg-pink-100 text-pink-800 border-pink-200',
      'Books': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Food & Beverage': 'bg-amber-100 text-amber-800 border-amber-200',
      'Toys': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return colors[storetype] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStoreTypeGradient = (storetype: string) => {
    const gradients: Record<string, string> = {
      'Electronics': 'from-blue-500 to-cyan-500',
      'Fashion': 'from-purple-500 to-pink-500',
      'Home & Living': 'from-green-500 to-emerald-500',
      'Sports': 'from-orange-500 to-red-500',
      'Beauty': 'from-pink-500 to-rose-500',
      'Books': 'from-indigo-500 to-violet-500',
      'Food & Beverage': 'from-amber-500 to-yellow-500',
      'Toys': 'from-teal-500 to-cyan-500'
    };
    return gradients[storetype] || 'from-gray-500 to-slate-500';
  };

  const handleDelete = (id: number) => {
    setStoreToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (storeToDelete) {
      // Simulate API call with fake data
      setStores(prevStores => prevStores.filter(store => store.id !== storeToDelete));
      if (selectedStore?.id === storeToDelete) {
        setSelectedStore(null);
      }
      setShowDeleteModal(false);
      setStoreToDelete(null);

      // Show success message
      alert('Store deleted successfully!');
    }
  };


  const handleEditStore = (id: number) => {
    router.visit(`/dashboard/stores/${id}/edit`);
  };

  const handleViewProducts = (id: number) => {
    router.visit(`/dashboard/stores/${id}/products`);
  };

  const handleViewAnalytics = (id: number) => {
    router.visit(`/dashboard/stores/${id}/analytics`);
  };


  return (
    <DashboardLayout>
      <Head title="Store Management" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <FaStore className="h-8 w-8 text-purple-600" />
                  Store Management
                </h1>
                <p className="text-gray-600 mt-1">Manage all stores in your marketplace</p>
              </div>

              <Link
                href={route('dashboard.createstore')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Create New Store
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Stores</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalStores}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaStore className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalProducts}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FaShoppingCart className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <FaDollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.averageRating.toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <FaStar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Store Type Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <select
                  value={storeTypeFilter}
                  onChange={(e) => setStoreTypeFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Store Types</option>
                  {stats.storeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="products-high">Most Products</option>
                  <option value="products-low">Fewest Products</option>
                  <option value="revenue-high">Highest Revenue</option>
                  <option value="revenue-low">Lowest Revenue</option>
                  <option value="rating-high">Highest Rating</option>
                  <option value="rating-low">Lowest Rating</option>
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFilter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'More Filters'}
              </button>
            </div>

            {/* Results Info */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredStores.length}</span> of <span className="font-semibold">{stats.totalStores}</span> stores
              </p>
              {(searchTerm || storeTypeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStoreTypeFilter('all');
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stores List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <h2 className="text-xl font-bold text-gray-800">All Stores</h2>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <FaStore className="h-4 w-4" />
                    {filteredStores.length} stores
                  </div>
                </div>

                {filteredStores.length === 0 ? (
                  <div className="text-center py-12">
                    <FaStore className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Stores Found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm ? `No results for "${searchTerm}"` : 'No stores available'}
                    </p>
                    <Link
                      href={route('dashboard.createstore')}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      <FaPlus className="h-4 w-4 mr-2" />
                      Create Your First Store
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredStores.map(store => (
                      <div
                        key={store.id}
                        className={`border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer ${
                          selectedStore?.id === store.id ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                        }`}
                        onClick={() => setSelectedStore(store)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Store Logo */}
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-md">
                              <img
                                src={store.logo || 'https://placehold.co/400x400/e2e8f0/64748b?text=Store'}
                                alt={store.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                          {/* Store Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0">
                                <h3 className="font-bold text-gray-800 text-lg truncate">{store.name}</h3>
                                <div className="flex items-center flex-wrap gap-2 mt-2">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStoreTypeColor(store.storetype)}`}>
                                    <FaBuilding className="h-3 w-3 mr-1" />
                                    {store.storetype}
                                  </span>
                                  {store.license && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                      <FaIdCard className="h-3 w-3 mr-1" />
                                      {store.license}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditStore(store.id);
                                  }}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit store"
                                >
                                  <FaEdit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(store.id);
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete store"
                                >
                                  <FaTrash className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Store Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                              <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-center mb-1">
                                  <FaBox className="h-3 w-3 text-gray-500 mr-1" />
                                  <span className="text-xs text-gray-600 font-medium">Products</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800">{store.stats?.totalProducts || 0}</p>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-center mb-1">
                                  <FaTags className="h-3 w-3 text-gray-500 mr-1" />
                                  <span className="text-xs text-gray-600 font-medium">Orders</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800">{store.stats?.totalOrders || 0}</p>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-center mb-1">
                                  <FaDollarSign className="h-3 w-3 text-gray-500 mr-1" />
                                  <span className="text-xs text-gray-600 font-medium">Revenue</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800">${(store.stats?.totalRevenue || 0).toLocaleString()}</p>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-center mb-1">
                                  <FaStar className="h-3 w-3 text-gray-500 mr-1" />
                                  <span className="text-xs text-gray-600 font-medium">Rating</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800">{store.stats?.averageRating?.toFixed(1) || '0.0'}</p>
                              </div>
                            </div>

                            {/* Store Owner and Created Date */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                              {store.user && (
                                <div className="flex items-center">
                                  <FaUsers className="h-3 w-3 text-gray-400 mr-2" />
                                  <span className="text-xs text-gray-600">
                                    Owner: <span className="font-medium">{store.user.name}</span>
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center text-xs text-gray-500">
                                <FaCalendarAlt className="h-3 w-3 mr-1" />
                                Created {new Date(store.created_at).toLocaleDateString()}
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

            {/* Store Details Sidebar */}
            <div className="space-y-6">
              {selectedStore ? (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <FaStore className="h-5 w-5 text-purple-600" />
                      Store Details
                    </h3>
                    <button
                      onClick={() => setSelectedStore(null)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Store Logo and Name */}
                  <div className="text-center mb-6">
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-lg mx-auto mb-4">
                      <img
                        src={selectedStore.logo || 'https://placehold.co/400x400/e2e8f0/64748b?text=Store'}
                        alt={selectedStore.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">{selectedStore.name}</h4>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStoreTypeColor(selectedStore.storetype)}`}>
                        {selectedStore.storetype}
                      </span>
                      {selectedStore.license && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          <FaIdCard className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Store Information */}
                  <div className="space-y-5">
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <FaIdCard className="h-4 w-4" />
                        License Information
                      </h5>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-800 text-center">{selectedStore.license || 'No license provided'}</p>
                        <p className="text-xs text-gray-500 text-center mt-1">Business License</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <FaUsers className="h-4 w-4" />
                        Store Owner
                      </h5>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-800 text-center">{selectedStore.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500 text-center mt-1">{selectedStore.user?.email || 'No email'}</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <FaChartLine className="h-4 w-4" />
                        Store Performance
                      </h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs text-blue-600 font-medium">Total Products</p>
                          <p className="text-xl font-bold text-gray-800 mt-1">{selectedStore.stats?.totalProducts || 0}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                          <p className="text-xs text-green-600 font-medium">Total Orders</p>
                          <p className="text-xl font-bold text-gray-800 mt-1">{selectedStore.stats?.totalOrders || 0}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <p className="text-xs text-purple-600 font-medium">Total Revenue</p>
                          <p className="text-xl font-bold text-gray-800 mt-1">${(selectedStore.stats?.totalRevenue || 0).toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                          <p className="text-xs text-orange-600 font-medium">Avg. Rating</p>
                          <p className="text-xl font-bold text-gray-800 mt-1">{selectedStore.stats?.averageRating?.toFixed(1) || '0.0'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <FaCalendarAlt className="h-4 w-4" />
                        Timeline
                      </h5>
                      <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Created Date</span>
                          <span className="font-medium text-gray-800">{new Date(selectedStore.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Last Updated</span>
                          <span className="font-medium text-gray-800">{new Date(selectedStore.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleViewProducts(selectedStore.id)}
                          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                        >
                          <FaEye className="h-4 w-4 mr-2" />
                          View Products
                        </button>
                        <button
                          onClick={() => handleViewAnalytics(selectedStore.id)}
                          className="inline-flex items-center justify-center px-4 py-2.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm"
                        >
                          <FaChartLine className="h-4 w-4 mr-2" />
                          Analytics
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <FaStore className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Store Details</h3>
                      <p className="text-sm opacity-90">Select a store to view details</p>
                    </div>
                  </div>
                  <p className="text-sm opacity-80 mb-6">
                    Click on any store from the list to view detailed information, performance metrics, and manage store settings.
                  </p>
                  <div className="text-center py-4">
                    <FaStore className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-sm opacity-75">No store selected</p>
                  </div>
                </div>
              )}

              {/* Store Types Distribution */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaChartLine className="h-5 w-5 text-purple-600" />
                  Store Types Distribution
                </h3>
                <div className="space-y-4">
                  {stats.storeTypes.map(type => {
                    const count = stores.filter(store => store.storetype === type).length;
                    const percentage = stats.totalStores > 0 ? (count / stats.totalStores) * 100 : 0;
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${getStoreTypeGradient(type)}`}></div>
                            <span className="font-medium text-gray-700">{type}</span>
                          </div>
                          <span className="text-gray-600">{count} stores</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${getStoreTypeGradient(type)}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Performing Stores */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaStar className="h-5 w-5 text-amber-500" />
                  Top Performing Stores
                </h3>
                <div className="space-y-3">
                  {stores
                    .sort((a, b) => (b.stats?.totalRevenue || 0) - (a.stats?.totalRevenue || 0))
                    .slice(0, 3)
                    .map((store, index) => (
                      <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold">
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-800 text-sm truncate">{store.name}</h4>
                            <p className="text-xs text-gray-600">${(store.stats?.totalRevenue || 0).toLocaleString()} revenue</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedStore(store)}
                          className="text-purple-600 hover:text-purple-700 text-xs font-medium flex items-center gap-1"
                        >
                          <FaEye className="h-3 w-3" />
                          View
                        </button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Need to onboard more stores?</h3>
                <p className="opacity-90">Streamline your store management with our enterprise features</p>
              </div>
              <button
                onClick={() => router.visit('/dashboard/store-management')}
                className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-purple-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Explore Features
                <FaArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                <FaExclamationCircle className="h-6 w-6 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Store</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this store? All associated products and data will be permanently removed.
              </p>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Store
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Store;
