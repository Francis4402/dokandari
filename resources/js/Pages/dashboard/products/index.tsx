import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaBox,
  FaDollarSign,
  FaChartLine,
  FaTag,
  FaImage,
  FaArrowRight,
  FaExclamationCircle,
  FaTimes
} from 'react-icons/fa';
import { Product, storeType } from '@/types';
import { toast } from 'sonner';


interface dashboarProductProps {
    auth: {
        user: any
    },
    products: Product[]
    store: storeType
}

const Products = ({auth, products, store}: dashboarProductProps) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [stockFilter, setStockFilter] = useState('all');



  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, product) => sum + (product.sale_price || product.regular_price) * product.quantity, 0),
    inStock: products.filter(p => p.inStock && p.quantity > 0).length,
    outOfStock: products.filter(p => !p.inStock || p.quantity === 0).length,
    lowStock: products.filter(p => p.quantity > 0 && p.quantity < 20).length,
    categories: Array.from(new Set(products.map(p => p.category))),
    averageRating: products.reduce((sum, product) => sum + product.rating, 0) / products.length
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

      const matchesStock =
        stockFilter === 'all' ? true :
        stockFilter === 'in-stock' ? product.inStock && product.quantity > 0 :
        stockFilter === 'out-of-stock' ? (!product.inStock || product.quantity === 0) :
        stockFilter === 'low-stock' ? product.quantity > 0 && product.quantity < 20 : true;

      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-high':
          return (b.sale_price || b.regular_price) - (a.sale_price || a.regular_price);
        case 'price-low':
          return (a.sale_price || a.regular_price) - (b.sale_price || b.regular_price);
        case 'quantity-high':
          return b.quantity - a.quantity;
        case 'quantity-low':
          return a.quantity - b.quantity;
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      router.delete(route('dashboard.deleteproduct', productToDelete), {
        onSuccess: () => {
          toast.success('Product deleted successfully!');
          setShowDeleteModal(false);
          setProductToDelete(null);
        },
        onError: () => {
          toast.error('Failed to delete product.');
          setShowDeleteModal(false);
          setProductToDelete(null);
        },
        preserveScroll: true,
      });
    }

  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleToast = () => {
    toast.error('Please Create Store First!');
  }

  const calculateDiscount = (regularPrice: number, salePrice: number) => {
    if (!salePrice) return 0;
    const regular = regularPrice;
    const sale = salePrice;
    return Math.round(((regular - sale) / regular) * 100);
  };

  const getStockStatus = (quantity: number, inStock: boolean) => {
    if (quantity === 0 || !inStock) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity < 10) return { label: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    if (quantity < 20) return { label: 'Medium Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  return (
    <DashboardLayout user={auth.user}>
      <Head title="Products Management" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
                <p className="text-gray-600 mt-1">Manage your inventory and products</p>
              </div>

              <div>
                {
                    store ? (
                        <Link
                            href={route('dashboard.createproduct')}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5"
                        >
                            <FaPlus className="h-4 w-4 mr-2" />
                            Add New Product
                        </Link>
                    ) : (
                        <button onClick={handleToast} className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5">
                            <FaPlus className="h-4 w-4 mr-2" />
                            Add New Product
                        </button>
                    )
                }
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalProducts}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaBox className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  <p className="text-sm font-medium text-gray-600">In Stock</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.inStock}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <FaChartLine className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.averageRating.toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <FaTag className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  {stats.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Stock Filter */}
              <div className="relative">
                <FaBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Stock Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="low-stock">Low Stock</option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="quantity-high">Quantity: High to Low</option>
                  <option value="quantity-low">Quantity: Low to High</option>
                  <option value="rating-high">Rating: High to Low</option>
                  <option value="rating-low">Rating: Low to High</option>
                </select>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredProducts.length}</span> of <span className="font-semibold">{stats.totalProducts}</span> products
              </p>
              {(searchTerm || categoryFilter !== 'all' || stockFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setStockFilter('all');
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FaBox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? `No results for "${searchTerm}"` : 'No products match your filters'}
              </p>
              <Link
                href={route('dashboard.createproduct')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => {
                    const discount = calculateDiscount(product.regular_price, product.sale_price);
                    const stockStatus = getStockStatus(product.quantity, product.inStock);

                    // Parse images array from JSON string
                    let images = [];
                    try {
                    images = product.images ? JSON.parse(product.images) : [];
                    } catch (e) {
                    images = product.images ? [product.images] : []; // Fallback for single image
                    }

                    const mainImage = images.length > 0 ? images[0] : null;

                    return (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        {/* Product Image */}
                        <div className="relative h-48 overflow-hidden">
                        <img
                            src={mainImage ? `/product_images/${mainImage}` : 'https://placehold.co/400x400/e2e8f0/64748b?text=Product'}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {discount > 0 && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                            -{discount}%
                            </div>
                        )}
                        <div className="absolute bottom-3 left-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}>
                            {stockStatus.label}
                            </span>
                        </div>

                        {/* Show image count if multiple images */}
                        {images.length > 1 && (
                            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                            +{images.length - 1}
                            </div>
                        )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {product.category}
                            </span>
                            <div className="flex items-center">
                            <FaImage className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{product.quantity} in stock</span>
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                            {product.sale_price ? (
                                <>
                                <span className="text-lg font-bold text-gray-800">${product.sale_price}</span>
                                <span className="text-sm text-gray-500 line-through ml-2">${product.regular_price}</span>
                                </>
                            ) : (
                                <span className="text-lg font-bold text-gray-800">${product.regular_price}</span>
                            )}
                            </div>
                            <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-medium text-gray-700 ml-1">{product.rating}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                            <Link
                                href={`/dashboard/products/${product.id}`}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                            <FaEye className="h-3 w-3 mr-1" />
                                View
                            </Link>
                            <Link
                                href={route(`dashboard.productedit`, product.slug)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                            >
                            <FaEdit className="h-3 w-3 mr-1" />
                            Edit
                            </Link>
                            <button
                                onClick={() => handleDeleteClick(product.id)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                            >
                            <FaTrash className="h-3 w-3 mr-1" />
                                Delete
                            </button>
                        </div>
                        </div>
                    </div>
                    );
                })}
            </div>
          )}

          {showDeleteModal && productToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <FaExclamationCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                        <h3 className="text-lg font-bold text-gray-800">Delete Product</h3>
                        <p className="text-sm text-gray-600">Confirm deletion</p>
                        </div>
                    </div>
                    <button
                        onClick={cancelDelete}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                    </div>

                    <div className="my-6 p-4 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-red-700 text-center">
                        Are you sure you want to delete?
                    </p>
                    <p className="text-sm text-red-600 text-center mt-2">
                        This product will be permanently removed from your store.
                    </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                    <button
                        onClick={cancelDelete}
                        className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDelete}
                        className="px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
                    >
                        <FaTrash className="h-4 w-4 mr-2" />
                        Delete Product
                    </button>
                    </div>
                </div>
                </div>
            </div>
        )}

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Low Stock Items</p>
                  <p className="text-2xl font-bold mt-1">{stats.lowStock}</p>
                </div>
                <FaBox className="h-8 w-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Out of Stock</p>
                  <p className="text-2xl font-bold mt-1">{stats.outOfStock}</p>
                </div>
                <FaTag className="h-8 w-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Categories</p>
                  <p className="text-2xl font-bold mt-1">{stats.categories.length}</p>
                </div>
                <FaChartLine className="h-8 w-8 opacity-80" />
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Need to manage more products?</h3>
                <p className="opacity-90">Upgrade your plan for unlimited products and advanced features</p>
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

export default Products;
