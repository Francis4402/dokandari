// TrendingProducts.tsx
import { useRef } from "react";
import { Link } from "@inertiajs/react";
import { FiZap } from "react-icons/fi";
import Eyebrow from "./Eyebrow";
import { Product } from "@/types";
import useRevealChildren from "@/Components/useRevealChildren";
import ProductCard from "@/Components/ProductCard";


interface TrendingProductsProps {
  trandingproduct: Product[];
}

const TrendingProducts = ({ trandingproduct }: TrendingProductsProps) => {
  const ref = useRevealChildren();

  // Parse products
  const parsedProducts: Product[] = (trandingproduct ?? []).map(item => ({
    ...item,
    rating: typeof item.rating === 'string' ? parseFloat(item.rating) : Number(item.rating) || 0,
  }));

  if (!parsedProducts.length) {
    return (
      <section className="py-20 bg-paper-dim" id="trending">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="text-center py-12">
            <FiZap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No trending products available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-paper-dim" id="trending">
      <div className="max-w-[1240px] mx-auto px-8">
        {/* Header */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-9">
          <div>
            <Eyebrow>Moving fast this week</Eyebrow>
            <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">Trending products</h2>
          </div>
          <Link
            href="/products"
            className="font-mono text-xs uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Products Horizontal Scroll */}
        <div ref={ref} className="no-scrollbar flex gap-5 overflow-x-auto pb-3.5 -mx-4 px-4 sm:mx-0 sm:px-0">
          {parsedProducts.map((product) => (
            <div key={product.id} className="min-w-[230px] sm:min-w-[250px] md:min-w-[270px] shrink-0">
              <ProductCard
                product={product}
                variant="trending"
                showQuickView={true}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
