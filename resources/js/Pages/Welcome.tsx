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



export default function Welcome({ auth, categories, products }: PageProps<{ laravelVersion: string, phpVersion: string, categories: categoryType, products: Product[] }>) {
    return (
        <AppLayout user={auth.user}>
            <Head title='Dokandari'>
                <meta name="description" content="Multivendor Store" />
                <meta name="keywords" content={`shop, products, buy online, shopping`} />
                <meta name="robots" content="index, follow" />
            </Head>
            <div className='container mx-auto px-5 md:px-0'>
                <NavRoutes />
                <HeroSection />
                <Categories categorie={categories} />
                <OfferedProducts product={products} />
                <TrendingProducts trandingproduct = {products} />
                <DailyDiscover discoverProduct = {products} />
                <CategorySection />
            </div>
            <Footer/>
        </AppLayout>
    );
}
