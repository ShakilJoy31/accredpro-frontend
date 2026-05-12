// app/(routes)/admin/documents/approval/page.tsx
import DocumentApprovalDashboard from "@/components/students/StudentDocumentApprovalDashboard";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import { Suspense } from "react";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Document Approval Dashboard | Admin",
    description: "Review, approve, or reject student documents for certificate issuance.",
    keywords: ["document approval", "admin", "certificate documents", "review documents"],
  });
}

const DocumentApprovalPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading Document Approval Dashboard...</p>
        </div>
      </div>
    }>
      <DocumentApprovalDashboard />
    </Suspense>
  );
};

export default DocumentApprovalPage;