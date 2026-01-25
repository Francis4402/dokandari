import { useForm, usePage } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { FaUserEdit, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { User } from '@/types';

interface Props {
  mustVerifyEmail: boolean;
  status?: string;
  user: User
}

export default function UpdateProfileInformation({ mustVerifyEmail, status, user }: Props) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    email: user.email,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('profile.update'), {
      onSuccess: () => {
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);
      }
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-blue-100">
          <FaUserEdit className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
          <p className="text-gray-600 mt-1">Update your personal details and email address</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Name Field */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 group-hover:border-gray-400"
              placeholder="Enter your full name"
              required
            />
            {errors.name && (
              <div className="absolute right-3 top-3">
                <FaExclamationTriangle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="h-4 w-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 group-hover:border-gray-400"
              placeholder="Enter your email address"
              required
            />
            {errors.email && (
              <div className="absolute right-3 top-3">
                <FaExclamationTriangle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Email Verification */}
        {mustVerifyEmail && user.email_verified_at === null && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Email verification required</p>
                <p className="text-sm text-amber-700 mt-1">
                  Your email address is unverified. Please check your inbox for the verification link.
                  <button
                    type="button"
                    onClick={() => route('verification.send')}
                    className="ml-2 font-medium underline hover:text-amber-900"
                  >
                    Resend verification email
                  </button>
                </p>
                {status === 'verification-link-sent' && (
                  <div className="mt-2 text-sm font-medium text-green-600">
                    A new verification link has been sent to your email address.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FaCheckCircle className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>

          {recentlySuccessful && (
            <span className="text-green-600 font-medium flex items-center gap-2">
              <FaCheckCircle className="h-5 w-5" />
              Profile updated successfully
            </span>
          )}
        </div>
      </form>

      {/* Success Modal */}
      <Transition show={showSuccessModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowSuccessModal(false)}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl transition-all">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <FaCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <Dialog.Title className="mt-4 text-lg font-medium text-gray-900">
                    Profile Updated
                  </Dialog.Title>
                  <p className="mt-2 text-sm text-gray-500">
                    Your profile information has been successfully updated.
                  </p>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
