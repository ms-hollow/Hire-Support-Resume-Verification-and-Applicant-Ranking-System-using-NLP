import Image from 'next/image';
import Link from "next/link";
import { useState, useContext, useEffect, useCallback } from "react";
import AuthContext from "@/pages/context/AuthContext";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import ToastWrapper from './ToastWrapper';

const SkeletonLoader = () => {
    return (
        <div className="flex flex-col h-full"> 
          <div className="job-details-box border-b-8 top rounded-t-lg p-4 animate-pulse">
              <div className="bg-placeholder h-4 mt-2 w-1/3 rounded"></div>
              <div className="bg-placeholder h-5 mt-2 w-full rounded"></div>

              <div className='flex flex-col items-center justify-center'>
                  <div className="bg-placeholder h-5 mt-2 w-1/2 rounded"></div>
                  <div className="bg-placeholder h-5 mt-2 w-1/2 rounded"></div>
              </div>
            
              <div className="flex justify-between  mt-2">
                  <div className="bg-placeholder rounded-xs w-4/12 h-8"></div>
                  <div className="bg-placeholder rounded-xs w-5/12 h-8"></div>
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
          </div>
    </div>
 );
};

const ApplicantDetails = ({applicantId}) => {
  const [individualApplicants, setindividualApplicants] = useState(null);
  const [jobId, setJobId] = useState(null);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const currentApplicantId = applicantId || localStorage.getItem('selectedApplicantId');
          const currentJobId = parseInt(localStorage.getItem('selectedJobId'));
          
          if (!currentApplicantId) {
            setError("No applicant ID provided");
            setLoading(false);
            return;
          }
  
          const res = await fetch('/placeHolder/dummy_ApplicantRanking.json');
          const json = await res.json();
  
          // First find the job entry
          const jobData = json.find(job => job.jobId === currentJobId);
          
          if (!jobData) {
            setError("Job not found");
            return;
          }
  
          // Then find the applicant within that job's applicants
          const applicant = jobData.applicants.find(item => item.id === currentApplicantId);
          
          if (applicant) {
            setindividualApplicants(applicant);
          } else {
            setError("Applicant not found");
          }
        } catch (error) {
          setError("Error fetching data: " + error.message);
        }{
        
        }
      };
  
      fetchData();
    }, [applicantId]);
  
    if (!individualApplicants) {
      return <SkeletonLoader />;
    }
  
    return (
      <div className="flex flex-col h-full">
        {/* Top Part of applicant Details - Fixed */}
        <div className="job-details-box border-b-8 top rounded-t-lg p-4 ">
          <p className="font-medium text-fontcolor text-medium">Applied For</p>  
          <p className="font-semibold text-fontcolor text-large">Job Title</p>

          <div className='flex flex-col items-center justify-center'>
            <p className="font-semibold text-primary text-large">  {individualApplicants.name}</p>
            <p className="font-thin text-fontcolor lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall">Applicant ID:  {individualApplicants.id}</p>
          </div>
        
          <div className="flex justify-between gap-5 mt-2">
            <button type="button" className="button1 flex flex-col items-center justify-center">
                <Link href="" className="flex items-center space-x-2">
                <p className="lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall font-medium text-center">View Resume</p>
                </Link>
            </button>
            <button type="button" className="button2 flex flex-col items-center justify-center">
                <Link href="" className="flex items-center space-x-2">
                <p className="lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall font-medium text-center">Supporting Documents</p>
                </Link>
            </button>
          </div>
        
        </div>
  
        {/* Main Part of Applicant Details - Scrollable */}
        <div className="job-details-box rounded-b-lg overflow-y-auto bg-white p-4">
       
          <p className="font-semibold text-xsmall text-fontcolor">Email Addres</p>
          <p id="EmployType" className="font-thin text-xsmall text-fontcolor pb-3">
            {individualApplicants.email}
          </p>

          <p className="font-semibold text-xsmall text-fontcolor">Contact No.</p>
          <p id="EmployType" className="font-thin text-xsmall text-fontcolor pb-3">
            {individualApplicants.contact_number}
          </p>

          {/* Complete Address*/}
          <p className="font-semibold text-xsmall text-fontcolor"> Complete Address</p>
          <p id="Qualifications" className="font-thin text-xsmall text-fontcolor pb-3">
            {individualApplicants.present_address}
          </p>
  
          {/*LinkedIn Profile*/}
          <p className="font-semibold text-xsmall text-fontcolor">LinkedIn Profile</p>
          <p id="AppliReq" className="font-thin text-xsmall text-fontcolor pb-3">
            {individualApplicants.linkedin_profile}
          </p>
  
        </div>
      </div>
    );
  };
  
