import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Product } from '@/types';
import {
  BsStar,
  BsStarFill,
  BsFilter,
  BsSearch,
  BsChevronRight,
  BsGrid3X3Gap,
  BsEye,
  BsLightning
} from 'react-icons/bs';
import {
  FiShoppingBag,
  FiTag,
  FiStar,
  FiTruck,
  FiCheck,
  FiGrid
} from 'react-icons/fi';
import {
  RiFireFill,
  RiNewspaperLine,
  RiStarSFill
} from 'react-icons/ri';
import AppLayout from '@/Layouts/AppLayout';
import AddtoCartButton from '../buttons/AddtoCartButton';
import WishlistButton from '../buttons/WishlistButton';


interface ProductsPageProps {
    products: Product[];
    auth?: {
        user?: any;
    };
    wishlist: any
}

const Products = ({ products, auth, wishlist }: ProductsPageProps) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [sortBy, setSortBy] = useState('default');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [productType, setProductType] = useState<string>('all');


    // Get unique categories
    const categories = useMemo(() => {
        const uniqueCategories = new Set(products.map(p => p.category).filter(Boolean));
        return ['all', ...uniqueCategories];
    }, [products]);

    // Product type options
    const productTypes = [
        { id: 'all', label: 'All Products', icon: <FiGrid /> },
        { id: 'featured', label: 'Featured', icon: <RiStarSFill /> },
        { id: 'trending', label: 'Trending', icon: <RiFireFill /> },
        { id: 'top-selling', label: 'Top Selling', icon: <FiStar /> },
        { id: 'new-arrival', label: 'New Arrivals', icon: <RiNewspaperLine /> },
        { id: 'on-sale', label: 'On Sale', icon: <FiTag /> },
    ];

    // Format price
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Calculate discount percentage
    const calculateDiscount = (regularPrice: number, salePrice?: number): number => {
        if (!salePrice || salePrice >= regularPrice) return 0;
        return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
    };


    const renderStars = (rating: number | string | undefined): JSX.Element => {

        const numericRating = typeof rating === 'string'
            ? parseFloat(rating)
            : typeof rating === 'number'
                ? rating
                : 0;

        // Ensure it's a valid number
        const validRating = isNaN(numericRating) ? 0 : numericRating;

        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xs">
                        {i < Math.floor(validRating) ? (
                            <BsStarFill className="text-amber-400" />
                        ) : (
                            <BsStar className="text-gray-300" />
                        )}
                    </span>
                ))}
                <span className="ml-1 text-xs text-gray-500">
                    ({validRating.toFixed(1)})
                </span>
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
        { id: 'default', label: 'Default sorting' },
        { id: 'popularity', label: 'Sort by popularity' },
        { id: 'rating', label: 'Sort by average rating' },
        { id: 'date', label: 'Sort by latest' },
        { id: 'price-low', label: 'Sort by price: low to high' },
        { id: 'price-high', label: 'Sort by price: high to low' },
    ];


    const filteredProducts = useMemo(() => {
        let filtered = [...products];

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

        // Product type filter
        if (productType !== 'all') {
            if (productType === 'on-sale') {
                filtered = filtered.filter(product =>
                    product.sale_price && product.sale_price < product.regular_price
                );
            } else {
                filtered = filtered.filter(product => product.product_type === productType);
            }
        }

        // Price range filter
        filtered = filtered.filter(product => {
            const price = product.sale_price || product.regular_price;
            return price >= priceRange[0] && price <= priceRange[1];
        });


        switch (sortBy) {
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
                    const ratingA = typeof a.rating === 'string' ? parseFloat(a.rating) : a.rating || 0;
                    const ratingB = typeof b.rating === 'string' ? parseFloat(b.rating) : b.rating || 0;
                    return ratingB - ratingA;
                });
                break;
            case 'date':
                filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            case 'popularity':
                filtered.sort((a, b) => {
                    const reviewA = a.review || 0;
                    const reviewB = b.review || 0;
                    return reviewB - reviewA;
                });
                break;
            default:

                break;
        }

        return filtered;
    }, [products, searchQuery, selectedCategory, productType, priceRange, sortBy]);

    // Stats
    const totalProducts = products.length;


    return (
        <AppLayout user={auth?.user} wishlist={wishlist}>
            <Head title="Products | Shop" />

            {/* Page Header */}
            <div className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">All Products</h1>
                            <p className="text-gray-600 text-sm">
                                Browse our premium collection of {totalProducts} products
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full md:w-64"
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

                    {/* Breadcrumb */}
                    <nav className="text-sm text-gray-600">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link href="/" className="hover:text-blue-600">Home</Link>
                            </li>
                            <li><BsChevronRight className="text-gray-400 text-xs" /></li>
                            <li className="text-gray-900 font-medium">Shop</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Product Type Filter Bar */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="flex overflow-x-auto py-3 gap-2">
                        {productTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setProductType(type.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                                    productType === type.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span className="text-sm">{type.icon}</span>
                                <span className="text-sm font-medium">{type.label}</span>
                                {type.id === 'all' && (
                                    <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
                                        {totalProducts}
                                    </span>
                                )}
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
                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    Categories
                                </h3>
                                <div className="space-y-1">
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`block w-full text-left py-2 px-3 rounded-md text-sm ${
                                                selectedCategory === category
                                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{category === 'all' ? 'All Categories' : category}</span>
                                                <span className="text-xs text-gray-400">
                                                    ({products.filter(p => category === 'all' || p.category === category).length})
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filter by Price */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    Filter by Price
                                </h3>
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="100"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">৳{priceRange[0]}</span>
                                        <span className="text-sm text-gray-600">৳{priceRange[1]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sort by */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    Sort by
                                </h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Product Status */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    Product Status
                                </h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="text-sm text-gray-600">In stock only</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setProductType('on-sale');
                                                } else {
                                                    setProductType('all');
                                                }
                                            }}
                                            checked={productType === 'on-sale'}
                                        />
                                        <span className="text-sm text-gray-600">On sale</span>
                                    </label>
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <button
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setPriceRange([0, 10000]);
                                    setSearchQuery('');
                                    setProductType('all');
                                    setSortBy('default');
                                }}
                                className="w-full mt-6 py-2.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>

                        {/* Store Info */}
                        <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <FiTruck className="text-blue-600" />
                                <h4 className="font-medium text-gray-900">Free Shipping</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Free shipping on all orders over ৳1000
                            </p>
                            <div className="flex items-center gap-3">
                                <FiCheck className="text-green-600" />
                                <h4 className="font-medium text-gray-900">Secure Payment</h4>
                            </div>
                            <p className="text-sm text-gray-600">
                                100% secure payment with SSL encryption
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div className="text-gray-600 text-sm">
                                Showing <span className="font-medium text-gray-900">{filteredProducts.length}</span> products
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
                                    const hasDiscount = product.sale_price && product.sale_price < product.regular_price;
                                    const discountPercentage = hasDiscount
                                        ? calculateDiscount(product.regular_price, product.sale_price)
                                        : 0;
                                    const finalPrice = product.sale_price || product.regular_price;


                                    if (viewMode === 'grid') {
                                        return (
                                            <div key={product.id} className="group">
                                                <div
                                                    className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                                >
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

                                                        {/* Badges */}
                                                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                                                            {hasDiscount && (
                                                                <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                                    <BsLightning className="text-xs" />
                                                                    -{discountPercentage}%
                                                                </span>
                                                            )}
                                                            {product.product_type === 'new-arrival' && (
                                                                <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                                    New
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Wishlist Button */}
                                                        <WishlistButton productId={product.id} />

                                                        {/* Quick View Overlay */}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Link href={`/products/${product.slug}`}>
                                                                <button className="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
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
                                                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                            {product.name}
                                                        </h3>

                                                        {/* Rating */}
                                                        <div className="mb-3">
                                                            {renderStars(product.rating)}
                                                        </div>

                                                        {/* Price */}
                                                        <div className="mb-3">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <span className="font-bold text-gray-900">
                                                                        {formatPrice(finalPrice)}
                                                                    </span>
                                                                    {hasDiscount && (
                                                                        <span className="ml-2 text-sm text-gray-400 line-through">
                                                                            {formatPrice(product.regular_price)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
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
                                                <div
                                                    className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex flex-col md:flex-row">
                                                        {/* Image */}
                                                        <div className="md:w-1/4 relative">
                                                            <div className="aspect-square md:h-full overflow-hidden bg-gray-100">
                                                                <img
                                                                    src={`/storage/${imageSrc}`}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
                                                                    }}
                                                                />
                                                            </div>
                                                            {hasDiscount && (
                                                                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                                    -{discountPercentage}%
                                                                </span>
                                                            )}
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
                                                                    <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                                        {product.name}
                                                                    </h3>

                                                                    {/* Description */}
                                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                                        {product.description}
                                                                    </p>

                                                                    {/* Rating & Stock */}
                                                                    <div className="flex items-center gap-4 mb-4">
                                                                        {renderStars(product.rating)}
                                                                        <div className={`inline-flex items-center gap-1 text-sm ${
                                                                            product.inStock ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                            <div className={`w-2 h-2 rounded-full ${
                                                                                product.inStock ? 'bg-green-500' : 'bg-red-500'
                                                                            }`}></div>
                                                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="md:w-48">
                                                                    {/* Price */}
                                                                    <div className="mb-4">
                                                                        <div className="text-2xl font-bold text-gray-900">
                                                                            {formatPrice(finalPrice)}
                                                                        </div>
                                                                        {hasDiscount && (
                                                                            <div className="text-sm text-gray-400 line-through">
                                                                                {formatPrice(product.regular_price)}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Actions - Using AddtoCartButton */}
                                                                    <div className="flex items-center gap-2">
                                                                        <AddtoCartButton product={product} />
                                                                        <WishlistButton productId={product.id} />
                                                                    </div>
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
                                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <FiShoppingBag className="text-gray-400 text-3xl" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Try adjusting your search or filter to find what you're looking for.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setPriceRange([0, 10000]);
                                        setSearchQuery('');
                                        setProductType('all');
                                        setSortBy('default');
                                    }}
                                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredProducts.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        Showing 1-{Math.min(filteredProducts.length, 12)} of {filteredProducts.length} products
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                                            Previous
                                        </button>
                                        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md">
                                            1
                                        </button>
                                        <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                                            2
                                        </button>
                                        <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                                            3
                                        </button>
                                        <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                                            Next
                                        </button>
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

export default Products;
