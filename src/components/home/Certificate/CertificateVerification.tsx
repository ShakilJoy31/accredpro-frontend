"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Award, Globe, Phone, MessageCircle, XCircle, AlertCircle, FileQuestion, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useGetCertificateByNumberQuery } from "@/redux/api/sms-configurations/certificateApi";
import CertificateDetails from "./CertificateDetails";

import siteLogo from "../../../../public/The_Logo/linuxeon_logo.png";
import worldImage from "../../../../public/9d5b46ec-d590-4454-b626-514f3fdbf6be.jpg";

const CertificateVerification = () => {
    const [certificateNumber, setCertificateNumber] = useState("");
    const [searchedNumber, setSearchedNumber] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [shouldSearch, setShouldSearch] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [validCertificateData, setValidCertificateData] = useState<any>(null);

    const { data, isLoading, error } = useGetCertificateByNumberQuery(searchedNumber, {
        skip: !shouldSearch || !searchedNumber,
    });

    // Check for saved certificate on mount
    useEffect(() => {
        const savedId = localStorage.getItem('verifiedCertificateId');
        if (savedId) {
            setCertificateNumber(savedId);
            setSearchedNumber(savedId);
            setShouldSearch(true);
            setHasSearched(true);
        }
        setIsVisible(true);
    }, []);

    // Handle API response - Strict validation
    useEffect(() => {
        if (!isLoading && shouldSearch && searchedNumber) {
            // Log for debugging
            console.log("API Response:", data);
            console.log("Error:", error);

            // STRICT VALIDATION: Check if certificate exists and matches searched number
            const isValidCertificate = data?.data &&
                data?.isValid === true &&
                data?.data?.certificateNumber === searchedNumber;

            if (isValidCertificate) {
                // Valid certificate found
                setValidCertificateData(data.data);
                localStorage.setItem('verifiedCertificateId', data.data.certificateNumber);
                setShowCertificate(true);
                setHasSearched(false);
                setShouldSearch(false);
            } else {
                // Invalid certificate - show not found
                setValidCertificateData(null);
                setShowCertificate(false);
                setHasSearched(true);
                setShouldSearch(false);
                // Clear any stale data from localStorage
                localStorage.removeItem('verifiedCertificateId');
            }
        }
    }, [data, isLoading, shouldSearch, searchedNumber, error]);

    const handleSearch = useCallback(() => {
        if (certificateNumber.trim()) {
            // Clear localStorage
            localStorage.removeItem('verifiedCertificateId');

            // Reset all states
            setValidCertificateData(null);
            setShowCertificate(false);
            setHasSearched(false);
            setShouldSearch(false);

            // Clear existing search
            setSearchedNumber("");

            // Trigger new search
            setTimeout(() => {
                setSearchedNumber(certificateNumber.trim());
                setShouldSearch(true);
                setHasSearched(true);
            }, 0);
        }
    }, [certificateNumber]);

    const handleReset = () => {
        localStorage.removeItem('verifiedCertificateId');
        setCertificateNumber("");
        setSearchedNumber("");
        setShouldSearch(false);
        setShowCertificate(false);
        setHasSearched(false);
        setValidCertificateData(null);
    };

    // Use valid certificate data only
    const certificate = validCertificateData;
    const isValid = !!certificate;


    // Not Found Component
    const NotFoundMessage = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="max-w-2xl mx-auto my-32"
        >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-red-200">
                <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>

                    <div className="p-8 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="w-28 h-28 mx-auto relative">
                                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
                                <div className="relative w-28 h-28 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg">
                                    <FileQuestion className="w-14 h-14 text-red-500" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-2">Certificate Not Found</h3>
                            <div className="w-16 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 mb-4">
                                We couldn&apos;t find any certificate with the number:
                            </p>
                            <p className="font-mono text-lg font-bold text-red-600 bg-red-50 inline-block px-4 py-2 rounded-lg mb-6">
                                {searchedNumber}
                            </p>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 text-left">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-amber-800 mb-1">What can I do?</p>
                                        <ul className="text-sm text-amber-700 space-y-1">
                                            <li>• Double-check the certificate number for any typos</li>
                                            <li>• Ensure you&apos;re entering the complete certificate number</li>
                                            <li>• Contact our support team if you believe this is an error</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleReset}
                                className="mt-6 px-6 py-2 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    // Check if certificate not found
    const notFound = hasSearched &&
        !isLoading &&
        !showCertificate &&
        !certificate &&
        !shouldSearch &&
        searchedNumber !== "";

    if (notFound) {
        return <AnimatePresence mode="wait">
            <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <NotFoundMessage />
            </motion.div>
        </AnimatePresence>
    }

    // Mind-Blowing Full-Screen Loading Component
    const LoadingSpinner = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        >
            {/* Sky Background Animation */}
            <motion.div
                initial={{ scale: 1 }}
                animate={{
                    scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600"
            >
                {/* Floating Clouds */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: -200,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            x: window.innerWidth + 200,
                        }}
                        transition={{
                            duration: Math.random() * 20 + 15,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 10,
                        }}
                        className="absolute"
                    >
                        <div className="w-32 h-20 bg-white/30 rounded-full blur-2xl" />
                    </motion.div>
                ))}
            </motion.div>

            {/* Sun Glow */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-20 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"
            />

            {/* Main Content */}
            <div className="relative z-10 text-center">
                {/* Magnifying Glass Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.2,
                    }}
                    className="relative mb-8"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative"
                    >
                        {/* Glass Lens Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl" />
                        <div className="relative w-40 h-40 mx-auto">
                            <div className="absolute inset-0 border-8 border-white/30 rounded-full" />
                            <div className="absolute inset-0 border-4 border-white/50 rounded-full" />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                            <ZoomIn className="w-32 h-32 text-white drop-shadow-2xl animate-pulse" />
                        </div>
                        {/* Handle */}
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-16 bg-gradient-to-r from-gray-700 to-gray-500 rounded-b-full"
                        />
                    </motion.div>
                </motion.div>

                {/* Search Text Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    <motion.h2
                        animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent bg-[length:200%_auto]"
                    >
                        Searching for Certificate
                    </motion.h2>

                    <motion.p
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-white/80 text-lg md:text-xl"
                    >
                        Please wait while we verify your certificate...
                    </motion.p>

                    {/* Animated Search Dots */}
                    <div className="flex items-center justify-center gap-3 mt-6">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [0, -20, 0],
                                    scale: [1, 1.5, 1],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut",
                                }}
                                className="w-3 h-3 bg-white rounded-full shadow-lg"
                            />
                        ))}
                    </div>

                    {/* Scanning Line Effect */}
                    <motion.div
                        animate={{
                            y: [-100, 100],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent pointer-events-none"
                        style={{ top: "50%" }}
                    />
                </motion.div>

                {/* Floating Particles */}
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: window.innerHeight + 100,
                        }}
                        animate={{
                            y: -100,
                            x: Math.random() * window.innerWidth,
                            rotate: 360,
                        }}
                        transition={{
                            duration: Math.random() * 5 + 3,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 2,
                        }}
                        className="absolute w-1 h-1 bg-white/40 rounded-full"
                    />
                ))}
            </div>
        </motion.div>
    );



    // Show certificate only if we have valid data
    if (showCertificate && certificate) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] py-12 px-4 relative">
                {/* Keep the background image but make it scroll with content */}
                <div className="fixed bottom-0 left-0 w-full opacity-70 pointer-events-none z-0">
                    <Image
                        src={worldImage}
                        alt="earth"
                        className="w-full object-cover"
                        priority
                    />
                </div>
                <div className="relative z-10 max-w-6xl mx-auto">
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={handleReset}
                            className="px-6 py-2 mt-12 mb-4 cursor-pointer bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all flex items-center gap-2"
                        >
                            <XCircle size={18} />
                            Search Another Certificate
                        </button>
                    </div>
                    <div className="max-h-screen custom-scrollbar">
                        <CertificateDetails certificate={certificate} isValid={true} />
                    </div>
                </div>
                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.5);
                    }
                `}</style>
            </div>
        );
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: any = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 14,
            },
        },
    };

    const cardVariants: any = {
        hidden: { scale: 0.95, opacity: 0, y: 20 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.5,
            },
        },
    };

    return (
        <>
            {/* Full-screen Loading Overlay */}
            <AnimatePresence>
                {isLoading && shouldSearch && <LoadingSpinner />}
            </AnimatePresence>

            {/* Main Content */}
            <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                    />

                    {/* Floating dots */}
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 bg-white/40 rounded-full"
                            initial={{
                                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                            }}
                            animate={{
                                y: [null, -40, 40, -30, 30, 0],
                                x: [null, 30, -30, 25, -25, 0],
                                opacity: [0, 1, 0.5, 1, 0],
                            }}
                            transition={{
                                duration: Math.random() * 6 + 4,
                                repeat: Infinity,
                                delay: Math.random() * 3,
                                ease: "easeInOut",
                            }}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        />
                    ))}
                </div>

                {/* Main Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="relative z-10 w-full max-w-4xl"
                >
                    {/* Header Section with Animated Text Color */}
                    <motion.div variants={itemVariants} className="text-center mb-8 max-w-3xl mx-auto">
                        <motion.h1 
                            animate={{
                                color: [
                                    "#ffffff",
                                    "#fbbf24",
                                    "#fcd34d",
                                    "#fde68a",
                                    "#ffffff"
                                ]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg"
                        >
                            Certificate Verification Portal
                        </motion.h1>
                        <motion.p 
                            animate={{
                                color: [
                                    "rgba(255,255,255,0.9)",
                                    "rgba(251,191,36,0.9)",
                                    "rgba(252,211,77,0.9)",
                                    "rgba(253,230,138,0.9)",
                                    "rgba(255,255,255,0.9)"
                                ]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5
                            }}
                            className="text-base md:text-lg max-w-2xl mx-auto"
                        >
                            Verify the authenticity of certificates issued by our organization
                        </motion.p>
                    </motion.div>

                    {/* Search Card */}
                    <motion.div
                        variants={cardVariants}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                            {/* Logo Section */}
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center shadow-md">
                                        <Award className="w-10 h-10 text-orange-500" />
                                    </div>
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                                        CERTIFICATE
                                    </div>
                                </div>
                                <Image
                                    src={siteLogo}
                                    alt="Logo"
                                    width={160}
                                    height={60}
                                    className="w-36 h-auto object-contain"
                                />
                            </div>

                            {/* Subtitle */}
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <div className="w-8 h-0.5 bg-gradient-to-r from-orange-400 to-purple-400"></div>
                                <div className="flex items-center gap-1">
                                    <Globe className="w-4 h-4 text-gray-500" />
                                    <p className="text-center text-gray-600 font-medium">
                                        Enter Certificate Number to Verify
                                    </p>
                                </div>
                                <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-orange-400"></div>
                            </div>

                            {/* Input Field */}
                            <input
                                type="text"
                                value={certificateNumber}
                                onChange={(e) => setCertificateNumber(e.target.value)}
                                placeholder="Enter Certificate Number (e.g., MI-BDG-15122501)"
                                className="w-full px-5 py-3 rounded-full text-center bg-gradient-to-r from-orange-400 to-orange-500 text-white placeholder-white/80 outline-none mb-5 shadow-lg focus:ring-2 focus:ring-purple-400 transition-all"
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />

                            {/* Search Button */}
                            <div className="flex justify-center gap-3">
                                <motion.button
                                    type="button"
                                    onClick={handleSearch}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isLoading || !certificateNumber.trim()}
                                    className="px-8 py-2.5 cursor-pointer rounded-full flex items-center justify-center gap-2 font-semibold tracking-wider shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Search size={18} />
                                    {isLoading ? "Searching..." : "Search Certificate"}
                                </motion.button>
                            </div>

                            {/* Help Line Marquee */}
                            <div className="mt-6 pt-4 border-t border-gray-100 overflow-hidden">
                                <div className="flex items-center gap-6 whitespace-nowrap animate-marquee">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Help Line: +880 9696 366 908</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-sm text-gray-600">For Any Query (WhatsApp): +880 1813 366 908</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Help Line: +880 9696 366 908</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-sm text-gray-600">For Any Query (WhatsApp): +880 1813 366 908</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Not Found Section */}

                </motion.div>

                <style jsx>{`
                    @keyframes marquee {
                        0% {
                            transform: translateX(0%);
                        }
                        100% {
                            transform: translateX(-50%);
                        }
                    }
                    .animate-marquee {
                        animation: marquee 12s linear infinite;
                        display: inline-flex;
                        width: fit-content;
                    }
                    .animate-marquee:hover {
                        animation-play-state: paused;
                    }
                `}</style>
            </div>
        </>
    );
};

export default CertificateVerification;