import Image from 'next/image';
import { useState, useContext, useEffect, useCallback } from "react";
import AuthContext from "@/pages/context/AuthContext";
import { useRouter } from 'next/router';

//TODO: Add condition that checks if the applicant already suubmitted an application

const SkeletonLoader = () => {
    return (
        <div className="flex flex-col h-full"> 
        <div className="job-details-box border-b-8 top rounded-t-lg p-4 animate-pulse">
            <div className="flex flex-row justify-between items-center">
                <div className="bg-placeholder h-5 mt-2 w-3/6 rounded"></div>
                <div className="flex items-center gap-2">
                    <div className="bg-placeholder rounded w-14 h-3"></div>
                    <div className="bg-placeholder rounded-full w-6 h-3"></div>

                </div>
            </div>

            <div className="bg-placeholder h-3 mt-2 w-1/2 rounded"></div>
            <div className="bg-placeholder h-3 mt-2 w-1/3 rounded"></div>

            <div className="flex flex-row mt-2 justify-between">
                <div className="flex flex-row items-center flex-1">
                    <div className="bg-placeholder rounded-full w-5 h-4"></div>
                    <div className="bg-placeholder h-3 ml-2 w-full rounded"></div>
                </div>

                <div className="flex flex-row items-center flex-1 mx-2">
                    <div className="bg-placeholder rounded-full w-5 h-4"></div>
                    <div className="bg-placeholder h-3 ml-2 w-full rounded"></div>
                </div>

                <div className="flex flex-row items-center flex-1">
                    <div className="bg-placeholder rounded-full w-5 h-4"></div>
                    <div className="bg-placeholder h-3 ml-2 w-full rounded"></div>
                </div>
            </div>

            <div className="flex flex-row items-center mt-2">
                    <div className="bg-placeholder rounded-full w-5 h-4"></div>
                    <div className="bg-placeholder h-3 ml-2 w-3/12 rounded"></div>
            </div>

            <div className="flex mt-4 gap-8">
                <div className="bg-placeholder rounded-full w-1/12 h-8"></div>
                <div className="bg-placeholder rounded-full w-1/12 h-8"></div>
            </div>
        </div>

        <div className="job-details-box rounded-b-lg overflow-y-auto bg-white p-4 animate-pulse">
            <div className="bg-placeholder h-3 mt-2 rounded w-1/4"></div>
                <div className="bg-placeholder h-3 mt-2 rounded w-full"></div>
            
            <div className="bg-placeholder h-3 mt-2 rounded w-1/4"></div>
                <div className="bg-placeholder h-3 mt-2 rounded w-full"></div>

            <div className="bg-placeholder h-3 mt-2 rounded w-1/4"></div>
                <div className="bg-placeholder h-3 mt-2 rounded w-full"></div>

            <div className="bg-placeholder h-3 mt-2 rounded w-1/4"></div>
                <div className="bg-placeholder h-3 mt-2 rounded w-full"></div>
            
            <div className="bg-placeholder h-3 mt-2 rounded w-1/4"></div>
                <div className="bg-placeholder h-3 mt-2 rounded w-full"></div>
            
            <div className="bg-placeholder h-3 mt-2 rounded w-1/4"></div>
                <div className="bg-placeholder h-3 mt-2 rounded w-full"></div>
            
            <div className="bg-placeholder h-3 mt-2 rounded w-1/4"></div>
                <div className="bg-placeholder h-3 mt-2 rounded w-full"></div>
            
            <div className="bg-placeholder h-3 mt-2 rounded w-1/4"></div>
                <div className="bg-placeholder h-3 mt-2 mb-6 rounded w-full"></div>
            
            <div className="bg-placeholder rounded-full w-1/6 h-8"></div>
        </div>
    </div>
 );
};

