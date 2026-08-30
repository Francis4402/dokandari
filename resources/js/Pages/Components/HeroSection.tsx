import { useEffect, useRef, lazy, Suspense, useState } from "react";
import { Link } from "@inertiajs/react";

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
  { emoji: "👕", c1: "#FF5A1F", c2: "#D6430E" },
  { emoji: "📱", c1: "#0E6E5B", c2: "#0A5346" },
  { emoji: "🥭", c1: "#FFC53D", c2: "#E8A400" },
  { emoji: "👟", c1: "#2B2A2E", c2: "#111013" },
];

// Icon fallback component
const IconFallback = ({ className }: { className?: string }) => (
  <span className={className}>✦</span>
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
      style={{ contain: 'layout paint' }} // Reduce layout shifts
    >
      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 items-center">
        {/* Copy Section */}
        <div className="hero-copy order-2 md:order-1">
          <span className="inline-block font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-marigold mb-4">
            Your neighborhood, online
          </span>

          <h1 className="text-[36px] sm:text-[52px] lg:text-[76px] leading-[0.95]">
            Shop local
            <br />
            <span className="text-marigold">products</span> from
            <br />
            your <span className="underline decoration-marigold decoration-4">haat</span>
          </h1>

          <p className="text-text-soft text-[15px] sm:text-[17px] max-w-[440px] my-5 sm:my-6 leading-relaxed">
            Everything from fresh produce to electronics, sold directly by verified
            local vendors — no middlemen, better prices, faster delivery.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 items-center mb-7 sm:mb-8">
            <Link
              href={route('products.index')}
              className="inline-flex items-center gap-2 rounded-sm px-[22px] sm:px-[26px] py-[13px] sm:py-[15px] font-bold text-sm bg-marigold text-white shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
            >
              Start shopping
              <Suspense fallback={<IconFallback className="w-3.5 h-3.5" />}>
                <FaArrowRight size={14} />
              </Suspense>
            </Link>
            <a
              href="#sell"
              className="rounded-sm px-[18px] sm:px-[22px] py-[11px] sm:py-3.5 font-bold text-sm border-[1.5px] border-ink transition-colors duration-150 hover:bg-ink hover:text-paper"
            >
              Become a vendor
            </a>
          </div>

          {/* Shopping Benefits */}
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <span className="inline-flex items-center gap-1.5 text-text-soft font-mono text-[10px] sm:text-[11.5px] uppercase tracking-wide">
              <Suspense fallback={<IconFallback className="w-3.5 h-3.5" />}>
                <FaTruck className="text-marigold text-sm" />
              </Suspense>
              Fast delivery
            </span>
            <span className="inline-flex items-center gap-1.5 text-text-soft font-mono text-[10px] sm:text-[11.5px] uppercase tracking-wide">
              <Suspense fallback={<IconFallback className="w-3.5 h-3.5" />}>
                <FaShieldAlt className="text-marigold text-sm" />
              </Suspense>
              Secure payments
            </span>
          </div>
        </div>

        {/* Visual Section */}
        <div className="hero-visual relative h-[300px] sm:h-[360px] md:h-[480px] mt-4 md:mt-0 order-1 md:order-2">
          {/* Background Grid */}
          <div className="slash-mask clip-hero absolute inset-0 rounded-md overflow-hidden bg-ink">
            <div className="grid grid-cols-2 grid-rows-2 gap-0.5 absolute inset-0 bg-ink">
              {collage.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center text-[40px] sm:text-[52px] will-change-transform"
                  style={{
                    background: `linear-gradient(135deg, ${c.c1}, ${c.c2})`,
                    contain: 'strict' // Optimize rendering
                  }}
                >
                  {c.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Category Card - Optimized with will-change */}
          <div className="float-card absolute bottom-6 sm:bottom-8 -left-2 sm:-left-4 bg-white border-[1.5px] border-ink rounded px-3.5 sm:px-4 py-3 sm:py-3.5 shadow-hard-sm will-change-transform">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl">🛍️</span>
              <div>
                <strong className="text-xs sm:text-sm block">All categories</strong>
                <small className="font-mono text-[9px] sm:text-[10px] text-text-soft">One marketplace, every need</small>
              </div>
            </div>
          </div>

          {/* Free Delivery Badge - Optimized */}
          <div className="float-card absolute top-2 left-2 bg-white/90 backdrop-blur-sm border border-line rounded-full px-3 py-1.5 shadow-hard-sm will-change-transform">
            <span className="text-[10px] font-bold uppercase">🚚 Secure delivery</span>
          </div>
        </div>
      </div>

      {/* Preload hint for critical resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </section>
  );
}
