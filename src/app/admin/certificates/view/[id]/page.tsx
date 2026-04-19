import { Suspense } from "react";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import ViewCertificate from "@/components/authentication/ViewCertificate";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return generateDynamicMetadata({
    title: `Certificate Details ${id ? `- Certificate #${id}` : ''} | Admin Dashboard`,
    description: "View certificate information and details.",
    keywords: ["certificate details", "view certificate", "ISO certification"],
  });
}

export default function ViewCertificatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading certificate details...</p>
        </div>
      </div>
    }>
      <ViewCertificate />
    </Suspense>
  );
}