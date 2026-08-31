import { useEffect, useRef, lazy, Suspense, useState } from "react";
import { Link } from "@inertiajs/react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Lazy load icons with fallback
const FaArrowRight = lazy(() =>
  import('react-icons/fa').then(module => ({ default: module.FaArrowRight }))
);
const FaTruck = lazy(() =>
  import('react-icons/fa').then(module => ({ default: module.FaTruck }))
);
const FaShieldAlt = lazy(() =>
  import('react-icons/fa').then(module => ({ default: module.FaShieldAlt }))
);

const collage = [
  { emoji: "👕", c1: "#FF5A1F", c2: "#D6430E", alt: "Clothing" },
  { emoji: "📱", c1: "#0E6E5B", c2: "#0A5346", alt: "Electronics" },
  { emoji: "🥭", c1: "#FFC53D", c2: "#E8A400", alt: "Fresh produce" },
  { emoji: "👟", c1: "#2B2A2E", c2: "#111013", alt: "Footwear" },
];

// Icon fallback component
const IconFallback = ({ className, ariaHidden = true }: { className?: string; ariaHidden?: boolean }) => (
  <span className={className} aria-hidden={ariaHidden}>✦</span>
);

// Lazy load logo with react-lazy-load-image-component
const LazyLogo = () => (
  <LazyLoadImage
    src="/MyLogo.png"
    alt="Haatpoint"
    effect="blur"
    wrapperClassName="h-[34px] w-auto"
    className="h-[34px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
    placeholderSrc="/MyLogo-placeholder.png" // Optional: add a placeholder image
    threshold={100} // Start loading when within 100px of viewport
    visibleByDefault={false}
  />
);

