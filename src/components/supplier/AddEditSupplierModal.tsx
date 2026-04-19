"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Save,
    Building2,
    User,
    Phone,
    Mail,
    MapPin,
    Globe,
    Banknote,
    Package,
    DollarSign,
    Star,
    AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/hooks/useThemeContext";
import { useCreateSupplierMutation, useUpdateSupplierMutation } from "@/redux/api/supplier/supplier";


interface Supplier {
    id: number;
    supplierName: string;
    supplierType: 'manufacturer' | 'distributor' | 'wholesaler' | 'retailer';
    companyName: string;
    tradeLicenseNo?: string;
    binNo?: string;
    tinNo?: string;
    contactPersonName: string;
    contactPersonDesignation?: string;
    contactPersonPhoto?: string;
    contactPersonNidOrPassportNo?: string;
    phoneNo: string;
    alternatePhoneNo?: string;
    email: string;
    website?: string;
    address: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
    productsSupplied?: string[] | string;
    paymentTerms: 'immediate' | '7days' | '15days' | '30days' | '45days' | '60days';
    creditLimit: number;
    bankName?: string;
    bankAccountNo?: string;
    bankBranch?: string;
    bankAccountHolderName?: string;
    routingNumber?: string;
    documents?: Record<string, any>;
    status: 'active' | 'inactive' | 'blacklisted';
    rating: number;
    notes?: string;
}

interface AddEditSupplierModalProps {
    supplierData?: Supplier | null;
    isOpen: boolean;
    onClose: (refreshData?: boolean) => void;
}

