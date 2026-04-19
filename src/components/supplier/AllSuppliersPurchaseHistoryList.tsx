"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
  TrendingUp,
  TrendingDown,
  Building2
} from 'lucide-react';
import { useTheme } from '@/hooks/useThemeContext';
import PurchaseTransactionModal from './SupplierPurchaseTransactionModal';

interface AllSuppliersPurchaseHistoryListProps {
  supplierId?: string;
  startDate?: string;
  endDate?: string;
  isLoading: boolean;
  transactions: any[];
  summary?: {
    totalAmount: string;
    totalPayment: string;
    totalDiscount: string;
    netDue: string;
    totalSuppliers?: number;
  };
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
  onRefresh: () => void;
}

const AllSuppliersPurchaseHistoryList: React.FC<AllSuppliersPurchaseHistoryListProps> = ({
  supplierId,
  startDate,
  endDate,
  isLoading,
  transactions,
  summary,
  pagination,
  onRefresh
}) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number, decimals: number = 3) => {
    return num.toFixed(decimals);
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <TrendingUp size={14} className="text-orange-500" />;
      case 'payment':
        return <TrendingDown size={14} className="text-green-500" />;
      default:
        return null;
    }
  };

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className={`rounded-2xl p-8 text-center ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}`}>
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading transactions...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 shadow-xl transition-colors duration-300 ${theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          } border`}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Purchases</p>
              <p className={`text-lg md:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(parseFloat(summary.totalAmount))}
              </p>
            </div>
            <div className="text-center">
              <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Deposit</p>
              <p className={`text-lg md:text-xl font-bold text-green-500`}>
                {formatCurrency(parseFloat(summary.totalPayment))}
              </p>
            </div>
            <div className="text-center">
              <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Discount</p>
              <p className={`text-lg md:text-xl font-bold text-purple-500`}>
                {formatCurrency(parseFloat(summary.totalDiscount))}
              </p>
            </div>
            <div className="text-center">
              <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Outstanding</p>
              <p className={`text-lg md:text-xl font-bold ${parseFloat(summary.netDue) > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                {formatCurrency(parseFloat(summary.netDue))}
              </p>
            </div>
            {summary.totalSuppliers !== undefined && (
              <div className="text-center">
                <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Suppliers</p>
                <p className={`text-lg md:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {summary.totalSuppliers}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-2xl shadow-xl overflow-hidden ${theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        } border`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <tr className={theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}>
                <th className="px-4 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Supplier</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Description</th>
                <th className="px-4 py-4 text-right text-sm font-semibold">Quantity</th>
                <th className="px-4 py-4 text-right text-sm font-semibold">Amount</th>
                <th className="px-4 py-4 text-right text-sm font-semibold">Payment</th>
                <th className="px-4 py-4 text-right text-sm font-semibold">Balance</th>
                <th className="px-4 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      No transactions found
                    </p>
                  </td>
                 </tr>
              ) : (
                transactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`border-t transition-colors duration-300 ${theme === 'dark'
                      ? 'border-gray-700 hover:bg-gray-800/50'
                      : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {transaction.formattedDate}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-blue-500" />
                        <span className="font-medium">
                          {transaction.supplierName || `Supplier #${transaction.supplierId}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate">
                      {transaction.description || '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      {formatNumber(transaction.quantity)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-green-500">
                      {formatCurrency(transaction.payment)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold">
                      <span className={transaction.balance > 0 ? 'text-orange-500' : 'text-green-500'}>
                        {formatCurrency(transaction.balance)}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleViewTransaction(transaction)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer duration-300 ${theme === 'dark'
                          ? 'hover:bg-gray-700 text-blue-400'
                          : 'hover:bg-gray-100 text-blue-600'
                        }`}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                   </motion.tr>
                ))
              )}
            </tbody>
           </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className={`p-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className={`text-sm order-2 sm:order-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing {(currentPage - 1) * (pagination.itemsPerPage || 20) + 1} to{' '}
                {Math.min(currentPage * (pagination.itemsPerPage || 20), pagination.totalItems)} of {pagination.totalItems} entries
              </div>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all duration-300 ${theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30'
                  } disabled:cursor-not-allowed`}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                  className={`p-2 rounded-lg transition-all duration-300 ${theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30'
                  } disabled:cursor-not-allowed`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedTransaction && (
          <PurchaseTransactionModal
            isOpen={isModalOpen}
            transaction={selectedTransaction}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTransaction(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllSuppliersPurchaseHistoryList;