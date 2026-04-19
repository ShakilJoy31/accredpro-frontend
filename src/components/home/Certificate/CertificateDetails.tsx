"use client";

import { motion } from "framer-motion";
import {
    CheckCircle,
    Award,
    Calendar,
    FileText,
    Clock,
    Verified,
    AlertTriangle,
    Shield,
    Printer,
    Share2,
} from "lucide-react";
import { useState, useEffect } from "react";

interface CertificateDetailsProps {
    certificate: any;
    isValid: boolean;
}

const CertificateDetails = ({ certificate, isValid }: CertificateDetailsProps) => {
    const [isAnimating, setIsAnimating] = useState(true);

    // Move useEffect BEFORE any conditional returns
    useEffect(() => {
        // Stop animation after entrance
        const timer = setTimeout(() => setIsAnimating(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Validate certificate data at the start - after all hooks
    if (!certificate || !certificate.certificateNumber || !isValid) {
        return null; // Don't render if certificate is invalid
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getValidityColor = () => {
        if (!isValid) return "text-red-600";
        if (certificate.status === "active") return "text-green-600";
        if (certificate.status === "expired") return "text-red-600";
        return "text-orange-600";
    };

    // Animation variants
    const containerVariants: any = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            rotateY: -90,
            filter: "blur(10px)",
        },
        visible: {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 15,
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 12,
            },
        },
    };

    const glowVariants = {
        hidden: { opacity: 0, boxShadow: "0 0 0px rgba(255,215,0,0)" },
        visible: {
            opacity: 1,
            boxShadow: [
                "0 0 20px rgba(255,215,0,0.3)",
                "0 0 40px rgba(255,215,0,0.5)",
                "0 0 20px rgba(255,215,0,0.3)",
            ],
            transition: {
                boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                },
                delay: 0.5,
            },
        },
    };

    const badgeVariants: any = {
        hidden: { scale: 0, rotate: -180, opacity: 0 },
        visible: {
            scale: 1,
            rotate: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 12,
                delay: 0.6,
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative"
        >
            {/* Certificate Border with Shadow and Glow Effect */}
            <motion.div 
                variants={glowVariants}
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Decorative Border */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-4 border-2 border-double border-amber-400/30 rounded-xl"></div>
                    <div className="absolute inset-8 border border-amber-300/20 rounded-lg"></div>
                </div>

                {/* Top Decorative Pattern */}
                <motion.div 
                    variants={itemVariants}
                    className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"
                ></motion.div>

                {/* Main Content */}
                <div className="relative p-8 md:p-12">
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        {/* Seal/Logo */}
                        <motion.div
                            animate={isAnimating ? { rotate: [0, 360] } : { rotate: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                            className="absolute top-8 right-8 w-24 h-24 opacity-20"
                        >
                            <div className="w-full h-full rounded-full border-4 border-amber-500 flex items-center justify-center">
                                <Award className="w-12 h-12 text-amber-500" />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <motion.h2 
                                animate={{ 
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                className="text-2xl md:text-3xl font-serif bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent bg-[length:200%_auto] mb-2"
                            >
                                Certificate of Registration
                            </motion.h2>
                            <div className="w-24 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto my-4"></div>
                            <p className="text-gray-600 italic">This is to certify that</p>
                            <motion.h3 
                                whileHover={{ scale: 1.05 }}
                                className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-2"
                            >
                                {certificate.name}
                            </motion.h3>
                        </motion.div>
                    </div>

                    {/* Certificate Body */}
                    <div className="grid md:grid-cols-2 gap-8 mb-10">
                        {/* Left Column */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <div className="border-l-4 border-amber-500 pl-4 hover:bg-amber-50/30 transition-colors duration-300">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Certificate Number</p>
                                <motion.p 
                                    whileHover={{ x: 5 }}
                                    className="font-mono text-sm font-semibold text-gray-800"
                                >
                                    {certificate.certificateNumber}
                                </motion.p>
                            </div>

                            <div className="border-l-4 border-amber-500 pl-4 hover:bg-amber-50/30 transition-colors duration-300">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Standard</p>
                                <p className="font-semibold text-gray-800">{certificate.standard}</p>
                            </div>

                            <div className="border-l-4 border-amber-500 pl-4 hover:bg-amber-50/30 transition-colors duration-300">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Accreditation Body</p>
                                <p className="text-gray-800">{certificate.accreditationBody}</p>
                            </div>

                            <div className="border-l-4 border-amber-500 pl-4 hover:bg-amber-50/30 transition-colors duration-300">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Certification Body</p>
                                <p className="text-gray-800">{certificate.certificationBody}</p>
                            </div>
                        </motion.div>

                        {/* Right Column */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <div className="border-l-4 border-amber-500 pl-4 hover:bg-amber-50/30 transition-colors duration-300">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Address</p>
                                <p className="text-gray-800">{certificate.address}</p>
                            </div>

                            <div className="border-l-4 border-amber-500 pl-4 hover:bg-amber-50/30 transition-colors duration-300">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Country</p>
                                <p className="text-gray-800">{certificate.country}</p>
                            </div>

                            <div className="border-l-4 border-amber-500 pl-4 hover:bg-amber-50/30 transition-colors duration-300">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Registration Number</p>
                                <p className="font-mono text-sm text-gray-800">REG-{certificate.id?.toString().padStart(6, '0') || '000000'}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Scope Section */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-amber-50/30 rounded-xl border border-amber-200/50 transition-all duration-300"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-5 h-5 text-amber-600" />
                            <h4 className="font-semibold text-gray-800">Scope of Certification</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm">{certificate.scope}</p>
                    </motion.div>

                    {/* Dates Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <motion.div 
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="text-center p-4 bg-blue-50/50 rounded-lg transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-semibold uppercase">Issue Date</span>
                            </div>
                            <p className="font-serif text-gray-800">{formatDate(certificate.issueDate)}</p>
                        </motion.div>

                        <motion.div 
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="text-center p-4 bg-purple-50/50 rounded-lg transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex items-center justify-center gap-2 text-purple-600 mb-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-semibold uppercase">Registration Date</span>
                            </div>
                            <p className="font-serif text-gray-800">{formatDate(certificate.registrationDate)}</p>
                        </motion.div>

                        <motion.div 
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="text-center p-4 bg-amber-50/50 rounded-lg transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-semibold uppercase">Expiry Date</span>
                            </div>
                            <p className="font-serif text-gray-800">{formatDate(certificate.expiryDate)}</p>
                            {certificate.daysRemaining > 0 && (
                                <motion.p 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8, type: "spring" }}
                                    className={`text-xs mt-1 font-medium ${getValidityColor()}`}
                                >
                                    {certificate.daysRemaining} days remaining
                                </motion.p>
                            )}
                        </motion.div>
                    </div>

                    {/* Status and Verification */}
                    <motion.div 
                        variants={itemVariants}
                        className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t-2 border-dashed border-gray-200"
                    >
                        <div className="flex items-center gap-3">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                                    isValid && certificate.status === "active"
                                        ? "bg-green-100"
                                        : "bg-red-100"
                                }`}
                            >
                                {isValid && certificate.status === "active" ? (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </motion.div>
                                ) : (
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                )}
                                <span className={`font-semibold ${
                                    isValid && certificate.status === "active"
                                        ? "text-green-700"
                                        : "text-red-700"
                                }`}>
                                    {isValid && certificate.status === "active" ? "VALID CERTIFICATE" : "INVALID CERTIFICATE"}
                                </span>
                            </motion.div>
                            
                            {certificate.isVerified && (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100"
                                >
                                    <Verified className="w-5 h-5 text-purple-600" />
                                    <span className="font-semibold text-purple-700">VERIFIED</span>
                                </motion.div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Shield className="w-4 h-4" />
                            <span>Digitally Signed Document</span>
                        </div>
                    </motion.div>

                    {/* Footer with Buttons and Signature */}
                    <motion.div 
                        variants={itemVariants}
                        className="mt-8 pt-6 flex flex-wrap items-center justify-between gap-4"
                    >
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.print()}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
                            >
                                <Printer className="w-4 h-4" />
                                <span className="text-sm">Print</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    const url = window.location.href;
                                    navigator.clipboard.writeText(url);
                                    alert("Certificate link copied to clipboard!");
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
                            >
                                <Share2 className="w-4 h-4" />
                                <span className="text-sm">Share</span>
                            </motion.button>
                        </div>

                        {/* Signature Section */}
                        <motion.div 
                            whileHover={{ x: -5 }}
                            className="text-right"
                        >
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "12rem" }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="h-12 border-b-2 border-gray-300 mb-1"
                            ></motion.div>
                            <p className="text-xs text-gray-500">Authorized Signature</p>
                            <p className="text-xs text-gray-400 mt-1">{certificate.certificationBody}</p>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom Decorative Pattern */}
                <motion.div 
                    variants={itemVariants}
                    className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"
                ></motion.div>
            </motion.div>

            {/* Floating Badge */}
            <motion.div
                variants={badgeVariants}
                animate={{ 
                    y: [0, -5, 0],
                }}
                transition={{ 
                    y: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                }}
                className="absolute -top-3 -right-3"
            >
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full shadow-lg">
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span className="text-xs font-bold">OFFICIAL</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CertificateDetails;