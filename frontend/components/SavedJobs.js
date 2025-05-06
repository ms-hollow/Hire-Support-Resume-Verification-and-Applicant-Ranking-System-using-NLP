import { useState, useContext, useEffect, useCallback } from "react";
import Image from "next/image";
import AuthContext from "@/pages/context/AuthContext";
import {
    fetchJobListings,
    fetchSavedJobs,
    saveJob,
    unsaveJob,
    checkApplication, // Import checkApplication
} from "@/pages/api/applicantJobApi";
import { toTitleCase } from "@/pages/utils/functions";
import { toast } from "react-toastify";
import ToastWrapper from "./ToastWrapper";
import { useRouter } from "next/router";
import { fetchApplicantProfile } from "@/pages/api/applicantApi";

const SavedJobs = () => {
    const { authTokens } = useContext(AuthContext);
    const [applicantId, setApplicantID] = useState(null);
    const [savedJobs, setSavedJobs] = useState([]);
    const [jobListings, setJobListings] = useState([]);
    const [savedStatus, setSavedStatus] = useState({});
    const [appliedStatus, setAppliedStatus] = useState({}); // New state for applied jobs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const loadSavedJobs = async () => {
            try {
                // Ensure applicantId is set before proceeding
                const profileData = await fetchApplicantProfile(authTokens);
                const applicantId = profileData?.id;
                setApplicantID(applicantId);

                if (!applicantId) {
                    throw new Error("Applicant ID is not available.");
                }

                const savedJobsData = await fetchSavedJobs(authTokens.access);
                setSavedJobs(savedJobsData);

                const jobHiringIds = savedJobsData.map(
                    (job) => job.job_hiring_id
                );
                const allJobs = await fetchJobListings(authTokens.access);

                const filteredJobs = allJobs.filter((job) =>
                    jobHiringIds.includes(job.job_id)
                );

                const initialSavedStatus = filteredJobs.reduce((acc, job) => {
                    acc[job.job_id] = true;
                    return acc;
                }, {});

                setJobListings(filteredJobs);
                setSavedStatus(initialSavedStatus);

                // Check applied status for each job
                const appliedStatuses = {};
                for (const job of filteredJobs) {
                    const data = await checkApplication(
                        authTokens.access,
                        job.job_id,
                        applicantId
                    );
                    appliedStatuses[job.job_id] = data?.hasApplied || false;
                }
                setAppliedStatus(appliedStatuses);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadSavedJobs();
    }, [authTokens]);

    const handleSaveJob = useCallback(
        async (jobId) => {
            const success = await saveJob(authTokens.access, jobId);
            if (success) {
                setSavedStatus((prevState) => ({
                    ...prevState,
                    [jobId]: true,
                }));
                toast.success("Job saved successfully!");
            }
        },
        [authTokens]
    );

    const handleUnsaveJob = useCallback(
        async (jobId) => {
            const success = await unsaveJob(authTokens.access, jobId);
            if (success) {
                setSavedStatus((prevState) => ({
                    ...prevState,
                    [jobId]: false,
                }));
                setJobListings((prevJobs) =>
                    prevJobs.filter((job) => job.job_id !== jobId)
                );
                toast.success("Job unsaved successfully!");
            }
        },
        [authTokens]
    );

    const toggleSave = async (jobId) => {
        if (savedStatus[jobId]) {
            await handleUnsaveJob(jobId);
        } else {
            await handleSaveJob(jobId);
        }
    };

    const checkProfile = async () => {
        const res = await fetchApplicantProfile(authTokens);
        setApplicantID(res.id);
        const hasIncompleteField = Object.values(res).some(
            (val) => val === null || val === ""
        );

        if (!res || hasIncompleteField) {
            toast.info("Please complete your profile before applying.");
            return false;
        }

        return true;
    };

    const handleApplyNow = async (id) => {
        const isProfileComplete = await checkProfile();
        if (!isProfileComplete) {
            return;
        }
        router.push({
            pathname: "/APPLICANT/JobApplication",
            query: { id },
        });
    };

    if (loading)
        return <div className="text-fontcolor text-center py-10">Loading saved jobs...</div>;
    if (error) return <div>Error: {error}</div>;

    if (!loading && jobListings.length === 0) {
        return (
            <div className="text-fontcolor text-center py-10">
                No saved jobs available.
            </div>
        );
    }

    return (
        <div>
            {jobListings.map((job) => (
                <div key={job.job_id} className="flex flex-col pt-4">
                    <div className="box-container px-2 py-2 mb-4">
                        <div className="grid grid-cols-3  gap-4 p-3">
                            <div className="col-span-10 flex flex-col w-full">
                                <div className="flex justify-between items-start w-full">
                                    <div>
                                        <b className="font-bold lg:text-large mb:text-medium sm:text-medium xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {job.job_title}
                                        </b>
                                        <div className="lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall font-thin text-fontcolor">
                                            <p>{job.company_name}</p>
                                            <p>{job.job_industry}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start ml-5 gap-4">
                                        <div className="flex items-center gap-4">
                                            {appliedStatus[job.job_id] ? (
                                                <button
                                                    className="button1 flex items-center justify-center text-center cursor-not-allowed opacity-50"
                                                    disabled
                                                >
                                                    <p className="lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-center">
                                                        Applied
                                                    </p>
                                                </button>
                                            ) : (
                                                <button
                                                    className="button1 flex items-center justify-center text-center"
                                                    onClick={() =>
                                                        handleApplyNow(
                                                            job.job_id
                                                        )
                                                    }
                                                >
                                                    <p className="lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-center">
                                                        Apply Now
                                                    </p>
                                                </button>
                                            )}

                                            <button
                                                onClick={() =>
                                                    toggleSave(job.job_id)
                                                }
                                                className="flex items-center"
                                            >
                                                <Image
                                                    src={
                                                        savedStatus[job.job_id]
                                                            ? "/Save Icon.svg"
                                                            : "/Unsave Icon.svg"
                                                    }
                                                    width={20}
                                                    height={20}
                                                    className="w-[20px] h-[20px] object-contain"
                                                    alt={
                                                        savedStatus[job.job_id]
                                                            ? "Save Icon"
                                                            : "Unsave Icon"
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="justify-between mt-2">
                                    <div className="flex justify-between items-center w-full mb-2">
                                        <div className="flex items-center w-5/6">
                                            <Image
                                                src="/Location Icon.svg"
                                                width={23}
                                                height={20}
                                                alt="Location Icon"
                                            />
                                            <p className="ml-1 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">
                                                {toTitleCase(job.location)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-end w-1/6">
                                            <Image
                                                src="/Work Setup Icon.svg"
                                                width={23}
                                                height={20}
                                                alt="Work Setup Icon"
                                            />
                                            <p className="ml-2 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">
                                                {job.work_setup}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center w-full">
                                        {/* schedule (Left) */}
                                        <div className="flex items-center w-5/6">
                                            <Image
                                                src="/Schedule Icon.svg"
                                                width={18}
                                                height={20}
                                                alt="Schedule Icon"
                                            />
                                            <p className="ml-1 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">
                                                {toTitleCase(job.schedule)}
                                            </p>
                                        </div>

                                        {/*  salary (Right) */}
                                        <div className="flex items-center justify-end w-5/6">
                                            <Image
                                                src="/Salary Icon.svg"
                                                width={18}
                                                height={20}
                                                alt="Salary Icon"
                                            />
                                            <p className="ml-2 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">
                                                {" "}
                                                {job.salary_min} -{" "}
                                                {job.salary_max}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <ToastWrapper />
        </div>
    );
};

const SavedJobsWrapper = () => {
    return (
        <div className="flex overflow-y-auto border border-none hide-scrollbar p-1 h-[calc(100vh-150px)]">
            <SavedJobs />
            <ToastWrapper />
        </div>
    );
};

export default SavedJobsWrapper;
