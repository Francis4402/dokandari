import { Head } from '@inertiajs/react';
import { categoryType, PageProps, Product } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import HeroSection from './Components/HeroSection';
import NavRoutes from './Components/NavRoutes';
import Categories from './Components/Categories';
import Footer from './Components/Footer';
import TrendingProducts from './Components/TrandingProducts';
import DailyDiscover from './Components/DailyDiscover';
import CategorySection from './Components/CategorySection';
import OfferedProducts from './Components/OfferedProducts';
import TopSellingProduct from './Components/TopSellingProduct';

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: any[];
    from: number;
    to: number;
}

interface ProductRating {
    average: number;
    count: number;
}

export default function Welcome({
    auth,
    categories,
    products,
    wishlist,
    productRatings
}: PageProps<{
    laravelVersion: string,
    phpVersion: string,
    categories: categoryType,
    products: PaginatedProducts,
    wishlist: any,
    productRatings: Record<string, ProductRating>
}>) {


    const productsData = products.data || [];


    const productsWithRatings = productsData.map(product => {
        const ratingData = productRatings[product.id];

        return {
            ...product,

            rating: ratingData?.average || 0,

            review: ratingData?.count || 0
        };
    });


    const topSellingProduct = productsWithRatings.filter(product =>
        product.product_type?.toLowerCase() === 'top-selling'
    );

    const dailyDiscoverProduct = productsWithRatings.filter(product =>
        product.product_type?.toLowerCase() === 'regular'
    );

    const featuredProducts = productsWithRatings.filter(product =>
        product.product_type?.toLowerCase() === 'featured'
    );

    const trandingProducts = productsWithRatings.filter(product =>
        product.product_type?.toLowerCase() === 'trending'
    );


    return (
        <AppLayout user={auth.user} wishlist={wishlist}>
            <Head title='HaatPoint'>
                <meta name="description" content="Multivendor Store" />
                <meta name="keywords" content={`shop, products, buy online, shopping`} />
                <meta name="robots" content="index, follow" />
            </Head>
            <div className='container mx-auto px-5 md:px-0'>
                <NavRoutes />
                <HeroSection />
                <Categories categorie={categories} />


                {featuredProducts.length > 0 && (
                    <OfferedProducts product={featuredProducts} />
                )}

                {trandingProducts.length > 0 && (
                    <TrendingProducts trandingproduct={trandingProducts} />
                )}

                {topSellingProduct.length > 0 && (
                    <TopSellingProduct products={topSellingProduct} />
                )}

                {dailyDiscoverProduct.length > 0 && (
                    <DailyDiscover discoverProduct={dailyDiscoverProduct} />
                )}

                <CategorySection />
            </div>
            <Footer/>
        </AppLayout>
    );
}
