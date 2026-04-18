import { Product, ReviewType } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { FaEye, FaArrowRight } from "react-icons/fa";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { RiFireFill } from "react-icons/ri";
import AddtoCartButton from "../buttons/AddtoCartButton";
import { Link, router } from "@inertiajs/react";
import WishlistButton from "../buttons/WishlistButton";
import FormatPrice from "../utils/FormatePrice";
import axios from 'axios';

interface DailyDiscoverProduct {
  discoverProduct: (Product & {
    reviews_count?: number;
    rating?: number;
  })[];
  auth: {
    user: any;
  };
  reviews: ReviewType[];
}

const DailyDiscover = ({ discoverProduct, auth, reviews }: DailyDiscoverProduct) => {
  const [reviewCounts, setReviewCounts] = useState<Record<string, number>>({});
  const [userReviews, setUserReviews] = useState<Record<string, boolean>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const cards = cardsRef.current.filter(Boolean);
    gsap.fromTo(cards,
      { opacity: 0, y: 80, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: { each: 0.08, from: "start" },
        duration: 0.6,
        ease: "back.out(1.4)"
      }
    );
  }, [discoverProduct]);

  useEffect(() => {

    const counts: Record<string, number> = {};


    discoverProduct.forEach(product => {
      counts[product.id] = 0;
    });


    reviews.forEach(review => {
      if (review.product_id && counts.hasOwnProperty(review.product_id)) {
        counts[review.product_id] = (counts[review.product_id] || 0) + 1;
      }
    });

    setReviewCounts(counts);

    if (auth?.user) {
      fetchUserReviewsStatus();
    }
  }, [discoverProduct, reviews, auth?.user]);

  const fetchUserReviewsStatus = async () => {
    try {
      const promises = discoverProduct.map(product =>
        axios.get(`/products/${product.id}/reviews`).then(res => ({
          productId: product.id,
          userReviewed: res.data.user_reviewed
        }))
      );
      const results = await Promise.all(promises);
      const userReviewStatus: Record<string, boolean> = {};
      results.forEach(result => {
        userReviewStatus[result.productId] = result.userReviewed;
      });
      setUserReviews(userReviewStatus);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    }
  };

  const calculateDiscount = (regularPrice: number, salePrice: number) => {
    const regular = regularPrice;
    const sale = salePrice;
    if (isNaN(regular) || isNaN(sale) || regular <= 0 || sale >= regular) return 0;
    return Math.round(((regular - sale) / regular) * 100);
  };

  const handleCardEnter = (index: number): void => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, { y: -8, scale: 1.02, duration: 0.3, ease: "power2.out" });

    const img = card.querySelector('img');
    if (img) gsap.to(img, { scale: 1.1, duration: 0.4, ease: "back.out(1.4)" });

    const quickView = card.querySelector('.quick-view');
    if (quickView) gsap.to(quickView, { opacity: 1, y: 0, duration: 0.3 });
  };

  const handleCardLeave = (index: number): void => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });

    const img = card.querySelector('img');
    if (img) gsap.to(img, { scale: 1, duration: 0.3, ease: "power2.out" });

    const quickView = card.querySelector('.quick-view');
    if (quickView) gsap.to(quickView, { opacity: 0, y: 10, duration: 0.2 });
  };

  const handleReviewClick = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (userReviews[productId] || loadingStates[productId]) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, [productId]: true }));

    try {
      const response = await axios.post('/reviews', { product_id: productId });

      if (response.data.success) {
        // Update review count
        setReviewCounts(prev => ({
          ...prev,
          [productId]: response.data.count
        }));

        // Update user review status
        setUserReviews(prev => ({
          ...prev,
          [productId]: true
        }));

        // Animate the review count
        const card = cardsRef.current[discoverProduct.findIndex(p => p.id === productId)];
        if (card) {
          const reviewElement = card.querySelector('.review-count');
          if (reviewElement) {
            gsap.to(reviewElement, {
              scale: 1.2,
              duration: 0.2,
              yoyo: true,
              repeat: 1
            });
          }
        }
      }
    } catch (error: any) {
      console.error('Error adding review:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleQuickViewClick = async (e: React.MouseEvent, slug: string, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setLoadingStates(prev => ({ ...prev, [`quickview_${productId}`]: true }));

    try {
      await axios.post('/reviews', { product_id: productId });
    } catch (error) {
      console.error('Error storing quick view:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`quickview_${productId}`]: false }));
    }

    router.visit(`/products/${slug}`);
  };

  const renderStars = (rating: number | undefined): JSX.Element => {
    const numericRating = rating || 0;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) return <BsStarFill key={i} className="text-amber-400 text-xs" />;
          if (i === fullStars && hasHalfStar) return <BsStarHalf key={i} className="text-amber-400 text-xs" />;
          return <BsStar key={i} className="text-gray-300 text-xs" />;
        })}
      </div>
    );
  };

  const getImageSrc = (images: string) => {
    if (!images) return '/otherplaceholder.jpg';
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
    return '/otherplaceholder.jpg';
  };

  if (!discoverProduct || discoverProduct.length === 0) return null;

  return (
    <div className="mt-16 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
          Daily Discover
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore the products our customers are loving today. Click the star to add your review!
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto mt-6" />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {discoverProduct.map((product, index) => {
          if (!product) return null;

          const discount = calculateDiscount(product.regular_price, product.sale_price || 0);
          const hasDiscount = discount > 0;
          const currentStock = product.quantity || 0;
          const imageSrc = getImageSrc(product.images);
          const regularPriceNum = product.regular_price || 0;
          const salePriceNum = product.sale_price || 0;
          const saveAmount = hasDiscount ? regularPriceNum - salePriceNum : 0;
          const productRating = product.rating || 0;
          const reviewCount = reviewCounts[product.id] || 0;
          const isReviewed = userReviews[product.id] || false;
          const isLoading = loadingStates[product.id] || false;
          const isQuickViewLoading = loadingStates[`quickview_${product.id}`] || false;

          return (
            <div
              key={product.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="relative transform opacity-0 cursor-pointer h-full flex flex-col"
              onMouseEnter={() => handleCardEnter(index)}
              onMouseLeave={() => handleCardLeave(index)}
            >
              <div className="overflow-hidden border border-gray-200 rounded-xl hover:border-blue-400 transition-all duration-300 group bg-white shadow-sm hover:shadow-xl flex flex-col h-full">
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                  <div className="aspect-square p-6">
                    <img
                      src={`/storage/${imageSrc}`}
                      alt={product.name || 'Product image'}
                      className="w-full h-full object-contain transition-transform duration-300"
                      draggable="false"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/otherplaceholder.jpg';
                      }}
                    />
                  </div>

                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        <RiFireFill className="text-xs" />
                        -{discount}%
                      </span>
                    </div>
                  )}

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="quick-view opacity-0 translate-y-4 transition-all duration-300">
                      <button
                        onClick={(e) => handleQuickViewClick(e, product.slug, product.id)}
                        disabled={isQuickViewLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 rounded-lg font-medium transition-colors shadow-lg disabled:opacity-60"
                      >
                        {isQuickViewLoading ? (
                          <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FaEye className="w-4 h-4" />
                        )}
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Wishlist Button */}
                  <div className="absolute top-3 right-3">
                    <WishlistButton productId={product.id} />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex-grow flex flex-col">
                  <div className="flex-shrink-0 mb-3">
                    <div className="mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        {product.category || 'Uncategorized'}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold leading-tight text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[48px]">
                      {product.name || 'Unnamed Product'}
                    </h3>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="mb-3 flex-shrink-0">
                    <div className="flex items-center mb-2">
                      {renderStars(productRating)}
                      <span className="text-xs text-gray-500 ml-1">
                        ({productRating.toFixed(1)})
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleReviewClick(e, product.id)}
                      disabled={isLoading || isReviewed}
                      className={`flex items-center gap-2 transition-all duration-300 ${
                        isReviewed
                          ? 'text-blue-600 cursor-not-allowed opacity-60'
                          : 'text-gray-600 hover:text-blue-600 hover:scale-105 cursor-pointer'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex">
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : isReviewed ? (
                          <BsStarFill className="text-blue-600 text-sm" />
                        ) : (
                          <BsStar className="text-sm" />
                        )}
                      </div>
                      <span className="review-count text-sm font-medium">
                        {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
                      </span>
                      {!auth?.user && !isReviewed && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          Guest
                        </span>
                      )}
                      {isReviewed && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Reviewed
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Stock */}
                  <div className="mb-4 flex-shrink-0">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-semibold ${
                        currentStock > 10
                          ? 'text-green-600'
                          : currentStock > 0
                            ? 'text-orange-600'
                            : 'text-red-600'
                      }`}>
                        {currentStock > 0 ? `${currentStock} available` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  {/* Price + Cart */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          <FormatPrice price={product.sale_price || product.regular_price} />
                        </span>
                        {product.sale_price && product.sale_price < product.regular_price && (
                          <span className="text-sm text-gray-400 line-through">
                            <FormatPrice price={product.regular_price} />
                          </span>
                        )}
                      </div>
                      {saveAmount > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Save <FormatPrice price={saveAmount} />
                        </span>
                      )}
                    </div>
                    <AddtoCartButton product={product} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All */}
      <div className="text-center mt-12">
        <Link href="/products">
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-300 hover:shadow-lg">
            View All Products
            <FaArrowRight className="w-4 h-4" />
          </button>
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          Showing {discoverProduct.length} daily discover products
        </p>
      </div>
    </div>
  );
};

export default DailyDiscover;
