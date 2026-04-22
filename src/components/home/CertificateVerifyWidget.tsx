'use client';

import { useState } from 'react';
import { FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Image from 'next/image';
import certification_verify from '@/assets/Home/certification_verify.svg';

export default function CertificateVerifyWidget() {
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleVerify() {
    if (!certificateId.trim()) {
      setError('Please enter a Certificate ID');
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const res = await fetch(`/api/verify-certificate?id=${certificateId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleVerify();
    }
  }

  return (
    <div className='max-w-[1280px] mx-auto w-full px-4 py-16'>
      <div className='grid md:grid-cols-2 gap-10 items-center'>
        {/* 🔹 Left Section */}
        <div className='flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl'>
          <Image
            src={certification_verify}
            width={600}
            height={600}
            alt='Certificate Verification'
            className='max-w-sm w-full drop-shadow-xl'
          />
        </div>

        {/* 🔹 Right Section */}
        <div className='bg-white border border-gray-100 shadow-xl rounded-3xl p-8 md:p-10'>
          <h2 className='text-3xl font-bold text-gray-800 mb-2'>
            Verify Certificate
          </h2>

          <p className='text-gray-500 text-sm mb-8 leading-relaxed'>
            Enter your certificate ID below to instantly verify its authenticity
            and validity.
          </p>

          {/* Input */}
          <div className='flex flex-col gap-4'>
            <input
              type='text'
              placeholder='e.g. CERT-2025-ABC123'
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-full px-5 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-black'
            />

            <button
              onClick={handleVerify}
              disabled={loading}
              className='w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-green-700 to-blue-600 text-white hover:from-green-800 hover:to-blue-700 transition-all duration-300 cursor-pointer rounded-xl font-medium active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-50'
            >
              <FaSearch className='text-sm' />
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className='mt-5 flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-100 p-3 rounded-lg'>
              <FaTimesCircle className='mt-0.5' />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {result && (
            <div className='mt-6 p-5 border border-green-100 rounded-xl bg-green-50'>
              <div className='flex items-center gap-2 text-green-700 mb-3'>
                <FaCheckCircle />
                <span className='font-semibold text-base'>
                  Certificate Verified Successfully
                </span>
              </div>

              <div className='text-sm text-gray-700 space-y-2'>
                <p>
                  <span className='text-gray-500'>Name:</span>{' '}
                  <strong>{result.name}</strong>
                </p>
                <p>
                  <span className='text-gray-500'>Course:</span>{' '}
                  <strong>{result.course}</strong>
                </p>
                <p>
                  <span className='text-gray-500'>Issued Date:</span>{' '}
                  <strong>{result.issued_at}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
