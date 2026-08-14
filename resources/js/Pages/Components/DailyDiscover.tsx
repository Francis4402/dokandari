// DailyDiscover.tsx
import { Product, ReviewType } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { Link } from "@inertiajs/react";
import axios from 'axios';
import Eyebrow from "./Eyebrow";
import ProductCard from "@/Components/ProductCard";
import FormatPrice from "../utils/FormatePrice";

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
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".discover-card");
      gsap.set(cards, { opacity: 0, y: 40 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: scope.current, start: "top 85%", once: true },
      });
    },
    { scope }
  );

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
        setReviewCounts(prev => ({
          ...prev,
          [productId]: response.data.count
        }));
        setUserReviews(prev => ({
          ...prev,
          [productId]: true
        }));
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

  if (!discoverProduct || discoverProduct.length === 0) return null;

  return (
    <section className="" id="daily-discover" ref={scope}>
      <div>
        {/* Header */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-9">
          <div>
            <Eyebrow>Discover new favorites</Eyebrow>
            <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">Daily Discover</h2>
            <p className="text-text-soft text-sm mt-2 max-w-2xl">
              Explore products our customers are loving today
            </p>
          </div>
          <Link
            href="/products"
            className="font-mono text-xs uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Products Grid with ProductCard */}
        <div className="grid md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {discoverProduct.map((product) => {
            const reviewCount = reviewCounts[product.id] || 0;
            const isReviewed = userReviews[product.id] || false;
            const isLoading = loadingStates[product.id] || false;
            const productRating = product.rating || 0;

            return (
              <div key={product.id} className="discover-card relative">
                {/* Product Card */}
                <ProductCard
                  product={product}
                  variant="default"
                  showQuickView={true}
                />

                {/* Review Button - Bottom Right of card */}
                <div className="absolute bottom-3 right-3 z-30">
                  <button
                    onClick={(e) => handleReviewClick(e, product.id)}
                    disabled={isLoading || isReviewed}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 shadow-lg ${
                      isReviewed
                        ? 'bg-blue-500 text-white cursor-not-allowed'
                        : isLoading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-white/90 hover:bg-blue-500 text-gray-700 hover:text-white backdrop-blur-sm'
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isReviewed ? (
                      <BsStarFill className="text-xs" />
                    ) : (
                      <BsStar className="text-xs" />
                    )}
                    <span>{reviewCount}</span>
                  </button>
                </div>

                {/* Review Status Badge - Below review button */}
                <div className="absolute bottom-14 right-3 z-30">
                  {!auth?.user && !isReviewed && (
                    <span className="text-[10px] bg-gray-800/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm whitespace-nowrap">
                      Sign in to review
                    </span>
                  )}
                  {isReviewed && (
                    <span className="text-[10px] bg-blue-500/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1 whitespace-nowrap">
                      <BsStarFill className="text-[8px]" />
                      Reviewed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-marigold text-white rounded-lg font-medium transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            View All Products
            <FaArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-sm text-text-soft mt-4">
            Showing {discoverProduct.length} daily discover products
          </p>
        </div>
      </div>
    </section>
  );
};

export default DailyDiscover;
