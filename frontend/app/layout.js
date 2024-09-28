import localFont from "next/font/local";
import "./styles/globals.css";
import GeneralHeader from "./components/GeneralHeader";
import GeneralFooter from "./components/GeneralFooter";


const Inter = localFont({
  src: './assets/fonts/Inter.ttf',  
  variable: "--font-inter",
  weight: "100 900",
});


// For search engine
export const metadata = {
  title: "Hire Support",
  description: "Hire Support app",
};

export default function RootLayout({ children }) {
  return(
    <html lang="en" className="!smooth-scroll"> 
      
      <body
        className={`${Inter.variable} ${Inter.variable} antialiased`}
      >
        <GeneralHeader/>
        {children}
        <GeneralFooter/>
        
      </body>
    </html>
  );
}


