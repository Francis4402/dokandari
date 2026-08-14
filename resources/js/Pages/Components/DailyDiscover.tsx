import { Product, ReviewType } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "@inertiajs/react";
import Eyebrow from "./Eyebrow";
import ProductCard from "@/Components/ProductCard";

interface DailyDiscoverProduct {
  discoverProduct: (Product & {
    reviews_count?: number;
    rating?: number;
  })[];
  user: any;
  reviews: ReviewType[];
}

const DailyDiscover = ({ discoverProduct, user, reviews }: DailyDiscoverProduct) => {
  const [reviewCounts, setReviewCounts] = useState<Record<string, number>>({});
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

  // counts come from the `reviews` bulk prop already loaded with the page —
  // no need for a per-product network round trip just to show a number
  useEffect(() => {
    const counts: Record<string, number> = {};
    discoverProduct.forEach((product) => {
      counts[product.id] = 0;
    });
    reviews.forEach((review) => {
      if (review.product_id && counts.hasOwnProperty(review.product_id)) {
        counts[review.product_id] = (counts[review.product_id] || 0) + 1;
      }
    });
    setReviewCounts(counts);
  }, [discoverProduct, reviews]);

  if (!discoverProduct || discoverProduct.length === 0) return null;

  return (
    <section id="daily-discover" ref={scope}>
      <div>
        {/* Header */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-9">
          <div>
            <Eyebrow>Discover new favorites</Eyebrow>
            <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">Daily Discover</h2>
            <p className="text-[#6B6A66] text-sm mt-2 max-w-2xl">
              Explore products our customers are loving today
            </p>
          </div>
          <Link
            href="/products"
            className="font-mono text-xs uppercase tracking-wide border-b-2 border-[#111013] pb-0.5 hover:border-[#FF5A1F] transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {discoverProduct.map((product) => (
            <div key={product.id} className="discover-card">
              <ProductCard
                product={product}
                variant="default"
                showQuickView={true}
                user={user}
                reviewCount={reviewCounts[product.id] || 0}
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-[#FF5A1F] text-white rounded-lg font-medium transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            View All Products
            <FaArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-sm text-[#6B6A66] mt-4">
            Showing {discoverProduct.length} daily discover products
          </p>
        </div>
      </div>
    </section>
  );
};

export default DailyDiscover;
