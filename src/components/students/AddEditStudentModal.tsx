// components/students/AddEditStudentModal.tsx
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
    Users,
    DollarSign,
    GraduationCap,
    Briefcase,
    CreditCard,
    Camera,
    Loader2,
    XCircle,
    Check,
    AlertCircle,
    BookOpen,
    Home,
    FileText,
    Clock
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/hooks/useThemeContext";
import Image from "next/image";
import { Student } from "@/utils/interface/studentInterface";
import { useCreateStudentMutation, useUpdateStudentMutation } from "@/redux/api/student/studentApi";
import { useAddThumbnailMutation } from "@/redux/features/file/fileApi";

interface AddEditStudentModalProps {
    studentData?: Student | null;
    isOpen: boolean;
    onClose: (refreshData?: boolean) => void;
}

const AddEditStudentModal: React.FC<AddEditStudentModalProps> = ({
    studentData,
    isOpen,
    onClose
}) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'education' | 'course' | 'documents'>('personal');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<Partial<Student>>({
        // Personal Information
        fullName: "",
        fatherName: "",
        motherName: "",
        dateOfBirth: "",
        gender: "male",

        // Contact Information
        phoneNo: "",
        alternativePhoneNo: "",
        email: "",

        // NID Information
        nidNo: "",
        nidFrontImage: "",
        nidBackImage: "",

        // Profile Image
        profileImage: "",

        // Address Information
        presentAddress: "",
        permanentAddress: "",
        district: "",
        upazila: "",
        postOffice: "",
        postalCode: "",

        // Educational Information
        educationLevel: "ssc",
        institutionName: "",
        passingYear: undefined,

        // Professional Information
        occupation: "",
        companyName: "",
        designation: "",

        // Course Related Information
        enrolledCourseId: undefined,
        enrollmentDate: new Date().toISOString().split('T')[0],
        totalFee: 0,
        paidAmount: 0,

        // System Fields
        status: "active",
        notes: "",
    });

    const [uploadedFiles, setUploadedFiles] = useState<{
        profileImage?: string;
        nidFront?: string;
        nidBack?: string;
    }>({});

    const [isUploading, setIsUploading] = useState({
        profileImage: false,
        nidFront: false,
        nidBack: false,
    });

    const [createStudent] = useCreateStudentMutation();
    const [updateStudent] = useUpdateStudentMutation();
    const [addThumbnail] = useAddThumbnailMutation();

    useEffect(() => {
        if (studentData) {
            setFormData({
                ...studentData,
                dateOfBirth: studentData.dateOfBirth ? studentData.dateOfBirth.split('T')[0] : "",
                enrollmentDate: studentData.enrollmentDate ? studentData.enrollmentDate.split('T')[0] : new Date().toISOString().split('T')[0],
            });
            setUploadedFiles({
                profileImage: studentData.profileImage || "",
                nidFront: studentData.nidFrontImage || "",
                nidBack: studentData.nidBackImage || "",
            });
        } else {
            resetForm();
        }
    }, [studentData]);

    const resetForm = () => {
        setFormData({
            fullName: "",
            fatherName: "",
            motherName: "",
            dateOfBirth: "",
            gender: "male",
            phoneNo: "",
            alternativePhoneNo: "",
            email: "",
            nidNo: "",
            nidFrontImage: "",
            nidBackImage: "",
            profileImage: "",
            presentAddress: "",
            permanentAddress: "",
            district: "",
            upazila: "",
            postOffice: "",
            postalCode: "",
            educationLevel: "ssc",
            institutionName: "",
            passingYear: undefined,
            occupation: "",
            companyName: "",
            designation: "",
            enrolledCourseId: undefined,
            enrollmentDate: new Date().toISOString().split('T')[0],
            totalFee: 0,
            paidAmount: 0,
            status: "active",
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

    const handleFileUpload = async (file: File, type: 'profileImage' | 'nidFront' | 'nidBack') => {
        try {
            setIsUploading(prev => ({ ...prev, [type]: true }));

            const formData = new FormData();
            formData.append('image', file);

            const response = await addThumbnail(formData).unwrap();

            if (response.success && response.data && response.data[0]) {
                const fileUrl = response.data[0];

                setUploadedFiles(prev => ({ ...prev, [type]: fileUrl }));

                if (type === 'profileImage') {
                    setFormData(prev => ({ ...prev, profileImage: fileUrl }));
                } else if (type === 'nidFront') {
                    setFormData(prev => ({ ...prev, nidFrontImage: fileUrl }));
                } else if (type === 'nidBack') {
                    setFormData(prev => ({ ...prev, nidBackImage: fileUrl }));
                }

                toast.success(`${type === 'profileImage' ? 'Profile Photo' : 'NID Document'} uploaded successfully!`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed. Please try again.');
        } finally {
            setIsUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'profileImage' | 'nidFront' | 'nidBack') => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            handleFileUpload(file, type);
        }
    };

    const handleDrop = (e: React.DragEvent, type: 'profileImage' | 'nidFront' | 'nidBack') => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            handleFileUpload(file, type);
        }
    };

    const removeFile = (type: 'profileImage' | 'nidFront' | 'nidBack') => {
        setUploadedFiles(prev => ({ ...prev, [type]: undefined }));
        if (type === 'profileImage') {
            setFormData(prev => ({ ...prev, profileImage: '' }));
        } else if (type === 'nidFront') {
            setFormData(prev => ({ ...prev, nidFrontImage: '' }));
        } else if (type === 'nidBack') {
            setFormData(prev => ({ ...prev, nidBackImage: '' }));
        }
    };

    const validateForm = () => {
        if (!formData.fullName?.trim()) {
            toast.error("Student's full name is required");
            return false;
        }
        if (!formData.phoneNo?.trim()) {
            toast.error("Phone number is required");
            return false;
        }
        if (!formData.email?.trim()) {
            toast.error("Email address is required");
            return false;
        }
        if (!formData.presentAddress?.trim()) {
            toast.error("Present address is required");
            return false;
        }
        if (!formData.district?.trim()) {
            toast.error("District is required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        const phoneRegex = /^(?:\+88|01)?\d{11}$/;
        if (formData.phoneNo && !phoneRegex.test(formData.phoneNo.replace(/\D/g, ''))) {
            toast.error("Please enter a valid Bangladeshi phone number");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Calculate due amount and payment status
        const totalFee = parseFloat(formData.totalFee?.toString() || "0");
        const paidAmount = parseFloat(formData.paidAmount?.toString() || "0");
        const dueAmount = totalFee - paidAmount;
        const paymentStatus: "paid" | "partial" | "pending" = dueAmount <= 0 ? "paid" : (paidAmount > 0 ? "partial" : "pending");

        const submitData = {
            ...formData,
            dueAmount,
            paymentStatus,
            lastPaymentDate: paidAmount > 0 ? new Date().toISOString() : undefined,
        };

        setIsLoading(true);

        try {
            if (studentData?.id) {
                await updateStudent({
                    id: studentData.id,
                    data: submitData
                }).unwrap();
                toast.success("Student updated successfully!");
            } else {
                await createStudent(submitData).unwrap();
                toast.success("Student registered successfully!");
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
        { id: 'personal' as const, label: 'Personal Info', icon: User },
        { id: 'contact' as const, label: 'Contact & Address', icon: MapPin },
        { id: 'education' as const, label: 'Education & Profession', icon: GraduationCap },
        { id: 'course' as const, label: 'Course & Payment', icon: BookOpen },
        { id: 'documents' as const, label: 'Documents', icon: FileText },
    ];

    const FileUploadArea = ({
        type,
        label,
        accept = "image/*",
        maxSize = "5MB"
    }: {
        type: 'profileImage' | 'nidFront' | 'nidBack',
        label: string,
        accept?: string,
        maxSize?: string
    }) => {
        const getFieldValue = () => {
            if (type === 'profileImage') return uploadedFiles.profileImage;
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
                    className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${fileUrl
                            ? "border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/10"
                            : "border-gray-300 hover:border-orange-400 dark:border-gray-700 dark:hover:border-orange-500"
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
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
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
                                <label className="text-orange-500 hover:text-orange-600 cursor-pointer">
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
                                Support: JPG, PNG (Max {maxSize})
                            </p>
                        </div>
                    )}
                    {isUploading[type] && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center rounded-lg">
                            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
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
                                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                                        <GraduationCap className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {studentData ? "Edit Student" : "Add New Student"}
                                        </h2>
                                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {studentData
                                                ? `Edit details for ${studentData.fullName}`
                                                : "Register a new student to the system"}
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onClose(false)}
                                    className={`p-2 rounded-full transition-colors duration-300 ${theme === 'dark'
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
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                                                ? theme === 'dark'
                                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                                    : 'bg-orange-500 text-white'
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
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
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
                                            <div className="md:col-span-2">
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Full Name *
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., Md. Rahim Uddin"
                                                        className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                            } border`}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Father&apos;s Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fatherName"
                                                    value={formData.fatherName || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="Father's name"
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Mother&apos;s Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="motherName"
                                                    value={formData.motherName || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="Mother's name"
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Date of Birth
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <input
                                                        type="date"
                                                        name="dateOfBirth"
                                                        value={formData.dateOfBirth || ''}
                                                        onChange={handleInputChange}
                                                        className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                            ? 'bg-gray-700 border-gray-600 text-white'
                                                            : 'bg-white border-gray-300 text-gray-900'
                                                            } border`}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Gender
                                                </label>
                                                <div className="flex gap-4">
                                                    {['male', 'female', 'other'].map((gender) => (
                                                        <label key={gender} className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                name="gender"
                                                                value={gender}
                                                                checked={formData.gender === gender}
                                                                onChange={handleInputChange}
                                                                className="text-orange-500 focus:ring-orange-500"
                                                            />
                                                            <span className={`text-sm capitalize ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                {gender}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    NID Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nidNo"
                                                    value={formData.nidNo || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="National ID Number"
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>
                                        </div>

                                        {/* Profile Photo Upload */}
                                        <FileUploadArea type="profileImage" label="Profile Photo" />
                                    </motion.div>
                                )}

                                {/* Contact & Address Tab */}
                                {activeTab === 'contact' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Phone Number *
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <input
                                                        type="tel"
                                                        name="phoneNo"
                                                        value={formData.phoneNo}
                                                        onChange={handleInputChange}
                                                        placeholder="017xxxxxxxx"
                                                        className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                            } border`}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Alternative Phone
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <input
                                                        type="tel"
                                                        name="alternativePhoneNo"
                                                        value={formData.alternativePhoneNo || ''}
                                                        onChange={handleInputChange}
                                                        placeholder="018xxxxxxxx"
                                                        className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                            } border`}
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Email Address *
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="student@example.com"
                                                        className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                            } border`}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Present Address *
                                                </label>
                                                <div className="relative">
                                                    <Home className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                                    <textarea
                                                        name="presentAddress"
                                                        value={formData.presentAddress || ''}
                                                        onChange={handleInputChange}
                                                        rows={2}
                                                        placeholder="House #, Road #, Area, City"
                                                        className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 resize-none ${theme === 'dark'
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                            } border`}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    District *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="district"
                                                    value={formData.district || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., Dhaka, Chittagong"
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Upazila / Thana
                                                </label>
                                                <input
                                                    type="text"
                                                    name="upazila"
                                                    value={formData.upazila || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="Upazila or Thana"
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Post Office
                                                </label>
                                                <input
                                                    type="text"
                                                    name="postOffice"
                                                    value={formData.postOffice || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="Post office name"
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    name="postalCode"
                                                    value={formData.postalCode || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="Postal code"
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Permanent Address (Optional)
                                                </label>
                                                <textarea
                                                    name="permanentAddress"
                                                    value={formData.permanentAddress || ''}
                                                    onChange={handleInputChange}
                                                    rows={2}
                                                    placeholder="If different from present address"
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 resize-none ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Education & Profession Tab */}
                                {activeTab === 'education' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Education Level
                                                </label>
                                                <select
                                                    name="educationLevel"
                                                    value={formData.educationLevel}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white'
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                        } border`}
                                                >
                                                    <option value="ssc">SSC / Equivalent</option>
                                                    <option value="hsc">HSC / Equivalent</option>
                                                    <option value="diploma">Diploma</option>
                                                    <option value="bachelor">Bachelor&apos;s Degree</option>
                                                    <option value="masters">Master&apos;s Degree</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Institution Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="institutionName"
                                                    value={formData.institutionName || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="School / College / University name"
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Passing Year
                                                </label>
                                                <input
                                                    type="number"
                                                    name="passingYear"
                                                    value={formData.passingYear || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., 2020"
                                                    min="1950"
                                                    max="2030"
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                                    <div className="flex items-start gap-3">
                                                        <Briefcase className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-800'}`}>
                                                                Professional Information (Optional)
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                        Occupation
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="occupation"
                                                                        value={formData.occupation || ''}
                                                                        onChange={handleInputChange}
                                                                        placeholder="e.g., Student, Service, Business"
                                                                        className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                                            } border`}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                        Company Name
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="companyName"
                                                                        value={formData.companyName || ''}
                                                                        onChange={handleInputChange}
                                                                        placeholder="Company / Organization"
                                                                        className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                                            } border`}
                                                                    />
                                                                </div>
                                                                <div className="md:col-span-2">
                                                                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                        Designation
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="designation"
                                                                        value={formData.designation || ''}
                                                                        onChange={handleInputChange}
                                                                        placeholder="Job title / Designation"
                                                                        className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === 'dark'
                                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                                            } border`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Course & Payment Tab */}
                                {activeTab === 'course' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'}`}>
                                                    <div className="flex items-start gap-3">
                                                        <BookOpen className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-800'}`}>
                                                                Course Enrollment
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                        Course ID
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        name="enrolledCourseId"
                                                                        value={formData.enrolledCourseId || ''}
                                                                        onChange={handleInputChange}
                                                                        placeholder="Enter course ID"
                                                                        className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                                            } border`}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                        Enrollment Date
                                                                    </label>
                                                                    <div className="relative">
                                                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                                        <input
                                                                            type="date"
                                                                            name="enrollmentDate"
                                                                            value={formData.enrollmentDate?.split('T')[0] || ''}
                                                                            onChange={handleInputChange}
                                                                            className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${theme === 'dark'
                                                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                                                : 'bg-white border-gray-300 text-gray-900'
                                                                                } border`}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                                                    <div className="flex items-start gap-3">
                                                        <DollarSign className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <h4 className={`font-medium mb-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>
                                                                Payment Information
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div>
                                                                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                        Total Fee (৳)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        name="totalFee"
                                                                        value={formData.totalFee || ''}
                                                                        onChange={handleInputChange}
                                                                        placeholder="0.00"
                                                                        min="0"
                                                                        step="0.01"
                                                                        className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 ${theme === 'dark'
                                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                                            } border`}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                        Paid Amount (৳)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        name="paidAmount"
                                                                        value={formData.paidAmount || ''}
                                                                        onChange={handleInputChange}
                                                                        placeholder="0.00"
                                                                        min="0"
                                                                        step="0.01"
                                                                        className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 ${theme === 'dark'
                                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                                            } border`}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                        Status
                                                                    </label>
                                                                    <select
                                                                        name="status"
                                                                        value={formData.status}
                                                                        onChange={handleInputChange}
                                                                        className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 ${theme === 'dark'
                                                                            ? 'bg-gray-700 border-gray-600 text-white'
                                                                            : 'bg-white border-gray-300 text-gray-900'
                                                                            } border`}
                                                                    >
                                                                        <option value="active">Active</option>
                                                                        <option value="inactive">Inactive</option>
                                                                        <option value="suspended">Suspended</option>
                                                                        <option value="completed">Completed</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Notes
                                                </label>
                                                <textarea
                                                    name="notes"
                                                    value={formData.notes || ''}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    placeholder="Any additional notes about this student..."
                                                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 resize-none ${theme === 'dark'
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } border`}
                                                />
                                            </div>
                                        </div>
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* NID Front Upload */}
                                            <FileUploadArea type="nidFront" label="NID Front Side" />

                                            {/* NID Back Upload */}
                                            <FileUploadArea type="nidBack" label="NID Back Side" />
                                        </div>

                                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className={`font-medium mb-1 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'}`}>
                                                        Document Guidelines
                                                    </h4>
                                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        Upload clear and readable images of NID documents. Accepted formats: JPG, PNG. Maximum file size: 5MB per file.
                                                        These documents will be stored securely and used for verification purposes.
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
                                        onClick={() => onClose(false)}
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
                                            ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30'
                                            : 'bg-orange-500 text-white hover:bg-orange-600'
                                            }`}
                                        disabled={isLoading}
                                    >
                                        <Save size={18} />
                                        {isLoading ? "Saving..." : (studentData ? "Update Student" : "Register Student")}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddEditStudentModal;