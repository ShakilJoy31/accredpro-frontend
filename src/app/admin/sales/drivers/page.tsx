import DriverDashboard from "@/components/driver/DriverDashboard";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import { Suspense } from "react";

export async function generateMetadata() {
    return generateDynamicMetadata({
        title: "Drivers | Brother Enterprise",
        description: "Manage your drivers - Add, edit, and track all your drivers and their vehicles.",
        keywords: [
            "drivers", "driver management", "driver list",
            "fleet management", "vehicle drivers", "transport drivers",
            "driver tracking", "delivery drivers", "driver database"
        ],
    });
}

const DriversPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-300">Loading Driver Dashboard...</p>
                </div>
            </div>
        }>
            <DriverDashboard />
        </Suspense>
    );
};

export default DriversPage;