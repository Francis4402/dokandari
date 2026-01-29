import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps, Product } from '@/types';
import { BsStar } from 'react-icons/bs';

interface ProductsPageProps {
    products: Product[];
}

const Products = ({ products }: ProductsPageProps) => {
    // Format price
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Render star ratings
    const renderStars = (rating: number): JSX.Element => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <BsStar
                        key={i}
                        size={14}
                        className={i < (rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                ))}
                <span className="ml-1 text-sm text-gray-600">({rating || 0})</span>
            </div>
        );
    };

    // Get product type display name
    const getProductTypeDisplay = (type: string): string => {
        return type.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <div>
            <Head title="All Products" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
                    <p className="text-gray-600 mt-2">Browse our complete collection</p>
                </div>

                {/* Products Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {products.length} products
                    </p>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product: Product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Product Image */}
                                <div className="aspect-square overflow-hidden bg-gray-100">
                                    <img
                                        src={`/product_images/${product.images}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    {/* Rating */}
                                    {renderStars(product.rating || 0)}

                                    {/* Price */}
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xl font-bold text-gray-900">
                                            {formatPrice(product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.regular_price))}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                                            {getProductTypeDisplay(product.product_type)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <BsStar size={64} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No products available
                        </h3>
                        <p className="text-gray-600">
                            Check back later for new products
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
