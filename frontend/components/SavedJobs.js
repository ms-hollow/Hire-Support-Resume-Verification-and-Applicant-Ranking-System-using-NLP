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
        const res = await fetch('http://127.0.0.1:8000/applicant/saved-jobs/', {
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
        const response = await fetch('http://127.0.0.1:8000/job/job-hirings/', {
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
      const savedJobs = await fetch(`http://127.0.0.1:8000/applicant/save-job/${jobId}/`, {
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
      await fetch(`http://127.0.0.1:8000/applicant/unsave-job/${jobId}/`, {
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
    <div>
      {jobListings.map((job) => (
        <div key={job.job_id} className="flex flex-col pt-4">
          <div className= "box-container px-2 py-2 mb-4"> 
           
            <div className="grid grid-cols-12  gap-4 p-3">
              <div className="col-span-2  justify-center">
                <Image src="/Logo.png" width={50} height={30} alt="Company Logo" />
              </div>
  
              <div className="col-span-10 flex flex-col w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <b className="font-bold lg:text-large mb:text-medium sm:text-medium xsm:text-xsmall xxsm:text-xsmall text-fontcolor">{job.job_title}</b>
                    <div className="lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall font-thin text-fontcolor">
                      <p>{job.company_name}</p>
                      <p>{job.job_industry}</p>
                    </div>
                  </div>

                  <div className="flex items-start ml-5 gap-4">
                    <div className="flex items-center gap-4">
                      <button className="button1 flex items-center justify-center text-center">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-center">Apply Now</p>
                      </button>

                      <button onClick={() => toggleSave(job.job_id)} className="flex items-center">
                        <Image
                          src={savedStatus[job.job_id] ? "/Save Icon.svg" : "/Unsave Icon.svg"}
                          width={20}
                          height={20}
                          className="w-[20px] h-[20px] object-contain"
                          alt={savedStatus[job.job_id] ? "Save Icon" : "Unsave Icon"}
                        />
                      </button>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
                  <div className="flex items-center">
                    <Image src="/Location Icon.svg" width={23} height={20} alt="Location Icon" />
                    <p className="ml-1 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">{job.location}</p>
                  </div>

                  <div className="flex items-center">
                    <Image src="/Work Setup Icon.svg" width={23} height={20} alt="Work Setup Icon" />
                    <p className="ml-2 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">{job.work_setup}</p>
                  </div>

                  <div className="flex items-center">
                    <Image src="/Schedule Icon.svg" width={18} height={20} alt="Schedule Icon" />
                    <p className="ml-2 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">{job.schedule}</p>
                  </div>

                  <div className="flex items-center col-span-1">
                    <Image src="/Salary Icon.svg" width={18} height={20} alt="Salary Icon" />
                    <p className="ml-2 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">{job.salary}</p>
                  </div>
                </div>
              </div>
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
