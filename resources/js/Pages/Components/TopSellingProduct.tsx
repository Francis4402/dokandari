
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "@inertiajs/react";
import { FaHeart, FaRegHeart, FaEye } from "react-icons/fa";
import Eyebrow from "./Eyebrow";
import AddtoCartButton from "../buttons/AddtoCartButton";
import FormatPrice from "../utils/FormatePrice";
import { Product } from "@/types";
import WishlistButton from "../buttons/WishlistButton";

gsap.registerPlugin(ScrollTrigger);

interface TopSellingProductProps {
  products: Product[];
}

const TopSellingProduct = ({ products }: TopSellingProductProps) => {
  const scope = useRef<HTMLElement>(null);

  const topProducts = products.slice(0, 5);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray(".board-row");
      gsap.set(rows, { opacity: 0, y: 24 });
      gsap.to(rows, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: scope.current, start: "top 85%", once: true },
      });

      gsap.utils.toArray<HTMLElement>(".bar-fill").forEach((barElement) => {
        const target = barElement.getAttribute("data-pct");
        if (target) {
          gsap.fromTo(
            barElement,
            { width: "0%" },
            {
              width: `${target}%`,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: scope.current, start: "top 85%", once: true },
            }
          );
        }
      });
    },
    { scope }
  );

  const getImageSrc = (images: string) => {
    if (!images) return '/placeholder.jpg';

    try {
      const parsedImages = JSON.parse(images);
      if (Array.isArray(parsedImages) && parsedImages.length > 0 && parsedImages[0]) {
        return parsedImages[0];
      }
    } catch {
      if (images.trim().startsWith('http') || images.trim().startsWith('/')) {
        return images.trim();
      }
    }
    return '/placeholder.jpg';
  };


  const maxSold = Math.max(...topProducts.map(p => p.quantity || 0), 1);


  const formatRank = (index: number) => {
    return String(index + 1).padStart(2, '0');
  };

  return (
    <section className="py-12 sm:py-16 md:py-20" id="topselling" ref={scope}>
      <div className="px-4 sm:px-6 md:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-9">
          <div>
            <Eyebrow>Ranked by units sold, this month</Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-[30px] lg:text-[36px] xl:text-[44px] font-bold">
              Top Selling Products
            </h2>
          </div>
          <Link
            href="/products"
            className="font-mono text-xs uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold transition-colors whitespace-nowrap"
          >
            Full leaderboard →
          </Link>
        </div>

        {/* Leaderboard */}
        <div className="border-t border-line overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="min-w-[500px] sm:min-w-0">
            {topProducts.map((product, index) => {
              const rank = formatRank(index);
              const isFirst = index === 0;
              const imageSrc = getImageSrc(product.images);
              const soldCount = product.quantity || 0;
              const percentage = Math.round((soldCount / maxSold) * 100);
              const displayPrice = product.sale_price || product.regular_price;
              const discount = product.sale_price && product.sale_price < product.regular_price
                ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="board-row group grid grid-cols-7 items-center gap-2  md:py-5 border-b border-line transition-colors duration-200 hover:bg-marigold/[0.04]"
                >
                  {/* Rank */}
                  <div
                    className={`font-display font-black text-xl sm:text-2xl md:text-[30px] lg:text-[36px] ${
                      isFirst ? "text-marigold" : "text-paper-dim"
                    }`}
                    style={!isFirst ? { WebkitTextStroke: "1.5px #111013" } : undefined}
                  >
                    {rank}
                  </div>

                  {/* Product Image */}
                  <div className="relative flex-shrink-0">
                    <div className="rounded w-9 h-9 sm:w-11 sm:h-11 md:w-[52px] md:h-[52px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        src={`/storage/${imageSrc}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                    {discount > 0 && (
                      <div className="absolute -top-1 -right-1 hidden sm:block">
                        <span className="inline-flex items-center px-1 py-0.5 rounded-full text-[8px] font-bold bg-red-500 text-white">
                          -{discount}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="min-w-0">
                    <div className="font-semibold text-xs sm:text-sm md:text-[14.5px] mb-0.5 flex items-center gap-1 sm:gap-2">
                      <span className="truncate">{product.name}</span>
                      {isFirst && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold bg-marigold text-white whitespace-nowrap flex-shrink-0">
                          #1
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[8px] sm:text-[9px] md:text-[10.5px] text-text-soft uppercase flex flex-wrap items-center gap-1 sm:gap-2">
                      <span className="truncate">{product.category}</span>
                      <span className="text-[9px] sm:text-[10px] md:text-xs whitespace-nowrap">
                        <FormatPrice price={displayPrice} />
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar - Tablet/Desktop */}
                  <div className="]">
                    <div
                      className=""
                      data-pct={percentage}
                    />
                  </div>

                  {/* Sold Count & Actions - Desktop */}
                  <div className="flex">
                    <div className="inline-flex gap-2 text-xs">
                      <strong className="font-display block text-xl text-ink">{soldCount}</strong>
                      sold this month
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 ml-2">
                      <WishlistButton productId={product.id} />
                      <Link
                        href={`/products/${product.slug}`}
                        className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <FaEye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-marigold" />
                      </Link>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <AddtoCartButton product={product} />
                      </div>
                    </div>
                  </div>

                  {/* Mobile View - Sold & Actions */}
                  <div className="flex md:hidden items-center gap-1">
                    <span className="text-[10px] font-mono text-text-soft whitespace-nowrap">
                      <strong className="text-ink">{soldCount}</strong> sold
                    </span>
                    <WishlistButton productId={product.id} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden">
          <Link
            href="/products"
            className="w-full block text-center py-3 px-4 bg-gray-900 hover:bg-marigold text-white text-sm font-medium rounded-lg transition-colors"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopSellingProduct;
