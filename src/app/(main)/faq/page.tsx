export default function FAQPage() {
  const faqs = [
    {
      question: 'What is an accredited certification body (CB)?',
      answer:
        'An accredited certification body is an organization authorized to assess and certify companies or individuals against specific standards such as ISO or other frameworks.'
    },
    {
      question: 'How can a certification body get accredited?',
      answer:
        'Certification bodies must apply through an accreditation process, meet required standards (e.g., ISO/IEC 17021), and successfully pass assessments and audits.'
    },
    {
      question: 'How long does the accreditation process take?',
      answer:
        'The duration depends on readiness and scope, but typically it can take several weeks to a few months, including documentation review and audits.'
    },
    {
      question: 'What is the validity of an accreditation certificate?',
      answer:
        'Most accreditation certificates are valid for a fixed period (usually 3–5 years) with periodic surveillance audits.'
    },
    {
      question: 'Can a certificate be suspended or revoked?',
      answer:
        'Yes. If a certification body fails to comply with standards or audit requirements, accreditation may be suspended or revoked.'
    },
    {
      question: 'Who can apply for certification verification?',
      answer:
        'Any organization, client, or stakeholder can verify certificates issued by accredited certification bodies through the directory or verification system.'
    }
  ];

  return (
    <main className='max-w-5xl mx-auto px-6 pt-24 pb-16'>
      <div className='max-w-6xl mx-auto mb-10 text-center'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>FAQs</h1>
        <p className='text-gray-600 mt-3 max-w-2xl mx-auto'>
          Common questions for CBs and certificate holders
        </p>
      </div>

      <div className='space-y-4'>
        {faqs.map((faq, index) => (
          <details
            key={index}
            className='border rounded-xl p-4 bg-white shadow-sm'
          >
            <summary className='cursor-pointer font-semibold text-gray-800'>
              {faq.question}
            </summary>
            <p className='mt-2 text-gray-600 leading-relaxed'>{faq.answer}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
