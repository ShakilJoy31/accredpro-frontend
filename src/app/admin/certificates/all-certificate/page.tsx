// app/(dashboard)/certificates/page.tsx
import { Suspense } from "react";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import CertificateList from "@/components/authentication/CertificateList";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Certificates | Admin Dashboard",
    description: "Manage certificates - view, add, edit, and delete certificate records.",
    keywords: ["certificates", "ISO certification", "quality management", "certificate management"],
  });
}

export default function CertificatesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading certificates...</p>
        </div>
      </div>
    }>
      <CertificateList />
    </Suspense>
  );
}