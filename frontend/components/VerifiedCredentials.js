import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';

const VerifiedCredentials = () => {
    return (
      <div className="flex flex-col pt-5 w-full">
        {/* Work Experience*/}
        <div className="flex flex-col items-center justify-center w-full pb-2">
          <div className="flex flex-col w-full max-w-4xl px-4 py-3 bg-white shadow-lg hover:bg-[#F1F1F1] rounded-lg">
              <p className="text-primary text-base  pb-3">Work Experience</p>
              <ul className="list-disc list-inside space-y-1 text-fontcolor font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall">
                <li>Back-end Web Developer, Meta, May 2025 - December 2026</li>
              </ul>
          </div>
        </div>

        {/* Education*/}
        <div className="flex flex-col items-center justify-center w-full pb-2">
          <div className="flex flex-col w-full max-w-4xl px-4 py-3 bg-white shadow-lg hover:bg-[#F1F1F1] rounded-lg">
              <p className="text-primary text-base pb-3">Education</p>
              <ul className="list-disc list-inside space-y-1 text-fontcolor font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall">
                <li>BS Computer Science, Technological Univerity of the Philippines, June 2020 - August 2024</li>
              </ul>
          </div>
        </div>

        {/* Certifications*/}
        <div className="flex flex-col items-center justify-center w-full pb-2">
          <div className="flex flex-col w-full max-w-4xl px-4 py-3 bg-white shadow-lg hover:bg-[#F1F1F1] rounded-lg">
              <p className="text-primary text-base pb-3">Certifications</p>
              <ul className="list-disc list-inside space-y-1 text-fontcolor font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall">
                <li>Google Front-End Developer I Certification</li>
              </ul>
          </div>
        </div>    
      </div>
    );
  };
  
  const VerifiedCredentialsWrapper = () => {
    return (
      <div className="flex flex-col overflow-y-auto p-2 bg-background max-h-full">
        <VerifiedCredentials />
      </div>
    );
  };
  
  
  export default VerifiedCredentialsWrapper;
  
  