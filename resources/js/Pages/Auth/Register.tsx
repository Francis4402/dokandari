import { useEffect, FormEventHandler, useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaExclamationCircle,
  FaSpinner,
  FaArrowRight,
  FaShieldAlt,
  FaRocket,
  FaUser,
  FaCheck,
  FaCamera,
  FaTimes,
  FaFacebookF,
  FaGoogle
} from 'react-icons/fa';
import { toast } from 'sonner';


export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        image: null as File | null,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    useEffect(() => {
        let strength = 0;
        if (data.password.length >= 8) strength += 1;
        if (/[A-Z]/.test(data.password)) strength += 1;
        if (/[a-z]/.test(data.password)) strength += 1;
        if (/[0-9]/.test(data.password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(data.password)) strength += 1;
        setPasswordStrength(strength);
    }, [data.password]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file (JPEG, PNG, JPG, GIF)');
                return;
            }


            if (file.size > 2 * 1024 * 1024) {
                alert('Image size must be less than 2MB');
                return;
            }

            setData('image', file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();


        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);
        if (data.image) {
            formData.append('image', data.image);
        }

        post(route('register'), {
            onSuccess: () => {
                toast.success('Registration Succesfull')
            },
            onError: () => {
                toast.success('Registration Failed')
            }
        });
    };

    const getStrengthColor = (strength: number) => {
        if (strength <= 1) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthText = (strength: number) => {
        if (strength <= 1) return 'Weak';
        if (strength <= 3) return 'Medium';
        return 'Strong';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <Head title="Register" />

            <div className="w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl">
                {/* Left Side - Branding & Info */}
                <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-purple-700 p-8 text-white overflow-y-auto">
                    <div className="h-full flex flex-col">
                        <div className="mb-8">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3">
                                    <FaRocket className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold">BrandFlow</span>
                            </div>

                            <h1 className="text-3xl font-bold mb-4 leading-tight">
                                Join Our Community
                            </h1>

                            <p className="text-blue-100 text-sm mb-6">
                                Create your account with a profile picture to personalize your experience.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                    <FaCamera className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Profile Picture</h3>
                                    <p className="text-blue-100 text-xs">Add a photo to stand out</p>
                                </div>
                            </div>

                            <div className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                    <FaShieldAlt className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Secure Registration</h3>
                                    <p className="text-blue-100 text-xs">Your data is protected</p>
                                </div>
                            </div>

                            <div className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                    <FaCheck className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Quick Setup</h3>
                                    <p className="text-blue-100 text-xs">Get started in minutes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Registration Form */}
                <div className="md:w-3/5 bg-white p-8 overflow-y-auto">
                    <div className="max-w-md mx-auto">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h2>
                            <p className="text-gray-600 text-sm">Get started with your free account</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Profile Image Upload */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative group">
                                    <div
                                        className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border-4 border-white shadow-lg cursor-pointer overflow-hidden"
                                        onClick={triggerFileInput}
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FaUser className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-110"
                                    >
                                        <FaCamera className="h-4 w-4" />
                                    </button>

                                    {imagePreview && (
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-0 right-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-all transform hover:scale-110"
                                        >
                                            <FaTimes className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />

                                <div className="mt-3 text-center">
                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        className="text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline"
                                    >
                                        {imagePreview ? 'Change Photo' : 'Upload Profile Picture'}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-1">
                                        JPEG, PNG or GIF • Max 2MB
                                    </p>
                                </div>

                                {errors.image && (
                                    <p className="mt-2 text-xs text-red-600 flex items-center">
                                        <FaExclamationCircle className="h-3 w-3 mr-1" />
                                        {errors.image}
                                    </p>
                                )}
                            </div>

                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="h-4 w-4 text-blue-500 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        autoComplete="name"
                                        autoFocus
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all text-sm"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center">
                                        <FaExclamationCircle className="h-3 w-3 mr-1" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-4 w-4 text-blue-500 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all text-sm"
                                        placeholder="your.email@company.com"
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center">
                                        <FaExclamationCircle className="h-3 w-3 mr-1" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-4 w-4 text-blue-500 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="block w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all text-sm"
                                        placeholder="Create a strong password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors" />
                                        ) : (
                                            <FaEye className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors" />
                                        )}
                                    </button>
                                </div>

                                {/* Password Strength Meter */}
                                {data.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-gray-600">
                                                Strength: <span className={`font-bold ${getStrengthColor(passwordStrength).replace('bg-', 'text-')}`}>
                                                    {getStrengthText(passwordStrength)}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center">
                                        <FaExclamationCircle className="h-3 w-3 mr-1" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-4 w-4 text-blue-500 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="block w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all text-sm"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? (
                                            <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors" />
                                        ) : (
                                            <FaEye className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors" />
                                        )}
                                    </button>
                                </div>
                                {data.password_confirmation && data.password !== data.password_confirmation && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center">
                                        <FaExclamationCircle className="h-3 w-3 mr-1" />
                                        Passwords do not match
                                    </p>
                                )}
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center">
                                        <FaExclamationCircle className="h-3 w-3 mr-1" />
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Terms & Conditions */}
                            <div className="flex items-start">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5 transition-colors"
                                    required
                                />
                                <label htmlFor="terms" className="ml-2 block text-xs text-gray-700">
                                    I agree to the{' '}
                                    <Link href="#" className="text-purple-600 hover:text-purple-700 font-medium hover:underline">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="#" className="text-purple-600 hover:text-purple-700 font-medium hover:underline">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md group"
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                                        Creating Account...
                                    </span>
                                ) : (
                                    <>
                                        Create Your Account
                                        <FaArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

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

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-xs">
                                Already have an account?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>

                        {/* Security Badge */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-center text-gray-500 text-xs">
                                <FaShieldAlt className="h-3 w-3 mr-1 text-blue-500" />
                                <span className="font-medium">Your data is encrypted and secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
