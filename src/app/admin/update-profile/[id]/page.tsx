import ProfileUpdate from "@/components/client-components/ProfileUpdate";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import { Suspense } from "react";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Update Profile | Linuxeon",
    description: "Update your profile information and password settings.",
    keywords: [
      "profile update", "change password", "account settings",
      "user profile", "security settings", "account management"
    ],
  });
}

const ProfileUpdatePage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading profile...</p>
        </div>
      </div>
    }>
      <ProfileUpdate />
    </Suspense>
  );
};

export default ProfileUpdatePage;