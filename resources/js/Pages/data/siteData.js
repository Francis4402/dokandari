export const categories = [
  { emoji: "🥬", label: "Fresh Bazaar" },
  { emoji: "👗", label: "Fashion Street" },
  { emoji: "📱", label: "Mobile & Gadgets" },
  { emoji: "🛋️", label: "Home Essentials" },
  { emoji: "💄", label: "Beauty Counter" },
  { emoji: "🧶", label: "Handmade & Craft" },
  { emoji: "📚", label: "Books & Stationery" },
  { emoji: "🍯", label: "Local Foods" },
];

export const featuredProducts = [
  { emoji: "👜", vendor: "Nilufar Leather Works", name: "Hand-stitched jute tote bag", price: "৳850", rating: "4.8", c1: "#FF5A1F", c2: "#D6430E" },
  { emoji: "🍵", vendor: "Sylhet Tea Traders", name: "Orthodox black tea, 500g tin", price: "৳420", rating: "4.9", c1: "#0E6E5B", c2: "#0A5346" },
  { emoji: "💍", vendor: "Karigor Jewellers", name: "Silver filigree stud earrings", price: "৳1,150", rating: "4.7", c1: "#FFC53D", c2: "#E8A400" },
  { emoji: "🎧", vendor: "Dhanmondi Electronics", name: "Wireless over-ear headphones", price: "৳2,390", rating: "4.6", c1: "#2B2A2E", c2: "#111013" },
];

export const trendingProducts = [
  { emoji: "🧢", vendor: "Chattogram Caps Co.", name: "Denim panel cap", price: "৳390", change: "212%", c1: "#FF5A1F", c2: "#D6430E" },
  { emoji: "🔌", vendor: "PowerHub BD", name: "20,000mAh fast-charge bank", price: "৳1,690", change: "168%", c1: "#0E6E5B", c2: "#0A5346" },
  { emoji: "🧴", vendor: "Herbal Nook", name: "Neem & tulsi face wash", price: "৳260", change: "140%", c1: "#FFC53D", c2: "#E8A400" },
  { emoji: "👠", vendor: "Bata Street Vendors", name: "Block-heel sandals", price: "৳980", change: "121%", c1: "#2B2A2E", c2: "#111013" },
  { emoji: "🍪", vendor: "Ammer Rannaghor", name: "Homemade nolen gur cookies", price: "৳340", change: "96%", c1: "#FF5A1F", c2: "#D6430E" },
];

export const topSellingProduct = [
  { rank: "01", emoji: "👕", vendor: "Aarong Fabrics", name: "Classic cotton panjabi", sold: "8,240", pct: 100, c1: "#FF5A1F", c2: "#D6430E" },
  { rank: "02", emoji: "📿", vendor: "Chawk Bazaar Crafts", name: "Sandalwood tasbih beads", sold: "6,760", pct: 82, c1: "#0E6E5B", c2: "#0A5346" },
  { rank: "03", emoji: "🧿", vendor: "Notun Bazaar", name: "Evil-eye keychain set", sold: "5,510", pct: 68, c1: "#FFC53D", c2: "#E8A400" },
  { rank: "04", emoji: "🔋", vendor: "PowerHub BD", name: "USB-C fast charger, 33W", sold: "4,330", pct: 54, c1: "#2B2A2E", c2: "#111013" },
  { rank: "05", emoji: "🧣", vendor: "Silk Route Weavers", name: "Hand-woven Rajshahi silk scarf", sold: "3,290", pct: 41, c1: "#FF5A1F", c2: "#D6430E" },
];

export const discoverPool = [
  { emoji: "🥻", name: "Block-print cotton saree", vendor: "Tangail Tantshala", price: "৳1,420", c1: "#FF5A1F", c2: "#D6430E" },
  { emoji: "🧃", name: "Cold-pressed sugarcane juicer", vendor: "Bazaar Tools", price: "৳3,150", c1: "#0E6E5B", c2: "#0A5346" },
  { emoji: "🕯️", name: "Beeswax citronella candle", vendor: "Village Wax Co.", price: "৳220", c1: "#FFC53D", c2: "#E8A400" },
  { emoji: "🎒", name: "Canvas school backpack", vendor: "Notun Bazaar", price: "৳990", c1: "#2B2A2E", c2: "#111013" },
  { emoji: "🍚", name: "Chinigura aromatic rice, 5kg", vendor: "Kishoreganj Grains", price: "৳680", c1: "#FF5A1F", c2: "#D6430E" },
  { emoji: "🧵", name: "Embroidery thread set, 40pc", vendor: "Suchona Crafts", price: "৳310", c1: "#0E6E5B", c2: "#0A5346" },
  { emoji: "🪔", name: "Brass diya oil lamp, pair", vendor: "Karigor Jewellers", price: "৳540", c1: "#FFC53D", c2: "#E8A400" },
  { emoji: "🧸", name: "Handmade jute plush toy", vendor: "Ammer Rannaghor", price: "৳450", c1: "#2B2A2E", c2: "#111013" },
  { emoji: "🥥", name: "Cold-pressed coconut oil, 1L", vendor: "Herbal Nook", price: "৳390", c1: "#FF5A1F", c2: "#D6430E" },
];

export function shuffleSix(pool) {
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
}
