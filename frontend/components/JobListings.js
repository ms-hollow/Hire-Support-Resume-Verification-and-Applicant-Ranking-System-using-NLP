import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';
const JobListings = () => {
    return (
        <div className="flex flex-col ">
            <div className="job-listing-box flex flex-col p-4">
            <Image 
                src="/Logo.png" 
                width={30} 
                height={30} 
                alt="Company Logo" 
            />
            <p className="font-semibold text-large mt-2">Job Title</p>
            <p className="font-thin text-medium">Company</p>
            <p className="font-thin text-medium">Job Industry</p>

            <div className="flex flex-row mt-2">
                <Image 
                    src="/Location Icon.png" 
                    width={20} 
                    height={20}
                    alt="Search Icon"
                />
                 <p className="ml-2 font-thin text-medium">Location</p>
            </div>

            <div className="flex flex-row mt-2">
                <Image 
                    src="/Work Setup Icon.svg" 
                    width={20} 
                    height={20}
                    alt="Search Icon"
                />
                 <p className="ml-2 font-thin text-medium">Location</p>
            </div>

            <div className="flex flex-row mt-2">
                <Image 
                    src="/Schedule Icon.svg" 
                    width={20} 
                    height={20}
                    alt="Search Icon"
                />
                 <p className="ml-2 font-thin text-medium">Location</p>
            </div>





            </div>




        </div>



      );
}
 
export default JobListings;