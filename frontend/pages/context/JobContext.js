import { createContext, useContext, useState, useEffect } from "react";
import { fetchSavedJobs, unsaveJob, saveJob } from "../api/applicantJobApi";

const JobContext = createContext();

export const useJob = () => useContext(JobContext);

export const JobProvider = ({ authToken, children }) => {
    const [savedStatus, setSavedStatus] = useState({});

    useEffect(() => {
        if (authToken) {
            const interval = setInterval(() => {
                getSavedJobs();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [authToken]);

    const getSavedJobs = async () => {
        const jobs = await fetchSavedJobs(authToken);
        const savedJobsMap = {};
        jobs.forEach((job) => {
            savedJobsMap[job.job_hiring_id] = true;
        });
        setSavedStatus(savedJobsMap);
    };

    const isJobSaved = (jobId) => {
        return savedStatus[jobId] === true;
    };

    const toggleSaveJob = async (jobId) => {
        const isCurrentlySaved = isJobSaved(jobId);

        // Optimistically update the UI before making the API call
        setSavedStatus((prevStatus) => ({
            ...prevStatus,
            [jobId]: !isCurrentlySaved,
        }));

        // Call the API to save or unsave the job
        const success = isCurrentlySaved
            ? await unsaveJob(authToken, jobId)
            : await saveJob(authToken, jobId);

        if (!success) {
            // If the API call fails, revert the UI state
            setSavedStatus((prevStatus) => ({
                ...prevStatus,
                [jobId]: isCurrentlySaved,
            }));
            alert("Failed to update saved job status.");
        } else {
            alert(
                isCurrentlySaved
                    ? "Job unsaved successfully!"
                    : "Job saved successfully!"
            );
        }
        getSavedJobs();
    };

    return (
        <JobContext.Provider value={{ savedStatus, toggleSaveJob }}>
            {children}
        </JobContext.Provider>
    );
};
