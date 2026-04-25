import Image from 'next/image';
import accreditation_certificate from '@/assets/Home/accreditation_certificate.jpg';

export default function AboutPage() {
  return (
    <div className='w-full bg-white text-gray-800'>
      {/* Hero Section */}
      <section className='pt-24 pb-16'>
        <div className='max-w-6xl mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            About Our Accreditation Body
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Ensuring trust, quality, and international recognition through
            reliable accreditation services.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className='pb-16'>
        <div className='max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center'>
          <div>
            <h2 className='text-2xl font-semibold mb-4'>Who We Are</h2>
            <p className='text-gray-600 leading-relaxed'>
              We are a globally recognized accreditation body committed to
              evaluating and certifying organizations against international
              standards. Our mission is to promote quality, competence, and
              trust across industries.
            </p>
            <p className='text-gray-600 mt-4'>
              With experienced auditors and transparent processes, we ensure
              that organizations meet the highest levels of compliance and
              performance.
            </p>
          </div>

          <div className='flex justify-center'>
            <Image
              src={accreditation_certificate}
              alt='Accreditation'
              width={500}
              height={400}
              className='rounded-xl shadow-md'
            />
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className='bg-gray-50 py-16'>
        <div className='max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center'>
          <div className='p-6 bg-white rounded-xl shadow-sm'>
            <h3 className='text-xl font-semibold mb-3'>Our Mission</h3>
            <p className='text-gray-600'>
              To provide credible and impartial accreditation services that
              enhance global trust.
            </p>
          </div>

          <div className='p-6 bg-white rounded-xl shadow-sm'>
            <h3 className='text-xl font-semibold mb-3'>Our Vision</h3>
            <p className='text-gray-600'>
              To be a leading international accreditation authority recognized
              for excellence.
            </p>
          </div>

          <div className='p-6 bg-white rounded-xl shadow-sm'>
            <h3 className='text-xl font-semibold mb-3'>Our Values</h3>
            <p className='text-gray-600'>
              Integrity, transparency, professionalism, and commitment to
              quality.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className='py-16'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-2xl font-semibold text-center mb-10'>
            Why Choose Us
          </h2>

          <div className='grid md:grid-cols-4 gap-6 text-center'>
            {[
              'International Standards',
              'Expert Auditors',
              'Transparent Process',
              'Fast Certification'
            ].map((item, index) => (
              <div
                key={index}
                className='p-6 border rounded-xl hover:shadow-md transition'
              >
                <p className='font-medium'>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className='bg-gradient-to-r from-green-700 to-blue-600 text-white py-16'>
        <div className='max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 text-center gap-6'>
          <div>
            <h3 className='text-3xl font-bold'>500+</h3>
            <p className='text-sm'>Certified Organizations</p>
          </div>
          <div>
            <h3 className='text-3xl font-bold'>50+</h3>
            <p className='text-sm'>Expert Auditors</p>
          </div>
          <div>
            <h3 className='text-3xl font-bold'>45+</h3>
            <p className='text-sm'>Countries Served</p>
          </div>
          <div>
            <h3 className='text-3xl font-bold'>12+</h3>
            <p className='text-sm'>Years Experience</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-16 text-center'>
        <div className='max-w-3xl mx-auto px-4'>
          <h2 className='text-2xl font-semibold mb-4'>
            Ready to Get Accredited?
          </h2>
          <p className='text-gray-600 mb-6'>
            Join hundreds of organizations that trust us for certification and
            accreditation services.
          </p>

          <button className='bg-gradient-to-r from-green-700 to-blue-600 text-white hover:from-green-800 hover:to-blue-700 transition-all duration-300 cursor-pointer px-6 py-3 rounded-lg'>
            Apply Now
          </button>
        </div>
      </section>
    </div>
  );
}
