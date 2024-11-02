import { useState } from 'react';
import Link from 'next/link'; // Use Link for client-side navigation

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-orange-300 shadow-md">
            <div className="container mx-auto flex justify-between items-center p-4">
                <div className="text-xl font-bold cursor-pointer">
                    <Link href="/">Logo</Link>
                </div>
                <div className="hidden md:flex space-x-4">
                    <Link href="/about">
                        <button className="text-gray-600 hover:text-gray-900">About</button>
                    </Link>
                    <Link href="/services">
                        <button className="text-gray-600 hover:text-gray-900">Services</button>
                    </Link>
                    <Link href="/contact">
                        <button className="text-gray-600 hover:text-gray-900">Contact</button>
                    </Link>
                </div>
                <button onClick={toggleMenu} className="md:hidden focus:outline-none">
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    )}
                </button>
            </div>
            {isOpen && (
                <div className="md:hidden">
                    <div className="flex flex-col space-y-2 p-4">
                        <Link href="/about">
                            <button className="text-gray-600 hover:text-gray-900">About</button>
                        </Link>
                        <Link href="/services">
                            <button className="text-gray-600 hover:text-gray-900">Services</button>
                        </Link>
                        <Link href="/contact">
                            <button className="text-gray-600 hover:text-gray-900">Contact</button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
