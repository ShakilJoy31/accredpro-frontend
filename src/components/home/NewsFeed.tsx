type NewsItem = {
  id: number;
  title: string;
  date: string;
  description?: string;
};

export default function NewsFeed() {
  const news: NewsItem[] = [
    {
      id: 1,
      title: 'New Accreditation Program Launched',
      date: '2026-04-20',
      description: 'We have introduced a new global accreditation program.'
    },
    {
      id: 2,
      title: 'Surveillance Audit Completed Successfully',
      date: '2026-04-15',
      description: 'All surveillance audits completed with outstanding results.'
    },
    {
      id: 3,
      title: 'Expansion to New Countries',
      date: '2026-04-10',
      description: 'Our services are now available in 5 new countries.'
    }
  ];

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  return (
    <div className='max-w-[1280px] mx-auto px-4 py-16'>
      <h2 className='text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8'>
        News & Announcements
      </h2>

      <div className='grid md:grid-cols-3 gap-6'>
        {news.map((item) => (
          <div
            key={item.id}
            className='rounded-2xl border hover:scale-[1.02] transition'
          >
            <div className='bg-white rounded-2xl p-6 h-full flex flex-col'>
              {/* Date */}
              <span className='text-sm text-gray-500 mb-2'>
                {formatDate(item.date)}
              </span>

              {/* Title */}
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                {item.title}
              </h3>

              {/* Description */}
              <p className='text-sm text-gray-600 flex-grow'>
                {item.description}
              </p>

              {/* Read More */}
              <button className='mt-4 text-blue-600 text-sm font-medium hover:underline text-left cursor-pointer w-fit'>
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
