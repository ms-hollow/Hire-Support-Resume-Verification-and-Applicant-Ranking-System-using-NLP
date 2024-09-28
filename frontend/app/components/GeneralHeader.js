"use client";
import { useState } from "react";
import Link from "next/link";

const GeneralHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 w-full bg-background h-16 px-20 py-5 flex items-center justify-between">
      <div className="flex items-center md:hidden absolute right-6">
        <Link href="/login" className="mr-4"><h3>Sign in as Applicant</h3></Link>
          <button className="text-3xl focus:outline-none text-primary" onClick={toggleMenu}>
            {isOpen ? "✕" : "☰"}
          </button>
      </div>

      <div className="logo"> </div>
      <ul className="hidden md:flex lg:space-x-20 mb:space-x-16 mb:flex">
        <li><Link href="/LandingPage">Home</Link></li>
        <li><Link href="#about">About Us</Link></li>
        <li><Link href="#faqs">FAQs</Link></li>
        <li><Link href="#contact">Contact Us</Link></li>
      </ul>

      <div className="ml-auto hidden md:block">
        <Link href="/login">
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
          <li><Link href="/LandingPage" onClick={toggleMenu}>Home</Link></li>
          <li><Link href="#about" onClick={toggleMenu}>About Us</Link></li>
          <li><Link href="#faqs" onClick={toggleMenu}>FAQs</Link></li>
          <li><Link href="#contact" onClick={toggleMenu}>Contact Us</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default GeneralHeader;
