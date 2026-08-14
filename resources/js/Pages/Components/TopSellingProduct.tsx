import { useRef } from "react";
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
  // only prefix with /storage/ if it isn't already an absolute path or full URL
  return raw.startsWith("http") || raw.startsWith("/") ? raw : `/storage/${raw}`;
}

const formatRank = (index: number) => String(index + 1).padStart(2, "0");

const TopSellingProduct = ({ products, user }: TopSellingProductProps) => {
  const scope = useRef<HTMLElement>(null);
  const topProducts = products.slice(0, 5);
  const maxSold = Math.max(...topProducts.map((p) => p.quantity || 0), 1);

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
    <section id="topselling" ref={scope}>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-9">
          <div>
            <Eyebrow>Ranked by units sold, this month</Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-[30px] lg:text-[36px] xl:text-[44px] font-bold">
              Top Selling Products
            </h2>
          </div>
          <Link
            href="/products"
            className="font-mono text-xs uppercase tracking-wide border-b-2 border-[#111013] pb-0.5 hover:border-[#FF5A1F] transition-colors whitespace-nowrap"
          >
            Full leaderboard →
          </Link>
        </div>

        {/* Leaderboard */}
        <div className="border-t border-[#DAD5C7]">
          {topProducts.map((product, index) => {
            const rank = formatRank(index);
            const isFirst = index === 0;
            const imageSrc = getImageSrc(product.images);
            const soldCount = product.quantity || 0;
            const percentage = Math.round((soldCount / maxSold) * 100);
            const displayPrice = product.sale_price || product.regular_price;
            const discount =
              product.sale_price && product.sale_price < product.regular_price
                ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)
                : 0;

            return (
              <div
                key={product.id}
                className="board-row group grid grid-cols-[40px_46px_1fr] md:grid-cols-[70px_70px_1fr_140px_200px] items-center gap-3 md:gap-4 py-4 md:py-5 border-b border-[#DAD5C7] transition-colors duration-200 hover:bg-[#FF5A1F]/[0.04]"
              >
                {/* Rank */}
                <div
                  className={`font-display font-black text-xl sm:text-2xl md:text-[30px] lg:text-[36px] ${
                    isFirst ? "text-[#FF5A1F]" : "text-[#EFECE3]"
                  }`}
                  style={!isFirst ? { WebkitTextStroke: "1.5px #111013" } : undefined}
                >
                  {rank}
                </div>

                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  <div className="rounded w-9 h-9 sm:w-11 sm:h-11 md:w-[52px] md:h-[52px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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
                </div>

                {/* Info (holds everything on mobile) */}
                <div className="min-w-0">
                  <div className="font-semibold text-xs sm:text-sm md:text-[14.5px] mb-0.5 flex items-center gap-1.5">
                    <span className="truncate">{product.name}</span>
                    {isFirst && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold bg-[#FF5A1F] text-white whitespace-nowrap flex-shrink-0">
                        #1
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[8px] sm:text-[9px] md:text-[10.5px] text-[#6B6A66] uppercase flex flex-wrap items-center gap-1.5">
                    <span className="truncate">{product.category}</span>
                    <span className="whitespace-nowrap">
                      <FormatPrice price={displayPrice} />
                    </span>
                  </div>

                  {/* Sold + actions, mobile only */}
                  <div className="flex md:hidden items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-mono text-[#6B6A66] whitespace-nowrap">
                      <strong className="text-[#111013]">{soldCount}</strong> sold
                    </span>
                    <WishlistButton productId={product.id} />
                    <Link href={`/products/${product.slug}`} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <FaEye className="w-3.5 h-3.5 text-gray-400" />
                    </Link>
                  </div>
                </div>

                {/* Progress bar, desktop only */}
                <div className="hidden md:block rounded-full overflow-hidden h-1.5 bg-[#EFECE3]">
                  <div className="bar-fill h-full bg-[#FF5A1F]" data-pct={percentage} style={{ width: 0 }} />
                </div>

                {/* Sold count + actions, desktop only */}
                <div className="hidden md:flex items-center justify-end gap-4">
                  <div className="text-right font-mono text-xs text-[#6B6A66] whitespace-nowrap">
                    <strong className="font-display block text-xl text-[#111013]">{soldCount}</strong>
                    sold this month
                  </div>
                  <div className="flex items-center gap-1">
                    {user && <WishlistButton productId={product.id} />}
                    <Link href={`/products/${product.slug}`} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <FaEye className="w-4 h-4 text-gray-400 hover:text-[#FF5A1F]" />
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

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden">
          <Link
            href="/products"
            className="w-full block text-center py-3 px-4 bg-gray-900 hover:bg-[#FF5A1F] text-white text-sm font-medium rounded-lg transition-colors"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopSellingProduct;
