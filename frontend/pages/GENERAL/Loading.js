import Image from "next/image"; 

export default function Loading() { 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 mb:px-10 lg:px-20 text-center relative">
        <div className="relative h-[100px] w-[250px] mb-5">
            <div className="absolute bottom-0 w-8  shadow-sm animate-bar1 origin-bottom" style={{ left: '0px', height: '10px' }}>
                <Image src="/Bar.svg" width={60} height={20} alt="Company Logo" className="absolute bottom-0 shadow-sm animate-bar1 origin-bottom"/>
            </div>
            
            <div className="absolute bottom-0 w-8 shadow-sm animate-bar2 origin-bottom" style={{ left: '50px', height: '40px' }}>
                <Image src="/Bar 1.svg" width={60} height={40} alt="Logo" className="absolute bottom-0 shadow-sm animate-bar2 origin-bottom"/>
            </div>

            <div className="absolute bottom-0 w-8 shadow-sm animate-bar3 origin-bottom" style={{ left: '100px', height: '80px' }}>
                <Image src="/Bar 2.svg" width={60} height={60} alt="Logo" className="absolute bottom-0 shadow-sm animate-bar3 origin-bottom"/>
            </div>

            <div className="absolute bottom-0 w-8 shadow-sm animate-bar4 origin-bottom" style={{ left: '150px', height: '120px' }}>
                <Image src="/Bar.svg" width={60} height={80} alt="Logo" className="absolute bottom-0 shadow-sm animate-bar4 origin-bottom"/>
            </div>

            <div className="absolute bottom-0 w-8 shadow-sm animate-bar5 origin-bottom" style={{ left: '200px', height: '160px' }}>
                <Image src="/Bar 1.svg" width={60} height={30} alt="Logo" className="absolute bottom-0 shadow-sm animate-bar5 origin-bottom"/>
            </div>

        </div>
  </div>
  );
}



