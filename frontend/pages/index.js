import Image from "next/image"; 
import localFont from "next/font/local"; 
import GeneralHeader from "@/components/GeneralHeader"; 
import GeneralFooter from "@/components/GeneralFooter";
import { useEffect, useRef, useState } from "react";
import Loading from "./GENERAL/Loading";

const Inter = localFont({
src: './fonts/Inter.ttf',  
variable: "--font-inter",
weight: "100 900",
});

const features = {
applicant: {
  title: "Applicant Features",
  cards: [
    {
      icon: "/Applicant Features.svg",
      text: "Allow applicants to easily upload, store, and update their resumes",
    },
    {
      icon: "/Applicant Features 1.svg",
      text: "Enable applicants to track the progress of their applications through different stages of the hiring process, from submission to final decision.",
    },
    {
      icon: "/Applicant Features 2.svg",
      text: "Let applicants customize their profile settings, privacy preferences, and notification options to control their job search experience.",
    },
    {
      icon: "/Applicant Features 3.svg",
      text: "Provide personalized job recommendations based on applicants' qualifications, experience, and career interests that match their profile.",
    },
  ],
},
hr: {
  title: "HR Features",
  cards: [
    {
      icon: "/HR Features.svg",
      text: "Streamline the screening process allowing recruiters to quickly assess applications with standardized evaluation criteria.",
    },
    {
      icon: "/HR Features 1.svg",
      text: "Organize and access candidate documents in a centralized location, making it easy to review qualifications and supporting materials.",
    },
    {
      icon: "/HR Features 2.svg",
      text: "Easily schedule interviews, send invites, and manage feedback centrally.",
    },
    {
      icon: "/HR Features 3.svg",
      text: "Schedule and receive timely reminders about upcoming interviews, follow-ups needed, and pending hiring decisions to maintain an efficient process.",
    },
  ],
},
};

export default function LandingPage() { 
const imageOneRef = useRef(null);
const imageTwoRef = useRef(null);
const imageThreeRef = useRef(null);
const [scrolled, setScrolled] = useState(false);
const [isLoading, setIsLoading] = useState(true);

const [active, setActive] = useState("applicant");

useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 5000); 

  return () => clearTimeout(timer);
}, []);


useEffect(() => {
  const interval = setInterval(() => {
    setActive((prev) => (prev === "applicant" ? "hr" : "applicant"));
  }, 8000);
  return () => clearInterval(interval);
}, []);

const handleToggle = (type) => setActive(type);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 100);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

if (isLoading) {
  return <Loading/>;
}


