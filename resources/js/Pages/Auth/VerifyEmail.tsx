// VerifyEmail.tsx
import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaEnvelope, FaCheckCircle, FaSignOutAlt, FaPaperPlane } from 'react-icons/fa';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div>
            <Head title="Email Verification" />

            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-hard-sm p-8 md:p-10 border border-line">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-marigold/10 rounded-full flex items-center justify-center mb-4">
                            <FaEnvelope className="w-8 h-8 text-marigold" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-ink">
                            Verify Your Email
                        </h2>
                        <p className="mt-2 text-sm text-text-soft">
                            Confirm your email address to get started
                        </p>
                    </div>

                    {/* Success Status */}
                    {status === 'verification-link-sent' && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4 animate-pulse">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    <FaCheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="text-sm text-green-800">
                                    <p className="font-medium">Verification link sent!</p>
                                    <p className="mt-1 text-green-700">
                                        A new verification link has been sent to the email address you provided during registration.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Message */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-sm text-blue-800">
                                <p className="font-medium">Thanks for signing up!</p>
                                <p className="mt-1 text-blue-700">
                                    Before getting started, could you verify your email address by clicking on the link we just emailed to you?
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-line">
                        <p className="text-xs font-mono text-text-soft uppercase tracking-wide mb-2">
                            What to do next:
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-3 text-sm text-text-soft">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-marigold/10 text-marigold flex items-center justify-center text-xs font-bold mt-0.5">
                                    1
                                </span>
                                <span>Check your email inbox for the verification link</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-text-soft">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-marigold/10 text-marigold flex items-center justify-center text-xs font-bold mt-0.5">
                                    2
                                </span>
                                <span>Click the link to verify your email address</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-text-soft">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-marigold/10 text-marigold flex items-center justify-center text-xs font-bold mt-0.5">
                                    3
                                </span>
                                <span>Return to the app to continue shopping</span>
                            </li>
                        </ul>
                    </div>

                    {/* If you didn't receive the email */}
                    <div className="text-center">
                        <p className="text-sm text-text-soft">
                            Didn't receive the email?
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Resend Button */}
                        <PrimaryButton
                            className="w-full bg-gray-900 hover:bg-marigold text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 border-0 flex items-center justify-center gap-2"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : (
                                <>
                                    <FaPaperPlane className="w-4 h-4" />
                                    Resend Verification Email
                                </>
                            )}
                        </PrimaryButton>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-line"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-white text-text-soft">or</span>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-text-soft hover:text-red-600 transition-colors rounded-lg border-2 border-dashed border-line hover:border-red-200 hover:bg-red-50"
                        >
                            <FaSignOutAlt className="w-4 h-4" />
                            Log Out
                        </Link>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-text-soft">
                            Need help?{' '}
                            <a href="#" className="text-marigold hover:underline font-medium">
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
