import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { CiImageOn } from 'react-icons/ci';
import { FiZap } from 'react-icons/fi';
import { BiHeart } from 'react-icons/bi';
import { Product } from '@/types';
import { Link } from '@inertiajs/react';

const TrandingProducts = ({ trandingproduct }: { trandingproduct: Product[] }) => {

  // ✅ Derive parsed products inline — no need for useEffect + useState
  const parsedProducts: Product[] = (trandingproduct ?? []).map(item => ({
    ...item,
    rating: typeof item.rating === 'string' ? parseFloat(item.rating) : Number(item.rating) || 0,
  }));

  // ✅ Consistent number inputs
  const calculateDiscount = (regularPrice: number, salePrice: number): string => {
    if (regularPrice <= 0 || salePrice >= regularPrice) return '0%';
    const discount = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
    return `${discount}%`;
  };

  // ✅ Consistent number inputs
  const calculateSaveAmount = (regularPrice: number, salePrice: number): string => {
    const saveAmount = regularPrice - salePrice;
    return saveAmount > 0 ? saveAmount.toFixed(0) : '0';
  };

  const renderStars = (rating: number) => {
    const normalizedRating = Math.min(Math.max(Number(rating) || 0, 0), 5);
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = normalizedRating >= star;
          const isHalfFilled = normalizedRating >= star - 0.5 && normalizedRating < star;
          return (
            <FaStar
              key={star}
              className={`w-3 h-3 ${
                isFilled
                  ? 'text-yellow-400 fill-yellow-400'
                  : isHalfFilled
                    ? 'text-yellow-400 fill-yellow-400 opacity-60'
                    : 'text-gray-300 fill-gray-300'
              }`}
            />
          );
        })}
        <span className="text-xs text-gray-500 ml-1">({normalizedRating.toFixed(1)})</span>
      </div>
    );
  };

  // ✅ Returns clean paths without double-prepending /storage/
  const parseImages = (imagesString: string): string[] => {
    if (!imagesString) return [];
    try {
      let cleanString = imagesString;
      if (cleanString.startsWith('"') && cleanString.endsWith('"')) {
        cleanString = cleanString.slice(1, -1);
      }
      const parsed = JSON.parse(cleanString);
      if (Array.isArray(parsed)) {
        return parsed
          .map(img => (typeof img === 'string' && img ? img : ''))
          .filter(Boolean);
      }
      return [];
    } catch (error) {
      console.error('Error parsing images:', error);
      return [];
    }
  };

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=400&fit=crop';

  // ✅ No longer double-prepends /storage/
  const getFirstImage = (imagesString: string): string => {
    const images = parseImages(imagesString);
    if (!images.length) return FALLBACK_IMAGE;

    const imagePath = images[0];
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    // imagePath is a relative filename like "products/abc.jpg"
    return `/storage/${imagePath}`;
  };

  // ✅ BDT isn't supported by Intl.NumberFormat — format manually
  const formatPrice = (price: number): string => {
    return `৳${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)}`;
  };

  const renderProductImage = (imagesString: string, productName: string) => {
    const src = getFirstImage(imagesString);
    if (!src || src === FALLBACK_IMAGE) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <CiImageOn className="w-12 h-12 text-gray-400" />
        </div>
      );
    }
    return (
      <img
        src={src}
        alt={productName}
        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
          e.currentTarget.classList.add('object-cover');
        }}
      />
    );
  };

  if (!parsedProducts.length) {
    return (
      <div className="mt-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FiZap className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold tracking-tight">Special Offers</h2>
              <span className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-medium text-white">
                Limited Time
              </span>
            </div>
            <p className="text-gray-500">Don't miss out on these exclusive deals!</p>
          </div>
        </div>
        <div className="h-px bg-gray-200 mb-6" />
        <div className="text-center py-12">
          <CiImageOn className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Trending Products</h2>
          <p className="text-muted-foreground">Don't miss out on these exclusive products!</p>
        </div>
      </div>

      <div className="h-px bg-gray-200 mb-6" />

      {/* Products Container */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <Swiper
          spaceBetween={30}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop={true}
          modules={[Autoplay, Pagination]}
          breakpoints={{
            320: { slidesPerView: 2 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          className="py-10"
        >
          {parsedProducts.map((offer, index) => {
            const discount = calculateDiscount(offer.regular_price, offer.sale_price);
            const saveAmount = calculateSaveAmount(offer.regular_price, offer.sale_price);

            return (
              <SwiperSlide key={offer.id ?? index} className="h-auto">
                <div className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 h-full hover:-translate-y-2 hover:shadow-xl group flex flex-col bg-white rounded-lg shadow-md">

                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-grow">
                    <div className="aspect-square p-4 flex items-center justify-center">
                      {renderProductImage(offer.images, offer.name)}
                    </div>

                    {/* Discount Badge */}
                    {discount !== '0%' && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                          -{discount} OFF
                        </span>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <button className="inline-flex items-center justify-center rounded-full w-8 h-8 bg-white/90 hover:bg-white shadow-lg transition-colors">
                        <BiHeart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick View Button — ✅ fixed: offer.slug instead of trandingproduct.slug */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Link
                        href={`/products/${offer.slug}`}
                        className="w-full gap-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        <FaShoppingCart className="w-4 h-4" />
                        Quick view
                      </Link>
                    </div>
                  </div>

                  {/* Product Name */}
                  <div className="p-4 pb-0">
                    <h3 className="text-base font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {offer.name}
                    </h3>
                  </div>

                  {/* Rating & Price */}
                  <div className="px-4 pb-4 pt-2">
                    <div className="mb-3">{renderStars(offer.rating as number)}</div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-primary">
                          {formatPrice(offer.sale_price || offer.regular_price)}
                        </span>
                        {discount !== '0%' && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(offer.regular_price)}
                          </span>
                        )}
                      </div>
                      {discount !== '0%' && (
                        <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold w-fit">
                          Save ৳{saveAmount}
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default TrandingProducts;
