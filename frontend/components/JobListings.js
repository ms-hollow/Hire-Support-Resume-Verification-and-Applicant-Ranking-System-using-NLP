import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import GeneralFooter from "./GeneralFooter";
import { useRouter } from "next/router";
import AuthContext from "@/pages/context/AuthContext";
import { JLSkeletonLoader } from "./ui/SkeletonLoader";
import { useJob, JobProvider } from "@/pages/context/JobContext";
import { toTitleCase } from "@/pages/utils/functions";

const JobListings = ({ onJobClick, jobListings, loading }) => {
    const { savedStatus, toggleSaveJob } = useJob();
    const router = useRouter();
    const handleJobClick = (jobId) => {
        router.push(
            {
                pathname: router.pathname,
                query: { id: jobId },
            },
            undefined,
            { shallow: true }
        );
        onJobClick(jobId);
    };

    if (!Array.isArray(jobListings) || jobListings.length === 0) {
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
                        onClick={() => handleJobClick(job.job_id)}
                        className="job-listing-box flex flex-col p-4 mb-4 mx-auto w-full"
                    >
                        <div className="flex flex-row justify-between items-center">
                            <p className="font-semibold text-fontcolor lg:text-large mb:text-large sm:text-medium xsm:text-medium xxsm:text-medium mt-2">
                                {job.job_title}
                            </p>
                            <button
                                className="ml-auto"
                                onClick={() => toggleSaveJob(job.job_id)}
                            >
                                <Image
                                    src={
                                        savedStatus[job.job_id]
                                            ? "/Save Icon.svg"
                                            : "/Unsave Icon.svg"
                                    }
                                    width={13}
                                    height={11}
                                    alt={
                                        savedStatus[job.job_id]
                                            ? "Save Icon"
                                            : "Unsave Icon"
                                    }
                                />
                            </button>
                        </div>
                       
                        <p className="font-thin text-fontcolor lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall">
                            {job.company_name}
                        </p>
                        <p className="font-thin text-fontcolor lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall">
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
                                className="ml-1.5 font-thin text-fontcolor lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall pl-px"
                            >
                                {toTitleCase(job.location)}
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
                                className="ml-2 font-thin text-fontcolor lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall pl-px"
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
                                className="ml-2 font-thin text-fontcolor lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall pl-1"
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
                                className="ml-2 font-thin text-fontcolor lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall pl-px"
                            >
                                {job.salary_min} - {job.salary_max}
                            </p>
                        </div>
                        <div className="flex flex-col mt-2">
                            <p
                                id="job_description"
                                className="lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor"
                            >
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

const JobListingsWrapper = ({ onJobClick, jobListings, loading }) => {
    const { authTokens } = useContext(AuthContext);
    return (
        <div className="flex overflow-y-auto border border-none hide-scrollbar h-[calc(100vh)]">
            <JobProvider authToken={authTokens.access}>
                <JobListings
                    authToken={authTokens.access}
                    onJobClick={onJobClick}
                    jobListings={jobListings}
                    loading={loading}
                />
            </JobProvider>
            <GeneralFooter />
        </div>
    );
};

export default JobListingsWrapper;
