import Image from 'next/image';
import { useState, useContext, useEffect, useCallback } from "react";
import AuthContext from "@/pages/context/AuthContext";
import { useRouter } from 'next/router';


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

const CompanyJobDetails = ({ jobId }) => {
    const [jobDetails, setJobDetails] = useState(null); 
  
    useEffect(() => {
      const fetchData = async () => {
        if (!jobId) {
          const storedJobId = localStorage.getItem('selectedJobId');
          if (!storedJobId) return;
          jobId = parseInt(storedJobId);
        }
        
        try {
          const res = await fetch('/placeHolder/dummy_JobDetails.json');
          const json = await res.json();
          const item = json.find(item => item.Id === parseInt(jobId));
          setJobDetails(item);
        } catch (error) {
          console.error('Error fetching job details:', error);
        }
      };
  
      fetchData();
    }, [jobId]);
  
  
    if (!jobDetails) {
      return <SkeletonLoader />;
    }
  
    return (
      <div className="flex flex-col h-full">
        {/* Top Part of Job Details - Fixed */}
        <div className="job-details-box border-b-8 top rounded-t-lg p-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-fontcolor text-xlarge">{jobDetails.job_title}</p>
            <div className="flex items-center gap-2">
              <p className="font-thin text-fontcolor text-xsmall">{jobDetails.creation_date}</p>
              <Image src="/Menu.svg" width={23} height={20} alt="Menu" />
            </div>
          </div>
          <p className="font-thin text-fontcolor text-xsmall">{jobDetails.company_name}</p>
          <p className="font-thin text-fontcolor text-xsmall">
            {jobDetails.job_industry} ({jobDetails.experience_level})
          </p>
          <div className="flex flex-row mt-2">
            <div className="flex flex-row">
              <Image src="/Location Icon.svg" width={23} height={20} alt="Location Icon" />
              <p className="ml-1.5 font-thin text-xsmall text-fontcolor">{jobDetails.work_location}</p>
            </div>
            <div className="flex flex-row mx-4">
              <Image src="/Work Setup Icon.svg" width={23} height={20} alt="Work Setup Icon" />
              <p className="ml-2 font-thin text-xsmall text-fontcolor">{jobDetails.work_setup}</p>
            </div>
            <div className="flex flex-row">
              <Image src="/Schedule Icon.svg" width={18} height={20} alt="Schedule Icon" />
              <p className="ml-2 font-thin text-xsmall text-fontcolor">{jobDetails.schedule}</p>
            </div>
          </div>
          <div className="flex flex-row mt-2 px-1">
            <Image src="/Salary Icon.svg" width={18} height={20} alt="Salary Icon" />
            <p className="ml-2 font-thin text-xsmall pl-px text-fontcolor">{jobDetails.salary}</p>
          </div>
        </div>
  
        {/* Main Part of Job Details - Scrollable */}
        <div className="job-details-box rounded-b-lg overflow-y-auto bg-white p-4">
          {/*Employment Type*/}
          <p className="font-semibold text-xsmall text-fontcolor">Employment Type</p>
          <p id="EmployType" className="font-thin text-xsmall text-fontcolor pb-3">
            {jobDetails.employment_type}
          </p>
  
          {/*Job Description*/}
          <p className="font-semibold text-xsmall text-fontcolor">Job Description</p>
          <p id="JobDescription" className="font-thin text-xsmall text-fontcolor pb-3">
            {jobDetails.job_description}
          </p>
  
          {/*Qualifications*/}
          <p className="font-semibold text-xsmall text-fontcolor">Qualifications (Credentials and Skills)</p>
          <p id="Qualifications" className="font-thin text-xsmall text-fontcolor pb-3">
            {jobDetails.qualifications}
          </p>
  
          {/*Application Requirements*/}
          <p className="font-semibold text-xsmall text-fontcolor">Application Requirements</p>
          <p id="AppliReq" className="font-thin text-xsmall text-fontcolor pb-3">
            {jobDetails.required_documents ? (
              <>
                {Object.entries(jobDetails.required_documents).map(([key, value]) => (
                  <span key={key}>• {value}<br /></span>
                ))}
              </>
            ) : (
              "No application requirements information available."
            )}
          </p>
  
          {/*Benefits*/}
          <p className="font-semibold text-xsmall text-fontcolor">Benefits</p>
          <p id="Benefits" className="font-thin text-xsmall text-fontcolor pb-3">
            {jobDetails.benefits ? (
              <>
                {Object.entries(jobDetails.benefits).map(([key, value]) => (
                  <span key={key}>
                    <strong>{key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:</strong> {value}
                    <br />
                  </span>
                ))}
              </>
            ) : (
              "No benefits information available."
            )}
          </p>
  
          {/*No of Positions*/}
          <p className="font-semibold text-xsmall text-fontcolor">No. of Positions</p>
          <p id="noPosition" className="font-thin text-xsmall text-fontcolor pb-3">
            {jobDetails.num_positions}
          </p>
  
          {/*Application Deadline*/}
          <p className="font-semibold text-xsmall text-fontcolor">Application Deadline</p>
          <p id="deadline" className="font-thin text-xsmall text-fontcolor pb-3">
            {jobDetails.application_deadline}
          </p>
  
          {/*Additional Notes*/}
          <p className="font-semibold text-xsmall text-fontcolor">Additional Notes</p>
          <p id="Notes" className="font-thin text-xsmall text-fontcolor pb-6">
            {jobDetails.additional_notes}
          </p>
  
          {/*Report Job Button*/}
          <button type="button" className="button2 flex items-center justify-center">
            <p className="lg:text-medium font-medium">Report Job</p>
          </button>
        </div>
      </div>
    );
  };
  

const CompanyJobDetailsWrapper = ({jobId}) => {
    return (
        <div className="flex-1 h-[calc(100vh-150px)] border border-none rounded-lg">
            <CompanyJobDetails jobId={jobId} />
        </div>
    );
};

export default CompanyJobDetailsWrapper;
