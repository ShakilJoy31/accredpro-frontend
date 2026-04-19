"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Building2,
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
    Briefcase
} from "lucide-react";
import { useTheme } from "@/hooks/useThemeContext";
import { Supplier } from "@/utils/interface/supplierInterface";

interface SupplierDetailsModalProps {
    isOpen: boolean;
    supplier: Supplier;
    onClose: () => void;
    onEdit: (supplier: Supplier) => void;
    onStatusChange: (supplier: Supplier, status: string) => void;
    onRatingChange: (supplier: Supplier) => void;
}

const SupplierDetailsModal: React.FC<SupplierDetailsModalProps> = ({
    isOpen,
    supplier,
    onClose,
    onEdit,
    onStatusChange,
    onRatingChange
}) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'overview' | 'contact' | 'business' | 'bank' | 'purchases'>('overview');

    if (!isOpen || !supplier) return null;

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

    const getSupplierTypeIcon = (type: string) => {
        switch (type) {
            case 'manufacturer': return '🏭';
            case 'distributor': return '📦';
            case 'wholesaler': return '🏪';
            case 'retailer': return '🛒';
            default: return '🏢';
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Building2 },
        { id: 'contact', label: 'Contact', icon: User },
        { id: 'business', label: 'Business', icon: Briefcase },
        { id: 'bank', label: 'Bank', icon: Banknote },
        { id: 'purchases', label: 'Purchases', icon: Package },
    ];

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
                                <div className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-colors duration-300 ${theme === 'dark'
                                    ? 'bg-blue-500/20 border-2 border-blue-500/30'
                                    : 'bg-blue-50 border-2 border-blue-500'
                                    }`}>
                                    <span className="text-3xl">{getSupplierTypeIcon(supplier.supplierType)}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {supplier.supplierName}
                                        </h2>
                                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(supplier.status)}`}>
                                            {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {supplier.companyName}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i < supplier.rating
                                                        ? 'text-yellow-500 fill-yellow-500'
                                                        : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                                                    }
                                                />
                                            ))}
                                            <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                ({supplier.rating}/5)
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => onRatingChange(supplier)}
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
                                    onClick={() => onEdit(supplier)}
                                    className={`p-2 hover:cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                                        ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                                        : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                        }`}
                                    title="Edit Supplier"
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
                                            {supplier.totalPurchases}
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
                                            ৳{supplier.totalPurchaseAmount.toLocaleString()}
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
                                            ৳{supplier.creditLimit.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Hash size={16} />
                                            Basic Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Supplier Type:</span>
                                                <span className={`text-sm font-medium capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {supplier.supplierType}
                                                </span>
                                            </div>
                                            {supplier.yearOfEstablishment && (
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Established:</span>
                                                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {supplier.yearOfEstablishment}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Payment Terms:</span>
                                                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {supplier.paymentTerms}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Calendar size={16} />
                                            Dates
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Added to System:</span>
                                                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {formatDate(supplier.createdAt)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Last Updated:</span>
                                                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {formatDate(supplier.updatedAt)}
                                                </span>
                                            </div>
                                            {supplier.lastPurchaseDate && (
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Last Purchase:</span>
                                                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {formatDate(supplier.lastPurchaseDate)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Products Supplied */}
                                {supplier.productsSupplied && (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Package size={16} />
                                            Products Supplied
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(supplier.productsSupplied) ? (
                                                supplier.productsSupplied.map((product, index) => (
                                                    <span
                                                        key={index}
                                                        className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}
                                                    >
                                                        {product}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {supplier.productsSupplied}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Notes */}
                                {supplier.notes && (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <FileText size={16} />
                                            Notes
                                        </h3>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {supplier.notes}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Contact Tab */}
                        {activeTab === 'contact' && (
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
                                            Contact Person
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Name</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {supplier.contactPersonName}
                                                </p>
                                            </div>
                                            {supplier.contactPersonDesignation && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Designation</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {supplier.contactPersonDesignation}
                                                    </p>
                                                </div>
                                            )}
                                            {supplier.contactPersonNidOrPassportNo && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>NID/Passport</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {supplier.contactPersonNidOrPassportNo}
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
                                                    {supplier.phoneNo}
                                                </p>
                                            </div>
                                            {supplier.alternatePhoneNo && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Alternate</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {supplier.alternatePhoneNo}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <Mail size={16} />
                                        Email & Website
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email</span>
                                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {supplier.email}
                                            </p>
                                        </div>
                                        {supplier.website && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Website</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    <a href={`https://${supplier.website}`} target="_blank" rel="noopener noreferrer" 
                                                       className="text-blue-500 hover:underline">
                                                        {supplier.website}
                                                    </a>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <MapPin size={16} />
                                        Address
                                    </h3>
                                    <div className="space-y-2">
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {supplier.address}
                                        </p>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {supplier.city}, {supplier.state} {supplier.postalCode}
                                        </p>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {supplier.country}
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
                                            {supplier.tradeLicenseNo && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Trade License</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {supplier.tradeLicenseNo}
                                                    </p>
                                                </div>
                                            )}
                                            {supplier.binNo && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>BIN</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {supplier.binNo}
                                                    </p>
                                                </div>
                                            )}
                                            {supplier.tinNo && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>TIN</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {supplier.tinNo}
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
                                                    {supplier.paymentTerms}
                                                </p>
                                            </div>
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Credit Limit</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    ৳{supplier.creditLimit.toLocaleString()}
                                                </p>
                                            </div>
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
                                {supplier.bankName || supplier.bankAccountNo ? (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Banknote size={16} />
                                            Bank Account Details
                                        </h3>
                                        <div className="space-y-3">
                                            {supplier.bankName && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Bank Name</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {supplier.bankName}
                                                    </p>
                                                </div>
                                            )}
                                            {supplier.bankBranch && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Branch</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {supplier.bankBranch}
                                                    </p>
                                                </div>
                                            )}
                                            {supplier.bankAccountHolderName && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Account Holder</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {supplier.bankAccountHolderName}
                                                    </p>
                                                </div>
                                            )}
                                            {supplier.bankAccountNo && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Account Number</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {supplier.bankAccountNo}
                                                    </p>
                                                </div>
                                            )}
                                            {supplier.routingNumber && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Routing Number</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {supplier.routingNumber}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <Banknote className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No bank details available for this supplier</p>
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
                                                {supplier.totalPurchases}
                                            </p>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Total Purchases
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                ৳{supplier.totalPurchaseAmount.toLocaleString()}
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
                                        <button className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                                            View All
                                        </button>
                                    </div>
                                    {supplier.lastPurchaseDate ? (
                                        <div>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Last purchase on {formatDate(supplier.lastPurchaseDate)}
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
                                    onChange={(e) => onStatusChange(supplier, e.target.value)}
                                    value={supplier.status}
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
                                    onClick={() => onEdit(supplier)}
                                    className={`px-4 py-2 hover:cursor-pointer rounded-lg transition-colors duration-300 flex items-center gap-2 ${theme === 'dark'
                                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                >
                                    <Edit size={16} />
                                    Edit Supplier
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SupplierDetailsModal;