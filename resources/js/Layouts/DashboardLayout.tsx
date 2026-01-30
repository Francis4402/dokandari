// resources/js/Components/Dashboard/Layout.tsx
import React, { useState, Fragment } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiBarChart2,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiBell,
  FiSearch,
  FiGrid,
  FiTruck,
  FiCreditCard,
  FiMessageSquare,
  FiUser,
  FiSettings,
  FiHelpCircle
} from 'react-icons/fi';
import { Link, useForm, usePage } from '@inertiajs/react';
import { User } from '@/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  user: User;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title = 'Dashboard', user }) => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { url } = usePage();

  const { post } = useForm();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: FiHome,
      current: url === '/dashboard'
    },
    {
      name: 'Products',
      href: '/dashboard/products',
      icon: FiPackage,
      current: url.startsWith('/dashboard/products')
    },
    {
      name: 'Categories',
      href: '/dashboard/categories',
      icon: FiGrid,
      current: url.startsWith('/dashboard/categories')
    },
    {
      name: 'Orders',
      href: '/dashboard/orders',
      icon: FiShoppingCart,
      current: url.startsWith('/dashboard/orders')
    },
    {
      name: 'Customers',
      href: '/dashboard/customers',
      icon: FiUsers,
      current: url.startsWith('/dashboard/customers')
    },
    {
      name: 'Stores',
      href: '/dashboard/stores',
      icon: FiShoppingBag,
      current: url.startsWith('/dashboard/stores')
    },
    {
      name: 'Shipping',
      href: '/dashboard/shipping',
      icon: FiTruck,
      current: url.startsWith('/dashboard/shipping')
    },
    {
      name: 'Payments',
      href: '/dashboard/payments',
      icon: FiCreditCard,
      current: url.startsWith('/dashboard/payments')
    },
    {
      name: 'Messages',
      href: '/dashboard/messages',
      icon: FiMessageSquare,
      current: url.startsWith('/dashboard/messages')
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: FiBarChart2,
      current: url.startsWith('/dashboard/analytics')
    },
  ];

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    post('/logout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar drawer */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center justify-between">
                    <Link href='/'>
                        <h1 className="text-xl font-bold text-gray-900">HaatPoint</h1>
                    </Link>
                    <button
                      type="button"
                      className="ml-auto rounded-md p-2.5 text-gray-700"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <FiX className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={`
                                  group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                                  ${item.current
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                  }
                                `}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <item.icon
                                  className={`h-6 w-6 shrink-0 ${item.current ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center justify-between">
            {!isCollapsed && (
              <Link href="/" className="flex items-center">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">ES</span>
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900">HaatPoint</h1>
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {isCollapsed ? <FiChevronRight className="h-5 w-5" /> : <FiChevronLeft className="h-5 w-5" />}
            </button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                          ${item.current
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${item.current ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`}
                          aria-hidden="true"
                        />
                        {!isCollapsed && <span>{item.name}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}>
        {/* Top navigation bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="search"
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Search..."
              />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative">
                <FiBell className="h-6 w-6" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Separator */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

              {/* Profile dropdown */}
              <div className="relative">
                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-all duration-200 hover:ring-2 hover:ring-blue-300">
                    <img
                        src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="User profile"
                        className="inline-block size-8 rounded-full ring-2 ring-gray-200 outline -outline-offset-1 outline-white"
                    />
                    </Menu.Button>

                    <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-xl border border-gray-200 divide-y divide-gray-100 focus:outline-none z-50">
                        {/* User Info */}
                        <div className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                            <Link
                                href="/profile"
                                className={`${
                                active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                } flex items-center w-full px-4 py-2.5 text-sm transition-colors`}
                            >
                                <FiUser className="h-4 w-4 mr-3 text-gray-400" />
                                Profile
                            </Link>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                            <Link
                                href="/settings"
                                className={`${
                                active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                } flex items-center w-full px-4 py-2.5 text-sm transition-colors`}
                            >
                                <FiSettings className="h-4 w-4 mr-3 text-gray-400" />
                                Settings
                            </Link>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                            <Link
                                href="/help"
                                className={`${
                                active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                } flex items-center w-full px-4 py-2.5 text-sm transition-colors`}
                            >
                                <FiHelpCircle className="h-4 w-4 mr-3 text-gray-400" />
                                Help & Support
                            </Link>
                            )}
                        </Menu.Item>
                        </div>

                        {/* Logout */}
                        <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                            <form method="POST" onClick={handleLogout}>
                                <button
                                type="submit"
                                className={`${
                                    active ? 'bg-red-50 text-red-700' : 'text-red-600'
                                } flex items-center w-full px-4 py-2.5 text-sm transition-colors text-left`}
                                >
                                <FiLogOut className="h-4 w-4 mr-3" />
                                Sign out
                                </button>
                            </form>
                            )}
                        </Menu.Item>
                        </div>
                    </Menu.Items>
                    </Transition>
                </Menu>
                </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="py-6">
          {/* Container to center content and match form width */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <nav className="flex mt-2" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                      <FiHome className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </li>
                  {title !== 'Dashboard' && (
                    <li>
                      <div className="flex items-center">
                        <FiChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                        <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{title}</span>
                      </div>
                    </li>
                  )}
                </ol>
              </nav>
            </div>

            {/* Page content - Add a white background container for consistency */}
            <div className="bg-white rounded-lg shadow-sm">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
