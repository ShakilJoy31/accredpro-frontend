'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Eye, EyeOff, Lock, X, Loader2, AlertCircle, Shield,
    Smartphone, ArrowRight, Building2, Phone, GraduationCap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEnterpriseLoginMutation } from '@/redux/api/authentication/authApi';
import { shareWithCookies } from '@/utils/helper/shareWithCookies';
import { appConfiguration } from '@/utils/constant/appConfiguration';
import fitInfotechLogo from '../../../public/The_Logo/linuxeon_logo.png';

// Login schema validation for enterprise
const loginSchema = z.object({
    phoneNo: z.string()
        .min(11, 'Phone number must be at least 11 digits')
        .max(14, 'Phone number must not exceed 14 digits')
        .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Account info type for pending enterprise
interface PendingAccountInfo {
    id: number;
    companyName: string;
    phoneNo: string;
    email: string;
    status: string;
    role: string;
}

export default function EnterpriseLoginForm() {
    const router = useRouter();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Form state
    const [showPassword, setShowPassword] = useState(false);
    const [animateBg, setAnimateBg] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Pending account modal state (removed payment related states)
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [pendingAccountInfo, setPendingAccountInfo] = useState<PendingAccountInfo | null>(null);

    // Moving dots state
    const [dots, setDots] = useState<Array<{ id: number; left: string; top: string; size: number; duration: number; delay: number }>>([]);

    // API hook
    const [enterpriseLogin, { isLoading: loginLoading }] = useEnterpriseLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phoneNo: '',
            password: '',
        },
        mode: 'onChange',
    });

    // Generate moving dots
    useEffect(() => {
        const generateDots = () => {
            const newDots = [];
            for (let i = 0; i < 30; i++) {
                newDots.push({
                    id: i,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    size: Math.random() * 6 + 2,
                    duration: Math.random() * 10 + 8,
                    delay: Math.random() * 5,
                });
            }
            setDots(newDots);
        };
        generateDots();
    }, []);

    // Background animation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimateBg(prev => !prev);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Handle theme mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    const onSubmit = async (data: LoginFormData) => {
        setErrorMessage(null);

        try {
            const response = await enterpriseLogin(data).unwrap();

            if (response.success) {
                if (response.data?.tokens?.accessToken) {
                    const { accessToken, refreshToken } = response.data.tokens;

                    // Set tokens in cookies
                    const tokenName = `${appConfiguration.appCode}token`;
                    const refreshTokenName = `${appConfiguration.appCode}refreshToken`;

                    shareWithCookies("set", tokenName, 1440, accessToken); // 1 day
                    shareWithCookies("set", refreshTokenName, 10080, refreshToken); // 7 days

                    toast.success('Login successful!');

                    // Redirect to enterprise dashboard
                    router.push(`/redirect?to=/admin/dashboard`);
                }
            }
        } catch (error: any) {
            console.error('Login error:', error);

            // Check if this is a pending account error (403 with accountInfo)
            if (error?.status === 403 && error?.data?.accountInfo) {
                // Store pending account info and show modal
                setPendingAccountInfo(error.data.accountInfo);
                setShowPendingModal(true);

                // Show the message from the API
                toast.error(error.data.message || 'Your account is pending approval.');
            } else {
                // Handle other login errors
                const errorMessage = error?.data?.message || error?.message || 'Invalid phone number or password';
                setErrorMessage(errorMessage);
                toast.error(errorMessage);
            }
        }
    };

    // Don't render theme-dependent UI until mounted
    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 p-4">
                <div className="animate-pulse">
                    <div className="h-12 w-64 bg-gray-200 rounded-lg mb-4" />
                    <div className="h-96 w-96 bg-gray-100 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={cn(
                "min-h-screen mt-16 flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden",
                "bg-gradient-to-br from-orange-50 via-amber-50 to-red-50",
            )}>
                {/* Animated Moving White Dots */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {dots.map((dot) => (
                        <motion.div
                            key={dot.id}
                            className="absolute rounded-full bg-black/40"
                            style={{
                                width: dot.size,
                                height: dot.size,
                                left: dot.left,
                                top: dot.top,
                            }}
                            animate={{
                                x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
                                y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
                                opacity: [0.4, 0.8, 0.4, 0.6, 0.4],
                                scale: [1, 1.5, 1, 1.3, 1],
                            }}
                            transition={{
                                duration: dot.duration,
                                delay: dot.delay,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Animated background elements - Orange and White gradient orbs */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -inset-2.5 opacity-30 ">
                        <div className={cn(
                            "absolute top-1/4 left-1/4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob",
                            "bg-gradient-to-r from-orange-200 to-amber-200",
                            animateBg && "animate-pulse"
                        )} />
                        <div className={cn(
                            "absolute top-1/3 right-1/4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000",
                            "bg-gradient-to-r from-red-200 to-orange-200",
                            animateBg && "animate-pulse"
                        )} />
                        <div className={cn(
                            "absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000",
                            "bg-gradient-to-r from-amber-200 to-yellow-200",
                            animateBg && "animate-pulse"
                        )} />

                        {/* Additional White Orbs */}
                        <div className={cn(
                            "absolute top-1/2 right-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-3000",
                            "bg-gradient-to-r from-white to-orange-100",
                            animateBg && "animate-pulse"
                        )} />
                        <div className={cn(
                            "absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-5000",
                            "bg-gradient-to-r from-orange-100 to-white",
                            animateBg && "animate-pulse"
                        )} />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-md"
                >
                    <div className={cn(
                        "rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300",
                        "bg-white/90 border border-orange-300/50",
                    )}>
                        {/* Header */}
                        <div className="p-8 pb-6">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center mb-8"
                            >
                                {/* Logo Section - FIT INFOTECH */}
                                <div className="relative">
                                    <div className={cn(
                                        "absolute inset-0 rounded-full blur-lg opacity-75",
                                        "bg-gradient-to-r from-orange-400 to-red-500",
                                    )} />
                                    <div className={cn(
                                        "relative w-44 h-44 rounded-full flex items-center justify-center border-2 shadow-lg",
                                        "bg-gradient-to-t from-orange-200 to-white border-orange-200",
                                        "border-orange-700"
                                    )}>
                                        <Image
                                            src={fitInfotechLogo}
                                            alt="FIT INFOTECH"
                                            width={800}
                                            height={800}
                                            className="w-36 h-36 object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="mt-3 text-center">
                                    <h2 className={cn(
                                        "text-lg font-semibold mb-1",
                                        "text-gray-800",
                                    )}>
                                        Welcome Back!
                                    </h2>
                                    <p className={cn(
                                        "text-sm",
                                        "text-gray-600",
                                    )}>
                                        Sign in to your corporate training account
                                    </p>
                                </div>
                            </motion.div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {errorMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={cn(
                                            "mb-4 p-3 rounded-lg border",
                                            "bg-red-50/50 border-red-200",
                                        )}
                                    >
                                        <div className="flex items-center gap-2 text-red-600">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-sm">{errorMessage}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Login Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Phone Number */}
                                <div>
                                    <label className={cn(
                                        "block text-sm font-medium mb-2",
                                        "text-gray-700",
                                    )}>
                                        Phone Number
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className={cn(
                                                "w-5 transition-colors",
                                                "text-gray-400 group-focus-within:text-orange-500",
                                            )} />
                                        </div>
                                        <input
                                            {...register('phoneNo')}
                                            type="tel"
                                            disabled={loginLoading}
                                            className={cn(
                                                "block w-full pl-10 pr-3 py-3 rounded-lg placeholder-gray-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                                "bg-white/70 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                                            )}
                                            placeholder="01712345678"
                                        />
                                    </div>
                                    {errors.phoneNo && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.phoneNo.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className={cn(
                                        "block text-sm font-medium mb-2",
                                        "text-gray-700",
                                    )}>
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className={cn(
                                                "w-5 transition-colors",
                                                "text-gray-400 group-focus-within:text-orange-500",
                                            )} />
                                        </div>
                                        <input
                                            {...register('password')}
                                            type={showPassword ? 'text' : 'password'}
                                            disabled={loginLoading}
                                            className={cn(
                                                "block w-full pl-10 pr-10 py-3 rounded-lg placeholder-gray-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                                "bg-white/70 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                                            )}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 text-gray-500 hover:text-gray-700" />
                                            ) : (
                                                <Eye className="w-5 text-gray-500 hover:text-gray-700" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Forgot Password Link */}
                                <div className="flex justify-end">
                                    <Link
                                        href="/enterprise/forgot-password"
                                        className={cn(
                                            "text-sm font-medium transition-colors",
                                            "text-orange-600 hover:text-orange-500",

                                        )}
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                {/* Submit Button with enhanced effects */}
                                <motion.button
                                    type="submit"
                                    disabled={loginLoading}
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.3)"
                                    }}
                                    whileTap={{
                                        scale: 0.96,
                                        transition: { duration: 0.1 }
                                    }}
                                    className={cn(
                                        "w-full px-6 py-3 hover:cursor-pointer text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group",
                                        "bg-gradient-to-r from-green-700 to-blue-600",

                                    )}
                                >
                                    {/* Ripple effect on click */}
                                    <motion.span
                                        className="absolute inset-0 rounded-lg bg-white/30"
                                        initial={{ scale: 0, opacity: 0.6 }}
                                        whileTap={{ scale: 2, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        style={{ pointerEvents: "none" }}
                                    />
                                    {/* Shimmer effect on hover */}
                                    <motion.span
                                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        initial={{ x: "-100%" }}
                                        whileHover={{ x: "100%" }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                        style={{ pointerEvents: "none" }}
                                    />
                                    {loginLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <span className="relative z-10">Sign In</span>
                                            <ArrowRight className="w-5 h-5 relative z-10" />
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className={cn(
                            "px-8 py-6 border-t",
                            "bg-gradient-to-r from-orange-50/50 to-red-50/50 border-orange-100",
                        )}>
                            <p className={cn(
                                "text-center",
                                "text-gray-600",
                            )}>
                                Don&apos;t have a business account?{' '}
                                <Link
                                    href="/enterprise/register"
                                    className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                                >
                                    Register your company
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-4 text-center">
                        <p className={cn(
                            "text-xs flex items-center justify-center gap-1",
                            "text-gray-500",
                        )}>
                            <Shield className="w-3 h-3" />
                            Your data is protected with 256-bit SSL encryption
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Pending Account Modal (No Payment) */}
            <AnimatePresence>
                {showPendingModal && pendingAccountInfo && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-lg w-full rounded-2xl shadow-2xl flex flex-col max-h-[80vh]  bg-white border border-orange-200"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b rounded-t-2xl  border-orange-200 bg-gradient-to-r from-orange-50 to-white">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full ring-orange-200">
                                        <AlertCircle className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Account Pending Approval
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Your account is awaiting admin approval
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowPendingModal(false);
                                            setPendingAccountInfo(null);
                                        }}
                                        className="p-2 rounded-full transition-colors hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <div className="space-y-6">
                                    {/* Welcome Message with Company Info */}
                                    <div className="p-5 rounded-xl relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full -mr-10 -mt-10" />
                                        <p className="text-sm relative z-10 text-gray-700">
                                            <span className="font-semibold text-orange-600 ">
                                                {pendingAccountInfo.companyName}
                                            </span>
                                            , your business account is currently pending approval. You will be able to login once an administrator approves your account.
                                        </p>
                                    </div>

                                    {/* Account Details */}
                                    <div className="space-y-3">
                                        <h4 className="text-base font-semibold flex items-center gap-2 text-gray-900">
                                            <span className="w-1 h-5 rounded-full bg-orange-600" />
                                            Account Information
                                        </h4>

                                        <div className="p-5 rounded-xl border bg-white border-gray-200 shadow-sm">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-200">
                                                    <span className="text-sm font-medium text-gray-500">
                                                        Company Name
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {pendingAccountInfo.companyName}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center pb-2 border-b border-dashed  border-gray-200">
                                                    <span className="text-sm font-medium text-gray-500">
                                                        Phone Number
                                                    </span>
                                                    <span className="text-sm font-semibold  text-gray-900">
                                                        {pendingAccountInfo.phoneNo}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center pb-2 border-b border-dashed  border-gray-200">
                                                    <span className="text-sm font-medium  text-gray-500">
                                                        Email
                                                    </span>
                                                    <span className="text-sm font-semibold  text-gray-900">
                                                        {pendingAccountInfo.email}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium  text-gray-500">
                                                        Status
                                                    </span>
                                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700  border-orange-200 ">
                                                        {pendingAccountInfo.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* What happens next */}
                                    <div className="p-5 rounded-xl text-center relative overflow-hidden bg-gradient-to-br from-orange-100 via-amber-100 to-red-100 border border-orange-200">
                                        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                                        <p className="text-sm font-medium mb-2 relative z-10 text-gray-600">
                                            What happens next?
                                        </p>
                                        <div className="relative z-10 space-y-2 text-sm text-gray-500">
                                            <p>• An administrator will review your business information</p>
                                            <p>• You&apos;ll receive an email once your account is approved</p>
                                            <p>• After approval, you can login with your credentials</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t rounded-b-2xl border-orange-200 bg-gradient-to-r from-orange-50 to-white">
                                <button
                                    onClick={() => {
                                        setShowPendingModal(false);
                                        setPendingAccountInfo(null);
                                    }}
                                    className="w-full hover:cursor-pointer px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                >
                                    Got it
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Scrollbar styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${theme === 'dark' ? '#4B5563' : '#D1D5DB'};
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${theme === 'dark' ? '#6B7280' : '#9CA3AF'};
                }
            `}</style>

            {/* Animation styles */}
            <style jsx global>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    25% { transform: translateY(-20px) translateX(10px); }
                    50% { transform: translateY(10px) translateX(-15px); }
                    75% { transform: translateY(-10px) translateX(15px); }
                }
            `}</style>
        </>
    );
}