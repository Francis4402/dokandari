// ProductCard.tsx
import { Link } from "@inertiajs/react";
import { FaEye } from "react-icons/fa";
import { FiZap } from "react-icons/fi";
import { Product } from "@/types";
import WishlistButton from "@/Pages/buttons/WishlistButton";
import AddtoCartButton from "@/Pages/buttons/AddtoCartButton";
import FormatPrice from "@/Pages/utils/FormatePrice";

interface ProductCardProps {
  product: Product;
  badge?: string;
  variant?: 'default' | 'trending' | 'featured';
  showQuickView?: boolean;
}

const ProductCard = ({
  product,
  badge,
  variant = 'default',
  showQuickView = true
}: ProductCardProps) => {
  const getImageSrc = (images: string): string => {
    if (!images) return '/placeholder.jpg';

    try {
      let cleanString = images;
      if (cleanString.startsWith('"') && cleanString.endsWith('"')) {
        cleanString = cleanString.slice(1, -1);
      }
      const parsed = JSON.parse(cleanString);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]) {
        const imagePath = parsed[0];
        if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
          return imagePath;
        }
        return `/storage/${imagePath}`;
      }
    } catch {
      if (images.trim().startsWith('http') || images.trim().startsWith('/')) {
        return images.trim();
      }
    }
    return '/placeholder.jpg';
  };

  const calculateDiscount = (regularPrice: number, salePrice: number): number => {
    if (regularPrice <= 0 || salePrice >= regularPrice) return 0;
    return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  };

  const imageSrc = getImageSrc(product.images);
  const discount = calculateDiscount(product.regular_price, product.sale_price);
  const hasDiscount = discount > 0;
  const displayPrice = product.sale_price || product.regular_price;

  // Generate gradient based on product properties or use fallback
  const getGradient = () => {
    // If product has c1 and c2 properties (from your original design)
    if ('c1' in product && 'c2' in product) {
      return `linear-gradient(135deg, ${(product as any).c1}, ${(product as any).c2})`;
    }

    // Fallback gradients based on category
    const gradients: Record<string, [string, string]> = {
      'Electronics': ['#667eea', '#764ba2'],
      'Fashion': ['#f093fb', '#f5576c'],
      'Home & Living': ['#4facfe', '#00f2fe'],
      'Beauty': ['#fa709a', '#fee140'],
      'Food': ['#f6d365', '#fda085'],
      'Books': ['#a8edea', '#fed6e3'],
      'Sports': ['#ffecd2', '#fcb69f'],
      'Toys': ['#a1c4fd', '#c2e9fb'],
      'Gaming': ['#d4fc79', '#96e6a1'],
      'Automotive': ['#c1c1c1', '#8e8e8e'],
    };

    const category = product.category || 'General';
    const [color1, color2] = gradients[category] || ['#e0e0e0', '#bdbdbd'];
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  };

  // Emoji fallback based on category
  const getEmoji = () => {
    if ('emoji' in product) return (product as any).emoji;

    const emojis: Record<string, string> = {
      'Electronics': '💻',
      'Fashion': '👗',
      'Home & Living': '🏠',
      'Beauty': '💄',
      'Food': '🍕',
      'Books': '📚',
      'Sports': '⚽',
      'Toys': '🧸',
      'Gaming': '🎮',
      'Automotive': '🚗',
    };
    return emojis[product.category || ''] || '📦';
  };

  return (
    <div className="group bg-white border border-line rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-hard-sm">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <div
          className="h-[180px] flex items-center justify-center text-[56px] transition-transform duration-500 group-hover:scale-105"
        >
          {imageSrc && imageSrc !== '/placeholder.jpg' ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-contain p-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                // Show emoji as fallback
                const parent = target.parentElement;
                if (parent) {
                  const emojiSpan = document.createElement('span');
                  emojiSpan.textContent = getEmoji();
                  emojiSpan.style.fontSize = '56px';
                  parent.appendChild(emojiSpan);
                }
              }}
            />
          ) : (
            <span>{getEmoji()}</span>
          )}

          {/* Badge */}
          {badge && (
            <span className="absolute top-2.5 left-2.5 rounded-sm px-2.5 py-1 bg-ink text-white font-mono text-[10px] uppercase shadow-lg z-10">
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
          {variant === 'trending' && !badge && (
            <span className="absolute top-2.5 left-2.5 rounded-sm px-2.5 py-1 bg-[#E7F4EF] text-teal font-mono text-[10px] font-bold uppercase shadow-lg z-10 flex items-center gap-1">
              <FiZap className="w-3 h-3" />
              Trending
            </span>
          )}

          {/* Action Buttons */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-20">
            <WishlistButton productId={product.id} />
            {showQuickView && (
              <Link
                href={`/products/${product.slug}`}
                className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
              >
                <FaEye className="w-4 h-4 text-gray-600 hover:text-marigold" />
              </Link>
            )}
          </div>

          {/* Quick Add to Cart - Bottom */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-20">
            <AddtoCartButton product={product} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Vendor/Category */}
        <div className="font-mono text-[10.5px] text-text-soft uppercase tracking-wide mb-1.5 flex items-center justify-between">
          <span>{('vendor' in product ? (product as any).vendor : null) || product.category || 'General'}</span>
          {variant === 'trending' && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-[#E7F4EF] text-teal font-mono text-[9px] font-bold">
              <FiZap className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-[14.5px] leading-snug mb-2 line-clamp-2 min-h-[44px] group-hover:text-marigold transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs font-mono text-text-soft">
              ★ {Number(product.rating).toFixed(1)}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-xl">
              <FormatPrice price={displayPrice} />
            </span>
            {hasDiscount && (
              <span className="text-sm text-text-soft line-through">
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

        {/* Save Amount - Only if discount exists */}
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
