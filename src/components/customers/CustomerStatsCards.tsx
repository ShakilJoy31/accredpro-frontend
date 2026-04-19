"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Star,
    DollarSign,
    MapPin,
    ShoppingBag
} from 'lucide-react';
import { useTheme } from '@/hooks/useThemeContext';

interface RetailerStatsCardsProps {
    stats?: {
        total: number;
        active: number;
        inactive: number;
        blacklisted: number;
        averageRating: string;
        totalPurchaseAmount: string;
        byCity: Array<{ city: string; count: number }>;
        byBusinessType: Array<{ businessType: string; count: number }>;
    };
}

const RetailerStatsCards: React.FC<RetailerStatsCardsProps> = ({ stats }) => {
    const { theme } = useTheme();

    const safeStats = stats || {
        total: 0,
        active: 0,
        inactive: 0,
        blacklisted: 0,
        averageRating: '0',
        totalPurchaseAmount: '0',
        byCity: [],
        byBusinessType: []
    };

    const statCards = [
        {
            title: 'Total Companies',
            value: safeStats.total,
            icon: Users,
            color: 'blue',
            bgColor: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
            textColor: 'text-blue-500',
            borderColor: theme === 'dark' ? 'border-blue-500/30' : 'border-blue-200',
        },
        {
            title: 'Active Companies',
            value: safeStats.active,
            icon: Users,
            color: 'green',
            bgColor: theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100',
            textColor: 'text-green-500',
            borderColor: theme === 'dark' ? 'border-green-500/30' : 'border-green-200',
        },
        {
            title: 'Average Rating',
            value: safeStats.averageRating,
            icon: Star,
            color: 'yellow',
            bgColor: theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100',
            textColor: 'text-yellow-500',
            borderColor: theme === 'dark' ? 'border-yellow-500/30' : 'border-yellow-200',
            suffix: '/5',
        },
        {
            title: 'Total Sales',
            value: safeStats.totalPurchaseAmount,
            icon: DollarSign,
            color: 'purple',
            bgColor: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100',
            textColor: 'text-purple-500',
            borderColor: theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200',
            prefix: '৳',
        },
    ];

    return (
        <div className="space-y-6 mb-8">
            {/* Main Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className={`${theme === 'dark'
                                ? `bg-gradient-to-br from-gray-800 to-gray-900 border-${card.color}-500/30`
                                : `bg-white border-${card.color}-200`
                                } rounded-xl p-6 shadow-lg border transition-all duration-300`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                                    <Icon className={`w-6 h-6 ${card.textColor}`} />
                                </div>
                                <span className={`text-sm font-medium px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                    {card.title}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {card.prefix && <span className="text-lg mr-1">{card.prefix}</span>}
                                    {card.value}
                                    {card.suffix && <span className="text-lg ml-1">{card.suffix}</span>}
                                </h3>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {card.title}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default RetailerStatsCards;