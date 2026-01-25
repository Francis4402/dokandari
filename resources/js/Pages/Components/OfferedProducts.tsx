
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { useEffect, useState } from 'react';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { CiImageOn } from "react-icons/ci";
import { FiZap } from 'react-icons/fi';
import { BiHeart } from 'react-icons/bi';

interface Product {
  id: string;
  images: string; // This is a JSON string
  regular_price: string;
  sale_price: string;
  rating: string | number;
  name: string;
  // Other fields you might need
  category?: string;
  description?: string;
  inStock?: boolean | number;
  quantity?: number;
}

const OfferedProducts = ({product}: {product: Product[]}) => {
  const [parsedProducts, setParsedProducts] = useState<Product[]>([]);


  // Parse the images when component mounts
  useEffect(() => {
    if (product && product.length > 0) {
      const parsed = product.map(item => ({
        ...item,
        // Ensure rating is a number
        rating: typeof item.rating === 'string' ? parseFloat(item.rating) : Number(item.rating) || 0
      }));
      setParsedProducts(parsed);
    }
  }, [product]);

  const calculateDiscount = (regularPrice: string, salePrice: string): string => {
    const regular = parseFloat(regularPrice);
    const sale = parseFloat(salePrice);
    if (regular <= 0 || sale >= regular) return '0%';
    const discount = Math.round(((regular - sale) / regular) * 100);
    return `${discount}%`;
  };

  const calculateSaveAmount = (regularPrice: string, salePrice: string): string => {
    const regular = parseFloat(regularPrice);
    const sale = parseFloat(salePrice);
    const saveAmount = regular - sale;
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
        <span className="text-xs text-gray-500 ml-1">
          ({normalizedRating.toFixed(1)})
        </span>
      </div>
    );
  };

  // Parse images JSON string to array
  const parseImages = (imagesString: string): string[] => {
    if (!imagesString) return [];

    try {
      // Remove any extra quotes if they exist
      let cleanString = imagesString;
      if (cleanString.startsWith('"') && cleanString.endsWith('"')) {
        cleanString = cleanString.slice(1, -1);
      }

      // Parse the JSON
      const parsed = JSON.parse(cleanString);

      if (Array.isArray(parsed)) {
        return parsed.map(img => {
          // If image is just a filename, prepend the path
          if (img && typeof img === 'string') {
            // Check if it already has the path
            if (img.includes('product_images/')) {
              return img;
            }
            // Add the path
            return `product_images/${img}`;
          }
          return '';
        }).filter(img => img !== '');
      }

      return [];
    } catch (error) {
      console.error('Error parsing images:', error, 'String:', imagesString);
      return [];
    }
  };

  // Get first image URL
  const getFirstImage = (imagesString: string): string => {
    const images = parseImages(imagesString);
    console.log('Parsed images:', images); // Debug

    if (images.length > 0) {
      // Construct full URL
      const imagePath = images[0];
      if (imagePath.startsWith('http')) {
        return imagePath;
      } else if (imagePath.startsWith('/')) {
        return imagePath;
      } else {
        // Add leading slash for relative path
        return `/${imagePath}`;
      }
    }

    // Fallback image
    return 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=400&fit=crop';
  };

  // Display all images for debugging (remove this in production)
  const renderAllImages = (imagesString: string) => {
    const images = parseImages(imagesString);

    if (images.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <CiImageOn className="w-12 h-12 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="w-full h-full">
        <img
          src={getFirstImage(imagesString)}
          alt={imagesString}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            console.error('Image failed to load:', e.currentTarget.src);
            e.currentTarget.src = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=400&fit=crop';
            e.currentTarget.classList.add('object-cover');
          }}
        />
      </div>
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

      {/* Products Container */}
      <div className="relative">
        {/* Gradient fade effects */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Responsive Swiper */}
        <div className="swiper-container">
          <Swiper
            spaceBetween={30}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
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

              // Debug logging
              console.log('Product:', {
                name: offer.name,
                images: offer.images,
                parsed: parseImages(offer.images),
                firstImage: getFirstImage(offer.images)
              });

              return (
                <SwiperSlide key={offer.id || index} className="h-auto">
                  <div className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 h-full hover:-translate-y-2 hover:shadow-xl group flex flex-col bg-white rounded-lg shadow-md">
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-grow">
                      <div className="aspect-square p-4 flex items-center justify-center">
                        {renderAllImages(offer.images)}
                      </div>

                      {/* Discount Badge */}
                      {discount !== '0%' && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                            -{discount} OFF
                          </span>
                        </div>
                      )}

                      {/* Action Buttons Overlay */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <button
                          className="inline-flex items-center justify-center rounded-full w-8 h-8 bg-white/90 hover:bg-white shadow-lg transition-colors"
                        >
                          <BiHeart className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quick Add to Cart Button */}
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <button className="w-full gap-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                          <FaShoppingCart className="w-4 h-4" />
                          Quick Add
                        </button>
                      </div>
                    </div>

                    <div className="p-4 pb-3 pt-4">
                      <h3 className="text-base font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {offer.name}
                      </h3>
                    </div>

                    <div className="px-4 pb-4 pt-0">
                      {/* Rating */}
                      <div className="mb-3">
                        {renderStars(offer.rating as number)}
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">
                            ৳{parseFloat(offer.sale_price || offer.regular_price).toFixed(2)}
                          </span>
                          {discount !== '0%' && (
                            <span className="text-sm text-gray-500 line-through">
                              ৳{parseFloat(offer.regular_price).toFixed(2)}
                            </span>
                          )}
                        </div>
                        {discount !== '0%' && (
                          <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold">
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
    </div>
  );
};

export default OfferedProducts;
