'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import acc_body_1 from '@/assets/Home/acc_body_1.jpg';
import acc_body_2 from '@/assets/Home/acc_body_2.jpg';
import acc_body_3 from '@/assets/Home/acc_body_3.jpg';
import acc_body_4 from '@/assets/Home/acc_body_4.jpg';
import acc_body_5 from '@/assets/Home/acc_body_5.jpg';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

export default function AccreditationBodiesCarousel() {
  const logos = [acc_body_1, acc_body_2, acc_body_3, acc_body_4, acc_body_5];

  return (
    <>
      <div className='bg-gray-50'>
        <div className='max-w-[1280px] mx-auto w-full px-4 py-16'>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={3}
            spaceBetween={4}
            centeredSlides={true}
            loop={true}
            navigation
            pagination={{ clickable: true }}
            initialSlide={Math.floor(logos.length)}
            autoplay={{ delay: 2000 }}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 3 }
            }}
          >
            {logos.map((logo, index) => (
              <SwiperSlide key={index}>
                <div className='flex items-center justify-center h-56'>
                  <Image
                    src={logo}
                    alt='logo'
                    width={800}
                    height={800}
                    className='logo-image h-full object-contain transition duration-300 hover:grayscale-0'
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <style jsx global>{`
        .logo-image {
          filter: grayscale(100%);
        }

        .logo-image:hover {
          filter: grayscale(0%);
        }

        .swiper-slide-active .logo-image {
          filter: grayscale(0%);
        }
      `}</style>
    </>
  );
}
