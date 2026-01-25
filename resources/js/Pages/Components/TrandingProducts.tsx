import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { BiHeart } from 'react-icons/bi';

interface Product {
  image: string;
  regularprice: string;
  price: string;
  review: number;
  title: string;
}

const TandingProducts: React.FC = () => {

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
          <FaStar
            key={i}
            className={`w-3 h-3 fill-current ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating}.0)</span>
      </div>
    );
  };

  return (
    <div className="mt-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold tracking-tight">Tranding Products</h2>
          </div>
          <p className="text-muted-foreground">Don't miss out on these exclusive products!</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 mb-6" />

      {/* Products Container with Marquee */}
      <div className="relative">
        {/* Gradient fade effects */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="md:hidden lg:block hidden">
            <Swiper slidesPerView={5}
                spaceBetween={30}
                autoplay={{
                delay: 2000,
                disableOnInteraction: false,
                }}
                loop={true}
                modules={[Autoplay, Pagination]}
                className="mySwiper">
                {offeredProduct.map((offer, index) => {
                    const discount = calculateDiscount(offer.regularprice, offer.price);
                    const saveAmount = calculateSaveAmount(offer.regularprice, offer.price);

                    return (
                        <SwiperSlide
                        key={index}
                        className="flex-shrink-0 w-[220px] py-10"
                        >
                        <div className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 h-full hover:-translate-y-2 hover:shadow-xl group bg-white rounded-lg shadow-md">
                            {/* Image Container */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-gray-100/20 to-gray-100/40">
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
                                <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                -{discount} OFF
                                </span>
                            </div>

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
                                <button className="w-full gap-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                <FaShoppingCart className="w-4 h-4" />
                                Quick Add
                                </button>
                            </div>
                            </div>

                            <div className="p-4 pb-3">
                            <h3 className="text-base font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                {offer.title}
                            </h3>
                            </div>

                            <div className="px-4 pb-3">
                            {/* Rating */}
                            <div className="mb-3">
                                {renderStars(offer.review)}
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-primary">
                                    ৳{offer.price}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    ৳{offer.regularprice}
                                </span>
                                </div>
                                <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors">
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

        <div className="md:block lg:hidden hidden">
            <Swiper slidesPerView={4}
                spaceBetween={30}
                autoplay={{
                delay: 1500,
                disableOnInteraction: false,
                }}
                loop={true}
                modules={[Autoplay, Pagination]}
                className="mySwiper">
                {offeredProduct.map((offer, index) => {
                    const discount = calculateDiscount(offer.regularprice, offer.price);
                    const saveAmount = calculateSaveAmount(offer.regularprice, offer.price);

                    return (
                        <SwiperSlide
                        key={index}
                        className="flex-shrink-0 w-[220px] py-10"
                        >
                        <div className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 h-full hover:-translate-y-2 hover:shadow-xl group bg-white rounded-lg shadow-md">
                            {/* Image Container */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-gray-100/20 to-gray-100/40">
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
                                <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                -{discount} OFF
                                </span>
                            </div>

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
                                <button className="w-full gap-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                <FaShoppingCart className="w-4 h-4" />
                                Quick Add
                                </button>
                            </div>
                            </div>

                            <div className="p-4 pb-3">
                            <h3 className="text-base font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                {offer.title}
                            </h3>
                            </div>

                            <div className="px-4 pb-3">
                            {/* Rating */}
                            <div className="mb-3">
                                {renderStars(offer.review)}
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-primary">
                                    ৳{offer.price}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    ৳{offer.regularprice}
                                </span>
                                </div>
                                <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors">
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

        <div className="md:hidden lg:hidden block">
            <Swiper slidesPerView={2}
                spaceBetween={30}
                autoplay={{
                delay: 2000,
                disableOnInteraction: false,
                }}
                loop={true}
                modules={[Autoplay, Pagination]}
                className="mySwiper">
                {offeredProduct.map((offer, index) => {
                    const discount = calculateDiscount(offer.regularprice, offer.price);
                    const saveAmount = calculateSaveAmount(offer.regularprice, offer.price);

                    return (
                        <SwiperSlide
                        key={index}
                        className="flex-shrink-0 w-[220px] py-10"
                        >
                        <div className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 h-full hover:-translate-y-2 hover:shadow-xl group bg-white rounded-lg shadow-md">
                            {/* Image Container */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-gray-100/20 to-gray-100/40">
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
                                <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                -{discount} OFF
                                </span>
                            </div>

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
                                <button className="w-full gap-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                <FaShoppingCart className="w-4 h-4" />
                                Quick Add
                                </button>
                            </div>
                            </div>

                            <div className="p-4 pb-3">
                            <h3 className="text-base font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                {offer.title}
                            </h3>
                            </div>

                            <div className="px-4 pb-3">
                            {/* Rating */}
                            <div className="mb-3">
                                {renderStars(offer.review)}
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-primary">
                                    ৳{offer.price}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    ৳{offer.regularprice}
                                </span>
                                </div>
                                <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors">
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
      </div>
    </div>
  );
};

export default TandingProducts;
