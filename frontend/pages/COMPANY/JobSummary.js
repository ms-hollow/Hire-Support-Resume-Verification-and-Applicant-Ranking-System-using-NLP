import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from 'next/image';
import { useEffect, useState } from 'react';


export default function JobSummary() {
    const [jobDetails, setJobDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            // Retrieve all job details saved in localStorage
            const savedJobDetails = JSON.parse(localStorage.getItem("dummy_JobDetails"));
            console.log("Retrieved job details:", savedJobDetails);
    
            // Retrieve the draft job details if available
            const draftJob = JSON.parse(localStorage.getItem("draft_job"));
    
            // If there are saved job details, display the latest one
            if (savedJobDetails && savedJobDetails.length > 0) {
                const latestJob = savedJobDetails[savedJobDetails.length - 1];
                console.log("Latest job:", latestJob);
                setJobDetails(latestJob);
            } else if (draftJob) {
                // If no saved jobs but a draft exists, load the draft
                console.log("Loading draft job:", draftJob);
                setJobDetails(draftJob);
            }
        } catch (error) {
            console.error("Error loading job details:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg">Loading job details...</p>
            </div>
        );
    }

    if (!jobDetails) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg">No job details found. Please create a job first.</p>
            </div>
        );
    }


    const handleStatusUpdate = (status) => {
        if (!jobDetails) return;
      
        // Retrieve saved jobs from localStorage
        const savedJobs = JSON.parse(localStorage.getItem("dummy_JobDetails")) || [];
      
        // Update the status of the latest job
        const updatedJobs = savedJobs.map((job, index) => {
          if (index === savedJobs.length - 1) {
            return { ...job, status };
          }
          return job;
        });
      
        // Save the updated jobs back to localStorage
        localStorage.setItem("dummy_JobDetails", JSON.stringify(updatedJobs));
      
        // Clear jobDetails to allow for new job input
        setJobDetails(null);
      
        console.log(`Job status updated to: ${status}`);
      };

    return (
        <div>
            <CompanyHeader/>
            <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto">
                <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary"> Job Hiring Summary </h1>
                <div className="pb-8">
                    <div className="flex pt-2 pb-2">
                        <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                            <div className={`relative h-1 rounded-full transition-all duration-300 bg-primary`} style={{ width: "100%" }}></div>
                        </div>
                    </div>

                    <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-5 ">Please take a moment to carefully review all of your Job Hiring Information to ensure everything is accurate and complete, then click 'Publish Job Hiring' to proceed.</p>

                    <form className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
                        {/* Job Title Section */}
                        <div className="sticky top-20 h-max">
                            {/*Create Job*/}
                          <div className="flex flex-col h-full">
                                  {/* Top Part of Job Details - Fixed */}
                                  <div className="job-details-box bg-background border-b-8 top rounded-t-lg p-4">
                                    <div className="flex justify-between items-center">

                                        
                                      <p className="font-semibold text-fontcolor text-large">Software Engineer</p>
                                      <div className="flex items-center gap-2">
                                        <p className="font-thin text-fontcolor text-xsmall">1/15/2025</p>
                                        <Image src="/Menu.svg" width={23} height={20} alt="Menu" />
                                      </div>
                                    </div>
                                    <p className="font-thin text-fontcolor text-xsmall">Adobe</p>
                                    <p className="font-thin text-fontcolor text-xsmall">
                                     (Senior Level)
                                    </p>
                                    <div className="flex flex-row mt-2">
                                      <div className="flex flex-row">
                                        <Image src="/Location Icon.svg" width={23} height={20} alt="Location Icon" />
                                        <p className="ml-1.5 font-thin text-xsmall text-fontcolor">Valenzuela City</p>
                                      </div>
                                      <div className="flex flex-row mx-4">
                                        <Image src="/Work Setup Icon.svg" width={23} height={20} alt="Work Setup Icon" />
                                        <p className="ml-2 font-thin text-xsmall text-fontcolor">Remote</p>
                                      </div>
                                      <div className="flex flex-row">
                                        <Image src="/Schedule Icon.svg" width={18} height={20} alt="Schedule Icon" />
                                            <p className="ml-2 font-thin text-xsmall text-fontcolor">8 hrs Shift</p>
                                      </div>
                                    </div>
                                    <div className="flex flex-row mt-2 px-1">
                                      <Image src="/Salary Icon.svg" width={18} height={20} alt="Salary Icon" />
                                      <p className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Php 17,000-21,000 Monthly</p>
                                    </div>
                                  </div>
                            
                                  {/* Main Part of Job Details - Scrollable */}
                                  <div className="job-details-box rounded-b-lg overflow-y-auto bg-white p-4">
                                    {/*Employment Type*/}
                                    <p className="font-semibold text-xsmall text-fontcolor">Employment Type</p>
                                    <p  className="font-thin text-xsmall text-fontcolor pb-3">
                                      Full-Time
                                    </p>
                            
                                    {/*Job Description*/}
                                    <p className="font-semibold text-xsmall text-fontcolor">Job Description</p>
                                    <p className="font-thin text-xsmall text-fontcolor pb-3">
                                    • We are seeking a skilled Software Engineer to join our dynamic team. The ideal candidate will be responsible for developing, testing, and maintaining software applications, collaborating with cross-functional teams, and ensuring high-quality code delivery. <br></br>
                                    • Develop and maintain software applications: Write clean, efficient, and well-documented code to create and update software products. <br></br>
                                    • Collaborate with cross-functional teams: Work with various departments to gather requirements and develop effective solutions. <br></br>
                                  
                                    </p>
                            
                                    {/*Qualifications*/}
                                    <p className="font-semibold text-xsmall text-fontcolor">Qualifications (Credentials and Skills)</p>
                                    <p className="font-thin text-xsmall text-fontcolor pb-3">
                                    • Bachelor's degree in Computer Science, Software Engineering, or a related field. <br></br>
                                    • 1+ years of experience in software development. <br></br>
                                    • Proficiency in at least one programming language (e.g., Java, Python, C#). <br></br>
                                    • Familiarity with software development methodologies and tools (e.g., Agile, Git).<br></br>
                                    • Strong problem-solving and analytical skills. <br></br>
                                    • Excellent communication and teamwork abilities. <br></br>
                                    • Strong communication and collaboration skills. <br></br>
                                    • Ability to prioritize tasks, meet deadlines, and manage multiple projects simultaneously.
                                    </p>
                            
                                    {/*Application Requirements*/}
                                    <p className="font-semibold text-xsmall text-fontcolor">Application Requirements</p>
                                    <p id='AppliReq' className="font-thin text-xsmall text-fontcolor pb-3"> 
                                        {jobDetails.required_documents? (
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
                            
                                    {/*Benefits*/}
                                    <p className="font-semibold text-xsmall text-fontcolor">Benefits</p>
                                    <p  className="font-thin text-xsmall text-fontcolor pb-3">
                                     • Competitive salary and performance-based bonuses <br></br>
                                     • HMO (Health Maintenance Organization) <br></br>
                                     • Retirement savings plan with company matching <br></br>
                                     • Paid leave and holidays <br></br>
                                     • Professional development opportunities
                                    </p>
                            
                                    {/*No of Positions*/}
                                    <p className="font-semibold text-xsmall text-fontcolor">No. of Positions</p>
                                    <p className="font-thin text-xsmall text-fontcolor pb-3">
                                        4
                                    </p>
                            
                                    {/*Application Deadline*/}
                                    <p className="font-semibold text-xsmall text-fontcolor">Application Deadline</p>
                                    <p className="font-thin text-xsmall text-fontcolor pb-3">
                                        {new Date(jobDetails.application_deadline).toLocaleDateString("en-US", {
                                        month: "2-digit",day: "2-digit", year: "numeric",})}
                                    </p>
                            
                                    {/*Additional Notes*/}
                                    <p className="font-semibold text-xsmall text-fontcolor">Additional Notes</p>
                                    <p className="font-thin text-xsmall text-fontcolor pb-6">
                                    • This position offers the opportunity to work on cutting-edge projects and make a significant impact on the company's success. <br></br>
                                    • Applicants should be proactive, innovative, and passionate about technology.
                                    </p>
                                  </div>
                                </div>
                        </div>
                    <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-primary mb-4">Settings</h2>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Left Side - Required Documents */}
                                <div>
                                    <h3 className="text-sm font-semibold text-primary mb-2">Required Documents</h3>
                                    {["Resume", "Educational Documents", "Work Experience Documents", "Certification Documents"].map((doc, index) => (
                                    <label key={index} className="flex items-center space-x-2 mb-2">
                                        <input
                                        type="checkbox"
                                        value={doc}
                                        checked={jobDetails.required_documents.includes(doc)}
                                        onChange={(e) => {
                                            // Handle checkbox logic here
                                        }}
                                        className="w-4 h-4 border border-gray-300 rounded text-black"
                                        />
                                        <span className="text-fontcolor text-sm">{doc}</span>
                                    </label>
                                    ))}
                                </div>

                                {/* Right Side - Other Settings */}
                                <div>
                                    <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-primary">Deadline</h3>
                                    <p className="text-fontcolor text-sm"> 
                                        {new Date(jobDetails.application_deadline).toLocaleDateString("en-US", {
                                        month: "2-digit",day: "2-digit", year: "numeric",})}</p>
                                    </div>

                                    <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-primary">Weight of Criteria</h3>
                                    <p className="text-fontcolor text-sm">{jobDetails.weightOfCriteria}</p>
                                    </div>

                                    <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-primary">Verification Option</h3>
                                    <p className="text-fontcolor text-sm">{jobDetails.verification_option}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Criteria Scoring Section */}
                            <div className="mt-6">
                                <h3 className="text-xm font-semibold text-primary mb-4">Criteria Scoring</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold text-primary">Work Experience</h4>
                                        <span className="text-fontcolor text-sm"> Weight: {jobDetails.criteria.workExperience.weight}%</span>
                                    </div>
                                    <ul className="pl-5 mt-2 space-y-1">
                                        <div className="border-b pb-1">
                                            <p className="text-fontcolor text-xs">Directly Relevant</p>
                                            <p className="font-semibold  text-fontcolor text-sm">{jobDetails.criteria.workExperience.directlyRelevant.join(", ")} </p> 
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Highly Relevant</li>
                                            <p className="font-semibold text-fontcolor text-sm"> {jobDetails.criteria.workExperience.highlyRelevant.join(", ")} </p>   
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Moderately Relevant</li>
                                            <p className="font-semibold text-fontcolor text-sm"> {jobDetails.criteria.workExperience.moderatelyRelevant.join(", ")} </p>   
                                        </div>
                                    </ul>

                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold text-primary">Skills</h4>
                                        <span className="text-fontcolor text-sm">Weight: {jobDetails.criteria.skills.weight}%</span>
                                    </div>
                                    <ul className="pl-5 mt-2 space-y-1">
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Primary Skills</li>
                                            <p className="font-semibold text-fontcolor text-sm"> {jobDetails.criteria.skills.primarySkills.join(", ")} </p>
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Secondary Skills</li>
                                            <p className="font-semibold text-fontcolor text-sm"> {jobDetails.criteria.skills.secondarySkills.join(", ")} </p> 
                                        </div>
                                          <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Additional Skills</li>
                                            <p className="font-semibold text-fontcolor text-sm"> {jobDetails.criteria.skills.additionalSkills.join(", ")} </p>  
                                        </div>
                                    </ul>

                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold text-primary">Education</h4>
                                        <span className="text-fontcolor text-sm">Weight: {jobDetails.criteria.education.weight}%</span>
                                    </div>

                                    <ul className="pl-5 mt-2 space-y-1">
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">1st Choice Field Study</li>
                                            <p className="font-semibold text-fontcolor text-sm">{jobDetails.criteria.education.firstChoice} </p> 
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">2nd Choice Field Study</li>
                                            <p className="font-semibold text-fontcolor text-sm">{jobDetails.criteria.education.secondChoice} </p>
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">3rd Choice Field Study</li>
                                            <p className="font-semibold text-fontcolor text-sm">{jobDetails.criteria.education.thirdChoice} </p> 
                                        </div>
                                    </ul>
                        
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold text-primary">Additional Points</h4>
                                    </div>

                                    <ul className="pl-5 mt-2 space-y-1">
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">School Preference</li>
                                            <li className="font-semibold text-fontcolor text-sm">{jobDetails.criteria.schools.selectedOptions.join(", ")} </li> 
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Honorsy</li>
                                            <li className="text-semibold text-sm"> </li>   
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Multiple Degrees</li>
                                            <li className="text-semibold text-sm"> </li>   
                                        </div>
                                    </ul>
                                    <div>
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-semibold text-primary">Certifications</h4>
                                            <span className="text-fontcolor text-sm">Weight: {jobDetails.criteria.certificates.weight}%</span>
                                        </div>
                                        <ul className="pl-5 mt-2 space-y-1">
                                            <li className="text-fontcolor text-xs">Institutional Preference Bonus</li>
                                            <li className="font-semibold text-fontcolor text-sm"> {jobDetails.criteria.certificates.preferred}</li> 
                                        </ul>
                                    </div>
                                </div>
                            </div>
                </div>

                {/*Setting*/}
                 </form>
                 <div className="flex justify-between">          
                            <button type="button" className="button2 flex items-center justify-center">
                                <Link href="/COMPANY/CompanySettings" className="ml-auto">
                                    <div className="flex items-center space-x-2">
                                        <Image 
                                        src="/Arrow Left.svg" 
                                        width={23} 
                                        height={10} 
                                        alt="Back Icon" 
                                        />
                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Back</p>
                                    </div>
                                    </Link>
                            </button>
                        <div className="flex gap-4">
                            <button type="button"  onClick={() => handleStatusUpdate('publish')} className="button2 flex items-center justify-center">
                                <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center"> Save as Draft</p>
                            </button>

                            <button type="button" onClick={() => handleStatusUpdate('publish')}  className="button1 flex items-center justify-center">
                                <Link href="/COMPANY/CompanyHome" className="flex items-center space-x-2 ml-auto">
                                <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Publish Job Hiring</p>
                                </Link>
                            </button>
                        </div>
                    </div>   
                </div>
           </div>
            <GeneralFooter/>
        </div>
    );
}
