import React from "react";
import { Suspense } from "react";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import RetailerCalculationWrapper from "@/components/customers/RetailerCalculationWrapper";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Retailer Calculations | Brother Enterprise",
    description: "Manage daily transactions, quantities, and balances for your retailers. Track purchases, deposits, and outstanding balances.",
    keywords: [
      "retailer calculations", "retailer transactions", "sales tracking",
      "retailer balance", "daily transactions", "retailer ledger",
      "inventory sales", "retailer payments", "business accounting"
    ],
  });
}

const RetailerCalculationsPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading Retailer Calculations...</p>
        </div>
      </div>
    }>
      <RetailerCalculationWrapper />
    </Suspense>
  );
};

export default RetailerCalculationsPage;