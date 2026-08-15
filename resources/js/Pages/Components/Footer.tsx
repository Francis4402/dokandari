// Footer.tsx (simplified)
import { Link } from '@inertiajs/react';

const footerCols = [
  {
    heading: "Shop",
    links: ["Categories", "Featured", "Trending", "Daily discover"]
  },
  {
    heading: "Vendors",
    links: ["Start selling", "Vendor dashboard", "Payout schedule"]
  },
  {
    heading: "Support",
    links: ["Track an order", "Returns", "Contact us"]
  },
];

export default function Footer() {
  return (
    <footer className="pt-20 pb-7 border-t border-line">
      <div className="max-w-[1240px] mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <img src={'/MyLogo.png'} alt="Haatpoint" className="h-[30px] w-auto" />
              <span className="font-display font-extrabold text-xl uppercase">Haatpoint</span>
            </div>
            <p className="text-text-soft text-sm max-w-[260px] leading-relaxed">
              The open-air haat, rebuilt for the internet. Thousands of independent vendors, one
              checkout.
            </p>
          </div>

          {footerCols.map((col) => (
            <div key={col.heading}>
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-text-soft mb-3.5">
                {col.heading}
              </h4>
              {col.links.map((l) => (
                <a key={l} href="#" className="block mb-2.5 text-sm text-text-soft hover:text-marigold transition-colors">
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between flex-wrap gap-2.5 pt-5 border-t border-line font-mono text-xs text-text-soft">
          <span>© {new Date().getFullYear()} Haatpoint. All rights reserved.</span>
          <div className="flex gap-4 flex-wrap">
            <Link href="/privacy-policy" className="hover:text-marigold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-marigold transition-colors">
              Terms of Service
            </Link>
            <span>Dhaka · Chattogram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
