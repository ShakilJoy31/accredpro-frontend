

import ServicesPage from "@/components/home/Service";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";

export async function generateMetadata() {
    return generateDynamicMetadata({
        title: "ISAB | Service",
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

const LoginPage = () => {
    return (
        <div className="min-h-screen ">
            <ServicesPage></ServicesPage>
        </div>
    )
}

export default LoginPage;
