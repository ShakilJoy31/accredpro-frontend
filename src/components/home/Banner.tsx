export default function Banner() {
  return (
    <section className='relative py-16' id='home'>
      <div
        aria-hidden='true'
        className='absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20'
      >
        <div className='blur-[106px] h-56 bg-gradient-to-br from-green-600 to-blue-700'></div>
        <div className='blur-[106px] h-32 bg-gradient-to-r from-green-700 to-blue-600'></div>
      </div>
      <div className='relative sm:pt-16 ml-auto'>
        <div className='lg:w-2/3 text-center mx-auto'>
          <h1 className='text-gray-900 font-bold text-4xl md:text-5xl xl:text-6xl'>
            Trusted Accreditation for Professional Excellence <br />
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-blue-600'>
              Listing ISO, PMP, ITIL etc
            </span>
          </h1>

          <p className='mt-8 text-gray-700'>
            Empowering professionals with globally recognized certifications.
            Verify credentials instantly and build trust in your organization.
            <br />
            AccredPro is the trusted platform for verifying and managing
            professional credentials.
          </p>

          <div className='mt-10 flex flex-wrap justify-center gap-y-4 gap-x-6'>
            <button className='px-8 py-2.5 rounded-full bg-gradient-to-r from-green-700 to-blue-600 text-white hover:from-green-800 hover:to-blue-700 transition-all duration-300 cursor-pointer'>
              Verify a Certificate
            </button>
            <button className='px-8 py-2.5 rounded-full bg-gradient-to-r from-green-700 to-blue-600 text-white hover:from-green-800 hover:to-blue-700 transition-all duration-300 cursor-pointer'>
              Apply for Accreditation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
