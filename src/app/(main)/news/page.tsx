'use client';

import Link from 'next/link';
import { useState } from 'react';

type NewsItem = {
  id: number;
  title: string;
  date: string;
  category: 'Press' | 'Policy' | 'Accreditation' | 'Suspension';
  description: string;
};

const newsData: NewsItem[] = [
  {
    id: 1,
    title: 'New Certification Body Accredited for ISO/IEC 17021',
    date: '2026-04-20',
    category: 'Accreditation',
    description:
      'A new certification body has been successfully accredited under ISO/IEC 17021 standards.'
  },
  {
    id: 2,
    title: 'Updated Policy on Surveillance Audits',
    date: '2026-04-15',
    category: 'Policy',
    description:
      'We have updated our surveillance audit procedures to align with international best practices.'
  },
  {
    id: 3,
    title: 'Suspension Notice for ABC Certification Ltd.',
    date: '2026-04-10',
    category: 'Suspension',
    description:
      'ABC Certification Ltd. has been suspended due to non-compliance with accreditation requirements.'
  },
  {
    id: 4,
    title: 'Press Release: International Recognition Achieved',
    date: '2026-04-05',
    category: 'Press',
    description:
      'Our accreditation body has received international recognition from global partners.'
  }
];

const categories = ['All', 'Press', 'Policy', 'Accreditation', 'Suspension'];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredNews =
    activeCategory === 'All'
      ? newsData
      : newsData.filter((item) => item.category === activeCategory);

  return (
    <main className='min-h-screen bg-gray-50 pt-24 pb-16 px-4 md:px-10'>
      {/* Header */}
      <div className='max-w-6xl mx-auto mb-10 text-center'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>
          News & Announcements
        </h1>
        <p className='text-gray-600 mt-3 max-w-2xl mx-auto'>
          Stay updated with press releases, policy changes, new accreditations,
          and suspension notices.
        </p>
      </div>

      {/* Filters */}
      <div className='max-w-6xl mx-auto mb-8 flex flex-wrap gap-3 justify-center'>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full border text-sm cursor-pointer transition ${
              activeCategory === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className='max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className='bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 border border-gray-100'
          >
            {/* Category Badge */}
            <span
              className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-3 ${
                item.category === 'Press'
                  ? 'bg-purple-100 text-purple-600'
                  : item.category === 'Policy'
                    ? 'bg-yellow-100 text-yellow-700'
                    : item.category === 'Accreditation'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
              }`}
            >
              {item.category}
            </span>

            {/* Title */}
            <h2 className='text-lg font-semibold text-gray-800 mb-2'>
              {item.title}
            </h2>

            {/* Date */}
            <p className='text-sm text-gray-500 mb-3'>{item.date}</p>

            {/* Description */}
            <p className='text-sm text-gray-600'>{item.description}</p>

            {/* Read More */}
            <Link
              href={`/news/${item.id}`}
              className='block mt-4 text-blue-600 text-sm font-medium hover:underline cursor-pointer'
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <p className='text-center text-gray-500 mt-10'>
          No announcements found for this category.
        </p>
      )}
    </main>
  );
}
