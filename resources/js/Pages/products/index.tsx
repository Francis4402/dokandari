import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Product } from '@/types';
import {
  BsStar,
  BsStarFill,
  BsHeart,
  BsHeartFill,
  BsGrid,
  BsList,
  BsChevronRight,
  BsArrowRight,
  BsLightning,
  BsShop
} from 'react-icons/bs';
import {
  FiTruck,
  FiShield,
  FiTrendingUp,
  FiTrendingDown,
  FiCheckCircle,
  FiPackage
} from 'react-icons/fi';
import {
  RiDiscountPercentLine,
  RiShoppingBagLine
} from "react-icons/ri";
import {
  MdOutlineNewReleases,
  MdVerified
} from "react-icons/md";
import { TbSparkles } from "react-icons/tb";
import AppLayout from '@/Layouts/AppLayout';


interface ProductsPageProps {
    products: Product[];
    auth: {
        user: any
    }
}

const Products = ({ products, auth }: ProductsPageProps) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [activeFilter, setActiveFilter] = useState<string>('featured');
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

    // Format price
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Calculate discount percentage
    const calculateDiscount = (regularPrice: string, salePrice?: string): number => {
        if (!salePrice) return 0;
        const regular = parseFloat(regularPrice);
        const sale = parseFloat(salePrice);
        return Math.round(((regular - sale) / regular) * 100);
    };

    // Render star ratings
    const renderStars = (rating: number): JSX.Element => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">
                        {i < Math.floor(rating || 0) ? (
                            <BsStarFill className="text-amber-400" />
                        ) : (
                            <BsStar className="text-gray-300" />
                        )}
                    </span>
                ))}
                <span className="ml-2 text-xs font-semibold text-slate-600">
                    {rating || 0}
                </span>
            </div>
        );
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

    // Handle wishlist toggle
    const toggleWishlist = (productId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    // Filter options
    const filterOptions = [
        {
            id: 'featured',
            label: 'Featured',
            icon: <TbSparkles className="text-lg" />,
            gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
            lightBg: 'from-violet-50 to-purple-50'
        },
        {
            id: 'price-low',
            label: 'Price: Low to High',
            icon: <FiTrendingUp className="text-lg" />,
            gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
            lightBg: 'from-emerald-50 to-teal-50'
        },
        {
            id: 'price-high',
            label: 'Price: High to Low',
            icon: <FiTrendingDown className="text-lg" />,
            gradient: 'from-blue-500 via-indigo-500 to-violet-500',
            lightBg: 'from-blue-50 to-indigo-50'
        },
        {
            id: 'rating',
            label: 'Top Rated',
            icon: <BsStarFill className="text-lg" />,
            gradient: 'from-amber-500 via-orange-500 to-yellow-500',
            lightBg: 'from-amber-50 to-orange-50'
        },
        {
            id: 'newest',
            label: 'New Arrivals',
            icon: <MdOutlineNewReleases className="text-lg" />,
            gradient: 'from-pink-500 via-rose-500 to-red-500',
            lightBg: 'from-pink-50 to-rose-50'
        },
        {
            id: 'discount',
            label: 'Best Deals',
            icon: <RiDiscountPercentLine className="text-lg" />,
            gradient: 'from-red-500 via-orange-500 to-amber-500',
            lightBg: 'from-red-50 to-orange-50'
        }
    ];

    // Apply sorting
    const sortedProducts = React.useMemo(() => {
        const productsCopy = [...products];

        switch (activeFilter) {
            case 'price-low':
                return productsCopy.sort((a, b) => {
                    const priceA = parseFloat(a.sale_price || a.regular_price);
                    const priceB = parseFloat(b.sale_price || b.regular_price);
                    return priceA - priceB;
                });
            case 'price-high':
                return productsCopy.sort((a, b) => {
                    const priceA = parseFloat(a.sale_price || a.regular_price);
                    const priceB = parseFloat(b.sale_price || b.regular_price);
                    return priceB - priceA;
                });
            case 'rating':
                return productsCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'newest':
                return productsCopy.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
            case 'discount':
                return productsCopy.sort((a, b) => {
                    const discountA = calculateDiscount(a.regular_price, a.sale_price);
                    const discountB = calculateDiscount(b.regular_price, b.sale_price);
                    return discountB - discountA;
                });
            default:
                return productsCopy;
        }
    }, [products, activeFilter]);

    // Stats
    const onSaleCount = products.filter(p => p.sale_price && parseFloat(p.sale_price) < parseFloat(p.regular_price)).length;
    const averageRating = (products.reduce((acc, p) => acc + (p.rating || 0), 0) / products.length || 0).toFixed(1);
    const currentFilter = filterOptions.find(f => f.id === activeFilter);

    return (
        <AppLayout user={auth.user}>
            <Head title="Shop Premium Products | E-Commerce Store" />

            {/* Top Bar with Stats and Features */}
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="p-2.5 bg-white/10 rounded-lg">
                                <BsShop className="text-2xl" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{products.length}</div>
                                <div className="text-xs text-white/70">Products</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="p-2.5 bg-white/10 rounded-lg">
                                <FiTruck className="text-2xl" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">Free</div>
                                <div className="text-xs text-white/70">Shipping</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="p-2.5 bg-white/10 rounded-lg">
                                <RiDiscountPercentLine className="text-2xl" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{onSaleCount}</div>
                                <div className="text-xs text-white/70">On Sale</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="p-2.5 bg-white/10 rounded-lg">
                                <BsStarFill className="text-2xl text-amber-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{averageRating}</div>
                                <div className="text-xs text-white/70">Avg Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
                <div className="container mx-auto px-4 py-10">
                    {/* Breadcrumb & Title */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                            <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
                                <RiShoppingBagLine />
                                Home
                            </Link>
                            <BsChevronRight className="text-xs" />
                            <span className="text-slate-900 font-medium">Products</span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-5xl md:text-6xl font-bold mb-3">
                                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                                        Shop
                                    </span>
                                    <span className="text-slate-900"> Collection</span>
                                </h1>
                                <p className="text-lg text-slate-600">
                                    {sortedProducts.length} products available
                                </p>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-3 bg-white rounded-xl p-1.5 shadow-lg border border-slate-200">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                                        viewMode === 'grid'
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <BsGrid />
                                    <span className="text-sm font-medium">Grid</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                                        viewMode === 'list'
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <BsList />
                                    <span className="text-sm font-medium">List</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="mb-10 overflow-x-auto pb-2">
                        <div className="flex gap-3 min-w-max">
                            {filterOptions.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`group relative overflow-hidden transition-all duration-300 ${
                                        activeFilter === filter.id ? 'scale-105' : 'hover:scale-105'
                                    }`}
                                >
                                    <div className={`rounded-2xl border-2 transition-all duration-300 ${
                                        activeFilter === filter.id
                                            ? 'bg-gradient-to-r ' + filter.gradient + ' border-transparent shadow-xl'
                                            : 'border-slate-200 bg-white hover:border-slate-300 shadow-md hover:shadow-lg'
                                    }`}>
                                        <div className="px-6 py-4 flex items-center gap-3">
                                            <div className={`text-xl transition-all duration-300 ${
                                                activeFilter === filter.id ? 'text-white' : 'text-slate-600'
                                            }`}>
                                                {filter.icon}
                                            </div>
                                            <div className="text-left">
                                                <div className={`text-sm font-bold transition-colors duration-300 whitespace-nowrap ${
                                                    activeFilter === filter.id ? 'text-white' : 'text-slate-700'
                                                }`}>
                                                    {filter.label}
                                                </div>
                                            </div>
                                            {activeFilter === filter.id && (
                                                <FiCheckCircle className="text-white text-lg ml-2" />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Filter Banner */}
                    {currentFilter && (
                        <div className={`mb-10 rounded-2xl p-6 bg-gradient-to-r ${currentFilter.lightBg} border-2 border-white shadow-lg`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-xl bg-gradient-to-r ${currentFilter.gradient} text-white shadow-lg`}>
                                        {currentFilter.icon}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-600 mb-1">Active Filter</div>
                                        <div className={`text-2xl font-bold bg-gradient-to-r ${currentFilter.gradient} bg-clip-text text-transparent`}>
                                            {currentFilter.label}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-slate-900">{sortedProducts.length}</div>
                                    <div className="text-sm text-slate-600">Products found</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Grid/List */}
                    {sortedProducts.length > 0 ? (
                        <div className={`
                            ${viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                : 'space-y-6'
                            }
                        `}>
                            {sortedProducts.map((product: Product) => {
                                const imageSrc = getImageSrc(product.images);
                                const hasDiscount = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
                                const discountPercentage = hasDiscount
                                    ? calculateDiscount(product.regular_price, product.sale_price)
                                    : 0;
                                const productId = parseInt(product.id);
                                const isWishlisted = wishlist.includes(productId);

                                if (viewMode === 'grid') {
                                    return (
                                        <div
                                            key={product.id}
                                            onMouseEnter={() => setHoveredProduct(productId)}
                                            onMouseLeave={() => setHoveredProduct(null)}
                                            className="group relative"
                                        >
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-purple-200"
                                            >
                                                {/* Badges */}
                                                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                                    {hasDiscount && (
                                                        <span className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full shadow-xl">
                                                            <BsLightning className="text-sm" />
                                                            {discountPercentage}% OFF
                                                        </span>
                                                    )}
                                                    {activeFilter === 'newest' && (
                                                        <span className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-full shadow-xl">
                                                            <TbSparkles />
                                                            NEW
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Wishlist Button */}
                                                <button
                                                    onClick={(e) => toggleWishlist(productId, e)}
                                                    className="absolute top-4 right-4 z-20 p-3 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                                                >
                                                    {isWishlisted ? (
                                                        <BsHeartFill size={20} className="text-red-500" />
                                                    ) : (
                                                        <BsHeart size={20} className="text-slate-400 group-hover:text-red-500" />
                                                    )}
                                                </button>

                                                {/* Product Image */}
                                                <div className="aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 relative">
                                                    <img
                                                        src={`/product_images/${imageSrc}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                </div>

                                                {/* Product Info */}
                                                <div className="p-5">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider">
                                                            {product.category || 'Premium'}
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                            <span className="text-xs text-emerald-600 font-semibold">In Stock</span>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 min-h-[48px] group-hover:text-purple-600 transition-colors">
                                                        {product.name}
                                                    </h3>

                                                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
                                                        {product.description}
                                                    </p>

                                                    {/* Rating */}
                                                    <div className="mb-5">
                                                        {renderStars(product.rating || 0)}
                                                    </div>

                                                    {/* Price & Action */}
                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                        <div>
                                                            <div className="text-2xl font-bold text-slate-900">
                                                                {formatPrice(product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.regular_price))}
                                                            </div>
                                                            {hasDiscount && (
                                                                <div className="text-sm text-slate-400 line-through">
                                                                    {formatPrice(parseFloat(product.regular_price))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-110 group">
                                                            <BsArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                } else {
                                    // List View
                                    return (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.id}`}
                                            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-purple-200 flex flex-col md:flex-row"
                                        >
                                            <div className="md:w-1/3 relative">
                                                <div className="aspect-square md:aspect-auto md:h-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                                                    <img
                                                        src={`/product_images/${imageSrc}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                                {hasDiscount && (
                                                    <div className="absolute top-4 left-4">
                                                        <span className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full shadow-xl">
                                                            <BsLightning />
                                                            {discountPercentage}% OFF
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="md:w-2/3 p-8 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex-1">
                                                            <span className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider">
                                                                {product.category || 'Premium'}
                                                            </span>
                                                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors mt-2 mb-3">
                                                                {product.name}
                                                            </h3>
                                                            <p className="text-slate-600 mb-4 line-clamp-3">
                                                                {product.description}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => toggleWishlist(productId, e)}
                                                            className="p-3 hover:bg-red-50 rounded-full transition-colors ml-4"
                                                        >
                                                            {isWishlisted ? (
                                                                <BsHeartFill size={22} className="text-red-500" />
                                                            ) : (
                                                                <BsHeart size={22} className="text-slate-400 hover:text-red-500" />
                                                            )}
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-6 mb-6">
                                                        <div>{renderStars(product.rating || 0)}</div>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                            <span className="text-sm text-emerald-600 font-semibold">In Stock</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                                    <div>
                                                        <div className="text-3xl font-bold text-slate-900">
                                                            {formatPrice(product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.regular_price))}
                                                        </div>
                                                        {hasDiscount && (
                                                            <div className="text-lg text-slate-400 line-through">
                                                                {formatPrice(parseFloat(product.regular_price))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-lg hover:scale-105">
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                }
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="max-w-md mx-auto">
                                <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                                    <FiPackage size={80} className="text-purple-400" />
                                </div>
                                <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                                    No Products Found
                                </h3>
                                <p className="text-slate-600 mb-8 text-lg">
                                    Check back soon for amazing products!
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold"
                                >
                                    <RiShoppingBagLine />
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {sortedProducts.length > 0 && (
                        <div className="mt-16 pt-10 border-t border-slate-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <p className="text-slate-600">
                                    Showing <span className="font-bold text-slate-900">1-{sortedProducts.length}</span> of {sortedProducts.length} products
                                </p>
                                <div className="flex items-center gap-2">
                                    <button className="px-5 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all">
                                        Previous
                                    </button>
                                    <button className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg font-semibold">
                                        1
                                    </button>
                                    <button className="px-5 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all">
                                        2
                                    </button>
                                    <span className="px-2 text-slate-400">...</span>
                                    <button className="px-5 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all">
                                        5
                                    </button>
                                    <button className="px-5 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white mt-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]" />

                <div className="container relative mx-auto px-4 py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-white/30">
                            <TbSparkles className="text-yellow-300" />
                            <span className="text-sm font-bold">EXCLUSIVE OFFERS</span>
                        </div>

                        <h3 className="text-5xl md:text-6xl font-bold mb-6">
                            Get 10% Off First Order
                        </h3>
                        <p className="text-xl text-white/90 mb-10">
                            Subscribe to our newsletter for exclusive deals and new arrivals
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-5 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/60 transition-all text-lg"
                            />
                            <button className="px-8 py-5 bg-white text-purple-600 font-bold rounded-2xl hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-2xl text-lg">
                                Subscribe
                            </button>
                        </div>

                        <p className="text-sm text-white/70 mt-6">
                            We respect your privacy. Unsubscribe anytime.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Products;
