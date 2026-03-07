import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Product } from '@/types';
import { useState } from 'react';
import {
    FaHeart,
    FaArrowLeft,
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
    FaStore,
    FaWeight,
    FaBox,
    FaTag,
    FaClock,
    FaTruck,
    FaShieldAlt,
    FaEye,
} from 'react-icons/fa';
import { BiHeart } from 'react-icons/bi';
import { MdLocalOffer } from 'react-icons/md';
import AddtoCartButton from '../buttons/AddtoCartButton';
import WishlistButton from '../buttons/WishlistButton';
import FormatPrice from '../utils/FormatePrice';


interface WishlistPageProps {
    wishlistProducts: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        productRatings?: Record<string, { average: number; count: number }>;
    };
    auth: {
        user: any
    }
}


const colorMap: Record<string, { bg: string; text: string; border: string; hex: string }> = {
    'red': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', hex: '#EF4444' },
    'blue': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', hex: '#3B82F6' },
    'green': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', hex: '#10B981' },
    'yellow': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', hex: '#F59E0B' },
    'purple': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', hex: '#8B5CF6' },
    'pink': { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200', hex: '#EC4899' },
    'indigo': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', hex: '#6366F1' },
    'orange': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', hex: '#F97316' },
    'brown': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', hex: '#92400E' },
    'black': { bg: 'bg-gray-800', text: 'text-white', border: 'border-gray-900', hex: '#1F2937' },
    'white': { bg: 'bg-white', text: 'text-gray-800', border: 'border-gray-200', hex: '#FFFFFF' },
    'gray': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', hex: '#6B7280' },
    'silver': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', hex: '#E5E7EB' },
    'gold': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', hex: '#FCD34D' },
};

// Product type badge mapping
const productTypeMap: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    'top-selling': {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: FaTag,
        label: 'Top Selling'
    },
    'trending': {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        icon: MdLocalOffer,
        label: 'Trending'
    },
    'featured': {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: FaStar,
        label: 'Featured'
    },
    'new-arrival': {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        icon: FaClock,
        label: 'New Arrival'
    },
    'regular': {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        icon: FaBox,
        label: 'Regular'
    }
};

