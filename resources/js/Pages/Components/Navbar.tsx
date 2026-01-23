import { PropsWithChildren, useState, useRef, useEffect } from "react"
import { Link } from "@inertiajs/react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import {
  FiSearch,
  FiShoppingBag,
  FiHeart,
  FiBell,
  FiUser,
  FiMenu,
  FiX,
  FiHome,
  FiTag,
  FiZap,
  FiPackage,
  FiLogOut,
  FiGrid,
  FiChevronDown
} from "react-icons/fi"

const navigation = [
  { name: 'Home', href: '/', icon: FiHome },
  { name: 'Dashboard', href: '/dashboard', icon: FiGrid },
  { name: 'All Products', href: '/allproducts', hasDropdown: true, icon: FiShoppingBag },
  { name: 'Deals', href: '/deals', badge: 'HOT', icon: FiTag },
  { name: 'New Arrivals', href: '/new', icon: FiZap },
]

const categories = [
  { name: 'Electronics', href: '/category/electronics', description: 'Latest gadgets and devices' },
  { name: 'Fashion', href: '/category/fashion', description: 'Clothing and accessories' },
  { name: 'Home & Garden', href: '/category/home', description: 'Furniture and decor' },
  { name: 'Beauty', href: '/category/beauty', description: 'Skincare and cosmetics' },
  { name: 'Sports', href: '/category/sports', description: 'Sports equipment' },
  { name: 'Books', href: '/category/books', description: 'Books and magazines' },
]

const Navbar = ({ user } : PropsWithChildren<{user: any}>) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchPanelRef = useRef<HTMLDivElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const cartItems = 3
  const wishlistItems = 5
  const notifications = 2

  // Handle click outside to close search
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

      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }

      if (
        userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (searchOpen) handleCloseSearch()
        if (dropdownOpen) setDropdownOpen(false)
        if (userMenuOpen) setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [searchOpen, dropdownOpen, userMenuOpen])

  // GSAP animation for mobile search
  useGSAP(() => {
    if (searchPanelRef.current) {
      if (searchOpen) {
        gsap.set(searchPanelRef.current, {
          display: "block",
          height: "auto"
        })
        gsap.fromTo(searchPanelRef.current,
          {
            opacity: 0,
            y: -10
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: "power2.out"
          }
        )

        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus()
          }
        }, 100)
      } else {
        gsap.to(searchPanelRef.current,
          {
            opacity: 0,
            y: -10,
            duration: 0.15,
            ease: "power2.in",
            onComplete: () => {
              gsap.set(searchPanelRef.current, { display: "none" })
            }
          }
        )
      }
    }
  }, [searchOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      console.log("Searching for:", searchValue)
      setSearchOpen(false)
      setSearchValue("")
    }
  }

  const handleSearchButtonClick = () => {
    setSearchOpen(!searchOpen)
  }

  const handleCloseSearch = () => {
    setSearchOpen(false)
    setSearchValue("")
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left Section - Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                <FiMenu className="h-5 w-5" />
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="hidden lg:inline text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  ShopHub
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex ml-6 space-x-1">
                {navigation.map((item) => (
                  <div key={item.name} className="relative" ref={item.hasDropdown ? dropdownRef : undefined}>
                    {item.hasDropdown ? (
                      <>
                        <button
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors ${dropdownOpen ? 'bg-gray-100' : ''}`}
                        >
                          {item.name}
                          <FiChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {dropdownOpen && (
                          <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border z-50 origin-top-left animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4">
                              <h3 className="text-lg font-semibold mb-4">Shop Categories</h3>
                              <div className="grid grid-cols-2 gap-4">
                                {categories.map((category) => (
                                  <Link
                                    key={category.name}
                                    href={category.href}
                                    onClick={() => setDropdownOpen(false)}
                                    className="group block space-y-1 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="font-medium text-gray-900 group-hover:text-blue-600">
                                      {category.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {category.description}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.name}
                        {item.badge && (
                          <span className="ml-1 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Middle Section - Desktop Search */}
            <div className="flex-1 max-w-2xl">
              <div className="hidden lg:block">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search products, brands, and more..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </form>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2 relative">
              {/* Mobile Search Button */}
              <button
                ref={searchButtonRef}
                onClick={handleSearchButtonClick}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Search"
                aria-expanded={searchOpen}
              >
                {searchOpen ? (
                  <FiX className="h-5 w-5" />
                ) : (
                  <FiSearch className="h-5 w-5" />
                )}
              </button>

              {/* Desktop Action Buttons */}
              <div className="hidden lg:flex items-center gap-1">
                <Link
                  href="/wishlist"
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors relative"
                >
                  <FiHeart className="h-5 w-5" />
                  {wishlistItems > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-xs text-white">
                      {wishlistItems}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors relative"
                >
                  <FiShoppingBag className="h-5 w-5" />
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-500 text-xs text-white">
                      {cartItems}
                    </span>
                  )}
                </Link>

                <button className="p-2 rounded-md hover:bg-gray-100 transition-colors relative">
                  <FiBell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-xs text-white">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium">
                    {user ? user.name.charAt(0) : <FiUser className="h-4 w-4" />}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                    {user ? (
                      <>
                        <div className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FiGrid className="h-4 w-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FiUser className="h-4 w-4" />
                            Profile
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FiPackage className="h-4 w-4" />
                            Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FiHeart className="h-4 w-4" />
                            Wishlist
                            {wishlistItems > 0 && (
                              <span className="ml-auto inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                {wishlistItems}
                              </span>
                            )}
                          </Link>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/logout"
                            method="post"
                            as="button"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                          >
                            <FiLogOut className="h-4 w-4" />
                            Log out
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="py-1">
                        <Link
                          href="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiUser className="h-4 w-4" />
                          Sign in
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Create account
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Search Panel */}
            {searchOpen && (
              <div
                ref={searchPanelRef}
                className="absolute left-0 right-0 top-full z-40 bg-white border-t border-b shadow-lg"
                style={{ display: 'none' }}
              >
                <div className="p-4">
                  <form onSubmit={handleSearchSubmit} className="mb-4">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="search"
                        placeholder="What are you looking for?"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        aria-label="Search"
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Search
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseSearch}
                        className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Popular Searches</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.slice(0, 5).map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          onClick={handleCloseSearch}
                          className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200 transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Modal */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-50 lg:hidden animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex max-w-full z-50 lg:hidden">
            <div className="pointer-events-auto w-screen max-w-xs sm:max-w-md animate-in slide-in-from-left duration-300">
              <div className="flex h-full flex-col bg-white shadow-xl">
                {/* Header */}
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                      </div>
                      <span className="text-xl font-bold">ShopHub</span>
                    </div>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-md hover:bg-gray-100"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="space-y-2 px-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.name}
                        {item.badge && (
                          <span className="ml-auto inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t my-6" />

                  <div className="px-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Categories</h3>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="border-t my-6" />

                  {user ? (
                    <div className="px-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <FiUser className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <FiPackage className="h-4 w-4" />
                          Orders
                        </Link>
                        <Link
                          href="/logout"
                          method="post"
                          as="button"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <FiLogOut className="h-4 w-4" />
                          Log out
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 space-y-3">
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar
