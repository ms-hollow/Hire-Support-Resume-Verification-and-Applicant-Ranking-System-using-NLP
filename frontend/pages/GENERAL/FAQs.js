import GeneralFooter from '@/components/GeneralFooter';
import GeneralHeader from '@/components/GeneralHeader';
import localFont from "next/font/local"; 
import { useState } from 'react';
import Image from "next/image";

const Inter = localFont({
src: '../fonts/Inter.ttf',  
variable: "--font-inter",
weight: "100 900",
});

const faqs = [
  {
    question: "What is Hire Support?",
    answer:
      "Hire Support is a comprehensive recruitment solution that streamlines the hiring process by providing resume verification and applicant ranking tools for both candidates and recruiters.",
  },
  {
    question: "How do I create an account on Hire Support?",
    answer:
      "Simply visit our website and click Sign Up to create your profile. You'll be guided through the process of uploading your resume and completing your profile.",
  },
  {
    question: "How does Hire Support differ from other recruitment platforms?",
    answer:
      "Hire Support uniquely combines NLP-powered resume verification with objective applicant ranking algorithms to reduce bias and improve hiring decisions while saving time.",
  },
  {
    question: "How does the resume verification process work?",
    answer:
      "Our NLP technology analyzes resumes and supporting documents to validate credentials, experiences, and qualifications, flagging potential discrepancies for further review.",
  },
  {
    question: "Can I customize the applicant ranking criteria?",
    answer:
      "Absolutely! You can set job-specific parameters and weighting to ensure candidates are ranked according to your organization's unique needs and priorities.",
  },
  {
    question: "How does the verification process benefit me as a candidate?",
    answer:
      "Verified candidates typically receive 3x more interview requests, as employers prioritize applicants whose credentials have already undergone verification.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <GeneralHeader/>
      <div className={`${Inter.variable} lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-10 sm:px-8 xsm:px-8 xxsm:px-4 mx-auto font-[family-name:var(--font-inter)]`}>
      
        <div id="FAQs" className="min-h-screen w-full flex flex-col items-center justify-start bg-white">
          <h2 className="text-center lg:text-5xl mb:text-3xl sm:text-xl font-bold tracking-widest text-primary mb-3">FREQUENTLY ASKED QUESTIONS</h2>
          <p className="text-primary font-semibold tracking-wide text-center mb-6">HOW CAN WE HELP YOU?</p>

          {/* Search bar */}
          <div className="w-full max-w-3xl rounded-full border-2 border-primary mb-10">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Image
                    src="/Search Icon.svg"
                    width={20}
                    height={20}
                    alt="Search Icon"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full py-3 pl-12 pr-4 rounded-full border-none bg-background text-medium focus:outline-[#A5A5A5]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

          {/* FAQ items */}
          <div className="w-full max-w-4xl space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className=" shadow-md border border-[#F5F5F5] rounded-md bg-[#F5F5F5] transition-all" >
                <button onClick={() => toggleFAQ(index)} className="w-full flex justify-between items-center p-4 font-semibold text-left text-fontcolor">
                  {faq.question}
                  <span className='text-accent font-extrabold'>{openIndex === index ? 'x' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 text-sm text-fontcolor">
                      
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <GeneralFooter/>
      </div>
     
    </div>
  );
}
