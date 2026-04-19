"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Star,
    DollarSign,
    ShoppingBag
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useThemeContext';
import { getUserInfo } from '@/utils/helper/userFromToken';
import { useGetRetailerStatsQuery } from '@/redux/api/customer/retailerApi';
import RetailerStatsCards from './CustomerStatsCards';
import RetailerList from './RetailerList';

const RetailerDashboard = () => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await getUserInfo();
            if (!userInfo) {
                router.push("/");
            } else {
                setUser(userInfo);
                setUserId(userInfo.id?.toString() || null);
            }
        };
        fetchUser();
    }, []);

    const router = useRouter();
    const { theme } = useTheme();

    const { data: statsData, isLoading: statsLoading } = useGetRetailerStatsQuery();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} p-2 md:p-3 lg:p-4`}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div>
                        <h1 className={`text-xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Retailer Management
                        </h1>
                        <p className={`mt-1 text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage all your retailers - from local shops to chain stores
                        </p>
                    </div>
                </div>

                {/* Welcome Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className={`${theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30'
                        : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                        } border rounded-xl p-6 shadow-lg transition-colors duration-300`}
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="relative">
                            <div className={`w-20 h-20 rounded-full ${theme === 'dark'
                                ? 'bg-blue-500/20'
                                : 'bg-blue-100'
                                } flex items-center justify-center overflow-hidden transition-colors duration-300`}>
                                <Users className="w-10 h-10 text-blue-500" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Welcome to Retailer Management
                            </h2>
                            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Here you can manage all your retailers - businesses that purchase products from you for resale.
                                Keep track of their contact information, payment terms, purchase history, and more.
                            </p>

                            {/* Quick Tips */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                                        <ShoppingBag className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Track Purchases
                                        </p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Monitor retailer buying history
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-100'}`}>
                                        <DollarSign className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Credit Management
                                        </p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Set and track credit limits
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-100'}`}>
                                        <Star className="w-4 h-4 text-yellow-500" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Rate Retailers
                                        </p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Track retailer reliability
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Statistics */}
            {statsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-32 rounded-xl animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />
                    ))}
                </div>
            ) : statsData?.data && (
                <RetailerStatsCards stats={statsData.data} />
            )}

            {/* Retailer List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <RetailerList userId={userId} />
            </motion.div>
        </div>
    );
};

export default RetailerDashboard;