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

    const pageTitle = 'HaatPoint - Bangladesh&apos;s Premier Marketplace';
    const pageDescription = 'Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.';
    const keyword = 'online shopping Bangladesh, multivendor marketplace, buy online, electronics, fashion, home goods, HaatPoint';
    const Url = 'https://www.haatpoint.com/';
    const currentYear = new Date().getFullYear();

    return (
        <AppLayout user={auth.user} wishlist={wishlist}>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription}/>
                <meta name="keywords" content={keyword} />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
                <meta httpEquiv="Content-Language" content="en" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link rel="canonical" href={Url} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={Url} />
                <meta property="og:site_name" content={'HaatPoint'} />
                <meta property="og:image" content="/og-image.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:locale" content="en_US" />
                <meta name="twitter:card" content="/summary_large_image.jpg" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content="/summary_large_image.jpg" />
                <meta name="author" content="HaatPoint Team" />
                <meta name="copyright" content={`HaatPoint ${currentYear}`} />
                <meta name="revisit-after" content="7 days" />
                <meta name="rating" content="general" />
                <meta name="distribution" content="global" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </Head>
            <div className='max-w-[1240px] mx-auto px-8 space-y-20'>
                <HeroSection />

                {/* Only render Categories if categories exists and has data */}
                {categories && categories.length > 0 && (
                    <Categories categories={categories} />
                )}

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
                    <DailyDiscover discoverProduct={dailyDiscoverProduct} user={auth.user} />
                )}

                {/* Only render AllProducts if productsWithRatings has data */}
                {productsWithRatings.length > 0 && (
                    <AllProducts product={productsWithRatings} user={auth.user} />
                )}
            </div>
            <VendorCTA />
            <Footer/>
        </AppLayout>
    );
}
