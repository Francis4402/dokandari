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
  BsArrowRight,
  BsLightning,
  BsFilter,
  BsSearch
} from 'react-icons/bs';
import {
  FiCheckCircle,
  FiPackage
} from 'react-icons/fi';
import {
  RiDiscountPercentLine,
  RiShoppingBagLine
} from "react-icons/ri";
import {
  MdOutlineNewReleases,
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
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [showFilters, setShowFilters] = useState(false);

    // Get unique categories
    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

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
            id: 'all',
            label: 'All Products',
            icon: <RiShoppingBagLine className="text-lg" />,
        },
        {
            id: 'featured',
            label: 'Featured',
            icon: <TbSparkles className="text-lg" />,
        },
        {
            id: 'newest',
            label: 'New Arrivals',
            icon: <MdOutlineNewReleases className="text-lg" />,
        },
        {
            id: 'discount',
            label: 'On Sale',
            icon: <RiDiscountPercentLine className="text-lg" />,
        },
        {
            id: 'rating',
            label: 'Top Rated',
            icon: <BsStarFill className="text-lg" />,
        },
    ];

    // Sort options
    const sortOptions = [
        { id: 'default', label: 'Default' },
        { id: 'price-low', label: 'Price: Low to High' },
        { id: 'price-high', label: 'Price: High to Low' },
        { id: 'name', label: 'Name: A to Z' },
        { id: 'rating', label: 'Highest Rated' },
        { id: 'newest', label: 'Newest First' },
    ];

    // Apply filtering and sorting
    const filteredProducts = React.useMemo(() => {
        let filtered = [...products];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Active filter
        switch (activeFilter) {
            case 'featured':
                filtered = filtered.filter(p => p.product_type);
                break;
            case 'newest':
                filtered = filtered.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
                break;
            case 'discount':
                filtered = filtered.filter(p => p.sale_price && parseFloat(p.sale_price) < parseFloat(p.regular_price));
                break;
            case 'rating':
                filtered = filtered.filter(p => (p.rating || 0) >= 4);
                break;
        }

        // Price range filter
        filtered = filtered.filter(product => {
            const price = parseFloat(product.sale_price || product.regular_price);
            return price >= priceRange[0] && price <= priceRange[1];
        });

        return filtered;
    }, [products, searchQuery, selectedCategory, activeFilter, priceRange]);

    // Stats
    const totalProducts = products.length;
    const onSaleCount = products.filter(p => p.sale_price && parseFloat(p.sale_price) < parseFloat(p.regular_price)).length;
    const averageRating = (products.reduce((acc, p) => acc + (p.rating || 0), 0) / products.length || 0).toFixed(1);

    return (
        <AppLayout user={auth.user}>
            <Head title="All Products | E-Commerce Store" />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2070')] opacity-10 bg-cover bg-center" />
                <div className="container relative mx-auto px-4 py-16">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                            <TbSparkles className="text-yellow-300" />
                            <span className="text-sm font-bold">EXPLORE OUR COLLECTION</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            Discover Amazing Products
                        </h1>
                        <p className="text-xl text-white/80 mb-8">
                            Browse through our complete collection of {totalProducts} premium products
                        </p>
                        <div className="relative max-w-xl">
                            <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* Stats Bar */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-4 justify-between items-center">
                            <div className="text-slate-600">
                                Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> of {totalProducts} products
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex items-center gap-2">
                                    <span className="text-slate-600">Sort by:</span>
                                    <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500">
                                        {sortOptions.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-3 rounded-xl transition-all ${
                                            viewMode === 'grid'
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                        }`}
                                    >
                                        <BsGrid className="text-lg" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-3 rounded-xl transition-all ${
                                            viewMode === 'list'
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                        }`}
                                    >
                                        <BsList className="text-lg" />
                                    </button>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-700"
                                    >
                                        <BsFilter />
                                        <span className="hidden sm:inline">Filters</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        {showFilters && (
                            <div className="lg:w-1/4">
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 sticky top-8">
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <BsFilter />
                                            Filters
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-semibold text-slate-700 mb-3">Categories</h4>
                                                <div className="space-y-2">
                                                    {categories.map(category => (
                                                        <button
                                                            key={category}
                                                            onClick={() => setSelectedCategory(category)}
                                                            className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${
                                                                selectedCategory === category
                                                                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 border border-purple-200'
                                                                    : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                                                            }`}
                                                        >
                                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-slate-700 mb-3">Price Range</h4>
                                                <div className="px-2">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="10000"
                                                        step="100"
                                                        value={priceRange[1]}
                                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                    <div className="flex justify-between mt-3">
                                                        <span className="text-sm text-slate-600">BDT {priceRange[0]}</span>
                                                        <span className="text-sm text-slate-600">BDT {priceRange[1]}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-slate-700 mb-3">Product Status</h4>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                                                        <span className="text-slate-600">In Stock</span>
                                                    </label>
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                                                        <span className="text-slate-600">On Sale</span>
                                                    </label>
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                                                        <span className="text-slate-600">Featured</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setSelectedCategory('all');
                                            setPriceRange([0, 10000]);
                                            setSearchQuery('');
                                            setActiveFilter('all');
                                        }}
                                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Main Content */}
                        <div className={`${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
                            {/* Filter Pills */}
                            <div className="mb-6 overflow-x-auto pb-4">
                                <div className="flex gap-3 min-w-max">
                                    {filterOptions.map((filter) => (
                                        <button
                                            key={filter.id}
                                            onClick={() => setActiveFilter(filter.id)}
                                            className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${
                                                activeFilter === filter.id
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-purple-50'
                                            }`}
                                        >
                                            {filter.icon}
                                            <span className="font-medium">{filter.label}</span>
                                            {activeFilter === filter.id && (
                                                <FiCheckCircle className="text-white" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Products Grid/List */}
                            {filteredProducts.length > 0 ? (
                                <div className={`
                                    ${viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                        : 'space-y-4'
                                    }
                                `}>
                                    {filteredProducts.map((product: Product) => {
                                        const imageSrc = getImageSrc(product.images);
                                        const hasDiscount = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
                                        const discountPercentage = hasDiscount
                                            ? calculateDiscount(product.regular_price, product.sale_price)
                                            : 0;
                                        const productId = parseInt(product.id);
                                        const isWishlisted = wishlist.includes(productId);
                                        const finalPrice = product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.regular_price);

                                        if (viewMode === 'grid') {
                                            return (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.id}`}
                                                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200"
                                                >
                                                    {/* Image Container */}
                                                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                                                        <img
                                                            src={`/product_images/${imageSrc}`}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                        {hasDiscount && (
                                                            <div className="absolute top-3 left-3">
                                                                <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                                                    <BsLightning />
                                                                    {discountPercentage}% OFF
                                                                </span>
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={(e) => toggleWishlist(productId, e)}
                                                            className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
                                                        >
                                                            {isWishlisted ? (
                                                                <BsHeartFill className="text-red-500" />
                                                            ) : (
                                                                <BsHeart className="text-slate-500 group-hover:text-red-500" />
                                                            )}
                                                        </button>
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="p-4">
                                                        <div className="mb-2">
                                                            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                                                {product.category || 'Uncategorized'}
                                                            </span>
                                                        </div>
                                                        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                                            {product.description}
                                                        </p>

                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="font-bold text-lg text-slate-900">
                                                                    {formatPrice(finalPrice)}
                                                                </div>
                                                                {hasDiscount && (
                                                                    <div className="text-sm text-slate-400 line-through">
                                                                        {formatPrice(parseFloat(product.regular_price))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-md transition-all">
                                                                <BsArrowRight />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        } else {
                                            // List View
                                            return (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.id}`}
                                                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 flex"
                                                >
                                                    <div className="w-1/4 min-w-[200px]">
                                                        <div className="relative h-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                                                            <img
                                                                src={`/product_images/${imageSrc}`}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            />
                                                            {hasDiscount && (
                                                                <div className="absolute top-3 left-3">
                                                                    <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                                                        <BsLightning />
                                                                        {discountPercentage}% OFF
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="w-3/4 p-6 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div>
                                                                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded mb-2 inline-block">
                                                                        {product.category || 'Uncategorized'}
                                                                    </span>
                                                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors mb-2">
                                                                        {product.name}
                                                                    </h3>
                                                                    <p className="text-slate-600 mb-4 line-clamp-2">
                                                                        {product.description}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => toggleWishlist(productId, e)}
                                                                    className="p-3 hover:bg-red-50 rounded-full transition-colors"
                                                                >
                                                                    {isWishlisted ? (
                                                                        <BsHeartFill className="text-red-500" />
                                                                    ) : (
                                                                        <BsHeart className="text-slate-400 hover:text-red-500" />
                                                                    )}
                                                                </button>
                                                            </div>

                                                            <div className="flex items-center gap-6">
                                                                {renderStars(product.rating || 0)}
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                                    <span className="text-sm text-emerald-600 font-medium">In Stock</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                                            <div>
                                                                <div className="text-2xl font-bold text-slate-900">
                                                                    {formatPrice(finalPrice)}
                                                                </div>
                                                                {hasDiscount && (
                                                                    <div className="text-base text-slate-400 line-through">
                                                                        {formatPrice(parseFloat(product.regular_price))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        }
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="max-w-md mx-auto">
                                        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                                            <FiPackage size={64} className="text-purple-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                            No Products Found
                                        </h3>
                                        <p className="text-slate-600 mb-6">
                                            Try adjusting your search or filter criteria
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSelectedCategory('all');
                                                setPriceRange([0, 10000]);
                                                setSearchQuery('');
                                                setActiveFilter('all');
                                            }}
                                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Pagination */}
                            {filteredProducts.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-slate-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="text-slate-600">
                                            Page 1 of {Math.ceil(filteredProducts.length / 12)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all">
                                                Previous
                                            </button>
                                            <button className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold">
                                                1
                                            </button>
                                            <button className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all">
                                                2
                                            </button>
                                            <button className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all">
                                                3
                                            </button>
                                            <button className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all">
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-t border-slate-200 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">
                            Can't find what you're looking for?
                        </h3>
                        <p className="text-slate-600 mb-8">
                            Contact our support team for personalized assistance
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                                Contact Support
                            </button>
                            <button className="px-8 py-3 bg-white text-slate-700 border border-slate-300 rounded-xl font-semibold hover:bg-slate-50 transition-all">
                                Request Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Products;
