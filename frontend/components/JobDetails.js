import Image from "next/image";
import { useState, useContext, useEffect } from "react";
import AuthContext from "@/pages/context/AuthContext";
import { useRouter } from "next/router";
import { JDSkeletonLoader } from "./ui/SkeletonLoader";
import { fetchJobDetails } from "@/pages/api/applicantJobApi";
import { useJob, JobProvider } from "@/pages/context/JobContext";
import { toTitleCase } from "@/pages/utils/functions";
import { toast } from "react-toastify";

const JobDetails = ({ authToken, applicantName }) => {
    const { savedStatus, toggleSaveJob } = useJob();
    const router = useRouter();
    const { id } = router.query;
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadJobDetails();
        }
    }, [id]);

    const loadJobDetails = async () => {
        setLoading(true);
        setJobDetails(null);

        const jobData = await fetchJobDetails(authToken, id);
        setJobDetails(jobData);
        setLoading(false);
    };

    const navigateToJobApplication = () => {
        if (applicantName === "Applicant") {
            toast.info("Please complete your profile before applying.");
            return;
        }
        router.push({
            pathname: "/APPLICANT/JobApplication",
            query: { id },
        });
    };

    if (loading) return <JDSkeletonLoader />;
    if (!jobDetails) return <div className="relative flex flex-col justify-start items-start  min-h-screen h-full bg-gray-100 text-fontcolor font-light text-xl px-2">
    {/* Top-left: Arrow + Text */}
    <div className="flex items-center gap-2 pt-4 px-2 mb-8">
      <Image src="/Arrow Left.svg" width={40} height={20} alt="Arrow Left" />
      <p>Please select a job</p>
    </div>
  
    {/* Bottom-center: Home Icon */}
    <div className="relative left-1/2 transform -translate-x-1/2">
      <Image src="/Home.svg" width={350} height={20} alt="Home" />
    </div>
  </div>

    return (
        <div className="flex flex-col h-full">
            {/* Top Part of Job Details - Fixed */}
            <div className=" sticky top-0 z-10 bg-background job-details-box border-b-8 top rounded-t-lg p-4">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-fontcolor lg:text-xlarge mb:text-large sm:text-large xsm:text-large xxsm:text-large">
                        {jobDetails.job_title}
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="font-thin text-fontcolor lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall">
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

                <p className="font-thin text-fontcolor lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall">
                    {jobDetails.company_name}
                </p>
                <p className="font-thin text-fontcolor lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall">
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
                        <p className="ml-1.5 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">
                            {toTitleCase(jobDetails.region)},{" "}
                            {toTitleCase(jobDetails.province)},{" "}
                            {toTitleCase(jobDetails.city)}
                        </p>
                    </div>
                    <div className="flex flex-row mx-4">
                        <Image
                            src="/Work Setup Icon.svg"
                            width={23}
                            height={20}
                            alt="Work Setup Icon"
                        />
                        <p className="ml-2 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">
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
                        <p className="ml-2 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">
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
                    <p className="ml-2 font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall pl-px text-fontcolor">
                        {jobDetails.salary_min} - {jobDetails.salary_max}
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
                        onClick={() => toggleSaveJob(jobDetails.job_hiring_id)}
                        type="button"
                        className="button2 flex items-center justify-center lg:text-medium font-medium"
                    >
                        {savedStatus[jobDetails.job_hiring_id]
                            ? "Unsave"
                            : "Save"}
                    </button>
                </div>
            </div>

            {/* Main Part of Job Details - Scrollable */}
            <div className="flex-1 job-details-box rounded-b-lg overflow-y-auto bg-white p-4">
                {/*Employment Type*/}
                <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">
                    Employment Type
                </p>
                <p
                    id="EmployType"
                    className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3"
                >
                    {jobDetails.employment_type}
                </p>

                {/*Job Description*/}
                <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">
                    {" "}
                    Job Description
                </p>
                <p
                    id="JobDescription"
                    className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3"
                >
                    {jobDetails.job_description}
                </p>

                {/*Qualifications*/}
                <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">
                    Qualifications (Credentials and Skills){" "}
                </p>
                <p
                    id="Qualifications"
                    className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3"
                >
                    {jobDetails.qualifications}
                </p>

                {/*Application Requirements*/}
                <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">
                    Application Requirements{" "}
                </p>
                <p
                    id="AppliReq"
                    className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3"
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
                <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">
                    {" "}
                    Benefits{" "}
                </p>
                <p
                    id="Benefits"
                    className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3"
                >
                    {jobDetails.benefits}
                </p>

                {/* No of Positions*/}
                <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">
                    {" "}
                    No. of Positions
                </p>
                <p
                    id="noPosition"
                    className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3"
                >
                    {jobDetails.num_positions}
                </p>

                {/* App Deadline*/}
                <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">
                    {" "}
                    Application Deadline
                </p>
                <p
                    id="deadline"
                    className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3"
                >
                    {jobDetails.application_deadline}
                </p>

                {/* Add Notes*/}
                <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor ">
                    {" "}
                    Additional Note{" "}
                </p>
                <p
                    id="Notes"
                    className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-6"
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

const JobDetailsWrapper = ({ applicantName }) => {
    const { authTokens } = useContext(AuthContext);
    return (
        <div className="flex-1 overflow-y-auto h-[calc(100vh)] border border-none  hide-scrollbar rounded-lg">
            <JobProvider authToken={authTokens.access}>
                <JobDetails
                    authToken={authTokens.access}
                    applicantName={applicantName}
                />
            </JobProvider>
        </div>
    );
};

export default JobDetailsWrapper;
