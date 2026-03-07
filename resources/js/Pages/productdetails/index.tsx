
import { useState } from "react";
import {
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
  FaLeaf,
  FaMinus,
  FaPlus,
  FaHome
} from "react-icons/fa";
import { Product, storeType, Comments } from "@/types";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { toast } from "sonner";
import { useStore } from "../state/cartStore";
import CommentsList from "../dashboard/forms/CommentsList";
import FormatPrice from "../utils/FormatePrice";



interface ProductDetailsPageProps {
  product: Product;
  store: storeType;
  auth: {
    user: any
  };
  wishlist: any;
  comments?: Comments[];
  averageRating?: number;
  reviewCount?: number;
  userReview?: {
    id: string;
    comment: string | null;
    rating: number | null;
  } | null;
}

const ProductDetailsPage = ({
  product,
  store,
  auth,
  wishlist,
  comments = [],
  averageRating = 0,
  reviewCount = 0,
  userReview = null
}: ProductDetailsPageProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'specifications'>('description');


  const { addToCart, getItemById } = useStore();


  const cartItem = getItemById(product.id.toString());
  const currentCartQuantity = cartItem?.cartQty || 0;


  const productImages = (() => {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      return [product.images];
    }
    return ['/otherplaceholder.jpg'];
  })();

  const discount = (() => {
    if (!product.sale_price || !product.regular_price) return 0;
    const regular = Number(product.regular_price);
    const sale = Number(product.sale_price);
    if (isNaN(regular) || isNaN(sale) || regular <= 0 || sale >= regular) return 0;
    return Math.round(((regular - sale) / regular) * 100);
  })();


  const renderStars = (rating: number = averageRating) => {
    const numericRating = rating;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return <FaStar key={index} className="w-5 h-5 text-yellow-400 fill-current" />;
          } else if (index === fullStars && hasHalfStar) {
            return <FaStar key={index} className="w-5 h-5 text-yellow-400 opacity-50" />;
          } else {
            return <FaRegStar key={index} className="w-5 h-5 text-gray-300" />;
          }
        })}
      </div>
    );
  };


  const currentImage = productImages[selectedImageIndex] || '/placeholder-image.jpg';


  const handleAddToCart = (): void => {
    // Validate stock
    if (!product.inStock || product.quantity === 0) {
      toast.error('Product is out of stock');
      return;
    }


    if (currentCartQuantity + quantity > (product.quantity || 0)) {
      toast.error(`Only ${product.quantity} items available in stock`);
      return;
    }


    addToCart(product, store, quantity);
  };


  const incrementQuantity = (): void => {
    const maxAvailable = (product.quantity || 0) - currentCartQuantity;
    if (quantity < maxAvailable) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error(`Only ${maxAvailable} more items available`);
    }
  };


  const decrementQuantity = (): void => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };


  const maxAvailable = (product.quantity || 0) - currentCartQuantity;


  const totalReviews = reviewCount;


  const totalComments = comments.length;

  return (
    <AppLayout user={auth.user} wishlist={wishlist}>
      <Head title={product.name}>
        <meta name="description" content={product.description} />
        <meta name="keywords" content={`shop, products, buy online, shopping`} />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6 text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <FaHome className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                {product.category}
              </li>
              <li className="text-gray-400">/</li>
              <li className="flex items-center text-gray-900 font-medium truncate max-w-xs">
                <FaShoppingBag className="w-4 h-4 mr-2 text-gray-500" />
                {product.name}
              </li>
            </ol>
          </nav>

          {/* Main Product Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">

              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-xl bg-gray-50 aspect-square border border-gray-100">
                  <img
                    src={`/storage/${currentImage}`}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/otherplaceholder.jpg';
                    }}
                  />

                  {discount > 0 && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
                        -{discount}% OFF
                      </span>
                    </div>
                  )}


                  {currentCartQuantity > 0 && (
                    <div className="absolute bottom-4 right-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                        {currentCartQuantity} in cart
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {productImages.length > 1 && (
                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                    {productImages.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={`/storage/${image}`}
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
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                    <FaTag className="w-3 h-3 mr-1.5" />
                    {product.product_type}
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                    <FaLeaf className="w-3 h-3 mr-1.5" />
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-6">
                {/* Product Header */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {product.name}
                  </h1>

                  {/* Store Info */}
                  <div className="flex items-center flex-wrap gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <FaStore className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <Link
                          href={`/store/${store.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {store.name}
                        </Link>
                        <p className="text-sm text-gray-500">{store.storetype} Store</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm bg-gray-100 px-3 py-1.5 rounded-full">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="font-medium text-gray-700">{store.rating}</span>
                      <span className="text-gray-400 mx-1">•</span>
                      <span className="text-gray-600">{store.review_count} reviews</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2">
                      {renderStars()}
                      <span className="text-2xl font-bold text-gray-900">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      ({totalReviews} rating{totalReviews !== 1 ? 's' : ''} • {totalComments} comment{totalComments !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                  <div className="flex items-baseline space-x-4 mb-2">
                    <span className="text-4xl font-bold text-blue-600">
                      <FormatPrice price={product.sale_price || product.regular_price} />
                    </span>

                    {product.sale_price && (
                      <span className="text-2xl text-gray-400 line-through">
                        <FormatPrice price={product.regular_price} />
                      </span>
                    )}
                  </div>

                  {discount > 0 && (
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-sm font-medium">
                      <FaTag className="w-4 h-4 mr-1.5" />
                      Save <FormatPrice price={product.regular_price - product.sale_price} /> ({discount}% OFF)
                    </div>
                  )}
                </div>

                {/* Stock Status & Quantity */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 font-medium">Availability:</span>
                      {product.inStock && product.quantity > 0 ? (
                        <span className="flex items-center text-green-600 font-semibold">
                          <FaCheck className="w-4 h-4 mr-1.5" />
                          In Stock
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">Out of Stock</span>
                      )}
                    </div>
                    {product.inStock && product.quantity > 0 && (
                      <span className="text-sm text-gray-600">
                        {product.quantity} units available
                      </span>
                    )}
                  </div>

                  {product.inStock && product.quantity > 0 && maxAvailable > 0 && (
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-700 font-medium min-w-[80px]">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-r border-gray-300"
                        >
                          <FaMinus className="w-4 h-4" />
                        </button>
                        <span className="px-6 py-2.5 text-lg font-medium w-16 text-center bg-white">
                          {quantity}
                        </span>
                        <button
                          onClick={incrementQuantity}
                          disabled={quantity >= maxAvailable}
                          className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-l border-gray-300"
                        >
                          <FaPlus className="w-4 h-4" />
                        </button>
                      </div>
                      {maxAvailable > 0 && (
                        <span className="text-sm text-gray-500">
                          {maxAvailable} available
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || product.quantity === 0 || maxAvailable === 0}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center shadow-lg shadow-blue-200"
                  >
                    <FaShoppingCart className="w-5 h-5 mr-2" />
                    {currentCartQuantity > 0 ? 'Add More to Cart' : 'Add to Cart'}
                  </button>

                  <button className="w-full py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center shadow-lg shadow-gray-200">
                    <FaShoppingBag className="w-5 h-5 mr-2" />
                    Buy Now
                  </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-gray-200">
                  <div className="flex flex-col items-center text-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <FaTruck className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="text-sm font-medium text-gray-700">Free Delivery</p>
                    <p className="text-xs text-gray-500">On orders over ৳1000</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                    <FaUndo className="w-6 h-6 text-green-600 mb-2" />
                    <p className="text-sm font-medium text-gray-700">Easy Returns</p>
                    <p className="text-xs text-gray-500">7 days return</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                    <FaShieldAlt className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="text-sm font-medium text-gray-700">Warranty</p>
                    <p className="text-xs text-gray-500">1 year warranty</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                    <FaHeadset className="w-6 h-6 text-orange-600 mb-2" />
                    <p className="text-sm font-medium text-gray-700">24/7 Support</p>
                    <p className="text-xs text-gray-500">Live chat</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="border-t border-gray-200">
              <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'description'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Description
                  {activeTab === 'description' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('specifications')}
                  className={`px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'specifications'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Specifications
                  {activeTab === 'specifications' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                  )}
                </button>
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${
                        activeTab === 'reviews'
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    >
                    Reviews ({comments.length})
                    {activeTab === 'reviews' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                    )}
                </button>
              </div>

              <div className="p-6 lg:p-8">
                {/* Description Tab */}
                {activeTab === 'description' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h3>
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {product.description || 'No description available.'}
                    </div>
                  </div>
                )}

                {/* Specifications Tab */}
                {activeTab === 'specifications' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Product Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-6 rounded-xl">
                          <h4 className="font-bold text-gray-900 mb-4 text-lg">Product Details</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between pb-2 border-b border-gray-200">
                              <span className="text-gray-600">Product Name</span>
                              <span className="font-medium text-gray-900">{product.name}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-gray-200">
                              <span className="text-gray-600">Category</span>
                              <span className="font-medium text-gray-900">{product.category}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-gray-200">
                              <span className="text-gray-600">Type</span>
                              <span className="font-medium text-gray-900">{product.product_type}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-gray-200">
                              <span className="text-gray-600">Stock Status</span>
                              <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                {product.inStock ? `${product.quantity} available` : 'Out of stock'}
                              </span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-gray-200">
                              <span className="text-gray-600">Regular Price</span>
                              <span className="font-medium text-gray-900"><FormatPrice price={product.regular_price} /></span>
                            </div>
                            {product.sale_price && (
                              <div className="flex justify-between pb-2 border-b border-gray-200">
                                <span className="text-gray-600">Sale Price</span>
                                <span className="font-medium text-green-600"><FormatPrice price={product.sale_price} /></span>
                              </div>
                            )}
                            {product.item_weight && (
                              <div className="flex justify-between pb-2 border-b border-gray-200">
                                <span className="text-gray-600">Weight</span>
                                <span className="font-medium text-gray-900">{product.item_weight} kg</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gray-50 p-6 rounded-xl">
                          <h4 className="font-bold text-gray-900 mb-4 text-lg">Store Information</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between pb-2 border-b border-gray-200">
                              <span className="text-gray-600">Store Name</span>
                              <span className="font-medium text-gray-900">{store.name}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-gray-200">
                              <span className="text-gray-600">Store Type</span>
                              <span className="font-medium text-gray-900">{store.storetype}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-gray-200">
                              <span className="text-gray-600">Rating</span>
                              <span className="font-medium text-gray-900">⭐ {store.rating}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-gray-200">
                              <span className="text-gray-600">Total Reviews</span>
                              <span className="font-medium text-gray-900">{store.review_count}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-gray-200">
                              <span className="text-gray-600">Contact</span>
                              <span className="font-medium text-gray-900">{store.mobile}</span>
                            </div>
                            <div className="flex justify-between pb-2">
                              <span className="text-gray-600">Address</span>
                              <span className="font-medium text-gray-900 text-right">{store.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab - Now includes CommentsList with ratings */}
                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    {/* Rating Summary */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                          {renderStars()}
                          <span className="text-3xl font-bold text-gray-900">
                            {averageRating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-6">
                          Based on {totalReviews} rating{totalReviews !== 1 ? 's' : ''} and {totalComments} comment{totalComments !== 1 ? 's' : ''}
                        </p>

                        {/* Rating Distribution */}
                        {totalReviews > 0 && (
                          <div className="max-w-md mx-auto mb-6 text-left">
                            {[5, 4, 3, 2, 1].map((star) => {
                              const count = comments.filter(c => c.rating === star).length;
                              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                              return (
                                <div key={star} className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium w-8">{star} ★</span>
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-yellow-400 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-600 w-12">{count}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {auth.user ? (
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-3">
                              {userReview ? 'You have already reviewed this product' : 'Share your experience with this product'}
                            </p>
                          </div>
                        ) : (
                          <Link
                            href="/login"
                            className="inline-block px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                          >
                            Login to Write a Review
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Comments Section with Ratings */}
                    <div className="border-t border-gray-200 pt-8">
                      <CommentsList
                        comments={comments}
                        productId={product.id.toString()}
                        authUser={auth.user}
                        isAuthenticated={!!auth.user}
                        userReview={userReview}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Store Info Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Store</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <FaStore className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                    <p className="text-gray-600">{store.storetype} Store</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">📍 Address:</span><br />
                      {store.address}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">📞 Contact:</span><br />
                      {store.mobile}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">⭐ Rating:</span><br />
                      {store.rating} out of 5 ({store.review_count} reviews)
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">📧 Email:</span><br />
                      {store.email || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <Link
                  href={`/store/${store.id}`}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-blue-200"
                >
                  Visit Store
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .comment-enter {
          animation: slideIn 0.3s ease-out;
        }
        textarea::-webkit-scrollbar {
          width: 8px;
        }
        textarea::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        textarea::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </AppLayout>
  );
};

export default ProductDetailsPage;
