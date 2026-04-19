"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  DollarSign,
  Percent,
  TrendingUp,
  Package,
  Store
} from 'lucide-react';
import { useTheme } from '@/hooks/useThemeContext';

interface AllRetailersSellSummaryCardsProps {
  summary: any;
  isLoading: boolean;
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const AllRetailersSellSummaryCards: React.FC<AllRetailersSellSummaryCardsProps> = ({
  summary,
  isLoading,
  selectedYear,
  onYearChange
}) => {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`h-32 rounded-2xl animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const cards = [
    {
      title: 'Total Credit (Khoroc)',
      value: formatCurrency(summary.overall.totalPurchaseAmount),
      icon: ShoppingBag,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Total Debit (Joma)',
      value: formatCurrency(summary.overall.totalPayments),
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Total Discount',
      value: formatCurrency(summary.overall.totalDiscount),
      icon: Percent,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Outstanding Balance',
      value: formatCurrency(summary.overall.outstandingBalance),
      icon: TrendingUp,
      color: parseFloat(summary.overall.outstandingBalance) > 0 ? 'text-orange-500' : 'text-green-500',
      bgColor: parseFloat(summary.overall.outstandingBalance) > 0 ? 'bg-orange-500/10' : 'bg-green-500/10'
    },
    {
      title: 'Total Companies',
      value: summary.overall.totalRetailers,
      icon: Store,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    },
    {
      title: 'Active Companies',
      value: summary.overall.activeRetailers,
      icon: Package,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-2xl p-5 transition-all duration-300 ${theme === 'dark'
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            } border shadow-lg hover:shadow-xl`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {card.title}
            </p>
            <p className={`text-xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Top Retailers Table */}
      {summary.topRetailers && summary.topRetailers.length > 0 && (
        <div className={`rounded-2xl p-5 mt-4 ${theme === 'dark'
          ? 'bg-gray-800/50'
          : 'bg-gray-50'
        }`}>
          <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Top Companies by Sales Amount
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="px-3 py-2 text-left">Company</th>
                  <th className="px-3 py-2 text-left">Owner</th>
                  <th className="px-3 py-2 text-right">Total Sales</th>
                  <th className="px-3 py-2 text-right">Received</th>
                  <th className="px-3 py-2 text-right">Outstanding</th>
                  <th className="px-3 py-2 text-center">Transactions</th>
                 </tr>
              </thead>
              <tbody>
                {summary.topRetailers.map((retailer: any, idx: number) => (
                  <tr key={idx} className={`border-b ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                    <td className="px-3 py-2">
                      <div>
                        <p className="font-medium">{retailer.shopName}</p>
                      </div>
                     </td>
                    <td className="px-3 py-2 text-sm text-gray-500">
                      {retailer.ownerName}
                     </td>
                    <td className="px-3 py-2 text-right text-blue-500">
                      {formatCurrency(retailer.totalAmount)}
                     </td>
                    <td className="px-3 py-2 text-right text-green-500">
                      {formatCurrency(retailer.totalPayments)}
                     </td>
                    <td className="px-3 py-2 text-right">
                      <span className={parseFloat(retailer.outstandingBalance) > 0 ? 'text-orange-500' : 'text-green-500'}>
                        {formatCurrency(retailer.outstandingBalance)}
                      </span>
                     </td>
                    <td className="px-3 py-2 text-center">
                      {retailer.transactionCount}
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRetailersSellSummaryCards;