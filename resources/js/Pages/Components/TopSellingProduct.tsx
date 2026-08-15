// TopSellingProduct.tsx
import { useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "@inertiajs/react";
import { FaEye } from "react-icons/fa";
import Eyebrow from "./Eyebrow";
import AddtoCartButton from "../buttons/AddtoCartButton";
import FormatPrice from "../utils/FormatePrice";
import { Product } from "@/types";
import WishlistButton from "../buttons/WishlistButton";

gsap.registerPlugin(ScrollTrigger);

interface TopSellingProductProps {
  products: Product[];
  user: any;
}

function getImageSrc(images: string): string {
  if (!images) return "/placeholder.jpg";

  let raw: string | null = null;
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed) && parsed[0]) raw = parsed[0];
  } catch {
    const trimmed = images.trim();
    if (trimmed.startsWith("http") || trimmed.startsWith("/")) raw = trimmed;
  }

  if (!raw) return "/placeholder.jpg";
  return raw.startsWith("http") || raw.startsWith("/") ? raw : `/storage/${raw}`;
}

const formatRank = (index: number) => String(index + 1).padStart(2, "0");

const TopSellingProduct = ({ products, user }: TopSellingProductProps) => {
  const scope = useRef<HTMLElement>(null);

  // Filter products with more than 20 sales and sort by quantity (highest first)
  const topProducts = useMemo(() => {
    return products
      .filter(product => (product.quantity || 0) >= 20)
      .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
      .slice(0, 10); // Show up to 10 products
  }, [products]);

  const maxSold = Math.max(...topProducts.map((p) => p.quantity || 0), 1);

  // If no products with 20+ sales, show message
  if (topProducts.length === 0) {
    return (
      <section id="topselling" ref={scope} className="py-16 md:py-20 bg-paper-dim">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-xl shadow-hard-sm border border-line">
            <div className="w-20 h-20 mx-auto mb-4 bg-paper-dim rounded-full flex items-center justify-center">
              <FaEye className="text-3xl text-text-soft" />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">No Top Selling Products</h3>
            <p className="text-text-soft max-w-md mx-auto">
              No products have reached 20+ sales yet. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

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
        if (!target) return;
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
      });
    },
    { scope }
  );

  return (
    <section id="topselling" ref={scope} className="py-16 md:py-20 bg-paper-dim">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-9">
          <div>
            <Eyebrow>Best selling products with 20+ sales</Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-[30px] lg:text-[36px] xl:text-[44px] font-bold text-ink">
              Top Selling Products
            </h2>
            <p className="text-text-soft text-sm mt-2">
              {topProducts.length} products with 20+ sales this month
            </p>
          </div>
          <Link
            href="/products"
            className="font-mono text-xs uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold transition-colors whitespace-nowrap"
          >
            Full leaderboard →
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-hard-sm border border-line p-4">
            <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Sales</p>
            <p className="text-2xl font-bold text-ink mt-1">
              {topProducts.reduce((sum, p) => sum + (p.quantity || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-hard-sm border border-line p-4">
            <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Top Products</p>
            <p className="text-2xl font-bold text-ink mt-1">{topProducts.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-hard-sm border border-line p-4">
            <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Best Seller</p>
            <p className="text-sm font-semibold text-ink mt-1 truncate">
              {topProducts[0]?.name || 'N/A'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-hard-sm border border-line p-4">
            <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Top Sales</p>
            <p className="text-2xl font-bold text-marigold mt-1">
              {topProducts[0]?.quantity || 0}
            </p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-hard-sm border border-line overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {topProducts.map((product, index) => {
                const rank = formatRank(index);
                const isFirst = index === 0;
                const isTop3 = index < 3;
                const imageSrc = getImageSrc(product.images);
                const soldCount = product.quantity || 0;
                const percentage = Math.round((soldCount / maxSold) * 100);
                const displayPrice = product.sale_price || product.regular_price;
                const discount =
                  product.sale_price && product.sale_price < product.regular_price
                    ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)
                    : 0;

                // Rank medal emoji
                const getRankEmoji = (idx: number) => {
                  if (idx === 0) return '🥇';
                  if (idx === 1) return '🥈';
                  if (idx === 2) return '🥉';
                  return null;
                };

                return (
                  <div
                    key={product.id}
                    className={`board-row group grid grid-cols-[40px_46px_1fr] md:grid-cols-[60px_70px_1fr_140px_200px] items-center gap-3 md:gap-4 py-4 md:py-5 border-b border-line transition-colors duration-200 hover:bg-marigold/[0.04] ${
                      isFirst ? 'bg-marigold/[0.03]' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center gap-1">
                      <div
                        className={`font-display font-black text-xl sm:text-2xl md:text-[30px] lg:text-[36px] ${
                          isFirst ? "text-marigold" : "text-paper-dim"
                        }`}
                        style={!isFirst ? { WebkitTextStroke: "1.5px #111013" } : undefined}
                      >
                        {rank}
                      </div>
                      {getRankEmoji(index) && (
                        <span className="text-lg sm:text-xl md:text-2xl hidden sm:inline">
                          {getRankEmoji(index)}
                        </span>
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0">
                      <div className={`rounded w-9 h-9 sm:w-11 sm:h-11 md:w-[52px] md:h-[52px] flex items-center justify-center overflow-hidden ${
                        isFirst ? 'ring-2 ring-marigold' : ''
                      }`}>
                        <img
                          src={imageSrc}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.jpg";
                          }}
                        />
                      </div>
                      {discount > 0 && (
                        <span className="absolute -top-1 -right-1 hidden sm:inline-flex items-center px-1 py-0.5 rounded-full text-[8px] font-bold bg-red-500 text-white">
                          -{discount}%
                        </span>
                      )}
                      {isFirst && (
                        <span className="absolute -bottom-1 -right-1 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-marigold text-white">
                          #1
                        </span>
                      )}
                    </div>

                    {/* Info (holds everything on mobile) */}
                    <div className="min-w-0">
                      <div className="font-semibold text-xs sm:text-sm md:text-[14.5px] mb-0.5 flex items-center gap-1.5">
                        <span className="truncate">{product.name}</span>
                        {isTop3 && (
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold text-white whitespace-nowrap flex-shrink-0 ${
                            isFirst ? 'bg-marigold' : 'bg-gray-500'
                          }`}>
                            {isFirst ? '🏆 Best' : `#${index + 1}`}
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[8px] sm:text-[9px] md:text-[10.5px] text-text-soft uppercase flex flex-wrap items-center gap-1.5">
                        <span className="truncate">{product.category}</span>
                        <span className="whitespace-nowrap font-bold text-ink">
                          <FormatPrice price={displayPrice} />
                        </span>
                      </div>

                      {/* Sold + actions, mobile only */}
                      <div className="flex md:hidden items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono text-text-soft whitespace-nowrap">
                          <strong className="text-ink">{soldCount}</strong> sold
                        </span>
                        {user && <WishlistButton productId={product.id} />}
                        <Link href={`/products/${product.slug}`} className="p-1 rounded-full hover:bg-paper-dim transition-colors">
                          <FaEye className="w-3.5 h-3.5 text-text-soft" />
                        </Link>
                      </div>
                    </div>

                    {/* Progress bar, desktop only */}
                    <div className="hidden md:block">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 rounded-full overflow-hidden h-2 bg-paper-dim">
                          <div
                            className={`bar-fill h-full transition-all duration-300 ${
                              isFirst ? 'bg-gradient-to-r from-marigold to-marigold-dark' : 'bg-marigold'
                            }`}
                            data-pct={percentage}
                            style={{ width: 0 }}
                          />
                        </div>
                        <span className="text-xs font-mono text-text-soft min-w-[40px]">
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Sold count + actions, desktop only */}
                    <div className="hidden md:flex items-center justify-end gap-4">
                      <div className="text-right font-mono text-xs text-text-soft whitespace-nowrap">
                        <strong className={`font-display block text-xl ${
                          isFirst ? 'text-marigold' : 'text-ink'
                        }`}>
                          {soldCount}
                        </strong>
                        sold this month
                      </div>
                      <div className="flex items-center gap-1">
                        {user && <WishlistButton productId={product.id} />}
                        <Link href={`/products/${product.slug}`} className="p-2 rounded-full hover:bg-paper-dim transition-colors">
                          <FaEye className="w-4 h-4 text-text-soft hover:text-marigold" />
                        </Link>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <AddtoCartButton product={product} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-marigold text-white rounded-lg font-medium transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <p className="text-xs text-text-soft mt-4">
            Showing {topProducts.length} products with 20+ sales
          </p>
        </div>
      </div>
    </section>
  );
};

export default TopSellingProduct;
