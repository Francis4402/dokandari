import { Head } from '@inertiajs/react';
import { categoryType, PageProps, Product, ReviewType } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import HeroSection from './Components/HeroSection';
import Categories from './Components/Categories';
import Footer from './Components/Footer';
import TrendingProducts from './Components/TrandingProducts';
import DailyDiscover from './Components/DailyDiscover';
import OfferedProducts from './Components/OfferedProducts';
import TopSellingProduct from './Components/TopSellingProduct';
import VendorCTA from './Components/VendorCTA';
import AllProducts from './Components/AllProducts';

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
    productRatings,
    reviews,
}: PageProps<{
    laravelVersion: string,
    phpVersion: string,
    categories: categoryType[],
    products: PaginatedProducts,
    wishlist: any,
    reviews: ReviewType[],
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
            <div className='max-w-[1240px] mx-auto px-8 space-y-20'>
                <HeroSection />
                <Categories categories={categories} />


                {featuredProducts.length > 0 && (
                    <OfferedProducts product={featuredProducts} user={auth.user} />
                )}

                {trandingProducts.length > 0 && (
                    <TrendingProducts trandingproduct={trandingProducts} user={auth.user} />
                )}

                {topSellingProduct.length > 0 && (
                    <TopSellingProduct products={topSellingProduct} user={auth.user} />
                )}

                {dailyDiscoverProduct.length > 0 && (
                    <DailyDiscover discoverProduct={dailyDiscoverProduct} user={auth.user} reviews={reviews} />
                )}

                <AllProducts product={productsWithRatings} user={auth.user} />
            </div>
            <VendorCTA />
            <Footer/>
        </AppLayout>
    );
}
