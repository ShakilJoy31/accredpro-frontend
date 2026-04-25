'use client';

export default function StandardsWeCover() {
  const standards = [
    'ISO 17011',
    'ISO 17024',
    'ISO 17021',
    'PMP (PMI)',
    'ITIL (Axelos)',
    'Six Sigma'
  ];

  return (
    <section className='bg-gray-50'>
      <div className='max-w-[1280px] mx-auto px-4 py-16 overflow-hidden'>
        {/* Header */}
        <div className='text-center mb-10'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800'>
            Standards We Cover
          </h2>
          <p className='text-gray-500 mt-2'>
            International accreditation standards we support
          </p>
        </div>

        {/* Marquee Wrapper */}
        <div className='relative overflow-hidden'>
          <div className='flex w-max animate-marquee gap-6 hover:[animation-play-state:paused]'>
            {/* duplicate for smooth loop */}
            {standards.concat(standards).map(function (item, index) {
              return (
                <div
                  key={index}
                  className='min-w-[220px] px-6 py-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center text-lg font-semibold text-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-xl'
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>

        {/* Animation Style */}
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-marquee {
            animation: marquee 18s linear infinite;
          }
        `}</style>
      </div>
    </section>
  );
}
