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
  FaEllipsisH,
} from 'react-icons/fa';
import { Orders, Product, storeType, User } from '@/types';

interface storeDashboardProps {
    auth: {
        user: User;
    },
    stores: storeType[];
    products: Product[];
    orders: Orders[];
}

const Store = ({ auth, stores, products, orders }: storeDashboardProps) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [storeTypeFilter, setStoreTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedStore, setSelectedStore] = useState<storeType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<string | null>(null);
  const [showMoreActions, setShowMoreActions] = useState<string | null>(null);

  const stats = {
    totalStores: stores.length,
    totalProducts: stores.reduce((sum, store) => sum + ((store as any).stats?.totalProducts || 0), 0),
    totalOrders: stores.reduce((sum, store) => sum + ((store as any).stats?.totalOrders || 0), 0),
    totalRevenue: stores.reduce((sum, store) => sum + ((store as any).stats?.totalRevenue || 0), 0),
    averageRating: stores.length > 0
      ? stores.reduce((sum, store) => sum + ((store as any).stats?.averageRating || 0), 0) / stores.length
      : 0,
    storeTypes: Array.from(new Set(stores.map(store => store.storetype)))
  };

  // Filter and sort stores
  const filteredStores = stores
    .filter(store => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.storetype.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.license?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        ((store as any).user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const matchesType = storeTypeFilter === 'all' || store.storetype === storeTypeFilter;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const aStats = (a as any).stats || {};
      const bStats = (b as any).stats || {};
      const aCreatedAt = (a as any).created_at || new Date().toISOString();
      const bCreatedAt = (b as any).created_at || new Date().toISOString();

      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'products-high':
          return (bStats.totalProducts || 0) - (aStats.totalProducts || 0);
        case 'products-low':
          return (aStats.totalProducts || 0) - (bStats.totalProducts || 0);
        case 'revenue-high':
          return (bStats.totalRevenue || 0) - (aStats.totalRevenue || 0);
        case 'revenue-low':
          return (aStats.totalRevenue || 0) - (bStats.totalRevenue || 0);
        case 'rating-high':
          return (bStats.averageRating || 0) - (aStats.averageRating || 0);
        case 'rating-low':
          return (aStats.averageRating || 0) - (bStats.averageRating || 0);
        case 'newest':
        default:
          return new Date(bCreatedAt).getTime() - new Date(aCreatedAt).getTime();
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

  const handleDelete = (id: string) => {
    setStoreToDelete(id);
    setShowDeleteModal(true);
    setShowMoreActions(null);
  };

  const confirmDelete = () => {
    if (storeToDelete) {
      router.delete(route('dashboard.deletestore', storeToDelete), {
        onSuccess: () => {
          setShowDeleteModal(false);
          setStoreToDelete(null);
          if (selectedStore?.id === storeToDelete) {
            setSelectedStore(null);
          }
        },
        onError: () => {
          setShowDeleteModal(false);
          setStoreToDelete(null);
        },
        preserveScroll: true,
      });
    }
  };

  const handleEditStore = (name: string) => {
    router.visit(route('dashboard.storeedit', name));
    setShowMoreActions(null);
  };

  const handleViewProducts = (id: string) => {
    router.visit(route('dashboard.storeproducts', id));
  };

  const handleViewAnalytics = (id: string) => {
    router.visit(route('dashboard.storeanalytics', id));
  };

  const formatCompactNumber = (num: number): string => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}k`;
    } else {
      return `$${num}`;
    }
  };

  return (
    <DashboardLayout user={auth.user}>
      <Head title="Store Management" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                  <FaStore className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                  <span className="truncate">Store Management</span>
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage all stores in your marketplace</p>
              </div>

              <Link
                href={route('dashboard.createstore')}
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all text-sm sm:text-base w-full md:w-auto flex-shrink-0"
              >
                <FaPlus className="h-4 w-4 mr-2 flex-shrink-0" />
                Create New Store
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Stores</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mt-1 truncate">{stats.totalStores}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center ml-3 flex-shrink-0">
                  <FaStore className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Products</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mt-1 truncate">{products.length}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-green-100 flex items-center justify-center ml-3 flex-shrink-0">
                  <FaShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Revenue</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mt-1 truncate">
                    {formatCompactNumber(stats.totalRevenue)}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center ml-3 flex-shrink-0">
                  <FaDollarSign className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Avg. Rating</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mt-1 truncate">{stats.averageRating.toFixed(1)}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-orange-100 flex items-center justify-center ml-3 flex-shrink-0">
                  <FaStar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              {/* Store Type Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <select
                  value={storeTypeFilter}
                  onChange={(e) => setStoreTypeFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-sm sm:text-base"
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
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-sm sm:text-base"
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
                onClick={() => setShowMoreActions(null)}
                className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <FaFilter className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">More Filters</span>
              </button>
            </div>

            {/* Results Info */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 truncate">
                Showing <span className="font-semibold">{filteredStores.length}</span> of <span className="font-semibold">{stats.totalStores}</span> stores
              </p>
              {(searchTerm || storeTypeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStoreTypeFilter('all');
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium flex-shrink-0 ml-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Stores List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 pb-4 border-b gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">All Stores</h2>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <FaStore className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{filteredStores.length} stores</span>
                  </div>
                </div>

                {filteredStores.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <FaStore className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Stores Found</h3>
                    <p className="text-gray-600 mb-6 text-sm sm:text-base">
                      {searchTerm ? `No results for "${searchTerm}"` : 'No stores available'}
                    </p>
                    <Link
                      href={route('dashboard.createstore')}
                      className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all text-sm sm:text-base"
                    >
                      <FaPlus className="h-4 w-4 mr-2 flex-shrink-0" />
                      Create Your First Store
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredStores.map(store => {
                      const storeStats = (store as any).stats || {};
                      const storeCreatedAt = (store as any).created_at || new Date().toISOString();
                      const storeUser = (store as any).user || {};

                      return (
                        <div
                          key={store.id}
                          className={`border border-gray-200 rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-lg transition-all cursor-pointer ${
                            selectedStore?.id === store.id ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                          }`}
                          onClick={() => setSelectedStore(store)}
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            {/* Store Logo */}
                            <div className="flex-shrink-0">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 border-white shadow-md">
                                <img
                                  src={store.logo ? `/storage/${store.logo}` : 'https://placehold.co/400x400/e2e8f0/64748b?text=Store'}
                                  alt={store.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            {/* Store Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">{store.name}</h3>
                                  <div className="flex items-center flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                                    <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getStoreTypeColor(store.storetype)}`}>
                                      <FaBuilding className="h-2 w-2 sm:h-3 sm:w-3 mr-1 flex-shrink-0" />
                                      <span className="truncate">{store.storetype}</span>
                                    </span>
                                    {store.license && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                        <FaIdCard className="h-2 w-2 sm:h-3 sm:w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">{store.license}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Mobile Action Menu */}
                                <div className="relative sm:hidden">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowMoreActions(showMoreActions === store.id ? null : store.id);
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                    title="More actions"
                                  >
                                    <FaEllipsisH className="h-4 w-4" />
                                  </button>

                                  {showMoreActions === store.name && (
                                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditStore(store.name);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                                      >
                                        <FaEdit className="h-3 w-3" />
                                        Edit
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(store.id);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      >
                                        <FaTrash className="h-3 w-3" />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Desktop Actions */}
                                <div className="hidden sm:flex space-x-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditStore(store.name);
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
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3 sm:mt-4">
                                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                  <div className="flex items-center justify-center mb-1">
                                    <FaBox className="h-3 w-3 text-gray-500 mr-1 flex-shrink-0" />
                                    <span className="text-xs text-gray-600 font-medium truncate">Products</span>
                                  </div>
                                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800 truncate">{products.filter(p => p.store_id === store.id).length}</p>
                                </div>
                                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                  <div className="flex items-center justify-center mb-1">
                                    <FaTags className="h-3 w-3 text-gray-500 mr-1 flex-shrink-0" />
                                    <span className="text-xs text-gray-600 font-medium truncate">Orders</span>
                                  </div>
                                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800 truncate">{orders.filter(o => o.store_id === store.id).length}</p>
                                </div>
                                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                  <div className="flex items-center justify-center mb-1">
                                    <FaDollarSign className="h-3 w-3 text-gray-500 mr-1 flex-shrink-0" />
                                    <span className="text-xs text-gray-600 font-medium truncate">Revenue</span>
                                  </div>
                                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800 truncate">
                                    ${(storeStats.totalRevenue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                  </p>
                                </div>
                                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                  <div className="flex items-center justify-center mb-1">
                                    <FaStar className="h-3 w-3 text-gray-500 mr-1 flex-shrink-0" />
                                    <span className="text-xs text-gray-600 font-medium truncate">Rating</span>
                                  </div>
                                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800 truncate">{storeStats.averageRating?.toFixed(1) || '0.0'}</p>
                                </div>
                              </div>

                              {/* Store Owner and Created Date */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 gap-2">
                                {storeUser.name && (
                                  <div className="flex items-center min-w-0">
                                    <FaUsers className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0" />
                                    <span className="text-xs text-gray-600 truncate">
                                      Owner: <span className="font-medium truncate">{storeUser.name}</span>
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center text-xs text-gray-500">
                                  <FaCalendarAlt className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">Created {new Date(storeCreatedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Store Details Sidebar */}
            <div className="space-y-6">
              {selectedStore ? (
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2 truncate">
                      <FaStore className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                      <span className="truncate">Store Details</span>
                    </h3>
                    <button
                      onClick={() => setSelectedStore(null)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                    >
                      <FaTimes className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>

                  {/* Store Logo and Name */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 sm:border-4 border-white shadow-lg mx-auto mb-3 sm:mb-4">
                        <img
                            src={selectedStore.logo ? `/storage/${selectedStore.logo}` : 'https://placehold.co/400x400/e2e8f0/64748b?text=Store'}
                            alt={selectedStore.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 truncate px-2">{selectedStore.name}</h4>
                    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                      <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${getStoreTypeColor(selectedStore.storetype)}`}>
                        <span className="truncate">{selectedStore.storetype}</span>
                      </span>
                      {selectedStore.license && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          <FaIdCard className="h-2 w-2 sm:h-3 sm:w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">Verified</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Store Information */}
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <h5 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <FaIdCard className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        License Information
                      </h5>
                      <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-800 text-center truncate">{selectedStore.license || 'No license provided'}</p>
                        <p className="text-xs text-gray-500 text-center mt-1">Business License</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <FaUsers className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        Store Owner
                      </h5>
                      <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-800 text-center truncate">Email</p>
                        <p className="text-xs text-gray-500 text-center mt-1 truncate">{selectedStore.email || 'No email'}</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <FaChartLine className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        Store Performance
                      </h5>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs text-blue-600 font-medium truncate">Products</p>
                          <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mt-1 truncate">{(selectedStore as any).stats?.totalProducts || 0}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-green-50 rounded-lg border border-green-100">
                          <p className="text-xs text-green-600 font-medium truncate">Orders</p>
                          <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mt-1 truncate">{(selectedStore as any).stats?.totalOrders || 0}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <p className="text-xs text-purple-600 font-medium truncate">Revenue</p>
                          <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mt-1 truncate">
                            ${((selectedStore as any).stats?.totalRevenue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <div className="p-2 sm:p-3 bg-orange-50 rounded-lg border border-orange-100">
                          <p className="text-xs text-orange-600 font-medium truncate">Rating</p>
                          <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mt-1 truncate">{((selectedStore as any).stats?.averageRating || 0).toFixed(1)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h5 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <FaCalendarAlt className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        Timeline
                      </h5>
                      <div className="space-y-2 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-1">
                          <span className="text-gray-600 truncate">Created Date</span>
                          <span className="font-medium text-gray-800 truncate">{new Date((selectedStore as any).created_at || new Date()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-1">
                          <span className="text-gray-600 truncate">Last Updated</span>
                          <span className="font-medium text-gray-800 truncate">{new Date((selectedStore as any).updated_at || new Date()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <button
                          onClick={() => handleViewProducts(selectedStore.id)}
                          className="inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs sm:text-sm"
                        >
                          <FaEye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">View Products</span>
                        </button>
                        <button
                          onClick={() => handleViewAnalytics(selectedStore.id)}
                          className="inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-xs sm:text-sm"
                        >
                          <FaChartLine className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">Analytics</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg p-4 sm:p-6 text-white">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <FaStore className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold truncate">Store Details</h3>
                      <p className="text-xs sm:text-sm opacity-90 truncate">Select a store to view details</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm opacity-80 mb-4 sm:mb-6">
                    Click on any store from the list to view detailed information, performance metrics, and manage store settings.
                  </p>
                  <div className="text-center py-3 sm:py-4">
                    <FaStore className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                    <p className="text-sm opacity-75">No store selected</p>
                  </div>
                </div>
              )}

              {/* Store Types Distribution */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FaChartLine className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                  <span className="truncate">Store Types Distribution</span>
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {stats.storeTypes.map(type => {
                    const count = stores.filter(store => store.storetype === type).length;
                    const percentage = stats.totalStores > 0 ? (count / stats.totalStores) * 100 : 0;
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${getStoreTypeGradient(type)} flex-shrink-0`}></div>
                            <span className="font-medium text-gray-700 truncate">{type}</span>
                          </div>
                          <span className="text-gray-600 flex-shrink-0 ml-2">{count} stores</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div
                            className={`h-1.5 sm:h-2 rounded-full bg-gradient-to-r ${getStoreTypeGradient(type)}`}
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
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FaStar className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0" />
                  <span className="truncate">Top Performing Stores</span>
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {stores
                    .sort((a, b) => ((b as any).stats?.totalRevenue || 0) - ((a as any).stats?.totalRevenue || 0))
                    .slice(0, 3)
                    .map((store, index) => (
                      <div key={store.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center min-w-0">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs sm:text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-800 text-xs sm:text-sm truncate">{store.name}</h4>
                            <p className="text-xs text-gray-600 truncate">
                              ${((store as any).stats?.totalRevenue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} revenue
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedStore(store)}
                          className="text-purple-600 hover:text-purple-700 text-xs font-medium flex items-center gap-1 flex-shrink-0 ml-2"
                        >
                          <FaEye className="h-3 w-3" />
                          <span className="hidden xs:inline">View</span>
                        </button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 truncate">Need to onboard more stores?</h3>
                <p className="opacity-90 text-sm sm:text-base truncate">Streamline your store management with our enterprise features</p>
              </div>
              <button
                onClick={() => router.visit('/dashboard/store-management')}
                className="mt-2 md:mt-0 inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-purple-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base w-full md:w-auto flex-shrink-0"
              >
                <span className="truncate">Explore Features</span>
                <FaArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 mx-auto mb-3 sm:mb-4">
                <FaExclamationCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center mb-2">Delete Store</h3>
              <p className="text-gray-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
                Are you sure you want to delete this store? All associated products and data will be permanently removed.
              </p>

              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 sm:px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 sm:px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
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
