import { useRef } from "react";
import { FaArrowRight } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const collage = [
  { emoji: "🧵", c1: "#FF5A1F", c2: "#D6430E" },
  { emoji: "📱", c1: "#0E6E5B", c2: "#0A5346" },
  { emoji: "🥭", c1: "#FFC53D", c2: "#E8A400" },
  { emoji: "👟", c1: "#2B2A2E", c2: "#111013" },
];

export default function Hero() {
  const scope = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-copy > *", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.12,
      })
        .from(
          ".hero-visual .slash-mask",
          { opacity: 0, x: 40, scale: 0.97, duration: 0.8 },
          "-=0.5"
        )
        .from(
          ".hero-visual .float-card",
          { opacity: 0, y: 12, scale: 0.9, duration: 0.5, stagger: 0.15 },
          "-=0.35"
        );
    },
    { scope }
  );

  return (
    <section className="relative pt-16 overflow-hidden" ref={scope}>
      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
        <div className="hero-copy">
          <div className="flex items-center gap-2.5 mb-3.5 font-mono text-xs tracking-[0.14em] uppercase text-marigold-dark">
            <span className="w-[22px] h-[2px] bg-marigold inline-block" />
            Bangladesh&apos;s Open-Air Marketplace, Online
          </div>

          <h1 className="text-[44px] sm:text-[60px] lg:text-[88px] leading-[0.95]">
            Every stall
            <br />
            of the <span className="text-marigold">haat</span>,
            <br />
            one address.
          </h1>

          <p className="text-text-soft text-[17px] max-w-[440px] my-6 leading-relaxed">
            Haatpoint gathers thousands of independent sellers — from neighbourhood tailors to
            electronics stalls — under one roof. Compare, haggle-free, and get it delivered.
          </p>

          <div className="flex gap-3.5 items-center mb-8 flex-wrap">
            <a
              href="#featured"
              className="inline-flex items-center gap-2 rounded-sm px-[26px] py-[15px] font-bold text-sm bg-marigold text-white shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
            >
              Start browsing <FaArrowRight size={14} />
            </a>
            <a
              href="#sell"
              className="rounded-sm px-[22px] py-3.5 font-bold text-sm border-[1.5px] border-ink transition-colors duration-150 hover:bg-ink hover:text-paper"
            >
              Become a vendor
            </a>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {["12,400+ vendors", "64 districts served", "Cash on delivery"].map((c) => (
              <span
                key={c}
                className="rounded-full px-3.5 py-2 bg-white border border-line text-text-soft font-mono text-[11.5px] uppercase tracking-wide"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-visual relative h-[360px] md:h-[480px] mt-5 md:mt-0">
          <div className="slash-mask clip-hero absolute inset-0 rounded-md overflow-hidden bg-ink">
            <div className="grid grid-cols-2 grid-rows-2 gap-0.5 absolute inset-0 bg-ink">
              {collage.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center text-[52px]"
                  style={{ background: `linear-gradient(135deg, ${c.c1}, ${c.c2})` }}
                >
                  {c.emoji}
                </div>
              ))}
            </div>
          </div>

          <div className="float-card absolute bottom-8 -left-4 bg-white border-[1.5px] border-ink rounded px-4 py-3.5 shadow-hard-sm">
            <div className="font-display font-extrabold text-[26px]">৳1,290</div>
            <div className="font-mono text-[10px] text-text-soft uppercase">Today&apos;s best deal</div>
          </div>

          <div className="float-card absolute top-5 -right-3 flex items-center gap-2.5 bg-white border-[1.5px] border-ink rounded px-4 py-3.5 shadow-hard-sm">
            <div className="flex">
              {["#FF5A1F", "#0E6E5B", "#FFC53D"].map((c, i) => (
                <span
                  key={i}
                  className="rounded-full flex items-center justify-center w-[26px] h-[26px] border-2 border-white text-white text-[10px] font-mono"
                  style={{ background: c, marginLeft: i === 0 ? 0 : -8 }}
                >
                  {["R", "S", "T"][i]}
                </span>
              ))}
            </div>
            <div>
              <strong className="text-sm block">+12.4k</strong>
              <small className="font-mono text-[10px] text-text-soft">active vendors</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
