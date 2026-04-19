// components/students/StudentDetailsModal.tsx
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
    Calendar,
    DollarSign,
    Star,
    Edit,
    Clock,
    CreditCard,
    Hash,
    Briefcase,
    GraduationCap,
    FileImage,
    Award,
    CheckCircle,
    XCircle,
    AlertCircle,
    Home,
    BookOpen
} from "lucide-react";
import { useTheme } from "@/hooks/useThemeContext";
import Image from "next/image";
import { Student } from "@/utils/interface/studentInterface";

interface StudentDetailsModalProps {
    isOpen: boolean;
    student: Student;
    onClose: () => void;
    onEdit: (student: Student) => void;
    onStatusChange: (student: Student, status: string) => void;
    onAttendanceMark: (student: Student) => void;
    onIssueCertificate: (student: Student) => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
    isOpen,
    student,
    onClose,
    onEdit,
    onStatusChange,
    onAttendanceMark,
    onIssueCertificate
}) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'overview' | 'education' | 'documents' | 'payment'>('overview');
    const [showImageModal, setShowImageModal] = useState<{ isOpen: boolean; imageUrl: string; title: string }>({
        isOpen: false,
        imageUrl: '',
        title: ''
    });

    if (!isOpen || !student) return null;

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'inactive': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-500/20 text-green-400';
            case 'partial': return 'bg-yellow-500/20 text-yellow-400';
            case 'pending': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getAttendanceColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-500';
        if (percentage >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'documents', label: 'Documents', icon: FileImage },
        { id: 'payment', label: 'Payment', icon: DollarSign },
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
                                {student.profileImage ? (
                                    <div 
                                        className={`w-16 h-16 rounded-full overflow-hidden cursor-pointer transition-transform hover:scale-105 ${theme === 'dark' ? 'border-2 border-orange-500/30' : 'border-2 border-orange-500'
                                        }`}
                                        onClick={() => setShowImageModal({ isOpen: true, imageUrl: student.profileImage!, title: `${student.fullName}'s Photo` })}
                                    >
                                        <Image
                                            src={student.profileImage}
                                            alt={student.fullName}
                                            width={64}
                                            height={64}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-colors duration-300 ${theme === 'dark'
                                        ? 'bg-orange-500/20 border-2 border-orange-500/30'
                                        : 'bg-orange-50 border-2 border-orange-500'
                                        }`}>
                                        <GraduationCap className="w-8 h-8 text-orange-500" />
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {student.fullName}
                                        </h2>
                                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(student.status)}`}>
                                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                        </span>
                                        {student.certificateIssued && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                                <Award size={12} className="inline mr-1" />
                                                Certified
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Student ID: <span className="font-mono font-semibold">{student.studentId}</span>
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1">
                                            <Phone size={14} className="text-gray-400" />
                                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {student.phoneNo}
                                            </span>
                                        </div>
                                        {student.email && (
                                            <div className="flex items-center gap-1">
                                                <Mail size={14} className="text-gray-400" />
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {student.email}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onEdit(student)}
                                    className={`p-2 hover:cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                                        ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                                        : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                        }`}
                                    title="Edit Student"
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
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Clock className="w-5 h-5 text-blue-500" />
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Attendance
                                            </span>
                                        </div>
                                        <p className={`text-2xl font-bold ${getAttendanceColor(student.attendancePercentage)}`}>
                                            {student.attendancePercentage}%
                                        </p>
                                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {student.attendedClasses}/{student.totalClasses} classes
                                        </p>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <DollarSign className="w-5 h-5 text-green-500" />
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Total Fee
                                            </span>
                                        </div>
                                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            ৳{student.totalFee.toLocaleString()}
                                        </p>
                                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            Paid: ৳{student.paidAmount.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <CreditCard className="w-5 h-5 text-purple-500" />
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Payment Status
                                            </span>
                                        </div>
                                        <span className={`text-sm px-2 py-1 rounded-full ${getPaymentStatusColor(student.paymentStatus)}`}>
                                            {student.paymentStatus.toUpperCase()}
                                        </span>
                                        {student.dueAmount > 0 && (
                                            <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                                                Due: ৳{student.dueAmount.toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Calendar className="w-5 h-5 text-orange-500" />
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Enrollment
                                            </span>
                                        </div>
                                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {student.enrollmentDateFormatted || formatDate(student.enrollmentDate || student.createdAt)}
                                        </p>
                                        {student.courseCompletionDate && (
                                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                Completed: {formatDate(student.courseCompletionDate)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Personal Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <User size={16} />
                                            Personal Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Full Name:</span>
                                                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {student.fullName}
                                                </span>
                                            </div>
                                            {student.fatherName && (
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Father&apos;s Name:</span>
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {student.fatherName}
                                                    </span>
                                                </div>
                                            )}
                                            {student.motherName && (
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Mother&apos;s Name:</span>
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {student.motherName}
                                                    </span>
                                                </div>
                                            )}
                                            {student.dateOfBirth && (
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Date of Birth:</span>
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {formatDate(student.dateOfBirth)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Gender:</span>
                                                <span className={`text-sm capitalize ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {student.gender}
                                                </span>
                                            </div>
                                            {student.nidNo && (
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>NID Number:</span>
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {student.nidNo}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Home size={16} />
                                            Address
                                        </h3>
                                        <div className="space-y-2">
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Present Address:</span>
                                                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {student.presentAddress}
                                                </p>
                                            </div>
                                            {student.permanentAddress && student.permanentAddress !== student.presentAddress && (
                                                <div className="mt-2">
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Permanent Address:</span>
                                                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {student.permanentAddress}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="flex justify-between mt-2">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>District:</span>
                                                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {student.district}
                                                </span>
                                            </div>
                                            {student.upazila && (
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Upazila:</span>
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {student.upazila}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact & Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Phone size={16} />
                                            Contact Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Primary Phone:</span>
                                                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {student.phoneNo}
                                                </span>
                                            </div>
                                            {student.alternativePhoneNo && (
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Alternative Phone:</span>
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {student.alternativePhoneNo}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email:</span>
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {student.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Calendar size={16} />
                                            Important Dates
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Enrollment Date:</span>
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {formatDate(student.enrollmentDate || student.createdAt)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Last Login:</span>
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {student.lastLoginAt ? formatDate(student.lastLoginAt) : "Never"}
                                                </span>
                                            </div>
                                            {student.certificateIssuedDate && (
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Certificate Issued:</span>
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {formatDate(student.certificateIssuedDate)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {student.notes && (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <FileText size={16} />
                                            Notes
                                        </h3>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {student.notes}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Education Tab */}
                        {activeTab === 'education' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <GraduationCap size={16} />
                                            Educational Background
                                        </h3>
                                        <div className="space-y-3">
                                            {student.educationLevel && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Education Level</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {student.educationLevel.toUpperCase()}
                                                    </p>
                                                </div>
                                            )}
                                            {student.institutionName && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Institution</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {student.institutionName}
                                                    </p>
                                                </div>
                                            )}
                                            {student.passingYear && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Passing Year</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {student.passingYear}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <Briefcase size={16} />
                                            Professional Information
                                        </h3>
                                        <div className="space-y-3">
                                            {student.occupation && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Occupation</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {student.occupation}
                                                    </p>
                                                </div>
                                            )}
                                            {student.companyName && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Company</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {student.companyName}
                                                    </p>
                                                </div>
                                            )}
                                            {student.designation && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Designation</span>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {student.designation}
                                                    </p>
                                                </div>
                                            )}
                                            {!student.occupation && !student.companyName && !student.designation && (
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    No professional information available
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Course Info */}
                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <BookOpen size={16} />
                                        Course Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {student.enrolledCourseId && (
                                            <div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Course ID</span>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {student.enrolledCourseId}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Attendance</span>
                                            <div className="mt-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-sm font-medium ${getAttendanceColor(student.attendancePercentage)}`}>
                                                        {student.attendancePercentage}%
                                                    </span>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        ({student.attendedClasses}/{student.totalClasses} classes)
                                                    </span>
                                                </div>
                                                <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                                                            student.attendancePercentage >= 80
                                                                ? 'bg-green-500'
                                                                : student.attendancePercentage >= 60
                                                                    ? 'bg-yellow-500'
                                                                    : 'bg-red-500'
                                                        }`}
                                                        style={{ width: `${student.attendancePercentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Certificate Section */}
                                {!student.certificateIssued ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onIssueCertificate(student)}
                                        className={`w-full p-4 rounded-lg border-2 border-dashed transition-all duration-300 flex items-center justify-center gap-3 ${
                                            theme === 'dark'
                                                ? 'border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 text-orange-400'
                                                : 'border-orange-300 bg-orange-50/50 hover:bg-orange-100 text-orange-600'
                                        }`}
                                    >
                                        <Award size={20} />
                                        <span className="font-medium">Issue Certificate</span>
                                    </motion.button>
                                ) : (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <div>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>
                                                    Certificate Issued
                                                </p>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    Certificate Number: {student.certificateNumber}
                                                </p>
                                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    Issued on: {formatDate(student.certificateIssuedDate || '')}
                                                </p>
                                            </div>
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
                                {student.nidFrontImage || student.nidBackImage ? (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <FileImage size={16} />
                                            NID Documents
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {student.nidFrontImage && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>NID Front Side</span>
                                                    <div 
                                                        className="mt-2 cursor-pointer group relative w-48 h-48 rounded-lg overflow-hidden border-2 border-orange-500/30"
                                                        onClick={() => setShowImageModal({ isOpen: true, imageUrl: student.nidFrontImage!, title: "NID Front Side" })}
                                                    >
                                                        <Image
                                                            src={student.nidFrontImage}
                                                            alt="NID Front"
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-110"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {student.nidBackImage && (
                                                <div>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>NID Back Side</span>
                                                    <div 
                                                        className="mt-2 cursor-pointer group relative w-48 h-48 rounded-lg overflow-hidden border-2 border-orange-500/30"
                                                        onClick={() => setShowImageModal({ isOpen: true, imageUrl: student.nidBackImage!, title: "NID Back Side" })}
                                                    >
                                                        <Image
                                                            src={student.nidBackImage}
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
                                        <p>No documents available for this student</p>
                                    </div>
                                )}
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            ৳{student.totalFee.toLocaleString()}
                                        </p>
                                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Total Fee
                                        </p>
                                    </div>
                                    <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <p className={`text-3xl font-bold text-green-500`}>
                                            ৳{student.paidAmount.toLocaleString()}
                                        </p>
                                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Paid Amount
                                        </p>
                                    </div>
                                    <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <p className={`text-3xl font-bold ${student.dueAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            ৳{student.dueAmount.toLocaleString()}
                                        </p>
                                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Due Amount
                                        </p>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Payment Progress
                                        </span>
                                        <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {((student.paidAmount / student.totalFee) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                                            style={{ width: `${(student.paidAmount / student.totalFee) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {student.lastPaymentDate && (
                                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Last Payment: {formatDate(student.lastPaymentDate)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className={`font-medium mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-800'}`}>
                                                Payment Information
                                            </h4>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Payment status: <span className={`font-semibold ${getPaymentStatusColor(student.paymentStatus)}`}>
                                                    {student.paymentStatus.toUpperCase()}
                                                </span>
                                                {student.dueAmount > 0 && (
                                                    <span className="ml-2">
                                                        Due amount of ৳{student.dueAmount.toLocaleString()} needs to be collected.
                                                    </span>
                                                )}
                                                {student.paymentStatus === 'paid' && (
                                                    <span className="ml-2">
                                                        Full payment received. Student is eligible for certificate.
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
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
                                    onChange={(e) => onStatusChange(student, e.target.value)}
                                    value={student.status}
                                    className={`px-3 py-2 rounded-lg text-sm border ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onAttendanceMark(student)}
                                    className={`px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 ${theme === 'dark'
                                        ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30'
                                        : 'bg-purple-500 text-white hover:bg-purple-600'
                                        }`}
                                >
                                    <Clock size={16} />
                                    Mark Attendance
                                </motion.button>
                                {!student.certificateIssued && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onIssueCertificate(student)}
                                        className={`px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 ${theme === 'dark'
                                            ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30'
                                            : 'bg-orange-500 text-white hover:bg-orange-600'
                                            }`}
                                    >
                                        <Award size={16} />
                                        Issue Certificate
                                    </motion.button>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onEdit(student)}
                                    className={`px-4 py-2 hover:cursor-pointer rounded-lg transition-colors duration-300 flex items-center gap-2 ${theme === 'dark'
                                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                >
                                    <Edit size={16} />
                                    Edit Student
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

export default StudentDetailsModal;