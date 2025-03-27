import { useState, useContext, useEffect, useCallback } from "react";
import Image from "next/image";
import GeneralFooter from "./GeneralFooter";
import { useRouter } from "next/router";
import AuthContext from "@/pages/context/AuthContext";
import { JLSkeletonLoader } from "./ui/SkeletonLoader";
import { useAddressMapping } from "@/pages/utils/AddressMapping";

//TODO Polish save and unsave animation

const JobListings = ({ authToken, onJobClick }) => {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedStatus, setSavedStatus] = useState({});
  const router = useRouter();
  const { convertAddressCodes } = useAddressMapping();

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/job/job-hirings/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authToken),
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        const filteredJobs = data.map((job) => {
          const address = convertAddressCodes(
            job.region,
            job.province,
            job.city,
            job.barangay
          );

          return {
            job_id: job.job_hiring_id,
            job_title: job.job_title,
            company_name: job.company_name,
            job_industry: job.job_industry,
            job_description: job.job_description || "No description available",
            salary: job.salary
              ? `Php ${job.salary.min} - ${job.salary.max}`
              : "Not specified",
            schedule: job.schedule,
            location: `${address.regionName}, ${address.provinceName}, ${address.cityName}, ${address.barangayName}`,
            work_setup: job.work_setup,
          };
        });

        setJobListings(filteredJobs);
      } else {
        console.error("Failed to fetch job listings");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
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
    onJobClick();
  };

  const getSavedJobs = useCallback(async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/applicant/saved-jobs/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const savedJobs = await response.json();

      if (response.status === 200) {
        const savedJobsIds = savedJobs.map((job) => job.job_hiring_id);
        const savedStatusObj = jobListings.reduce((acc, job) => {
          acc[job.job_id] = savedJobsIds.includes(job.job_id);
          return acc;
        }, {});
        setSavedStatus(savedStatusObj);
      } else {
        console.error("Failed to fetch saved jobs");
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  }, [authToken, jobListings]);

  useEffect(() => {
    getSavedJobs();
    const intervalId = setInterval(getSavedJobs, 10000); // Refresh yung pag retrieve every 10 seconds

    return () => clearInterval(intervalId);
  }, [getSavedJobs]);

  const handleSaveJob = useCallback(
    async (jobId) => {
      try {
        const savedJobs = await fetch(
          `http://127.0.0.1:8000/applicant/save-job/${jobId}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (savedJobs.ok) {
          setSavedStatus((prevState) => ({
            ...prevState,
            [jobId]: true,
          }));
          alert("Job saved successfully!");
        } else {
          console.error(`Failed to save job: ${savedJobs.status}`);
        }
      } catch (error) {
        console.error("Failed to save job:", error);
      }
    },
    [authToken]
  );

  const handleUnsaveJob = useCallback(
    async (jobId) => {
      try {
        await fetch(`http://127.0.0.1:8000/applicant/unsave-job/${jobId}/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setSavedStatus((prevState) => ({
          ...prevState,
          [jobId]: false,
        }));
        alert("Job unsaved successfully!");
      } catch (error) {
        console.error("Failed to unsave job:", error);
      }
    },
    [authToken]
  );

  const toggleSave = (jobId) => {
    if (savedStatus[jobId]) {
      handleUnsaveJob(jobId);
    } else {
      handleSaveJob(jobId);
    }
  };

  if (!Array.isArray(jobListings)) {
    return <p>No job listings available.</p>;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Display skeleton loader when loading */}
      {loading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <JLSkeletonLoader key={index} />
        ))
      ) : jobListings.length > 0 ? (
        jobListings.map((job) => (
          <div
            key={job.job_id}
            onClick={() => handleJobClick(job.job_id)}
            className="job-listing-box flex flex-col p-4 mb-4 mx-auto w-full"
          >
            <div className="flex flex-row justify-between items-center">
              <Image
                src="/Logo.png"
                width={30}
                height={30}
                alt="Company Logo"
              />
              <button
                onClick={() => toggleSave(job.job_id)}
                className="ml-auto"
              >
                <Image
                  src={
                    savedStatus[job.job_id]
                      ? "/Save Icon.svg"
                      : "/Unsave Icon.svg"
                  }
                  width={13}
                  height={11}
                  alt={savedStatus[job.job_id] ? "Save Icon" : "Unsave Icon"}
                />
              </button>
            </div>
            <p className="font-semibold text-fontcolor text-large mt-2">
              {job.job_title}
            </p>
            <p className="font-thin text-fontcolor text-xsmall">
              {job.company_name}
            </p>
            <p className="font-thin text-fontcolor text-xsmall">
              {job.job_industry}
            </p>
            <div className="flex flex-row mt-2">
              <Image
                src="/Location Icon.svg"
                width={23}
                height={20}
                alt="Location Icon"
              />
              <p
                id="work_location"
                className="ml-1.5 font-thin text-fontcolor text-xsmall pl-px"
              >
                {job.location}
              </p>
            </div>
            <div className="flex flex-row mt-2 pl-px">
              <Image
                src="/Work Setup Icon.svg"
                width={20}
                height={20}
                alt="Work Setup Icon"
              />
              <p
                id="work_setup"
                className="ml-2 font-thin text-fontcolor text-xsmall pl-px"
              >
                {job.work_setup}
              </p>
            </div>
            <div className="flex flex-row mt-2">
              <Image
                src="/Schedule Icon.svg"
                width={18}
                height={20}
                alt="Schedule Icon"
              />
              <p
                id="schedule"
                className="ml-2 font-thin text-fontcolor text-xsmall pl-1"
              >
                {job.schedule}
              </p>
            </div>
            <div className="flex flex-row mt-2">
              <Image
                src="/Salary Icon.svg"
                width={18}
                height={20}
                alt="Salary Icon"
              />
              <p
                id="salary"
                className="ml-2 font-thin text-fontcolor text-xsmall pl-px"
              >
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
      ) : (
        <p className="flex flex-col text-fontcolor">
          No job listings available.
        </p>
      )}
    </div>
  );
};

const JobListingsWrapper = ({ onJobClick }) => {
  const { authTokens } = useContext(AuthContext);
  return (
    <div className="flex overflow-y-auto border border-none hide-scrollbar p-1 h-[calc(100vh-150px)]">
      <JobListings authToken={authTokens.access} onJobClick={onJobClick} />
      <GeneralFooter />
    </div>
  );
};

export default JobListingsWrapper;
