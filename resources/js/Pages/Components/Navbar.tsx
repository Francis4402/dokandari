import { PropsWithChildren, useState, useRef, useEffect, Fragment } from "react"
import { Link } from "@inertiajs/react"
import React from "react"
import {
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiHome,
  FiTag,
  FiZap,
  FiPackage,
  FiLogOut,
  FiGrid,
  FiChevronDown,
  FiShoppingCart,
  FiHeart,
  FiMail,
  FiInfo,
} from "react-icons/fi"
import { Dialog, Transition } from "@headlessui/react"
import { useStore } from "../state/cartStore"
import WishlistCountButton from "../buttons/WishListCountButton"
import { LazyLoadImage } from 'react-lazy-load-image-component'


const navigation = [
  { name: "Home", href: "/", icon: FiHome },
  { name: "Deals", href: "/hotdeals", badge: "HOT", icon: FiTag },
  { name: "New Arrivals", href: "/", icon: FiZap },
  { name: "About Us", href: "/aboutus", icon: FiInfo },
  { name: "Contact Us", href: "/contactus", icon: FiMail },
]

// Lazy loaded logo component
const LazyLogo = ({ className }: { className?: string }) => (
  <LazyLoadImage
    src="/MyLogo.png"
    alt="Haatpoint logo"
    effect="blur"
    wrapperClassName={className}
    className="h-full w-auto object-contain transition-transform duration-200 group-hover:scale-105"
    placeholderSrc="/MyLogo-placeholder.png"
    threshold={50}
    visibleByDefault={true}
    onError={(e) => {
      const target = e.currentTarget as HTMLImageElement;
      target.src = '/fallback-logo.png';
    }}
  />
);