export default function Hero() {
  const scope = useRef<HTMLElement | null>(null);
  const [animationsLoaded, setAnimationsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for lazy loading animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (scope.current) {
      observer.observe(scope.current);
    }

    return () => observer.disconnect();
  }, []);

  // Lazy load GSAP animations
  useEffect(() => {
    let animationTimeline: { kill: () => void } | null = null;
    let cleanup: (() => void) | undefined;

    const loadAnimations = async () => {
      if (!isVisible || animationsLoaded) return;

      try {
        // Dynamic import GSAP
        const gsapModule = await import('gsap');
        const gsap = gsapModule.default;

        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            defaults: {
              ease: "power3.out",
              willChange: "transform, opacity"
            }
          });

          // Batch DOM operations for better performance
          const heroCopy = scope.current?.querySelectorAll(".hero-copy > *");
          const slashMask = scope.current?.querySelector(".hero-visual .slash-mask");
          const floatCards = scope.current?.querySelectorAll(".hero-visual .float-card");

          if (heroCopy?.length) {
            tl.from(heroCopy, {
              opacity: 0,
              y: 24,
              duration: 0.7,
              stagger: 0.12,
              ease: "power3.out",
            });
          }

          if (slashMask) {
            tl.from(slashMask, {
              opacity: 0,
              x: 40,
              scale: 0.97,
              duration: 0.8,
              ease: "power3.out",
            }, "-=0.5");
          }

          if (floatCards?.length) {
            tl.from(floatCards, {
              opacity: 0,
              y: 12,
              scale: 0.9,
              duration: 0.5,
              stagger: 0.15,
              ease: "power3.out",
            }, "-=0.35");
          }

          animationTimeline = tl;
        }, scope);

        cleanup = () => ctx.revert();

        setAnimationsLoaded(true);

      } catch (error) {
        console.warn('Animation failed to load:', error);
        // Fallback: show elements without animation
        if (scope.current) {
          const elements = scope.current.querySelectorAll<HTMLElement>(
            ".hero-copy > *, .hero-visual .slash-mask, .hero-visual .float-card"
          );
          elements.forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'none';
          });
        }
      }
    };

    if (isVisible) {
      loadAnimations();
    }

    return () => {
      if (animationTimeline) {
        animationTimeline.kill();
      }
      if (cleanup) {
        cleanup();
      }
    };
  }, [isVisible, animationsLoaded]);

  return (
    <section
      className="relative pt-10 md:pt-16 overflow-hidden"
      ref={scope}
      style={{ contain: 'layout paint' }}
      aria-labelledby="hero-heading"
    >
      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 items-center">
        {/* Copy Section */}
        <div className="hero-copy order-2 md:order-1">
          <span
            className="inline-block font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] mb-4 px-2 py-1 rounded-sm"
            style={{
              color: '#CC4400',
              backgroundColor: 'rgba(204, 68, 0, 0.08)'
            }}
            aria-hidden="true"
          >
            Your neighborhood, online
          </span>

          <h1
            id="hero-heading"
            className="text-[36px] sm:text-[52px] lg:text-[76px] leading-[0.95]"
          >
            Shop local
            <br />
            <span
              className="text-marigold"
              style={{ color: '#D6430E' }}
              aria-label="products"
            >
              products
            </span>
            from
            <br />
            your{' '}
            <span
              className="underline decoration-4"
              style={{ textDecorationColor: '#D6430E' }}
              aria-label="haat"
            >
              haat
            </span>
          </h1>

          <p
            className="text-text-soft text-[15px] sm:text-[17px] max-w-[440px] my-5 sm:my-6 leading-relaxed"
            style={{ color: '#4B4B4B' }}
          >
            Everything from fresh produce to electronics, sold directly by verified
            local vendors — no middlemen, better prices, faster delivery.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 items-center mb-7 sm:mb-8">
            <Link
              href={route('products.index')}
              className="inline-flex items-center gap-2 rounded-sm px-[22px] sm:px-[26px] py-[13px] sm:py-[15px] font-bold text-sm bg-marigold text-white shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
              style={{ backgroundColor: '#D6430E' }}
              aria-label="Start shopping for local products"
            >
              Start shopping
              <Suspense fallback={<IconFallback className="w-3.5 h-3.5" ariaHidden={true} />}>
                <FaArrowRight size={14} aria-hidden="true" />
              </Suspense>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-sm px-[22px] sm:px-[26px] py-[13px] sm:py-[15px] border font-bold text-sm shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
              style={{ color: '#111013', borderColor: '#111013' }}
              aria-label="Become a vendor on our marketplace"
            >
              Become a vendor
            </Link>
          </div>

          {/* Shopping Benefits - Improved Contrast */}
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <span
              className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11.5px] uppercase tracking-wide"
              style={{ color: '#4B4B4B' }}
            >
              <Suspense fallback={<IconFallback className="w-3.5 h-3.5" ariaHidden={true} />}>
                <FaTruck
                  className="text-marigold text-sm"
                  aria-hidden="true"
                  style={{ color: '#D6430E' }}
                />
              </Suspense>
              Fast delivery
            </span>
            <span
              className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11.5px] uppercase tracking-wide"
              style={{ color: '#4B4B4B' }}
            >
              <Suspense fallback={<IconFallback className="w-3.5 h-3.5" ariaHidden={true} />}>
                <FaShieldAlt
                  className="text-marigold text-sm"
                  aria-hidden="true"
                  style={{ color: '#D6430E' }}
                />
              </Suspense>
              Secure payments
            </span>
          </div>
        </div>

        {/* Visual Section */}
        <div className="hero-visual relative h-[300px] sm:h-[360px] md:h-[480px] mt-4 md:mt-0 order-1 md:order-2">
          {/* Background Grid */}
          <div
            className="slash-mask clip-hero absolute inset-0 rounded-md overflow-hidden bg-ink"
            style={{ backgroundColor: '#111013' }}
            aria-hidden="true"
          >
            <div className="grid grid-cols-2 grid-rows-2 gap-0.5 absolute inset-0" style={{ backgroundColor: '#111013' }}>
              {collage.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center text-[40px] sm:text-[52px] will-change-transform"
                  style={{
                    background: `linear-gradient(135deg, ${c.c1}, ${c.c2})`,
                    contain: 'strict',
                    position: 'relative'
                  }}
                  role="img"
                  aria-label={c.alt}
                >
                  <span aria-hidden="true">{c.emoji}</span>
                  <span className="sr-only">{c.alt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Card */}
          <div
            className="float-card absolute bottom-6 sm:bottom-8 -left-2 sm:-left-4 bg-white border-[1.5px] border-ink rounded px-3.5 sm:px-4 py-3 sm:py-3.5 shadow-hard-sm will-change-transform"
            style={{ borderColor: '#111013' }}
            aria-label="All categories available"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">🛍️</span>
              <div>
                <strong className="text-xs sm:text-sm block" style={{ color: '#111013' }}>
                  All categories
                </strong>
                <small
                  className="font-mono text-[9px] sm:text-[10px] block"
                  style={{ color: '#4B4B4B' }}
                >
                  One marketplace, every need
                </small>
              </div>
            </div>
          </div>

          {/* Free Delivery Badge */}
          <div
            className="float-card absolute top-2 left-2 bg-white/90 backdrop-blur-sm border border-line rounded-full px-3 py-1.5 shadow-hard-sm will-change-transform"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#DAD5C7' }}
            aria-label="Secure delivery available"
          >
            <span className="text-[10px] font-bold uppercase" style={{ color: '#111013' }}>
              🚚 Secure delivery
            </span>
          </div>
        </div>
      </div>

      {/* Preload hint for critical resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </section>
  );
}
