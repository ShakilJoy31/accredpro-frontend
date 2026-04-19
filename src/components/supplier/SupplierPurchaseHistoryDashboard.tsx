"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Download,
  RefreshCw,
  Filter,
  ChevronDown,
  Building2,
  Search,
  X
} from 'lucide-react';
import { useTheme } from '@/hooks/useThemeContext';
import {
  useGetAllSuppliersListQuery,
  useGetAllSuppliersPurchaseHistoryQuery,
  useGetAllSuppliersPurchaseSummaryQuery,
  useGetAllSuppliersOutstandingQuery,
  useGetAllSuppliersPurchaseAnalyticsQuery
} from '@/redux/api/supplier/supplierPurchaseHistoryApi';
import AllSuppliersPurchaseSummaryCards from './AllSuppliersPurchaseSummaryCards';
import AllSuppliersOutstandingCard from './AllSuppliersOutstandingCard';
import AllSuppliersPurchaseHistoryList from './AllSuppliersPurchaseHistoryList';

interface PurchaseHistoryDashboardProps {
  initialSupplierId?: string;
}

const PurchaseHistoryDashboard: React.FC<PurchaseHistoryDashboardProps> = ({ initialSupplierId }) => {
  const { theme } = useTheme();
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Searchable select states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get all suppliers for dropdown
  const { data: suppliersData } = useGetAllSuppliersListQuery({page: 1, limit: 100000000});
  const suppliers = suppliersData?.data || [];

  // Get purchase history for ALL suppliers (with optional supplier filter)
  const {
    data: historyData,
    isLoading: historyLoading,
    refetch: refetchHistory
  } = useGetAllSuppliersPurchaseHistoryQuery({
    page: 1,
    limit: 50,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    supplierId: selectedSupplierId !== 'all' ? selectedSupplierId : undefined
  });

  // Get purchase summary for ALL suppliers
  const {
    data: summaryData,
    isLoading: summaryLoading,
    refetch: refetchSummary
  } = useGetAllSuppliersPurchaseSummaryQuery({
    year: selectedYear
  });

  // Get outstanding balance for ALL suppliers
  const {
    data: balanceData,
    isLoading: balanceLoading,
    refetch: refetchBalance
  } = useGetAllSuppliersOutstandingQuery();

  // Get purchase analytics for ALL suppliers
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics
  } = useGetAllSuppliersPurchaseAnalyticsQuery({
    year: selectedYear
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSupplierChange = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setIsDropdownOpen(false);
    setSearchTerm('');
    // Reset to first page when supplier changes
    refetchHistory();
  };

  // Filter suppliers based on search term (includes ID, name, and address)
  const filteredSuppliers = suppliers.filter((supplier: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      supplier.id?.toString().toLowerCase().includes(searchLower) ||
      supplier.supplierName?.toLowerCase().includes(searchLower) ||
      supplier.companyName?.toLowerCase().includes(searchLower) ||
      supplier.address?.toLowerCase().includes(searchLower) ||
      `${supplier.supplierName} ${supplier.companyName}`.toLowerCase().includes(searchLower)
    );
  });

  const selectedSupplier = suppliers.find((s: any) => s.id.toString() === selectedSupplierId);

  // Get display text for selected supplier
  const getSelectedDisplayText = () => {
    if (selectedSupplierId === 'all') {
      return '📊 All Companies (Combined View)';
    }
    if (selectedSupplier) {
      return `🏢 ${selectedSupplier.supplierName} - ${selectedSupplier.companyName} (ID: ${selectedSupplier.id})`;
    }
    return 'Select Company';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} p-4 md:p-6`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Purchase History
            </h1>
            <p className={`mt-1 text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Track all purchases and payments
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 cursor-pointer py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Filter size={18} />
              Filters
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className={`px-4 py-2 cursor-pointer rounded-xl transition-all duration-300 flex items-center gap-2 ${theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <RefreshCw size={18} />
              Refresh
            </motion.button>
          
          </div>
        </div>
      </motion.div>

      {/* Supplier Selector Dropdown - Searchable */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-6 rounded-2xl p-4 shadow-xl transition-colors duration-300 ${theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        } border`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-blue-500" />
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Company:
            </span>
          </div>
          
          <div className="relative flex-1 max-w-md" ref={dropdownRef}>
            {/* Selected Value Display */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full px-4 py-2.5 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 flex items-center justify-between cursor-pointer ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
              } border`}
            >
              <span className="truncate">{getSelectedDisplayText()}</span>
              <ChevronDown 
                className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                size={18} 
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className={`absolute z-50 w-full mt-2 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
              } border`}>
                {/* Search Input */}
                <div className={`p-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} size={16} />
                    <input
                      type="text"
                      placeholder="Search by ID, name, or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-9 pr-8 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                        ? 'bg-gray-700 text-white placeholder-gray-400'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                      }`}
                      autoFocus
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600`}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Options List - Scrollable */}
                <div className="max-h-80 overflow-y-auto">
                  {/* All Companies Option */}
                  <div
                    onClick={() => handleSupplierChange('all')}
                    className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${selectedSupplierId === 'all'
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-200'
                      : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📊</span>
                      <div>
                        <div className="font-medium">All Companies (Combined View)</div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>

                  {/* Supplier Options */}
                  {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((supplier: any) => (
                      <div
                        key={supplier.id}
                        onClick={() => handleSupplierChange(supplier.id.toString())}
                        className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${selectedSupplierId === supplier.id.toString()
                          ? 'bg-blue-500 text-white'
                          : theme === 'dark'
                          ? 'hover:bg-gray-700 text-gray-200'
                          : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg mt-0.5">🏢</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {supplier.supplierName} - {supplier.companyName}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`px-4 py-8 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      No suppliers found matching &quot;{searchTerm}&quot;
                    </div>
                  )}
                </div>

                {/* Results Count */}
                {filteredSuppliers.length > 0 && (
                  <div className={`px-4 py-2 text-xs border-t ${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                    Found {filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedSupplierId !== 'all' && selectedSupplier && (
            <div className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'dark'
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-blue-100 text-blue-700'
            }`}>
              Showing: {selectedSupplier.supplierName} (ID: {selectedSupplier.id})
            </div>
          )}
        </div>
      </motion.div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`mb-6 rounded-2xl p-4 shadow-xl transition-colors duration-300 ${theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          } border`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
                } border`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
                } border`}
              />
            </div>
          </div>
          {(startDate || endDate ) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-1 ${theme === 'dark'
                  ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                  : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                }`}
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <AllSuppliersPurchaseSummaryCards
            summary={summaryData?.data} 
            isLoading={summaryLoading} 
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
        <div>
          <AllSuppliersOutstandingCard
            balance={balanceData?.data} 
            isLoading={balanceLoading} 
            onSupplierSelect={handleSupplierChange}
          />
        </div>
      </div>

      <AllSuppliersPurchaseHistoryList
          supplierId={selectedSupplierId !== 'all' ? selectedSupplierId : undefined}
          startDate={startDate}
          endDate={endDate}
          isLoading={historyLoading}
          transactions={historyData?.data?.transactions || []}
          summary={historyData?.data?.summary}
          pagination={historyData?.data?.pagination}
          onRefresh={refetchHistory}
        />
    </div>
  );
};

export default PurchaseHistoryDashboard;