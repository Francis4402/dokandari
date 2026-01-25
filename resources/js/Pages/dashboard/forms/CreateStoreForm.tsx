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
  FaPlus
} from 'react-icons/fa';
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle
} from 'react-icons/hi2';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreFormData {
  name: string;
  logo: File | null;
  storetype: string;
  license: File | null;
}

interface FormErrors {
  name?: string;
  storetype?: string;
  logo?: string;
  license?: string;
}

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

export default function CreateStoreForm() {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [showStoreTypeDropdown, setShowStoreTypeDropdown] = useState(false);

  const [data, setData] = useState<StoreFormData>({
    name: '',
    logo: null,
    storetype: '',
    license: null
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!data.name.trim()) {
      newErrors.name = 'Store name is required';
    } else if (data.name.length < 3) {
      newErrors.name = 'Store name must be at least 3 characters';
    } else if (data.name.length > 100) {
      newErrors.name = 'Store name must be less than 100 characters';
    }

    if (!data.storetype) {
      newErrors.storetype = 'Store type is required';
    }

    // Logo is optional but validate if provided
    if (data.logo) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(data.logo.type)) {
        newErrors.logo = 'Please upload a valid image (JPEG, PNG, GIF, WebP)';
      } else if (data.logo.size > maxSize) {
        newErrors.logo = 'Image must be less than 5MB';
      }
    }

    // License is optional but validate if provided
    if (data.license) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(data.license.type)) {
        newErrors.license = 'Please upload a valid file (JPEG, PNG, PDF)';
      } else if (data.license.size > maxSize) {
        newErrors.license = 'File must be less than 10MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'license'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = type === 'logo'
      ? ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      : ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    const maxSize = type === 'logo' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      addToast(`Invalid file type. Please upload ${type === 'logo' ? 'an image' : 'an image or PDF'}.`, 'error');
      return;
    }

    if (file.size > maxSize) {
      addToast(`File is too large. Maximum size is ${type === 'logo' ? '5MB' : '10MB'}.`, 'error');
      return;
    }

    setData(prev => ({ ...prev, [type]: file }));

    if (type === 'logo') {
      const preview = URL.createObjectURL(file);
      setLogoPreview(preview);
      addToast('Logo uploaded successfully!');
    } else {
      if (file.type === 'application/pdf') {
        setLicensePreview(null); // No preview for PDF
      } else {
        const preview = URL.createObjectURL(file);
        setLicensePreview(preview);
      }
      addToast('License document uploaded successfully!');
    }
  };

  const removeFile = (type: 'logo' | 'license') => {
    if (type === 'logo') {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
    } else {
      if (licensePreview) URL.revokeObjectURL(licensePreview);
      setLicensePreview(null);
    }

    setData(prev => ({ ...prev, [type]: null }));
    setErrors(prev => ({ ...prev, [type]: undefined }));
    addToast(`${type === 'logo' ? 'Logo' : 'License'} removed.`);
  };

  const handleDataChange = <K extends keyof StoreFormData>(
    key: K,
    value: StoreFormData[K]
  ) => {
    setData(prev => ({ ...prev, [key]: value }));
    // Clear error for this field when user starts typing
    if (errors[key as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Please fix the errors in the form.', 'error');
      return;
    }

    setProcessing(true);
    addToast('Creating your store...', 'info');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('storetype', data.storetype);
      if (data.logo) formData.append('logo', data.logo);
      if (data.license) formData.append('license', data.license);

      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success
      addToast('Store created successfully! Redirecting...', 'success');

      // Reset form
      setData({
        name: '',
        logo: null,
        storetype: '',
        license: null
      });

      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (licensePreview) URL.revokeObjectURL(licensePreview);
      setLogoPreview(null);
      setLicensePreview(null);
      setErrors({});
      setShowStoreTypeDropdown(false);

      // Simulate redirect (replace with actual navigation)
      setTimeout(() => {
        window.location.href = '/dashboard/products';
      }, 2000);

    } catch (error) {
      addToast('Failed to create store. Please try again.', 'error');
      console.error('Store creation error:', error);
    } finally {
      setProcessing(false);
    }
  };

  // Clean up object URLs on unmount
  React.useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (licensePreview) URL.revokeObjectURL(licensePreview);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg bg-white border ${
              t.type === 'success' ? 'border-green-200' :
              t.type === 'error' ? 'border-red-200' :
              'border-blue-200'
            }`}
          >
            {t.type === 'success' ? (
              <HiOutlineCheckCircle className="h-5 w-5 text-green-500" />
            ) : t.type === 'error' ? (
              <HiOutlineXCircle className="h-5 w-5 text-red-500" />
            ) : (
              <HiOutlineInformationCircle className="h-5 w-5 text-blue-500" />
            )}
            <span className="text-sm text-gray-700">{t.message}</span>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
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
                    onChange={(e) => handleDataChange('name', e.target.value)}
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
                            handleDataChange('storetype', type);
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
                onChange={(e) => handleFileUpload(e, 'logo')}
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
                              removeFile('logo');
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

          {/* Business License Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <FaCertificate className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Business License</h2>
              <span className="ml-2 text-xs text-gray-500">(Optional)</span>
            </div>

            <div>
              <input
                ref={licenseInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e, 'license')}
                className="hidden"
                disabled={processing}
              />

              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* License Upload Area */}
                <div className="flex-1">
                  <div
                    onClick={() => licenseInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      !data.license
                        ? 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                        : 'border-gray-200'
                    } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {!data.license ? (
                      <div className="space-y-4">
                        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center">
                          <FaFileAlt className="h-10 w-10 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Upload Business License</p>
                          <p className="text-xs text-gray-500 mt-1">For verification purposes (JPG, PNG, PDF, Max 10MB)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative group">
                          {licensePreview ? (
                            <img
                              src={licensePreview}
                              alt="License preview"
                              className="w-40 h-40 object-contain mx-auto rounded-lg border"
                            />
                          ) : (
                            <div className="w-40 h-40 mx-auto rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-center justify-center">
                              <FaFileAlt className="h-16 w-16 text-gray-400" />
                              <span className="text-xs text-gray-600 mt-2">PDF Document</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile('license');
                            }}
                            className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            disabled={processing}
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">Click to change file</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* License Information */}
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-100">
                    <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <FaInfoCircle className="h-4 w-4 text-green-600" />
                      Why Upload a License?
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

              {errors.license && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <HiOutlineExclamationCircle className="h-4 w-4" />
                  {errors.license}
                </p>
              )}
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
                    <div className={`h-2 w-2 rounded-full ${data.license ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className={`text-sm font-medium ${data.license ? 'text-green-600' : 'text-yellow-600'}`}>
                      {data.license ? 'Verified' : 'Pending'}
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
    </div>
  );
}
