import { useEffect, useState } from "react";

const GeneralFooter = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Ensure visibility for short pages
            if (documentHeight <= windowHeight || scrollY + windowHeight >= documentHeight - 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Initial check in case the page starts at the bottom or is too short
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="pt-10">
            <footer className={`bg-fontcolor text-background w-full fixed bottom-0 left-0 p-2 flex flex-col items-center ${isVisible ? 'block' : 'hidden'}`}>
                <p className="lg:text-xsmall mb:text-xsmall sm:text-xsmall xsm:text-xsmall">© 2024 Hire Support. All rights reserved.</p>
                <ul className="list-disc space-x-2">
                    <li className="text-background lg:text-xsmall mb:text-xsmall sm:text-xsmall xsm:text-xsmall">Privacy Policy</li>
                    <li className="text-background lg:text-xsmall mb:text-xsmall sm:text-xsmall xsm:text-xsmall">Terms & Condition</li>
                </ul>
         </footer> 
        </div>
       
    );
};

export default GeneralFooter;
