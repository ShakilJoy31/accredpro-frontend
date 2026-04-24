import {
  FaLinkedinIn,
  FaFacebookF,
  FaTwitter,
  FaGlobe,
  FaCheckCircle
} from 'react-icons/fa';
import { MdLocationOn, MdEmail } from 'react-icons/md';
import Image from 'next/image';
import siteLogo from '../../../public/The_Logo/linuxeon_logo.png';
import Paragraph from '../reusable-components/Paragraph';
import Heading from '../reusable-components/Heading';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-gray-100 text-gray-900 pt-10 border-t border-gray-200'>
      {/* Main Grid */}
      <div className='container mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8'>
        {/* Logo & Info */}
        <div className='col-span-2'>
          <Image
            src={siteLogo}
            alt='Accreditation Body'
            width={160}
            height={60}
            className='mb-4'
          />

          <div className='flex items-start gap-2 mb-3'>
            <MdLocationOn className='text-blue-400 mt-1' />
            <Paragraph className='text-sm'>
              International Accreditation & Certification Body ensuring global
              compliance and standards.
            </Paragraph>
          </div>

          <div className='flex items-center gap-2 mb-2'>
            <MdEmail className='text-blue-400' />
            <Paragraph className='text-sm'>support@accreditation.org</Paragraph>
          </div>

          {/* Social */}
          <div className='flex gap-3 mt-5'>
            {[FaLinkedinIn, FaFacebookF, FaTwitter, FaGlobe].map((Icon, i) => (
              <Link
                key={i}
                href='#'
                className='bg-blue-600 hover:bg-blue-500 p-2 rounded-full text-white transition'
              >
                <Icon />
              </Link>
            ))}
          </div>
        </div>

        {/* Accreditation Services */}
        <div>
          <div className='text-xl font-semibold mb-4 text-gray-900'>
            Accreditation Services
          </div>
          <ul className='space-y-2 text-sm'>
            {[
              'Initial Accreditation',
              'Surveillance Audit',
              'Re-Accreditation',
              'Scope Extension',
              'Remote Assessment',
              'Witness Assessment'
            ].map((item, index) => (
              <li key={index} className='hover:text-blue-500 cursor-pointer'>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Certification Standards */}
        <div>
          <div className='text-xl font-semibold mb-4 text-gray-900'>
            Standards We Cover
          </div>
          <ul className='space-y-2 text-sm'>
            {[
              'ISO 9001 (Quality)',
              'ISO 14001 (Environment)',
              'ISO 45001 (OH&S)',
              'ISO 22000 (Food Safety)',
              'ISO 27001 (Information Security)',
              'ISO 17025 (Laboratories)'
            ].map((item, index) => (
              <li key={index} className='hover:text-blue-500 cursor-pointer'>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <div className='text-xl font-semibold mb-4 text-gray-900'>
            Quick Links
          </div>
          <ul className='space-y-2 text-sm'>
            {[
              'About Us',
              'Verify Certificate',
              'Apply for Accreditation',
              'Accredited Bodies',
              'News & Updates',
              'Contact'
            ].map((item, index) => (
              <li key={index} className='hover:text-blue-500 cursor-pointer'>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <div className='container mx-auto mt-12 px-4 sm:px-6'>
        <div className='bg-gradient-to-r from-green-700 to-blue-600 rounded-xl p-6 md:p-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div>
              <Heading className='text-xl text-white mb-2'>
                Stay Updated
              </Heading>
              <Paragraph className='text-sm text-gray-200'>
                Get latest accreditation updates, standards, and compliance
                news.
              </Paragraph>
            </div>

            <div className='flex gap-2 w-full md:w-auto'>
              <input
                type='email'
                placeholder='Enter your email'
                className='px-4 py-2 rounded-lg w-full md:w-64 text-black placeholder:text-gray-300 border border-gray-100'
              />
              <button className='bg-white text-blue-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-200 cursor-pointer'>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='container mx-auto mt-10 border-t border-gray-400 py-5 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-3'>
        <Paragraph className='text-sm'>
          © {new Date().getFullYear()} Accreditation Body. All rights reserved.
        </Paragraph>

        <div className='flex flex-wrap items-center gap-3 text-sm'>
          <span className='flex items-center gap-1 text-green-500'>
            <FaCheckCircle /> Trusted & Verified
          </span>

          <span>|</span>

          <Link href='/privacy-policy' className='hover:text-blue-400'>
            Privacy Policy
          </Link>

          <span>|</span>

          <Link href='/terms' className='hover:text-blue-400'>
            Terms of Service
          </Link>

          <span>|</span>

          <Link href='/accessibility' className='hover:text-blue-400'>
            Accessibility
          </Link>

          <span>|</span>

          <Link href='/cookie-policy' className='hover:text-blue-400'>
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
