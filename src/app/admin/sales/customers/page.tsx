
import RetailerDashboard from "@/components/customers/CustomerDashboard";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import { Suspense } from "react";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Retailers | Brother Enterprise",
    description: "Manage your retailers - Add, edit, and track all your retail businesses.",
    keywords: [
      "retailers", "retailer management", "retailer list",
      "retail business", "shop management", "retail clients",
      "retailer tracking", "sales tracking", "retailer database"
    ],
  });
}

const RetailersPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading Retailer Dashboard...</p>
        </div>
      </div>
    }>
      <RetailerDashboard />
    </Suspense>
  );
};

export default RetailersPage;