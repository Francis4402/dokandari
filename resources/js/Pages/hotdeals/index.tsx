import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Product } from '@/types';
import {
  BsStar,
  BsStarFill,
  BsStarHalf,
  BsFilter,
  BsSearch,
  BsChevronRight,
  BsGrid3X3Gap,
  BsEye,
} from 'react-icons/bs';
import {
  FiShoppingBag,
  FiTruck,
  FiClock
} from 'react-icons/fi';
import {
  RiFireFill,
  RiFlashlightFill,
  RiDiscountPercentFill
} from 'react-icons/ri';
import AppLayout from '@/Layouts/AppLayout';
import AddtoCartButton from '../buttons/AddtoCartButton';
import WishlistButton from '../buttons/WishlistButton';
import FormatPrice from '../utils/FormatePrice';

interface HotDealsPageProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    auth?: {
        user?: any;
    };
    wishlist: any;
    productRatings?: Record<string, { average: number; count: number }>;
}

const HotDeals = ({ products, auth, wishlist, productRatings = {} }: HotDealsPageProps) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [sortBy, setSortBy] = useState('discount-high');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState<string>('all');

    // Get products array from paginated data
    const productsData = products.data || [];

    // Filter products that have sale_price (hot deals)
    const hotDealsProducts = useMemo(() => {
        return productsData.filter(product =>
            product.sale_price &&
            product.sale_price > 0 &&
            product.sale_price < product.regular_price
        );
    }, [productsData]);

    // Get unique categories from hot deals
    const categories = useMemo(() => {
        const uniqueCategories = new Set(hotDealsProducts.map(p => p.category).filter(Boolean));
        return ['all', ...uniqueCategories];
    }, [hotDealsProducts]);

    // Discount filter options
    const discountOptions = [
        { id: 'all', label: 'All Discounts' },
        { id: '10', label: '10% or more' },
        { id: '20', label: '20% or more' },
        { id: '30', label: '30% or more' },
        { id: '40', label: '40% or more' },
        { id: '50', label: '50% or more' },
        { id: '60', label: '60% or more' },
        { id: '70', label: '70% or more' },
    ];


    // Calculate discount percentage
    const calculateDiscount = (regularPrice: number, salePrice?: number): number => {
        if (!salePrice || salePrice >= regularPrice) return 0;
        return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
    };

    // Get product rating
    const getProductRating = (product: Product): { average: number; count: number } => {
        if (productRatings[product.id]) {
            return productRatings[product.id];
        }

        const rating = typeof product.rating === 'string'
            ? parseFloat(product.rating)
            : (product.rating || 0);

        return { average: rating, count: 0 };
    };

    // Render stars
    const renderStars = (averageRating: number): JSX.Element => {
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.5;

        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => {
                    if (i < fullStars) {
                        return <BsStarFill key={i} className="text-amber-400 text-xs" />;
                    } else if (i === fullStars && hasHalfStar) {
                        return <BsStarHalf key={i} className="text-amber-400 text-xs" />;
                    } else {
                        return <BsStar key={i} className="text-gray-300 text-xs" />;
                    }
                })}
            </div>
        );
    };

    const getImageSrc = (images: string): string => {
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

    // Sort options
    const sortOptions = [
        { id: 'discount-high', label: 'Discount: High to Low' },
        { id: 'discount-low', label: 'Discount: Low to High' },
        { id: 'price-low', label: 'Price: Low to High' },
        { id: 'price-high', label: 'Price: High to Low' },
        { id: 'rating', label: 'Top Rated' },
    ];

    const filteredProducts = useMemo(() => {
        let filtered = [...hotDealsProducts];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                (product.description && product.description.toLowerCase().includes(query))
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Discount filter
        if (selectedDiscount !== 'all') {
            const minDiscount = parseInt(selectedDiscount);
            filtered = filtered.filter(product => {
                const discount = calculateDiscount(product.regular_price, product.sale_price);
                return discount >= minDiscount;
            });
        }

        // Price range filter
        filtered = filtered.filter(product => {
            const price = product.sale_price || product.regular_price;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Sorting
        switch (sortBy) {
            case 'discount-high':
                filtered.sort((a, b) => {
                    const discountA = calculateDiscount(a.regular_price, a.sale_price);
                    const discountB = calculateDiscount(b.regular_price, b.sale_price);
                    return discountB - discountA;
                });
                break;
            case 'discount-low':
                filtered.sort((a, b) => {
                    const discountA = calculateDiscount(a.regular_price, a.sale_price);
                    const discountB = calculateDiscount(b.regular_price, b.sale_price);
                    return discountA - discountB;
                });
                break;
            case 'price-low':
                filtered.sort((a, b) => {
                    const priceA = a.sale_price || a.regular_price;
                    const priceB = b.sale_price || b.regular_price;
                    return priceA - priceB;
                });
                break;
            case 'price-high':
                filtered.sort((a, b) => {
                    const priceA = a.sale_price || a.regular_price;
                    const priceB = b.sale_price || b.regular_price;
                    return priceB - priceA;
                });
                break;
            case 'rating':
                filtered.sort((a, b) => {
                    const ratingA = getProductRating(a).average;
                    const ratingB = getProductRating(b).average;
                    return ratingB - ratingA;
                });
                break;
            default:
                break;
        }

        return filtered;
    }, [hotDealsProducts, searchQuery, selectedCategory, selectedDiscount, priceRange, sortBy]);

    // Stats
    const totalDeals = hotDealsProducts.length;

    return (
        <AppLayout user={auth?.user} wishlist={wishlist}>
            <Head title="Hot Deals | Shop" />

            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="text-center md:text-left mb-6 md:mb-0">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                <RiFireFill className="text-4xl animate-pulse" />
                                <h1 className="text-4xl md:text-5xl font-bold">Hot Deals</h1>
                            </div>
                            <p className="text-xl opacity-90 mb-2">
                                Limited Time Offers! Up to 70% Off
                            </p>
                            <p className="text-lg opacity-80">
                                {totalDeals} products on sale
                            </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center">
                            <RiFlashlightFill className="text-4xl mx-auto mb-2" />
                            <p className="text-2xl font-bold">Flash Sale</p>
                            <p className="text-sm opacity-90">Ends in:</p>
                            <div className="flex gap-2 mt-2">
                                <div className="bg-white/30 rounded px-3 py-1">
                                    <span className="text-xl font-bold">12</span>
                                    <span className="text-xs ml-1">h</span>
                                </div>
                                <div className="bg-white/30 rounded px-3 py-1">
                                    <span className="text-xl font-bold">45</span>
                                    <span className="text-xs ml-1">m</span>
                                </div>
                                <div className="bg-white/30 rounded px-3 py-1">
                                    <span className="text-xl font-bold">30</span>
                                    <span className="text-xs ml-1">s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page Header with Search */}
            <div className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            {/* Breadcrumb */}
                            <nav className="text-sm text-gray-600 mb-2">
                                <ol className="flex items-center space-x-2">
                                    <li>
                                        <Link href="/" className="hover:text-blue-600">Home</Link>
                                    </li>
                                    <li><BsChevronRight className="text-gray-400 text-xs" /></li>
                                    <li className="text-gray-900 font-medium">Hot Deals</li>
                                </ol>
                            </nav>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    placeholder="Search deals..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 w-full md:w-64"
                                />
                            </div>

                            {/* Filter Toggle Button (Mobile) */}
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                <BsFilter />
                                <span className="text-sm">Filters</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Discount Categories */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="flex overflow-x-auto py-3 gap-2">
                        {discountOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setSelectedDiscount(option.id)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${
                                    selectedDiscount === option.id
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <div className={`lg:w-1/4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <RiDiscountPercentFill className="text-orange-500" />
                                Filter Deals
                            </h3>

                            {/* Categories */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    Categories
                                </h4>
                                <div className="space-y-1">
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`block w-full text-left py-2 px-3 rounded-md text-sm ${
                                                selectedCategory === category
                                                    ? 'bg-orange-50 text-orange-600 font-medium'
                                                    : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{category === 'all' ? 'All Categories' : category}</span>
                                                <span className="text-xs text-gray-400">
                                                    ({hotDealsProducts.filter(p => category === 'all' || p.category === category).length})
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filter by Price */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    Price Range
                                </h4>
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="100"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            <FormatPrice price={priceRange[0]} />
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            <FormatPrice price={priceRange[1]} />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Sort by */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    Sort by
                                </h4>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Clear Filters */}
                            <button
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setSelectedDiscount('all');
                                    setPriceRange([0, 10000]);
                                    setSearchQuery('');
                                    setSortBy('discount-high');
                                }}
                                className="w-full mt-6 py-2.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>

                        {/* Deal Info */}
                        <div className="mt-6 p-5 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <FiClock className="text-orange-600 text-xl" />
                                <h4 className="font-medium text-gray-900">Limited Time Offers</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                These deals won't last long! Grab them before they're gone.
                            </p>
                            <div className="flex items-center gap-3">
                                <FiTruck className="text-green-600" />
                                <h4 className="font-medium text-gray-900">Free Shipping</h4>
                            </div>
                            <p className="text-sm text-gray-600">
                                On all orders over ৳1000
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div className="text-gray-600 text-sm">
                                Showing <span className="font-medium text-gray-900">{filteredProducts.length}</span> hot deals
                            </div>
                            <div className="flex items-center gap-3">
                                {/* View Toggle */}
                                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${
                                            viewMode === 'grid'
                                                ? 'bg-gray-100 text-gray-700'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                        }`}
                                        title="Grid view"
                                    >
                                        <BsGrid3X3Gap size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 border-l border-gray-300 ${
                                            viewMode === 'list'
                                                ? 'bg-gray-100 text-gray-700'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                        }`}
                                        title="List view"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid/List */}
                        {filteredProducts.length > 0 ? (
                            <div className={`
                                ${viewMode === 'grid'
                                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                                    : 'space-y-4'
                                }
                            `}>
                                {filteredProducts.map((product: Product) => {
                                    const imageSrc = getImageSrc(product.images);
                                    const discountPercentage = calculateDiscount(product.regular_price, product.sale_price);
                                    const displayPrice = product.sale_price || product.regular_price;
                                    const { average: avgRating, count: reviewCount } = getProductRating(product);

                                    if (viewMode === 'grid') {
                                        return (
                                            <div key={product.id} className="group">
                                                <div className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative">
                                                    {/* Hot Deal Badge */}
                                                    <div className="absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1.5 rounded-br-lg z-10 flex items-center gap-1">
                                                        <RiFireFill className="animate-pulse" />
                                                        <span className="font-bold text-sm">{discountPercentage}% OFF</span>
                                                    </div>

                                                    {/* Image Container */}
                                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                                        <img
                                                            src={`/storage/${imageSrc}`}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/otherplaceholder.jpg';
                                                            }}
                                                        />

                                                        {/* Wishlist Button */}
                                                        <div className="absolute top-3 right-3">
                                                            <WishlistButton
                                                                productId={product.id.toString()}
                                                            />
                                                        </div>

                                                        {/* Quick View Overlay */}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Link href={`/products/${product.slug}`}>
                                                                <button className="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors shadow-lg">
                                                                    <BsEye className="inline mr-1" /> Quick View
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="p-4">
                                                        {/* Category */}
                                                        <div className="mb-2">
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider">
                                                                {product.category || 'Uncategorized'}
                                                            </span>
                                                        </div>

                                                        {/* Product Name */}
                                                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                                                            {product.name}
                                                        </h3>

                                                        {/* Rating */}
                                                        <div className="mb-3 flex items-center">
                                                            {renderStars(avgRating)}
                                                            {reviewCount > 0 && (
                                                                <span className="text-xs text-gray-400 ml-1">
                                                                    ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Price */}
                                                        <div className="mb-3">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <span className="font-bold text-orange-600 text-lg">
                                                                        <FormatPrice price={displayPrice} />
                                                                    </span>
                                                                    <span className="ml-2 text-sm text-gray-400 line-through">
                                                                        <FormatPrice price={product.regular_price} />
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">
                                                                    Save <FormatPrice price={product.regular_price - displayPrice} />
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Stock Status */}
                                                        <div className="mb-3">
                                                            {product.quantity > 0 ? (
                                                                <div className="flex items-center justify-between text-xs">
                                                                    <span className="text-green-600">In Stock</span>
                                                                    {product.quantity < 10 && (
                                                                        <span className="text-orange-600">
                                                                            Only {product.quantity} left!
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-red-600 text-xs">Out of Stock</span>
                                                            )}
                                                        </div>

                                                        <AddtoCartButton product={product} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        // List View
                                        return (
                                            <div key={product.id} className="group">
                                                <div className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                                    <div className="flex flex-col md:flex-row">
                                                        {/* Image */}
                                                        <div className="md:w-1/4 relative">
                                                            <div className="aspect-square md:h-full overflow-hidden bg-gray-100">
                                                                <img
                                                                    src={`/storage/${imageSrc}`}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = '/otherplaceholder.jpg';
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                                -{discountPercentage}%
                                                            </div>

                                                            {/* Wishlist Button */}
                                                            <div className="absolute top-3 right-3">
                                                                <WishlistButton
                                                                    productId={product.id}
                                                                />
                                                            </div>

                                                            {/* Quick View Overlay for List View */}
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <Link href={`/products/${product.slug}`}>
                                                                    <button className="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors shadow-lg">
                                                                        <BsEye className="inline mr-1" /> Quick View
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="md:w-3/4 p-6">
                                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                                <div className="flex-1">
                                                                    {/* Category */}
                                                                    <div className="mb-2">
                                                                        <span className="text-xs text-gray-500 uppercase tracking-wider">
                                                                            {product.category || 'Uncategorized'}
                                                                        </span>
                                                                    </div>

                                                                    {/* Product Name */}
                                                                    <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                                                        {product.name}
                                                                    </h3>

                                                                    {/* Description */}
                                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                                        {product.description}
                                                                    </p>

                                                                    {/* Rating & Stock */}
                                                                    <div className="flex items-center gap-4 mb-4">
                                                                        <div className="flex items-center">
                                                                            {renderStars(avgRating)}
                                                                            {reviewCount > 0 && (
                                                                                <span className="text-xs text-gray-400 ml-1">
                                                                                    ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className={`inline-flex items-center gap-1 text-sm ${
                                                                            product.inStock ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                            <div className={`w-2 h-2 rounded-full ${
                                                                                product.inStock ? 'bg-green-500' : 'bg-red-500'
                                                                            }`}></div>
                                                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                                        </div>
                                                                    </div>

                                                                    {/* Savings Info */}
                                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                                                        <p className="text-green-700 text-sm">
                                                                            <span className="font-bold">You Save:</span> <FormatPrice price={product.regular_price - displayPrice} /> ({discountPercentage}% off)
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="md:w-48">
                                                                    {/* Price */}
                                                                    <div className="mb-4">
                                                                        <div className="text-2xl font-bold text-orange-600">
                                                                            <FormatPrice price={displayPrice} />
                                                                        </div>
                                                                        <div className="text-sm text-gray-400 line-through">
                                                                            <FormatPrice price={product.regular_price} />
                                                                        </div>
                                                                    </div>

                                                                    {/* Actions */}
                                                                    <AddtoCartButton product={product} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        ) : (
                            // No Results
                            <div className="text-center py-12">
                                <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                                    <FiShoppingBag className="text-orange-500 text-3xl" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    No deals found
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Try adjusting your filters to find more great deals.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSelectedDiscount('all');
                                        setPriceRange([0, 10000]);
                                        setSearchQuery('');
                                        setSortBy('discount-high');
                                    }}
                                    className="px-6 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredProducts.length > 0 && products.last_page > 1 && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        Showing 1-{Math.min(filteredProducts.length, products.per_page)} of {products.total} products
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {/* <Link
                                            href={products.links?.prev || '#'}
                                            className={`px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors ${
                                                !products.links?.prev ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            Previous
                                        </Link> */}

                                        {[...Array(products.last_page)].map((_, i) => {
                                            const page = i + 1;
                                            const isCurrentPage = products.current_page === page;

                                            if (
                                                page === 1 ||
                                                page === products.last_page ||
                                                (page >= products.current_page - 1 && page <= products.current_page + 1)
                                            ) {
                                                return (
                                                    <Link
                                                        key={page}
                                                        href={`?page=${page}`}
                                                        className={`px-3 py-1.5 border border-gray-300 text-sm rounded-md transition-colors ${
                                                            isCurrentPage
                                                                ? 'bg-orange-600 text-white border-orange-600'
                                                                : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {page}
                                                    </Link>
                                                );
                                            } else if (
                                                page === products.current_page - 2 ||
                                                page === products.current_page + 2
                                            ) {
                                                return <span key={page} className="px-2">...</span>;
                                            }
                                            return null;
                                        })}

                                        {/* <Link
                                            href={products.links?.next || '#'}
                                            className={`px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors ${
                                                !products.links?.next ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            Next
                                        </Link> */}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default HotDeals;
