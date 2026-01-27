import DashboardLayout from '@/Layouts/DashboardLayout';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
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
  FaPlus,
  FaKey
} from 'react-icons/fa';
import {
  HiOutlineExclamationCircle
} from 'react-icons/hi2';
import { toast } from 'sonner';

// Store types based on common business models
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

export default function CreateStoreForm({auth}: PageProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showStoreTypeDropdown, setShowStoreTypeDropdown] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    logo: null as File | null,
    storetype: '',
    license_number: '' // Changed from file to string
  });

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Please upload a valid image (JPEG, PNG, GIF, WebP)';
    }
    if (file.size > maxSize) {
      return 'Image must be less than 5MB';
    }
    return null;
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setData('logo', file);
    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);
    toast.success('Logo uploaded successfully!');
  };

  const removeLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    setData('logo', null);
    toast.info('Logo removed.');
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

    // Validate license number if provided (optional)
    if (data.license_number && data.license_number.length < 5) {
      toast.error('License number must be at least 5 characters if provided');
      return;
    }

    // Validate logo if provided
    if (data.logo) {
      const error = validateFile(data.logo);
      if (error) {
        toast.error(error);
        return;
      }
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('storetype', data.storetype);
    formData.append('license_number', data.license_number);
    if (data.logo) formData.append('logo', data.logo);

    post('/dashboard/stores/store', {
      data: formData,
      onSuccess: () => {
        toast.success('Store created successfully!');

        // Reset form
        reset();
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoPreview(null);
        setShowStoreTypeDropdown(false);

        // Set default values
        setData({
          name: '',
          logo: null,
          storetype: '',
          license_number: ''
        });
      },
      onError: () => {
        toast.error('Failed to create store. Please check the form for errors.');
      }
    });
  };

  // Clean up object URL on unmount
  React.useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, []);

  return (
    <DashboardLayout user={auth.user}>
      <Head title='Create Store'>
        <meta name="description" content="Create your online store to start selling products" />
        <meta name="keywords" content="store, ecommerce, create store, online business" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-4xl mx-auto p-5">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaStore className="h-8 w-8 text-purple-600" />
                Create Your Store
              </h1>
              <p className="text-gray-600 mt-1">
                Set up your online store to start selling products
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Go Back
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
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <FaInfoCircle className="h-3 w-3" />
                  Choose a unique name that represents your brand
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
                    <FaCheck className="h-5 w-5 text-gray-400" />
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
                            data.storetype === type ? 'bg-purple-50 text-purple-700' : ''
                          }`}
                        >
                          {type}
                          {data.storetype === type && <FaCheckCircle className="h-5 w-5 text-purple-600" />}
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
                <p className="text-xs text-gray-500 mt-1">
                  Select the category that best describes your business
                </p>
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
                    onClick={() => logoInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      !logoPreview
                        ? 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                        : 'border-gray-200'
                    } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {!logoPreview ? (
                      <div className="space-y-4">
                        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                          <FaUpload className="h-10 w-10 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Upload Store Logo</p>
                          <p className="text-xs text-gray-500 mt-1">Recommended: 300x300px, Max 5MB</p>
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
                        </div>
                        <p className="text-sm text-gray-600">Click to change logo</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logo Requirements */}
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <FaInfoCircle className="h-4 w-4 text-blue-600" />
                      Logo Requirements
                    </h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Square or circle format works best
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Transparent background recommended
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        High contrast for better visibility
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Formats: JPG, PNG, GIF, WebP
                      </li>
                    </ul>
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

          {/* Business License Card - Changed to text input */}
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
                    value={data.license_number}
                    onChange={(e) => setData('license_number', e.target.value)}
                    placeholder="e.g., LIC-12345-ABCDE"
                    className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={processing}
                  />
                </div>
                {errors.license_number && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.license_number}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <FaInfoCircle className="h-3 w-3" />
                  Enter your official business license number
                </p>
              </div>

              {/* License Information */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-100">
                <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <FaInfoCircle className="h-4 w-4 text-green-600" />
                  Why Provide License Number?
                </h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Builds trust with customers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Required for certain product categories
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Enables special business features
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Helps with payment processing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Your information is securely stored
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Store Preview Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <FaCheckCircle className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Store Preview</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Store logo"
                    className="w-16 h-16 rounded-lg object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                    <FaStore className="h-8 w-8 text-purple-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {data.name || 'Your Store Name'}
                  </h3>
                  {data.storetype && (
                    <p className="text-sm text-gray-600">{data.storetype}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaStore className="h-4 w-4 text-blue-600" />
                    <h4 className="text-sm font-medium text-gray-700">Store Status</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-green-600 font-medium">Ready to Activate</span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCertificate className="h-4 w-4 text-green-600" />
                    <h4 className="text-sm font-medium text-gray-700">Verification</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${data.license_number ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className={`text-sm font-medium ${data.license_number ? 'text-green-600' : 'text-yellow-600'}`}>
                      {data.license_number ? 'Licensed' : 'Unlicensed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              {processing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Creating Your Store...
                </>
              ) : (
                <>
                  <FaPlus className="h-4 w-4" />
                  Create Store
                </>
              )}
            </button>

            <div className="mt-6 pt-6 border-t">
              <div className="text-xs text-gray-500 space-y-2">
                <p className="flex items-center gap-2">
                  <FaInfoCircle className="h-3 w-3" />
                  <span>Store name must be unique across the platform</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaExclamationTriangle className="h-3 w-3" />
                  <span>You can only have one active store per account</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaCheckCircle className="h-3 w-3" />
                  <span>After creation, you can add products immediately</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaCertificate className="h-3 w-3" />
                  <span>License verification may take 1-2 business days</span>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
