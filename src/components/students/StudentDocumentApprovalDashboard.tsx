"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Search,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw,
    Eye,
    Download,
    Filter,
    ChevronDown,
    User,
    Mail,
    Phone,
    Hash,
    Calendar,
    AlertCircle,
    ThumbsUp,
    ThumbsDown,
    Edit,
    Loader2,
    ImageIcon,
    File,
    FileCode,
    FileJson,
    FileSpreadsheet,
    Presentation,
    Music,
    Video,
    Package,
    TrendingUp,
    Users,
    HardDrive,
    AlertTriangle,
    Star,
    StarOff,
    Grid,
    List,
    FolderOpen,
    FileCheck,
    Check,
} from 'lucide-react';
import { useTheme } from '@/hooks/useThemeContext';
import { toast } from 'react-hot-toast';
import {
    useGetDocumentsByApprovalStatusQuery,
    useApproveDocumentMutation,
    useRejectDocumentMutation,
    useRequestRevisionMutation,
    useBulkApproveDocumentsMutation,
    useGetApprovalStatisticsQuery,
} from '@/redux/api/student/studentDocumentApi';
import { useGetAllStudentsQuery } from '@/redux/api/student/studentApi';
import Image from 'next/image';
import { appConfiguration } from '@/utils/constant/appConfiguration';

const BACKEND_URL = appConfiguration.baseUrl;

interface Document {
    id: number;
    title: string;
    originalFileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    remarks: string;
    approvalStatus: 'pending' | 'approved' | 'rejected' | 'revision_required';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    studentId: number;
    createdAt: string;
    updatedAt: string;
    rejectionReason?: string;
    approvalRemarks?: string;
}

interface StudentWithDocuments {
    id: number;
    studentId: string;
    fullName: string;
    email: string;
    phoneNo: string;
    profileImage?: string;
    fatherName?: string;
    motherName?: string;
    documents: Document[];
    documentStats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        revisionRequired: number;
        totalSize: number;
    };
}

