import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { createJob } from "../api/companyJobApi";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/router";

export default function JobSummary() {
    const [SerializedData, setSerializedData] = useState(null);
    const [salaryMin, setSalaryMin] = useState(null);
    const [salaryMax, setSalaryMax] = useState(null);
    const [status, setStatus] = useState("Draft");
    const router = useRouter();

    let { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchToken = async () => {
            if (!authTokens) {
                router.push("/GENERAL/Login");
                return;
            }
        };

        fetchToken();
    }, [authTokens, router]);

    useEffect(() => {
        const storedData = Cookies.get("SERIALIZED_DATA");

        if (!storedData) {
            console.error("No stored data found.");
            return;
        }

        try {
            const parsedStoredData = JSON.parse(storedData);
            setSerializedData(parsedStoredData);

            const formatNumberWithCommas = (number) => {
                if (!number) return number;
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            setSalaryMin(formatNumberWithCommas(parsedStoredData.salary_min));
            setSalaryMax(formatNumberWithCommas(parsedStoredData.salary_max));
        } catch (error) {
            console.error("Error parsing stored data:", error);
            return;
        }
    }, []);

    const handleSaveAsDraft = async () => {
        if (!SerializedData) {
            console.error("Serialized data is not available.");
            return;
        }

        const formData = {
            job_title: SerializedData.job_title,
            job_industry: SerializedData.job_industry,
            specialization: SerializedData.specialization,
            job_description: SerializedData.job_description,
            company_name: SerializedData.company_name,
            additional_notes: SerializedData.additional_notes,
            application_deadline: SerializedData.application_deadline,
            benefits: SerializedData.benefits,
            city: SerializedData.city,
            company: SerializedData.company,
            creation_date: new Date().toISOString(),
            employment_type: SerializedData.employment_type,
            experience_level: SerializedData.experience_level,
            num_positions: SerializedData.num_positions,
            qualifications: SerializedData.qualifications,
            region: SerializedData.region,
            province: SerializedData.province,
            required_documents: SerializedData.required_documents,
            salary_frequency: SerializedData.salary_frequency,
            salary_max: salaryMax,
            salary_min: salaryMin,
            schedule: SerializedData.schedule,
            scoring_criteria: SerializedData.scoring_criteria,
            verification_option: SerializedData.verification_option,
            weight_of_criteria: SerializedData.weight_of_criteria,
            work_setup: SerializedData.work_setup,
            status: "draft",
        };

        const response = await createJob(formData, authTokens.access);

        if (response) {
            console.log("Job created successfully:", response);
        } else {
            console.log("Failed to create job.");
        }
        Cookies.remove("DRAFT_DATA");
        Cookies.remove("SERIALIZED_DATA");
        router.push("/COMPANY/CompanyHome");
    };

    const handlePublish = async () => {
        if (!SerializedData) {
            console.error("Serialized data is not available.");
            return;
        }

        const formData = {
            job_title: SerializedData.job_title,
            job_industry: SerializedData.job_industry,
            specialization: SerializedData.specialization,
            job_description: SerializedData.job_description,
            company_name: SerializedData.company_name,
            additional_notes: SerializedData.additional_notes,
            application_deadline: SerializedData.application_deadline,
            benefits: SerializedData.benefits,
            city: SerializedData.city,
            company: SerializedData.company,
            creation_date: new Date().toISOString(),
            employment_type: SerializedData.employment_type,
            experience_level: SerializedData.experience_level,
            num_positions: SerializedData.num_positions,
            qualifications: SerializedData.qualifications,
            region: SerializedData.region,
            province: SerializedData.province,
            required_documents: SerializedData.required_documents,
            salary_frequency: SerializedData.salary_frequency,
            salary_max: salaryMax,
            salary_min: salaryMin,
            schedule: SerializedData.schedule,
            scoring_criteria: SerializedData.scoring_criteria,
            verification_option: SerializedData.verification_option,
            weight_of_criteria: SerializedData.weight_of_criteria,
            work_setup: SerializedData.work_setup,
            status: "open",
        };

        const response = await createJob(formData, authTokens.access);

        if (response) {
            console.log("Job created successfully.");
        } else {
            console.log("Failed to create job.");
        }

        Cookies.remove("DRAFT_DATA");
        Cookies.remove("SERIALIZED_DATA");
        router.push("/COMPANY/CompanyHome");
    };

    return (
        <div>
            <CompanyHeader />
            <div className="lg:pt-28 mb:pt-24 sm:pt-24 xsm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 xxsm:px-4 mx-auto cursor-default">
                <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary">
                    {" "}
                    Job Hiring Summary{" "}
                </h1>
                <div className="pb-8">
                    <div className="flex pt-2 pb-2">
                        <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                            <div
                                className={`relative h-1 rounded-full transition-all duration-300 bg-primary`}
                                style={{ width: "100%" }}
                            ></div>
                        </div>
                    </div>

                    <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-5 ">Please take a moment to carefully review all of your Job Hiring Information to ensure everything is accurate and complete, then click 'Publish Job Hiring' to proceed.</p>

                    <form className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
                        <div className="flex lg:flex-row mb:flex-col sm:flex-col xsm:flex-col xxsm:flex-col gap-5 ">
                        {/* Job Title Section */}
                        <div className="lg:sticky  top-20 h-max">
                            {/*Create Job*/}
                            <div className="flex flex-col h-full">
                                {/* Top Part of Job Details - Fixed */}
                                <div className="job-details-box bg-background border-b-8 top rounded-t-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-fontcolor lg:text-large mb:text-large sm:text-medium xsm:text-medium xxsm:text-medium">
                                            {SerializedData?.job_title || ""}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-thin text-fontcolor lg:text-large mb:text-large sm:text-medium xsm:text-medium xxsm:text-medium">
                                                {new Date().toLocaleDateString(
                                                    "en-US"
                                                )}
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
                                        <p className="font-thin text-fontcolor lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall">
                                            {SerializedData &&
                                            SerializedData.specialization &&
                                            SerializedData.specialization
                                                .length > 0 ? (
                                                SerializedData.specialization.join(
                                                    ", "
                                                )
                                            ) : (
                                                <p>
                                                    No specializations
                                                    available.
                                                </p>
                                            )}
                                        </p>
                                    </p>
                                    <p className="font-thin text-fontcolor lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall">
                                        (
                                        {SerializedData?.experience_level || ""}
                                        )
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
                                                {SerializedData?.region || ""},{" "}
                                                {SerializedData?.province || ""}
                                                , {SerializedData?.city || ""}
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
                                                {SerializedData?.work_setup ||
                                                    ""}
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
                                                {SerializedData?.schedule || ""}
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
                                            Php {salaryMin} - {salaryMax}{" "}
                                            {SerializedData?.salary_frequency ||
                                                ""}
                                        </p>
                                    </div>
                                </div>

                                {/* Main Part of Job Details - Scrollable */}
                                <div className="job-details-box rounded-b-lg overflow-y-auto bg-white p-4">
                                    {/*Employment Type*/}
                                    <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                        Employment Type
                                    </p>
                                    <p className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3">
                                        {SerializedData?.employment_type || ""}
                                    </p>

                                    {/*Job Description*/}
                                    <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                        Job Description
                                    </p>
                                    <p className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3">
                                        {SerializedData?.job_description || ""}
                                    </p>

                                    {/*Qualifications*/}
                                    <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                        Qualifications (Credentials and Skills)
                                    </p>
                                    <p className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3">
                                        {SerializedData?.qualifications || ""}
                                    </p>

                                    {/*Application Requirements*/}
                                    <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                        Application Requirements
                                    </p>
                                    <p
                                        id="AppliReq"
                                        className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3"
                                    >
                                        {SerializedData?.required_documents.map(
                                            (doc, index) => (
                                                <li
                                                    key={index}
                                                    className="font-thin text-xsmall text-fontcolor"
                                                >
                                                    {doc}
                                                </li>
                                            )
                                        ) || ""}
                                    </p>

                                    {/*Benefits*/}
                                    <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                        Benefits
                                    </p>
                                    <p className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3">
                                        {SerializedData?.benefits || ""}
                                    </p>

                                    {/*No of Positions*/}
                                    <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                        No. of Positions
                                    </p>
                                    <p className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3">
                                        {SerializedData?.num_positions || ""}
                                    </p>

                                    {/*Application Deadline*/}
                                    <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                        Application Deadline
                                    </p>
                                    <p className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-3">
                                        {SerializedData?.application_deadline
                                            ? new Date(
                                                  SerializedData.application_deadline
                                              ).toLocaleDateString("en-US", {
                                                  month: "2-digit",
                                                  day: "2-digit",
                                                  year: "numeric",
                                              })
                                            : ""}
                                    </p>

                                    {/*Additional Notes*/}
                                    <p className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                        Additional Notes
                                    </p>
                                    <p className="font-thin lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor pb-6">
                                        {SerializedData?.additional_notes || ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-primary mb-4">
                                Settings
                            </h2>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Left Side - Required Documents */}
                                <div>
                                    <h3 className="text-sm font-semibold text-primary mb-2">
                                        Required Documents
                                    </h3>
                                    {SerializedData?.required_documents &&
                                        SerializedData.required_documents.map(
                                            (doc, index) => (
                                                <label
                                                    key={index}
                                                    className="flex items-center space-x-2 mb-2"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={doc}
                                                        checked={SerializedData.required_documents.includes(
                                                            doc
                                                        )}
                                                        onChange={(e) => {
                                                            // Handle checkbox logic here
                                                        }}
                                                        className="w-4 h-4 border border-gray-300 rounded text-black"
                                                    />
                                                    <span className="text-fontcolor text-sm">
                                                        {doc}
                                                    </span>
                                                </label>
                                            )
                                        )}
                                </div>

                                {/* Right Side - Other Settings */}
                                <div>
                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-primary">
                                            Deadline
                                        </h3>
                                        <p className="text-fontcolor text-sm">
                                            {SerializedData?.application_deadline
                                                ? new Date(
                                                      SerializedData.application_deadline
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          month: "2-digit",
                                                          day: "2-digit",
                                                          year: "numeric",
                                                      }
                                                  )
                                                : ""}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-primary">
                                            Weight of Criteria
                                        </h3>
                                        <p className="text-fontcolor text-sm">
                                            {SerializedData?.weight_of_criteria ||
                                                ""}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-primary">
                                            Verification Option
                                        </h3>
                                        <p className="text-fontcolor text-sm">
                                            {SerializedData?.verification_option ||
                                                ""}{" "}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Criteria Scoring Section */}
                            <div className="mt-6">
                                <h3 className="text-xm font-semibold text-primary mb-4">
                                    Criteria Scoring
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold text-primary">
                                            Work Experience
                                        </h4>
                                        <span className="text-fontcolor text-sm">
                                            {" "}
                                            Weight:{" "}
                                            {SerializedData?.scoring_criteria[0]
                                                ?.weight_percentage || ""}
                                            %
                                        </span>
                                    </div>
                                    <ul className="pl-5 mt-2 space-y-1">
                                        <div className="border-b pb-1">
                                            <p className="text-fontcolor text-xs">
                                                Directly Relevant
                                            </p>
                                            <p className="font-semibold  text-fontcolor text-sm">
                                                {SerializedData?.scoring_criteria[0]?.preference?.directlyRelevant?.join(
                                                    " "
                                                ) || ""}
                                            </p>
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">
                                                Highly Relevant
                                            </li>
                                            <p className="font-semibold text-fontcolor text-sm">
                                                {SerializedData?.scoring_criteria[0]?.preference?.highlyRelevant?.join(
                                                    " "
                                                ) || ""}
                                            </p>
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">
                                                Moderately Relevant
                                            </li>
                                            <p className="font-semibold text-fontcolor text-sm">
                                                {SerializedData?.scoring_criteria[0]?.preference?.moderatelyRelevant?.join(
                                                    " "
                                                ) || ""}
                                            </p>
                                        </div>
                                    </ul>

                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold text-primary">
                                            Skills
                                        </h4>
                                        <span className="text-fontcolor text-sm">
                                            Weight:{" "}
                                            {SerializedData?.scoring_criteria[1]
                                                ?.weight_percentage || ""}
                                            %
                                        </span>
                                    </div>
                                    <ul className="pl-5 mt-2 space-y-1">
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">
                                                Primary Skills
                                            </li>
                                            <p className="font-semibold text-fontcolor text-sm">
                                                {SerializedData?.scoring_criteria[1]?.preference?.primarySkills?.join(
                                                    " "
                                                ) || ""}
                                            </p>
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">
                                                Secondary Skills
                                            </li>
                                            <p className="font-semibold text-fontcolor text-sm">
                                                {" "}
                                                {SerializedData?.scoring_criteria[1]?.preference?.secondarySkills?.join(
                                                    " "
                                                ) || ""}{" "}
                                            </p>
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">
                                                Additional Skills
                                            </li>
                                            <p className="font-semibold text-fontcolor text-sm">
                                                {" "}
                                                {SerializedData?.scoring_criteria[1]?.preference?.additionalSkills?.join(
                                                    " "
                                                ) || ""}{" "}
                                            </p>
                                        </div>
                                    </ul>

                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold text-primary">
                                            Education
                                        </h4>
                                        <span className="text-fontcolor text-sm">
                                            Weight:{" "}
                                            {SerializedData?.scoring_criteria[2]
                                                ?.weight_percentage || ""}
                                            %
                                        </span>
                                    </div>

                                    <ul className="pl-5 mt-2 space-y-1">
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">
                                                1st Choice Field Study
                                            </li>
                                            <p className="font-semibold text-fontcolor text-sm">
                                                {SerializedData
                                                    ?.scoring_criteria[2]
                                                    ?.preference?.firstChoice ||
                                                    ""}
                                            </p>
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">
                                                2nd Choice Field Study
                                            </li>
                                            <p className="font-semibold text-fontcolor text-sm">
                                                {SerializedData
                                                    ?.scoring_criteria[2]
                                                    ?.preference
                                                    ?.secondChoice || ""}
                                            </p>
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">
                                                3rd Choice Field Study
                                            </li>
                                            <p className="font-semibold text-fontcolor text-sm">
                                                {SerializedData
                                                    ?.scoring_criteria[2]
                                                    ?.preference?.thirdChoice ||
                                                    ""}
                                            </p>
                                        </div>
                                    </ul>

                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold text-primary">
                                            Additional Points
                                        </h4>
                                    </div>

                                    <ul className="pl-5 mt-2 space-y-1">
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">
                                                School Preference
                                            </li>
                                            <li className="font-semibold text-fontcolor text-sm">
                                                {" "}
                                                {SerializedData?.scoring_criteria[3]?.preference?.schoolPreference?.join(
                                                    " "
                                                ) || ""}{" "}
                                            </li>
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">
                                                Honorsy
                                            </li>
                                            <li className="text-semibold text-sm">
                                                {SerializedData
                                                    ?.scoring_criteria[4]
                                                    ?.preference?.honor === "1"
                                                    ? "Applied"
                                                    : "Not Applied"}
                                            </li>
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">
                                                Multiple Degrees
                                            </li>
                                            <li className="text-semibold text-sm">
                                                {SerializedData
                                                    ?.scoring_criteria[4]
                                                    ?.preference
                                                    ?.multipleDegrees === "1"
                                                    ? "Applied"
                                                    : "Not Applied"}
                                            </li>
                                        </div>
                                    </ul>
                                    <div>
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-semibold text-primary">
                                                Certifications
                                            </h4>
                                            <span className="text-fontcolor text-sm">
                                                Weight:{" "}
                                                {SerializedData
                                                    ?.scoring_criteria[5]
                                                    ?.weight_percentage || ""}
                                                %
                                            </span>
                                        </div>
                                        <ul className="pl-5 mt-2 space-y-1">
                                            <li className="text-fontcolor text-xs">
                                                Institutional Preference Bonus
                                            </li>
                                            <li className="font-semibold text-fontcolor text-sm">
                                                {" "}
                                                {SerializedData?.scoring_criteria[5]?.preference?.preferred?.join(
                                                    " "
                                                ) || ""}{" "}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>

                        {/*Setting*/}
                    </form>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            className="button2 flex items-center justify-center"
                        >
                            <Link
                                href="/COMPANY/CompanySettings"
                                className="ml-auto"
                            >
                                <div className="flex items-center space-x-2">
                                    <Image
                                        src="/Arrow Left.svg"
                                        width={23}
                                        height={10}
                                        alt="Back Icon"
                                    />
                                    <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                        Back
                                    </p>
                                </div>
                            </Link>
                        </button>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleSaveAsDraft}
                                className="button2 flex items-center justify-center"
                            >
                                <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                    {" "}
                                    Save as Draft
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={handlePublish}
                                className="button1 flex items-center justify-center"
                            >
                                <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                    Publish Job Hiring
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <GeneralFooter />
        </div>
    );
}
