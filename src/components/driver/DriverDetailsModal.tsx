"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    User,
    Phone,
    MapPin,
    FileText,
    Banknote,
    Package,
    Calendar,
    DollarSign,
    Star,
    Edit,
    Briefcase,
    Truck,
    FileImage,
    AlertCircle
} from "lucide-react";
import { useTheme } from "@/hooks/useThemeContext";
import { Driver } from "@/utils/interface/driverInterface";

interface DriverDetailsModalProps {
    isOpen: boolean;
    driver: Driver;
    onClose: () => void;
    onEdit: (driver: Driver) => void;
    onStatusChange: (driver: Driver, status: string) => void;
    onRatingChange: (driver: Driver) => void;
}

const DriverDetailsModal: React.FC<DriverDetailsModalProps> = ({
    isOpen,
    driver,
    onClose,
    onEdit,
    onStatusChange,
    onRatingChange
}) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'vehicle' | 'employment' | 'payment' | 'documents'>('overview');

    if (!isOpen || !driver) return null;

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
            case 'on_leave': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'terminated': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getVehicleTypeIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'truck': return '🚚';
            case 'pickup': return '🛻';
            case 'lorry': return '🚛';
            case 'container': return '🚢';
            default: return '🚗';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'personal', label: 'Personal', icon: FileText },
        { id: 'vehicle', label: 'Vehicle', icon: Truck },
        { id: 'employment', label: 'Employment', icon: Briefcase },
        { id: 'payment', label: 'Payment', icon: DollarSign },
        { id: 'documents', label: 'Documents', icon: FileImage },
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
                                    <span className="text-3xl">{getVehicleTypeIcon(driver.vehicleType)}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {driver.driverName}
                                        </h2>
                                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(driver.status)}`}>
                                            {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {driver.vehicleRegNo} • {driver.vehicleType}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i < driver.rating
                                                        ? 'text-yellow-500 fill-yellow-500'
                                                        : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                                                    }
                                                />
                                            ))}
                                            <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                ({driver.rating}/5)
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => onRatingChange(driver)}
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
                                    onClick={() => onEdit(driver)}
                                    className={`p-2 hover:cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                                        ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                                        : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                        }`}
                                    title="Edit Driver"
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
                                                Total Trips
                                            </span>
                                        </div>
                                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {driver.totalTrips || 0}
                                        </p>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <DollarSign className="w-5 h-5 text-green-500" />
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Total Earnings
                                            </span>
                                        </div>
                                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {formatCurrency(driver.totalEarnings || 0)}
                                        </p>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Truck className="w-5 h-5 text-purple-500" />
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Vehicle
                                            </span>
                                        </div>
                                        <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {driver.vehicleRegNo}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <Phone size={16} />
                                        Contact Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Phone</span>
                                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {driver.phoneNo}
                                            </p>
                                        </div>
                                        {driver.alternatePhoneNo && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Alternate</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {driver.alternatePhoneNo}
                                                </p>
                                            </div>
                                        )}
                                        {driver.email && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {driver.email}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <MapPin size={16} />
                                        Address
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Present Address</span>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {driver.presentAddress}
                                            </p>
                                        </div>
                                        {driver.permanentAddress && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Permanent Address</span>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {driver.permanentAddress}
                                                </p>
                                            </div>
                                        )}
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {driver.city}, {driver.state} {driver.postalCode}
                                        </p>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {driver.country}
                                        </p>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <Calendar size={16} />
                                        Important Dates
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Registered</span>
                                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {driver.registeredDate || formatDate(driver.createdAt)}
                                            </p>
                                        </div>
                                        {driver.joiningDate && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Joined</span>
                                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {driver.joiningDateFormatted || formatDate(driver.joiningDate)}
                                                </p>
                                            </div>
                                        )}
                                        {driver.lastTripDate && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Last Trip</span>
                                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {driver.lastTripDateFormatted || formatDate(driver.lastTripDate)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                {driver.notes && (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <FileText size={16} />
                                            Notes
                                        </h3>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {driver.notes}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Personal Tab */}
                        {activeTab === 'personal' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <User size={16} />
                                        Personal Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</span>
                                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {driver.driverName}
                                            </p>
                                        </div>
                                        {driver.driverNidOrPassportNo && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>NID/Passport</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {driver.driverNidOrPassportNo}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Driving License</span>
                                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {driver.drivingLicenseNo}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Emergency Contact */}
                                {(driver.emergencyContactName || driver.emergencyContactPhone) && (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'}`}>
                                            <AlertCircle size={16} />
                                            Emergency Contact
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {driver.emergencyContactName && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Name</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {driver.emergencyContactName}
                                                    </p>
                                                </div>
                                            )}
                                            {driver.emergencyContactRelation && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Relation</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {driver.emergencyContactRelation}
                                                    </p>
                                                </div>
                                            )}
                                            {driver.emergencyContactPhone && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Phone</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {driver.emergencyContactPhone}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Vehicle Tab */}
                        {activeTab === 'vehicle' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <Truck size={16} />
                                        Vehicle Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Vehicle Type</span>
                                            <p className={`font-medium capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {driver.vehicleType}
                                            </p>
                                        </div>
                                        {driver.vehicleModel && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Model</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {driver.vehicleModel}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Registration No.</span>
                                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {driver.vehicleRegNo}
                                            </p>
                                        </div>
                                        {driver.vehicleCapacity && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Capacity</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {driver.vehicleCapacity}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Employment Tab */}
                        {activeTab === 'employment' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <Briefcase size={16} />
                                        Employment Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Employment Type</span>
                                            <p className={`font-medium capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {driver.employmentType}
                                            </p>
                                        </div>
                                        {driver.joiningDate && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Joining Date</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {driver.joiningDateFormatted || formatDate(driver.joiningDate)}
                                                </p>
                                            </div>
                                        )}
                                        {driver.contractStartDate && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Contract Start</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {driver.contractStartDateFormatted || formatDate(driver.contractStartDate)}
                                                </p>
                                            </div>
                                        )}
                                        {driver.contractEndDate && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Contract End</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {driver.contractEndDateFormatted || formatDate(driver.contractEndDate)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Payment Tab */}
                        {activeTab === 'payment' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <DollarSign size={16} />
                                        Payment Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Salary Type</span>
                                            <p className={`font-medium capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {driver.salaryType?.replace('_', ' ')}
                                            </p>
                                        </div>
                                        
                                        {driver.salaryType === 'fixed' && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Salary Amount</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {formatCurrency(driver.salaryAmount || 0)}
                                                </p>
                                            </div>
                                        )}

                                        {driver.salaryType === 'per_trip' && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Per Trip Rate</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {formatCurrency(driver.perTripRate || 0)}
                                                </p>
                                            </div>
                                        )}

                                        {driver.salaryType === 'percentage' && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Commission</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {driver.commissionPercentage}%
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bank Details */}
                                {(driver.bankName || driver.bankAccountNo) && (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Banknote size={16} />
                                            Bank Account Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {driver.bankName && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Bank Name</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {driver.bankName}
                                                    </p>
                                                </div>
                                            )}
                                            {driver.bankBranch && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Branch</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {driver.bankBranch}
                                                    </p>
                                                </div>
                                            )}
                                            {driver.bankAccountHolderName && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Account Holder</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {driver.bankAccountHolderName}
                                                    </p>
                                                </div>
                                            )}
                                            {driver.bankAccountNo && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Account Number</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {driver.bankAccountNo}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
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
                                {driver.documents && Object.keys(driver.documents).length > 0 ? (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <FileImage size={16} />
                                            Driver Documents
                                        </h3>
                                        <div className="space-y-3">
                                            {driver.driverNidFrontSide && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>NID Front Side</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        <a href={driver.driverNidFrontSide} target="_blank" rel="noopener noreferrer" 
                                                           className="text-blue-500 hover:underline">
                                                            View Document
                                                        </a>
                                                    </p>
                                                </div>
                                            )}
                                            {driver.driverNidBackSide && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>NID Back Side</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        <a href={driver.driverNidBackSide} target="_blank" rel="noopener noreferrer" 
                                                           className="text-blue-500 hover:underline">
                                                            View Document
                                                        </a>
                                                    </p>
                                                </div>
                                            )}
                                            {driver.drivingLicenseFrontSide && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Driving License Front</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        <a href={driver.drivingLicenseFrontSide} target="_blank" rel="noopener noreferrer" 
                                                           className="text-blue-500 hover:underline">
                                                            View Document
                                                        </a>
                                                    </p>
                                                </div>
                                            )}
                                            {driver.drivingLicenseBackSide && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Driving License Back</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        <a href={driver.drivingLicenseBackSide} target="_blank" rel="noopener noreferrer" 
                                                           className="text-blue-500 hover:underline">
                                                            View Document
                                                        </a>
                                                    </p>
                                                </div>
                                            )}
                                            {driver.vehicleRegCertificate && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Registration Certificate</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        <a href={driver.vehicleRegCertificate} target="_blank" rel="noopener noreferrer" 
                                                           className="text-blue-500 hover:underline">
                                                            View Document
                                                        </a>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <FileImage className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No documents available for this driver</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className={`flex-shrink-0 p-6 border-t transition-colors duration-300 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <select
                                    onChange={(e) => onStatusChange(driver, e.target.value)}
                                    value={driver.status}
                                    className={`px-3 py-2 rounded-lg text-sm border ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="on_leave">On Leave</option>
                                    <option value="terminated">Terminated</option>
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onEdit(driver)}
                                    className={`px-4 py-2 hover:cursor-pointer rounded-lg transition-colors duration-300 flex items-center gap-2 ${theme === 'dark'
                                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                >
                                    <Edit size={16} />
                                    Edit Driver
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DriverDetailsModal;