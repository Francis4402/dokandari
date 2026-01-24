import { useState, useEffect } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaSortAmountDown,
  FaTag,
  FaFolder,
  FaChartBar,
  FaBoxes,
  FaTimes,
  FaCheck,
  FaExclamationCircle
} from 'react-icons/fa';

interface Category {
  id: string;
  categories: string;
  product_count: number;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

const Categories = () => {
  // Dummy categories data
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', categories: 'Electronics', product_count: 45, created_at: '2024-01-15', updated_at: '2024-01-15' },
    { id: '2', categories: 'Fashion', product_count: 32, created_at: '2024-01-14', updated_at: '2024-01-14' },
    { id: '3', categories: 'Home & Living', product_count: 28, created_at: '2024-01-13', updated_at: '2024-01-13' },
    { id: '4', categories: 'Sports & Outdoors', product_count: 21, created_at: '2024-01-12', updated_at: '2024-01-12' },
    { id: '5', categories: 'Beauty & Personal Care', product_count: 18, created_at: '2024-01-11', updated_at: '2024-01-11' },
    { id: '6', categories: 'Books & Stationery', product_count: 15, created_at: '2024-01-10', updated_at: '2024-01-10' },
    { id: '7', categories: 'Food & Beverage', product_count: 12, created_at: '2024-01-09', updated_at: '2024-01-09' },
    { id: '8', categories: 'Toys & Games', product_count: 9, created_at: '2024-01-08', updated_at: '2024-01-08' },
    { id: '9', categories: 'Health & Wellness', product_count: 7, created_at: '2024-01-07', updated_at: '2024-01-07' },
    { id: '10', categories: 'Automotive', product_count: 5, created_at: '2024-01-06', updated_at: '2024-01-06' },
  ]);

  // Dummy products data for category detail view
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Wireless Headphones', category: 'Electronics', price: 199.99, inStock: true },
    { id: '2', name: 'Smart Watch', category: 'Electronics', price: 299.99, inStock: true },
    { id: '3', name: 'Bluetooth Speaker', category: 'Electronics', price: 89.99, inStock: true },
    { id: '4', name: 'Leather Jacket', category: 'Fashion', price: 149.99, inStock: true },
    { id: '5', name: 'Running Shoes', category: 'Fashion', price: 119.99, inStock: false },
    { id: '6', name: 'Throw Pillow', category: 'Home & Living', price: 29.99, inStock: true },
    { id: '7', name: 'Coffee Table', category: 'Home & Living', price: 199.99, inStock: true },
    { id: '8', name: 'Yoga Mat', category: 'Sports & Outdoors', price: 49.99, inStock: true },
    { id: '9', name: 'Face Cream', category: 'Beauty & Personal Care', price: 34.99, inStock: true },
    { id: '10', name: 'Novel', category: 'Books & Stationery', price: 19.99, inStock: true },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Calculate statistics
  const stats = {
    totalCategories: categories.length,
    totalProducts: categories.reduce((sum, cat) => sum + cat.product_count, 0),
    averageProducts: Math.round(categories.reduce((sum, cat) => sum + cat.product_count, 0) / categories.length),
    mostProducts: Math.max(...categories.map(cat => cat.product_count)),
    leastProducts: Math.min(...categories.map(cat => cat.product_count)),
    popularCategories: categories.sort((a, b) => b.product_count - a.product_count).slice(0, 3),
  };

  // Filter and sort categories
  const filteredCategories = categories
    .filter(category =>
      category.categories.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.categories.localeCompare(b.categories);
        case 'name-desc':
          return b.categories.localeCompare(a.categories);
        case 'products-high':
          return b.product_count - a.product_count;
        case 'products-low':
          return a.product_count - b.product_count;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default:
          return a.categories.localeCompare(b.categories);
      }
    });

  // Get category color based on product count
  const getCategoryColor = (productCount: number) => {
    if (productCount >= 30) return 'from-purple-500 to-pink-500';
    if (productCount >= 20) return 'from-blue-500 to-purple-500';
    if (productCount >= 10) return 'from-green-500 to-teal-500';
    return 'from-orange-500 to-red-500';
  };

  // Get category size based on product count
  const getCategorySize = (productCount: number) => {
    if (productCount >= 30) return 'text-2xl';
    if (productCount >= 20) return 'text-xl';
    if (productCount >= 10) return 'text-lg';
    return 'text-base';
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(cat => cat.id !== categoryToDelete));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newCat: Category = {
        id: Date.now().toString(),
        categories: newCategory.trim(),
        product_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCategories([...categories, newCat]);
      setNewCategory('');
      setShowAddModal(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditMode(true);
    setEditCategoryId(category.id);
    setEditCategoryName(category.categories);
  };

  const saveEdit = () => {
    if (editCategoryId && editCategoryName.trim()) {
      setCategories(categories.map(cat =>
        cat.id === editCategoryId
          ? { ...cat, categories: editCategoryName.trim(), updated_at: new Date().toISOString() }
          : cat
      ));
      setEditMode(false);
      setEditCategoryId(null);
      setEditCategoryName('');
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditCategoryId(null);
    setEditCategoryName('');
  };

  // Get products for selected category
  const getCategoryProducts = (categoryName: string) => {
    return products.filter(product => product.category === categoryName);
  };

  return (
    <DashboardLayout>
      <Head title="Categories Management" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Categories Management</h1>
                <p className="text-gray-600 mt-1">Organize and manage your product categories</p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Add New Category
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Categories</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalCategories}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaFolder className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalProducts}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FaBoxes className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Products/Category</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.averageProducts}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <FaChartBar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Most Products</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.mostProducts}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <FaTag className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full md:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="products-high">Most Products</option>
                  <option value="products-low">Fewest Products</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredCategories.length}</span> of <span className="font-semibold">{stats.totalCategories}</span> categories
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
                >
                  <FaTimes className="h-3 w-3 mr-1" />
                  Clear Search
                </button>
              )}
            </div>
          </div>

          {/* Categories Grid and List View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Categories Grid */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">All Categories</h2>
                  <div className="text-sm text-gray-600">
                    {filteredCategories.length} categories
                  </div>
                </div>

                {filteredCategories.length === 0 ? (
                  <div className="text-center py-12">
                    <FaFolder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Categories Found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm ? `No results for "${searchTerm}"` : 'No categories available'}
                    </p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      <FaPlus className="h-4 w-4 mr-2" />
                      Add Your First Category
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCategories.map(category => (
                      <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            {editMode && editCategoryId === category.id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={editCategoryName}
                                  onChange={(e) => setEditCategoryName(e.target.value)}
                                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  autoFocus
                                />
                                <button
                                  onClick={saveEdit}
                                  className="p-1 text-green-600 hover:text-green-700"
                                >
                                  <FaCheck className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1 text-red-600 hover:text-red-700"
                                >
                                  <FaTimes className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <h3
                                className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-purple-600"
                                onClick={() => setSelectedCategory(category)}
                              >
                                {category.categories}
                              </h3>
                            )}
                            <p className="text-sm text-gray-600 mt-1">
                              {category.product_count} products
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEdit(category)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit category"
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete category"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Created: {new Date(category.created_at).toLocaleDateString()}</span>
                            <span>Updated: {new Date(category.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Category Details & Popular Categories */}
            <div className="space-y-6">
              {/* Selected Category Details */}
              {selectedCategory ? (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Category Details</h3>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className={`text-center py-4 rounded-lg bg-gradient-to-r ${getCategoryColor(selectedCategory.product_count)} text-white mb-4`}>
                      <h4 className={`font-bold ${getCategorySize(selectedCategory.product_count)}`}>
                        {selectedCategory.categories}
                      </h4>
                      <p className="text-sm opacity-90 mt-1">{selectedCategory.product_count} products</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{new Date(selectedCategory.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">{new Date(selectedCategory.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Product Count:</span>
                        <span className="font-medium">{selectedCategory.product_count}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Sample Products</h4>
                    <div className="space-y-2">
                      {getCategoryProducts(selectedCategory.categories).slice(0, 3).map(product => (
                        <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{product.name}</span>
                          <span className="text-sm font-medium">${product.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Category Details</h3>
                  <p className="text-sm opacity-90 mb-6">
                    Select a category from the list to view detailed information and manage its products.
                  </p>
                  <div className="text-center">
                    <FaFolder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-75">No category selected</p>
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Popular Categories</h3>
                <div className="space-y-4">
                  {stats.popularCategories.map((category, index) => (
                    <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-gradient-to-r ${getCategoryColor(category.product_count)} text-white font-bold`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{category.categories}</h4>
                          <p className="text-xs text-gray-600">{category.product_count} products</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all"
                  >
                    <FaPlus className="h-4 w-4 mr-2" />
                    Add New Category
                  </button>
                  <Link
                    href="/dashboard/products"
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Chart (Visual Representation) */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Categories Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.slice(0, 5).map(category => {
                const percentage = (category.product_count / stats.totalProducts) * 100;
                return (
                  <div key={category.id} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (percentage * 251.2) / 100}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{Math.round(percentage)}%</span>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm">{category.categories}</h4>
                    <p className="text-xs text-gray-600">{category.product_count} products</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Add New Category</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                <FaExclamationCircle className="h-6 w-6 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Category</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this category? This action cannot be undone.
              </p>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Categories;
