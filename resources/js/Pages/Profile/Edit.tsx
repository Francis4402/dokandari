import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import UpdateProfileInformation from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { FaUserCircle, FaKey, FaTrash, FaCog, FaCheckCircle } from 'react-icons/fa';

interface PageProps {
  auth: {
    user: any;
  };
  mustVerifyEmail: boolean;
  status?: string;
}

export default function Edit({ auth, mustVerifyEmail, status }: PageProps) {
  const tabs = [
    {
      name: 'Profile',
      icon: <FaUserCircle className="h-5 w-5" />,
      component: <UpdateProfileInformation mustVerifyEmail={mustVerifyEmail} status={status} user={auth.user} />
    },
    {
      name: 'Password',
      icon: <FaKey className="h-5 w-5" />,
      component: <UpdatePasswordForm />
    },
    {
      name: 'Account',
      icon: <FaTrash className="h-5 w-5" />,
      component: <DeleteUserForm />
    }
  ];

  return (
    <DashboardLayout user={auth.user}>
      <Head title="Profile Settings" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="mt-2 text-gray-600">Manage your profile, security, and account preferences</p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <Tab.Group>
              <div className="lg:grid lg:grid-cols-12">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-4 border-r border-gray-200">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="relative">
                        <img
                          src={auth.user.images || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                          alt={auth.user.name}
                          className="w-16 h-16 rounded-full ring-4 ring-blue-100"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{auth.user.name}</h2>
                        <p className="text-sm text-gray-500">{auth.user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {auth.user.role}
                        </span>
                      </div>
                    </div>

                    <Tab.List className="space-y-1">
                      {tabs.map((tab, index) => (
                        <Tab key={index} as={Fragment}>
                          {({ selected }) => (
                            <button
                              className={`${
                                selected
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                              } w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl border transition-all duration-200`}
                            >
                              <span className={`${selected ? 'text-blue-600' : 'text-gray-400'}`}>
                                {tab.icon}
                              </span>
                              <span className="font-medium">{tab.name}</span>
                              {selected && (
                                <FaCheckCircle className="ml-auto h-4 w-4 text-blue-500" />
                              )}
                            </button>
                          )}
                        </Tab>
                      ))}
                    </Tab.List>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCog className="h-4 w-4" />
                        <span>Last updated: {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-8">
                  <Tab.Panels className="h-full">
                    {tabs.map((tab, index) => (
                      <Tab.Panel key={index} className="h-full p-6 lg:p-8">
                        {tab.component}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </div>
              </div>
            </Tab.Group>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Member Since</p>
                  <p className="text-2xl font-bold mt-1">Jan 2024</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FaUserCircle className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Email Status</p>
                  <p className="text-2xl font-bold mt-1">
                    {auth.user.email_verified_at ? 'Verified' : 'Unverified'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FaCheckCircle className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Account Status</p>
                  <p className="text-2xl font-bold mt-1">Active</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FaCog className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
