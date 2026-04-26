import Link from 'next/link';
import { notFound } from 'next/navigation';

type NewsItem = {
  id: number;
  title: string;
  date: string;
  category: 'Press' | 'Policy' | 'Accreditation' | 'Suspension';
  description: string;
  content: string;
};

// Temporary mock data (later you can replace with API / DB)
const newsData: NewsItem[] = [
  {
    id: 1,
    title: 'New Certification Body Accredited for ISO/IEC 17021',
    date: '2026-04-20',
    category: 'Accreditation',
    description:
      'A new certification body has been successfully accredited under ISO/IEC 17021 standards.',
    content:
      'The accreditation process was completed after a detailed assessment of competency, impartiality, and operational procedures. The body demonstrated full compliance with ISO/IEC 17021 requirements. This marks a significant step in expanding our accredited network internationally.'
  },
  {
    id: 2,
    title: 'Updated Policy on Surveillance Audits',
    date: '2026-04-15',
    category: 'Policy',
    description: 'We have updated surveillance audit procedures.',
    content:
      'The updated surveillance audit policy ensures better alignment with global accreditation frameworks. All accredited bodies must now follow the revised audit cycle and reporting structure effective immediately.'
  }
];

// For Next.js 15, params is a Promise that needs to be awaited
export default async function NewsDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params to get the actual values
  const { id } = await params;
  const news = newsData.find((item) => item.id === Number(id));

  if (!news) {
    notFound();
  }

  return (
    <main className='min-h-screen bg-gray-50 pt-24 pb-16 px-4 md:px-10'>
      <div className='max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
        {/* Category */}
        <span
          className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 ${
            news.category === 'Press'
              ? 'bg-purple-100 text-purple-600'
              : news.category === 'Policy'
                ? 'bg-yellow-100 text-yellow-700'
                : news.category === 'Accreditation'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
          }`}
        >
          {news.category}
        </span>

        {/* Title */}
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-3'>
          {news.title}
        </h1>

        {/* Date */}
        <p className='text-sm text-gray-500 mb-6'>Published on {news.date}</p>

        {/* Description */}
        <p className='text-gray-700 text-lg mb-6'>{news.description}</p>

        {/* Content */}
        <div className='text-gray-600 leading-relaxed space-y-4'>
          <p>{news.content}</p>

          {/* Placeholder extra content section */}
          <p>
            For more details, stakeholders are advised to review the official
            accreditation guidelines and contact the authority for clarification
            if required.
          </p>
        </div>

        {/* Back button */}
        <div className='mt-8'>
          <Link
            href='/news'
            className='text-blue-600 hover:underline text-sm font-medium'
          >
            ← Back to News
          </Link>
        </div>
      </div>
    </main>
  );
}
