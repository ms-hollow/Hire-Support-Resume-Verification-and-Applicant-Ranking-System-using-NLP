import Image from "next/image"; 
import localFont from "next/font/local"; 
import GeneralHeader from "@/components/GeneralHeader"; 
import GeneralFooter from "@/components/GeneralFooter";

const Inter = localFont({
  src: './fonts/Inter.ttf',  
  variable: "--font-inter",
  weight: "100 900",
});

export default function LandingPage() {

  return (
    <div className={`${Inter.variable} ${Inter.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-inter)]`}>
      
      <GeneralHeader />

      <section id='Home' className="section">
        <p>This is Landing Page</p>   
      </section>

      <section id='AboutUs' className="section">
        <p>This is About Us</p>   
      </section>

      <section id='FAQS'className="section" >
        <p>This is FAQS</p>   
      </section>

      <section id='ContactUs' className="section">
        <p>This is Contact Us</p>   
      </section>

      <footer>
        <GeneralFooter />
      </footer>
    </div>
  );
}
