import { useState } from 'react';
import { FaStar, FaRegStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface Product {
  image: string;
  regularprice: string;
  price: string;
  review: number;
  title: string;
}

const TrendingProducts: React.FC = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (index: number) => {
    setWishlist(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const offeredProduct: Product[] = [
    {
      image: '/offeredproduct/thumb-product-1-1.webp',
      regularprice: '130',
      price: '76',
      review: 5,
      title: 'Almond Peanut - Premium Quality',
    },
    {
      image: '/offeredproduct/thumb-product-2-1.webp',
      regularprice: '80',
      price: '76',
      review: 2,
      title: 'Preserve Porata - Traditional Recipe',
    },
    {
      image: '/offeredproduct/thumb-product-3-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'Ladies Hand Bag - Designer Edition',
    },
    {
      image: '/offeredproduct/thumb-product-4-1.webp',
      regularprice: '130',
      price: '76',
      review: 5,
      title: 'Soup Cup Set - Heat Resistant',
    },
    {
      image: '/offeredproduct/thumb-product-5-1.webp',
      regularprice: '130',
      price: '76',
      review: 3,
      title: 'Ladies Leather Shoe - Comfort Fit',
    },
    {
      image: '/offeredproduct/thumb-product-6-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'Lentine Protein Mix - Organic',
    },
    {
      image: '/offeredproduct/thumb-product-7-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'Women Long Pant - Premium Cotton',
    },
    {
      image: '/offeredproduct/thumb-product-8-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'USB Cable - Fast Charging',
    },
    {
      image: '/offeredproduct/thumb-product-9-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'Wireless Earbuds - Premium Sound',
    },
    {
      image: '/offeredproduct/thumb-product-10-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'Smart Watch - Fitness Tracker',
    },
    {
      image: '/offeredproduct/thumb-product-12-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'Bluetooth Speaker - Portable',
    }
  ];

  const calculateDiscount = (regularPrice: string, salePrice: string): string => {
    const regular = parseFloat(regularPrice);
    const sale = parseFloat(salePrice);
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
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          i < rating ? (
            <FaStar key={i} className="w-3 h-3 text-yellow-400" />
          ) : (
            <FaRegStar key={i} className="w-3 h-3 text-gray-300" />
          )
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating}.0)</span>
      </div>
    );
  };

  return (
    <div className="mt-16 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Trending Products</h2>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-gray-600">Don't miss out on these exclusive products!</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 mb-6"></div>

      {/* Products Container with Swiper */}
      <div className="relative">
        {/* Gradient fade effects */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Desktop View - 5 slides */}
        <div className="hidden lg:block">
          <Swiper
            slidesPerView={5}
            spaceBetween={30}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            loop={true}
            modules={[Autoplay, Pagination]}
            className="mySwiper"
          >
            {offeredProduct.map((offer, index) => {
              const discount = calculateDiscount(offer.regularprice, offer.price);
              const saveAmount = calculateSaveAmount(offer.regularprice, offer.price);
              const isInWishlist = wishlist.includes(index);

              return (
                <SwiperSlide key={index}>
                  <div className="relative overflow-hidden border border-gray-200 rounded-xl hover:border-blue-500 transition-all duration-300 h-full hover:-translate-y-2 hover:shadow-xl group bg-white">
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="aspect-square p-6">
                        <img
                          src={offer.image}
                          alt={offer.title}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                          draggable="false"
                          loading="lazy"
                        />
                      </div>

                      {/* Discount Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white shadow-lg">
                          -{discount} OFF
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => toggleWishlist(index)}
                          className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        >
                          {isInWishlist ? (
                            <FaHeart className="w-4 h-4 text-red-500" />
                          ) : (
                            <FaRegHeart className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* Quick Add to Cart Button */}
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                          <FaShoppingCart className="w-4 h-4" />
                          Quick Add
                        </button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                        {offer.title}
                      </h3>

                      {/* Rating */}
                      <div className="mb-3">
                        {renderStars(offer.review)}
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-blue-600">
                            ৳{offer.price}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ৳{offer.regularprice}
                          </span>
                        </div>
                        <span className="text-xs border border-green-200 text-green-700 px-2 py-1 rounded-full bg-green-50">
                          Save ৳{saveAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Tablet View - 4 slides */}
        <div className="hidden md:block lg:hidden">
          <Swiper
            slidesPerView={4}
            spaceBetween={20}
            autoplay={{
              delay: 1500,
              disableOnInteraction: false,
            }}
            loop={true}
            modules={[Autoplay, Pagination]}
            className="mySwiper"
          >
            {offeredProduct.map((offer, index) => {
              const discount = calculateDiscount(offer.regularprice, offer.price);
              const saveAmount = calculateSaveAmount(offer.regularprice, offer.price);
              const isInWishlist = wishlist.includes(index);

              return (
                <SwiperSlide key={index}>
                  <div className="relative overflow-hidden border border-gray-200 rounded-xl hover:border-blue-500 transition-all duration-300 h-full hover:-translate-y-2 hover:shadow-xl group bg-white">
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="aspect-square p-4">
                        <img
                          src={offer.image}
                          alt={offer.title}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                          draggable="false"
                          loading="lazy"
                        />
                      </div>

                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                          -{discount} OFF
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => toggleWishlist(index)}
                          className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        >
                          {isInWishlist ? (
                            <FaHeart className="w-4 h-4 text-red-500" />
                          ) : (
                            <FaRegHeart className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                        {offer.title}
                      </h3>

                      <div className="mb-2">
                        {renderStars(offer.review)}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-blue-600">
                            ৳{offer.price}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            ৳{offer.regularprice}
                          </span>
                        </div>
                        <span className="text-xs border border-green-200 text-green-700 px-2 py-1 rounded-full">
                          Save ৳{saveAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Mobile View - 2 slides */}
        <div className="md:hidden">
          <Swiper
            slidesPerView={2}
            spaceBetween={16}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            loop={true}
            modules={[Autoplay, Pagination]}
            className="mySwiper"
          >
            {offeredProduct.map((offer, index) => {
              const discount = calculateDiscount(offer.regularprice, offer.price);
              const saveAmount = calculateSaveAmount(offer.regularprice, offer.price);
              const isInWishlist = wishlist.includes(index);

              return (
                <SwiperSlide key={index}>
                  <div className="relative overflow-hidden border border-gray-200 rounded-lg hover:border-blue-500 transition-all duration-300 h-full bg-white">
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="aspect-square p-4">
                        <img
                          src={offer.image}
                          alt={offer.title}
                          className="w-full h-full object-contain"
                          draggable="false"
                          loading="lazy"
                        />
                      </div>

                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                          -{discount}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => toggleWishlist(index)}
                          className="p-1.5 rounded-full bg-white/90 hover:bg-white shadow"
                        >
                          {isInWishlist ? (
                            <FaHeart className="w-3.5 h-3.5 text-red-500" />
                          ) : (
                            <FaRegHeart className="w-3.5 h-3.5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-1">
                        {offer.title}
                      </h3>

                      <div className="mb-2">
                        {renderStars(offer.review)}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-bold text-blue-600">
                            ৳{offer.price}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            ৳{offer.regularprice}
                          </span>
                        </div>
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

export default TrendingProducts;
