'use client';

import { useEffect, useState } from 'react';
import {
  FaBuilding,
  FaCertificate,
  FaGlobe,
  FaCalendarAlt
} from 'react-icons/fa';

const statsData = [
  { label: 'Accredited Bodies', value: 120, icon: <FaBuilding /> },
  { label: 'Certificates in Registry', value: 58000, icon: <FaCertificate /> },
  { label: 'Countries Covered', value: 45, icon: <FaGlobe /> },
  { label: 'Years of Operation', value: 12, icon: <FaCalendarAlt /> }
];

function Counter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(
    function () {
      let start = 0;
      const increment = target / (duration / 16);

      const timer = setInterval(function () {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return function () {
        clearInterval(timer);
      };
    },
    [target, duration]
  );

  return <span>{count.toLocaleString()}+</span>;
}

function StatsCard({ icon, label, value }) {
  return (
    <div className='bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center'>
      <div className='text-3xl text-green-600 mb-3 flex justify-center'>
        {icon}
      </div>

      <h2 className='text-2xl font-bold text-gray-900'>
        <Counter target={value} />
      </h2>

      <p className='text-sm text-gray-500 mt-2'>{label}</p>
    </div>
  );
}

export default function StatsBar() {
  return (
    <div className='bg-gray-50 py-16 px-4'>
      <div className='max-w-[1280px] mx-auto w-full px-4 grid grid-cols-2 md:grid-cols-4 gap-6'>
        {statsData.map(function (item, index) {
          return (
            <StatsCard
              key={index}
              icon={item.icon}
              label={item.label}
              value={item.value}
            />
          );
        })}
      </div>
    </div>
  );
}
