import Image from "next/image";
import { useState, useContext, useEffect } from "react";
import { CompanyJobDetailsSkeletonLoader } from "../components/ui/SkeletonLoader";
import AuthContext from "@/pages/context/AuthContext";
import { useRouter } from "next/router";
import { getJobHiringDetails } from "@/pages/api/companyJobApi";

const CompanyJobDetailsWrapper = () => {
    const [jobDetails, setJobDetails] = useState(null);
    const router = useRouter();

    const { id } = router.query;
    let { authTokens } = useContext(AuthContext);

    const fetchJobDetails = async () => {
        if (!authTokens) {
            router.push("/GENERAL/Login");
            return;
        }
        const res = await getJobHiringDetails(id, authTokens);
        setJobDetails(res);
    };

    useEffect(() => {
        if (id && authTokens) {
            fetchJobDetails();
        }
    }, [id, authTokens]);

    if (!jobDetails) {
        return <CompanyJobDetailsSkeletonLoader />;
    }

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
                            {/* {jobDetails.region},  */}
                            {jobDetails.province},{" "}
                            {jobDetails.city}
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
                </div>

                <div className="flex flex-row gap-4">
                    <div className="flex flex-row mt-2">
                        <Image
                            src="/Salary Icon.svg"
                            width={18}
                            height={20}
                            alt="Salary Icon"
                        />
                        <p className="ml-2 font-thin text-xsmall pl-px text-fontcolor">
                            {jobDetails.salary_min} - {jobDetails.salary_max}
                        </p>
                    </div>

                    <div className="flex flex-row mt-2">
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
            </div>

            {/* Main Part of Job Details - Scrollable */}
            <div className="job-details-box rounded-b-lg overflow-y-auto bg-white p-4">
                {/*Employment Type*/}
                <p className="font-semibold text-xsmall text-fontcolor">
                    Employment Type
                </p>
                <p
                    id="EmployType"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {jobDetails.employment_type}
                </p>

                {/*Job Description*/}
                <p className="font-semibold text-xsmall text-fontcolor">
                    Job Description
                </p>
                <p
                    id="JobDescription"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {jobDetails.job_description}
                </p>

                {/*Qualifications*/}
                <p className="font-semibold text-xsmall text-fontcolor">
                    Qualifications (Credentials and Skills)
                </p>
                <p
                    id="Qualifications"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {jobDetails.qualifications}
                </p>

                {/*Application Requirements*/}
                <p className="font-semibold text-xsmall text-fontcolor">
                    Application Requirements
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
                        "No application requirements information available."
                    )}
                </p>

                {/*Benefits*/}
                <p className="font-semibold text-xsmall text-fontcolor">
                    Benefits
                </p>
                <p
                    id="Benefits"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {jobDetails.benefits}
                </p>

                {/*No of Positions*/}
                <p className="font-semibold text-xsmall text-fontcolor">
                    No. of Positions
                </p>
                <p
                    id="noPosition"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {jobDetails.num_positions}
                </p>

                {/*Application Deadline*/}
                <p className="font-semibold text-xsmall text-fontcolor">
                    Application Deadline
                </p>
                <p
                    id="deadline"
                    className="font-thin text-xsmall text-fontcolor pb-3"
                >
                    {jobDetails.application_deadline}
                </p>

                {/*Additional Notes*/}
                <p className="font-semibold text-xsmall text-fontcolor">
                    Additional Notes
                </p>
                <p
                    id="Notes"
                    className="font-thin text-xsmall text-fontcolor pb-6"
                >
                    {jobDetails.additional_notes}
                </p>

                {/*Report Job Button*/}
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

export default CompanyJobDetailsWrapper;