import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart, FaEye, FaStar, FaRegStar, FaArrowRight } from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";

interface Product {
  image: string;
  regularprice: string;
  price: string;
  review: number;
  title: string;
  sells: string;
  category: string;
  stock: number;
  sold: number;
}

const DailyDiscover: React.FC = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const products: Product[] = [
    {
      image: '/offeredproduct/thumb-product-1-1.webp',
      regularprice: '130',
      price: '76',
      review: 5,
      title: 'Almond Peanut Butter - Premium Quality',
      sells: "Best Seller",
      category: 'Groceries',
      stock: 50,
      sold: 45
    },
    {
      image: '/offeredproduct/thumb-product-2-1.webp',
      regularprice: '80',
      price: '76',
      review: 2,
      title: 'Preserve Porata - Traditional Recipe',
      sells: "Best Seller",
      category: 'Food',
      stock: 100,
      sold: 85
    },
    {
      image: '/offeredproduct/thumb-product-3-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'Ladies Hand Bag - Designer Edition',
      sells: "Best Seller",
      category: 'Fashion',
      stock: 30,
      sold: 28
    },
    {
      image: '/offeredproduct/thumb-product-4-1.webp',
      regularprice: '130',
      price: '76',
      review: 5,
      title: 'Soup Cup Set - Heat Resistant',
      sells: "Best Seller",
      category: 'Kitchen',
      stock: 75,
      sold: 70
    },
    {
      image: '/offeredproduct/thumb-product-5-1.webp',
      regularprice: '130',
      price: '76',
      review: 3,
      title: 'Ladies Leather Shoe - Comfort Fit',
      sells: "New",
      category: 'Footwear',
      stock: 40,
      sold: 32
    },
    {
      image: '/offeredproduct/thumb-product-6-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'Lentine Protein Mix - Organic',
      sells: "Best Seller",
      category: 'Health',
      stock: 60,
      sold: 58
    },
    {
      image: '/offeredproduct/thumb-product-7-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'Women Long Pant - Premium Cotton',
      sells: "Popular",
      category: 'Fashion',
      stock: 45,
      sold: 40
    },
    {
      image: '/offeredproduct/thumb-product-8-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'USB Cable - Fast Charging',
      sells: "Best Seller",
      category: 'Electronics',
      stock: 120,
      sold: 110
    },
    {
      image: '/offeredproduct/thumb-product-9-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'Wireless Earbuds - Premium Sound',
      sells: "Best Seller",
      category: 'Electronics',
      stock: 35,
      sold: 33
    },
    {
      image: '/offeredproduct/thumb-product-10-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'Smart Watch - Fitness Tracker',
      sells: "Hot Deal",
      category: 'Electronics',
      stock: 25,
      sold: 23
    },
    {
      image: '/offeredproduct/thumb-product-12-1.webp',
      regularprice: '130',
      price: '76',
      review: 4,
      title: 'Bluetooth Speaker - Portable',
      sells: "Best Seller",
      category: 'Electronics',
      stock: 55,
      sold: 50
    }
  ];

  useGSAP(() => {
    const cards = cardsRef.current.filter(Boolean);

    // Staggered entrance animation
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
  }, []);

  const calculateDiscount = (regularPrice: string, salePrice: string): string => {
    const regular = parseFloat(regularPrice);
    const sale = parseFloat(salePrice);
    const discount = Math.round(((regular - sale) / regular) * 100);
    return `${discount}%`;
  };

  const toggleWishlist = (index: number) => {
    setWishlist(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Best Seller':
        return 'bg-red-500 hover:bg-red-600';
      case 'Trending':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'New':
        return 'bg-green-500 hover:bg-green-600';
      case 'Popular':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'Hot Deal':
        return 'bg-pink-500 hover:bg-pink-600';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage > 80) return 'bg-red-500';
    if (percentage > 60) return 'bg-orange-500';
    if (percentage > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="mt-16 px-4">
      {/* Header */}
      <div className="text-center mb-12">

        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
          Daily Discover
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover our most popular items that customers love. Limited stock available!
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto mt-6"></div>
      </div>

      {/* Products Grid - Fixed height for all cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {products.map((product, index) => {
          const discount = calculateDiscount(product.regularprice, product.price);
          const stockPercentage = (product.sold / product.stock) * 100;
          const saveAmount = parseInt(product.regularprice) - parseInt(product.price);
          const isInWishlist = wishlist.includes(index);

          return (
            <div
              key={index}
              ref={(el) => cardsRef.current[index] = el}
              className="relative transform opacity-0 cursor-pointer h-full flex flex-col"
              onMouseEnter={() => handleCardEnter(index)}
              onMouseLeave={() => handleCardLeave(index)}
            >
              {/* Card with fixed height - using flex-col to make all cards same height */}
              <div className="overflow-hidden border border-gray-200 rounded-xl hover:border-blue-400 transition-all duration-300 group bg-white shadow-sm hover:shadow-xl flex flex-col h-full">

                {/* Image Container with Fixed Aspect Ratio */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                  <div className="aspect-square p-6">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain transition-transform duration-300"
                      draggable="false"
                      loading="lazy"
                    />
                  </div>

                  {/* Sells Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${getStatusColor(product.sells)}`}>
                      {product.sells}
                    </span>
                  </div>

                  {/* Discount Percentage */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg">
                      -{discount}
                    </span>
                  </div>

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="quick-view opacity-0 translate-y-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 rounded-lg font-medium transition-colors">
                          <FaEye className="w-4 h-4" />
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-3 right-3 flex flex-col gap-2">
                    <button
                      onClick={() => toggleWishlist(index)}
                      className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
                    >
                      {isInWishlist ? (
                        <FaHeart className="w-4 h-4 text-red-500" />
                      ) : (
                        <FaRegHeart className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                    <button
                      className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
                    >
                      <FaShoppingCart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Content Section - Flex-grow to fill remaining space */}
                <div className="p-4 flex-grow flex flex-col">
                  <div className="flex-shrink-0 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 mb-2">
                      {product.category}
                    </span>
                    <h3 className="text-base font-semibold leading-tight text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[48px]">
                      {product.title}
                    </h3>
                  </div>

                  {/* Rating - Fixed height */}
                  <div className="mb-3 flex-shrink-0">
                    {renderStars(product.review)}
                  </div>

                  {/* Stock Progress - Fixed height */}
                  <div className="space-y-2 mb-4 flex-shrink-0">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Sold: {product.sold}/{product.stock}</span>
                      <span className="font-medium text-gray-700">{Math.round(stockPercentage)}% sold</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${getProgressColor(stockPercentage)}`}
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Price Section - Fixed at bottom */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          ৳{product.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ৳{product.regularprice}
                        </span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Save ৳{saveAmount}
                      </span>
                    </div>

                    {/* Add to Cart Button - Fixed at bottom */}
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-700 rounded-lg font-medium transition-colors group-hover:border-blue-400 group-hover:text-blue-700 flex-shrink-0">
                      <FaShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <button className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          View All Products
          <FaArrowRight className="w-4 h-4" />
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Showing {products.length} of 100+ top selling products
        </p>
      </div>
    </div>
  );
};

export default DailyDiscover;
