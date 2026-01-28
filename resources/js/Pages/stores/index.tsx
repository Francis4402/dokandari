import { useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  FaStore,
  FaMapMarkerAlt,
  FaStar,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaBox,
  FaChartLine,
  FaChevronDown,
  FaEye,
  FaHeart,
  FaTimes,
  FaBars,
  FaChevronRight,
  FaShoppingBag
} from "react-icons/fa";
import {
  MdStorefront,
  MdLocationOn,
  MdStar,
  MdSearch,
  MdFilterList,
  MdCheckCircle,
  MdInventory,
  MdTrendingUp,
  MdKeyboardArrowDown,
  MdRemoveRedEye,
  MdFavorite,
  MdClose,
  MdMenu,
  MdChevronRight,
  MdShoppingBag
} from "react-icons/md"; // Alternative icons from Material Design
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PageProps } from "@/types";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";

gsap.registerPlugin(ScrollTrigger);

interface StoreData {
  id: number;
  user_id: number;
  name: string;
  storetype: string;
  license: string | null;
  description: string;
  logo: string;
  cover_image: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  rating: number;
  total_reviews: number;
  total_products: number;
  total_sales: number;
  is_verified: boolean;
  created_at: string;
}

const StoreListPage = ({auth}: PageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const storesRef = useRef<HTMLDivElement>(null);

  // Mock stores data
  const stores: StoreData[] = [
    {
      id: 1,
      user_id: 1,
      name: "TechHub Electronics",
      storetype: "Electronics",
      license: "LIC-2024-001234",
      description: "Your trusted destination for premium electronics and gadgets with latest technology products.",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=TechHub",
      cover_image: "/sliderimage/slider-1.webp",
      address: "123 Technology Street, Block A",
      city: "Dhaka",
      phone: "+880 1234-567890",
      email: "contact@techhub.com",
      rating: 4.8,
      total_reviews: 1247,
      total_products: 156,
      total_sales: 5420,
      is_verified: true,
      created_at: "2023-01-15"
    },
    {
      id: 2,
      user_id: 2,
      name: "Fashion Haven",
      storetype: "Fashion",
      license: "LIC-2024-002345",
      description: "Discover the latest trends in fashion with our curated collection of clothing and accessories.",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=Fashion",
      cover_image: "/sliderimage/slider-2.webp",
      address: "456 Fashion Avenue",
      city: "Dhaka",
      phone: "+880 1234-567891",
      email: "hello@fashionhaven.com",
      rating: 4.6,
      total_reviews: 892,
      total_products: 234,
      total_sales: 3210,
      is_verified: true,
      created_at: "2023-03-20"
    },
    {
      id: 3,
      user_id: 3,
      name: "Home & Living Store",
      storetype: "Home & Garden",
      license: null,
      description: "Transform your living space with our premium furniture and home decor items.",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=Home",
      cover_image: "/sliderimage/slider-3.webp",
      address: "789 Decor Lane",
      city: "Chittagong",
      phone: "+880 1234-567892",
      email: "info@homeliving.com",
      rating: 4.7,
      total_reviews: 654,
      total_products: 98,
      total_sales: 2156,
      is_verified: false,
      created_at: "2023-05-10"
    },
    {
      id: 4,
      user_id: 4,
      name: "Fresh Groceries",
      storetype: "Groceries",
      license: "LIC-2024-003456",
      description: "Fresh and organic groceries delivered to your doorstep daily.",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=Fresh",
      cover_image: "/sliderimage/slider-1.webp",
      address: "321 Market Road",
      city: "Sylhet",
      phone: "+880 1234-567893",
      email: "support@freshgroceries.com",
      rating: 4.9,
      total_reviews: 1567,
      total_products: 423,
      total_sales: 8934,
      is_verified: true,
      created_at: "2023-02-28"
    },
    {
      id: 5,
      user_id: 5,
      name: "Sports Zone",
      storetype: "Sports",
      license: "LIC-2024-004567",
      description: "All your sports and fitness equipment in one place.",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=Sports",
      cover_image: "/sliderimage/slider-2.webp",
      address: "555 Stadium Street",
      city: "Dhaka",
      phone: "+880 1234-567894",
      email: "contact@sportszone.com",
      rating: 4.5,
      total_reviews: 432,
      total_products: 187,
      total_sales: 1876,
      is_verified: true,
      created_at: "2023-04-15"
    },
    {
      id: 6,
      user_id: 6,
      name: "Beauty Bliss",
      storetype: "Beauty",
      license: "LIC-2024-005678",
      description: "Premium beauty and skincare products for your radiant look.",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=Beauty",
      cover_image: "/sliderimage/slider-3.webp",
      address: "777 Beauty Boulevard",
      city: "Chittagong",
      phone: "+880 1234-567895",
      email: "hello@beautybliss.com",
      rating: 4.8,
      total_reviews: 978,
      total_products: 312,
      total_sales: 4521,
      is_verified: true,
      created_at: "2023-06-01"
    }
  ];

  const storeTypes = Array.from(new Set(stores.map(s => s.storetype)));
  const cities = Array.from(new Set(stores.map(s => s.city)));

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || store.storetype === selectedType;
    const matchesCity = selectedCity === "all" || store.city === selectedCity;
    return matchesSearch && matchesType && matchesCity;
  });

  // Sort filtered stores
  const sortedStores = [...filteredStores].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "products":
        return b.total_products - a.total_products;
      case "sales":
        return b.total_sales - a.total_sales;
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "featured":
      default:
        return b.is_verified ? 1 : -1;
    }
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out"
        });
      }

      const storeCards = storesRef.current?.querySelectorAll('.store-card');
      if (storeCards) {
        storeCards.forEach((card, index) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=100",
              toggleActions: "play none none reverse"
            },
            y: 60,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.08,
            ease: "power2.out"
          });
        });
      }
    });

    return () => ctx.revert();
  }, [sortedStores]);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Store Type</h3>
        <div className="space-y-2">
          <div
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedType === "all" ? "bg-amber-50 text-amber-600 font-medium" : "hover:bg-gray-50"
            }`}
            onClick={() => setSelectedType("all")}
          >
            All Stores
          </div>
          {storeTypes.map((type) => (
            <div
              key={type}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedType === type ? "bg-amber-50 text-amber-600 font-medium" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold text-lg mb-4">Location</h3>
        <div className="space-y-2">
          <div
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedCity === "all" ? "bg-amber-50 text-amber-600 font-medium" : "hover:bg-gray-50"
            }`}
            onClick={() => setSelectedCity("all")}
          >
            All Cities
          </div>
          {cities.map((city) => (
            <div
              key={city}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedCity === city ? "bg-amber-50 text-amber-600 font-medium" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const StoreCard = ({ store }: { store: StoreData }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: -8,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    const handleMouseLeave = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    return (
      <div
        ref={cardRef}
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group store-card cursor-pointer border border-gray-200"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="p-0">
          {/* Cover Image */}
          <div className="relative h-40 overflow-hidden">
            <img
              src={store.cover_image}
              alt={store.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            {/* Store Logo */}
            <div className="absolute -bottom-10 left-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                  {!store.logo && (
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold">
                      {store.name.charAt(0)}
                    </div>
                  )}
                </div>
                {store.is_verified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <FaCheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm">
                <FaHeart className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Store Info */}
          <div className="pt-12 px-6 pb-6">
            <div className="mb-3">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {store.name}
                </h3>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-1 text-xs border border-gray-300 rounded-md">
                  <FaStore className="h-3 w-3 mr-1" />
                  {store.storetype}
                </span>
                {store.is_verified && (
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-500 text-white rounded-md">
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 mb-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(store.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900">{store.rating}</span>
                <span className="text-sm text-gray-500">({store.total_reviews})</span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {store.description}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <FaMapMarkerAlt className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">{store.address}, {store.city}</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FaBox className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-lg font-bold text-gray-900">{store.total_products}</span>
                  </div>
                  <span className="text-xs text-gray-600">Products</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FaChartLine className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-lg font-bold text-gray-900">{store.total_sales}</span>
                  </div>
                  <span className="text-xs text-gray-600">Sales</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FaStar className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-lg font-bold text-gray-900">{store.total_reviews}</span>
                  </div>
                  <span className="text-xs text-gray-600">Reviews</span>
                </div>
              </div>
            </div>

            {/* Visit Button */}
            <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center">
              <FaEye className="h-4 w-4 mr-2" />
              Visit Store
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout user={auth.user}>
      <Head title="Stores">
        <meta name="description" content="Multivendor Store" />
        <meta name="keywords" content="shop, products, buy online, shopping" />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div ref={headerRef} className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
              <FaChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium">Stores</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Explore Stores</h1>
            <p className="text-gray-600">Discover amazing stores and their unique products</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-24">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <FaFilter className="h-5 w-5" />
                    <h2 className="text-xl font-bold">Filters</h2>
                  </div>
                  <FilterSidebar />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search & Toolbar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search stores..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaFilter className="h-4 w-4 mr-2" />
                    Filters
                  </button>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className="flex items-center justify-between w-full md:w-[180px] px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700">
                        {sortBy === "featured" && "Featured"}
                        {sortBy === "rating" && "Highest Rated"}
                        {sortBy === "products" && "Most Products"}
                        {sortBy === "sales" && "Most Sales"}
                        {sortBy === "newest" && "Newest"}
                      </span>
                      <FaChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showSortDropdown && (
                      <div className="absolute z-10 mt-1 w-full md:w-[180px] bg-white rounded-lg shadow-lg border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setSortBy("featured");
                              setShowSortDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "featured" ? 'bg-gray-50 text-amber-600' : ''}`}
                          >
                            Featured
                          </button>
                          <button
                            onClick={() => {
                              setSortBy("rating");
                              setShowSortDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "rating" ? 'bg-gray-50 text-amber-600' : ''}`}
                          >
                            Highest Rated
                          </button>
                          <button
                            onClick={() => {
                              setSortBy("products");
                              setShowSortDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "products" ? 'bg-gray-50 text-amber-600' : ''}`}
                          >
                            Most Products
                          </button>
                          <button
                            onClick={() => {
                              setSortBy("sales");
                              setShowSortDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "sales" ? 'bg-gray-50 text-amber-600' : ''}`}
                          >
                            Most Sales
                          </button>
                          <button
                            onClick={() => {
                              setSortBy("newest");
                              setShowSortDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "newest" ? 'bg-gray-50 text-amber-600' : ''}`}
                          >
                            Newest
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    <span className="font-semibold text-gray-900">{filteredStores.length}</span> Stores Found
                  </span>
                  {(selectedType !== "all" || selectedCity !== "all" || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedType("all");
                        setSelectedCity("all");
                        setSearchQuery("");
                      }}
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Stores Grid */}
              <div
                ref={storesRef}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {sortedStores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>

              {/* No Results */}
              {sortedStores.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <FaStore className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No stores found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
                  <button
                    onClick={() => {
                      setSelectedType("all");
                      setSelectedCity("all");
                      setSearchQuery("");
                    }}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <Transition appear show={showMobileFilters} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setShowMobileFilters}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      <FaFilter className="h-5 w-5 inline mr-2" />
                      Filters
                    </Dialog.Title>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <FilterSidebar />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedType("all");
                        setSelectedCity("all");
                        setSearchQuery("");
                      }}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      Reset Filters
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <FaCheckCircle className="h-4 w-4 mr-2" />
                      Apply Filters
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </AppLayout>
  );
};

export default StoreListPage;
