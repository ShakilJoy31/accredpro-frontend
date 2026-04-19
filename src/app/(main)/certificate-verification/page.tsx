// app/page.tsx
import CertificateVerification from "@/components/home/Certificate/CertificateVerification";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import Image from "next/image";
import worldImage from "../../../../public/9d5b46ec-d590-4454-b626-514f3fdbf6be.jpg";


export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "FIT INFOTECH | Certificate Verification",
    description: "Linuxeon is a cutting-edge SMS and bulk messaging platform that enables businesses to send transactional, promotional, and OTP messages globally. Reliable, scalable, and feature-rich messaging solutions.",
    keywords: [
      "linuxeon", "sms service", "bulk sms", "sms marketing",
      "text messaging", "sms gateway", "transactional sms",
      "promotional sms", "otp sms", "sms platform", "messaging api",
      "sms automation", "sms campaign", "sms software", "sms provider",
      "enterprise sms", "sms reseller", "sms gateway api", "global sms"
    ],
  });
}

const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="absolute bottom-0 w-full opacity-70">
        <Image
          src={worldImage}
          alt="earth"
          className="w-full object-cover"
          priority
        />
      </div>
      <CertificateVerification />
    </div>
  );
};

export default Home;