const DocumentApprovalDashboard = () => {
    const { theme } = useTheme();
    const [selectedStatus, setSelectedStatus] = useState<string>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPriority, setSelectedPriority] = useState<string>('');
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showStudentApproveModal, setShowStudentApproveModal] = useState(false);
    const [showStudentRejectModal, setShowStudentRejectModal] = useState(false);
    const [showSingleDocumentModal, setShowSingleDocumentModal] = useState(false);
    const [selectedStudentForApprove, setSelectedStudentForApprove] = useState<StudentWithDocuments | null>(null);
    const [selectedStudentForReject, setSelectedStudentForReject] = useState<StudentWithDocuments | null>(null);
    const [singleDocumentAction, setSingleDocumentAction] = useState<'approve' | 'reject' | null>(null);
    const [remarks, setRemarks] = useState('');
    const [rejectRemarks, setRejectRemarks] = useState('');
    const [singleDocumentRemarks, setSingleDocumentRemarks] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Hover card state
    const [hoverCard, setHoverCard] = useState<{
        visible: boolean;
        document: Document | null;
        position: { x: number; y: number };
    }>({
        visible: false,
        document: null,
        position: { x: 0, y: 0 },
    });

    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { data: documentsData, isLoading, refetch } = useGetDocumentsByApprovalStatusQuery({
        status: selectedStatus,
        priority: selectedPriority || undefined,
    });

    const { data: statisticsData, refetch: refetchStats } = useGetApprovalStatisticsQuery();

    const { data: studentsData } = useGetAllStudentsQuery({
        page: 1,
        limit: 1000,
    });

    const [approveDocument] = useApproveDocumentMutation();
    const [rejectDocument] = useRejectDocumentMutation();
    const [requestRevision] = useRequestRevisionMutation();
    const [bulkApprove] = useBulkApproveDocumentsMutation();

    const documents = documentsData?.data || [];
    const statistics = statisticsData?.data;
    const students = studentsData?.data || [];

    // Group documents by student
    const studentsWithDocuments = React.useMemo(() => {
        const studentMap = new Map<number, StudentWithDocuments>();

        documents.forEach((doc: Document) => {
            if (!studentMap.has(doc.studentId)) {
                const student = students.find((s: any) => s.id === doc.studentId);
                studentMap.set(doc.studentId, {
                    id: doc.studentId,
                    studentId: student?.studentId || `STU${doc.studentId}`,
                    fullName: student?.fullName || `Student #${doc.studentId}`,
                    email: student?.email || 'N/A',
                    phoneNo: student?.phoneNo || 'N/A',
                    profileImage: student?.profileImage,
                    fatherName: student?.fatherName,
                    motherName: student?.motherName,
                    documents: [],
                    documentStats: {
                        total: 0,
                        pending: 0,
                        approved: 0,
                        rejected: 0,
                        revisionRequired: 0,
                        totalSize: 0,
                    },
                });
            }

            const studentData = studentMap.get(doc.studentId)!;
            studentData.documents.push(doc);

            studentData.documentStats.total++;
            studentData.documentStats.totalSize += doc.fileSize || 0;

            switch (doc.approvalStatus) {
                case 'pending':
                    studentData.documentStats.pending++;
                    break;
                case 'approved':
                    studentData.documentStats.approved++;
                    break;
                case 'rejected':
                    studentData.documentStats.rejected++;
                    break;
                case 'revision_required':
                    studentData.documentStats.revisionRequired++;
                    break;
            }
        });

        let result = Array.from(studentMap.values());

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(student =>
                student.fullName.toLowerCase().includes(searchLower) ||
                student.studentId.toLowerCase().includes(searchLower) ||
                student.email.toLowerCase().includes(searchLower) ||
                student.documents.some(doc =>
                    doc.title?.toLowerCase().includes(searchLower) ||
                    doc.originalFileName?.toLowerCase().includes(searchLower)
                )
            );
        }

        result.sort((a, b) => {
            const hasUrgentA = a.documents.some(d => d.priority === 'urgent' && d.approvalStatus === 'pending');
            const hasUrgentB = b.documents.some(d => d.priority === 'urgent' && d.approvalStatus === 'pending');
            if (hasUrgentA && !hasUrgentB) return -1;
            if (!hasUrgentA && hasUrgentB) return 1;
            return b.documentStats.pending - a.documentStats.pending;
        });

        return result;
    }, [documents, students, searchTerm]);

    const handleApproveAllStudentDocuments = async () => {
        if (!selectedStudentForApprove) return;

        const pendingDocIds = selectedStudentForApprove.documents
            .filter(doc => doc.approvalStatus === 'pending')
            .map(doc => doc.id);

        if (pendingDocIds.length === 0) {
            toast.error('No pending documents to approve');
            setShowStudentApproveModal(false);
            setSelectedStudentForApprove(null);
            return;
        }

        try {
            await bulkApprove({
                documentIds: pendingDocIds,
                approvalRemarks: remarks || undefined,
            }).unwrap();
            toast.success(`All ${pendingDocIds.length} documents approved for ${selectedStudentForApprove.fullName}`);
            setShowStudentApproveModal(false);
            setSelectedStudentForApprove(null);
            setRemarks('');
            refetch();
            refetchStats();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to approve documents');
        }
    };

    const handleRejectAllStudentDocuments = async () => {
        if (!selectedStudentForReject) return;

        const pendingDocIds = selectedStudentForReject.documents
            .filter(doc => doc.approvalStatus === 'pending')
            .map(doc => doc.id);

        if (pendingDocIds.length === 0) {
            toast.error('No pending documents to reject');
            setShowStudentRejectModal(false);
            setSelectedStudentForReject(null);
            return;
        }

        if (!rejectRemarks.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        try {
            for (const docId of pendingDocIds) {
                await rejectDocument({
                    id: docId,
                    rejectionReason: rejectRemarks,
                }).unwrap();
            }
            toast.success(`All ${pendingDocIds.length} documents rejected for ${selectedStudentForReject.fullName}`);
            setShowStudentRejectModal(false);
            setSelectedStudentForReject(null);
            setRejectRemarks('');
            refetch();
            refetchStats();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to reject documents');
        }
    };

    const handleSingleDocumentApprove = async () => {
        if (!selectedDocument) return;
        try {
            await approveDocument({
                id: selectedDocument.id,
                approvalRemarks: singleDocumentRemarks || undefined,
            }).unwrap();
            toast.success(`Document "${selectedDocument.title}" approved successfully`);
            setShowSingleDocumentModal(false);
            setSelectedDocument(null);
            setSingleDocumentRemarks('');
            setHoverCard(prev => ({ ...prev, visible: false, document: null }));
            refetch();
            refetchStats();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to approve document');
        }
    };

    const handleSingleDocumentReject = async () => {
        if (!selectedDocument) return;
        if (!singleDocumentRemarks.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        try {
            await rejectDocument({
                id: selectedDocument.id,
                rejectionReason: singleDocumentRemarks,
            }).unwrap();
            toast.success(`Document "${selectedDocument.title}" rejected`);
            setShowSingleDocumentModal(false);
            setSelectedDocument(null);
            setSingleDocumentRemarks('');
            setHoverCard(prev => ({ ...prev, visible: false, document: null }));
            refetch();
            refetchStats();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to reject document');
        }
    };

    const getFullFileUrl = (fileUrl: string) => {
        if (fileUrl?.startsWith('http')) return fileUrl;
        return `${BACKEND_URL}${fileUrl}`;
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return 'Unknown';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return { color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-500/10', text: 'text-yellow-600', icon: Clock, label: 'Pending' };
            case 'approved':
                return { color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10', text: 'text-green-600', icon: CheckCircle, label: 'Approved' };
            case 'rejected':
                return { color: 'from-red-500 to-rose-500', bg: 'bg-red-500/10', text: 'text-red-600', icon: XCircle, label: 'Rejected' };
            case 'revision_required':
                return { color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', text: 'text-blue-600', icon: RefreshCw, label: 'Revision Needed' };
            default:
                return { color: 'from-gray-500 to-gray-600', bg: 'bg-gray-500/10', text: 'text-gray-600', icon: FileText, label: 'Unknown' };
        }
    };

    const getPriorityConfig = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return { color: 'text-red-600', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: AlertTriangle, label: 'Urgent' };
            case 'high':
                return { color: 'text-orange-600', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: AlertCircle, label: 'High' };
            case 'medium':
                return { color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Clock, label: 'Medium' };
            default:
                return { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/30', icon: StarOff, label: 'Low' };
        }
    };

    const getFileIcon = (mimeType: string | null, fileName: string, size?: 'sm' | 'lg') => {
        const iconSize = size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
        const extension = fileName?.split('.').pop()?.toLowerCase() || '';

        if (mimeType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
            return <ImageIcon className={`${iconSize} text-blue-500`} />;
        }
        if (mimeType === 'application/pdf' || extension === 'pdf') {
            return <FileText className={`${iconSize} text-red-500`} />;
        }
        if (mimeType?.includes('word') || ['doc', 'docx'].includes(extension)) {
            return <FileText className={`${iconSize} text-blue-600`} />;
        }
        if (mimeType?.includes('excel') || ['xls', 'xlsx', 'csv'].includes(extension)) {
            return <FileSpreadsheet className={`${iconSize} text-green-600`} />;
        }
        if (mimeType?.includes('powerpoint') || ['ppt', 'pptx'].includes(extension)) {
            return <Presentation className={`${iconSize} text-orange-600`} />;
        }
        if (extension === 'sql') return <FileCode className={`${iconSize} text-purple-500`} />;
        if (extension === 'json') return <FileJson className={`${iconSize} text-yellow-600`} />;
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
            return <Package className={`${iconSize} text-gray-500`} />;
        }
        if (mimeType?.startsWith('video/') || ['mp4', 'avi', 'mkv', 'mov'].includes(extension)) {
            return <Video className={`${iconSize} text-purple-500`} />;
        }
        if (mimeType?.startsWith('audio/') || ['mp3', 'wav', 'ogg'].includes(extension)) {
            return <Music className={`${iconSize} text-pink-500`} />;
        }
        return <File className={`${iconSize} text-gray-400`} />;
    };

    const handleDownload = async (doc: Document) => {
        try {
            const fileUrl = getFullFileUrl(doc.fileUrl);
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.originalFileName || doc.title || 'document';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Download started');
        } catch (error) {
            toast.error('Failed to download file');
        }
    };

    const handleMouseEnter = (e: React.MouseEvent, doc: Document) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setHoverCard({
            visible: true,
            document: doc,
            position: {
                x: rect.left,
                y: rect.top - 150,
            },
        });
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setHoverCard(prev => ({ ...prev, visible: false, document: null }));
        }, 300);
    };

    const statusCounts = {
        pending: statistics?.pending || 0,
        approved: statistics?.approved || 0,
        rejected: statistics?.rejected || 0,
        revision_required: statistics?.revisionRequired || 0,
    };

    const statusTabs = [
        { key: 'pending', label: 'Pending', icon: Clock, count: statusCounts.pending },
        { key: 'approved', label: 'Approved', icon: CheckCircle, count: statusCounts.approved },
        { key: 'rejected', label: 'Rejected', icon: XCircle, count: statusCounts.rejected },
        { key: 'revision_required', label: 'Revision Needed', icon: RefreshCw, count: statusCounts.revision_required },
    ];

    const priorities = [
        { value: '', label: 'All Priorities' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
    ];

    const totalStudentsWithDocs = studentsWithDocuments.length;

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-orange-600 to-red-600 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Document Approval Dashboard
                            </h1>
                            <p className="text-orange-100 mt-2">
                                Review and approve student documents grouped by student
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => refetch()}
                                className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {statusTabs.map((status) => {
                        const StatusIcon = status.icon;
                        return (
                            <motion.div
                                key={status.key}
                                whileHover={{ y: -4 }}
                                onClick={() => setSelectedStatus(status.key)}
                                className={`cursor-pointer rounded-2xl p-5 transition-all ${selectedStatus === status.key
                                    ? `bg-gradient-to-r ${status.key === 'pending' ? 'from-yellow-500 to-orange-500' : status.key === 'approved' ? 'from-green-500 to-emerald-500' : status.key === 'rejected' ? 'from-red-500 to-rose-500' : 'from-blue-500 to-cyan-500'} text-white`
                                    : `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm opacity-80 ${selectedStatus === status.key ? 'text-white/80' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {status.label}
                                        </p>
                                        <p className={`text-3xl font-bold mt-1 ${selectedStatus === status.key ? 'text-white' : theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {status.count}
                                        </p>
                                    </div>
                                    <StatusIcon size={32} className={`${selectedStatus === status.key ? 'text-white/70' : 'opacity-50'}`} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Overall Statistics */}
                {statistics && (
                    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-4 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                            <FileText className="text-orange-500" size={24} />
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Documents</p>
                                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{statistics.total}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="text-blue-500" size={24} />
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Students with Documents</p>
                                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{totalStudentsWithDocs}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <TrendingUp className="text-green-500" size={24} />
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Approval Rate</p>
                                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{statistics.approvalRate}%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <HardDrive className="text-purple-500" size={24} />
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Pending Review</p>
                                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{statistics.pending}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student name, ID, email, or document title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                        />
                    </div>
                </div>

                {/* Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`mb-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                        >
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[150px]">
                                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
                                    <select
                                        value={selectedPriority}
                                        onChange={(e) => setSelectedPriority(e.target.value)}
                                        className={`w-full px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                                    >
                                        {priorities.map(p => (
                                            <option key={p.value} value={p.value}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Students with Documents */}
                {isLoading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={`rounded-2xl p-6 animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-700"></div>
                                    <div className="flex-1">
                                        <div className="h-5 rounded bg-gray-700 w-48 mb-2"></div>
                                        <div className="h-3 rounded bg-gray-600 w-64"></div>
                                    </div>
                                </div>
                                <div className="h-32 rounded-lg bg-gray-700"></div>
                            </div>
                        ))}
                    </div>
                ) : studentsWithDocuments.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <FolderOpen className="w-12 h-12 text-orange-500" />
                        </div>
                        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No Documents Found</h3>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            No {selectedStatus} documents match your criteria
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {studentsWithDocuments.map((student) => (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300`}
                            >
                                {/* Student Header */}
                                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-start justify-between flex-wrap gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden flex-shrink-0">
                                                {student.profileImage ? (
                                                    <Image
                                                        src={getFullFileUrl(student.profileImage)}
                                                        alt={student.fullName}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    student.fullName.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <h3 className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {student.fullName}
                                                </h3>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    ID: {student.studentId} • {student.email} • {student.phoneNo}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {student.documentStats.pending > 0 && (
                                                        <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 text-yellow-600 flex items-center gap-1">
                                                            <Clock size={10} /> {student.documentStats.pending} Pending
                                                        </span>
                                                    )}
                                                    {student.documentStats.approved > 0 && (
                                                        <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-600 flex items-center gap-1">
                                                            <CheckCircle size={10} /> {student.documentStats.approved} Approved
                                                        </span>
                                                    )}
                                                    {student.documentStats.rejected > 0 && (
                                                        <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-600 flex items-center gap-1">
                                                            <XCircle size={10} /> {student.documentStats.rejected} Rejected
                                                        </span>
                                                    )}
                                                    {student.documentStats.revisionRequired > 0 && (
                                                        <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-600 flex items-center gap-1">
                                                            <RefreshCw size={10} /> {student.documentStats.revisionRequired} Revision
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            {student.documentStats.pending > 0 && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudentForApprove(student);
                                                            setRemarks('');
                                                            setShowStudentApproveModal(true);
                                                        }}
                                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
                                                    >
                                                        <Check size={18} />
                                                        Approve All ({student.documentStats.pending})
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudentForReject(student);
                                                            setRejectRemarks('');
                                                            setShowStudentRejectModal(true);
                                                        }}
                                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
                                                    >
                                                        <XCircle size={18} />
                                                        Reject All ({student.documentStats.pending})
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Documents Grid */}
                                <div className="p-5">
                                    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3`}>
                                        {student.documents.map((doc) => {
                                            const statusConfig = getStatusConfig(doc.approvalStatus);
                                            const priorityConfig = getPriorityConfig(doc.priority);
                                            const StatusIcon = statusConfig.icon;

                                            return (
                                                <motion.div
                                                    key={doc.id}
                                                    whileHover={{ y: -4, scale: 1.05 }}
                                                    onMouseEnter={(e) => handleMouseEnter(e, doc)}
                                                    onMouseLeave={handleMouseLeave}
                                                    className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 ${priorityConfig.border
                                                        } ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} overflow-hidden group`}
                                                >
                                                    <div className="p-2">
                                                        {/* File Preview */}
                                                        <div className="h-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center relative overflow-hidden">
                                                            {doc.mimeType?.startsWith('image/') && doc.fileUrl ? (
                                                                <Image
                                                                    src={getFullFileUrl(doc.fileUrl)}
                                                                    alt={doc.title}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="text-center">
                                                                    {getFileIcon(doc.mimeType, doc.originalFileName)}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Document Info */}
                                                        <div className="mt-2 text-center">
                                                            <h4 className={`text-xs font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                {doc.title || doc.originalFileName?.substring(0, 20)}
                                                            </h4>
                                                            <div className="flex items-center justify-center gap-1 mt-1">
                                                                <span className={`text-[10px] px-1 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text} flex items-center gap-0.5`}>
                                                                    <StatusIcon size={8} />
                                                                    {statusConfig.label}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons on Hover */}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                                        <a
                                                            href={getFullFileUrl(doc.fileUrl)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 cursor-pointer rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                                        >
                                                            <Eye size={14} />
                                                        </a>
                                                        <button
                                                            onClick={() => handleDownload(doc)}
                                                            className="p-1.5 cursor-pointer rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                        >
                                                            <Download size={14} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hover Card - Appears just above the hovered document */}
            <AnimatePresence>
                {hoverCard.visible && hoverCard.document && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'fixed',
                            left: hoverCard.position.x,
                            top: hoverCard.position.y,
                            zIndex: 1000,
                            pointerEvents: 'auto',
                        }}
                        className="w-80"
                        onMouseEnter={() => {
                            if (hoverTimeoutRef.current) {
                                clearTimeout(hoverTimeoutRef.current);
                            }
                        }}
                        onMouseLeave={() => {
                            setHoverCard(prev => ({ ...prev, visible: false, document: null }));
                        }}
                    >
                        <div className={`rounded-2xl shadow-2xl p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-2 border-orange-500/50`}>
                            <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {hoverCard.document.mimeType?.startsWith('image/') && hoverCard.document.fileUrl ? (
                                        <Image
                                            src={getFullFileUrl(hoverCard.document.fileUrl)}
                                            alt={hoverCard.document.title}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        getFileIcon(hoverCard.document.mimeType, hoverCard.document.originalFileName, 'lg')
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-semibold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {hoverCard.document.title || hoverCard.document.originalFileName}
                                    </h4>
                                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {formatFileSize(hoverCard.document.fileSize)} • {formatDate(hoverCard.document.createdAt)}
                                    </p>
                                    {hoverCard.document.remarks && (
                                        <p className={`text-xs mt-2 italic line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {hoverCard.document.remarks}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <a
                                            href={getFullFileUrl(hoverCard.document.fileUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs flex items-center justify-center gap-1 hover:bg-blue-500/20 transition-colors"
                                        >
                                            <Eye size={12} /> View
                                        </a>
                                        <button
                                            onClick={() => handleDownload(hoverCard.document!)}
                                            className="flex-1 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-xs flex items-center justify-center gap-1 hover:bg-green-500/20 transition-colors"
                                        >
                                            <Download size={12} /> Get
                                        </button>
                                        {hoverCard.document.approvalStatus === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setSelectedDocument(hoverCard.document);
                                                        setSingleDocumentAction('approve');
                                                        setSingleDocumentRemarks('');
                                                        setShowSingleDocumentModal(true);
                                                    }}
                                                    className="flex-1 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs flex items-center justify-center gap-1 hover:bg-emerald-500/20 transition-colors"
                                                >
                                                    <ThumbsUp size={12} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedDocument(hoverCard.document);
                                                        setSingleDocumentAction('reject');
                                                        setSingleDocumentRemarks('');
                                                        setShowSingleDocumentModal(true);
                                                    }}
                                                    className="flex-1 py-1.5 rounded-lg bg-red-500/10 text-red-600 text-xs flex items-center justify-center gap-1 hover:bg-red-500/20 transition-colors"
                                                >
                                                    <ThumbsDown size={12} /> Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Student Approve All Modal */}
            <AnimatePresence>
                {showStudentApproveModal && selectedStudentForApprove && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => {
                            setShowStudentApproveModal(false);
                            setSelectedStudentForApprove(null);
                            setRemarks('');
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`rounded-2xl p-6 w-full max-w-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                                    <FileCheck className="w-10 h-10 text-white" />
                                </div>
                                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Approve All Documents
                                </h3>
                                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    You are about to approve <span className="font-bold text-emerald-600">{selectedStudentForApprove.documentStats.pending}</span> document(s) for <span className="font-bold">{selectedStudentForApprove.fullName}</span>.
                                </p>

                                <div className="mb-6">
                                    <label className={`block text-sm font-medium mb-2 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Approval Remarks (Optional)
                                    </label>
                                    <textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        placeholder="Add any remarks for this approval..."
                                        rows={3}
                                        className={`w-full px-3 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none`}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowStudentApproveModal(false);
                                            setSelectedStudentForApprove(null);
                                            setRemarks('');
                                        }}
                                        className={`flex-1 py-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} transition-all font-semibold`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleApproveAllStudentDocuments}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold hover:shadow-lg transition-all"
                                    >
                                        Approve All
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Student Reject All Modal */}
            <AnimatePresence>
                {showStudentRejectModal && selectedStudentForReject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => {
                            setShowStudentRejectModal(false);
                            setSelectedStudentForReject(null);
                            setRejectRemarks('');
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`rounded-2xl p-6 w-full max-w-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center">
                                    <XCircle className="w-10 h-10 text-white" />
                                </div>
                                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Reject All Documents
                                </h3>
                                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    You are about to reject <span className="font-bold text-red-600">{selectedStudentForReject.documentStats.pending}</span> document(s) for <span className="font-bold">{selectedStudentForReject.fullName}</span>.
                                </p>

                                <div className="mb-6">
                                    <label className={`block text-sm font-medium mb-2 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Rejection Reason <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={rejectRemarks}
                                        onChange={(e) => setRejectRemarks(e.target.value)}
                                        placeholder="Please provide a reason for rejection..."
                                        rows={3}
                                        className={`w-full px-3 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none`}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowStudentRejectModal(false);
                                            setSelectedStudentForReject(null);
                                            setRejectRemarks('');
                                        }}
                                        className={`flex-1 py-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} transition-all font-semibold`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRejectAllStudentDocuments}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold hover:shadow-lg transition-all"
                                    >
                                        Reject All
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Single Document Approve/Reject Modal */}
            <AnimatePresence>
                {showSingleDocumentModal && selectedDocument && singleDocumentAction && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => {
                            setShowSingleDocumentModal(false);
                            setSelectedDocument(null);
                            setSingleDocumentAction(null);
                            setSingleDocumentRemarks('');
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`rounded-2xl p-6 w-full max-w-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${singleDocumentAction === 'approve' ? 'bg-green-500/20' : 'bg-red-500/20'
                                    }`}>
                                    {singleDocumentAction === 'approve' && <ThumbsUp className="w-8 h-8 text-green-500" />}
                                    {singleDocumentAction === 'reject' && <ThumbsDown className="w-8 h-8 text-red-500" />}
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {singleDocumentAction === 'approve' ? 'Approve Document' : 'Reject Document'}
                                </h3>
                                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {singleDocumentAction === 'approve' 
                                        ? `Are you sure you want to approve "${selectedDocument.title}"?`
                                        : `Please provide a reason for rejecting "${selectedDocument.title}"`}
                                </p>

                                {singleDocumentAction === 'reject' && (
                                    <div className="mb-6">
                                        <textarea
                                            value={singleDocumentRemarks}
                                            onChange={(e) => setSingleDocumentRemarks(e.target.value)}
                                            placeholder="Rejection reason..."
                                            rows={4}
                                            className={`w-full px-3 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none`}
                                        />
                                    </div>
                                )}

                                {singleDocumentAction === 'approve' && (
                                    <div className="mb-6">
                                        <textarea
                                            value={singleDocumentRemarks}
                                            onChange={(e) => setSingleDocumentRemarks(e.target.value)}
                                            placeholder="Approval remarks (optional)..."
                                            rows={3}
                                            className={`w-full px-3 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none`}
                                        />
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowSingleDocumentModal(false);
                                            setSelectedDocument(null);
                                            setSingleDocumentAction(null);
                                            setSingleDocumentRemarks('');
                                        }}
                                        className={`flex-1 py-2 rounded-xl ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} transition-all`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={singleDocumentAction === 'approve' ? handleSingleDocumentApprove : handleSingleDocumentReject}
                                        className={`flex-1 py-2 rounded-xl font-semibold text-white ${singleDocumentAction === 'approve'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                            : 'bg-gradient-to-r from-red-500 to-rose-500'
                                            }`}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DocumentApprovalDashboard;