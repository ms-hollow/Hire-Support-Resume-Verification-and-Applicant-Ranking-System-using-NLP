import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';

const ApplicantHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 w-full bg-background h-16 lg:px-20 mb:px-20 py-5 flex items-center justify-between sm:px-8  xsm:px-8 z-50">
      <div className="flex items-center">
        <div className="logo mr-4">
          <Image 
            src="/Logo.png" 
            width={39} 
            height={30} 
            alt="Company Logo" 
          />
        </div>

        <ul className="hidden md:flex space-x-10">
          <li><Link href="/APPLICANT/ApplicantHome">Home</Link></li>
          <li><Link href="/APPLICANT/MyJobs"> My Jobs</Link></li>
          <li><Link href="/APPLICANT/Settings">Settings</Link></li>
        </ul>

        <button className="text-3xl focus:outline-none text-primary md:hidden ml-4" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      <div className="flex items-center gap-5">
        <button className="pt-1">
          <Image 
            src="/Notification Icon.svg" 
            width={39} 
            height={30} 
            alt="Notification Icon" 
          />
        </button>

        <button>
          <Image 
            src="/Profile Icon.png" 
            width={28} 
            height={25} 
            alt="Profile Icon"  
          />
        </button>

   
        <div className="hidden md:block">
          <Link href="/GENERAL/Login">
            <h3>Company Site</h3>
          </Link>
        </div>
      </div>

      {/* Hamburger Menu */}
      <div className={`fixed z-50 top-0 left-0 w-52 bg-background h-screen md:hidden shadow-[0px_0px_4px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold ml-2">Hire Support</h3>
              <button className="text-3xl text-primary focus:outline-none" onClick={toggleMenu}>
                ☰
              </button>
        </div>
          {/* Menu Links */}
          <ul className="flex flex-col items-start p-6 space-y-4">
              <li><Link href="/APPLICANT/ApplicantHome" onClick={toggleMenu}>Home</Link></li>
              <li><Link href="/APPLICANT/MyJobs" onClick={toggleMenu}>My Jobs</Link></li>
              <li><Link href="/APPLICANT/Settings" onClick={toggleMenu}>Settings</Link></li>
          </ul>
      </div>

    </header>
  );
};

export default ApplicantHeader;
