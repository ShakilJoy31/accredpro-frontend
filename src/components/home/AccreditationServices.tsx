import {
  FaCheckCircle,
  FaSyncAlt,
  FaRedoAlt,
  FaExpandArrowsAlt
} from 'react-icons/fa';

export default function AccreditationServices() {
  const services = [
    {
      title: 'Initial Accreditation',
      description:
        'Comprehensive assessment for first-time accreditation ensuring compliance with required standards.',
      icon: <FaCheckCircle className='text-4xl' />
    },
    {
      title: 'Surveillance',
      description:
        'Periodic monitoring to ensure continued compliance and performance of accredited bodies.',
      icon: <FaSyncAlt className='text-4xl' />
    },
    {
      title: 'Renewal',
      description:
        'Re-evaluation process to maintain accreditation status after the validity period expires.',
      icon: <FaRedoAlt className='text-4xl' />
    },
    {
      title: 'Extension of Scope',
      description:
        'Expand accreditation coverage to include additional services or operational areas.',
      icon: <FaExpandArrowsAlt className='text-4xl' />
    }
  ];

  return (
    <section className='max-w-[1280px] mx-auto w-full px-4 py-16'>
      {/* Header */}
      <div className='text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800'>
          Services Overview
        </h2>
        <p className='text-gray-500 mt-3 max-w-xl mx-auto'>
          Explore our core accreditation services designed to ensure quality,
          compliance, and continuous improvement.
        </p>
      </div>

      {/* Cards */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {services.map((service, index) => (
          <div
            key={index}
            className='group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition duration-300 hover:-translate-y-1'
          >
            {/* Icon */}
            <div className='mb-4 text-green-600 group-hover:text-green-700 transition'>
              {service.icon}
            </div>

            {/* Title */}
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>
              {service.title}
            </h3>

            {/* Description */}
            <p className='text-sm text-gray-500 leading-relaxed'>
              {service.description}
            </p>

            {/* Bottom accent */}
            <div className='mt-4 h-[2px] w-0 bg-gradient-to-r from-green-700 to-blue-600 group-hover:w-full transition-all duration-300'></div>
          </div>
        ))}
      </div>
    </section>
  );
}
