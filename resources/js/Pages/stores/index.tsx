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
  FaChevronRight,
} from "react-icons/fa";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { storeType } from "@/types";

gsap.registerPlugin(ScrollTrigger);

// Extended interface with all required properties
interface ExtendedStoreType extends storeType {
  cover_image?: string;
  description?: string;
  rating?: number;
  total_products?: number;
  total_sales?: number;
  total_reviews?: number;
  is_verified?: boolean;
  address?: string;
  city?: string;
  created_at?: string;
}

interface StoreListPageProps {
    auth: {
        user: any
    },
    stores: ExtendedStoreType[]
}

const StoreListPage = ({auth, stores}: StoreListPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const storesRef = useRef<HTMLDivElement>(null);


  const storeTypes = Array.from(new Set(stores.map(s => s.storetype)));
  const cities = Array.from(new Set(stores.map(s => s.city)));

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (store.description && store.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "all" || store.storetype === selectedType;
    const matchesCity = selectedCity === "all" || store.city === selectedCity;
    return matchesSearch && matchesType && matchesCity;
  });

  // Sort filtered stores
  const sortedStores = [...filteredStores].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "products":
        return (b.total_products || 0) - (a.total_products || 0);
      case "sales":
        return (b.total_sales || 0) - (a.total_sales || 0);
      case "newest":
        return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
      case "featured":
      default:
        return (b.is_verified ? 1 : 0) - (a.is_verified ? 1 : 0);
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
            key="all-stores"
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
            key="all-cities"
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedCity === "all" ? "bg-amber-50 text-amber-600 font-medium" : "hover:bg-gray-50"
            }`}
            onClick={() => setSelectedCity("all")}
          >
            All Cities
          </div>

        </div>
      </div>
    </div>
  );

  const StoreCard = ({ store }: { store: ExtendedStoreType }) => {
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

    // Safe rating value
    const safeRating = store.rating || 0;
    const ratingDisplay = safeRating.toFixed(1);

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
              src={store.cover_image || "/default-cover.jpg"}
              alt={store.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = "/default-cover.jpg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            {/* Store Logo */}
            <div className="absolute -bottom-10 left-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500">
                  {store.logo ? (
                    <img
                      src={`store_images/${store.logo}`}
                      alt={store.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                    {store.name.charAt(0)}
                  </div>
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
                  {store.storetype || "General Store"}
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
                        i < Math.floor(safeRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900">{ratingDisplay}</span>
                <span className="text-sm text-gray-500">({store.total_reviews || 0})</span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {store.description || "No description available"}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <FaMapMarkerAlt className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">
                  {store.address || "Address not specified"}, {store.city || "N/A"}
                </span>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FaBox className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-lg font-bold text-gray-900">{store.total_products || 0}</span>
                  </div>
                  <span className="text-xs text-gray-600">Products</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FaChartLine className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-lg font-bold text-gray-900">{store.total_sales || 0}</span>
                  </div>
                  <span className="text-xs text-gray-600">Sales</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FaStar className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-lg font-bold text-gray-900">{store.total_reviews || 0}</span>
                  </div>
                  <span className="text-xs text-gray-600">Reviews</span>
                </div>
              </div>
            </div>

            {/* Visit Button */}
            <Link
              href={`/stores/${store.id}`}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              <FaEye className="h-4 w-4 mr-2" />
              Visit Store
            </Link>
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
