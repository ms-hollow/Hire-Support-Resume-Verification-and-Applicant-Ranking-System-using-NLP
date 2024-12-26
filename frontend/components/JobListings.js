import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import GeneralFooter from "./GeneralFooter";
import { useRouter } from "next/router";
import AuthContext from "@/pages/context/AuthContext";

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col w-full">
        <div className="job-listing-box flex flex-col p-4 mb-4 animate-pulse">
        <div className="flex flex-row justify-between items-center">
              <div className="bg-placeholder rounded-full w-8 h-6"></div>
              <div className="bg-placeholder rounded w-4 h-5"></div>
            </div>

            <div className="bg-placeholder h-5 mt-2 rounded w-full"></div>
            <div className="bg-placeholder h-3 mt-2 w-1/2 rounded"></div>
            <div className="bg-placeholder h-3 mt-2 w-1/3 rounded"></div>

            <div className="flex flex-row items-center mt-4">
              <div className="bg-placeholder rounded-full w-6 h-4"></div>
              <div className="bg-placeholder h-3 ml-2 w-1/3 rounded"></div>
            </div>

            <div className="flex flex-row items-center mt-2">
              <div className="bg-placeholder rounded-full w-6 h-4"></div>
              <div className="bg-placeholder h-3 ml-2 w-1/3 rounded"></div>
            </div>

            <div className="flex flex-row items-center mt-2">
              <div className="bg-placeholder rounded-full w-6 h-4"></div>
              <div className="bg-placeholder h-3 ml-2 w-1/4 rounded"></div>
            </div>

            <div className="flex flex-row items-center mt-2">
              <div className="bg-placeholder rounded-full w-6 h-4"></div>
              <div className="bg-placeholder h-3 ml-2 w-1/4 rounded"></div>
            </div>

            <div className="bg-placeholder h-3 mt-4 rounded w-full"></div>
            <div className="bg-placeholder h-3 mt-1 rounded w-full"></div>
            <div className="bg-background h-0 mt-1 rounded w-screen"></div>

        </div>
    </div>

  );
};

const JobListings = ({ authToken }) => {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading
  const router = useRouter();

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = async () => {
    try {
      // console.log("Token", authToken);
      const response = await fetch(
        "http://127.0.0.1:8000/job/job-hirings/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authToken),
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
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

        setJobListings(filteredJobs);
      } else {
        console.error("Failed to fetch job listings");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false); // Turn off loading after fetching
    }
  };

  const handleJobClick = (jobId) => {
    router.push(
      {
        pathname: router.pathname,
        query: { jobId },
      },
      undefined,
      { shallow: true }
    );
  };

   //TODO
   const [isSaved, setIsSaved] = useState(false);
   const toggleSave = () => {
       setIsSaved(!isSaved);
   };
   

   if (!Array.isArray(jobListings)) {
       return <p>No job listings available.</p>;
   }

  return (
    <div className="flex flex-col w-full">
      {/* Display skeleton loader when loading */}
      {loading
        ? Array.from({ length: 5 }).map((_, index) => <SkeletonLoader key={index} />)
        : jobListings.length > 0
        ? jobListings.map((job) => (
            <div
              key={job.job_id}
              onClick={() => handleJobClick(job.job_id)}
              className="job-listing-box flex flex-col p-4 mb-4 mx-auto w-full"
            >
              <div className="flex flex-row justify-between items-center">
                <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                <Image
                  src="/Unsave Icon.svg"
                  width={13}
                  height={11}
                  alt="Save Icon"
                />
              </div>
              <p className="font-semibold text-fontcolor text-large mt-2">{job.job_title}</p>
              <p className="font-thin text-fontcolor text-xsmall">{job.company_name}</p>
              <p className="font-thin text-fontcolor text-xsmall">{job.job_industry}</p>
              <div className="flex flex-row mt-2">
                <Image src="/Location Icon.svg" width={23} height={20} alt="Location Icon" />
                <p id="work_location" className="ml-1.5 font-thin text-fontcolor text-xsmall pl-px">
                  {job.location}
                </p>
              </div>
              <div className="flex flex-row mt-2 pl-px">
                <Image src="/Work Setup Icon.svg" width={20} height={20} alt="Work Setup Icon" />
                <p id="work_setup" className="ml-2 font-thin text-fontcolor text-xsmall pl-px">
                  {job.work_setup}
                </p>
              </div>
              <div className="flex flex-row mt-2">
                <Image src="/Schedule Icon.svg" width={18} height={20} alt="Schedule Icon" />
                <p id="schedule" className="ml-2 font-thin text-fontcolor text-xsmall pl-1">
                  {job.schedule}
                </p>
              </div>
              <div className="flex flex-row mt-2">
                <Image src="/Salary Icon.svg" width={18} height={20} alt="Salary Icon" />
                <p id="salary" className="ml-2 font-thin text-fontcolor text-xsmall pl-px">
                  {job.salary}
                </p>
              </div>
              <div className="flex flex-col mt-2">
                <p id="job_description" className="text-xsmall text-fontcolor">
                  {job.job_description}
                </p>
              </div>
            </div>
          ))
        : <p className="flex flex-col text-fontcolor">No job listings available.</p>}
    </div>
  );
};

const JobListingsWrapper = () => {
  const { authTokens } = useContext(AuthContext);
  return (
    <div className="flex overflow-y-auto border border-none hide-scrollbar p-1 h-[calc(100vh-150px)]">
      <JobListings authToken={authTokens.access} />
      <GeneralFooter />
    </div>
  );
};

export default JobListingsWrapper;