const AddEditSupplierModal: React.FC<AddEditSupplierModalProps> = ({
    supplierData,
    isOpen,
    onClose
}) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'business' | 'bank'>('basic');
    const [isLoading, setIsLoading] = useState(false);
    const [productsInput, setProductsInput] = useState("");

    const [formData, setFormData] = useState<Partial<Supplier>>({
        supplierName: "",
        supplierType: "manufacturer",
        companyName: "",
        tradeLicenseNo: "",
        binNo: "",
        tinNo: "",
        contactPersonName: "",
        contactPersonDesignation: "",
        contactPersonPhoto: "",
        contactPersonNidOrPassportNo: "",
        phoneNo: "",
        alternatePhoneNo: "",
        email: "",
        website: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Bangladesh",
        productsSupplied: [],
        paymentTerms: "immediate",
        creditLimit: 0,
        bankName: "",
        bankAccountNo: "",
        bankBranch: "",
        bankAccountHolderName: "",
        routingNumber: "",
        status: "active",
        rating: 3,
        notes: "",
    });

    const [createSupplier] = useCreateSupplierMutation();
    const [updateSupplier] = useUpdateSupplierMutation();

    useEffect(() => {
        if (supplierData) {
            setFormData({
                ...supplierData,
                productsSupplied: supplierData.productsSupplied || []
            });
            if (supplierData.productsSupplied) {
                if (Array.isArray(supplierData.productsSupplied)) {
                    setProductsInput(supplierData.productsSupplied.join(', '));
                } else if (typeof supplierData.productsSupplied === 'string') {
                    setProductsInput(supplierData.productsSupplied);
                }
            }
        } else {
            setFormData({
                supplierName: "",
                supplierType: "manufacturer",
                companyName: "",
                tradeLicenseNo: "",
                binNo: "",
                tinNo: "",
                contactPersonName: "",
                contactPersonDesignation: "",
                contactPersonPhoto: "",
                contactPersonNidOrPassportNo: "",
                phoneNo: "",
                alternatePhoneNo: "",
                email: "",
                website: "",
                address: "",
                city: "",
                state: "",
                postalCode: "",
                country: "Bangladesh",
                productsSupplied: [],
                paymentTerms: "immediate",
                creditLimit: 0,
                bankName: "",
                bankAccountNo: "",
                bankBranch: "",
                bankAccountHolderName: "",
                routingNumber: "",
                status: "active",
                rating: 3,
                notes: "",
            });
            setProductsInput("");
        }
    }, [supplierData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleProductsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProductsInput(value);
        
        // Convert comma-separated string to array
        const productsArray = value.split(',').map(item => item.trim()).filter(item => item);
        setFormData(prev => ({ ...prev, productsSupplied: productsArray }));
    };

    const validateForm = () => {
        if (!formData.supplierName?.trim()) {
            toast.error("Supplier name is required");
            return false;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData?.email && (!emailRegex.test(formData.email))) {
            toast.error("Please enter a valid email address");
            return false;
        }

        // Phone validation (Bangladesh numbers)
        const phoneRegex = /^(?:\+88|01)?\d{11}$/;
        if (formData?.phoneNo && !phoneRegex.test(formData.phoneNo.replace(/\D/g, ''))) {
            toast.error("Please enter a valid Bangladeshi phone number");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            if (supplierData?.id) {
                await updateSupplier({
                    id: supplierData.id,
                    data: formData
                }).unwrap();
                toast.success("Supplier updated successfully!");
            } else {
                await createSupplier(formData).unwrap();
                toast.success("Supplier created successfully!");
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
        { id: 'basic', label: 'Basic Info', icon: Building2 },
        { id: 'contact', label: 'Contact Details', icon: User },
        { id: 'business', label: 'Business Info', icon: Package },
        { id: 'bank', label: 'Bank Details', icon: Banknote },
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
                                    <Building2 className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {supplierData ? "Edit Company" : "Add New Company"}
                                    </h2>
                                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {supplierData 
                                            ? `Edit details for ${supplierData.supplierName}` 
                                            : "Add a new company to your business"}
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
                                        className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
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
                            {/* Basic Info Tab */}
                            {activeTab === 'basic' && (
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
                                                Company Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="supplierName"
                                                value={formData.supplierName}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Crown Cement"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                                
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Company Address *
                                            </label>
                                            <input
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Wapda Road, Saver, Dhaka"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                                
                                            />
                                        </div>

                                         <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Company Mobile No. *
                                            </label>
                                            <input
                                                type="text"
                                                name="tradeLicenseNo"
                                                value={formData.tradeLicenseNo || ''}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 017********"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
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

                                        
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                            Status
                                        </label>
                                        <div className="flex gap-4">
                                            {['active', 'inactive', 'blacklisted'].map((status) => (
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
                                                        {status}
                                                    </span>
                                                </label>
                                            ))}
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
                                            placeholder="Any additional notes about this company..."
                                            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 resize-none ${theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                } border`}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Contact Details Tab */}
                            {activeTab === 'contact' && (
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
                                                Contact Person Name
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="text"
                                                    name="contactPersonName"
                                                    value={formData.contactPersonName}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., Md. Rahim"
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
                                                Designation
                                            </label>
                                            <input
                                                type="text"
                                                name="contactPersonDesignation"
                                                value={formData.contactPersonDesignation || ''}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Sales Manager"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Phone Number
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
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="info@crowncement.com"
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
                                                Website
                                            </label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="url"
                                                    name="website"
                                                    value={formData.website || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="www.crowncement.com"
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
                                                Address
                                            </label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows={3}
                                                placeholder="Street address, building, etc."
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 resize-none ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                                
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    City
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
                                                        
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    State/Division
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
                                                    
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
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
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                            Contact Person NID/Passport
                                        </label>
                                        <input
                                            type="text"
                                            name="contactPersonNidOrPassportNo"
                                            value={formData.contactPersonNidOrPassportNo || ''}
                                            onChange={handleInputChange}
                                            placeholder="NID or Passport number"
                                            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                } border`}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Business Info Tab */}
                            {activeTab === 'business' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                            Products Supplied (comma separated)
                                        </label>
                                        <div className="relative">
                                            <Package className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                            <input
                                                type="text"
                                                value={productsInput}
                                                onChange={handleProductsChange}
                                                placeholder="Cement, Rod, Sand, Bricks"
                                                className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>
                                        {formData.productsSupplied && Array.isArray(formData.productsSupplied) && formData.productsSupplied.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData.productsSupplied.map((product, index) => (
                                                    <span
                                                        key={index}
                                                        className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}
                                                    >
                                                        {product}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Payment Terms
                                            </label>
                                            <select
                                                name="paymentTerms"
                                                value={formData.paymentTerms}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    } border`}
                                            >
                                                <option value="immediate">Immediate</option>
                                                <option value="7days">7 Days</option>
                                                <option value="15days">15 Days</option>
                                                <option value="30days">30 Days</option>
                                                <option value="45days">45 Days</option>
                                                <option value="60days">60 Days</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Credit Limit (৳)
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="number"
                                                    name="creditLimit"
                                                    value={formData.creditLimit}
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


                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                BIN No.
                                            </label>
                                            <input
                                                type="text"
                                                name="binNo"
                                                value={formData.binNo || ''}
                                                onChange={handleInputChange}
                                                placeholder="BIN number"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                TIN No.
                                            </label>
                                            <input
                                                type="text"
                                                name="tinNo"
                                                value={formData.tinNo || ''}
                                                onChange={handleInputChange}
                                                placeholder="TIN number"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>


                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className={`font-medium mb-1 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'}`}>
                                                    Important Information
                                                </h4>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    Payment terms and credit limit will be used for purchase management. 
                                                    Make sure to set these correctly for better tracking of payments.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Bank Details Tab */}
                            {activeTab === 'bank' && (
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

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Routing Number
                                            </label>
                                            <input
                                                type="text"
                                                name="routingNumber"
                                                value={formData.routingNumber || ''}
                                                onChange={handleInputChange}
                                                placeholder="Routing number"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                        <div className="flex items-start gap-3">
                                            <Banknote className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className={`font-medium mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-800'}`}>
                                                    Bank Details (Optional)
                                                </h4>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    Adding bank details will help with payment tracking when you make purchases from this company.
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
                                    {isLoading ? "Saving..." : (supplierData ? "Update Supplier" : "Create Supplier")}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddEditSupplierModal;