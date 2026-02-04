import { Head } from '@inertiajs/react';
import { categoryType, PageProps, Product, storeType } from '@/types';
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



export default function Welcome({ auth, categories, products }: PageProps<{ laravelVersion: string, phpVersion: string, categories: categoryType, products: Product[], stores: storeType[] }>) {

    const topSellingProduct = products.filter(product =>
        product.product_type?.toLowerCase() === 'top-selling'
    );

    const dailyDiscoverProduct = products.filter(product =>
        product.product_type?.toLowerCase() === 'regular'
    );

    const featuredProducts = products.filter(product =>
        product.product_type?.toLowerCase() === 'featured'
    );

    const trandingProducts = products.filter(product =>
        product.product_type?.toLowerCase() === 'trending'
    );


    return (
        <AppLayout user={auth.user}>
            <Head title='HaatPoint'>
                <meta name="description" content="Multivendor Store" />
                <meta name="keywords" content={`shop, products, buy online, shopping`} />
                <meta name="robots" content="index, follow" />
            </Head>
            <div className='container mx-auto px-5 md:px-0'>
                <NavRoutes />
                <HeroSection />
                <Categories categorie={categories} />
                {
                    featuredProducts.length > 0 && (
                        <OfferedProducts product={featuredProducts} />
                    )
                }
                {
                    trandingProducts.length > 0 && (
                        <TrendingProducts trandingproduct = {trandingProducts} />
                    )
                }
                {
                    topSellingProduct.length > 0 && (
                        <TopSellingProduct products = {topSellingProduct} />
                    )
                }

                <DailyDiscover discoverProduct = {dailyDiscoverProduct} />
                <CategorySection />
            </div>
            <Footer/>
        </AppLayout>
    );
}
