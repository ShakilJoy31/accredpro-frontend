// components/students/StudentStatsCards.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Award, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { useTheme } from '@/hooks/useThemeContext';

interface StudentStatsCardsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    completed: number;
    certificateIssued: number;
    paymentStats: {
      paid: number;
      partial: number;
      pending: number;
    };
    financialStats: {
      totalRevenue: number;
      totalDue: number;
    };
  };
}

const StudentStatsCards: React.FC<StudentStatsCardsProps> = ({ stats }) => {
  const { theme } = useTheme();

  const cards = [
    {
      title: "Total Students",
      value: stats.total,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500"
    },
    {
      title: "Active Students",
      value: stats.active,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      textColor: "text-green-500"
    },
    {
      title: "Completed Courses",
      value: stats.completed,
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500"
    },
    {
      title: "Certificates Issued",
      value: stats.certificateIssued,
      icon: Award,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-500"
    },
    {
      title: "Total Revenue",
      value: `৳${stats.financialStats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-500"
    },
    {
      title: "Pending Due",
      value: `৳${stats.financialStats.totalDue.toLocaleString()}`,
      icon: Clock,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-500/10",
      textColor: "text-red-500"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`rounded-xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl ${theme === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {card.title}
            </p>
            <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((stats.total > 0 ? (card.value as number) / stats.total * 100 : 0), 100)}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StudentStatsCards;