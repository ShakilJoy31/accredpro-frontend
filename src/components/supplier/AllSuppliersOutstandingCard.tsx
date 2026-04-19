"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { useTheme } from '@/hooks/useThemeContext';

interface AllSuppliersOutstandingCardProps {
  balance: any;
  isLoading: boolean;
  onSupplierSelect: (supplierId: string) => void;
}

const AllSuppliersOutstandingCard: React.FC<AllSuppliersOutstandingCardProps> = ({
  balance,
  isLoading,
  onSupplierSelect
}) => {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className={`h-96 rounded-2xl animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />
    );
  }

  if (!balance) return null;

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 transition-all duration-300 ${theme === 'dark'
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
      } border shadow-lg h-full`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Outstanding Balance Summary
        </h3>
        <div className={`p-2 rounded-xl ${parseFloat(balance.totalOutstanding) > 0 ? 'bg-orange-500/10' : 'bg-green-500/10'}`}>
          {parseFloat(balance.totalOutstanding) > 0 ? (
            <AlertTriangle size={20} className="text-orange-500" />
          ) : (
            <DollarSign size={20} className="text-green-500" />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Outstanding Across All Suppliers
          </p>
          <p className={`text-3xl font-bold ${parseFloat(balance.totalOutstanding) > 0 ? 'text-orange-500' : 'text-green-500'}`}>
            {formatCurrency(balance.totalOutstanding)}
          </p>
        </div>

        <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Total Purchases:</span>
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(balance.totalPurchases)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Total Payments:</span>
              <span className={`font-medium text-green-500`}>
                {formatCurrency(balance.totalPayments)}
              </span>
            </div>
          </div>
        </div>

        {/* Suppliers with Due */}
        {balance.suppliersWithDue && balance.suppliersWithDue.length > 0 && (
          <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Suppliers with Outstanding Balance
              </p>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {balance.suppliersWithDue.map((supplier: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => onSupplierSelect(supplier.supplierId.toString())}
                  className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${theme === 'dark'
                    ? 'hover:bg-gray-700 bg-gray-800/50'
                    : 'hover:bg-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {supplier.supplierName}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {supplier.companyName}
                      </p>
                    </div>
                    <p className={`text-sm font-bold text-orange-500`}>
                      {formatCurrency(supplier.outstandingBalance)}
                    </p>
                  </div>
                  {supplier.lastTransactionDate && (
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Last: {new Date(supplier.lastTransactionDate).toLocaleDateString()}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AllSuppliersOutstandingCard;