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
    Banknote,
    Calendar,
    Users,
    DollarSign,
    Star,
    AlertCircle,
    Store,
    CreditCard,
    Hash,
    Camera,
    Image as ImageIcon,
    Loader2,
    Check,
    XCircle,
    Target
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/hooks/useThemeContext";
import Image from "next/image";
import { Retailer } from "@/utils/interface/retailerInterface";
import { useCreateRetailerMutation, useUpdateRetailerMutation } from "@/redux/api/customer/retailerApi";
import { useAddThumbnailMutation } from "@/redux/features/file/fileApi";

interface AddEditRetailerModalProps {
    retailerData?: Retailer | null;
    isOpen: boolean;
    onClose: (refreshData?: boolean) => void;
}

const AddEditRetailerModal: React.FC<AddEditRetailerModalProps> = ({
    retailerData,
    isOpen,
    onClose
}) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'basic' | 'owner' | 'business' | 'bank'>('basic');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<Partial<Retailer>>({
        // Shop/Business Information
        shopName: "",
        businessType: "retailer",
        tradeLicenseNo: "",
        binNo: "",
        tinNo: "",
        
        // Owner Information
        ownerName: "",
        ownerPhoto: "",
        ownerNidOrPassportNo: "",
        ownerNidFrontSide: "",
        ownerNidBackSide: "",
        
        // Contact Information
        phoneNo: "",
        alternatePhoneNo: "",
        email: "",
        
        // Address
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Bangladesh",
        
        // Business Details
        yearOfEstablishment: undefined,
        creditLimit: 0,
        monthlyTarget: 0,
        paymentTerms: "immediate",
        
        // Bank Details
        bankName: "",
        bankAccountNo: "",
        bankBranch: "",
        bankAccountHolderName: "",
        
        // System Fields
        status: "active",
        rating: 3,
        notes: "",
    });

    const [uploadedFiles, setUploadedFiles] = useState<{
        ownerPhoto?: string;
        nidFront?: string;
        nidBack?: string;
    }>({});

    const [isUploading, setIsUploading] = useState({
        ownerPhoto: false,
        nidFront: false,
        nidBack: false,
    });

    const [createRetailer] = useCreateRetailerMutation();
    const [updateRetailer] = useUpdateRetailerMutation();
    const [addThumbnail] = useAddThumbnailMutation();

    useEffect(() => {
        if (retailerData) {
            setFormData({
                ...retailerData,
            });
            setUploadedFiles({
                ownerPhoto: retailerData.ownerPhoto || "",
                nidFront: retailerData.ownerNidFrontSide || "",
                nidBack: retailerData.ownerNidBackSide || "",
            });
        } else {
            resetForm();
        }
    }, [retailerData]);

    const resetForm = () => {
        setFormData({
            shopName: "",
            businessType: "retailer",
            tradeLicenseNo: "",
            binNo: "",
            tinNo: "",
            ownerName: "",
            ownerPhoto: "",
            ownerNidOrPassportNo: "",
            ownerNidFrontSide: "",
            ownerNidBackSide: "",
            phoneNo: "",
            alternatePhoneNo: "",
            email: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            country: "Bangladesh",
            yearOfEstablishment: undefined,
            creditLimit: 0,
            monthlyTarget: 0,
            paymentTerms: "immediate",
            bankName: "",
            bankAccountNo: "",
            bankBranch: "",
            bankAccountHolderName: "",
            status: "active",
            rating: 3,
            notes: "",
        });
        setUploadedFiles({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileUpload = async (file: File, type: 'ownerPhoto' | 'nidFront' | 'nidBack') => {
        try {
            setIsUploading(prev => ({ ...prev, [type]: true }));

            const formData = new FormData();
            formData.append('image', file);

            const response = await addThumbnail(formData).unwrap();

            if (response.success && response.data && response.data[0]) {
                const fileUrl = response.data[0];

                setUploadedFiles(prev => ({ ...prev, [type]: fileUrl }));

                if (type === 'ownerPhoto') {
                    setFormData(prev => ({ ...prev, ownerPhoto: fileUrl }));
                } else if (type === 'nidFront') {
                    setFormData(prev => ({ ...prev, ownerNidFrontSide: fileUrl }));
                } else if (type === 'nidBack') {
                    setFormData(prev => ({ ...prev, ownerNidBackSide: fileUrl }));
                }

                toast.success(`${type === 'ownerPhoto' ? 'Photo' : 'Document'} uploaded successfully!`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed. Please try again.');
        } finally {
            setIsUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'ownerPhoto' | 'nidFront' | 'nidBack') => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('File size should be less than 5MB');
                return;
            }
            handleFileUpload(file, type);
        }
    };

    const handleDrop = (e: React.DragEvent, type: 'ownerPhoto' | 'nidFront' | 'nidBack') => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            handleFileUpload(file, type);
        } else {
            toast.error('Please upload an image file');
        }
    };

    const removeFile = (type: 'ownerPhoto' | 'nidFront' | 'nidBack') => {
        setUploadedFiles(prev => ({ ...prev, [type]: undefined }));
        if (type === 'ownerPhoto') {
            setFormData(prev => ({ ...prev, ownerPhoto: '' }));
        } else if (type === 'nidFront') {
            setFormData(prev => ({ ...prev, ownerNidFrontSide: '' }));
        } else if (type === 'nidBack') {
            setFormData(prev => ({ ...prev, ownerNidBackSide: '' }));
        }
    };

    const validateForm = () => {
        if (!formData.shopName?.trim()) {
            toast.error("Shop name is required");
            return false;
        }
        if (!formData.tradeLicenseNo) {
            toast.error("ID number is required");
            return false;
        }
        if (!formData.binNo?.trim()) {
            toast.error("Address is required");
            return false;
        }
        if (!formData.tinNo?.trim()) {
            toast.error("Phone Number is required");
            return false;
        }
        if (!formData.creditLimit) {
            toast.error("Credit Limit is required");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData?.email && !emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

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
            if (retailerData?.id) {
                await updateRetailer({
                    id: retailerData.id,
                    data: formData
                }).unwrap();
                toast.success("Retailer updated successfully!");
            } else {
                await createRetailer(formData).unwrap();
                toast.success("Retailer created successfully!");
            }

            onClose(true);
        } catch (error: any) {
            toast.error(error?.data?.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: Store },
        { id: 'owner', label: 'Owner Details', icon: User },
        // { id: 'business', label: 'Business Info', icon: Building2 },
        // { id: 'bank', label: 'Bank Details', icon: Banknote },
    ];

    const FileUploadArea = ({ 
        type, 
        label, 
        accept = "image/*",
        maxSize = "5MB"
    }: { 
        type: 'ownerPhoto' | 'nidFront' | 'nidBack', 
        label: string,
        accept?: string,
        maxSize?: string
    }) => {
        const getFieldValue = () => {
            if (type === 'ownerPhoto') return uploadedFiles.ownerPhoto;
            if (type === 'nidFront') return uploadedFiles.nidFront;
            return uploadedFiles.nidBack;
        };

        const fileUrl = getFieldValue();

        return (
            <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {label}
                </label>
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, type)}
                    className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
                        fileUrl
                            ? "border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/10"
                            : "border-gray-300 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-500"
                    }`}
                >
                    {fileUrl ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <Image
                                        src={fileUrl}
                                        alt={label}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {label}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Uploaded successfully
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(type)}
                                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                            >
                                <XCircle className="w-4 h-4 text-red-500" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <Camera className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Drag & drop or{' '}
                                <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                                    browse
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept={accept}
                                        onChange={(e) => handleFileSelect(e, type)}
                                        disabled={isUploading[type]}
                                    />
                                </label>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Support: JPG, PNG, GIF (Max {maxSize})
                            </p>
                        </div>
                    )}
                    {isUploading[type] && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center rounded-lg">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                        </div>
                    )}
                </div>
            </div>
        );
    };

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
                                    <Users className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {retailerData ? "Edit Retailer" : "Add New Retailer"}
                                    </h2>
                                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {retailerData 
                                            ? `Edit details for ${retailerData.shopName}` 
                                            : "Add a new retailer to your system"}
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
                                        className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
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
                                    <div className="grid grid-cols-1">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Shop Name *
                                            </label>
                                            <div className="relative">
                                                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="text"
                                                    name="shopName"
                                                    value={formData.shopName}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., Rahim Stores"
                                                    className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                ID Number *
                                            </label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="number"
                                                    name="tradeLicenseNo"
                                                    value={formData.tradeLicenseNo || ''}
                                                    onChange={handleInputChange}
                                                     placeholder="e.g., 104 or 107 etc"
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
                                                Address *
                                            </label>
                                            <input
                                                type="text"
                                                name="binNo"
                                                value={formData.binNo || ''}
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
                                                Phone Number *
                                            </label>
                                            <input
                                                type="text"
                                                name="tinNo"
                                                value={formData.tinNo || ''}
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
                                                Credit Limit (৳) *
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="number"
                                                    name="creditLimit"
                                                    value={(formData.creditLimit === 0 || formData.creditLimit < 1) ? '' : formData.creditLimit}
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
                                                Monthly Target
                                            </label>
                                            <div className="relative">
                                                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="number"
                                                    name="monthlyTarget"
                                                    value={(formData.monthlyTarget === 0 || formData.monthlyTarget < 1) ? '' : formData.monthlyTarget}
                                                    onChange={handleInputChange}
                                                    placeholder="Number of quantity."
                                                    min="0"
                                                    step="0.01"
                                                    className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>
                                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                Set monthly sales target for this retailer
                                            </p>
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
                                            placeholder="Any additional notes about this retailer..."
                                            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 resize-none ${theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                } border`}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Owner Details Tab */}
                            {activeTab === 'owner' && (
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
                                                Owner Name *
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="text"
                                                    name="ownerName"
                                                    value={formData.ownerName}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., Md. Rahim"
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
                                                NID/Passport No.
                                            </label>
                                            <input
                                                type="text"
                                                name="ownerNidOrPassportNo"
                                                value={formData.ownerNidOrPassportNo || ''}
                                                onChange={handleInputChange}
                                                placeholder="NID or Passport number"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } border`}
                                            />
                                        </div>
                                    </div>

                                    {/* Owner Photo Upload */}
                                    <FileUploadArea type="ownerPhoto" label="Owner Photo" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* NID Front Upload */}
                                        <FileUploadArea type="nidFront" label="NID Front Side" />

                                        {/* NID Back Upload */}
                                        <FileUploadArea type="nidBack" label="NID Back Side" />
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
                                    <div className="grid grid-cols-1 gap-4">
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
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className={`font-medium mb-1 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'}`}>
                                                    Important Information
                                                </h4>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    Payment terms, credit limit, and monthly target will be used for sales management and performance tracking.
                                                    Make sure to set these correctly for better tracking of payments and achievements.
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
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                        <div className="flex items-start gap-3">
                                            <CreditCard className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className={`font-medium mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-800'}`}>
                                                    Bank Details (Optional)
                                                </h4>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    Adding bank details will help with payment tracking when retailers make payments.
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
                                    {isLoading ? "Saving..." : (retailerData ? "Update Retailer" : "Create Retailer")}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddEditRetailerModal;