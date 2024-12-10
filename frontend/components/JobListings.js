import { useState, useContext, useEffect } from "react";
import Image from 'next/image';
import GeneralFooter from "./GeneralFooter";
import { useRouter } from 'next/router';
import Link from 'next/link'; 

import AuthContext from "@/pages/context/AuthContext";

const JobListings = ({ authToken}) => {

    const [jobListings, setJobListings] = useState([]);
    const router = useRouter();

    useEffect(()=> {
        getJobs();
    }, [])

    let getJobs = async () => {

        let response = await fetch('http://127.0.0.1:8000/job/job-hirings/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authToken),
            },
        });
        
        let data = await response.json();
    
        if (response.status === 200) {
            // Extract the properties you need from the fetched data
            const filteredJobs = data.map((job) => ({
                job_id: job.job_hiring_id,
                job_title: job.job_title,
                company_name: job.company_name,
                job_industry: job.job_industry,
                job_description: job.job_description || "No description available",
                salary: job.salary 
                ? `Php ${job.salary.min} - ${job.salary.max}` 
                : "Not specified",
                schedule: job.schedule,
                location: job.work_location,
                work_setup: job.work_setup,
            }));
    
            setJobListings(filteredJobs); // Set the filtered data
            // console.log(filteredJobs);
        } else {
            console.error("Failed to fetch job listings");
        }
    };
    
    //TODO
    const handleJobClick = (jobId) => {
        router.push({
            pathname: router.pathname, // Stay on the same page
            query: { jobId },  // Add job_id to the URL
        }, undefined, { shallow: true });
    };

    //TODO
    const [isSaved, setIsSaved] = useState(false);
    const toggleSave = () => {
        setIsSaved(!isSaved);
    };

    //TODO Frontend Team: Change this to preloader
    if (!Array.isArray(jobListings)) {
        return <p>No job listings available.</p>;
    }

    return (
        <div className="flex flex-col">
            {/* Job listings */}
            {jobListings.length > 0 ? (
                jobListings.map((job) => (
                    <div key={job.job_id} onClick={() => handleJobClick(job.job_id)} className="job-listing-box flex flex-col p-4 mb-4 mx-auto">
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
                            <p id="job_description" className="text-xsmall text-fontcolor">
                                {job.job_description}
                            </p>
                            {/* <ul id='job_description' className="list-disc list-inside">
                                {job.job_description.map((desc, i) => (
                                    <li key={i} className="text-xsmall hover:text-fontcolor">
                                        {desc}
                                    </li>
                                ))}
                            </ul> */}
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
    const { authTokens } = useContext(AuthContext);

    return (
        <div className="flex overflow-y-auto border border-none hide-scrollbar p-1 h-[calc(100vh-150px)]">
            <JobListings authToken={authTokens.access}  />
            <GeneralFooter/>
        </div>
    );
};

export default JobListingsWrapper;
