<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Store;
use Illuminate\Http\Request;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapController extends Controller
{
    public function index()
    {
        $sitemap = Sitemap::create();

        $sitemap->add(Url::create('/')->setPriority(1.0));
        $sitemap->add(Url::create('/products')->setPriority(0.9));
        $sitemap->add(Url::create('/stores')->setPriority(0.8));
        $sitemap->add(Url::create('/contactus')->setPriority(0.5));
        $sitemap->add(Url::create('/aboutus')->setPriority(0.5));
        $sitemap->add(Url::create('/track-order')->setPriority(0.3));

        Products::select('id', 'updated_at')->chunk(200, function ($products) use ($sitemap) {
            foreach ($products as $product) {
                $sitemap->add(
                    Url::create(route('products.details', $product->id))
                        ->setLastModificationDate($product->updated_at)
                        ->setPriority(0.8)
                );
            }
        });

        Store::select('id', 'updated_at')->chunk(200, function ($stores) use ($sitemap) {
            foreach ($stores as $store) {
                $sitemap->add(
                    Url::create(route('stores.show', $store->id))
                        ->setLastModificationDate($store->updated_at)
                        ->setPriority(0.7)
                );
            }
        });

        return $sitemap->toResponse(request());
    }
}
