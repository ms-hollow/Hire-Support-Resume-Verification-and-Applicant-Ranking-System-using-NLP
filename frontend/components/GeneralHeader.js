import { useState } from "react";
import Link from "next/link";

const GeneralHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 w-full bg-background h-16 lg:px-20 mb:px-20 py-5 flex items-center justify-between sm:px-8">
      <div className="flex items-center md:hidden absolute right-6">
          <Link href="/GENERAL/Login" className="mr-4">
            <h3>Sign in as Applicant</h3>
          </Link>
          <button className="text-3xl focus:outline-none text-primary" onClick={toggleMenu}>
              {isOpen ? "✕" : "☰"}
          </button>
      </div>

      <div className="logo"> </div>
        <ul className="hidden mb:flex lg:space-x-20 mb:space-x-16">
          <li><a href="/#Home"onClick={toggleMenu}>Home</a></li>
          <li><a href="/#AboutUs"onClick={toggleMenu}>About Us</a></li>
          <li><a href="/#FAQS"onClick={toggleMenu}>FAQs</a></li>
          <li><a href="/#ContactUs" onClick={toggleMenu}>Contact Us</a></li>
        </ul>

      <div className="ml-auto hidden md:block">
        <Link href="/GENERAL/Login">
          <h3>Sign in as Applicant</h3>
        </Link>
      </div>

      {/*Hamburger Menu */}
      <div
        className={`w-full absolute right-0 bg-background md:hidden shadow-[0px_0px_4px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`} style={{ top: isOpen ? '64px' : '0' }}
      >
        <ul className="flex flex-col items-center justify-center space-y-4 p-4 m-0">
        <li><a href="/#Home"onClick={toggleMenu}>Home</a></li>
          <li><a href="/#AboutUs"onClick={toggleMenu}>About Us</a></li>
          <li><a href="/#FAQS"onClick={toggleMenu}>FAQs</a></li>
          <li><a href="/#contactUs" onClick={toggleMenu}>Contact Us</a></li>
        </ul>
      </div>
    </header>
  );
};

export default GeneralHeader;
