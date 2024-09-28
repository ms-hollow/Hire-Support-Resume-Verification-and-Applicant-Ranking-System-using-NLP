"use client";
import { useEffect, useState } from "react";

const GeneralFooter = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Check if scrolled to bottom
            if (scrollY + windowHeight >= documentHeight - 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="pt-36">
        <footer className={`bg-fontcolor text-background w-full fixed bottom-0 left-0 p-4 items-center ${isVisible ? 'block' : 'hidden'}`}>
            <p className="lg:text-medium mb:text-small sm:text-small xsm:text-small">© 2024 Hire Support. All rights reserved.</p>
            <ul className="list-disc space-x-4">
                <li className="text-background lg:text-medium mb:text-small sm:text-small xsm:text-small">Privacy Policy</li>
                <li className="text-background lg:text-medium mb:text-small sm:text-small xsm:text-small">Terms & Condition</li>
            </ul>
        </footer>
        </div>
    );
};

export default GeneralFooter;
