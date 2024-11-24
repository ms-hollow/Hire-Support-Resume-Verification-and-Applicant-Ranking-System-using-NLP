import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';

const JobListings = () => {

    const [isSaved, setIsSaved] = useState(false);
    const toggleSave = () => {
        setIsSaved(!isSaved);
    };

    return (
        <div className="flex flex-col">
            {/*Job listing 1*/}
            <div className="job-listing-box flex flex-col p-4 mb-4">
                <div className="flex flex-row justify-between items-center">
                    <Image 
                        src="/Logo.png" 
                        width={30} 
                        height={30} 
                        alt="Company Logo" 
                    />
                    <button onClick={toggleSave}>
                        <Image 
                            src={isSaved ? "/Save Icon.svg" : "/Unsave Icon.svg"} 
                            width={13} 
                            height={11} 
                            alt={isSaved ? "Save Icon" : "Unsave Icon"} 
                        />
                    </button>
                </div>

                <p className="font-semibold text-large mt-2">Job Title</p>
                <p className="font-thin text-xsmall">Company</p>
                <p className="font-thin text-xsmall">Job Industry</p>

                <div className="flex flex-row mt-2">
                    <Image 
                        src="/Location Icon.svg" 
                        width={23} 
                        height={20}
                        alt="Location Icon"
                    />
                    <p id='work_location' className="ml-1.5 font-thin text-xsmall pl-px">Location</p>
                </div>

                <div className="flex flex-row mt-2 pl-px">
                    <Image 
                        src="/Work Setup Icon.svg" 
                        width={20} 
                        height={20}
                        alt="Work Setup Icon"
                    />
                    <p id='work_setup' className="ml-2 font-thin text-xsmall pl-px">Work Setup</p>
                </div>

                <div className="flex flex-row mt-2">
                    <Image 
                        src="/Schedule Icon.svg" 
                        width={18} 
                        height={20}
                        alt="Schedule Icon"
                    />
                    <p id='schedule' className="ml-2 font-thin text-xsmall pl-1">Schedule</p>
                </div>

                <div className="flex flex-row mt-2">
                    <Image 
                        src="/Salary Icon.svg" 
                        width={18} 
                        height={20}
                        alt="Salary Icon"
                    />
                    <p id='salary' className="ml-2 font-thin text-xsmall pl-px">Salary</p>
                </div>

                <div className="flex flex-col mt-2">
                    <ul id='job_description' className="list-disc list-inside">
                        <li className="text-xsmall hover:text-fontcolor"> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                        <li className="text-xsmall hover:text-fontcolor"> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    </ul>
                </div>
            </div>

            {/*Job listing 2*/}
            <div className="job-listing-box flex flex-col p-4 mb-4">
                <div className="flex flex-row justify-between items-center">
                        <Image 
                            src="/Logo.png" 
                            width={30} 
                            height={30} 
                            alt="Company Logo" 
                        />
                        <button onClick={toggleSave}>
                            <Image 
                                src={isSaved ? "/Save Icon.svg" : "/Unsave Icon.svg"} 
                                width={13} 
                                height={11} 
                                alt={isSaved ? "Save Icon" : "Unsave Icon"} 
                            />
                        </button>
                </div>
                <p className="font-semibold text-large mt-2">Job Title</p>
                <p className="font-thin text-xsmall">Company</p>
                <p className="font-thin text-xsmall">Job Industry</p>

                <div className="flex flex-row mt-2">
                    <Image 
                        src="/Location Icon.svg" 
                        width={23} 
                        height={20}
                        alt="Location Icon"
                    />
                    <p id='work_location' className="ml-1.5 font-thin text-xsmall pl-px">Location</p>
                </div>

                <div className="flex flex-row mt-2 pl-px">
                    <Image 
                        src="/Work Setup Icon.svg" 
                        width={20} 
                        height={20}
                        alt="Work Setup Icon"
                    />
                    <p id='work_setup' className="ml-2 font-thin text-xsmall pl-px">Work Setup</p>
                </div>

                <div className="flex flex-row mt-2">
                    <Image 
                        src="/Schedule Icon.svg" 
                        width={18} 
                        height={20}
                        alt="Schedule Icon"
                    />
                    <p id='schedule' className="ml-2 font-thin text-xsmall pl-1">Schedule</p>
                </div>

                <div className="flex flex-row mt-2">
                    <Image 
                        src="/Salary Icon.svg" 
                        width={18} 
                        height={20}
                        alt="Salary Icon"
                    />
                    <p id='salary' className="ml-2 font-thin text-xsmall pl-px">Salary</p>
                </div>

                <div className="flex flex-col mt-2">
                    <ul id='job_description' className="list-disc list-inside">
                        <li className="text-xsmall hover:text-fontcolor"> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                        <li className="text-xsmall hover:text-fontcolor"> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    </ul>
                </div>
            </div>

             {/*Job listing 3*/}
             <div className="job-listing-box flex flex-col p-4 mb-4">
             <div className="flex flex-row justify-between items-center">
                    <Image 
                        src="/Logo.png" 
                        width={30} 
                        height={30} 
                        alt="Company Logo" 
                    />
                    <button onClick={toggleSave}>
                        <Image 
                            src={isSaved ? "/Save Icon.svg" : "/Unsave Icon.svg"} 
                            width={13} 
                            height={11} 
                            alt={isSaved ? "Save Icon" : "Unsave Icon"} 
                        />
                    </button>
                </div>
                <p className="font-semibold text-large mt-2">Job Title</p>
                <p className="font-thin text-xsmall">Company</p>
                <p className="font-thin text-xsmall">Job Industry</p>

                <div className="flex flex-row mt-2">
                    <Image 
                        src="/Location Icon.svg" 
                        width={23} 
                        height={20}
                        alt="Location Icon"
                    />
                    <p id='work_location' className="ml-1.5 font-thin text-xsmall pl-px">Location</p>
                </div>

                <div className="flex flex-row mt-2 pl-px">
                    <Image 
                        src="/Work Setup Icon.svg" 
                        width={20} 
                        height={20}
                        alt="Work Setup Icon"
                    />
                    <p id='work_setup' className="ml-2 font-thin text-xsmall pl-px">Work Setup</p>
                </div>

                <div className="flex flex-row mt-2">
                    <Image 
                        src="/Schedule Icon.svg" 
                        width={18} 
                        height={20}
                        alt="Schedule Icon"
                    />
                    <p id='schedule' className="ml-2 font-thin text-xsmall pl-1">Schedule</p>
                </div>

                <div className="flex flex-row mt-2">
                    <Image 
                        src="/Salary Icon.svg" 
                        width={18} 
                        height={20}
                        alt="Salary Icon"
                    />
                    <p id='salary' className="ml-2 font-thin text-xsmall pl-px">Salary</p>
                </div>

                <div className="flex flex-col mt-2">
                    <ul id='job_description' className="list-disc list-inside">
                        <li className="text-xsmall hover:text-fontcolor"> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                        <li className="text-xsmall hover:text-fontcolor"> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    </ul>
                </div>
            </div>

        </div>
    );
};

const JobListingsWrapper = () => {
    return (
        <div className="flex overflow-y-auto border border-none hide-scrollbar p-1 h-[calc(100vh-150px)]">
            <JobListings />
        </div>
    );
};

export default JobListingsWrapper;
