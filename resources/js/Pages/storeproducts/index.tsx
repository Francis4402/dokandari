import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
  FaStore,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaShoppingBag,
  FaFilter,
  FaSearch,
  FaChevronRight,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaHeadset,
  FaIdCard,
  FaFileAlt,
  FaEye,
} from "react-icons/fa";
import AppLayout from "@/Layouts/AppLayout";
import { Product, storeType } from "@/types";
import WishlistButton from "../buttons/WishlistButton";
import AddtoCartButton from "../buttons/AddtoCartButton";

interface StorePageProps {
  auth: {
    user: any;
  };
  store: storeType;
  products: Product[];
  wishlist: any;
  storeRating?: {
    average: number;
    count: number;
  };
  productRatings?: Record<string, { average: number; count: number }>;
  userStoreRating?: {
    id: string;
    rating: number;
    comment: string;
  } | null;
}

export default function StoreShow({
  auth,
  store,
  products,
  wishlist,
  storeRating = { average: 0, count: 0 },
  productRatings = {},
}: StorePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');


  const categories = Array.from(
    new Set(products.map(p => p.category).filter(Boolean))
  );


  const productsWithRatings = products.map(product => {
    const ratingData = productRatings[product.id];
    return {
      ...product,
      calculatedRating: ratingData?.average || product.rating || 0,
      reviewCount: ratingData?.count || 0
    };
  });


  const filteredProducts = productsWithRatings
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.sale_price || a.regular_price) - (b.sale_price || b.regular_price);
        case "price-high":
          return (b.sale_price || b.regular_price) - (a.sale_price || a.regular_price);
        case "rating":
          return (b.calculatedRating || 0) - (a.calculatedRating || 0);
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <FaStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />;
          } else if (i === fullStars && hasHalfStar) {
            return <FaStarHalf key={i} className="w-4 h-4 text-yellow-400 fill-current" />;
          } else {
            return <FaRegStar key={i} className="w-4 h-4 text-gray-300" />;
          }
        })}
      </div>
    );
  };

    const stripHtml = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '');
    };

  const getImageSrc = (images: string): string => {
    if (!images) return '/placeholder-image.jpg';

    try {
      const parsedImages = JSON.parse(images);
      if (Array.isArray(parsedImages) && parsedImages.length > 0 && parsedImages[0]) {
        return parsedImages[0];
      }
    } catch (error) {
      if (images.trim().startsWith('http') || images.trim().startsWith('/')) {
        return images.trim();
      }
    }
    return '/placeholder-image.jpg';
  };

  return (
    <AppLayout user={auth.user} wishlist={wishlist}>
      <Head title={store.name}>
        <meta name="description" content={`${store.name} store`} />
      </Head>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-amber-600">Home</Link>
            <FaChevronRight className="h-3 w-3 text-gray-400" />
            <Link href="/stores" className="text-gray-600 hover:text-amber-600">Stores</Link>
            <FaChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-900 font-medium">{store.name}</span>
          </nav>
        </div>
      </div>

      {/* Store Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Store Banner */}
          <div className="h-48 bg-gradient-to-r from-amber-500 to-orange-600 relative">
            {store.logo && (
              <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                  <img
                    src={`/storage/${store.logo}`}
                    alt={store.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Store Info */}
          <div className={`p-6 ${store.logo ? 'pt-16' : 'pt-6'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {store.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    <FaStore className="mr-1 h-3 w-3" />
                    {store.storetype}
                  </span>

                  {/* Store Rating from storeType */}
                  <div className="flex items-center gap-1">
                    {renderStars(parseFloat(store.rating as any) || 0)}
                    <span className="text-sm text-gray-600 ml-1">
                      ({parseInt(store.review_count as any) || 0} {parseInt(store.review_count as any) === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Store Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{products.length}</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{parseInt(store.review_count as any) || 0}</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
              </div>
            </div>

            {/* Store Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {store.address && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                  <span>{store.address}</span>
                </div>
              )}
              {store.mobile && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                  <span>{store.mobile}</span>
                </div>
              )}
              {store.email && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                  <span>{store.email}</span>
                </div>
              )}
              {store.license && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FaFileAlt className="h-5 w-5 text-gray-400" />
                  <span>License: {store.license}</span>
                </div>
              )}
              {store.national_id && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FaIdCard className="h-5 w-5 text-gray-400" />
                  <span>National ID: {store.national_id}</span>
                </div>
              )}
            </div>

            {/* Member Since */}
            <div className="mt-4 text-sm text-gray-500">
              Member since {new Date(store.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Store Features */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <FaTruck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-sm">Free Delivery</p>
            <p className="text-xs text-gray-500">On orders over ৳1000</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <FaUndo className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-sm">Easy Returns</p>
            <p className="text-xs text-gray-500">7 days return</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <FaShieldAlt className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-sm">Warranty</p>
            <p className="text-xs text-gray-500">1 year warranty</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <FaHeadset className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="font-medium text-sm">24/7 Support</p>
            <p className="text-xs text-gray-500">Live chat</p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FaFilter className="h-5 w-5" />
                Filters
              </h2>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === "all"
                        ? "bg-amber-50 text-amber-600 font-medium"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? "bg-amber-50 text-amber-600 font-medium"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Search and View Toggle */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products in this store..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg border ${
                      viewMode === 'grid'
                        ? 'bg-amber-50 border-amber-500 text-amber-600'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg border ${
                      viewMode === 'list'
                        ? 'bg-amber-50 border-amber-500 text-amber-600'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found
              </div>
            </div>

            {/* Products Display */}
            {filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {filteredProducts.map((product) => {
                  const imageSrc = getImageSrc(product.images);
                  const hasDiscount = product.sale_price && product.sale_price < product.regular_price;
                  const discountPercentage = hasDiscount
                    ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)
                    : 0;

                  if (viewMode === 'grid') {
                    return (
                      <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                        {/* Product Image Container with Quick View */}
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          <Link href={`/products/${product.slug}`}>
                            <img
                              src={`/storage/${imageSrc}`}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                              }}
                            />
                          </Link>

                          {/* Discount Badge */}
                          {hasDiscount && (
                            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                              -{discountPercentage}%
                            </span>
                          )}

                          {/* Wishlist Button */}
                          <div className="absolute top-3 right-3 z-10">
                            <WishlistButton productId={product.id.toString()} />
                          </div>

                          {/* Quick View Overlay - Your specific style */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="quick-view opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                              <Link href={`/products/${product.slug}`}>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 rounded-lg font-medium transition-colors shadow-lg">
                                  <FaEye className="w-4 h-4" />
                                  Quick View
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <Link href={`/products/${product.slug}`} className="block">
                            <h3 className="font-medium text-gray-900 mb-1 line-clamp-1 group-hover:text-amber-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-2">
                            {renderStars(product.calculatedRating)}
                            {product.reviewCount > 0 ? (
                              <span className="text-xs text-gray-500 ml-1">
                                ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 ml-1">(No reviews)</span>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-bold text-gray-900">
                                {formatPrice(product.sale_price || product.regular_price)}
                              </span>
                              {hasDiscount && (
                                <span className="ml-2 text-sm text-gray-400 line-through">
                                  {formatPrice(product.regular_price)}
                                </span>
                              )}
                            </div>
                          </div>

                          <AddtoCartButton product={product} />
                        </div>
                      </div>
                    );
                  } else {
                    // List View
                    return (
                      <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                        <div className="flex flex-col md:flex-row">
                          {/* Image Container with Quick View */}
                          <div className="md:w-1/4 relative overflow-hidden bg-gray-100">
                            <Link href={`/products/${product.slug}`}>
                              <div className="aspect-square md:h-full">
                                <img
                                  src={`/storage/${imageSrc}`}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                  }}
                                />
                              </div>
                            </Link>

                            {hasDiscount && (
                              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                                -{discountPercentage}%
                              </span>
                            )}

                            {/* Quick View Overlay for List View - Your specific style */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="quick-view opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                <Link href={`/products/${product.slug}`}>
                                  <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 rounded-lg font-medium transition-colors shadow-lg">
                                    <FaEye className="w-4 h-4" />
                                    Quick View
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="md:w-3/4 p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div>
                                <Link href={`/products/${product.slug}`}>
                                  <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                                    {product.name}
                                  </h3>
                                </Link>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                  {stripHtml(product.description)}
                                </p>
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="flex items-center">
                                    {renderStars(product.calculatedRating)}
                                    {product.reviewCount > 0 ? (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                                      </span>
                                    ) : (
                                      <span className="text-xs text-gray-400 ml-2">(No reviews)</span>
                                    )}
                                  </div>
                                  <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                  </span>
                                </div>
                              </div>

                              <div className="md:w-48">
                                <div className="mb-4">
                                  <div className="text-2xl font-bold text-gray-900">
                                    {formatPrice(product.sale_price || product.regular_price)}
                                  </div>
                                  {hasDiscount && (
                                    <div className="text-sm text-gray-400 line-through">
                                      {formatPrice(product.regular_price)}
                                    </div>
                                  )}
                                </div>
                                <AddtoCartButton product={product} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FaShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