const JobDetails = ({ authToken }) => {

    const router = useRouter();
    const { jobId } = router.query;
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => { 
        if (jobId) {
            saveJobIdToSessionStorage(jobId);
            fetchJobDetails(Number(jobId)); // Trigger fetch when jobId changes
            checkIfSaved();
        }
    }, [jobId]);

    const saveJobIdToSessionStorage = (jobId) => {
        sessionStorage.setItem('jobId', jobId);
    };

    const fetchJobDetails = useCallback(async (id) => {
        setLoading(true);
        setJobDetails(null); // Clear previous job details while loading
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/job/hirings/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
    
            if (response.status === 200) {
                const data = await response.json();
                setJobDetails(data);

                sessionStorage.setItem('job_title', data.job_title);
                sessionStorage.setItem('company', data.company_name);
    
                // Format salary
                const formattedSalary = data.salary
                    ? `Php ${data.salary.min} - ${data.salary.max}`
                    : "Not specified";
    
                // Format dates
                const formatDate = (dateString, format = "short") => {
                    const date = new Date(dateString);
                    const day = String(date.getDate()).padStart(2, '0');
                    const year = date.getFullYear();
    
                    if (format === "long") {
                        const months = [
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ];
                        const month = months[date.getMonth()];
                        return `${month} ${day}, ${year}`;
                    } else {
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        return `${month}/${day}/${year}`;
                    }
                };
    
                // Check and format the dates and salary
                if (data) {
                    if (data.creation_date && data.application_deadline) {
                        const datePosted = formatDate(data.creation_date, "short");
                        const deadline = formatDate(data.application_deadline, "long");
    
                        setJobDetails((prevDetails) => ({
                            ...prevDetails,
                            creation_date: datePosted,
                            application_deadline: deadline,
                            salary: formattedSalary,
                        }));
                    }
                }
            } else {
                console.error('Failed to fetch job details');
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
        } finally {
            setLoading(false);
        }
    }, []);
    

    const checkIfSaved = useCallback(async () => {
        if (!jobId) return;

        try {
            const response = await fetch('http://127.0.0.1:8000/applicant/saved-jobs/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, 
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch saved jobs: ${response.status}`);
            }

            const savedJobs = await response.json();
            // localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
            // console.log('Saved Jobs:', savedJobs);

            if (Array.isArray(savedJobs)) {
                // Check if the current job id is saved by comparing job_hiring_id
                const jobIsSaved = savedJobs.some((job) => String(job.job_hiring_id) === jobId);

                // console.log('Is Job Saved:', jobIsSaved);
                if (jobIsSaved) {
                    setIsSaved(true);  
                } else {
                    setIsSaved(false); 
                }
            }
        } catch (error) {
            console.error("Failed to check saved jobs status:", error);
        }
    }, [jobId]);
    
    const handleSaveJob = useCallback(async () => {
        if (!jobId) return;
        try {
            const savedJobs = await fetch(`http://127.0.0.1:8000/applicant/save-job/${jobId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, 
                },
            });
    
            if (savedJobs.ok) {
                setIsSaved(true);
                alert("Job saved successfully!");

                // Update localStorage with the saved job
                // const savedJobsFromStorage = JSON.parse(localStorage.getItem('savedJobs')) || [];
                // localStorage.setItem('savedJobs', JSON.stringify([...savedJobsFromStorage, jobId]));
            } else {
                console.error(`Job already saved, Failed to save job: ${savedJobs.status}`);
            }

        } catch (error) {
            console.error("Failed to save job:", error);
        }
    }, [jobId]);

    // Unsave job
    const handleUnsaveJob = useCallback(async () => {
        if (!jobId) return;
        try {
            await fetch(`http://127.0.0.1:8000/applicant/unsave-job/${jobId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            setIsSaved(false);
            alert("Job unsaved successfully!");

            // Remove from localStorage
            // const savedJobsFromStorage = JSON.parse(localStorage.getItem('savedJobs')) || [];
            // const updatedSavedJobs = savedJobsFromStorage.filter(job => job !== jobId);
            // localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
        } catch (error) {
            console.error("Failed to unsave job:", error);
        }
    }, [jobId]);

    const navigateToJobApplication = () => {
        router.push({
            pathname: '/APPLICANT/JobApplication',
            query: { jobId }, 
        });
    };
    
    if (loading) {
        return <SkeletonLoader/>;
    }

    if (!jobDetails) {
        return <p className='text-fontcolor'>Please Select Job</p>;
    }

    return (
        <div className="flex flex-col h-full"> 
            {/* Top Part of Job Details - Fixed */}
            <div className="job-details-box border-b-8 top rounded-t-lg p-4">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-fontcolor text-large">{jobDetails.job_title}</p>
                    <div className="flex items-center gap-2">
                        <p className="font-thin text-fontcolor text-xsmall">{jobDetails.creation_date}</p>
                        <Image 
                            src="/Menu.svg" 
                            width={23} 
                            height={20} 
                            alt="Menu" 
                        />
                    </div>
                </div>

                <p className="font-thin text-fontcolor text-xsmall">{jobDetails.company_name}</p>
                <p className="font-thin text-fontcolor text-xsmall">{jobDetails.job_industry} ({jobDetails.experience_level})</p>
                <div className="flex flex-row mt-2">
                    <div className="flex flex-row">
                        <Image 
                            src="/Location Icon.svg" 
                            width={23} 
                            height={20} 
                            alt="Location Icon" 
                        />
                        <p className="ml-1.5 font-thin text-xsmall text-fontcolor">{jobDetails.work_location}</p>
                    </div>
                    <div className="flex flex-row mx-4">
                        <Image 
                            src="/Work Setup Icon.svg" 
                            width={23} 
                            height={20} 
                            alt="Work Setup Icon" 
                        />
                        <p className="ml-2 font-thin text-xsmall text-fontcolor">{jobDetails.work_setup}</p>
                    </div>
                    <div className="flex flex-row">
                        <Image 
                            src="/Schedule Icon.svg" 
                            width={18} 
                            height={20} 
                            alt="Schedule Icon" 
                        />
                        <p className="ml-2 font-thin text-xsmall text-fontcolor">{jobDetails.schedule}</p>
                    </div>
                </div>
                <div className="flex flex-row mt-2 px-1">
                    <Image 
                        src="/Salary Icon.svg" 
                        width={18} 
                        height={20} 
                        alt="Salary Icon" 
                    />
                    <p className="ml-2 font-thin text-xsmall pl-px text-fontcolor">{jobDetails.salary}</p>
                </div>

                <div className="flex mt-4 gap-8">
                    <button onClick={navigateToJobApplication} type="button" className="button1 flex items-center justify-center">
                        <p className="lg:text-medium font-medium">Apply</p>
                    </button>

                    <button 
                        onClick={isSaved ? handleUnsaveJob : handleSaveJob} 
                        type="button" 
                        className="button2 flex items-center justify-center lg:text-medium font-medium"
                    >
                        {isSaved ? 'Unsave' : 'Save'}
                    </button>

                </div>
            </div>

            {/* Main Part of Job Details - Scrollable */}
            <div className="job-details-box rounded-b-lg overflow-y-auto bg-white p-4">
                {/*Employment Type*/} 
                <p className="font-semibold text-xsmall text-fontcolor ">Employment Type</p>
                <p id='EmployType' className="font-thin text-xsmall text-fontcolor pb-3">{jobDetails.employment_type}</p>
                
                {/*Job Description*/} 
                <p className="font-semibold text-xsmall text-fontcolor "> Job Description</p>
                <p id='JobDescription' className="font-thin text-xsmall text-fontcolor pb-3">{jobDetails.job_description}</p>

                {/*Qualifications*/} 
                <p className="font-semibold text-xsmall text-fontcolor ">Qualifications (Credentials and Skills) </p>
                <p id='Qualifications' className="font-thin text-xsmall text-fontcolor pb-3">{jobDetails.qualifications}</p>

                {/*Application Requirements*/} 
                <p className="font-semibold text-xsmall text-fontcolor ">Application Requirements </p>
                <p id='AppliReq' className="font-thin text-xsmall text-fontcolor pb-3"> 
                    {jobDetails.required_documents ? (
                        <>
                            {Object.entries(jobDetails.required_documents).map(([key, value]) => (
                                <span key={key}>
                                    • {value}
                                    <br />
                                </span>
                            ))}
                        </>
                    ) : (
                        "No benefits information available."
                    )}
                </p>

                {/* Benefit*/} 
                <p className="font-semibold text-xsmall text-fontcolor "> Benefits </p>
                <p id="Benefits" className="font-thin text-xsmall text-fontcolor pb-3">
                    {jobDetails.benefits ? (
                        <>
                            {Object.entries(jobDetails.benefits).map(([key, value]) => (
                                <span key={key}>
                                    <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}:</strong> {value}
                                    <br />
                                </span>
                            ))}
                        </>
                    ) : (
                        "No benefits information available."
                    )}
                </p>

                {/* No of Positions*/} 
                <p className="font-semibold text-xsmall text-fontcolor "> No. of Positions</p>
                <p id='noPosition' className="font-thin text-xsmall text-fontcolor pb-3">{jobDetails.num_positions}</p>
                
                {/* App Deadline*/} 
                <p className="font-semibold text-xsmall text-fontcolor "> Application Deadline</p>
                <p id='deadline' className="font-thin text-xsmall text-fontcolor pb-3">{jobDetails.application_deadline}</p>
                
                {/* Add Notes*/} 
                <p className="font-semibold text-xsmall text-fontcolor "> Additional Note </p>
                <p id='Notes' className="font-thin text-xsmall text-fontcolor pb-6">{jobDetails.additional_notes}</p>

                {/* Report Job Button */}
                <button type="button" className="button2 flex items-center justify-center">
                    <p className="lg:text-medium font-medium">Report Job</p>
                </button>
            </div>
        </div>
    );
};

const JobDetailsWrapper = () => {

    const { authTokens } = useContext(AuthContext);

    return (
        <div className="flex-1 h-[calc(100vh-150px)] border border-none rounded-lg">
            <JobDetails authToken={authTokens.access} />
        </div>
    );
};

export default JobDetailsWrapper;