export default function WishlistIndex({ wishlistProducts, auth }: WishlistPageProps) {
    const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

    const getImageSrc = (images: string | null) => {
        if (!images) return '/otherplaceholder.jpg';

        try {
            const parsedImages = JSON.parse(images);
            if (Array.isArray(parsedImages) && parsedImages.length > 0 && parsedImages[0]) {
                const imagePath = parsedImages[0];
                if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
                    return imagePath;
                }
                return `/storage/${imagePath}`;
            }
        } catch (error) {
            if (images.trim().startsWith('http') || images.trim().startsWith('/')) {
                return images.trim();
            }
            return `/storage/${images.trim()}`;
        }
        return '/otherplaceholder.jpg';
    };

    const getDiscountPercentage = (regular: number, sale: number | null) => {
        if (!sale || sale >= regular) return null;
        return Math.round(((regular - sale) / regular) * 100);
    };


    const renderRatingStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className="w-4 h-4 text-yellow-400" />);
            } else {
                stars.push(<FaRegStar key={i} className="w-4 h-4 text-gray-300" />);
            }
        }
        return stars;
    };


    return (
        <AppLayout user={auth.user} wishlist={wishlistProducts}>
            <Head title="My Wishlist" />

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-200">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <FaHeart className="w-6 h-6 text-red-500" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                                My Wishlist
                            </h1>
                        </div>
                        <p className="text-gray-600 ml-16">
                            {wishlistProducts.total > 0
                                ? `You have ${wishlistProducts.total} ${wishlistProducts.total === 1 ? 'item' : 'items'} saved for later`
                                : 'Start saving your favorite items'
                            }
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>›</span>
                        <span className="text-gray-800 font-medium">Wishlist</span>
                    </div>

                    {/* Wishlist Items */}
                    {!wishlistProducts.data || wishlistProducts.data.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12">
                            <div className="max-w-md mx-auto text-center">
                                <div className="relative mb-8">
                                    <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-pink-50 to-red-50">
                                        <BiHeart className="w-20 h-20 text-red-300" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                                        <FaHeart className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                    Your wishlist is empty
                                </h2>

                                <p className="text-gray-500 mb-8">
                                    Looks like you haven't added any items to your wishlist yet.
                                    Browse our collection and save items you love!
                                </p>

                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-primary rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/20"
                                >
                                    <FaHeart className="w-5 h-5" />
                                    Start Shopping
                                </Link>

                                <div className="mt-6">
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
                                    >
                                        <FaArrowLeft className="w-3 h-3" />
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Products Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {wishlistProducts.data.map((product) => {
                                    const discountPercentage = getDiscountPercentage(product.regular_price, product.sale_price);
                                    const typeBadge = productTypeMap[product.product_type] || productTypeMap.regular;

                                    // Get rating data from productRatings
                                    const productRating = wishlistProducts.productRatings?.[product.id]?.average || 0;
                                    const reviewCount = wishlistProducts.productRatings?.[product.id]?.count || 0;

                                    return (
                                        <div
                                            key={product.id}
                                            className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary/20"
                                            onMouseEnter={() => setHoveredProductId(product.id)}
                                            onMouseLeave={() => setHoveredProductId(null)}
                                        >
                                            {/* Product Image Container */}
                                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                                {/* Image Link */}
                                                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                                                    <img
                                                        src={getImageSrc(product.images)}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/otherplaceholder.jpg';
                                                        }}
                                                    />
                                                </Link>

                                                {/* Wishlist Button - Positioned absolutely on top */}
                                                <div className="absolute top-3 right-3 z-50">
                                                    <WishlistButton productId={product.id} />
                                                </div>

                                                {/* Quick View Overlay */}
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                                                        hoveredProductId === product.id ? 'opacity-100' : 'opacity-0'
                                                    }`}
                                                >
                                                    <button
                                                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white shadow-lg pointer-events-none"
                                                        onClick={(e) => e.preventDefault()}
                                                    >
                                                        <FaEye className="w-4 h-4" />
                                                        View Details
                                                    </button>
                                                </Link>

                                                {/* Overlay Gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                                {/* Discount Badge */}
                                                {discountPercentage && (
                                                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                                                        <div className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg">
                                                            -{discountPercentage}%
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Stock Status */}
                                                {!product.inStock && (
                                                    <div className="absolute inset-x-0 bottom-0 bg-red-500/90 text-white text-xs font-medium py-1 text-center backdrop-blur-sm pointer-events-none">
                                                        Out of Stock
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="p-4">
                                                {/* Store Info */}
                                                {product.store && (
                                                    <Link
                                                        href={`/stores/${product.store.id}`}
                                                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors mb-2"
                                                    >
                                                        <FaStore className="w-3 h-3" />
                                                        {product.store.name}
                                                    </Link>
                                                )}

                                                {/* Product Name */}
                                                <Link href={`/products/${product.slug}`}>
                                                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-primary transition-colors min-h-[3rem]">
                                                        {product.name}
                                                    </h3>
                                                </Link>

                                                {/* Rating */}
                                                {reviewCount > 0 ? (
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="flex items-center gap-0.5">
                                                            {renderRatingStars(productRating)}
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="flex items-center gap-0.5">
                                                            {renderRatingStars(0)}
                                                        </div>
                                                        <span className="text-xs text-gray-400">(No reviews yet)</span>
                                                    </div>
                                                )}

                                                {/* Price Section */}
                                                <div className="flex items-baseline gap-2 mb-3">
                                                    {product.sale_price ? (
                                                        <>
                                                            <span className="text-xl font-bold text-primary">
                                                                <FormatPrice price={product.sale_price} />
                                                            </span>
                                                            <span className="text-sm text-gray-400 line-through">
                                                                <FormatPrice price={product.regular_price} />
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-xl font-bold text-primary">
                                                            <FormatPrice price={product.regular_price} />
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Color and Quick Specs */}
                                                <div className="flex items-center gap-2 mb-4">
                                                    {product.item_weight > 0 && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                                            <FaWeight className="w-3 h-3 text-gray-400" />
                                                            {product.item_weight} kg
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-2">
                                                    <AddtoCartButton product={product} />
                                                </div>

                                                {/* Delivery Info */}
                                                {product.inStock && (
                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                                            <div className="flex items-center gap-1">
                                                                <FaTruck className="w-3 h-3" />
                                                                <span>Free Delivery</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <FaShieldAlt className="w-3 h-3" />
                                                                <span>1 Year Warranty</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {wishlistProducts.last_page > 1 && (
                                <div className="mt-12 flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`?page=${wishlistProducts.current_page - 1}`}
                                            className={`px-4 py-2 rounded-lg border ${
                                                wishlistProducts.current_page === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-colors'
                                            }`}
                                        >
                                            Previous
                                        </Link>

                                        <div className="flex items-center gap-1">
                                            {[...Array(wishlistProducts.last_page)].map((_, i) => {
                                                const pageNum = i + 1;
                                                const isCurrentPage = wishlistProducts.current_page === pageNum;

                                                if (
                                                    pageNum === 1 ||
                                                    pageNum === wishlistProducts.last_page ||
                                                    (pageNum >= wishlistProducts.current_page - 1 &&
                                                     pageNum <= wishlistProducts.current_page + 1)
                                                ) {
                                                    return (
                                                        <Link
                                                            key={pageNum}
                                                            href={`?page=${pageNum}`}
                                                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                                                isCurrentPage
                                                                    ? 'bg-primary text-white font-medium'
                                                                    : 'bg-white text-gray-700 hover:bg-primary/10'
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </Link>
                                                    );
                                                } else if (
                                                    pageNum === wishlistProducts.current_page - 2 ||
                                                    pageNum === wishlistProducts.current_page + 2
                                                ) {
                                                    return <span key={pageNum} className="px-2">...</span>;
                                                }
                                                return null;
                                            })}
                                        </div>

                                        <Link
                                            href={`?page=${wishlistProducts.current_page + 1}`}
                                            className={`px-4 py-2 rounded-lg border ${
                                                wishlistProducts.current_page === wishlistProducts.last_page
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-colors'
                                            }`}
                                        >
                                            Next
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
