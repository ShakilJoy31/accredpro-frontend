"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    User,
    Phone,
    Mail,
    MapPin,
    FileText,
    Banknote,
    Package,
    Calendar,
    DollarSign,
    Star,
    Edit,
    Clock,
    CreditCard,
    Hash,
    Briefcase,
    Store,
    FileImage,
    Image as ImageIcon,
    Target
} from "lucide-react";
import { useTheme } from "@/hooks/useThemeContext";
import Image from "next/image";
import { Retailer } from "@/utils/interface/retailerInterface";

interface RetailerDetailsModalProps {
    isOpen: boolean;
    retailer: Retailer;
    onClose: () => void;
    onEdit: (retailer: Retailer) => void;
    onStatusChange: (retailer: Retailer, status: string) => void;
    onRatingChange: (retailer: Retailer) => void;
}

const RetailerDetailsModal: React.FC<RetailerDetailsModalProps> = ({
    isOpen,
    retailer,
    onClose,
    onEdit,
    onStatusChange,
    onRatingChange
}) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'overview' | 'owner' | 'business' | 'bank' | 'documents' | 'purchases'>('overview');
    const [showImageModal, setShowImageModal] = useState<{ isOpen: boolean; imageUrl: string; title: string }>({
        isOpen: false,
        imageUrl: '',
        title: ''
    });

    if (!isOpen || !retailer) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'inactive': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'blacklisted': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getBusinessTypeIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'retailer': return '🛒';
            case 'wholesaler': return '🏪';
            case 'distributor': return '📦';
            case 'manufacturer': return '🏭';
            default: return '🏢';
        }
    };

    // Calculate target progress percentage
    const getTargetProgress = () => {
        if (!retailer.monthlyTarget || retailer.monthlyTarget <= 0) return null;
        const progress = ((retailer.totalPurchaseAmount || 0) / retailer.monthlyTarget) * 100;
        return Math.min(progress, 100).toFixed(0);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Store },
        { id: 'owner', label: 'Owner', icon: User },
        { id: 'business', label: 'Business', icon: Briefcase },
        // { id: 'bank', label: 'Bank', icon: Banknote },
        { id: 'documents', label: 'Documents', icon: FileImage },
        { id: 'purchases', label: 'Purchases', icon: Package },
    ];

    const targetProgress = getTargetProgress();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                        } border`}
                >
                    {/* Header */}
                    <div className={`flex-shrink-0 p-6 border-b transition-colors duration-300 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                                {retailer.ownerPhoto ? (
                                    <div 
                                        className={`w-16 h-16 rounded-full overflow-hidden cursor-pointer transition-transform hover:scale-105 ${theme === 'dark' ? 'border-2 border-blue-500/30' : 'border-2 border-blue-500'
                                        }`}
                                        onClick={() => setShowImageModal({ isOpen: true, imageUrl: retailer.ownerPhoto!, title: `${retailer.ownerName}'s Photo` })}
                                    >
                                        <Image
                                            src={retailer.ownerPhoto}
                                            alt={retailer.ownerName}
                                            width={64}
                                            height={64}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-colors duration-300 ${theme === 'dark'
                                        ? 'bg-blue-500/20 border-2 border-blue-500/30'
                                        : 'bg-blue-50 border-2 border-blue-500'
                                        }`}>
                                        <span className="text-3xl">{getBusinessTypeIcon(retailer.businessType)}</span>
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {retailer.shopName}
                                        </h2>
                                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(retailer.status)}`}>
                                            {retailer.status.charAt(0).toUpperCase() + retailer.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {retailer.ownerName}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i < retailer.rating
                                                        ? 'text-yellow-500 fill-yellow-500'
                                                        : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                                                    }
                                                />
                                            ))}
                                            <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                ({retailer.rating}/5)
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => onRatingChange(retailer)}
                                            className={`text-sm px-2 py-1 rounded hover:bg-yellow-500/10 transition-colors ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}
                                        >
                                            Update Rating
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onEdit(retailer)}
                                    className={`p-2 hover:cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                                        ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                                        : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                        }`}
                                    title="Edit Retailer"
                                >
                                    <Edit size={20} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className={`p-2 hover:cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <motion.button
                                        key={tab.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                                            ? theme === 'dark'
                                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                : 'bg-blue-500 text-white'
                                            : theme === 'dark'
                                                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {tab.label}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Quick Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Package className="w-5 h-5 text-blue-500" />
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Total Purchases
                                            </span>
                                        </div>
                                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {retailer.totalPurchases || 0}
                                        </p>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <DollarSign className="w-5 h-5 text-green-500" />
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Total Amount
                                            </span>
                                        </div>
                                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            ৳{(retailer.totalPurchaseAmount || 0).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <CreditCard className="w-5 h-5 text-purple-500" />
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Credit Limit
                                            </span>
                                        </div>
                                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            ৳{(retailer.creditLimit || 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Monthly Target Section */}
                                {/* {retailer.monthlyTarget && retailer.monthlyTarget > 0 && (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className={`font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                <Target size={18} className="text-purple-500" />
                                                Monthly Sales Target
                                            </h3>
                                            <span className={`text-lg font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                                                ৳{retailer.monthlyTarget.toLocaleString()}
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                                    Achieved: ৳{(retailer.totalPurchaseAmount || 0).toLocaleString()}
                                                </span>
                                                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                                    Remaining: ৳{Math.max(0, retailer.monthlyTarget - (retailer.totalPurchaseAmount || 0)).toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${targetProgress}%` }}
                                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                                    className={`absolute top-0 left-0 h-full rounded-full ${
                                                        parseInt(targetProgress || '0') >= 100
                                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                            : parseInt(targetProgress || '0') >= 70
                                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                                                                : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                                    }`}
                                                />
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    Target Progress
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-bold ${
                                                        parseInt(targetProgress || '0') >= 100
                                                            ? 'text-green-500'
                                                            : parseInt(targetProgress || '0') >= 70
                                                                ? 'text-blue-500'
                                                                : 'text-yellow-500'
                                                    }`}>
                                                        {targetProgress}%
                                                    </span>
                                                    {parseInt(targetProgress || '0') >= 100 && (
                                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                                            Target Achieved! 🎉
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )} */}

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Hash size={16} />
                                            Basic Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Business Type:</span>
                                                <span className={`text-sm font-medium capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {retailer.businessType || 'Retailer'}
                                                </span>
                                            </div>
                                            {retailer.yearOfEstablishment && (
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Established:</span>
                                                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {retailer.yearOfEstablishment}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Payment Terms:</span>
                                                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {retailer.paymentTerms}
                                                </span>
                                            </div>
                                            {retailer.monthlyTarget && retailer.monthlyTarget > 0 && (
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Target:</span>
                                                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        ৳{retailer.monthlyTarget.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Calendar size={16} />
                                            Dates
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Joined:</span>
                                                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {retailer.joinedDate || formatDate(retailer.createdAt)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Last Updated:</span>
                                                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {formatDate(retailer.updatedAt)}
                                                </span>
                                            </div>
                                            {retailer.lastPurchaseDate && (
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Last Purchase:</span>
                                                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {retailer.lastPurchaseDateFormatted || formatDate(retailer.lastPurchaseDate)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {retailer.notes && (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <FileText size={16} />
                                            Notes
                                        </h3>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {retailer.notes}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Owner Tab */}
                        {activeTab === 'owner' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <User size={16} />
                                            Owner Information
                                        </h3>
                                        <div className="space-y-3">
                                            {retailer.ownerPhoto && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Photo</span>
                                                    <div 
                                                        className="mt-1 cursor-pointer group relative w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500/30"
                                                        onClick={() => setShowImageModal({ isOpen: true, imageUrl: retailer.ownerPhoto!, title: `${retailer.ownerName}'s Photo` })}
                                                    >
                                                        <Image
                                                            src={retailer.ownerPhoto}
                                                            alt={retailer.ownerName}
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-110"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Name</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {retailer.ownerName}
                                                </p>
                                            </div>
                                            {retailer.ownerNidOrPassportNo && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>NID/Passport</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {retailer.ownerNidOrPassportNo}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Phone size={16} />
                                            Contact Numbers
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Primary</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {retailer.phoneNo}
                                                </p>
                                            </div>
                                            {retailer.alternatePhoneNo && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Alternate</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {retailer.alternatePhoneNo}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <Mail size={16} />
                                        Email
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email</span>
                                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {retailer.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <MapPin size={16} />
                                        Address
                                    </h3>
                                    <div className="space-y-2">
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {retailer.address}
                                        </p>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {retailer.city}, {retailer.state} {retailer.postalCode}
                                        </p>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {retailer.country}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Business Tab */}
                        {activeTab === 'business' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Briefcase size={16} />
                                            Business Details
                                        </h3>
                                        <div className="space-y-3">
                                            {retailer.tradeLicenseNo && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Trade License</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {retailer.tradeLicenseNo}
                                                    </p>
                                                </div>
                                            )}
                                            {retailer.binNo && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>BIN</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {retailer.binNo}
                                                    </p>
                                                </div>
                                            )}
                                            {retailer.tinNo && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>TIN</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {retailer.tinNo}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <DollarSign size={16} />
                                            Payment & Credit
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Payment Terms</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {retailer.paymentTerms}
                                                </p>
                                            </div>
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Credit Limit</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    ৳{(retailer.creditLimit || 0).toLocaleString()}
                                                </p>
                                            </div>
                                            {retailer.monthlyTarget && retailer.monthlyTarget > 0 && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Target</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        ৳{retailer.monthlyTarget.toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Bank Tab */}
                        {activeTab === 'bank' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {retailer.bankName || retailer.bankAccountNo ? (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Banknote size={16} />
                                            Bank Account Details
                                        </h3>
                                        <div className="space-y-3">
                                            {retailer.bankName && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Bank Name</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {retailer.bankName}
                                                    </p>
                                                </div>
                                            )}
                                            {retailer.bankBranch && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Branch</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {retailer.bankBranch}
                                                    </p>
                                                </div>
                                            )}
                                            {retailer.bankAccountHolderName && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Account Holder</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {retailer.bankAccountHolderName}
                                                    </p>
                                                </div>
                                            )}
                                            {retailer.bankAccountNo && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Account Number</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {retailer.bankAccountNo}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <Banknote className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No bank details available for this retailer</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Documents Tab */}
                        {activeTab === 'documents' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {retailer.ownerNidFrontSide || retailer.ownerNidBackSide ? (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <FileImage size={16} />
                                            Owner Documents
                                        </h3>
                                        <div className="space-y-4">
                                            {retailer.ownerNidFrontSide && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>NID Front Side</span>
                                                    <div 
                                                        className="mt-2 cursor-pointer group relative w-32 h-32 rounded-lg overflow-hidden border-2 border-blue-500/30"
                                                        onClick={() => setShowImageModal({ isOpen: true, imageUrl: retailer.ownerNidFrontSide!, title: "NID Front Side" })}
                                                    >
                                                        <Image
                                                            src={retailer.ownerNidFrontSide}
                                                            alt="NID Front"
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-110"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {retailer.ownerNidBackSide && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>NID Back Side</span>
                                                    <div 
                                                        className="mt-2 cursor-pointer group relative w-32 h-32 rounded-lg overflow-hidden border-2 border-blue-500/30"
                                                        onClick={() => setShowImageModal({ isOpen: true, imageUrl: retailer.ownerNidBackSide!, title: "NID Back Side" })}
                                                    >
                                                        <Image
                                                            src={retailer.ownerNidBackSide}
                                                            alt="NID Back"
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-110"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <FileImage className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No documents available for this retailer</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Purchases Tab */}
                        {activeTab === 'purchases' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-medium mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <Package size={16} />
                                        Purchase Summary
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {retailer.totalPurchases || 0}
                                            </p>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Total Purchases
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                ৳{(retailer.totalPurchaseAmount || 0).toLocaleString()}
                                            </p>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Total Amount
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className={`font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Clock size={16} />
                                            Recent Purchases
                                        </h3>
                                    </div>
                                    {retailer.lastPurchaseDate ? (
                                        <div>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Last purchase on {retailer.lastPurchaseDateFormatted || formatDate(retailer.lastPurchaseDate)}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            No purchases yet
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className={`flex-shrink-0 p-6 border-t transition-colors duration-300 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <select
                                    onChange={(e) => onStatusChange(retailer, e.target.value)}
                                    value={retailer.status}
                                    className={`px-3 py-2 rounded-lg text-sm border ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="blacklisted">Blacklisted</option>
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onEdit(retailer)}
                                    className={`px-4 py-2 hover:cursor-pointer rounded-lg transition-colors duration-300 flex items-center gap-2 ${theme === 'dark'
                                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                >
                                    <Edit size={16} />
                                    Edit Retailer
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Image Preview Modal */}
            <AnimatePresence>
                {showImageModal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
                        onClick={() => setShowImageModal({ isOpen: false, imageUrl: '', title: '' })}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-3xl max-h-[90vh] rounded-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={() => setShowImageModal({ isOpen: false, imageUrl: '', title: '' })}
                                    className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="relative w-full h-full">
                                <Image
                                    src={showImageModal.imageUrl}
                                    alt={showImageModal.title}
                                    width={1200}
                                    height={800}
                                    className="object-contain max-h-[90vh]"
                                />
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 text-center">
                                <p className="text-white text-sm bg-black/50 inline-block px-4 py-2 rounded-full">
                                    {showImageModal.title}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AnimatePresence>
    );
};

export default RetailerDetailsModal;