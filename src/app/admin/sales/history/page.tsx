import SellHistoryDashboard from "@/components/customers/RetailerSellHistoryDashboard";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import { Suspense } from "react";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Sell History | Brother Enterprise",
    description: "View and track sell history across all retailers. Monitor payments, outstanding balances, and retailer analytics.",
    keywords: [
      "sell history", "all retailers", "retailer transactions", 
      "payment tracking", "retailer analytics", "outstanding balance",
      "sales history", "retailer payments"
    ],
  });
}

const SellHistoryPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading Sell History...</p>
        </div>
      </div>
    }>
      <SellHistoryDashboard />
    </Suspense>
  );
};

export default SellHistoryPage;