const ApplicantDetailsWrapper = () => {
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [hiringDecision, setHiringDecision] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [individualApplicants, setindividualApplicants] = useState(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");


  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Get the applicant ID from localStorage
    const currentApplicantId = localStorage.getItem('selectedApplicantId');
    if (currentApplicantId) {
      setSelectedApplicantId(currentApplicantId);
    }
  }, []); // Empty dependency array means this runs once on mount

  if (!selectedApplicantId) {
    return <SkeletonLoader />;
  }

  const handleChange = (event) => {
    const value = event.target.value;
    setHiringDecision(value);

    if (value === "Schedule Interview") {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };

  const handleSchedule = () => {
    toast.success("Interview scheduled successfully!");
    handleCloseModal();
  };

  return (
    <div className="flex-1 h-[calc(100vh-150px)] border border-none rounded-lg">
      <ApplicantDetails  applicantId={selectedApplicantId}/>
      <ToastWrapper/>
        <div className="flex flex-grow items-center lg:-mt-36 mb:-mt-16 ">
          <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1 mr-2 font-medium">Hiring Decision: </p>
          <div className="flex h-medium rounded-xs border-2 border-fontcolor">
            <select className="valid:bg-primary invalid:bg-background valid:text-background invalid:text-fontcolor lg:w-auto mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"  id="hiring-decision"    name="hiring-decision"  value={hiringDecision}  required onChange={handleChange} >
              <option value="" disabled hidden> Hiring Decision</option>
              <option value="Shortlist">Shortlist</option>
              <option value="Reject">Reject</option>
              <option value="Schedule Interview">Schedule Interview</option>
              <option value="Email">Email</option>
              <option value="Accept">Accept</option>
            </select>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-background rounded-xs shadow-lg p-6 w-[90%] max-w-md">
                <p className="text-fontcolor mb-2">Schedule an Interview for</p>
                <p className="font-semibold text-primary text-large mb-6"> {individualApplicants?.name}   </p>

                {/* Date Picker */}
                <p className="text-fontcolor font-semibold mb-2">Interview Date</p>
                <div className="h-medium rounded-xs border-2 border-fontcolor flex mb-6">
                  <input  type="date" name="interview_date"   className="w-full px-2"  value={interviewDate}  min={today} onChange={(e) => setInterviewDate(e.target.value)} required  />
                </div>

                {/* Time Picker */}
                <p className="text-fontcolor font-semibold mb-4">Interview Time</p>
                <div className="flex flex-row gap-4 mb-6">
                  <div className="flex items-center flex-row flex-grow">
                    <p className="text-fontcolor font-semibold mr-2">Start:</p>
                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                      <input type="time" className="w-full px-2"value={startTime} onChange={(e) => setStartTime(e.target.value)} required/>
                    </div>
                  </div>
                  <div className="flex items-center flex-row flex-grow">
                    <p className="text-fontcolor font-semibold mr-2">End:</p>
                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                      <input type="time" className="w-full px-2" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                    </div>
                  </div>
                </div>

                {/* Location/Link */}
                <div className="flex flex-col flex-grow mb-6">
                    <p className="text-fontcolor font-semibold mb-2">Interview Location/Link</p>
                    <div className="h-medium rounded-xs border-2 border-fontcolor flex">
                        <input  type="text"  name="interview_link" required onChange={handleChange} />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-6">
                  <button className="button1 flex items-center justify-center" onClick={handleSchedule}  >
                    <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Schedule</p>
                  </button>
                  <button className="button2 flex items-center justify-center" onClick={handleCloseModal} >
                    <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">  Cancel </p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default ApplicantDetailsWrapper;
