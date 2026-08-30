<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Store;
use Illuminate\Http\Request;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use Carbon\Carbon;

class SitemapController extends Controller
{
    public function index()
    {
        $sitemap = Sitemap::create();

        // Static pages with proper priorities and change frequencies
        $staticPages = [
            '/' => ['priority' => 1.0, 'frequency' => Url::CHANGE_FREQUENCY_DAILY],
            '/products' => ['priority' => 0.9, 'frequency' => Url::CHANGE_FREQUENCY_DAILY],
            '/stores' => ['priority' => 0.8, 'frequency' => Url::CHANGE_FREQUENCY_WEEKLY],
            '/contactus' => ['priority' => 0.5, 'frequency' => Url::CHANGE_FREQUENCY_MONTHLY],
            '/aboutus' => ['priority' => 0.5, 'frequency' => Url::CHANGE_FREQUENCY_MONTHLY],
            '/track-order' => ['priority' => 0.3, 'frequency' => Url::CHANGE_FREQUENCY_YEARLY],
        ];

        foreach ($staticPages as $path => $config) {
            $sitemap->add(
                Url::create($path)
                    ->setPriority($config['priority'])
                    ->setChangeFrequency($config['frequency'])
                    ->setLastModificationDate(Carbon::now())
            );
        }

        // Product category pages (if you have categories)
        // $categories = Category::all();
        // foreach ($categories as $category) {
        //     $sitemap->add(
        //         Url::create(route('products.by.category', $category->slug))
        //             ->setPriority(0.7)
        //             ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
        //             ->setLastModificationDate($category->updated_at ?? Carbon::now())
        //     );
        // }

        // Products with proper SEO attributes
        Products::select('id', 'slug', 'updated_at', 'name')
            ->where('inStock', true) // Only include in-stock products
            ->chunk(200, function ($products) use ($sitemap) {
                foreach ($products as $product) {
                    $sitemap->add(
                        Url::create(route('products.details', $product->id))
                            ->setLastModificationDate($product->updated_at ?? Carbon::now())
                            ->setPriority(0.8)
                            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
                    );
                }
            });

        // Stores with proper SEO attributes
        Store::select('id', 'updated_at', 'name')
            ->where('is_active', true) // Only active stores
            ->chunk(200, function ($stores) use ($sitemap) {
                foreach ($stores as $store) {
                    $sitemap->add(
                        Url::create(route('stores.show', $store->id))
                            ->setLastModificationDate($store->updated_at ?? Carbon::now())
                            ->setPriority(0.7)
                            ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    );
                }
            });

        // Product type pages (if you have product types)
        $productTypes = ['top-selling', 'trending', 'featured', 'new-arrival'];
        foreach ($productTypes as $type) {
            $sitemap->add(
                Url::create("/products/{$type}")
                    ->setPriority(0.6)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
                    ->setLastModificationDate(Carbon::now())
            );
        }

        return $sitemap->toResponse(request());
    }

