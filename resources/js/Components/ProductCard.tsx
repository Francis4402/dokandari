// ProductCard.tsx
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { FaEye, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { FiZap } from "react-icons/fi";
import axios from "axios";
import { Product, User } from "@/types";
import WishlistButton from "@/Pages/buttons/WishlistButton";
import AddtoCartButton from "@/Pages/buttons/AddtoCartButton";
import FormatPrice from "@/Pages/utils/FormatePrice";

interface ProductCardProps {
  product: Product;
  badge?: string;
  user: User | null;
  variant?: "default" | "trending" | "featured";
  showQuickView?: boolean;
  initialAverageRating?: number;
}

const CATEGORY_EMOJI: Record<string, string> = {
  Electronics: "💻",
  Fashion: "👗",
  "Home & Living": "🏠",
  Beauty: "💄",
  Food: "🍕",
  Books: "📚",
  Sports: "⚽",
  Toys: "🧸",
  Gaming: "🎮",
  Automotive: "🚗",
};

const CATEGORY_GRADIENT: Record<string, [string, string]> = {
  Electronics: ["#EEF1F5", "#D8DEE9"],
  Fashion: ["#FFF0F0", "#FFE1EC"],
  "Home & Living": ["#FFF7ED", "#FFE8CC"],
  Beauty: ["#FDF2F8", "#FCE4F6"],
  Food: ["#FFF7ED", "#FFE4C7"],
  Books: ["#EFF6FF", "#DCE9FE"],
  Sports: ["#ECFDF5", "#D2F5E3"],
  Toys: ["#FEFCE8", "#FDF3C7"],
  Gaming: ["#F5F3FF", "#E7E1FE"],
  Automotive: ["#F3F4F6", "#E2E4E8"],
};
const DEFAULT_GRADIENT: [string, string] = ["#F7F5EF", "#EFECE3"];

function getImageSrc(images: string): string {
  if (!images) return "";

  try {
    const cleanString = images.startsWith('"') && images.endsWith('"') ? images.slice(1, -1) : images;
    const parsed = JSON.parse(cleanString);
    const imagePath = Array.isArray(parsed) ? parsed[0] : null;
    if (!imagePath) return "";
    return imagePath.startsWith("http") || imagePath.startsWith("/") ? imagePath : `/storage/${imagePath}`;
  } catch {
    const trimmed = images.trim();
    return trimmed.startsWith("http") || trimmed.startsWith("/") ? trimmed : "";
  }
}

function calculateDiscount(regularPrice: number, salePrice: number): number {
  if (regularPrice <= 0 || salePrice >= regularPrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

// Render stars based on average rating
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="w-3 h-3 text-amber-400 fill-current" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="w-3 h-3 text-amber-400 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
      ))}
    </div>
  );
};

const ProductCard = ({
  product,
  badge,
  variant = "default",
  showQuickView = true,
  user,
  initialAverageRating = 0,
}: ProductCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [loading, setLoading] = useState(true);

  const imageSrc = getImageSrc(product.images);
  const emoji = "emoji" in product ? (product as any).emoji : CATEGORY_EMOJI[product.category ?? ""] ?? "📦";
  const [gradientFrom, gradientTo] = CATEGORY_GRADIENT[product.category ?? ""] ?? DEFAULT_GRADIENT;
  const vendor = ("vendor" in product ? (product as any).vendor : null) ?? product.category ?? "General";

  const discount = calculateDiscount(product.regular_price, product.sale_price);
  const hasDiscount = discount > 0;
  const displayPrice = product.sale_price || product.regular_price;
  const showImage = imageSrc && !imageFailed;

  // Fetch real review data using the route: /products/{product}/comments
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    axios
      .get(`/products/${product.id}/comments`)
      .then((res) => {
        if (!cancelled) {
          const stats = res.data.stats || {};
          setAverageRating(stats.average || 0);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch review data:", err);
        setLoading(false);
        setAverageRating(initialAverageRating);
      });
    return () => {
      cancelled = true;
    };
  }, [product.id, initialAverageRating]);

  // Determine if we should show the rating section
  const hasRating = averageRating > 0;

  return (
    <div className="group bg-white border border-[#DAD5C7] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[4px_4px_0_#111013]">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {showImage ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
          >
            {emoji}
          </div>
        )}

        {/* Badge */}
        {badge && (
          <span className="absolute top-2.5 left-2.5 rounded-sm px-2.5 py-1 bg-[#111013] text-white font-mono text-[10px] uppercase shadow-lg z-10">
            {badge}
          </span>
        )}

        {/* Discount Badge */}
        {hasDiscount && !badge && (
          <span className="absolute top-2.5 left-2.5 rounded-sm px-2.5 py-1 bg-red-500 text-white font-mono text-[10px] font-bold uppercase shadow-lg z-10">
            -{discount}%
          </span>
        )}

        {/* Trending Badge */}
        {variant === "trending" && !badge && (
          <span className="absolute top-2.5 left-2.5 rounded-sm px-2.5 py-1 bg-[#E7F4EF] text-[#0E6E5B] font-mono text-[10px] font-bold uppercase shadow-lg z-10 flex items-center gap-1">
            <FiZap className="w-3 h-3" />
            Trending
          </span>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-20">
          {user && <WishlistButton productId={product.id} />}
          {showQuickView && (
            <Link
              href={`/products/${product.slug}`}
              className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
            >
              <FaEye className="w-4 h-4 text-gray-600 hover:text-[#FF5A1F]" />
            </Link>
          )}
        </div>

        {/* Quick Add to Cart - Bottom */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-20">
          <AddtoCartButton product={product} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Vendor/Category */}
        <div className="font-mono text-[10.5px] text-[#6B6A66] uppercase tracking-wide mb-1.5 flex items-center justify-between">
          <span>{vendor}</span>
          {variant === "trending" && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-[#E7F4EF] text-[#0E6E5B] font-mono text-[9px] font-bold">
              <FiZap className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-[14.5px] leading-snug mb-2 line-clamp-2 min-h-[44px] group-hover:text-[#FF5A1F] transition-colors">
          {product.name}
        </h3>

        {/* Rating - Only show if there's a rating */}
        {hasRating && !loading ? (
          <div className="flex items-center gap-2 mb-2">
            {renderStars(averageRating)}
            <span className="text-xs font-mono text-[#6B6A66]">
              {averageRating.toFixed(1)}
            </span>
          </div>
        ) : loading ? (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-[#6B6A66]">No reviews yet</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-xl">
              <FormatPrice price={displayPrice} />
            </span>
            {hasDiscount && (
              <span className="text-sm text-[#6B6A66] line-through">
                <FormatPrice price={product.regular_price} />
              </span>
            )}
          </div>
          {!showQuickView && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <AddtoCartButton product={product} />
            </div>
          )}
        </div>

        {/* Save Amount */}
        {hasDiscount && (
          <div className="mt-1.5">
            <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
              Save <FormatPrice price={product.regular_price - product.sale_price} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
