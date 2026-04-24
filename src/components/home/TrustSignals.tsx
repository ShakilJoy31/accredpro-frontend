import Image from 'next/image';
import partners from '@/assets/Home/partners.png';
import iaf from '@/assets/Home/iaf.jpg';
import ilac from '@/assets/Home/ilac.png';
import accreditation from '@/assets/Home/accreditation.jpg';

export default function TrustSignals() {
  const items = [
    {
      title: 'IAF Member',
      image: iaf
    },
    {
      title: 'ILAC Recognition',
      image: ilac
    },
    {
      title: 'Government Approved',
      image: accreditation
    },
    {
      title: 'International Partners',
      image: partners
    }
  ];

  return (
    <section className='w-full py-16 bg-gray-50'>
      <div className='max-w-[1280px] mx-auto px-4'>
        {/* Heading */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800'>
            Trusted & Recognized
          </h2>
          <p className='text-gray-500 mt-2'>
            We are globally acknowledged and affiliated with leading
            organizations
          </p>
        </div>

        {/* Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {items.map((item, index) => (
            <div
              key={index}
              className='bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition duration-300'
            >
              <Image
                src={item.image}
                alt={item.title}
                width={120}
                height={120}
                className='object-contain mb-4'
              />

              <h3 className='text-sm font-semibold text-gray-700'>
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
