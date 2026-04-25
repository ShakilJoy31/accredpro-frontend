export default function ResourcesPage() {
  const resources = [
    {
      title: 'Fee Schedules',
      description:
        'Latest accreditation fee structures and payment guidelines.',
      fileType: 'PDF'
    },
    {
      title: 'Application Forms',
      description: 'Downloadable forms for accreditation applications.',
      fileType: 'DOC/PDF'
    },
    {
      title: 'Criteria Documents',
      description:
        'Standards and eligibility criteria for certification bodies.',
      fileType: 'PDF'
    },
    {
      title: 'Policies & Guidelines',
      description:
        'Official policies, compliance rules, and operational guidelines.',
      fileType: 'PDF'
    }
  ];

  return (
    <main className='min-h-screen bg-gray-50 px-6 pt-24 pb-16'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='max-w-6xl mx-auto mb-10 text-center'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>
            Publications & Downloads
          </h1>
          <p className='text-gray-600 mt-3 max-w-2xl mx-auto'>
            Access official documents, forms, policies, and accreditation
            resources.
          </p>
        </div>

        {/* Grid */}
        <div className='grid md:grid-cols-2 gap-6 mt-10'>
          {resources.map((item, index) => (
            <div
              key={index}
              className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition'
            >
              <div className='flex justify-between items-start'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  {item.title}
                </h2>
                <span className='text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full'>
                  {item.fileType}
                </span>
              </div>

              <p className='text-gray-600 mt-3 text-sm'>{item.description}</p>

              <button className='mt-5 inline-block text-sm font-medium bg-gradient-to-r from-green-700 to-blue-600 text-white hover:from-green-800 hover:to-blue-700 transition-all duration-300 cursor-pointer px-4 py-2 rounded-lg'>
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
