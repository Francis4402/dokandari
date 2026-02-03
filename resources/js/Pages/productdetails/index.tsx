import { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaRegStar,
  FaTruck,
  FaShieldAlt,
  FaStore,
  FaShoppingCart,
  FaCheck,
  FaTag,
  FaShoppingBag,
  FaUndo,
  FaHeadset,
  FaLeaf
} from "react-icons/fa";
import { Product, storeType } from "@/types";
import AddtoCartButton from "../buttons/AddtoCartButton";
import AppLayout from "@/Layouts/AppLayout";

interface ProductDetailsPageProps {
  product: Product;
  store: storeType;
  auth: {
    user: any;
  }
}

const ProductDetailsPage = ({ product, store, auth }: ProductDetailsPageProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'specifications'>('description');

  // Parse images from JSON string
  const productImages = (() => {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // If not valid JSON, treat as single image string
      return [product.images];
    }
    return ['/placeholder-image.jpg'];
  })();

  // Calculate discount if sale price exists
  const discount = (() => {
    if (!product.sale_price || !product.regular_price) return 0;
    const regular = parseFloat(product.regular_price);
    const sale = parseFloat(product.sale_price);
    if (isNaN(regular) || isNaN(sale) || regular <= 0 || sale >= regular) return 0;
    return Math.round(((regular - sale) / regular) * 100);
  })();

  // Format price function
  const formatPrice = (price: string): string => {
    if (!price) return '৳0';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return '৳0';
    return `৳${numPrice.toLocaleString('en-BD')}`;
  };

  // Safely convert rating to number and render stars
  const renderStars = () => {
    // Convert rating to number safely
    const ratingNum = typeof product.rating === 'string'
      ? parseFloat(product.rating)
      : Number(product.rating);

    const numericRating = isNaN(ratingNum) ? 0 : Math.max(0, Math.min(5, ratingNum));
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return <FaStar key={index} className="w-5 h-5 text-yellow-400" />;
          } else if (index === fullStars && hasHalfStar) {
            return <FaStar key={index} className="w-5 h-5 text-yellow-400 opacity-70" />;
          } else {
            return <FaRegStar key={index} className="w-5 h-5 text-gray-300" />;
          }
        })}
      </div>
    );
  };

  // Get rating as number for display
  const getRatingNumber = () => {
    const ratingNum = typeof product.rating === 'string'
      ? parseFloat(product.rating)
      : Number(product.rating);
    return isNaN(ratingNum) ? 0 : ratingNum;
  };

  // Get current image
  const currentImage = productImages[selectedImageIndex] || '/placeholder-image.jpg';

  // Get review count as number
  const reviewCount = typeof product.review_count === 'string'
    ? parseInt(product.review_count) || 0
    : Number(product.review_count) || 0;

  return (
    <AppLayout user={auth.user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Breadcrumb */}
        <nav className="flex mb-6 mt-10 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/" className="flex items-center text-gray-700 hover:text-blue-600">
                <FaShoppingBag className="w-4 h-4 mr-2" />
                Home
              </a>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
                <img
                  src={`/product_images/${currentImage}`}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.jpg';
                  }}
                />

                {discount > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white">
                      -{discount}% OFF
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50"
                >
                  {isWishlisted ? (
                    <FaHeart className="w-6 h-6 text-red-500" />
                  ) : (
                    <FaRegHeart className="w-6 h-6 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={`/product_images/${image}`}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Product Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                  <FaTag className="w-3 h-3 mr-1" />
                  {product.product_type}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                  <FaLeaf className="w-3 h-3 mr-1" />
                  {product.category}
                </span>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Store Info */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <FaStore className="w-5 h-5 text-gray-500" />
                    <a href={`/store/${store.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                      {store.name}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mx-2">•</span>
                    <span>⭐ {store.rating}</span>
                    <span className="mx-2">•</span>
                    <span>{store.review_count} reviews</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    {renderStars()}
                    <span className="text-2xl font-bold text-gray-900">
                      {getRatingNumber().toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    ({reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-baseline space-x-4 mb-3">
                  <span className="text-4xl font-bold text-blue-600">
                    {formatPrice(product.sale_price || product.regular_price)}
                  </span>

                  {product.sale_price && (
                    <span className="text-2xl text-gray-500 line-through">
                      {formatPrice(product.regular_price)}
                    </span>
                  )}
                </div>

                {discount > 0 && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                    <FaTag className="w-4 h-4 mr-1" />
                    {discount}% discount applied
                  </div>
                )}
              </div>

              {/* Stock & Quantity */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 font-medium">Availability:</span>
                    {product.inStock ? (
                      <span className="flex items-center text-green-600 font-semibold">
                        <FaCheck className="w-4 h-4 mr-1" />
                        In Stock ({product.quantity} available)
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">Out of Stock</span>
                    )}
                  </div>
                </div>

                {product.inStock && product.quantity > 0 && (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-medium">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <span className="px-6 py-2 text-lg font-medium w-16 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                        disabled={quantity >= product.quantity}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AddtoCartButton product={product} />
                <button className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-medium transition-colors flex items-center justify-center">
                  <FaShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg">
                  <FaTruck className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="font-medium">Free Delivery</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-green-50 rounded-lg">
                  <FaUndo className="w-6 h-6 text-green-600 mb-2" />
                  <p className="font-medium">Easy Returns</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-purple-50 rounded-lg">
                  <FaShieldAlt className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="font-medium">Warranty</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-orange-50 rounded-lg">
                  <FaHeadset className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="font-medium">Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'description'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'specifications'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'reviews'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews ({reviewCount})
              </button>
            </div>

            <div className="p-8">
              {/* Description Tab */}
              {activeTab === 'description' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
                  <div className="text-gray-700 whitespace-pre-line">
                    {product.description}
                  </div>
                </div>
              )}

              {/* Specifications Tab */}
              {activeTab === 'specifications' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-2">Product Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name</span>
                            <span className="font-medium">{product.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Category</span>
                            <span className="font-medium">{product.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type</span>
                            <span className="font-medium">{product.product_type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Stock</span>
                            <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                              {product.inStock ? `${product.quantity} available` : 'Out of stock'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Regular Price</span>
                            <span className="font-medium">{formatPrice(product.regular_price)}</span>
                          </div>
                          {product.sale_price && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Sale Price</span>
                              <span className="font-medium text-green-600">{formatPrice(product.sale_price)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-2">Store Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Store Name</span>
                            <span className="font-medium">{store.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Store Type</span>
                            <span className="font-medium">{store.storetype}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rating</span>
                            <span className="font-medium">⭐ {store.rating}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Reviews</span>
                            <span className="font-medium">{store.review_count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Contact</span>
                            <span className="font-medium">{store.mobile}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Address</span>
                            <span className="font-medium">{store.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      {renderStars()}
                      <span className="text-3xl font-bold text-gray-900">
                        {getRatingNumber().toFixed(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                    </p>
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                      Write a Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Store Info */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <FaStore className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                  <p className="text-gray-600">{store.storetype} Store</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Address:</span> {store.address}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Contact:</span> {store.mobile}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Rating:</span> ⭐ {store.rating} ({store.review_count} reviews)
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                Visit Store
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProductDetailsPage;
