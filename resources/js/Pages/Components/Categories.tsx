import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import { useRef, useState } from "react";

const categories = [
  { name: 'Global finds', image: '/category/cate1.webp', url: '/' },
  { name: 'Ecommerce', image: '/category/cate2.webp', url: '/' },
  { name: 'SmartPhone', image: '/category/cate3.webp', url: '/' },
  { name: 'Grocery', image: '/category/cate4.webp', url: '/' },
  { name: 'Electronics & Applicances', image: '/category/cate5.webp', url: '/' },
  { name: 'Men', image: '/category/cate6.webp', url: '/' },
  { name: 'Women', image: '/category/cate7.webp', url: '/' },
  { name: 'Furniture', image: '/category/cate8.webp', url: '/' },
  { name: 'Beauty', image: '/category/cate9.webp', url: '/' },
  { name: 'Baby Care', image: '/category/cate10.webp', url: '/' },
  { name: 'HouseHold Essentials', image: '/category/cate11.webp', url: '/' },
  { name: 'Toys', image: '/category/cate12.webp', url: '/' },
];

const Categories = () => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Responsive breakpoints for Swiper
  const breakpoints = {
    320: {
      slidesPerView: 2.5,
      spaceBetween: 16,
    },
    480: {
      slidesPerView: 3.5,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 4.5,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 5.5,
      spaceBetween: 24,
    },
    1024: {
      slidesPerView: 6.5,
      spaceBetween: 24,
    },
    1280: {
      slidesPerView: 8.5,
      spaceBetween: 28,
    },
  };

  const handleSlideClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(index);
      setActiveIndex(index);
    }
  };

  return (
    <div className="w-full mt-16 px-4 md:px-6">
      <div className="mb-8 md:mb-12 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          Shop by Category
        </h2>
        <p className="text-gray-600 text-sm md:text-base">Browse products by category</p>
      </div>

      {/* Mobile Navigation Dots - Only show on mobile */}
      <div className="flex justify-center gap-2 mb-4 md:hidden">
        {categories.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeIndex >= index * 2 && activeIndex < (index + 1) * 2
                ? 'bg-blue-600 w-4'
                : 'bg-gray-300'
            }`}
            onClick={() => handleSlideClick(index * 2)}
            aria-label={`Go to category group ${index + 1}`}
          />
        ))}
      </div>

      <div className="relative">
        <Swiper
          ref={swiperRef}
          modules={[Autoplay]}
          breakpoints={breakpoints}
          spaceBetween={24}
          slidesPerView={'auto'}
          centeredSlides={false}
          freeMode={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={600}
          grabCursor={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="categories-swiper"
        >
          {categories.map((cat, index) => (
            <SwiperSlide key={index} className="!w-auto">
              <a
                href={cat.url}
                className="group block w-full"
                onClick={(e) => {
                  // Optional: Add any additional click handling here
                }}
              >
                <div className="flex flex-col items-center rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg p-4 md:p-6 border border-gray-100 hover:border-blue-200 transition-all duration-300 bg-white active:scale-95 active:shadow-md">
                  {/* Image Container */}
                  <div className="relative mb-3 md:mb-5">
                    <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 p-2 md:p-3">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300 select-none"
                        loading="lazy"
                        draggable="false"
                        sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-blue-200/30" />
                  </div>

                  {/* Category Name */}
                  <span className="text-xs md:text-sm font-medium text-gray-900 text-center px-1 md:px-2 line-clamp-2 mb-1 md:mb-2 group-hover:text-blue-600 transition-colors duration-200 select-none">
                    {cat.name}
                  </span>

                  {/* Decorative Line */}
                  <div className="w-6 md:w-8 h-0.5 md:h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-60" />
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Optional Navigation Arrows for Desktop */}
        <div className="hidden md:block">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => swiperRef.current?.swiper.slidePrev()}
            aria-label="Previous categories"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => swiperRef.current?.swiper.slideNext()}
            aria-label="Next categories"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .categories-swiper {
          padding: 8px 4px 16px;
        }

        @media (min-width: 768px) {
          .categories-swiper {
            padding: 12px 8px 20px;
          }
        }

        /* Custom scrollbar for desktop if needed */
        @media (min-width: 1024px) {
          .categories-swiper .swiper-wrapper {
            padding-bottom: 4px;
          }

          /* Optional: Add a subtle fade effect on edges */
          .categories-swiper::before,
          .categories-swiper::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 40px;
            z-index: 1;
            pointer-events: none;
          }

          .categories-swiper::before {
            left: 0;
            background: linear-gradient(to right, white, transparent);
          }

          .categories-swiper::after {
            right: 0;
            background: linear-gradient(to left, white, transparent);
          }
        }

        /* Touch-friendly styles for mobile */
        @media (max-width: 767px) {
          .categories-swiper .swiper-slide {
            opacity: 0.7;
            transition: opacity 0.3s ease;
          }

          .categories-swiper .swiper-slide-active,
          .categories-swiper .swiper-slide-next {
            opacity: 1;
          }

          /* Increase touch target size */
          .categories-swiper .swiper-slide > * {
            min-height: 140px;
          }
        }

        /* Prevent image dragging and text selection */
        .categories-swiper img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }

        .categories-swiper * {
          -webkit-tap-highlight-color: transparent;
        }

        /* Smooth scrolling on iOS */
        .categories-swiper {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

export default Categories;
