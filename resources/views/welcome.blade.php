<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">

    {{-- Basic SEO Meta Tags --}}
    <title>HaatPoint - Bangladesh's Premier Marketplace</title>
    <meta name="description" content="Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.">
    <meta name="keywords" content="online shopping Bangladesh, multivendor marketplace, buy online, electronics, fashion, home goods, HaatPoint">
    <meta name="robots" content="index, follow">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta http-equiv="Content-Language" content="en">

    {{-- Favicon and Manifest --}}
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="manifest" href="/site.webmanifest">

    {{-- Canonical URL --}}
    <link rel="canonical" href="https://haatpoint.com/">

    {{-- Open Graph Meta Tags --}}
    <meta property="og:title" content="HaatPoint - Bangladesh's Premier Marketplace">
    <meta property="og:description" content="Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://haatpoint.com/">
    <meta property="og:site_name" content="HaatPoint">
    <meta property="og:image" content="/og-image.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="en_US">

    {{-- Twitter Card Meta Tags --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="HaatPoint - Bangladesh's Premier Marketplace">
    <meta name="twitter:description" content="Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.">
    <meta name="twitter:image" content="/summary_large_image.jpg">

    {{-- Additional Meta Tags --}}
    <meta name="author" content="HaatPoint Team">
    <meta name="copyright" content="HaatPoint {{ date('Y') }}">
    <meta name="revisit-after" content="7 days">
    <meta name="rating" content="general">
    <meta name="distribution" content="global">

    {{-- Font Preconnect --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    {{-- Vite Assets --}}
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="antialiased">
    @inertia
</body>
</html>
