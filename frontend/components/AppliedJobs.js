import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
// import AuthContext from "@/pages/context/AuthContext";
import { getAllJobApplications } from "@/pages/api/applicantJobApi";
import { toTitleCase } from "@/pages/utils/functions";
import jobListing from "@/public/placeHolder/dummy_AppliedJobs.json";

const AppliedJobs = () => {
    // const { authTokens } = useContext(AuthContext);
    const [jobApplications, setJobApplications] = useState([]);

    useEffect(() => {
        // const fetchJobApplications = async () => {
        //     const res = await getAllJobApplications(authTokens?.access);
        //     setJobApplications(res);
        // };
        // fetchJobApplications();
        setJobApplications(jobListing);
    }, []);

    //* In progress
    const handleViewApplication = (id) => {
        console.log("Job Application ID to be pass: ", id);
    };

    return (
        <div className="flex flex-col pt-4">
            {jobApplications.map((job, index) => (
                <div key={index} className="box-container px-2 py-2 mb-4">
                    <div className="grid grid-cols-3 gap-4 p-3">
                        <div className="col-span-10 flex flex-col w-full">
                            <div className="flex justify-between items-start w-full">
                                <div>
                                    <b className="font-bold text-fontcolor">
                                        {job.job_title}
                                    </b>
                                    <div className="text-fontcolor font-thin">
                                        <p>{job.company_name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start ml-5 gap-4">
                                    <div className="flex items-center gap-4">
                                        <button
                                            className="button1 items-center flex justify-center text-center"
                                            onClick={() =>
                                                handleViewApplication(
                                                    job.job_application_id
                                                )
                                            }
                                        >
                                            <p className="text-center">
                                                View Application
                                            </p>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col mt-2">
                                <div className="flex items-center">
                                    <Image
                                        src="/Location Icon.svg"
                                        width={23}
                                        height={20}
                                        alt="Location Icon"
                                    />
                                    <p className="ml-1 font-thin text-fontcolor">
                                        {toTitleCase(job.region)},{" "}
                                        {toTitleCase(job.province)},{" "}
                                        {toTitleCase(job.city)}
                                    </p>
                                </div>

                                <div className="flex items-center mt-2">
                                    <Image
                                        src="/Status.svg"
                                        width={18}
                                        height={20}
                                        alt="Status Icon"
                                    />
                                    <p className="ml-2 font-thin text-primary">
                                        {job.application_status}
                                    </p>
                                </div>

                                <div className="flex flex-row justify-between">
                                    <div className="flex items-center mt-2">
                                        <Image
                                            src="/APPLICATION ID ICON.png"
                                            width={23}
                                            height={20}
                                            alt="ID Icon"
                                        />
                                        <p className="ml-1 font-thin text-fontcolor">
                                            {job.job_application_id}
                                        </p>
                                    </div>

                                    <div className="flex items-center mt-2">
                                        <Image
                                            src="/CALENDAR ICON.png"
                                            width={23}
                                            height={20}
                                            alt="Calendar Icon"
                                        />
                                        <p className="ml-1 font-thin text-fontcolor">
                                            {
                                                new Date(job.application_date)
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                        </p>
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

const AppliedJobsWrapper = () => {
    return (
        <div className="flex overflow-y-auto border border-none hide-scrollbar p-1 h-[calc(100vh-150px)]">
            <AppliedJobs />
        </div>
    );
};

export default AppliedJobsWrapper;
