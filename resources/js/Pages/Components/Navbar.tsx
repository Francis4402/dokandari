import { PropsWithChildren, useState, useRef, useEffect, Fragment } from "react"
import { Link } from "@inertiajs/react"
import { useGSAP } from "@gsap/react"
import React from "react"
import gsap from "gsap"
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
} from "react-icons/fi"
import { Dialog, Transition } from "@headlessui/react"
import { useStore } from "../state/cartStore"
import WishlistCountButton from "../buttons/WishListCountButton"

const navigation = [
  { name: 'Home', href: '/', icon: FiHome },
  { name: 'Deals', href: '/hotdeals', badge: 'HOT', icon: FiTag },
  { name: 'New Arrivals', href: '/', icon: FiZap },
]

const Navbar = ({ user, wishlist } : PropsWithChildren<{user: any, wishlist: any}>) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchPanelRef = useRef<HTMLDivElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const {getTotalItems} = useStore();
  const cartItems = getTotalItems();

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
        if (userMenuOpen) setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [searchOpen, userMenuOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      // Handle search
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
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Left Section - Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br transition-transform group-hover:scale-105">
                  <img src="/logo.png" alt="HaatPoint" className="h-96 w-96 object-contain" />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex ml-8 space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 text-gray-700 hover:text-gray-900"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                    {item.badge && (
                      <span className="ml-1 inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Middle Section - Search */}
            <div className="flex-1 max-w-xl hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search products, brands, and more..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Mobile Search Button */}
              <button
                ref={searchButtonRef}
                onClick={handleSearchButtonClick}
                className="md:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors relative"
                aria-label="Search"
              >
                {searchOpen ? (
                  <FiX className="h-5 w-5" />
                ) : (
                  <FiSearch className="h-5 w-5" />
                )}
              </button>

              {/* Wishlist Button */}
              <div className="hidden sm:block">
                <WishlistCountButton wishlist={wishlist} />
              </div>

              {/* Cart Button */}
              <Link
                href={route('cart.index')}
                className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors relative"
                aria-label="Cart"
              >
                <FiShoppingBag className="h-5 w-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-[10px] font-semibold text-white ring-2 ring-white">
                    {cartItems > 99 ? '99+' : cartItems}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium text-sm">
                    {user ? (
                      <img
                        src={
                          user.images
                            ? user.images.startsWith('http')
                              ? user.images
                              : `/storage/${user.images}`
                            : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)
                        }
                        alt={user.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
                        }}
                      />
                    ) : (
                      <FiUser className="h-4 w-4" />
                    )}
                  </div>
                  {user && (
                    <span className="hidden sm:inline text-sm font-medium text-gray-700">
                      {user.name.split(' ')[0]}
                    </span>
                  )}
                  <FiChevronDown className={`hidden sm:block h-4 w-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
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
                  <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden">
                    {user ? (
                      <>
                        <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
                              <img
                                src={
                                  user.images
                                    ? user.images.startsWith('http')
                                      ? user.images
                                      : `/storage/${user.images}`
                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
                                }
                                alt={user.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                              <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-1.5">
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FiGrid className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FiUser className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                            Profile Settings
                          </Link>
                          <Link
                            href="/dashboard/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FiPackage className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                            Order History
                          </Link>
                          <Link
                            href="/wishlist"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FiHeart className="h-4 w-4 text-gray-400 group-hover:text-red-500" />
                            Wishlist
                            {wishlist?.length > 0 && (
                              <span className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-xs font-medium text-red-600">
                                {wishlist.length}
                              </span>
                            )}
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 py-1.5">
                          <Link
                            href="/logout"
                            method="post"
                            as="button"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <FiLogOut className="h-4 w-4 group-hover:text-red-600" />
                            Log out
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="py-2">
                        <Link
                          href="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FiUser className="h-4 w-4 text-gray-400" />
                          Sign in
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FiUser className="h-4 w-4 text-gray-400" />
                          Create account
                        </Link>
                      </div>
                    )}
                  </div>
                </Transition>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-lg bg-gray-200 hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                <FiMenu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Search Panel */}
          {searchOpen && (
            <div
              ref={searchPanelRef}
              className="md:hidden py-4 border-t border-gray-100"
            >
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="search"
                    placeholder="What are you looking for?"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseSearch}
                    className="py-2.5 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <Transition.Root show={isMobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setIsMobileMenuOpen}
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
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
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
                    <div className="flex h-full flex-col bg-white shadow-xl">
                      {/* Drawer Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
                            <img src="/Logo.png" alt="HaatPoint" className="h-7 w-7 object-contain" />
                          </div>
                          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                            HaatPoint
                          </span>
                        </div>
                        <button
                          type="button"
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Drawer Content */}
                      <div className="flex-1 overflow-y-auto py-6">
                        {/* User Info */}
                        {user && (
                          <div className="px-6 mb-6">
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                              <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
                                <img
                                  src={
                                    user.images
                                      ? user.images.startsWith('http')
                                        ? user.images
                                        : `/storage/${user.images}`
                                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
                                  }
                                  alt={user.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Navigation */}
                        <nav className="space-y-1 px-4">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5" />
                                {item.name}
                              </div>
                              {item.badge && (
                                <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </nav>

                        {/* Dashboard Links */}
                        {user && (
                          <>
                            <div className="border-t my-6" />
                            <div className="px-4">
                              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Dashboard
                              </h3>
                              <nav className="space-y-1">
                                <Link
                                  href="/dashboard"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <FiGrid className="h-5 w-5" />
                                  Dashboard
                                </Link>
                                <Link
                                  href="/dashboard/orders"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <FiShoppingCart className="h-5 w-5" />
                                  Orders
                                </Link>
                                <Link
                                  href="/wishlist"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <FiHeart className="h-5 w-5" />
                                  Wishlist
                                  {wishlist?.length > 0 && (
                                    <span className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-xs font-medium text-red-600">
                                      {wishlist.length}
                                    </span>
                                  )}
                                </Link>
                              </nav>
                            </div>
                          </>
                        )}

                        {/* Auth Actions */}
                        <div className="border-t my-6" />
                        <div className="px-4">
                          {user ? (
                            <Link
                              href="/logout"
                              method="post"
                              as="button"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <FiLogOut className="h-5 w-5" />
                              Log out
                            </Link>
                          ) : (
                            <div className="space-y-3">
                              <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors"
                              >
                                Sign In
                              </Link>
                              <Link
                                href="/register"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Create Account
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-gray-100 px-6 py-4">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>© {new Date().getFullYear()} HaatPoint</span>
                          <Link
                            href="/terms"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="hover:text-gray-700 transition-colors"
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
