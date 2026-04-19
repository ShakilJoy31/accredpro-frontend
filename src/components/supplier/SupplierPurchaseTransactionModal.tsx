"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Calendar,
  Package,
  DollarSign,
  CreditCard,
  Receipt,
  Tag,
  FileText,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useTheme } from '@/hooks/useThemeContext';

interface PurchaseTransactionModalProps {
  isOpen: boolean;
  transaction: any;
  onClose: () => void;
}

const PurchaseTransactionModal: React.FC<PurchaseTransactionModalProps> = ({
  isOpen,
  transaction,
  onClose
}) => {
  const { theme } = useTheme();

  if (!isOpen || !transaction) return null;

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

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'text-orange-500 bg-orange-500/10';
      case 'payment':
        return 'text-green-500 bg-green-500/10';
      case 'payment_with_purchase':
        return 'text-purple-500 bg-purple-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`rounded-2xl w-full max-w-2xl shadow-2xl ${theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        } border overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${getTransactionTypeColor(transaction.transactionType)}`}>
              {transaction.transactionType === 'purchase' ? (
                <TrendingUp size={24} />
              ) : transaction.transactionType === 'payment' ? (
                <TrendingDown size={24} />
              ) : (
                <Receipt size={24} />
              )}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Transaction Details
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg cursor-pointer transition-colors duration-300 ${theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] scrollbar-hide overflow-y-auto">
          {/* Date and Reference */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-blue-500" />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Date</span>
              </div>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {transaction.formattedDate}
              </p>
            </div>
            {/* Description */}
          {transaction.description && (
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-gray-500" />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Description</span>
              </div>
              <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {transaction.description}
              </p>
            </div>
          )}
          </div>

         

          {/* Financial Details */}
          <div className="grid grid-cols-2 gap-4">
            {transaction.quantity > 0 && (
              <div className={`p-4 rounded-xl text-center ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package size={16} className="text-blue-500" />
                </div>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formatNumber(transaction.quantity)}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Quantity</p>
              </div>
            )}
            {transaction.rate > 0 && (
              <div className={`p-4 rounded-xl text-center ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign size={16} className="text-green-500" />
                </div>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(transaction.rate)}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Rate per Unit</p>
              </div>
            )}
            {transaction.amount > 0 && (
              <div className={`p-4 rounded-xl text-center ${theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CreditCard size={16} className="text-orange-500" />
                </div>
                <p className={`text-2xl font-bold text-orange-500`}>
                  {formatCurrency(transaction.amount)}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Amount</p>
              </div>
            )}
            {transaction.payment > 0 && (
              <div className={`p-4 rounded-xl text-center ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Receipt size={16} className="text-green-500" />
                </div>
                <p className={`text-2xl font-bold text-green-500`}>
                  {formatCurrency(transaction.payment)}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Payment</p>
              </div>
            )}
          </div>

          {/* Balance and Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${transaction.balance > 0 ? 'bg-orange-500/10' : 'bg-green-500/10'}`}>
              <p className={`text-sm mb-1 ${transaction.balance > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                Remaining Balance
              </p>
              <p className={`text-2xl font-bold ${transaction.balance > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                {formatCurrency(transaction.balance)}
              </p>
            </div>
            {transaction.discount > 0 && (
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                <p className={`text-sm mb-1 text-purple-400`}>Discount Applied</p>
                <p className={`text-2xl font-bold text-purple-500`}>
                  {formatCurrency(transaction.discount)}
                </p>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>Created: </span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {new Date(transaction.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>Last Updated: </span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {new Date(transaction.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl transition-all duration-300 ${theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PurchaseTransactionModal;