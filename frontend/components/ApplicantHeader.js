import { useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthContext from "@/pages/context/AuthContext";
import { useRouter } from 'next/router';

const ApplicantHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { logoutUser } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="fixed top-0 w-full bg-background h-16 lg:px-20 mb:px-20 py-5 flex items-center justify-between sm:px-8 xxsm:px-4 z-50">
      <div className="flex items-center">
        <div className="logo mr-4">
          <Image 
            src="/Logo.svg" 
            width={45} 
            height={30} 
            alt="Company Logo" 
          />
        </div>

        <ul className="justify-center items-center mt-1 hidden md:flex space-x-10">
          <li><Link href="/APPLICANT/ApplicantHome">Home</Link></li>
          <li><Link href="/APPLICANT/MyJobs">My Jobs</Link></li>
          <li><Link href="/APPLICANT/Settings">Settings</Link></li>
        </ul>

        {/* Hamburger Menu Button */}
        <button className="text-3xl focus:outline-none text-primary md:hidden ml-4 mt-3" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      <div className="flex items-center gap-5">
        {/* Notification Icon */}
        <button className="pt-1">
          <Link href="/APPLICANT/Notifications" className="ml-auto">
            <Image 
              src="/Notification Icon.svg" 
              width={39} 
              height={30} 
              alt="Notification Icon" 
            />
            </Link>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
          >
            <Image
              src="/Profile Icon.png"
              width={28}
              height={25}
              alt="Profile Icon"
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
           <div className="absolute right-0 mt-2 w-48 bg-background shadow-md transition-all duration-300"> 
           <ul>
             <li className= "px-4 py-3 hover:bg-primary hover:text-background cursor-pointer transition-all duration-300"><Link href="/APPLICANT/ApplicantProfile" onClick={toggleDropdown}>Profile</Link></li>
             <li className="px-4 py-3 hover:bg-primary hover:text-background cursor-pointer transition-all duration-300">Settings</li>
             <li className="px-4 py-3 hover:bg-primary hover:text-background cursor-pointer transition-all duration-300"><button onClick={logoutUser}>Logout</button></li>
           </ul>
         </div>
          )}
        </div>

        {/* Company Site Link */}
        <div className="hidden md:block">
          <Link href="/GENERAL/Login"><h3>Company Site</h3></Link>
        </div>
      </div>

      {/* Hamburger Menu */}
      <div
        className={`fixed z-50 top-0 left-0 w-52 bg-background h-screen md:hidden shadow-[0px_0px_4px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold ml-2">Hire Support</h3>
          <button className="text-3xl text-primary focus:outline-none" onClick={toggleMenu}>
            ☰
          </button>
        </div>

        <ul className="flex flex-col items-start">
          <li className="py-2 hover:bg-primary hover:text-background cursor-pointer transition-all duration-300 w-full"><Link href="/APPLICANT/ApplicantHome" onClick={toggleMenu} className="block px-4 py-2"> <p className="pl-2">Home</p></Link></li>
          <li className="py-2 hover:bg-primary hover:text-background cursor-pointer transition-all duration-300 w-full"><Link href="/APPLICANT/MyJobs" onClick={toggleMenu} className="block px-4 py-2"> <p className="pl-2">My Jobs</p></Link></li>
          <li className="py-2 hover:bg-primary hover:text-background cursor-pointer transition-all duration-300 w-full"><Link href="/APPLICANT/Settings" onClick={toggleMenu} className="block px-4 py-2"><p className="pl-2">Settings </p></Link></li>
        </ul>

      </div>
    </header>
  );
};

export default ApplicantHeader;
