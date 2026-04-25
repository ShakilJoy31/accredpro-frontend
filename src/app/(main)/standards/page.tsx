const standards = [
  {
    title: 'ISO/IEC 17011',
    description:
      'Requirements for accreditation bodies accrediting conformity assessment bodies.'
  },
  {
    title: 'ISO/IEC 17021',
    description:
      'Requirements for bodies providing audit and certification of management systems.'
  },
  {
    title: 'ISO/IEC 17024',
    description:
      'Criteria for certification of persons, ensuring competence and consistency.'
  },
  {
    title: 'ISO/IEC 17065',
    description:
      'Requirements for bodies certifying products, processes, and services.'
  },
  {
    title: 'PMP',
    description:
      'Project Management Professional certification standard for project managers.'
  },
  {
    title: 'ITIL',
    description:
      'Framework for IT service management focusing on aligning IT services with business needs.'
  }
];

export default function StandardsPage() {
  return (
    <div className='max-w-[1200px] mx-auto px-4 pt-24 pb-16'>
      {/* Header */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>
          Accreditation Standards
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          We provide accreditation services based on internationally recognized
          standards ensuring quality, competence, and reliability.
        </p>
      </div>

      {/* Grid */}
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {standards.map((item, index) => (
          <div
            key={index}
            className='p-[1px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
          >
            <div className='h-full bg-white rounded-2xl p-6 hover:shadow-lg transition'>
              <h2 className='text-xl font-semibold text-gray-800 mb-3'>
                {item.title}
              </h2>
              <p className='text-gray-600 text-sm leading-relaxed'>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
