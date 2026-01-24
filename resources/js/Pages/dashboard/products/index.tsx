import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
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
  FaArrowRight
} from 'react-icons/fa';

interface Product {
  id: string;
  user_id: string;
  store_id: string;
  name: string;
  images: string;
  slug: string;
  category: string;
  quantity: number;
  regular_price: string;
  sale_price: string | null;
  description: string;
  inStock: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
}

const Products = () => {
  // Dummy products data matching your schema
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      user_id: 'user-001',
      store_id: 'store-001',
      name: 'Premium Wireless Headphones',
      images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      slug: 'premium-wireless-headphones',
      category: 'Electronics',
      quantity: 45,
      regular_price: '199.99',
      sale_price: '149.99',
      description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
      inStock: true,
      rating: 4.5,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      user_id: 'user-001',
      store_id: 'store-001',
      name: 'Organic Coffee Beans',
      images: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
      slug: 'organic-coffee-beans',
      category: 'Food & Beverage',
      quantity: 120,
      regular_price: '24.99',
      sale_price: null,
      description: 'Premium organic coffee beans sourced from sustainable farms.',
      inStock: true,
      rating: 4.8,
      created_at: '2024-01-14T14:20:00Z',
      updated_at: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      user_id: 'user-001',
      store_id: 'store-001',
      name: 'Yoga Mat Premium',
      images: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop',
      slug: 'yoga-mat-premium',
      category: 'Fitness',
      quantity: 25,
      regular_price: '59.99',
      sale_price: '49.99',
      description: 'Non-slip yoga mat with extra cushioning for comfortable practice.',
      inStock: true,
      rating: 4.3,
      created_at: '2024-01-13T09:15:00Z',
      updated_at: '2024-01-13T09:15:00Z'
    },
    {
      id: '4',
      user_id: 'user-001',
      store_id: 'store-001',
      name: 'Smart Watch Pro',
      images: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      slug: 'smart-watch-pro',
      category: 'Electronics',
      quantity: 0,
      regular_price: '299.99',
      sale_price: '279.99',
      description: 'Advanced smart watch with heart rate monitoring and GPS.',
      inStock: false,
      rating: 4.7,
      created_at: '2024-01-12T16:45:00Z',
      updated_at: '2024-01-12T16:45:00Z'
    },
    {
      id: '5',
      user_id: 'user-001',
      store_id: 'store-001',
      name: 'Leather Backpack',
      images: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      slug: 'leather-backpack',
      category: 'Fashion',
      quantity: 15,
      regular_price: '129.99',
      sale_price: '99.99',
      description: 'Genuine leather backpack with laptop compartment and multiple pockets.',
      inStock: true,
      rating: 4.6,
      created_at: '2024-01-11T11:20:00Z',
      updated_at: '2024-01-11T11:20:00Z'
    },
    {
      id: '6',
      user_id: 'user-001',
      store_id: 'store-001',
      name: 'Bluetooth Speaker',
      images: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
      slug: 'bluetooth-speaker',
      category: 'Electronics',
      quantity: 60,
      regular_price: '89.99',
      sale_price: '79.99',
      description: 'Portable Bluetooth speaker with 360° sound and waterproof design.',
      inStock: true,
      rating: 4.4,
      created_at: '2024-01-10T13:30:00Z',
      updated_at: '2024-01-10T13:30:00Z'
    },
    {
      id: '7',
      user_id: 'user-001',
      store_id: 'store-001',
      name: 'Essential Oil Diffuser',
      images: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop',
      slug: 'essential-oil-diffuser',
      category: 'Home & Living',
      quantity: 35,
      regular_price: '39.99',
      sale_price: '34.99',
      description: 'Ultrasonic essential oil diffuser with color changing LED lights.',
      inStock: true,
      rating: 4.2,
      created_at: '2024-01-09T08:45:00Z',
      updated_at: '2024-01-09T08:45:00Z'
    },
    {
      id: '8',
      user_id: 'user-001',
      store_id: 'store-001',
      name: 'Running Shoes',
      images: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      slug: 'running-shoes',
      category: 'Sports',
      quantity: 8,
      regular_price: '129.99',
      sale_price: '119.99',
      description: 'Lightweight running shoes with superior cushioning and support.',
      inStock: true,
      rating: 4.9,
      created_at: '2024-01-08T10:15:00Z',
      updated_at: '2024-01-08T10:15:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [stockFilter, setStockFilter] = useState('all');

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, product) => sum + parseFloat(product.sale_price || product.regular_price) * product.quantity, 0),
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
          return parseFloat(b.sale_price || b.regular_price) - parseFloat(a.sale_price || a.regular_price);
        case 'price-low':
          return parseFloat(a.sale_price || a.regular_price) - parseFloat(b.sale_price || b.regular_price);
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

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const calculateDiscount = (regularPrice: string, salePrice: string | null) => {
    if (!salePrice) return 0;
    const regular = parseFloat(regularPrice);
    const sale = parseFloat(salePrice);
    return Math.round(((regular - sale) / regular) * 100);
  };

  const getStockStatus = (quantity: number, inStock: boolean) => {
    if (quantity === 0 || !inStock) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity < 10) return { label: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    if (quantity < 20) return { label: 'Medium Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  return (
    <DashboardLayout>
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

              <Link
                href="/dashboard/products/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Add New Product
              </Link>
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
                href="/dashboard/products/create"
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

                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.images}
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
                          href={`/dashboard/products/${product.id}/edit`}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <FaEdit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
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
