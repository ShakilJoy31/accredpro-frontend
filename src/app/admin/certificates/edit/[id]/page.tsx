// app/(dashboard)/certificates/edit/[id]/page.tsx
import { Suspense } from "react";
import EditCertificate from "@/components/authentication/EditCertificate";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return generateDynamicMetadata({
    title: `Edit Certificate} | Admin Dashboard`,
    description: "Edit certificate information and details.",
    keywords: ["edit certificate", "update certificate", "certificate management"],
  });
}

export default function EditCertificatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading certificate data...</p>
        </div>
      </div>
    }>
      <EditCertificate />
    </Suspense>
  );
}