import DashboardLayout from '@/Layouts/DashboardLayout';
import { storeType } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import {
  FaStore,
  FaTag,
  FaImage,
  FaFileAlt,
  FaUpload,
  FaTimes,
  FaCheckCircle,
  FaArrowLeft,
  FaInfoCircle,
  FaExclamationTriangle,
  FaBuilding,
  FaCertificate,
  FaCheck,
  FaKey,
  FaIdCard,
  FaUser,
  FaMobile,
  FaMobileAlt,
  FaSave
} from 'react-icons/fa';
import {
  HiOutlineExclamationCircle
} from 'react-icons/hi2';
import { FaAddressBook } from "react-icons/fa6";
import { toast } from 'sonner';

const STORE_TYPES = [
  'Retail Store',
  'E-commerce',
  'Wholesale',
  'Service Provider',
  'Food & Beverage',
  'Fashion & Apparel',
  'Electronics',
  'Home & Garden',
  'Health & Beauty',
  'Sports & Fitness',
  'Books & Media',
  'Arts & Crafts',
  'Automotive',
  'Jewelry',
  'Other'
];

interface EditStoreFormProps {
    auth: {
        user: any
    };
    store: storeType | null;
}

export default function StoreUpdateForm({ auth, store }: EditStoreFormProps) {
  if (!store) {
    return (
      <DashboardLayout user={auth.user}>
        <Head title="Store Not Found">
          <meta name="description" content="Store not found" />
        </Head>

        <div className="max-w-4xl mx-auto p-5">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <FaStore className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Store Not Found</h1>
              <p className="text-gray-600 mb-6">The store you're trying to edit does not exist or you don't have permission to access it.</p>
              <button
                onClick={() => router.visit(route('dashboard.store'))}
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaArrowLeft className="h-4 w-4 mr-2" />
                Back to Stores
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showStoreTypeDropdown, setShowStoreTypeDropdown] = useState(false);
  const [hasNewLogo, setHasNewLogo] = useState(false);

  const { data, setData, processing, errors, reset } = useForm({
    name: store.name || '',
    logo: null as File | null,
    storetype: store.storetype || '',
    address: store.address || '',
    license: store.license || '',
    national_id: store.national_id || '',
    mobile: store.mobile || '',
    remove_logo: false,
  });

  useEffect(() => {
    if (store.logo) {
      setLogoPreview(`/storage/${store.logo}`);
    }
  }, [store.logo]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;


        if (file.size > 5 * 1024 * 1024) {
            toast.error('Logo must be less than 5MB');
            e.target.value = '';
            return;
        }

        setData('logo', file);
        const preview = URL.createObjectURL(file);
        setLogoPreview(preview);
        toast.success('Logo uploaded successfully!');
    };

  const removeLogo = () => {
    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }

    // Show original logo if exists, otherwise show upload area
    const originalPreview = store.logo ? `/storage/${store.logo}` : null;
    setLogoPreview(originalPreview);
    setData('logo', null);
    setHasNewLogo(false);
    setData('remove_logo', true);

    toast.info('Logo will be removed on update');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend validation
    if (!data.name.trim()) {
        toast.error('Store name is required');
        return;
    }
    if (data.name.length < 3) {
        toast.error('Store name must be at least 3 characters');
        return;
    }
    if (data.name.length > 100) {
        toast.error('Store name must be less than 100 characters');
        return;
    }
    if (!data.storetype) {
        toast.error('Store type is required');
        return;
    }
    if (data.license && data.license.length > 24) {
        toast.error('License number must be less than 24 characters');
        return;
    }
    if (!data.national_id || data.national_id.length !== 10) {
        toast.error('National ID must be exactly 10 digits');
        return;
    }
    if (!/^\d+$/.test(data.national_id)) {
        toast.error('National ID must contain only numbers');
        return;
    }
    if (!data.mobile || data.mobile.length !== 11) {
        toast.error('Mobile number must be exactly 11 digits');
        return;
    }
    if (!/^\d+$/.test(data.mobile)) {
        toast.error('Mobile number must contain only numbers');
        return;
    }
    if (!data.address.trim()) {
        toast.error('Address is required');
        return;
    }
    if (data.address.length > 255) {
        toast.error('Address must be less than 255 characters');
        return;
    }

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', data.name.trim());
    formData.append('storetype', data.storetype.trim());
    formData.append('license', (data.license || '').trim());
    formData.append('address', data.address.trim());
    formData.append('national_id', data.national_id.trim());
    formData.append('mobile', data.mobile.trim());
    formData.append('remove_logo', data.remove_logo.toString());


    if (data.logo) {
        formData.append('logo', data.logo);
    }


    router.post(route('dashboard.storeupdate', { store: store.id }), formData, {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
        toast.success('Store updated successfully!');
        router.visit(route('dashboard.store'));
        },
        onError: (errors) => {

        if (errors.name) {
            toast.error(errors.name);
        } else if (errors.national_id) {
            toast.error(errors.national_id);
        } else if (errors.mobile) {
            toast.error(errors.mobile);
        } else if (errors.address) {
            toast.error(errors.address);
        } else if (errors.logo) {
            toast.error(errors.logo);
        } else if (errors.storetype) {
            toast.error(errors.storetype);
        } else if (errors.license) {
            toast.error(errors.license);
        } else {
            toast.error('Failed to update store. Please check the form for errors.');
        }
        }
    });
    };

  // Cleanup logo preview URLs
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  return (
    <DashboardLayout user={auth.user}>
      <Head title={`Edit ${store.name}`}>
        <meta name="description" content="Edit your store information" />
      </Head>

      <div className="max-w-4xl mx-auto p-5">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaStore className="h-8 w-8 text-purple-600" />
                Edit Store: {store.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Update your store information
              </p>
            </div>
            <button
              onClick={() => router.visit(route('dashboard.store'))}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Back to Stores
            </button>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <FaBuilding className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Store Information</h2>
            </div>

            <div className="space-y-6">
              {/* Store Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FaTag className="h-4 w-4" />
                  Store Name <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaStore className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g., My Awesome Store"
                    className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={processing}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FaAddressBook className="h-4 w-4" />
                  Address <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Address of your store"
                    className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={processing}
                  />
                </div>
                {errors.address && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FaMobile className="h-4 w-4" />
                  Mobile <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaMobileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="tel"
                    value={data.mobile}
                    onChange={(e) => setData('mobile', e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 11-digit mobile number"
                    className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={processing}
                    maxLength={11}
                  />
                </div>
                {errors.mobile && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.mobile}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Must be exactly 11 digits
                </p>
              </div>

              {/* Store Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStoreTypeDropdown(!showStoreTypeDropdown)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-left flex justify-between items-center hover:border-gray-400 transition-colors"
                    disabled={processing}
                  >
                    <span className={data.storetype ? 'text-gray-800' : 'text-gray-400'}>
                      {data.storetype || 'Select store type'}
                    </span>
                    <svg className={`h-5 w-5 text-gray-400 transition-transform ${showStoreTypeDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showStoreTypeDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                      {STORE_TYPES.map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setData('storetype', type);
                            setShowStoreTypeDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors flex items-center justify-between ${
                            data.storetype === type ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                          }`}
                        >
                          {type}
                          {data.storetype === type && <FaCheck className="h-4 w-4 text-purple-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.storetype && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.storetype}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Store Logo Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <FaImage className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-800">Store Logo</h2>
              <span className="ml-2 text-xs text-gray-500">(Optional)</span>
            </div>

            <div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={processing}
              />

              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Logo Preview */}
                <div className="flex-1">
                  <div
                    onClick={() => !processing && logoInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      !processing ? 'cursor-pointer hover:border-purple-400 hover:bg-purple-50' : 'cursor-not-allowed'
                    } ${
                      !logoPreview
                        ? 'border-gray-300'
                        : 'border-gray-200'
                    }`}
                  >
                    {!logoPreview ? (
                      <div className="space-y-4">
                        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                          <FaUpload className="h-10 w-10 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Upload New Logo</p>
                          <p className="text-xs text-gray-500 mt-1">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative group">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-40 h-40 object-contain mx-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeLogo();
                            }}
                            className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            disabled={processing}
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                          {data.remove_logo && (
                            <div className="absolute inset-0 bg-red-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">Will be removed</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {hasNewLogo ? 'New logo selected' : 'Current logo'}
                          {hasNewLogo && <span className="block text-xs text-gray-500">Click to change</span>}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logo Requirements */}
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <FaInfoCircle className="h-4 w-4 text-blue-600" />
                      Logo Guidelines
                    </h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Recommended: Square format
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Auto-resized to 800px width
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Optimized to 85% quality
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Max file size: 10MB
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Formats: PNG, JPG, JPEG, WEBP
                      </li>
                    </ul>
                    {data.remove_logo && (
                      <div className="mt-3 pt-3 border-t border-red-200 bg-red-50 rounded p-2">
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <FaInfoCircle className="h-3 w-3" />
                          Logo will be removed on update
                        </p>
                      </div>
                    )}
                    {store.logo && !hasNewLogo && !data.remove_logo && (
                      <div className="mt-3 pt-3 border-t border-green-200 bg-green-50 rounded p-2">
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <FaCheckCircle className="h-3 w-3" />
                          Current logo will be kept
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {errors.logo && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <HiOutlineExclamationCircle className="h-4 w-4" />
                  {errors.logo}
                </p>
              )}
            </div>
          </div>

          {/* Business License Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <FaCertificate className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Business License</h2>
              <span className="ml-2 text-xs text-gray-500">(Optional)</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FaKey className="h-4 w-4" />
                  License Number
                </label>
                <div className="relative">
                  <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={data.license || ''}
                    onChange={(e) => setData('license', e.target.value)}
                    placeholder="e.g., LIC-12345-ABCDE"
                    className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={processing}
                    maxLength={24}
                  />
                </div>
                {errors.license && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.license}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Max 24 characters
                </p>
              </div>
            </div>
          </div>

          {/* National ID Verification Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <FaIdCard className="h-5 w-5 text-red-600" />
              <h2 className="text-xl font-bold text-gray-800">National ID Verification</h2>
              <span className="ml-2 text-xs text-red-500">(Required)</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FaUser className="h-4 w-4" />
                  National ID Number <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={data.national_id}
                    onChange={(e) => setData('national_id', e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit National ID"
                    className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={processing}
                    maxLength={10}
                  />
                </div>
                {errors.national_id && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.national_id}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Must be exactly 10 digits
                </p>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-100">
                <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <FaInfoCircle className="h-4 w-4 text-red-600" />
                  Important Note
                </h3>
                <p className="text-xs text-gray-600">
                  Your National ID is used for identity verification and cannot be changed after initial registration.
                  If you need to update this information, please contact support.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={processing}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {processing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating Store...
                  </>
                ) : (
                  <>
                    <FaSave className="h-4 w-4" />
                    Update Store
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.visit(route('dashboard.store'))}
                disabled={processing}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="text-xs text-gray-500 space-y-2">
                <p className="flex items-center gap-2">
                  <FaInfoCircle className="h-3 w-3" />
                  <span>Fields marked with * are required</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaExclamationTriangle className="h-3 w-3 text-yellow-500" />
                  <span>Your store will remain active during update</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaCheckCircle className="h-3 w-3 text-green-500" />
                  <span>Changes may take a few moments to reflect</span>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
