import Image from "next/image";
import { useState, useContext, useEffect, useCallback } from "react";
import AuthContext from "@/pages/context/AuthContext";
import { useRouter } from "next/router";
import { JDSkeletonLoader } from "./ui/SkeletonLoader";
import {
    fetchJobDetails,
    checkIfJobIsSaved,
    saveJob,
    unsaveJob,
} from "@/pages/api/applicantJobApi";

const JobDetails = ({ authToken }) => {
    const router = useRouter();
    const { jobId } = router.query;
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (jobId) {
            sessionStorage.setItem("jobId", jobId);
            loadJobDetails();
            checkSavedStatus();
        }
    }, [jobId]);

    const loadJobDetails = async () => {
        setLoading(true);
        setJobDetails(null); // Clear previous job details while loading

        const jobData = await fetchJobDetails(authToken, jobId);
        setJobDetails(jobData);
        setLoading(false);
    };

    const checkSavedStatus = useCallback(async () => {
        const savedStatus = await checkIfJobIsSaved(authToken, jobId);
        setIsSaved(savedStatus);
    }, [authToken, jobId]);

    const toggleSaveJob = async () => {
        const success = isSaved
            ? await unsaveJob(authToken, jobId)
            : await saveJob(authToken, jobId);

        if (success) {
            setIsSaved(!isSaved);
            alert(
                isSaved
                    ? "Job unsaved successfully!"
                    : "Job saved successfully!"
            );
        }
    };

    const navigateToJobApplication = () => {
        router.push({
            pathname: "/APPLICANT/JobApplication",
            query: { jobId },
        });
    };

    if (loading) return <JDSkeletonLoader />;
    if (!jobDetails) return <p className="text-fontcolor">Please Select Job</p>;

    return (
        <div className="flex flex-col h-full">
            {/* Top Part of Job Details - Fixed */}
            <div className="job-details-box border-b-8 top rounded-t-lg p-4">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-fontcolor text-large">
                        {jobDetails.job_title}
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="font-thin text-fontcolor text-xsmall">
                            {jobDetails.creation_date}
                        </p>
                        <Image
                            src="/Menu.svg"
                            width={23}
                            height={20}
                            alt="Menu"
                        />
                    </div>
                </div>

                <p className="font-thin text-fontcolor text-xsmall">
                    {jobDetails.company_name}
                </p>
                <p className="font-thin text-fontcolor text-xsmall">
                    {jobDetails.job_industry} ({jobDetails.experience_level})
                </p>
                <div className="flex flex-row mt-2">
                    <div className="flex flex-row">
                        <Image
                            src="/Location Icon.svg"
                            width={23}
                            height={20}
                            alt="Location Icon"
                        />
                        <p className="ml-1.5 font-thin text-xsmall text-fontcolor">
                            {jobDetails.work_location}
                        </p>
                    </div>
                    <div className="flex flex-row mx-4">
                        <Image
                            src="/Work Setup Icon.svg"
                            width={23}
                            height={20}
                            alt="Work Setup Icon"
                        />
                        <p className="ml-2 font-thin text-xsmall text-fontcolor">
                            {jobDetails.work_setup}
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <Image
                            src="/Schedule Icon.svg"
                            width={18}
                            height={20}
                            alt="Schedule Icon"
                        />
                        <p className="ml-2 font-thin text-xsmall text-fontcolor">
                            {jobDetails.schedule}
                        </p>
                    </div>
                </div>
                <div className="flex flex-row mt-2 px-1">
                    <Image
                        src="/Salary Icon.svg"
                        width={18}
                        height={20}
                        alt="Salary Icon"
                    />
                    <p className="ml-2 font-thin text-xsmall pl-px text-fontcolor">
                        {jobDetails.salary}
                    </p>
                </div>

                <div className="flex mt-4 gap-8">
                    <button
                        onClick={navigateToJobApplication}
                        type="button"
                        className="button1 flex items-center justify-center"
                    >
                        <p className="lg:text-medium font-medium">Apply</p>
                    </button>

                    <button
                        onClick={toggleSaveJob}
                        type="button"
                        className="button2 flex items-center justify-center lg:text-medium font-medium"
                    >
                        {isSaved ? "Unsave" : "Save"}
                    </button>
                </div>
            </div>

            {/* Main Part of Job Details - Scrollable */}
            <div className="job-details-box rounded-b-lg overflow-y-auto bg-white p-4">
                {/*Employment Type*/}
                <p className="font-semibold text-xsmall text-fontcolor ">
                    Employment Type
                </p>
                <p
                    id="EmployType"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {jobDetails.employment_type}
                </p>

                {/*Job Description*/}
                <p className="font-semibold text-xsmall text-fontcolor ">
                    {" "}
                    Job Description
                </p>
                <p
                    id="JobDescription"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {jobDetails.job_description}
                </p>

                {/*Qualifications*/}
                <p className="font-semibold text-xsmall text-fontcolor ">
                    Qualifications (Credentials and Skills){" "}
                </p>
                <p
                    id="Qualifications"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {jobDetails.qualifications}
                </p>

                {/*Application Requirements*/}
                <p className="font-semibold text-xsmall text-fontcolor ">
                    Application Requirements{" "}
                </p>
                <p
                    id="AppliReq"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {jobDetails.required_documents ? (
                        <>
                            {Object.entries(jobDetails.required_documents).map(
                                ([key, value]) => (
                                    <span key={key}>
                                        • {value}
                                        <br />
                                    </span>
                                )
                            )}
                        </>
                    ) : (
                        "No Application requirements information available."
                    )}
                </p>

                {/* Benefit*/}
                <p className="font-semibold text-xsmall text-fontcolor ">
                    {" "}
                    Benefits{" "}
                </p>
                <p
                    id="Benefits"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {jobDetails.benefits ? (
                        <>
                            {Object.entries(jobDetails.benefits).map(
                                ([key, value]) => (
                                    <span key={key}>
                                        <strong>
                                            {key
                                                .replace(/_/g, " ")
                                                .replace(/\b\w/g, (c) =>
                                                    c.toUpperCase()
                                                )}
                                            :
                                        </strong>{" "}
                                        {value}
                                        <br />
                                    </span>
                                )
                            )}
                        </>
                    ) : (
                        "No benefits information available."
                    )}
                </p>

                {/* No of Positions*/}
                <p className="font-semibold text-xsmall text-fontcolor ">
                    {" "}
                    No. of Positions
                </p>
                <p
                    id="noPosition"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {jobDetails.num_positions}
                </p>

                {/* App Deadline*/}
                <p className="font-semibold text-xsmall text-fontcolor ">
                    {" "}
                    Application Deadline
                </p>
                <p
                    id="deadline"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {jobDetails.application_deadline}
                </p>

                {/* Add Notes*/}
                <p className="font-semibold text-xsmall text-fontcolor ">
                    {" "}
                    Additional Note{" "}
                </p>
                <p
                    id="Notes"
                    className="font-thin text-xsmall text-fontcolor pb-6"
                >
                    {jobDetails.additional_notes}
                </p>

                {/* Report Job Button */}
                <button
                    type="button"
                    className="button2 flex items-center justify-center"
                >
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
