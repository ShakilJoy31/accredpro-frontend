import AccreditationBodiesCarousel from '@/components/home/AccreditationBodiesCarousel';
import AccreditationServices from '@/components/home/AccreditationServices';
import Banner from '@/components/home/Banner';
import CertificateVerifyWidget from '@/components/home/CertificateVerifyWidget';
import NewsFeed from '@/components/home/NewsFeed';
import StandardsWeCover from '@/components/home/StandardsWeCover';
import StatsBar from '@/components/home/StatsBar';
import TrustSignals from '@/components/home/TrustSignals';
import { generateDynamicMetadata } from '@/metadata/generateMetadata';

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: 'Linuxeon | Professional SMS & Bulk Messaging Platform',
    description:
      'Linuxeon is a cutting-edge SMS and bulk messaging platform that enables businesses to send transactional, promotional, and OTP messages globally. Reliable, scalable, and feature-rich messaging solutions.',
    keywords: [
      'linuxeon',
      'sms service',
      'bulk sms',
      'sms marketing',
      'text messaging',
      'sms gateway',
      'transactional sms',
      'promotional sms',
      'otp sms',
      'sms platform',
      'messaging api',
      'sms automation',
      'sms campaign',
      'sms software',
      'sms provider',
      'enterprise sms',
      'sms reseller',
      'sms gateway api',
      'global sms'
    ]
  });
}

export default function Home() {
  return (
    <div className='bg-[#F4F6F8] overflow-x-hidden '>
      <Banner />
      <StatsBar />
      <CertificateVerifyWidget />
      <AccreditationBodiesCarousel />
      <AccreditationServices />
      <StandardsWeCover />
      <NewsFeed />
      <TrustSignals />
    </div>
  );
}
