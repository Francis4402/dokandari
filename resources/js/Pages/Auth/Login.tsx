import { useEffect, FormEventHandler, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaExclamationCircle,
  FaSpinner,
  FaUserPlus,
  FaArrowRight,
  FaFacebookF,
  FaGoogle,
  FaShieldAlt,
  FaRocket
} from 'react-icons/fa';
import { toast } from 'sonner';



export default function Login({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess: () => {
                toast.success('Login Successful')
            },
            onError: () => {
                toast.error('Login Failed')
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <Head title="Log in" />

            <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl">
                {/* Left Side - Branding & Info */}
                <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-purple-700 p-10 text-white">
                    <div className="h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center mb-8">
                                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3">
                                    <FaRocket className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold">BrandFlow</span>
                            </div>

                            <h1 className="text-4xl font-bold mb-6 leading-tight">
                                Welcome Back to Your Dashboard
                            </h1>

                            <p className="text-blue-100 text-lg mb-8">
                                Access your personalized workspace and manage everything in one place.
                                Let's get you signed in!
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                    <span className="font-bold">1</span>
                                </div>
                                <div>
                                    <h3 className="font-bold">Secure Access</h3>
                                    <p className="text-blue-100 text-sm">Enterprise-grade security</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                    <span className="font-bold">2</span>
                                </div>
                                <div>
                                    <h3 className="font-bold">Real-time Updates</h3>
                                    <p className="text-blue-100 text-sm">Always stay in sync</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="md:w-3/5 bg-white p-10">
                    <div className="max-w-md mx-auto">
                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 p-4 rounded-xl bg-green-100 border-l-4 border-green-500">
                                <div className="flex items-center">
                                    <FaExclamationCircle className="h-5 w-5 text-green-600 mr-3" />
                                    <span className="text-green-800 text-sm">{status}</span>
                                </div>
                            </div>
                        )}

                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
                            <p className="text-gray-600">Enter your credentials to continue</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-blue-500 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all"
                                        placeholder="your.email@company.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center animate-pulse">
                                        <FaExclamationCircle className="h-4 w-4 mr-1" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-blue-600 hover:text-purple-600 font-medium transition-colors flex items-center group"
                                        >
                                            <FaLock className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform" />
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-blue-500 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-purple-600 transition-colors" />
                                        ) : (
                                            <FaEye className="h-5 w-5 text-gray-400 hover:text-purple-600 transition-colors" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center animate-pulse">
                                        <FaExclamationCircle className="h-4 w-4 mr-1" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me & Actions */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-colors"
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 font-medium">
                                        Keep me signed in
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1 active:translate-y-0 hover:shadow-xl group"
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <FaSpinner className="animate-spin h-5 w-5 mr-3" />
                                        Signing in...
                                    </span>
                                ) : (
                                    <>
                                        Sign In to Your Account
                                        <FaArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-10 mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500 font-medium">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            {/* Social Login */}
                            <div className="mt-6 grid max-w-sm mx-auto gap-4">
                                <button
                                    type="button"
                                    onClick={() => window.location.href = route('auth.google')}
                                    className="flex items-center justify-center py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-red-500 hover:bg-red-50 hover:text-red-700 transition-all"
                                >
                                    <FaGoogle className="h-5 w-5 mr-3 text-red-600" />
                                    Google
                                </button>
                            </div>
                        </div>

                        {/* Register Link */}
                        <div className="text-center">
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{' '}
                                <Link
                                    href={route('register')}
                                    className="font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                                >
                                    Create one now
                                </Link>
                            </p>
                        </div>

                        {/* Security Badge */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-center text-gray-500 text-sm">
                                <FaShieldAlt className="h-4 w-4 mr-2 text-green-500" />
                                <span className="font-medium">256-bit SSL encryption • ISO 27001 certified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
