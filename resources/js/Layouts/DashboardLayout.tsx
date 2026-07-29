
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
    ...((user.role === 'admin') ? [
        {
            name: 'Customers',
            href: '/dashboard/customers',
            icon: FiUsers,
            current: url.startsWith('/dashboard/customers')
        },
    ] : []),


    ...(user.role === 'agent' ? [
        {
            name: 'Products',
            href: '/dashboard/products',
            icon: FiPackage,
            current: url.startsWith('/dashboard/products')
        },
        {
            name: 'Orders',
            href: '/dashboard/orders',
            icon: FiShoppingCart,
            current: url.startsWith('/dashboard/orders')
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
        }
    ] : []),

    ...(user.role === 'admin' || user.role === 'superadmin' ? [
        {
            name: 'Customers',
            href: '/dashboard/customers',
            icon: FiUsers,
            current: url.startsWith('/dashboard/customers')
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
            href: '/dashboard/admin/orders',
            icon: FiShoppingCart,
            current: url.startsWith('/dashboard/orders')
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
            name: 'Messages',
            href: '/dashboard/messages',
            icon: FiMessageSquare,
            current: url.startsWith('/dashboard/messages')
        },
        {
            name: 'Payments',
            href: '/dashboard/payments',
            icon: FiCreditCard,
            current: url.startsWith('/dashboard/payments')
        },
        {
            name: 'Analytics',
            href: '/dashboard/analytics',
            icon: FiBarChart2,
            current: url.startsWith('/dashboard/analytics')
        }
    ] : []),
    ...((user.role === 'deliveryman') ? [{
        name: 'Shipping',
        href: '/dashboard/shipping',
        icon: FiTruck,
        current: url.startsWith('/dashboard/shipping')
    }, {
      name: 'Payments',
      href: '/dashboard/payments',
      icon: FiCreditCard,
      current: url.startsWith('/dashboard/payments')
    }] : []),
    ...((user.role === 'user') ? [
        {
            name: 'Payments',
            href: '/dashboard/payments',
            icon: FiCreditCard,
            current: url.startsWith('/dashboard/payments')
        },
        {
            name: 'Orders',
            href: '/dashboard/orders',
            icon: FiShoppingCart,
            current: url.startsWith('/dashboard/orders')
        },
        {
            name: 'Messages',
            href: '/dashboard/messages',
            icon: FiMessageSquare,
            current: url.startsWith('/dashboard/messages')
        },
        {
            name: 'Shipping',
            href: '/dashboard/shipping',
            icon: FiTruck,
            current: url.startsWith('/dashboard/shipping')
        },
    ] : []),
  ];

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    post('/logout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Mobile sidebar drawer */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          {/* Backdrop with blur effect */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 shadow-xl">
                {/* Close button overlay (click outside to close) */}
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                  </button>
                </div>

                {/* Sidebar content */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center justify-between">
                    <div className="h-14 w-14 rounded-lg flex items-center justify-center">
                        <img src="/Logo.png" alt="i" />
                    </div>
                    <Link href='/'>
                      <h1 className="text-xl font-bold text-gray-900">HaatPoint</h1>
                    </Link>
                    <button
                      type="button"
                      className="ml-auto rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <FiX className="h-6 w-6" aria-hidden="true" />
                      <span className="sr-only">Close sidebar</span>
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
                                  group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
                                  ${item.current
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                  }
                                `}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <item.icon
                                  className={`h-6 w-6 shrink-0 transition-colors ${
                                    item.current
                                      ? 'text-white'
                                      : 'text-gray-400 group-hover:text-blue-600'
                                  }`}
                                  aria-hidden="true"
                                />
                                {item.name}
                                {item.current && (
                                  <span className="ml-auto w-2 h-2 bg-white rounded-full" />
                                )}
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
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
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
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
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
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:bg-gray-100 rounded-md transition-colors"
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
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow"
                placeholder="Search..."
              />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative transition-colors">
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
                        src={
                            user.images
                                ? user.images.startsWith('http')
                                    ? user.images
                                    : `/storage/${user.images}`
                                : 'https://github.com/shadcn.png'
                        }
                        alt={user.name}
                        className="inline-block size-8 rounded-full ring-2 ring-gray-200 outline -outline-offset-1 outline-white transition-transform hover:scale-105"
                        onError={() => 'https://github.com/shadcn.png'}
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
                                href="/dashboard/profile"
                                className={`${
                                active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                } flex items-center w-full px-4 py-2.5 text-sm transition-colors`}
                            >
                                <FiUser className="h-4 w-4 mr-3 text-gray-400" />
                                Your Profile
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

            {/* Page content - Add a white background container for consistency */}
            <div className="bg-white rounded-lg shadow-sm transition-shadow">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
