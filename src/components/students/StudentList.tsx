// components/students/StudentList.tsx
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Plus,
    Phone,
    Mail,
    Eye,
    Edit,
    Trash2,
    ChevronRight,
    ChevronLeft,
    DollarSign,
    XCircle,
    Award,
    Clock,
    CheckCircle,
    AlertCircle,
    GraduationCap,
    MessageSquare,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/hooks/useThemeContext';
import { Student } from '@/utils/interface/studentInterface';
import { useDeleteStudentMutation, useGetAllStudentsQuery, useIssueCertificateMutation, useUpdateAttendanceMutation, useUpdateStudentStatusMutation } from '@/redux/api/student/studentApi';
import AddEditStudentModal from './AddEditStudentModal';
import StudentDetailsModal from './StudentDetailsModal';
import StudentSMSModal from './StudentSMSModal';

const StudentList: React.FC = () => {
    const { theme } = useTheme();
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        district: "",
        paymentStatus: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; student: Student | null }>({ isOpen: false, student: null });
    const [attendanceModal, setAttendanceModal] = useState<{ isOpen: boolean; student: Student | null; attended: boolean }>({ isOpen: false, student: null, attended: true });
    const [certificateModal, setCertificateModal] = useState<{ isOpen: boolean; student: Student | null; certificateNumber: string }>({ isOpen: false, student: null, certificateNumber: '' });
    const [smsModal, setSmsModal] = useState<{ isOpen: boolean; student: Student | null }>({ isOpen: false, student: null });

    // Memoize query params to prevent infinite re-renders
    const queryParams = useMemo(() => {
        const params: {
            page: number;
            limit: number;
            search?: string;
            status?: string;
            district?: string;
            paymentStatus?: string;
        } = {
            page: currentPage,
            limit: itemsPerPage,
        };
        
        if (filters.search) params.search = filters.search;
        if (filters.status) params.status = filters.status;
        if (filters.district) params.district = filters.district;
        if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
        
        return params;
    }, [currentPage, filters.search, filters.status, filters.district, filters.paymentStatus]);

    const {
        data: studentsData,
        isLoading,
        isError,
        refetch
    } = useGetAllStudentsQuery(queryParams);

    const [deleteStudent] = useDeleteStudentMutation();
    const [updateStudentStatus] = useUpdateStudentStatusMutation();
    const [updateAttendance] = useUpdateAttendanceMutation();
    const [issueCertificate] = useIssueCertificateMutation();

    const students = studentsData?.data || [];
    const pagination = studentsData?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    };

    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({ search: "", status: "", district: "", paymentStatus: "" });
        setCurrentPage(1);
    }, []);

    const handleView = useCallback((student: Student) => {
        setSelectedStudent(student);
    }, []);

    const handleEdit = useCallback((student: Student) => {
        setStudentToEdit(student);
        setIsAddModalOpen(true);
    }, []);

    const handleDeleteClick = useCallback((student: Student) => {
        setDeleteModal({ isOpen: true, student });
    }, []);

    const handleDelete = useCallback(async () => {
        if (!deleteModal.student) return;

        try {
            await deleteStudent(deleteModal.student.id).unwrap();
            toast.success('Student deleted successfully');
            setDeleteModal({ isOpen: false, student: null });
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to delete student');
        }
    }, [deleteModal.student, deleteStudent, refetch]);

    const handleStatusChange = useCallback(async (student: Student, newStatus: string) => {
        try {
            await updateStudentStatus({
                id: student.id,
                status: newStatus
            }).unwrap();
            toast.success(`Student status updated to ${newStatus}`);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update status');
        }
    }, [updateStudentStatus, refetch]);

    const handleAttendance = useCallback(async () => {
        if (!attendanceModal.student) return;
        try {
            await updateAttendance({
                id: attendanceModal.student.id,
                attended: attendanceModal.attended
            }).unwrap();
            toast.success(`Attendance marked as ${attendanceModal.attended ? 'Present' : 'Absent'}`);
            setAttendanceModal({ isOpen: false, student: null, attended: true });
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update attendance');
        }
    }, [attendanceModal.student, attendanceModal.attended, updateAttendance, refetch]);

    const handleIssueCertificate = useCallback(async () => {
        if (!certificateModal.student) return;
        try {
            await issueCertificate({
                id: certificateModal.student.id,
                certificateNumber: certificateModal.certificateNumber
            }).unwrap();
            toast.success('Certificate issued successfully!');
            setCertificateModal({ isOpen: false, student: null, certificateNumber: '' });
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to issue certificate');
        }
    }, [certificateModal.student, certificateModal.certificateNumber, issueCertificate, refetch]);

    const handlePhoneClick = useCallback((phoneNumber: string) => {
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        }
    }, []);

    const handleOpenSMSModal = useCallback((student: Student) => {
        setSmsModal({ isOpen: true, student });
    }, []);

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'inactive': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    }, []);

    const getPaymentStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-500/20 text-green-400';
            case 'partial': return 'bg-yellow-500/20 text-yellow-400';
            case 'pending': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    }, []);

    const getAttendanceColor = useCallback((percentage: number) => {
        if (percentage >= 80) return 'text-green-500';
        if (percentage >= 60) return 'text-yellow-500';
        return 'text-red-500';
    }, []);

    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }, []);

    // Error handling with retry
    if (isError) {
        return (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Failed to load students</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => refetch()}
                    className={`mt-4 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto ${theme === 'dark'
                        ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                >
                    Retry
                </motion.button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
            >
                <div>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        All Students
                    </h2>
                    <p className={`mt-1 text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage your students and their information
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setStudentToEdit(null);
                            setIsAddModalOpen(true);
                        }}
                        className={`px-5 py-2.5 w-full md:w-auto flex justify-center hover:cursor-pointer rounded-xl transition-all duration-300 items-center gap-2 group ${theme === 'dark'
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/20'
                            : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/30'
                            }`}
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        Add New Student
                    </motion.button>
                </div>
            </motion.div>

            {/* Filters Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className={`rounded-2xl py-6 px-2 md:px-4 lg:px-6 shadow-xl transition-colors duration-300 ${theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                    : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                    } border`}
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className={`text-lg font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        <Filter size={20} className="text-orange-500" />
                        Filter Students
                    </h3>
                    {(filters.search || filters.status || filters.district || filters.paymentStatus) && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={clearFilters}
                            className={`text-sm px-3 py-1 rounded-lg flex items-center gap-1 ${theme === 'dark'
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                                : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                                }`}
                        >
                            <XCircle size={14} />
                            Clear Filters
                        </motion.button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Search Students
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    placeholder="Name, ID, Phone, Email..."
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-orange-500'
                                        } border`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Status
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative">
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange("status", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 appearance-none ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-orange-500'
                                        } border`}
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            District
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={filters.district}
                                    onChange={(e) => handleFilterChange("district", e.target.value)}
                                    placeholder="Dhaka, Chittagong..."
                                    className={`w-full px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-orange-500'
                                        } border`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Payment Status
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative">
                                <select
                                    value={filters.paymentStatus}
                                    onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 appearance-none ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-orange-500'
                                        } border`}
                                >
                                    <option value="">All Payments</option>
                                    <option value="paid">Paid</option>
                                    <option value="partial">Partial</option>
                                    <option value="pending">Pending</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Students Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="space-y-6"
            >
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className={`rounded-xl p-4 animate-pulse ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'}`}
                            >
                                <div className="grid grid-cols-6 gap-4">
                                    <div className={`h-4 rounded-lg col-span-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                    <div className={`h-4 rounded-lg col-span-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                    <div className={`h-4 rounded-lg col-span-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                    <div className={`h-4 rounded-lg col-span-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                    <div className={`h-4 rounded-lg col-span-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : students.length === 0 ? (
                    <div className={`text-center py-16 rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-white'
                        }`}>
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className={`absolute inset-0 rounded-full ${theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-100'}`}></div>
                            <GraduationCap className="absolute inset-0 m-auto w-12 h-12 text-orange-500" />
                        </div>
                        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            No Students Found
                        </h3>
                        <p className={`mb-6 max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Add your first student to start tracking enrollments and progress.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsAddModalOpen(true)}
                            className={`px-6 cursor-pointer py-3 rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto group ${theme === 'dark'
                                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/20'
                                : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/30'
                                }`}
                        >
                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            Add Your First Student
                        </motion.button>
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className={`overflow-x-auto rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                            <table className="w-full">
                                <thead className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}>
                                    <tr>
                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Student Info</th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Contact</th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Course & Payment</th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Attendance</th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {students.map((student: Student, index: number) => (
                                        <motion.tr
                                            key={student.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className={`hover:bg-opacity-50 transition-colors ${theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
                                        >
                                            {/* Student ID */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-100'}`}>
                                                        <GraduationCap className="w-4 h-4 text-orange-500" />
                                                    </div>
                                                    <span className={`font-mono text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {student.studentId}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Student Info */}
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                        {student.fullName}
                                                    </p>
                                                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {student.district}
                                                    </p>
                                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        Enrolled: {student.enrollmentDateFormatted || formatDate(student.enrollmentDate || student.createdAt)}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="px-4 py-4">
                                                <div className="space-y-1">
                                                    <button
                                                        onClick={() => handlePhoneClick(student.phoneNo)}
                                                        className="flex items-center gap-2 text-sm hover:text-orange-500 transition-colors"
                                                    >
                                                        <Phone size={14} className="text-gray-400" />
                                                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                                            {student.phoneNo}
                                                        </span>
                                                    </button>
                                                    {student.email && (
                                                        <div className="flex items-center gap-2">
                                                            <Mail size={14} className="text-gray-400" />
                                                            <span className={`text-xs truncate max-w-[150px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {student.email}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Course & Payment */}
                                            <td className="px-4 py-4">
                                                <div className="space-y-1">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentStatusColor(student.paymentStatus)}`}>
                                                        {student.paymentStatus.toUpperCase()}
                                                    </span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <DollarSign size={12} className="text-gray-400" />
                                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            ৳{student.paidAmount.toLocaleString()} / ৳{student.totalFee.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {student.dueAmount > 0 && (
                                                        <p className={`text-xs ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                                                            Due: ৳{student.dueAmount.toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Attendance */}
                                            <td className="px-4 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-gray-400" />
                                                        <span className={`text-sm font-medium ${getAttendanceColor(student.attendancePercentage)}`}>
                                                            {student.attendancePercentage}%
                                                        </span>
                                                    </div>
                                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        {student.attendedClasses}/{student.totalClasses} classes
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-4">
                                                <select
                                                    value={student.status}
                                                    onChange={(e) => handleStatusChange(student, e.target.value)}
                                                    className={`text-xs px-2 py-1 rounded-full border cursor-pointer ${getStatusColor(student.status)} ${theme === 'dark'
                                                        ? 'bg-gray-800'
                                                        : 'bg-white'
                                                        }`}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="suspended">Suspended</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                                {student.certificateIssued && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Award size={10} className="text-green-500" />
                                                        <span className="text-[10px] text-green-500">Certified</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleView(student)}
                                                        className={`p-1.5 rounded-lg transition-colors ${theme === 'dark'
                                                            ? 'hover:bg-gray-700 text-blue-400'
                                                            : 'hover:bg-gray-100 text-blue-600'
                                                            }`}
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEdit(student)}
                                                        className={`p-1.5 rounded-lg transition-colors ${theme === 'dark'
                                                            ? 'hover:bg-gray-700 text-green-400'
                                                            : 'hover:bg-gray-100 text-green-600'
                                                            }`}
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => setAttendanceModal({ isOpen: true, student, attended: true })}
                                                        className={`p-1.5 rounded-lg transition-colors ${theme === 'dark'
                                                            ? 'hover:bg-gray-700 text-purple-400'
                                                            : 'hover:bg-gray-100 text-purple-600'
                                                            }`}
                                                        title="Mark Attendance"
                                                    >
                                                        <Clock size={16} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => setCertificateModal({ isOpen: true, student, certificateNumber: '' })}
                                                        className={`p-1.5 rounded-lg transition-colors ${theme === 'dark'
                                                            ? 'hover:bg-gray-700 text-orange-400'
                                                            : 'hover:bg-gray-100 text-orange-600'
                                                            }`}
                                                        title="Issue Certificate"
                                                    >
                                                        <Award size={16} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleOpenSMSModal(student)}
                                                        className={`p-1.5 rounded-lg transition-colors ${theme === 'dark'
                                                            ? 'hover:bg-gray-700 text-blue-400'
                                                            : 'hover:bg-gray-100 text-blue-600'
                                                            }`}
                                                        title="Send SMS"
                                                    >
                                                        <MessageSquare size={16} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeleteClick(student)}
                                                        className={`p-1.5 rounded-lg transition-colors ${theme === 'dark'
                                                            ? 'hover:bg-gray-700 text-red-400'
                                                            : 'hover:bg-gray-100 text-red-600'
                                                            }`}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className={`rounded-2xl p-6 shadow-lg transition-colors duration-300 ${theme === 'dark'
                                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                                    : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                                    } border`}
                            >
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Showing {((pagination.currentPage - 1) * itemsPerPage) + 1} to {Math.min(pagination.currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} students
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className={`p-2 rounded-lg transition-all duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30'
                                                    } disabled:cursor-not-allowed`}
                                            >
                                                <ChevronLeft size={20} />
                                            </motion.button>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                    let pageNum;
                                                    if (pagination.totalPages <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage <= 3) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage >= pagination.totalPages - 2) {
                                                        pageNum = pagination.totalPages - 4 + i;
                                                    } else {
                                                        pageNum = currentPage - 2 + i;
                                                    }

                                                    return (
                                                        <motion.button
                                                            key={pageNum}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className={`w-10 h-10 rounded-lg transition-all duration-300 ${currentPage === pageNum
                                                                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                                                                : theme === 'dark'
                                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                                disabled={currentPage === pagination.totalPages}
                                                className={`p-2 rounded-lg transition-all duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30'
                                                    } disabled:cursor-not-allowed`}
                                            >
                                                <ChevronRight size={20} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </motion.div>

            {/* Modals - Keep all your modal code exactly as is */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddEditStudentModal
                        studentData={studentToEdit}
                        isOpen={isAddModalOpen}
                        onClose={(refreshData: boolean) => {
                            setIsAddModalOpen(false);
                            setStudentToEdit(null);
                            if (refreshData) {
                                refetch();
                            }
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedStudent && (
                    <StudentDetailsModal
                        isOpen={!!selectedStudent}
                        student={selectedStudent}
                        onClose={() => setSelectedStudent(null)}
                        onEdit={(student) => {
                            setSelectedStudent(null);
                            handleEdit(student);
                        }}
                        onStatusChange={handleStatusChange}
                        onAttendanceMark={(student) => {
                            setSelectedStudent(null);
                            setAttendanceModal({ isOpen: true, student, attended: true });
                        }}
                        onIssueCertificate={(student) => {
                            setSelectedStudent(null);
                            setCertificateModal({ isOpen: true, student, certificateNumber: '' });
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {smsModal.isOpen && smsModal.student && (
                    <StudentSMSModal
                        isOpen={smsModal.isOpen}
                        studentId={smsModal.student.id}
                        phoneNumber={smsModal.student.phoneNo}
                        studentName={smsModal.student.fullName}
                        onClose={() => setSmsModal({ isOpen: false, student: null })}
                        onSuccess={() => {
                            setSmsModal({ isOpen: false, student: null });
                            refetch();
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {attendanceModal.isOpen && attendanceModal.student && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={`rounded-2xl p-8 w-full max-w-md shadow-2xl ${theme === 'dark'
                                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                                } border`}
                        >
                            <div className="text-center">
                                <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 relative`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-30"></div>
                                    <div className={`relative z-10 flex items-center justify-center h-16 w-16 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                        }`}>
                                        <Clock className="h-8 w-8 text-purple-500" />
                                    </div>
                                </div>

                                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Mark Attendance
                                </h3>

                                <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Mark attendance for{' '}
                                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {attendanceModal.student.fullName}
                                    </span>
                                </p>

                                <div className="flex gap-4 mb-8">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setAttendanceModal(prev => ({ ...prev, attended: true }))}
                                        className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${attendanceModal.attended
                                            ? 'bg-green-500 text-white'
                                            : theme === 'dark'
                                                ? 'bg-gray-700 text-gray-300'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <CheckCircle size={18} />
                                        Present
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setAttendanceModal(prev => ({ ...prev, attended: false }))}
                                        className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${!attendanceModal.attended
                                            ? 'bg-red-500 text-white'
                                            : theme === 'dark'
                                                ? 'bg-gray-700 text-gray-300'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <XCircle size={18} />
                                        Absent
                                    </motion.button>
                                </div>

                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setAttendanceModal({ isOpen: false, student: null, attended: true })}
                                        className={`flex-1 hover:cursor-pointer py-3 px-4 rounded-xl transition-all duration-300 border ${theme === 'dark'
                                            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border-gray-700'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                                            }`}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleAttendance}
                                        className="flex-1 hover:cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/20"
                                    >
                                        Save Attendance
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {certificateModal.isOpen && certificateModal.student && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={`rounded-2xl p-8 w-full max-w-md shadow-2xl ${theme === 'dark'
                                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                                } border`}
                        >
                            <div className="text-center">
                                <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 relative`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-lg opacity-30"></div>
                                    <div className={`relative z-10 flex items-center justify-center h-16 w-16 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                        }`}>
                                        <Award className="h-8 w-8 text-orange-500" />
                                    </div>
                                </div>

                                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Issue Certificate
                                </h3>

                                <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Issue completion certificate for{' '}
                                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {certificateModal.student.fullName}
                                    </span>
                                </p>

                                <div className="mb-6">
                                    <label className={`block text-sm font-medium mb-2 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Certificate Number (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={certificateModal.certificateNumber}
                                        onChange={(e) => setCertificateModal(prev => ({ ...prev, certificateNumber: e.target.value }))}
                                        placeholder="Auto-generated if left empty"
                                        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                                            } border`}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setCertificateModal({ isOpen: false, student: null, certificateNumber: '' })}
                                        className={`flex-1 hover:cursor-pointer py-3 px-4 rounded-xl transition-all duration-300 border ${theme === 'dark'
                                            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border-gray-700'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                                            }`}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleIssueCertificate}
                                        className="flex-1 hover:cursor-pointer bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20"
                                    >
                                        Issue Certificate
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {deleteModal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={`rounded-2xl p-8 w-full max-w-md shadow-2xl ${theme === 'dark'
                                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                                } border`}
                        >
                            <div className="text-center">
                                <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 relative`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg opacity-30"></div>
                                    <div className={`relative z-10 flex items-center justify-center h-16 w-16 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                        }`}>
                                        <Trash2 className="h-8 w-8 text-red-500" />
                                    </div>
                                </div>

                                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Delete Student?
                                </h3>

                                <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    This will permanently delete{' '}
                                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {deleteModal.student?.fullName}
                                    </span>{' '}
                                    (ID: {deleteModal.student?.studentId}). This action cannot be undone.
                                </p>

                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setDeleteModal({ isOpen: false, student: null })}
                                        className={`flex-1 hover:cursor-pointer py-3 px-4 rounded-xl transition-all duration-300 border ${theme === 'dark'
                                            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border-gray-700'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                                            }`}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleDelete}
                                        className="flex-1 hover:cursor-pointer bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/20"
                                    >
                                        Delete Student
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentList;