'use client';

import { useState } from 'react';

type Body = {
  id: number;
  name: string;
  country: string;
  standard: string;
  status: string;
};

const dummyData: Body[] = [
  {
    id: 1,
    name: 'Global Certification Ltd.',
    country: 'UK',
    standard: 'ISO/IEC 17021',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Asia Inspection Services',
    country: 'Bangladesh',
    standard: 'ISO/IEC 17020',
    status: 'Active'
  },
  {
    id: 3,
    name: 'QualityCert GmbH',
    country: 'Germany',
    standard: 'ISO/IEC 17065',
    status: 'Suspended'
  }
];

export default function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredData = dummyData.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.country.toLowerCase().includes(search.toLowerCase()) ||
      item.standard.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === 'All' ? true : item.standard === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className='max-w-[1280px] mx-auto px-4 pt-24 pb-16'>
      {/* Header */}
      <div className='max-w-6xl mx-auto px-4 text-center mb-8'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>
          Accredited Bodies Directory
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Search and explore all currently accredited certification bodies
        </p>
      </div>

      {/* Search + Filter */}
      <div className='flex flex-col md:flex-row gap-4 mb-8'>
        <input
          type='text'
          placeholder='Search by name, country, or standard...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full md:flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value='All'>All Standards</option>
          <option value='ISO/IEC 17021'>ISO/IEC 17021</option>
          <option value='ISO/IEC 17020'>ISO/IEC 17020</option>
          <option value='ISO/IEC 17065'>ISO/IEC 17065</option>
        </select>
      </div>

      {/* Table */}
      <div className='overflow-x-auto border rounded-xl'>
        <table className='w-full text-left'>
          <thead className='bg-gray-100 text-gray-600 text-sm uppercase'>
            <tr>
              <th className='px-6 py-4'>Name</th>
              <th className='px-6 py-4'>Country</th>
              <th className='px-6 py-4'>Standard</th>
              <th className='px-6 py-4'>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className='border-t hover:bg-gray-50 transition'
                >
                  <td className='px-6 py-4 font-medium text-gray-800'>
                    {item.name}
                  </td>
                  <td className='px-6 py-4'>{item.country}</td>
                  <td className='px-6 py-4'>{item.standard}</td>
                  <td className='px-6 py-4'>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        item.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className='text-center py-10 text-gray-500'>
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