return (
  <div>
    <GeneralHeader />
        <div className={`${Inter.variable} lg:px-20 mb:px-10 sm:px-8 xsm:px-8 xxsm:px-4 mx-auto font-[family-name:var(--font-inter)] overflow-x-hidden`}>
        {/* Home Section */}
          <section id="Home" className="w-full flex items-center justify-center min-h-screen py-16 ">
            <div className="w-full flex lg:pt-0 mb:pt-0 sm:pt-20 xsm:pt-20 xxsm:pt-20 lg:flex-row mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col lg:justify-between mb:justify-between sm:items-center sm:justify-center items-center">
              <div className="flex flex-col lg:w-full mb:w-2/3 sm:w-full lg:items-start mb:items-start sm:items-center xsm:items-center text-center">
                <h1 className="lg:text-6xl md:text-5xl sm:text-4xl xsm:text-4xl xxsm:text-3xl font-black mb-6 text-primary">HIRE SUPPORT</h1>
                <p className="lg:items-start mb:items-start sm:items-center text-medium text-base font-semibold max-w-xl mb-8 text-fontcolor">
                  <span className="text-accent font-bold"> Empowering Recruiters</span> — Hire Intelligently. Rank Effectively.
                </p>

                <div className="flex flex-wrap lg:justify-start mb:justify-start sm:justify-center xsm:justify-center xxsm:justify-center gap-4 mb-5">
                  <a href="/GENERAL/Login">
                    <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 hover:shadow-[0_2px_5px_rgba(51,51,51,1)] transition-all duration-200">
                      GET STARTED
                    </button>
                  </a>
                  <a href="#AboutUs" className="bg-transparent border border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary hover:bg-opacity-90 hover:text-background hover:shadow-[0_2px_5px_rgba(51,51,51,1)] transition-all duration-200">
                    LEARN MORE
                  </a>
                </div>
              </div>

              {/* IMAGE CONTENT */}
              <div className="lg:w-full mb:w-1/3 lg:ml-0 mb:ml-20 h-full flex justify-center items-center order-2 lg:order-2">
                <div className="lg:w-full mb:w-1/3 h-full relative aspect-square lg:max-h-[700px] lg:min-w-[700px] mb:max-h-[600px] mb:min-w-[550px] sm:max-h-[400px] sm:min-w-[300px] xsm:max-h-[300px] xsm:min-w-[300px] xxsm:max-h-[250px] xxsm:min-w-[250px]">
                  <Image
                    src="/Hire Support.svg"
                    alt=" Features"
                    fill
                    sizes="(max-width: 2048px) 100vw, 50vw"
                    className={`transition-all duration-[2000ms] ease-in-out ${scrolled ? "scale-100 opacity-100" : "scale-125 opacity-100"}`}
                    ref={imageOneRef}

                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          {/* About Us Section */}
          <section id="AboutUs" className="w-full flex items-center justify-center min-h-screen py-16  ">
            <div className="w-full flex lg:pt-0 mb:pt-0 sm:pt-20 xsm:pt-20 xxsm:pt-20 lg:flex-row mb:flex-row sm:flex-col-reverse xsm:flex-col-reverse xxsm:flex-col-reverse lg:justify-between mb:justify-between sm:items-center sm:justify-center items-center">
              <div className="lg:w-full mb:w-1/3 lg:ml-0 mb:ml-20 h-full flex justify-center items-center order-2 lg:order-1">
                <div className="lg:w-full mb:w-1/3 h-full relative aspect-square lg:max-h-[700px] lg:min-w-[700px] mb:max-h-[400px] mb:min-w-[400px] sm:max-h-[400px] sm:min-w-[300px] xsm:max-h-[300px] xsm:min-w-[300px] xxsm:max-h-[250px] xxsm:min-w-[250px]">
                  <Image
                    src="/Hire Support 1.svg"
                    alt="About Us"
                    fill
                    sizes="(max-width: 2048px) 100vw, 50vw"
                    className={`transition-transform duration-[2000ms] ease-in-out absolute top-0 left-0 ${scrolled ? "scale-100 opacity-100" : "scale-150 opacity-0"}`}
                    ref={imageTwoRef}

                    priority
                  />
                </div>
              </div>

              {/* RIGHT CONTENT */}
              <div className="lg:w-full mb:w-2/3 text-center lg:text-right mb:text-right sm:justify-center xsm:justify-center xxsm:justify-center flex flex-col order-2 mb-5">
                <h1 className="lg:text-6xl md:text-5xl sm:text-4xl xsm:text-4xl xxsm:text-2xl font-black mb-6 text-primary">What is Hire Support?</h1>
                <p className="lg:text-right mb:text-right sm:justify-center xsm:justify-center xxsm:justify-center text-base text-center mb-8 text-fontcolor">
                  HIRE SUPPORT is an innovative platform designed to transform the recruitment process. It automates resume verification and provides intelligent applicant ranking to help businesses make better hiring decisions.
                </p>
                <div>
                  <a href="#FAQS">
                    <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-200">
                      EXPLORE FAQs
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="Features" className="w-full flex items-center justify-center min-h-screen py-28">
            <div className=" w-full flex lg:pt-0 mb:pt-0 sm:pt-20 xsm:pt-20 xxsm:pt-20 lg:flex-row mb:flex-col sm:flex-col xsm:flex-col xxsm:flex-col lg:justify-between mb:justify-between sm:items-center sm:justify-center items-center">
              {/* Left CONTENT */}
              <div className="w-full flex flex-col gap-10 -mt-36 relative">
                {/* Title */}
                <h1 className="lg:text-6xl md:text-5xl sm:text-4xl xsm:text-4xl xxsm:text-3xl font-black text-primary text-center transition duration-500">
                  {features[active].title}
                </h1>

                {/* Features Grid */}
                <div key={active} className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 xsm:grid-cols-1 gap-6 ">
                  {features[active].cards.map((card, index) => (
                    <div key={index} className="flex justify-center text-center lg:text-left">
                      <div className="bg-background rounded-xs shadow-lg border border-[#F5F5F5] p-4 w-full h-full flex flex-col">
                        <div className="flex justify-center mb-4">
                          <Image src={card.icon} width={40} height={50} alt="icon" />
                        </div>
                        <p className="text-justify text-sm text-gray-700 mb-6">{card.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Toggle Buttons */}
                <div className="flex justify-center mt-6 gap-4">
                  <button className={`w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center transition ${active === "applicant" ? "opacity-60" : "opacity-100"}`}
                    onClick={() => handleToggle("applicant")}> 
                  </button>

                  <button className={`w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center transition ${active === "hr" ? "opacity-60" : "opacity-100"}`}
                    onClick={() => handleToggle("hr")}>
                  </button>
                </div>
              </div>

              <div className="lg:w-full mb:w-1/3 lg:ml-0 mb:ml-20 h-full flex justify-center items-center order-2 lg:order-2">
                <div className="lg:w-full mb:w-1/3 h-full relative aspect-square lg:max-h-[700px] lg:min-w-[700px] mb:max-h-[600px] mb:min-w-[550px] sm:max-h-[400px] sm:min-w-[300px] xsm:max-h-[300px] xsm:min-w-[300px] xxsm:max-h-[250px] xxsm:min-w-[250px]">
                  <Image
                    src="/Hire Support 2.svg"
                    alt=" Features"
                    fill
                    sizes="(max-width: 2048px) 100vw, 50vw"
                    className={`transition-transform duration-[2000ms] ease-in-out ${scrolled ? "scale-125 opacity-100" : "scale-100 opacity-0"}`}
                    ref={imageThreeRef}

                    priority
                  />
                </div>
              </div>
            </div>
          </section>


          {/* Join Us */}
          <section className="w-full flex items-center justify-center min-h-screen py-16 overflow-x-hidden">
            <div className="w-full flex lg:pt-0 mb:pt-0 sm:pt-20 xsm:pt-20 mt-20 xxsm:pt-20 lg:flex-row mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col lg:justify-between mb:justify-between sm:items-center sm:justify-center items-center">
            <div className="flex flex-col lg:w-full mb:w-2/3 sm:w-full lg:items-start sm:items-center text-left">
                <h1 className="lg:text-5xl md:text-5xl sm:text-4xl xsm:text-4xl xxsm:text-3xl font-black mb-6 text-primary">Join us in this journey</h1>

                <p className="text-medium text-base font-semibold max-w-xl mb-8 text-fontcolor text-left">
                  Ready to experience the future of recruitment? Sign up today and discover how Hire Support can revolutionize your hiring experience!
                </p>

                <div className="w-full flex flex-row lg:justify-start sm:justify-center gap-4 mb-5 items-center">
                  <div className="relative rounded-xs border-2 border-primary flex flex-grow items-center w-3/3 h-[48px]"> 
                    <input
                      type="text" 
                      id="inputField"
                      name="inputField"
                      placeholder="Enter your Email"
                      required
                      className="w-full h-full px-4 border-none focus:outline-[#A5A5A5] text-sm text-fontcolor"
                    />
                  </div>

                  <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 hover:shadow-[0_2px_5px_rgba(51,51,51,1)] transition-all duration-200">
                      Submit
                  </button>
                </div>

              </div>

              {/* IMAGE CONTENT */}
              <div className="lg:w-full mb:w-1/3 sm:w-full xsm:w-full h-full flex justify-center items-center">
                <div className="lg:w-full mb:w-1/3 sm:w-full xsm:w-full h-full flex justify-center items-center order-2 lg:order-1">
                  <div className="lg:w-full mb:w-1/3 sm:w-full xsm:w-full lg:ml-0 mb:ml-28 sm:ml-0 relative aspect-square lg:max-h-[550px] lg:min-w-[800px] mb:max-h-[500px] mb:min-w-[400px] sm:max-h-[400px] sm:min-w-[300px] xsm:max-h-[250px] xsm:min-w-[150px] xxsm:max-h-[200px] xxsm:min-w-[250px]">
                    <Image
                      src="/Hire Support 3.svg"
                      alt="Join Us"
                      fill
                      sizes="(max-width: 2048px) 100vw, 50vw"
                      className={`transition-all duration-[2000ms] ease-in-out ${scrolled ? "scale-100 opacity-100" : "scale-95 opacity-100"}`}
                      ref={imageOneRef}
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>


      <GeneralFooter />
    </div>
</div>

  
);
}
