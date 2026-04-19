"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Filter,
  ChevronDown,
  Store,
  Search,
  X
} from 'lucide-react';
import { useTheme } from '@/hooks/useThemeContext';
import { useGetAllRetailersListQuery, useGetAllRetailersOutstandingQuery, useGetAllRetailersSellAnalyticsQuery, useGetAllRetailersSellHistoryQuery, useGetAllRetailersSellSummaryQuery } from '@/redux/api/customer/retailerSellHistoryApi';
import AllRetailersSellSummaryCards from './AllRetailersSellSummaryCards';
import AllRetailersOutstandingCard from './AllRetailersOutstandingCard';
import AllRetailersSellHistoryList from './AllRetailersSellHistoryList';

interface SellHistoryDashboardProps {
  initialRetailerId?: string;
}

const SellHistoryDashboard: React.FC<SellHistoryDashboardProps> = ({ initialRetailerId }) => {
  const { theme } = useTheme();
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedRetailerId, setSelectedRetailerId] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Searchable select states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get all retailers for dropdown
  const { data: retailersData } = useGetAllRetailersListQuery({page: 1, limit: 100000000});
  const retailers = retailersData?.data || [];

  // Get sell history for ALL retailers (with optional retailer filter)
  const {
    data: historyData,
    isLoading: historyLoading,
    refetch: refetchHistory
  } = useGetAllRetailersSellHistoryQuery({
    page: 1,
    limit: 50,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    retailerId: selectedRetailerId !== 'all' ? selectedRetailerId : undefined
  });

  // Get sell summary for ALL retailers
  const {
    data: summaryData,
    isLoading: summaryLoading,
    refetch: refetchSummary
  } = useGetAllRetailersSellSummaryQuery({
    year: selectedYear
  });

  // Get outstanding balance for ALL retailers
  const {
    data: balanceData,
    isLoading: balanceLoading,
    refetch: refetchBalance
  } = useGetAllRetailersOutstandingQuery();

  // Get sell analytics for ALL retailers
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics
  } = useGetAllRetailersSellAnalyticsQuery({
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
    refetchHistory();
    refetchSummary();
    refetchBalance();
    refetchAnalytics();
  };

  const handleRetailerChange = (retailerId: string) => {
    setSelectedRetailerId(retailerId);
    setIsDropdownOpen(false);
    setSearchTerm('');
    refetchHistory();
  };

  // Filter retailers based on search term (includes tradeLicenseNo, binNo, name, shop name, address, phone, email)
  const filteredRetailers = retailers.filter((retailer: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      retailer.tradeLicenseNo?.toString().toLowerCase().includes(searchLower) ||
      retailer.binNo?.toString().toLowerCase().includes(searchLower) ||
      retailer.retailerName?.toLowerCase().includes(searchLower) ||
      retailer.shopName?.toLowerCase().includes(searchLower) ||
      retailer.ownerName?.toLowerCase().includes(searchLower) ||
      retailer.address?.toLowerCase().includes(searchLower) ||
      retailer.phone?.toLowerCase().includes(searchLower) ||
      retailer.email?.toLowerCase().includes(searchLower) ||
      `${retailer.shopName} ${retailer.ownerName}`.toLowerCase().includes(searchLower) ||
      `${retailer.retailerName} ${retailer.shopName}`.toLowerCase().includes(searchLower)
    );
  });

  const selectedRetailer = retailers.find((r: any) => r.tradeLicenseNo?.toString() === selectedRetailerId);

  // Get display text for selected retailer
  const getSelectedDisplayText = () => {
    if (selectedRetailerId === 'all') {
      return '📊 All Retailers (Combined View)';
    }
    if (selectedRetailer) {
      return `🏪 ${selectedRetailer.shopName} - ${selectedRetailer.binNo} (License No: ${selectedRetailer.tradeLicenseNo})`;
    }
    return 'Select Retailer';
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
              Sell History
            </h1>
            <p className={`mt-1 text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Track all sales and payments from Companies
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

      {/* Retailer Selector Dropdown - Searchable */}
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
            <Store size={20} className="text-blue-500" />
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Retailer:
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
                      placeholder="Search retailers..."
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
                  {/* All Retailers Option */}
                  <div
                    onClick={() => handleRetailerChange('all')}
                    className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${selectedRetailerId === 'all'
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-200'
                      : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📊</span>
                      <div>
                        <div className="font-medium">All Retailers (Combined View)</div>
                        <div className={`text-xs ${selectedRetailerId === 'all' ? 'text-blue-100' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          View all retailers together
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>

                  {/* Retailer Options */}
                  {filteredRetailers.length > 0 ? (
                    filteredRetailers.map((retailer: any) => (
                      <div
                        key={retailer.tradeLicenseNo}
                        onClick={() => handleRetailerChange(retailer.tradeLicenseNo?.toString())}
                        className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${selectedRetailerId === retailer.tradeLicenseNo?.toString()
                          ? 'bg-blue-500 text-white'
                          : theme === 'dark'
                          ? 'hover:bg-gray-700 text-gray-200'
                          : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg mt-0.5">🏪</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {retailer.shopName} - {retailer.binNo}
                            </div>
                            <div className={`text-xs mt-1 space-y-0.5 ${selectedRetailerId === retailer.tradeLicenseNo?.toString() ? 'text-blue-100' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              <div className="truncate">
                                <span className="font-medium">ID No:</span> {retailer.tradeLicenseNo}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`px-4 py-8 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      No retailers found matching &quot;{searchTerm}&quot;
                    </div>
                  )}
                </div>

                {/* Results Count */}
                {filteredRetailers.length > 0 && (
                  <div className={`px-4 py-2 text-xs border-t ${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                    Found {filteredRetailers.length} retailer{filteredRetailers.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedRetailerId !== 'all' && selectedRetailer && (
            <div className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'dark'
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-blue-100 text-blue-700'
            }`}>
              Showing: {selectedRetailer.shopName} (License No: {selectedRetailer.tradeLicenseNo})
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
          {(startDate || endDate) && (
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
          <AllRetailersSellSummaryCards
            summary={summaryData?.data} 
            isLoading={summaryLoading} 
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
        <div>
          <AllRetailersOutstandingCard
            balance={balanceData?.data} 
            summary={summaryData?.data} 
            isLoading={balanceLoading} 
            onRetailerSelect={handleRetailerChange}
          />
        </div>
      </div>

      <AllRetailersSellHistoryList
        retailerId={selectedRetailerId !== 'all' ? selectedRetailerId : undefined}
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

export default SellHistoryDashboard;