import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import GeneralFooter from "./GeneralFooter";
// import jobListings from '@/public/placeHolder/dummy_JobListings.json';

const JobListings = ({ jobListings }) => {

    const [isSaved, setIsSaved] = useState(false);
    const toggleSave = () => {
        setIsSaved(!isSaved);
    };

    if (!Array.isArray(jobListings)) {
        return <p>No job listings available.</p>;
    }

    
    return (
        <div className="flex flex-col">
            {/* Job listings */}
            {jobListings.length > 0 ? (
                jobListings.map((job, index) => (
                    <div key={index} className="job-listing-box flex flex-col p-4 mb-4 mx-auto">
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

                        <p className="font-semibold text-fontcolor text-large mt-2">{job.job_title}</p>
                        <p className="font-thin text-fontcolor text-xsmall">{job.company_name}</p>
                        <p className="font-thin text-fontcolor text-xsmall">{job.job_industry}</p>

                        <div className="flex flex-row mt-2">
                            <Image 
                                src="/Location Icon.svg" 
                                width={23} 
                                height={20}
                                alt="Location Icon"
                            />
                            <p id='work_location' className="ml-1.5 font-thin text-fontcolor text-xsmall pl-px">{job.location}</p>
                        </div>

                        <div className="flex flex-row mt-2 pl-px">
                            <Image 
                                src="/Work Setup Icon.svg" 
                                width={20} 
                                height={20}
                                alt="Work Setup Icon"
                            />
                            <p id='work_setup' className="ml-2 font-thin text-fontcolor text-xsmall pl-px">{job.work_setup}</p>
                        </div>

                        <div className="flex flex-row mt-2">
                            <Image 
                                src="/Schedule Icon.svg" 
                                width={18} 
                                height={20}
                                alt="Schedule Icon"
                            />
                            <p id='schedule' className="ml-2 font-thin text-fontcolor text-xsmall pl-1">{job.schedule}</p>
                        </div>

                        <div className="flex flex-row mt-2">
                            <Image 
                                src="/Salary Icon.svg" 
                                width={18} 
                                height={20}
                                alt="Salary Icon"
                            />
                            <p id='salary' className="ml-2 font-thin text-fontcolor text-xsmall pl-px">{job.salary}</p>
                        </div>

                        <div className="flex flex-col mt-2">
                            <ul id='job_description' className="list-disc list-inside">
                                {job.job_description.map((desc, i) => (
                                    <li key={i} className="text-xsmall hover:text-fontcolor">
                                        {desc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))
            ) : (
                <p>No job listings available.</p>
            )}
        </div>
    );
};

const JobListingsWrapper = () => {
    return (
        <div className="flex overflow-y-auto border border-none hide-scrollbar p-1 h-[calc(100vh-150px)]">
            <JobListings />
            <GeneralFooter/>
        </div>
    );
};

export default JobListingsWrapper;
