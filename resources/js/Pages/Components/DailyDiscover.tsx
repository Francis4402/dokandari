import { Product, storeType } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { FaHeart, FaRegHeart, FaEye, FaStar, FaRegStar, FaArrowRight } from "react-icons/fa";
import AddtoCartButton from "../buttons/AddtoCartButton";
import Addtocartactionbutton from "../buttons/Addtocartactionbutton";
import { Link } from "@inertiajs/react";

interface dailyDiscoverProduct {
  discoverProduct: Product[];
}

const DailyDiscover = ({ discoverProduct }: dailyDiscoverProduct) => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);


  useGSAP(() => {
    const cards = cardsRef.current.filter(Boolean);

    gsap.fromTo(cards,
      { opacity: 0, y: 80, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: {
          each: 0.08,
          from: "start"
        },
        duration: 0.6,
        ease: "back.out(1.4)"
      }
    );
  }, [discoverProduct]);


  const calculateDiscount = (regularPrice: string, salePrice: string): number => {
    const regular = parseFloat(regularPrice);
    const sale = parseFloat(salePrice);

    if (isNaN(regular) || isNaN(sale) || regular <= 0 || sale >= regular) return 0;
    return Math.round(((regular - sale) / regular) * 100);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCardEnter = (index: number): void => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      y: -8,
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out"
    });

    const img = card.querySelector('img');
    if (img) {
      gsap.to(img, {
        scale: 1.1,
        duration: 0.4,
        ease: "back.out(1.4)"
      });
    }

    const quickView = card.querySelector('.quick-view');
    if (quickView) {
      gsap.to(quickView, {
        opacity: 1,
        y: 0,
        duration: 0.3
      });
    }
  };

  const handleCardLeave = (index: number): void => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });

    const img = card.querySelector('img');
    if (img) {
      gsap.to(img, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }

    const quickView = card.querySelector('.quick-view');
    if (quickView) {
      gsap.to(quickView, {
        opacity: 0,
        y: 10,
        duration: 0.2
      });
    }
  };

  const renderStars = (rating: number | string | undefined) => {
    let numericRating = 0;

    if (typeof rating === 'number') {
      numericRating = rating;
    } else if (typeof rating === 'string') {
      numericRating = parseFloat(rating);
    }

    numericRating = Math.min(Math.max(isNaN(numericRating) ? 0 : numericRating, 0), 5);
    const roundedRating = Math.round(numericRating * 2) / 2;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          return (
            <span key={i}>
              {starValue <= roundedRating ? (
                <FaStar className="w-3 h-3 text-yellow-400" />
              ) : starValue - 0.5 === roundedRating ? (
                <div className="relative">
                  <FaRegStar className="w-3 h-3 text-gray-300" />
                  <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
                    <FaStar className="w-3 h-3 text-yellow-400" />
                  </div>
                </div>
              ) : (
                <FaRegStar className="w-3 h-3 text-gray-300" />
              )}
            </span>
          );
        })}
        <span className="text-xs text-gray-500 ml-1">
          ({numericRating.toFixed(1)})
        </span>
      </div>
    );
  };

  const formatPrice = (price: string): string => {
    if (!price) return '৳0';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return '৳0';
    return `৳${numPrice.toLocaleString('en-BD')}`;
  };

  const getImageSrc = (images: string) => {
    if (!images) return '/placeholder-image.jpg';

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
    return '/placeholder-image.jpg';
  };

  return (
    <div className="mt-16 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
          Daily Discover
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our handpicked selection of products just for you
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto mt-6"></div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {discoverProduct.map((product, index) => {
          if (!product) return null;

          const discount = calculateDiscount(product.regular_price, product.sale_price || '0');
          const hasDiscount = discount > 0;

          const currentStock = product.quantity || 0;

          const isInWishlist = wishlist.includes(product.id);
          const imageSrc = getImageSrc(product.images);

          // Calculate save amount
          const regularPriceNum = parseFloat(product.regular_price || '0');
          const salePriceNum = parseFloat(product.sale_price || '0');
          const saveAmount = hasDiscount ? regularPriceNum - salePriceNum : 0;

          return (
            <div
              key={product.id}
              ref={(el) => cardsRef.current[index] = el}
              className="relative transform opacity-0 cursor-pointer h-full flex flex-col"
              onMouseEnter={() => handleCardEnter(index)}
              onMouseLeave={() => handleCardLeave(index)}
            >
              {/* Card */}
              <div className="overflow-hidden border border-gray-200 rounded-xl hover:border-blue-400 transition-all duration-300 group bg-white shadow-sm hover:shadow-xl flex flex-col h-full">

                {/* Image Container */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                  <div className="aspect-square p-6">
                    <img
                      src={`/product_images/${imageSrc}`}
                      alt={product.name || 'Product image'}
                      className="w-full h-full object-contain transition-transform duration-300"
                      draggable="false"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>

                  {/* Discount Badge - Only show if there's a discount */}
                  {hasDiscount && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg">
                        -{discount}%
                      </span>
                    </div>
                  )}

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="quick-view opacity-0 translate-y-4">
                        <Link href={`/products/${product.slug}`}>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 rounded-lg font-medium transition-colors">
                                <FaEye className="w-4 h-4" />
                                Quick View
                            </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-3 right-3 flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
                      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isInWishlist ? (
                        <FaHeart className="w-4 h-4 text-red-500" />
                      ) : (
                        <FaRegHeart className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                      <Addtocartactionbutton />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex-grow flex flex-col">
                  <div className="flex-shrink-0 mb-3">
                    <h3 className="text-base font-semibold leading-tight text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[48px]">
                      {product.name}
                    </h3>
                    {product.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 mt-2">
                        {product.category}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="mb-3 flex-shrink-0">
                    {renderStars(product.rating)}
                  </div>

                  {/* Available Stock */}
                  <div className="mb-4 flex-shrink-0">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-semibold ${currentStock > 10 ? 'text-green-600' : currentStock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                        {currentStock > 0 ? `${currentStock} available` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(product.sale_price || product.regular_price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.regular_price)}
                          </span>
                        )}
                      </div>
                      {saveAmount > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Save {formatPrice(saveAmount.toString())}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <AddtoCartButton product={product} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <button className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-300 hover:shadow-lg">
          View All Products
          <FaArrowRight className="w-4 h-4" />
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Showing {discoverProduct.length} daily discover products
        </p>
      </div>
    </div>
  );
};

export default DailyDiscover;
