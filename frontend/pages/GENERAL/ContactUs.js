import Image from "next/image"; 
import localFont from "next/font/local"; 
import GeneralHeader from "@/components/GeneralHeader"; 
import GeneralFooter from "@/components/GeneralFooter";

const Inter = localFont({
src: '../fonts/Inter.ttf',  
variable: "--font-inter",
weight: "100 900",
});

export default function ContactUs() { 
  return (
    <div>
      <GeneralHeader />
          <div className={`${Inter.variable} lg:px-20 mb:px-10 sm:px-8 xsm:px-8 xxsm:px-4 mx-auto font-[family-name:var(--font-inter)]`}>
            {/* Contact Us */}
            <div id="ContactUs" className="min-h-screen w-full flex items-center justify-center bg-white">
            <div className="w-full border-4 border-primary rounded-lg lg:px-10 mb:px-7 sm:px-7 py-2 flex flex-col lg:flex-row mb:flex-row sm:flex-row items-center justify-between">
            {/* LEFT SIDE: Text & Form */}
            <div className="w-full lg:w-1/2 space-y-5">
            <h1 className="lg:-mt-20 mb:-mt-5 sm:-mt-5 px-6 absolute left-1/2 transform -translate-x-1/2 bg-background lg:text-5xl mb:text-3xl sm:text-xl font-extrabold text-primary tracking-widest">
              CONTACT US
            </h1>

              <p className="text-fontcolor text-sm text-justify">
                If you have any questions, concerns, or feedback about the Hire Support,
                please don’t hesitate to reach out to us. Our dedicated customer support team
                is here to assist you.
              </p>

              <form className="space-y-3">
                <div>
                  <label className="block text-sm font-black text-fontcolor mb-1">Name</label>
                  <input type="text" className="w-full border-2 border-primary rounded-md px-4 py-2 focus:outline-[#A5A5A5] focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-black text-fontcolor mb-1">Email</label>
                  <input type="email" className="w-full border-2 border-primary rounded-md px-4 py-2 focus:outline-[#A5A5A5] focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-black text-fontcolor mb-1">Message</label>
                  <textarea rows="4" className="w-full border-2 border-primary rounded-md px-4 py-2 focus:outline-[#A5A5A5] focus:ring-primary"></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white font-semibold py-2 rounded-md hover:bg-opacity-90 transition-all duration-200"
                >
                  Submit
                </button>
              </form>
            </div>

            {/* RIGHT SIDE: Image */}
            <div className="lg:flex mb:flex sm:hidden xsm:hidden xxsm:hidden  w-full lg:w-1/2 mt-10 lg:mt-0 lg:ml-0 mb:ml-5 flex justify-center items-center relative aspect-square lg:max-h-[550px] lg:min-w-[800px] mb:max-h-[400px] mb:min-w-[250px] sm:max-h-[200px] sm:min-w-[100px] xsm:max-h-[250px] xsm:min-w-[150px] xxsm:max-h-[200px] xxsm:min-w-[250px]">
              <img
                src="/Hire Support 4.svg" // replace with actual path
                alt="Contact illustration"
                className="w-full lg:max-h-[450px] lg:min-w-[600px] mb:max-h-[400px] mb:min-w-[250px] sm:max-h-[200px] sm:min-w-[100px] xsm:max-h-[250px] xsm:min-w-[150px] xxsm:max-h-[200px] xxsm:min-w-[250px"
              />
            </div>
          </div>
            </div>
        <GeneralFooter />
     </div>
</div>
  );
}
