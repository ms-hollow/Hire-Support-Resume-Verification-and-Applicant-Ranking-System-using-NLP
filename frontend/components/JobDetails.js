import Image from 'next/image';
import { useState, useContext, useEffect } from "react";
import AuthContext from "@/pages/context/AuthContext";
import { useRouter } from 'next/router';

//TODO: pending task Application Requirements
//TODO: Optimize load ng data
//TODO: is saved?

const JobDetails = ({ authToken }) => {

    const router = useRouter();
    const { jobId } = router.query;
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (jobId) {
        fetchJobDetails(Number(jobId)); // Trigger fetch when jobId changes
        }
    }, [jobId]);

    const fetchJobDetails = async (id) => {
        setLoading(true);
        setJobDetails(null); // Clear previous job details while loading

        try {
        const response = await fetch(`http://127.0.0.1:8000/job/hirings/${id}/`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            }
        );

        if (response.status === 200) {
            const data = await response.json();
            setJobDetails(data);
            console.log("Fetched job details:", data);

            const formatDate = (dateString, format = "short") => {
                const date = new Date(dateString);
                const day = String(date.getDate()).padStart(2, '0'); 
                const year = date.getFullYear();

                if (format === "long") {
                    const months = [
                        "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                    ];
                    const month = months[date.getMonth()];  // Get full month name
                    return `${month} ${day}, ${year}`;
                } else {
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                    return `${month}/${day}/${year}`; 
                }
            };

            // Check and format the dates and salary
            if (jobDetails) {
                if (jobDetails.creation_date && jobDetails.application_deadline) {
                    const datePosted = formatDate(jobDetails.creation_date, "short");
                    const deadline = formatDate(jobDetails.application_deadline, "long");

                    setJobDetails((prevDetails) => ({
                        ...prevDetails,
                        creation_date: datePosted,
                        application_deadline: deadline,
                    }));

                    // console.log(datePosted, deadline);
                } else {
                    console.log("Job details not yet loaded.");
                }

                // Format salary
                const formattedSalary = jobDetails.salary
                    ? `Php ${jobDetails.salary.min} - ${jobDetails.salary.max}`
                    : "Not specified";

                setJobDetails((prevDetails) => ({
                    ...prevDetails,
                    formattedSalary: formattedSalary,
                }));

                // console.log(formattedSalary);
            }

        } else {
            console.error('Failed to fetch job details');
        }
        } catch (error) {
        console.error('Error fetching job details:', error);
        } finally {
        setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading job details...</p>;
    }

    if (!jobDetails) {
        return <p>No job details available.</p>;
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
                <p className="font-thin text-fontcolor text-xsmall">{jobDetails.job_industry}</p>
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
                    <p className="ml-2 font-thin text-xsmall pl-px text-fontcolor">{jobDetails.formattedSalary}</p>
                </div>

                <div className="flex mt-4 gap-8">
                    <button type="button" className="button1 flex items-center justify-center">
                        <a href="/APPLICANT/JobApplication"className="lg:text-medium font-medium">Apply</a>
                    </button>

                    <button type="button" className="button2 flex items-center justify-center">
                        <a href="/APPLICANT/MyJobs" className="lg:text-medium font-medium">Save</a>
                    </button>
                </div>
            </div>

            {/* Main Part of Job Details - Scrollable */}
            <div className="job-details-box rounded-b-lg overflow-y-auto flex-1 bg-white p-4">
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
                <p id='AppliReq' className="font-thin text-xsmall text-fontcolor pb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet tincidunt et turpis habitasse ultrices condimentum velit. At nulla eu urna cras sed odio mauris vivamus erat. Elit mi massa nisl enim. Tristique massa sit est in senectus amet, ut nullam. Amet consectetur netus duis diam. Consectetur pellentesque non eget nisl, pretium, ultrices. Tortor dignissim pretium aliquet nunc, pulvinar. Faucibus tincidunt odio tincidunt massa lobortis aliquam venenatis neque. Tortor porttitor parturient sagittis non faucibus faucibus tincidunt ut aliquam. Egestas sed massa enim tempor at orci dignissim id. Sed metus mi leo rutrum felis. </p>

                {/* Benefit*/} 
                <p className="font-semibold text-xsmall text-fontcolor "> Benefits </p>
                <p id="Benefits" className="font-thin text-xsmall text-fontcolor pb-3">
                    {jobDetails.benefits ? (
                        <>
                            {jobDetails.benefits.health && (
                                <span><strong>Health:</strong> {jobDetails.benefits.health}</span>
                            )}
                            {jobDetails.benefits.vacation_days && (
                                <>
                                    <br />
                                    <span><strong>Vacation Days:</strong> {jobDetails.benefits.vacation_days}</span>
                                </>
                            )}
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
