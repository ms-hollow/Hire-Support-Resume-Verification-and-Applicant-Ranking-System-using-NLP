import { useState, useContext, useEffect, useCallback } from "react";
import Image from 'next/image';
import AuthContext from "@/pages/context/AuthContext";

//TODO Add loader
//TODO Optimize Dapat mag load muna lahat ng data before mag mount

const SavedJobs = () => {
  const { authTokens } = useContext(AuthContext);
  const [savedJobs, setSavedJobs] = useState([]); 
  const [loading, setLoading] = useState(true);   
  const [error, setError] = useState(null);       
  const [jobListings, setJobListings] = useState([]);
  const [savedStatus, setSavedStatus] = useState({}); 

  // Fetch saved jobs from the backend
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await fetch('https://hire-support-resume-verification-and.onrender.com/applicant/saved-jobs/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`, 
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch saved jobs');
        }
  
        const data = await res.json();
        setSavedJobs(data); 
        // console.log('Saved Jobs Data:', data);
  
        // Extract job_hiring_ids from the saved jobs data
        const jobHiringIds = data.map((job) => job.job_hiring_id);
        // console.log('Job Hiring IDs:', jobHiringIds);
  
        // Kunin yung job listings based sa job Id
        getJobs(jobHiringIds);
  
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    // Function to fetch the job listings based on the job IDs
    const getJobs = async (jobHiringIds) => {
      try {
        const response = await fetch('https://hire-support-resume-verification-and.onrender.com/job/job-hirings/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
          },
        });
  
        const data = await response.json();
  
        if (response.status === 200) {
          // Filter job listings to only include the jobs that match the saved job IDs
          const filteredJobs = data.filter((job) => jobHiringIds.includes(job.job_hiring_id)).map((job) => ({
            job_id: job.job_hiring_id,
            job_title: job.job_title,
            company_name: job.company_name,
            job_industry: job.job_industry,
            job_description: job.job_description || "No description available",
            salary: job.salary ? `Php ${job.salary.min} - ${job.salary.max}` : "Not specified",
            schedule: job.schedule,
            location: job.work_location,
            work_setup: job.work_setup,
          }));

          // Set job listings and the initial saved status for each job
          const initialSavedStatus = filteredJobs.reduce((acc, job) => {
            acc[job.job_id] = savedJobs.some(savedJob => savedJob.job_hiring_id === job.job_id); // Check if the job is saved
            return acc;
          }, {});

          setJobListings(filteredJobs);
          setSavedStatus(initialSavedStatus);  // Initialize the saved status for each job
        } else {
          console.error("Failed to fetch job listings");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
  
    fetchSavedJobs();
  }, [authTokens, savedJobs]); 

  const handleSaveJob = useCallback(async (jobId) => {
    try {
      const savedJobs = await fetch(`https://hire-support-resume-verification-and.onrender.com/applicant/save-job/${jobId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });

      if (savedJobs.ok) {
        setSavedStatus(prevState => ({
          ...prevState,
          [jobId]: true, // Mark this job as saved
        }));
        alert('Job saved successfully!');
      } else {
        console.error(`Failed to save job: ${savedJobs.status}`);
      }
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  }, [authTokens]);

  // Handle unsave job
  const handleUnsaveJob = useCallback(async (jobId) => {
    try {
      await fetch(`https://hire-support-resume-verification-and.onrender.com/applicant/unsave-job/${jobId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });
      setSavedStatus(prevState => ({
        ...prevState,
        [jobId]: false, // Mark this job as unsaved
      }));
      alert('Job unsaved successfully!');
    } catch (error) {
      console.error('Failed to unsave job:', error);
    }
  }, [authTokens]);

  // Toggle save/unsave job
  const toggleSave = (jobId) => {
    if (savedStatus[jobId]) {
      handleUnsaveJob(jobId); // If job is saved, unsave it
    } else {
      handleSaveJob(jobId); // If job is not saved, save it
    }
  };

  if (loading) {
    return <div>Loading saved jobs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col">
        {jobListings.map((job) => (
            <div key={job.job_id} className="flex flex-col items-center justify-center pt-6 mx-80 w-[50vw]">
                <div className="justify-center items-center box-container px-8 py-5">
                    <div className="flex items-center justify-between -mt-8">
                        <Image src="/Logo.png" width={30} height={30} alt="Company Logo" />
                        <div className="justify-center items-center ml-4 mt-8">
                            <b className="font-bold text-large text-fontcolor">{job.job_title}</b>
                                <div className="text-xsmall font-thin text-fontcolor mt-1">
                                    <p>{job.company_name}</p>
                                    <p>{job.job_industry}</p>
                                </div>
                        </div>
                        <button className="button1 items-center flex justify-center flex-shrink-0 text-center ml-40">
                            <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-center">Apply Now</p>
                        </button>
                        <button onClick={() => toggleSave(job.job_id)} className="ml-auto">
                            <Image src={savedStatus[job.job_id] ? "/Save Icon.svg" : "/Unsave Icon.svg"} width={13} height={11} alt={savedStatus[job.job_id] ? "Save Icon" : "Unsave Icon"} />
                        </button>
                    </div>  
                    <div className="flex flex-row justify-between mt-2 px-11">
                        <div className="flex flex-row">
                            <Image src="/Location Icon.svg" width={23} height={20} alt="Location Icon" />
                            <p id='work_location' className="ml-1.5 font-thin text-xsmall text-fontcolor">{job.location}</p>
                        </div>
                        <div className="flex flex-row mx-4">
                            <Image src="/Work Setup Icon.svg" width={23} height={20} alt="Work Setup Icon" />
                            <p id='work_setup' className="ml-2 font-thin text-xsmall text-fontcolor">{job.work_setup}</p>
                        </div>
                        <div className="flex flex-row">
                            <Image src="/Schedule Icon.svg" width={18} height={20} alt="Schedule Icon" />
                            <p id='schedule' className="ml-2 font-thin text-xsmall text-fontcolor">{job.schedule}</p>
                        </div>
                    </div>

                    <div className="flex flex-row mt-2 px-11">
                        <Image 
                            src="/Salary Icon.svg" 
                            width={18} 
                            height={20}
                            alt="Salary Icon"
                        />
                        <p id='salary' className="ml-2 font-thin text-xsmall pl-px text-fontcolor">{job.salary}</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
  );
};

const SavedJobsWrapper = () => {
  return (
    <div className="flex overflow-y-auto border border-none hide-scrollbar p-1 h-[calc(100vh-150px)]">
      <SavedJobs />
    </div>
  );
};

export default SavedJobsWrapper;
