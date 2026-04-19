"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Save,
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    DollarSign,
    Star,
    AlertCircle,
    CreditCard,
    Hash,
    Camera,
    Truck,
    Briefcase,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/hooks/useThemeContext";
import { Driver } from "@/utils/interface/driverInterface";
import { useCreateDriverMutation, useUpdateDriverMutation } from "@/redux/api/customer/driverApi";

interface AddEditDriverModalProps {
    driverData?: Driver | null;
    isOpen: boolean;
    onClose: (refreshData?: boolean) => void;
}

const AddEditDriverModal: React.FC<AddEditDriverModalProps> = ({
    driverData,
    isOpen,
    onClose
}) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'personal' | 'vehicle' | 'employment' | 'payment' | 'emergency'>('personal');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<Partial<Driver>>({
        // Personal Information
        driverName: "",
        driverPhoto: "",
        driverNidOrPassportNo: "",
        driverNidFrontSide: "",
        driverNidBackSide: "",
        drivingLicenseNo: "",
        drivingLicenseFrontSide: "",
        drivingLicenseBackSide: "",
        
        // Contact Information
        phoneNo: "",
        alternatePhoneNo: "",
        email: "",
        
        // Address
        presentAddress: "",
        permanentAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Bangladesh",
        
        // Vehicle Information
        vehicleType: "truck",
        vehicleModel: "",
        vehicleRegNo: "",
        vehicleRegCertificate: "",
        vehicleCapacity: "",
        vehiclePhoto: "",
        
        // Employment Details
        employmentType: "permanent",
        joiningDate: "",
        contractStartDate: "",
        contractEndDate: "",
        
        // Payment Information
        salaryType: "fixed",
        salaryAmount: 0,
        perTripRate: 0,
        commissionPercentage: 0,
        bankName: "",
        bankAccountNo: "",
        bankBranch: "",
        bankAccountHolderName: "",
        
        // Emergency Contact
        emergencyContactName: "",
        emergencyContactRelation: "",
        emergencyContactPhone: "",
        
        // System Fields
        status: "active",
        rating: 3,
        notes: "",
    });

    const [createDriver] = useCreateDriverMutation();
    const [updateDriver] = useUpdateDriverMutation();

    useEffect(() => {
        if (driverData) {
            setFormData({
                ...driverData,
            });
        } else {
            setFormData({
                driverName: "",
                driverPhoto: "",
                driverNidOrPassportNo: "",
                driverNidFrontSide: "",
                driverNidBackSide: "",
                drivingLicenseNo: "",
                drivingLicenseFrontSide: "",
                drivingLicenseBackSide: "",
                phoneNo: "",
                alternatePhoneNo: "",
                email: "",
                presentAddress: "",
                permanentAddress: "",
                city: "",
                state: "",
                postalCode: "",
                country: "Bangladesh",
                vehicleType: "truck",
                vehicleModel: "",
                vehicleRegNo: "",
                vehicleRegCertificate: "",
                vehicleCapacity: "",
                vehiclePhoto: "",
                employmentType: "permanent",
                joiningDate: "",
                contractStartDate: "",
                contractEndDate: "",
                salaryType: "fixed",
                salaryAmount: 0,
                perTripRate: 0,
                commissionPercentage: 0,
                bankName: "",
                bankAccountNo: "",
                bankBranch: "",
                bankAccountHolderName: "",
                emergencyContactName: "",
                emergencyContactRelation: "",
                emergencyContactPhone: "",
                status: "active",
                rating: 3,
                notes: "",
            });
        }
    }, [driverData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        if (!formData.driverName?.trim()) {
            toast.error("Driver name is required");
            return false;
        }
        if (!formData.phoneNo?.trim()) {
            toast.error("Phone number is required");
            return false;
        }
        if (!formData.presentAddress?.trim()) {
            toast.error("Present address is required");
            return false;
        }
        if (!formData.city?.trim()) {
            toast.error("City is required");
            return false;
        }
        if (!formData.state?.trim()) {
            toast.error("State is required");
            return false;
        }
        if (!formData.drivingLicenseNo?.trim()) {
            toast.error("Driving license number is required");
            return false;
        }
        if (!formData.vehicleType) {
            toast.error("Vehicle type is required");
            return false;
        }
        if (!formData.vehicleRegNo?.trim()) {
            toast.error("Vehicle registration number is required");
            return false;
        }

        // Phone validation (Bangladesh numbers)
        if (formData.phoneNo) {
            const phoneRegex = /^(?:\+88|01)?\d{11}$/;
            if (!phoneRegex.test(formData.phoneNo.replace(/\D/g, ''))) {
                toast.error("Please enter a valid Bangladeshi phone number");
                return false;
            }
        }

        // Email validation (if provided)
        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error("Please enter a valid email address");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            if (driverData?.id) {
                await updateDriver({
                    id: driverData.id,
                    data: formData
                }).unwrap();
                toast.success("Driver updated successfully!");
            } else {
                await createDriver(formData).unwrap();
                toast.success("Driver created successfully!");
            }

            onClose(true);
        } catch (error) {
            toast.error(error?.data?.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'vehicle', label: 'Vehicle Details', icon: Truck },
        { id: 'employment', label: 'Employment', icon: Briefcase },
        { id: 'payment', label: 'Payment', icon: DollarSign },
        { id: 'emergency', label: 'Emergency', icon: Phone },
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
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                    <Truck className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {driverData ? "Edit Driver" : "Add New Driver"}
                                    </h2>
                                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {driverData 
                                            ? `Edit details for ${driverData.driverName}` 
                                            : "Add a new driver to your fleet"}
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onClose()}
                                className={`p-2 hover:bg-red-600 hover:text-red-200 border hover:border-red-600 hover:cursor-pointer rounded-full transition-colors duration-300 ${theme === 'dark'
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <X size={20} />
                            </motion.button>
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

                    {/* Form */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Info Tab */}
                            {activeTab === 'personal' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Driver Name *
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="text"
                                                    name="driverName"
                                                    value={formData.driverName}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., Md. Karim"
                                                    className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Driver Photo URL
                                            </label>
                                            <div className="relative">
                                                <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="text"
                                                    name="driverPhoto"
                                                    value={formData.driverPhoto || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="https://example.com/photo.jpg"
                                                    className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                NID/Passport No.
                                            </label>
                                            <input
                                                type="text"
                                                name="driverNidOrPassportNo"
                                                value={formData.driverNidOrPassportNo || ''}
                                                onChange={handleInputChange}
                                                placeholder="NID or Passport number"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Driving License No. *
                                            </label>
                                            <input
                                                type="text"
                                                name="drivingLicenseNo"
                                                value={formData.drivingLicenseNo}
                                                onChange={handleInputChange}
                                                placeholder="e.g., DL-1234567890"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Phone Number *
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="text"
                                                    name="phoneNo"
                                                    value={formData.phoneNo}
                                                    onChange={handleInputChange}
                                                    placeholder="01712345678"
                                                    className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Alternate Phone
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="text"
                                                    name="alternatePhoneNo"
                                                    value={formData.alternatePhoneNo || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="01812345678"
                                                    className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Email
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="driver@example.com"
                                                    className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Present Address *
                                            </label>
                                            <textarea
                                                name="presentAddress"
                                                value={formData.presentAddress}
                                                onChange={handleInputChange}
                                                rows={3}
                                                placeholder="Street address, building, etc."
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 resize-none ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Permanent Address
                                                </label>
                                                <textarea
                                                    name="permanentAddress"
                                                    value={formData.permanentAddress || ''}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    placeholder="Permanent address"
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 resize-none ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                City *
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="Dhaka"
                                                    className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                placeholder="Dhaka Division"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode || ''}
                                                onChange={handleInputChange}
                                                placeholder="1207"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    } border`}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Vehicle Details Tab */}
                            {activeTab === 'vehicle' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Vehicle Type *
                                            </label>
                                            <select
                                                name="vehicleType"
                                                value={formData.vehicleType}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    } border`}
                                                required
                                            >
                                                <option value="truck">Truck</option>
                                                <option value="pickup">Pickup</option>
                                                <option value="lorry">Lorry</option>
                                                <option value="container">Container</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Vehicle Model
                                            </label>
                                            <input
                                                type="text"
                                                name="vehicleModel"
                                                value={formData.vehicleModel || ''}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Tata 407"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Vehicle Registration No. *
                                            </label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="text"
                                                    name="vehicleRegNo"
                                                    value={formData.vehicleRegNo}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., DHAKA-METRO-12-3456"
                                                    className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Vehicle Capacity
                                            </label>
                                            <input
                                                type="text"
                                                name="vehicleCapacity"
                                                value={formData.vehicleCapacity || ''}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 5 tons"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Vehicle Photo URL
                                            </label>
                                            <input
                                                type="text"
                                                name="vehiclePhoto"
                                                value={formData.vehiclePhoto || ''}
                                                onChange={handleInputChange}
                                                placeholder="Vehicle image URL"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Registration Certificate URL
                                            </label>
                                            <input
                                                type="text"
                                                name="vehicleRegCertificate"
                                                value={formData.vehicleRegCertificate || ''}
                                                onChange={handleInputChange}
                                                placeholder="Document URL"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
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
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Employment Type
                                            </label>
                                            <select
                                                name="employmentType"
                                                value={formData.employmentType}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    } border`}
                                            >
                                                <option value="permanent">Permanent</option>
                                                <option value="contractual">Contractual</option>
                                                <option value="temporary">Temporary</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Joining Date
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="date"
                                                    name="joiningDate"
                                                    value={formData.joiningDate || ''}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white'
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                        } border`}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Contract Start Date
                                            </label>
                                            <input
                                                type="date"
                                                name="contractStartDate"
                                                value={formData.contractStartDate || ''}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    } border`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Contract End Date
                                            </label>
                                            <input
                                                type="date"
                                                name="contractEndDate"
                                                value={formData.contractEndDate || ''}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    } border`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                            Status
                                        </label>
                                        <div className="flex gap-4">
                                            {['active', 'inactive', 'on_leave', 'terminated'].map((status) => (
                                                <label key={status} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value={status}
                                                        checked={formData.status === status}
                                                        onChange={handleInputChange}
                                                        className="text-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span className={`text-sm capitalize ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {status.replace('_', ' ')}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                            Rating (1-5)
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                name="rating"
                                                value={formData.rating}
                                                onChange={handleInputChange}
                                                min="1"
                                                max="5"
                                                step="1"
                                                className="flex-1"
                                            />
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {formData.rating}/5
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                            Notes
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes || ''}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="Any additional notes about this driver..."
                                            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 resize-none ${theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                } border`}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Payment Tab */}
                            {activeTab === 'payment' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Salary Type
                                            </label>
                                            <select
                                                name="salaryType"
                                                value={formData.salaryType}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    } border`}
                                            >
                                                <option value="fixed">Fixed Salary</option>
                                                <option value="per_trip">Per Trip</option>
                                                <option value="percentage">Commission Percentage</option>
                                            </select>
                                        </div>

                                        {formData.salaryType === 'fixed' && (
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Salary Amount (৳)
                                                </label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <input
                                                        type="number"
                                                        name="salaryAmount"
                                                        value={formData.salaryAmount}
                                                        onChange={handleInputChange}
                                                        placeholder="0.00"
                                                        min="0"
                                                        step="0.01"
                                                        className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                            } border`}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {formData.salaryType === 'per_trip' && (
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Per Trip Rate (৳)
                                                </label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <input
                                                        type="number"
                                                        name="perTripRate"
                                                        value={formData.perTripRate}
                                                        onChange={handleInputChange}
                                                        placeholder="0.00"
                                                        min="0"
                                                        step="0.01"
                                                        className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                            } border`}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {formData.salaryType === 'percentage' && (
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Commission Percentage (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="commissionPercentage"
                                                    value={formData.commissionPercentage}
                                                    onChange={handleInputChange}
                                                    placeholder="0.00"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                        <div className="flex items-start gap-3">
                                            <CreditCard className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className={`font-medium mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-800'}`}>
                                                    Bank Details (Optional)
                                                </h4>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    Adding bank details will help with salary and payment tracking.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Bank Name
                                            </label>
                                            <input
                                                type="text"
                                                name="bankName"
                                                value={formData.bankName || ''}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Sonali Bank"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Bank Branch
                                            </label>
                                            <input
                                                type="text"
                                                name="bankBranch"
                                                value={formData.bankBranch || ''}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Motijheel Branch"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Account Holder Name
                                            </label>
                                            <input
                                                type="text"
                                                name="bankAccountHolderName"
                                                value={formData.bankAccountHolderName || ''}
                                                onChange={handleInputChange}
                                                placeholder="Name on bank account"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Account Number
                                            </label>
                                            <input
                                                type="text"
                                                name="bankAccountNo"
                                                value={formData.bankAccountNo || ''}
                                                onChange={handleInputChange}
                                                placeholder="Bank account number"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Emergency Contact Tab */}
                            {activeTab === 'emergency' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Emergency Contact Name
                                            </label>
                                            <input
                                                type="text"
                                                name="emergencyContactName"
                                                value={formData.emergencyContactName || ''}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Mrs. Karim"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Relationship
                                            </label>
                                            <input
                                                type="text"
                                                name="emergencyContactRelation"
                                                value={formData.emergencyContactRelation || ''}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Spouse, Brother"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Emergency Contact Phone
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="text"
                                                    name="emergencyContactPhone"
                                                    value={formData.emergencyContactPhone || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="01712345678"
                                                    className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className={`font-medium mb-1 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'}`}>
                                                    Important
                                                </h4>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    Emergency contact information is crucial for driver safety. Please ensure it&apos;s accurate.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Action Buttons */}
                            <div className={`flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t transition-colors duration-300 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onClose()}
                                    className={`px-6 hover:cursor-pointer py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${theme === 'dark'
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    disabled={isLoading}
                                >
                                    <X size={18} />
                                    Cancel
                                </motion.button>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-6 hover:cursor-pointer py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${theme === 'dark'
                                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    disabled={isLoading}
                                >
                                    <Save size={18} />
                                    {isLoading ? "Saving..." : (driverData ? "Update Driver" : "Create Driver")}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddEditDriverModal;