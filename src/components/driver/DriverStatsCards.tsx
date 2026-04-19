"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Truck,
    Star,
    MapPin,
    Briefcase,
    TrendingUp
} from 'lucide-react';
import { useTheme } from '@/hooks/useThemeContext';

interface DriverStatsCardsProps {
    stats?: {
        total: number;
        active: number;
        inactive: number;
        onLeave: number;
        terminated: number;
        averageRating: string;
        totalTrips: number;
        totalEarnings: string;
        byVehicleType: Array<{ vehicleType: string; count: number }>;
        byCity: Array<{ city: string; count: number }>;
        byEmploymentType: Array<{ employmentType: string; count: number }>;
    };
}

const DriverStatsCards: React.FC<DriverStatsCardsProps> = ({ stats }) => {
    const { theme } = useTheme();

    // Default values if stats is undefined
    const safeStats = stats || {
        total: 0,
        active: 0,
        inactive: 0,
        onLeave: 0,
        terminated: 0,
        averageRating: '0',
        totalTrips: 0,
        totalEarnings: '0',
        byVehicleType: [],
        byCity: [],
        byEmploymentType: []
    };

    const statCards = [
        {
            title: 'Total Drivers',
            value: safeStats.total,
            icon: Users,
            color: 'blue',
            bgColor: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
            textColor: 'text-blue-500',
            borderColor: theme === 'dark' ? 'border-blue-500/30' : 'border-blue-200',
        },
        {
            title: 'Active Drivers',
            value: safeStats.active,
            icon: Truck,
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
            title: 'Total Trips',
            value: safeStats.totalTrips,
            icon: TrendingUp,
            color: 'purple',
            bgColor: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100',
            textColor: 'text-purple-500',
            borderColor: theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200',
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
                                    {/* {card.prefix && <span className="text-lg mr-1">{card.prefix}</span>} */}
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

            {/* Additional Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* By Vehicle Type */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className={`${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                        } rounded-xl p-6 shadow-lg border transition-colors duration-300`}
                >
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <Truck size={20} className="text-blue-500" />
                        Drivers by Vehicle Type
                    </h3>
                    <div className="space-y-3">
                        {safeStats.byVehicleType.length === 0 ? (
                            <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                No vehicle type data available
                            </p>
                        ) : (
                            safeStats.byVehicleType.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className={`text-sm capitalize ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {item.vehicleType}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{
                                                    width: `${(item.count / safeStats.active) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {item.count}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* By City */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className={`${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                        } rounded-xl p-6 shadow-lg border transition-colors duration-300`}
                >
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <MapPin size={20} className="text-green-500" />
                        Drivers by City
                    </h3>
                    <div className="space-y-3">
                        {safeStats.byCity.length === 0 ? (
                            <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                No city data available
                            </p>
                        ) : (
                            safeStats.byCity.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {item.city}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 rounded-full"
                                                style={{
                                                    width: `${(item.count / safeStats.active) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {item.count}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* By Employment Type */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className={`${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                        } rounded-xl p-6 shadow-lg border transition-colors duration-300`}
                >
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <Briefcase size={20} className="text-purple-500" />
                        Drivers by Employment Type
                    </h3>
                    <div className="space-y-3">
                        {safeStats.byEmploymentType.length === 0 ? (
                            <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                No employment type data available
                            </p>
                        ) : (
                            safeStats.byEmploymentType.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className={`text-sm capitalize ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {item.employmentType}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-purple-500 rounded-full"
                                                style={{
                                                    width: `${(item.count / safeStats.active) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {item.count}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DriverStatsCards;