// Lazy loaded avatar component
const LazyAvatar = ({
  src,
  alt,
  className
}: {
  src: string;
  alt: string;
  className?: string
}) => (
  <LazyLoadImage
    src={src}
    alt={alt}
    effect="blur"
    wrapperClassName={className}
    className="h-full w-full object-cover"
    placeholderSrc="/avatar-placeholder.png"
    threshold={50}
    visibleByDefault={false}
    onError={(e) => {
      const target = e.currentTarget as HTMLImageElement;
      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}`;
    }}
  />
);

const Navbar = ({ user, wishlist }: PropsWithChildren<{ user: any; wishlist: any }>) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchPanelRef = useRef<HTMLDivElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const { getTotalItems } = useStore()
  const cartItems = getTotalItems()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchOpen &&
        searchPanelRef.current &&
        !searchPanelRef.current.contains(event.target as Node) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target as Node)
      ) {
        handleCloseSearch()
      }

      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (searchOpen) handleCloseSearch()
        if (userMenuOpen) setUserMenuOpen(false)
        if (isMobileMenuOpen) setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [searchOpen, userMenuOpen, isMobileMenuOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      setSearchOpen(false)
      setSearchValue("")
    }
  }

  const handleSearchButtonClick = () => setSearchOpen(!searchOpen)

  const handleCloseSearch = () => {
    setSearchOpen(false)
    setSearchValue("")
  }

  // Helper function to get user avatar URL
  const getUserAvatarUrl = (user: any) => {
    if (!user) return null;
    if (user.images) {
      return user.images.startsWith("http")
        ? user.images
        : `/storage/${user.images}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=D6430E&color=fff&size=128`;
  }

  return (
    <>
      <header
        className="sticky top-0 z-[100] w-full border-b border-[#DAD5C7] bg-[#F7F5EF]/90 backdrop-blur-md"
        role="banner"
        aria-label="Main navigation"
      >
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Left Section - Logo + nav */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/" className="flex items-center gap-2.5 group" aria-label="Haatpoint home">
                <div className="h-[34px] w-auto">
                  <LazyLogo />
                </div>
                <span className="font-display font-extrabold text-[22px] tracking-[-0.01em] uppercase" style={{ color: '#111013' }}>
                  Haatpoint
                </span>
              </Link>

              <nav className="hidden lg:flex ml-6 gap-1" aria-label="Main navigation">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-sm transition-colors duration-150"
                    style={{ color: '#111013' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE3'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {item.name}
                    {item.badge && (
                      <span
                        className="ml-0.5 inline-flex items-center rounded-full bg-[#FF5A1F] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-white"
                        aria-label={`${item.badge} deals`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Middle Section - Search */}
            <div className="flex-1 max-w-xl hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative" role="search">
                <label htmlFor="desktop-search" className="sr-only">
                  Search vendors, products, deals
                </label>
                <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6A66]" aria-hidden="true" />
                <input
                  id="desktop-search"
                  type="search"
                  placeholder="Search vendors, products, deals…"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border-[1.5px] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 transition-all duration-150 text-sm font-body"
                  style={{ borderColor: '#111013' }}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  aria-label="Search vendors, products, deals"
                />
              </form>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              {/* Mobile Search Button */}
              <button
                ref={searchButtonRef}
                onClick={handleSearchButtonClick}
                className="md:hidden p-2.5 rounded-sm hover:bg-[#EFECE3] transition-colors relative"
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
              >
                {searchOpen ? <FiX className="h-5 w-5" aria-hidden="true" /> : <FiSearch className="h-5 w-5" aria-hidden="true" />}
              </button>

              {/* Wishlist */}
              <div className="hidden sm:block">
                {user && <WishlistCountButton wishlist={wishlist} />}
              </div>

              {/* Cart */}
              <Link
                href={route("cart.index")}
                className="p-2.5 rounded-sm hover:bg-[#EFECE3] transition-colors relative"
                aria-label={`Shopping cart${cartItems > 0 ? `, ${cartItems} items` : ''}`}
              >
                <FiShoppingBag className="h-5 w-5" style={{ color: '#111013' }} aria-hidden="true" />
                {cartItems > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#FF5A1F] text-[10px] font-mono font-semibold text-white ring-2 ring-[#F7F5EF]"
                    aria-label={`${cartItems > 99 ? '99+' : cartItems} items in cart`}
                  >
                    {cartItems > 99 ? "99+" : cartItems}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative md:block hidden" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-sm hover:bg-[#EFECE3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                  aria-label={`${user ? user.name + "'s" : "User"} account menu`}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-[#FF5A1F] to-[#D6430E] flex items-center justify-center text-white font-medium text-sm">
                    {user ? (
                      <LazyAvatar
                        src={getUserAvatarUrl(user) || ''}
                        alt={user.name}
                        className="h-full w-full"
                      />
                    ) : (
                      <FiUser className="h-4 w-4" aria-hidden="true" />
                    )}
                  </div>
                  {user && (
                    <span className="hidden sm:inline text-sm font-semibold" style={{ color: '#111013' }}>
                      {user.name.split(" ")[0]}
                    </span>
                  )}
                  <FiChevronDown
                    className={`hidden sm:block h-4 w-4 text-[#6B6A66] transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <Transition
                  show={userMenuOpen}
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95 -translate-y-1"
                  enterTo="transform opacity-100 scale-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="transform opacity-100 scale-100 translate-y-0"
                  leaveTo="transform opacity-0 scale-95 -translate-y-1"
                >
                  <div
                    className="absolute right-0 mt-2 w-72 origin-top-right rounded-sm bg-white border border-[#DAD5C7] shadow-[4px_4px_0_#111013] focus:outline-none z-50 overflow-hidden"
                    role="menu"
                    aria-label="User menu"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-4 bg-[#EFECE3] border-b border-[#DAD5C7]">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-[#FF5A1F] to-[#D6430E] flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
                              <LazyAvatar
                                src={getUserAvatarUrl(user) || ''}
                                alt={user.name}
                                className="h-full w-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate" style={{ color: '#111013' }}>{user.name}</p>
                              <p className="text-sm truncate" style={{ color: '#6B6A66' }}>{user.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-1.5">
                          {[
                            { href: "/dashboard", icon: FiGrid, label: "Dashboard" },
                            { href: "/dashboard/profile", icon: FiUser, label: "Profile Settings" },
                            { href: "/dashboard/orders", icon: FiPackage, label: "Order History" },
                          ].map((it) => (
                            <Link
                              key={it.href}
                              href={it.href}
                              onClick={() => setUserMenuOpen(false)}
                              className="group flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                              style={{ color: '#111013' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE3'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              role="menuitem"
                            >
                              <it.icon className="h-4 w-4 text-[#6B6A66] group-hover:text-[#D6430E]" aria-hidden="true" />
                              {it.label}
                            </Link>
                          ))}
                          <Link
                            href="/wishlist"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                            style={{ color: '#111013' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE3'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            role="menuitem"
                          >
                            <FiHeart className="h-4 w-4 text-[#6B6A66] group-hover:text-[#D6430E]" aria-hidden="true" />
                            Wishlist
                            {wishlist?.length > 0 && (
                              <span
                                className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#EFECE3] font-mono text-[10px] font-medium text-[#D6430E]"
                                aria-label={`${wishlist.length} items in wishlist`}
                              >
                                {wishlist.length}
                              </span>
                            )}
                          </Link>
                        </div>

                        <div className="border-t border-[#DAD5C7] py-1.5">
                          <Link
                            href="/logout"
                            method="post"
                            as="button"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            role="menuitem"
                          >
                            <FiLogOut className="h-4 w-4 group-hover:text-red-600" aria-hidden="true" />
                            Log out
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="py-2">
                        <Link
                          href="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: '#111013' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE3'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          role="menuitem"
                        >
                          <FiUser className="h-4 w-4 text-[#6B6A66]" aria-hidden="true" />
                          Sign in
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: '#111013' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE3'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          role="menuitem"
                        >
                          <FiUser className="h-4 w-4 text-[#6B6A66]" aria-hidden="true" />
                          Create account
                        </Link>
                      </div>
                    )}
                  </div>
                </Transition>
              </div>

              {/* Mobile Menu (sidebar) Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-sm border hover:bg-[#EFECE3] transition-colors"
                style={{ borderColor: '#111013' }}
                aria-label="Open main menu"
                aria-expanded={isMobileMenuOpen}
              >
                <FiMenu className="h-5 w-5" style={{ color: '#111013' }} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Mobile Search Panel */}
          {searchOpen && (
            <div ref={searchPanelRef} className="md:hidden py-4 border-t border-[#DAD5C7]">
              <form onSubmit={handleSearchSubmit} role="search">
                <label htmlFor="mobile-search" className="sr-only">
                  Search for products
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6A66]" aria-hidden="true" />
                  <input
                    ref={searchInputRef}
                    id="mobile-search"
                    type="search"
                    placeholder="What are you looking for?"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-[1.5px] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 transition-all duration-150 text-sm"
                    style={{ borderColor: '#111013' }}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    aria-label="What are you looking for?"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#FF5A1F] text-white py-2.5 px-4 rounded-sm hover:-translate-y-0.5 transition-transform text-sm font-bold shadow-[4px_4px_0_#111013]"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseSearch}
                    className="py-2.5 px-4 border-[1.5px] rounded-sm hover:bg-[#EFECE3] transition-colors text-sm font-bold"
                    style={{ borderColor: '#111013', color: '#111013' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Drawer (sidebar) */}
      <Transition.Root show={isMobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[100] lg:hidden"
          onClose={setIsMobileMenuOpen}
          initialFocus={undefined}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-[#111013]/50 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
            />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-sm">
                    <div
                      className="flex h-full flex-col shadow-2xl"
                      style={{ backgroundColor: '#F7F5EF' }}
                    >
                      <Dialog.Title className="sr-only">
                        Main navigation menu
                      </Dialog.Title>

                      {/* Drawer Header */}
                      <div className="relative overflow-hidden border-b border-[#DAD5C7]">
                        <div
                          className="absolute -right-10 -top-14 w-40 h-40 bg-[#FF5A1F] opacity-90 [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]"
                          aria-hidden="true"
                        />
                        <div className="relative flex items-center justify-between px-6 py-5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-auto">
                              <LazyLogo />
                            </div>
                            <span className="font-display font-extrabold text-xl uppercase" style={{ color: '#111013' }}>
                              Haatpoint
                            </span>
                          </div>
                          <button
                            type="button"
                            className="p-2 rounded-sm hover:bg-[#EFECE3] transition-colors relative z-10"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label="Close menu"
                          >
                            <FiX className="h-5 w-5" style={{ color: '#111013' }} aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Drawer Content */}
                      <div className="flex-1 overflow-y-auto py-6">
                        {/* User Info */}
                        {user && (
                          <div className="px-6 mb-6">
                            <div className="flex items-center gap-3 p-4 bg-[#EFECE3] rounded-sm border border-[#DAD5C7]">
                              <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-[#FF5A1F] to-[#D6430E] flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
                                <LazyAvatar
                                  src={getUserAvatarUrl(user) || ''}
                                  alt={user.name}
                                  className="h-full w-full"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate" style={{ color: '#111013' }}>{user.name}</p>
                                <p className="text-sm truncate" style={{ color: '#6B6A66' }}>{user.email}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Navigation */}
                        <nav className="space-y-1 px-4" aria-label="Mobile navigation">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center justify-between rounded-sm px-4 py-3 text-base font-semibold transition-colors"
                              style={{ color: '#111013' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE3'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5" style={{ color: '#111013' }} aria-hidden="true" />
                                {item.name}
                              </div>
                              {item.badge && (
                                <span
                                  className="inline-flex items-center rounded-full bg-[#FF5A1F] px-2.5 py-0.5 font-mono text-[10px] uppercase text-white"
                                  aria-label={`${item.badge} deals`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </nav>

                        {/* Dashboard Links */}
                        {user && (
                          <>
                            <div className="border-t border-[#DAD5C7] my-6" aria-hidden="true" />
                            <div className="px-4">
                              <h3 className="px-3 font-mono text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B6A66' }}>
                                Dashboard
                              </h3>
                              <nav className="space-y-1" aria-label="Dashboard navigation">
                                <Link
                                  href="/dashboard"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-3 rounded-sm px-4 py-3 text-base font-semibold transition-colors"
                                  style={{ color: '#111013' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE3'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <FiGrid className="h-5 w-5" style={{ color: '#111013' }} aria-hidden="true" />
                                  Dashboard
                                </Link>
                                <Link
                                  href="/dashboard/orders"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-3 rounded-sm px-4 py-3 text-base font-semibold transition-colors"
                                  style={{ color: '#111013' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE3'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <FiShoppingCart className="h-5 w-5" style={{ color: '#111013' }} aria-hidden="true" />
                                  Orders
                                </Link>
                                <Link
                                  href="/wishlist"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-3 rounded-sm px-4 py-3 text-base font-semibold transition-colors"
                                  style={{ color: '#111013' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE3'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <FiHeart className="h-5 w-5" style={{ color: '#111013' }} aria-hidden="true" />
                                  Wishlist
                                  {wishlist?.length > 0 && (
                                    <span
                                      className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#EFECE3] font-mono text-[10px] font-medium text-[#D6430E]"
                                      aria-label={`${wishlist.length} items in wishlist`}
                                    >
                                      {wishlist.length}
                                    </span>
                                  )}
                                </Link>
                              </nav>
                            </div>
                          </>
                        )}

                        {/* Auth Actions */}
                        <div className="border-t border-[#DAD5C7] my-6" aria-hidden="true" />
                        <div className="px-4">
                          {user ? (
                            <Link
                              href="/logout"
                              method="post"
                              as="button"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <FiLogOut className="h-5 w-5" aria-hidden="true" />
                              Log out
                            </Link>
                          ) : (
                            <div className="space-y-3">
                              <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#FF5A1F] px-4 py-3 text-base font-bold text-white shadow-[4px_4px_0_#111013] hover:-translate-y-0.5 transition-transform"
                              >
                                Sign In
                              </Link>
                              <Link
                                href="/register"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex w-full items-center justify-center rounded-sm border-[1.5px] px-4 py-3 text-base font-bold transition-colors"
                                style={{ borderColor: '#111013', color: '#111013' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE3'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                Create Account
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-[#DAD5C7] px-6 py-4">
                        <div className="flex items-center justify-between font-mono text-xs" style={{ color: '#4B4B4B' }}>
                          <span>© {new Date().getFullYear()} Haatpoint</span>
                          <Link
                            href="/terms"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="hover:text-[#D6430E] transition-colors"
                          >
                            Terms
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default Navbar
