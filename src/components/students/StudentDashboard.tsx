// components/students/StudentDashboard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    GraduationCap,
    Award,
    DollarSign,
    UserPlus,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useThemeContext';
import { getUserInfo } from '@/utils/helper/userFromToken';
import { useGetStudentStatsQuery } from '@/redux/api/student/studentApi';
import StudentStatsCards from './StudentStatsCards';
import StudentList from './StudentList';

const StudentDashboard = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const { theme } = useTheme();

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await getUserInfo();
            if (!userInfo) {
                router.push("/");
            } else {
                setUser(userInfo);
            }
        };
        fetchUser();
    }, [router]);

    const { data: statsData, isLoading: statsLoading } = useGetStudentStatsQuery();

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
                            Student Management
                        </h1>
                        <p className={`mt-1 text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage all students - enrollments, attendance, certificates, and payments
                        </p>
                    </div>
                </div>

                {/* Welcome Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className={`${theme === 'dark'
                        ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-500/30'
                        : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
                        } border rounded-xl p-6 shadow-lg transition-colors duration-300`}
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="relative">
                            <div className={`w-20 h-20 rounded-full ${theme === 'dark'
                                ? 'bg-orange-500/20'
                                : 'bg-orange-100'
                                } flex items-center justify-center overflow-hidden transition-colors duration-300`}>
                                <GraduationCap className="w-10 h-10 text-orange-500" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Welcome to Student Management
                            </h2>
                            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Here you can manage all students enrolled in courses. Track their attendance, issue certificates,
                                manage payments, and monitor their overall progress.
                            </p>

                            {/* Quick Tips */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-100'}`}>
                                        <UserPlus className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Add Students
                                        </p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Register new students
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                                        <Clock className="w-4 h-4 text-blue-500" />
                                    </div> 
                                    <div>
                                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Track Attendance
                                        </p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Monitor class participation
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-100'}`}>
                                        <Award className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Issue Certificates
                                        </p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Generate completion certificates
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-100'}`}>
                                        <DollarSign className="w-4 h-4 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Manage Payments
                                        </p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Track fee collections
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
                <StudentStatsCards stats={statsData.data} />
            )}

           
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <StudentList />
            </motion.div>
        </div>
    );
};

export default StudentDashboard;