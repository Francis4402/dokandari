import { FiShoppingBag, FiArrowRight, FiTrendingUp, FiClock, FiStar } from "react-icons/fi";
import { GiFire } from "react-icons/gi";
import { IoSparkles } from "react-icons/io5";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const HeroSection = () => {
  const featuredDeals = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      category: "Audio",
      price: "$179.99",
      originalPrice: "$249.99",
      discount: "28",
      rating: 4.8,
      reviews: 2847,
      image: "/sliderimage/slider-4.webp",
      tag: "TRENDING",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      name: "Smart Watch Pro Series",
      category: "Wearables",
      price: "$279.99",
      originalPrice: "$349.99",
      discount: "20",
      rating: 4.9,
      reviews: 1523,
      image: "/sliderimage/slider-5.webp",
      tag: "NEW ARRIVAL",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const heroImages = [
    { image: "/sliderimage/slider-1.webp" },
    { image: "/sliderimage/slider-2.webp" },
    { image: "/sliderimage/slider-3.webp" }
  ];

  return (
    <div className="relative overflow-hidden mt-6">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
        {/* Main Hero Banner - Spans 8 columns on desktop */}
        <div className="lg:col-span-8 space-y-4 md:space-y-6">
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg md:shadow-xl lg:shadow-2xl">
            <Swiper
              spaceBetween={10}
              centeredSlides={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              modules={[Autoplay, Pagination, Navigation]}
              className="hero-swiper"
              breakpoints={{
                // Mobile
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                // Tablet
                768: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                // Desktop
                1024: {
                  slidesPerView: 1,
                  spaceBetween: 30,
                },
              }}
            >
              {heroImages.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
                    <img
                      src={item.image}
                      alt={`Featured collection ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                </SwiperSlide>
              ))}

              {/* Custom navigation buttons */}
              <div className="swiper-button-prev !hidden sm:!flex"></div>
              <div className="swiper-button-next !hidden sm:!flex"></div>
            </Swiper>
          </div>

          {/* Mini category cards below hero */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="group relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 sm:p-4 md:p-6 cursor-pointer hover:shadow-lg sm:hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full -mr-8 sm:-mr-10 md:-mr-12 lg:-mr-16 -mt-8 sm:-mt-10 md:-mt-12 lg:-mt-16"></div>
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-md sm:rounded-lg md:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 sm:mb-3">
                  <FiTrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base md:text-lg">Tech & Electronics</h3>
                <p className="text-blue-100 text-xs sm:text-sm md:text-sm mt-1">Latest gadgets</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 sm:p-4 md:p-6 cursor-pointer hover:shadow-lg sm:hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full -mr-8 sm:-mr-10 md:-mr-12 lg:-mr-16 -mt-8 sm:-mt-10 md:-mt-12 lg:-mt-16"></div>
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-md sm:rounded-lg md:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 sm:mb-3">
                  <IoSparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base md:text-lg">Home & Living</h3>
                <p className="text-emerald-100 text-xs sm:text-sm md:text-sm mt-1">Transform your space</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hot Deals Sidebar - Spans 4 columns on desktop, full width on mobile */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-20">
            <div className="rounded-xl border overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 p-3 sm:p-4 md:p-6">
                <div className="absolute inset-0 opacity-30"></div>
                <div className="relative flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-md sm:rounded-lg md:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <GiFire className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-base sm:text-lg md:text-xl">Flash Deals</h2>
                    <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm">
                      <FiClock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Ends in 12h 34m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deals list */}
              <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                {featuredDeals.map((product) => (
                  <div
                    key={product.id}
                    className="group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-100 hover:border-orange-200 p-2 sm:p-3 md:p-4 transition-all duration-300 hover:shadow-md sm:hover:shadow-lg"
                  >
                    {/* Discount badge */}
                    <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 md:-top-3 md:-right-3 z-10">
                      <div className={`bg-gradient-to-br ${product.color} text-white font-bold text-[10px] sm:text-xs md:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-full shadow-md sm:shadow-lg`}>
                        -{product.discount}% OFF
                      </div>
                    </div>

                    <div className="flex gap-2 sm:gap-3 md:gap-4">
                      {/* Product image */}
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-md sm:rounded-lg md:rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-100 group-hover:ring-orange-200 transition-all">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        {/* Badge replacement */}
                        <span className="inline-flex items-center rounded-full border border-orange-300 bg-orange-50 px-2 py-0.5 text-[9px] sm:text-[10px] md:text-xs font-semibold text-orange-600 mb-1 sm:mb-2">
                          {product.tag}
                        </span>

                        <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {product.name}
                        </h3>

                        <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mb-1 sm:mb-2">{product.category}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-1 sm:mb-2 md:mb-3">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                className={`h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 ${
                                  star <= Math.floor(product.rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 font-medium">
                            {product.rating}
                          </span>
                          <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-400">
                            ({product.reviews.toLocaleString()})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-1 sm:mb-2 md:mb-3">
                          <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                            {product.price}
                          </span>
                          <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 line-through">
                            {product.originalPrice}
                          </span>
                        </div>

                        {/* Add to cart button */}
                        <button
                          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm sm:shadow-md hover:shadow-lg transition-all h-7 sm:h-8 md:h-9 text-xs sm:text-sm rounded-md sm:rounded-lg flex items-center justify-center py-1.5 px-3"
                        >
                          <FiShoppingBag className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 mr-1 sm:mr-1.5 md:mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer button */}
              <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
                <button
                  className="w-full border border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 font-semibold h-8 sm:h-9 md:h-10 lg:h-12 rounded-md sm:rounded-lg md:rounded-xl text-xs sm:text-sm md:text-base py-2 px-4 flex items-center justify-center"
                >
                  View All Flash Deals
                  <FiArrowRight className="ml-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Swiper Styles */}
      <style>{`
        .hero-swiper {
          --swiper-navigation-size: 20px;
          --swiper-navigation-color: #fff;
          --swiper-pagination-color: #f59e0b;
          --swiper-pagination-bullet-inactive-color: #fff;
          --swiper-pagination-bullet-inactive-opacity: 0.5;
        }

        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: none;
        }

        .hero-swiper .swiper-button-next:after,
        .hero-swiper .swiper-button-prev:after {
          font-size: 14px;
          font-weight: bold;
        }

        .hero-swiper .swiper-pagination {
          bottom: 8px;
        }

        .hero-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          opacity: 0.5;
        }

        .hero-swiper .swiper-pagination-bullet-active {
          width: 20px;
          border-radius: 4px;
          opacity: 1;
        }

        /* Small devices (phones, 640px and up) */
        @media (min-width: 640px) {
          .hero-swiper {
            --swiper-navigation-size: 28px;
          }

          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            width: 20px;
            height: 20px;
            display: flex;
          }

          .hero-swiper .swiper-button-next:after,
          .hero-swiper .swiper-button-prev:after {
            font-size: 16px;
          }

          .hero-swiper .swiper-pagination {
            bottom: 12px;
          }

          .hero-swiper .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
          }

          .hero-swiper .swiper-pagination-bullet-active {
            width: 20px;
          }
        }

        /* Medium devices (tablets, 768px and up) */
        @media (min-width: 768px) {
          .hero-swiper {
            --swiper-navigation-size: 20px;
          }

          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            width: 32px;
            height: 32px;
          }

          .hero-swiper .swiper-button-next:after,
          .hero-swiper .swiper-button-prev:after {
            font-size: 18px;
          }

          .hero-swiper .swiper-pagination {
            bottom: 15px;
          }
        }

        /* Large devices (desktops, 1024px and up) */
        @media (min-width: 1024px) {
          .hero-swiper {
            --swiper-navigation-size: 36px;
          }

          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            width: 32px;
            height: 32px;
          }

          .hero-swiper .swiper-button-next:after,
          .hero-swiper .swiper-button-prev:after {
            font-size: 20px;
          }

          .hero-swiper .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
          }

          .hero-swiper .swiper-pagination-bullet-active {
            width: 30px;
          }
        }

        /* Extra large devices (large desktops, 1280px and up) */
        @media (min-width: 1280px) {
          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            width: 32px;
            height: 32px;
          }

          .hero-swiper .swiper-button-next:after,
          .hero-swiper .swiper-button-prev:after {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
