import { categoryType, PageProps, Product, ReviewType } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
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
    const keyword = 'online shopping Bangladesh, multivendor marketplace, buy online, electronics, fashion, home goods, HaatPoint'
    const Url = 'https://haatpoint.com/';
    const imageUrl = `${Url}og-image.png`;
    const twitterImageUrl = `${Url}summary_large_image.jpg`;
    const currentYear = new Date().getFullYear();

    return (
        <AppLayout user={auth.user} wishlist={wishlist}>
            <SeoHead title={pageTitle} description={pageDescription} keywords={keyword}
                canonical={Url} ogTitle={pageTitle} ogDescription={pageDescription}
                ogUrl={Url} ogImage={imageUrl} twitterTitle={pageTitle}
                twitterDescription={pageDescription} twitterImage={twitterImageUrl}
                jsonLd={[
                    {
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        '@id': `${Url}#organization`,
                        name: 'HaatPoint',
                        url: Url,
                        logo: {
                            '@type': 'ImageObject',
                            url: imageUrl,
                        },
                        sameAs: [
                            'https://www.facebook.com/haatpoint',
                            'https://twitter.com/haatpoint',
                        ],
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        '@id': `${Url}#website`,
                        url: Url,
                        name: 'HaatPoint',
                        publisher: {
                            '@id': `${Url}#organization`,
                        },
                        potentialAction: {
                            '@type': 'SearchAction',
                            target: {
                                '@type': 'EntryPoint',
                                urlTemplate: `${Url}products?search={search_term_string}`,
                            },
                            'query-input': 'required name=search_term_string',
                        },
                    },
                ]}
            >
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
                <meta httpEquiv="Content-Language" content="en" />
                <meta name="author" content="HaatPoint Team" />
                <meta name="copyright" content={`HaatPoint ${currentYear}`} />
                <meta name="revisit-after" content="7 days" />
                <meta name="rating" content="general" />
                <meta name="distribution" content="global" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </SeoHead>

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
                    <DailyDiscover discoverProduct={dailyDiscoverProduct} user={auth.user} />
                )}

                <AllProducts product={productsWithRatings} user={auth.user} />
            </div>
            <VendorCTA />
            <Footer/>
        </AppLayout>
    );
}
