"use client";

import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { useTheme } from "@/hooks/useThemeContext";
import SupplierCalculation from "./SupplierCalculation";

const SupplierCalculationWrapper = () => {
  const params = useParams();
  const supplierId = params.id as string;
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} p-4 md:p-6 lg:p-8`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
            <Building2 className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Company Calculations
            </h1>
            <p className={`mt-1 text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage daily transactions, quantities, and balances for this Company.
            </p>
          </div>
        </div>
      </motion.div>

      <SupplierCalculation supplierId={supplierId} />
    </div>
  );
};

export default SupplierCalculationWrapper;