    /**
     * Generate sitemap index for large datasets
     */
    public function sitemapIndex()
    {
        $sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $sitemapIndex .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // Main sitemap
        $sitemapIndex .= '  <sitemap>' . "\n";
        $sitemapIndex .= '    <loc>' . url('/sitemap.xml') . '</loc>' . "\n";
        $sitemapIndex .= '    <lastmod>' . Carbon::now()->toDateString() . '</lastmod>' . "\n";
        $sitemapIndex .= '  </sitemap>' . "\n";

        // Product sitemaps (paginated)
        $totalProducts = Products::where('inStock', true)->count();
        $perPage = 1000;
        $totalPages = ceil($totalProducts / $perPage);

        for ($i = 1; $i <= $totalPages; $i++) {
            $sitemapIndex .= '  <sitemap>' . "\n";
            $sitemapIndex .= '    <loc>' . url("/sitemap-products-{$i}.xml") . '</loc>' . "\n";
            $sitemapIndex .= '    <lastmod>' . Carbon::now()->toDateString() . '</lastmod>' . "\n";
            $sitemapIndex .= '  </sitemap>' . "\n";
        }

        // Store sitemaps
        $totalStores = Store::where('is_active', true)->count();
        $totalStorePages = ceil($totalStores / $perPage);

        for ($i = 1; $i <= $totalStorePages; $i++) {
            $sitemapIndex .= '  <sitemap>' . "\n";
            $sitemapIndex .= '    <loc>' . url("/sitemap-stores-{$i}.xml") . '</loc>' . "\n";
            $sitemapIndex .= '    <lastmod>' . Carbon::now()->toDateString() . '</lastmod>' . "\n";
            $sitemapIndex .= '  </sitemap>' . "\n";
        }

        $sitemapIndex .= '</sitemapindex>';

        return response($sitemapIndex, 200)
            ->header('Content-Type', 'application/xml');
    }

    /**
     * Paginated product sitemap
     */
    public function productSitemap($page = 1)
    {
        $perPage = 1000;
        $products = Products::where('inStock', true)
            ->select('id', 'slug', 'updated_at', 'name')
            ->paginate($perPage, ['*'], 'page', $page);

        $sitemap = Sitemap::create();

        foreach ($products as $product) {
            $sitemap->add(
                Url::create(route('products.details', $product->id))
                    ->setLastModificationDate($product->updated_at ?? Carbon::now())
                    ->setPriority(0.8)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            );
        }

        return $sitemap->toResponse(request());
    }

    /**
     * Paginated store sitemap
     */
    public function storeSitemap($page = 1)
    {
        $perPage = 1000;
        $stores = Store::where('is_active', true)
            ->select('id', 'updated_at', 'name')
            ->paginate($perPage, ['*'], 'page', $page);

        $sitemap = Sitemap::create();

        foreach ($stores as $store) {
            $sitemap->add(
                Url::create(route('stores.show', $store->id))
                    ->setLastModificationDate($store->updated_at ?? Carbon::now())
                    ->setPriority(0.7)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
            );
        }

        return $sitemap->toResponse(request());
    }

    /**
     * Generate sitemap for images (for Google Image Search)
     */
    public function imageSitemap()
    {
        $xml = new \XMLWriter();
        $xml->openMemory();
        $xml->setIndent(true);
        $xml->startDocument('1.0', 'UTF-8');
        $xml->startElement('urlset');
        $xml->writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
        $xml->writeAttribute('xmlns:image', 'http://www.google.com/schemas/sitemap-image/1.1');

        Products::where('inStock', true)
            ->select('id', 'name', 'images', 'updated_at')
            ->chunk(100, function ($products) use ($xml) {
                foreach ($products as $product) {
                    $images = json_decode($product->images, true) ?? [];

                    if (empty($images)) {
                        continue;
                    }

                    $xml->startElement('url');
                    $xml->writeElement('loc', route('products.details', $product->id));
                    $xml->writeElement('lastmod', $product->updated_at?->toDateString() ?? Carbon::now()->toDateString());

                    // Add each image
                    foreach ($images as $image) {
                        $xml->startElement('image:image');
                        $xml->writeElement('image:loc', $this->getFullImageUrl($image));
                        $xml->writeElement('image:title', $product->name);
                        $xml->writeElement('image:caption', "Buy {$product->name} at HaatPoint");
                        $xml->endElement();
                    }

                    $xml->endElement();
                }
            });

        $xml->endElement();
        $xml->endDocument();

        return response($xml->outputMemory(), 200)
            ->header('Content-Type', 'application/xml');
    }

    /**
     * Get full image URL
     */
    private function getFullImageUrl($image)
    {
        if (filter_var($image, FILTER_VALIDATE_URL)) {
            return $image;
        }

        return asset('storage/' . $image);
    }
}
