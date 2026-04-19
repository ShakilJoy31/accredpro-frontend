"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Plus,
    Truck,
    Phone,
    Mail,
    MapPin,
    Eye,
    Edit,
    Trash2,
    Star,
    ChevronRight,
    ChevronLeft,
    MoreVertical,
    Package,
    DollarSign,
    Calendar,
    Clock,
    XCircle,
    FileUp,
    Hash,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/hooks/useThemeContext';
import { Driver } from '@/utils/interface/driverInterface';
import { useBulkImportDriversMutation, useDeleteDriverMutation, useGetAllDriversQuery, useUpdateDriverRatingMutation, useUpdateDriverStatusMutation } from '@/redux/api/customer/driverApi';
import AddEditDriverModal from './AddEditDriverModal';
import DriverDetailsModal from './DriverDetailsModal';
import BulkImportModal from './BulkImportModal';

interface DriverListProps {
    userId?: string | null;
}

const DriverList: React.FC<DriverListProps> = ({ userId }) => {
    const { theme } = useTheme();
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        city: "",
        vehicleType: "",
        employmentType: "",
        rating: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; driver: Driver | null }>({ isOpen: false, driver: null });
    const [ratingModal, setRatingModal] = useState<{ isOpen: boolean; driver: Driver | null; rating: number }>({ isOpen: false, driver: null, rating: 3 });
    const [expandedDriver, setExpandedDriver] = useState<number | null>(null);

    const {
        data: driversData,
        isLoading,
        isError,
        refetch
    } = useGetAllDriversQuery({
        page: currentPage,
        limit: itemsPerPage,
        ...filters
    });

    const [deleteDriver] = useDeleteDriverMutation();
    const [updateDriverStatus] = useUpdateDriverStatusMutation();
    const [updateDriverRating] = useUpdateDriverRatingMutation();
    const [bulkImportDrivers] = useBulkImportDriversMutation();

    const drivers = driversData?.data || [];
    const pagination = driversData?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 9
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleView = (driver: Driver) => {
        setSelectedDriver(driver);
    };

    const handleEdit = (driver: Driver) => {
        setDriverToEdit(driver);
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = (driver: Driver) => {
        setDeleteModal({ isOpen: true, driver });
    };

    const handleDelete = async () => {
        if (!deleteModal.driver) return;

        try {
            await deleteDriver(deleteModal.driver.id).unwrap();
            toast.success('Driver deleted successfully');
            setDeleteModal({ isOpen: false, driver: null });
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to delete driver');
        }
    };

    const handleStatusChange = async (driver: Driver, newStatus: string) => {
        try {
            await updateDriverStatus({
                id: driver.id,
                status: newStatus
            }).unwrap();
            toast.success(`Driver status updated to ${newStatus}`);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update status');
        }
    };

    const handleRatingChange = async () => {
        if (!ratingModal.driver) return;

        try {
            await updateDriverRating({
                id: ratingModal.driver.id,
                rating: ratingModal.rating
            }).unwrap();
            toast.success(`Driver rating updated to ${ratingModal.rating} stars`);
            setRatingModal({ isOpen: false, driver: null, rating: 3 });
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update rating');
        }
    };

    const handleBulkImport = async (drivers: Partial<Driver>[]) => {
        try {
            const result = await bulkImportDrivers({ drivers }).unwrap();
            toast.success(result.message);
            setIsBulkImportModalOpen(false);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to import drivers');
        }
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (isError) {
        return (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Failed to load drivers</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => refetch()}
                    className={`mt-4 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto ${theme === 'dark'
                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
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
                        All Drivers
                    </h2>
                    <p className={`mt-1 text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage your drivers and their vehicle information
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsBulkImportModalOpen(true)}
                        className={`px-5 py-2.5 w-full md:w-auto flex justify-center hover:cursor-pointer rounded-xl transition-all duration-300 items-center gap-2 group ${theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                            }`}
                    >
                        <FileUp size={20} />
                        Bulk Import
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setDriverToEdit(null);
                            setIsAddModalOpen(true);
                        }}
                        className={`px-5 py-2.5 w-full md:w-auto flex justify-center hover:cursor-pointer rounded-xl transition-all duration-300 items-center gap-2 group ${theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/20'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'
                            }`}
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        Add New Driver
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
                        <Filter size={20} className="text-blue-500" />
                        Filter Drivers
                    </h3>
                    {(filters.search || filters.status || filters.city || filters.vehicleType || filters.employmentType || filters.rating) && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilters({ search: "", status: "", city: "", vehicleType: "", employmentType: "", rating: "" })}
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Search Drivers
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    placeholder="Name, phone, license..."
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                                        } border`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Status
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative">
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange("status", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 appearance-none ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                                        } border`}
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="on_leave">On Leave</option>
                                    <option value="terminated">Terminated</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            City
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={filters.city}
                                    onChange={(e) => handleFilterChange("city", e.target.value)}
                                    placeholder="Dhaka, Chittagong..."
                                    className={`w-full px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                                        } border`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Vehicle Type
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative">
                                <select
                                    value={filters.vehicleType}
                                    onChange={(e) => handleFilterChange("vehicleType", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 appearance-none ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                                        } border`}
                                >
                                    <option value="">All Types</option>
                                    <option value="truck">Truck</option>
                                    <option value="pickup">Pickup</option>
                                    <option value="lorry">Lorry</option>
                                    <option value="container">Container</option>
                                    <option value="other">Other</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Employment Type
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative">
                                <select
                                    value={filters.employmentType}
                                    onChange={(e) => handleFilterChange("employmentType", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 appearance-none ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                                        } border`}
                                >
                                    <option value="">All Types</option>
                                    <option value="permanent">Permanent</option>
                                    <option value="contractual">Contractual</option>
                                    <option value="temporary">Temporary</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Rating
                        </label>
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative">
                                <select
                                    value={filters.rating}
                                    onChange={(e) => handleFilterChange("rating", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 appearance-none ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                                        } border`}
                                >
                                    <option value="">All Ratings</option>
                                    <option value="5">5 Stars Only</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="3">3+ Stars</option>
                                    <option value="2">2+ Stars</option>
                                    <option value="1">1+ Stars</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Drivers Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="space-y-6"
            >
                {isLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl p-6 animate-pulse ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'}`}
                            >
                                <div className={`h-6 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                <div className={`h-4 rounded-lg mb-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                <div className={`h-4 rounded-lg w-2/3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                            </div>
                        ))}
                    </div>
                ) : drivers.length === 0 ? (
                    <div className={`text-center py-16 rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-white'
                        }`}>
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className={`absolute inset-0 rounded-full ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-100'}`}></div>
                            <Truck className="absolute inset-0 m-auto w-12 h-12 text-blue-500" />
                        </div>
                        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            No Drivers Found
                        </h3>
                        <p className={`mb-6 max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Add your first driver to start managing your fleet and tracking deliveries.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsAddModalOpen(true)}
                            className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto group ${theme === 'dark'
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/20'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'
                                }`}
                        >
                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            Add Your First Driver
                        </motion.button>
                    </div>
                ) : (
                    <>
                        {/* Grid Layout */}
                        <div className={`grid grid-cols-1 ${drivers.length < 2 ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-6`}>
                            {drivers.map((driver: Driver, index: number) => (
                                <motion.div
                                    key={driver.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${theme === 'dark'
                                        ? 'bg-gray-900/50'
                                        : 'bg-white'
                                        } border shadow-lg hover:shadow-xl ${expandedDriver === driver.id
                                            ? theme === 'dark' ? 'border-blue-500' : 'border-blue-500'
                                            : theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                                        }`}
                                >
                                    {/* Card Header */}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                                                    <span className="text-2xl">{getVehicleTypeIcon(driver.vehicleType)}</span>
                                                </div>
                                                <div className='flex items-center gap-x-4'>
                                                    <div>
                                                        <h3 className={`font-semibold text-lg truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                            }`}>
                                                            {driver.driverName}
                                                        </h3>
                                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {driver.vehicleRegNo}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(driver.status)}`}>
                                                            {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setExpandedDriver(expandedDriver === driver.id ? null : driver.id)}
                                                className={`p-2 hover:cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                                                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                                                    }`}
                                            >
                                                <MoreVertical size={20} />
                                            </motion.button>
                                        </div>

                                        {/* Rating Stars */}
                                        <div className="flex items-center gap-1 mb-4">
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
                                            <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                ({driver.rating}/5)
                                            </span>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {driver.phoneNo}
                                                </span>
                                            </div>
                                            {driver.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {driver.email}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {driver.city}, {driver.state}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quick Stats */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className={`text-center p-3 rounded-xl transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                                                }`}>
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <Package size={14} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />
                                                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        {driver.totalTrips || 0}
                                                    </span>
                                                </div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Trips
                                                </span>
                                            </div>
                                            <div className={`text-center p-3 rounded-xl transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                                                }`}>
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <DollarSign size={14} className={theme === 'dark' ? 'text-green-400' : 'text-green-500'} />
                                                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        ৳{(driver.totalEarnings || 0).toLocaleString()}
                                                    </span>
                                                </div>
                                                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Earnings
                                                </span>
                                            </div>
                                        </div>

                                        {/* Vehicle Info */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                                                {driver.vehicleType}
                                            </span>
                                            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {driver.vehicleCapacity || 'N/A'}
                                            </span>
                                        </div>

                                        {/* Employment Type Badge */}
                                        <div className="mb-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                                                {driver.employmentType?.charAt(0).toUpperCase() + driver.employmentType?.slice(1) || 'Permanent'}
                                            </span>
                                        </div>

                                        {/* Expanded Content */}
                                        <AnimatePresence>
                                            {expandedDriver === driver.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-4 border-t border-gray-700/50 dark:border-gray-700">
                                                        <div className="space-y-3">
                                                            {driver.joiningDate && (
                                                                <div className="flex items-center gap-3">
                                                                    <Calendar size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                        Joined: {driver.joiningDateFormatted || formatDate(driver.joiningDate)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {driver.lastTripDate && (
                                                                <div className="flex items-center gap-3">
                                                                    <Clock size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                        Last Trip: {driver.lastTripDateFormatted || formatDate(driver.lastTripDate)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {driver.drivingLicenseNo && (
                                                                <div className="flex items-center gap-3">
                                                                    <Hash size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                        License: {driver.drivingLicenseNo}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Card Footer */}
                                    <div className={`p-6 border-t transition-colors duration-300 ${theme === 'dark'
                                        ? 'bg-gray-900/50 border-gray-700'
                                        : 'bg-gray-50/50 border-gray-200'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleView(driver)}
                                                className={`flex hover:cursor-pointer items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${theme === 'dark'
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <Eye size={16} />
                                                <span className="text-sm">View Details</span>
                                            </motion.button>

                                            <div className="flex items-center gap-1">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setRatingModal({ isOpen: true, driver, rating: driver.rating })}
                                                    className={`p-2 hover:cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                                                        ? 'hover:bg-gray-700 text-yellow-500'
                                                        : 'hover:bg-gray-100 text-yellow-600'
                                                        }`}
                                                    title="Update Rating"
                                                >
                                                    <Star size={18} />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleEdit(driver)}
                                                    className={`p-2 hover:cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                                                        ? 'hover:bg-gray-700 text-green-500'
                                                        : 'hover:bg-gray-100 text-green-600'
                                                        }`}
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDeleteClick(driver)}
                                                    className={`p-2 hover:cursor-pointer rounded-lg transition-colors duration-300 ${theme === 'dark'
                                                        ? 'hover:bg-gray-700 text-red-500'
                                                        : 'hover:bg-gray-100 text-red-600'
                                                        }`}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
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
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                            Show per page:
                                        </span>
                                        <select
                                            className={`px-3 py-1.5 rounded-lg transition-colors duration-300 ${theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-gray-100 border-gray-300 text-gray-700'
                                                } border`}
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                console.log(e)
                                                // Handle items per page change if needed
                                            }}
                                        >
                                            <option value="9">9</option>
                                            <option value="18">18</option>
                                            <option value="27">27</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Page <span className="font-semibold">{currentPage}</span> of{" "}
                                            <span className="font-semibold">{pagination.totalPages}</span>
                                        </div>
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
                                                                ? theme === 'dark'
                                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                                                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
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

            {/* Modals */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddEditDriverModal
                        driverData={driverToEdit}
                        isOpen={isAddModalOpen}
                        onClose={(refreshData: boolean) => {
                            setIsAddModalOpen(false);
                            setDriverToEdit(null);
                            if (refreshData) {
                                refetch();
                            }
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedDriver && (
                    <DriverDetailsModal
                        isOpen={!!selectedDriver}
                        driver={selectedDriver}
                        onClose={() => setSelectedDriver(null)}
                        onEdit={(driver) => {
                            setSelectedDriver(null);
                            handleEdit(driver);
                        }}
                        onStatusChange={handleStatusChange}
                        onRatingChange={(driver) => {
                            setSelectedDriver(null);
                            setRatingModal({ isOpen: true, driver, rating: driver.rating });
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isBulkImportModalOpen && (
                    <BulkImportModal
                        isOpen={isBulkImportModalOpen}
                        onClose={() => setIsBulkImportModalOpen(false)}
                        onImport={handleBulkImport}
                    />
                )}
            </AnimatePresence>

            {/* Rating Modal */}
            <AnimatePresence>
                {ratingModal.isOpen && ratingModal.driver && (
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
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-lg opacity-30"></div>
                                    <div className={`relative z-10 flex items-center justify-center h-16 w-16 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                        }`}>
                                        <Star className="h-8 w-8 text-yellow-500" />
                                    </div>
                                </div>

                                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Update Driver Rating
                                </h3>

                                <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    Rate{' '}
                                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {ratingModal.driver.driverName}
                                    </span>
                                </p>

                                {/* Rating Stars */}
                                <div className="flex justify-center gap-2 mb-8">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.button
                                            key={star}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setRatingModal(prev => ({ ...prev, rating: star }))}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                size={40}
                                                className={`transition-all duration-300 ${star <= ratingModal.rating
                                                    ? 'text-yellow-500 fill-yellow-500'
                                                    : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                                                    }`}
                                            />
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setRatingModal({ isOpen: false, driver: null, rating: 3 })}
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
                                        onClick={handleRatingChange}
                                        className="flex-1 hover:cursor-pointer bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-yellow-500/20"
                                    >
                                        Update Rating
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
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

                                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Delete Driver?
                                </h3>

                                <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    This will permanently delete{' '}
                                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {deleteModal.driver?.driverName}
                                    </span>{' '}
                                    with vehicle {deleteModal.driver?.vehicleRegNo}. This action cannot be undone.
                                </p>

                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setDeleteModal({ isOpen: false, driver: null })}
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
                                        Delete Driver
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

export default DriverList;