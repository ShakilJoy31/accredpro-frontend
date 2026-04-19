
import StudentDashboard from "@/components/students/StudentDashboard";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import { Suspense } from "react";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Student Management | FIT INFOTECH",
    description: "Manage all students - Add, edit, track attendance, issue certificates, and manage payments.",
    keywords: [
      "students", "student management", "student list",
      "attendance tracking", "certificate issuance", "student payments",
      "course enrollment", "student progress"
    ],
  });
}

const StudentsPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading Student Dashboard...</p>
        </div>
      </div>
    }>
      <StudentDashboard />
    </Suspense>
  );
};

export default StudentsPage;