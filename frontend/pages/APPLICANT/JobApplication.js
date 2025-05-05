import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useContext, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/router";
import JobDetailsWrapper from "@/components/JobDetails";
import { getApplicantProfile } from "../api/applicantApi";
import { fetchJobDetails } from "../api/applicantJobApi";
import { toTitleCase } from "../utils/functions";
import { saveSectionData, getSectionData } from "../utils/jobApplicationStates";

export default function JobApplication({ handleJobClick }) {
    let { authTokens } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query;

    const [showJobDetails, setShowJobDetails] = useState(false);
    const [jobHiringTitle, setJobHiringTitle] = useState("");
    const [companyName, setCompanyName] = useState("");

    const handleToggleDetails = () => {
        setShowJobDetails((prev) => !prev); // Toggle visibility
    };

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        middle_mame: "",
        email: "",
        contact_number: "",
        sex: "",
        date_of_birth: "",
        age: "",
        complete: "",
        linkedin_profile: "",
        present_address: "",
        region: "",
        province: "",
        city: "",
        barangay: "",
    });

    const [step, setStep] = useState(1);

    useEffect(() => {
        const savedPersonalInfo = getSectionData('personalInfo');
        if (savedPersonalInfo) {
            setFormData(prev => ({ ...prev, ...savedPersonalInfo }));
        }

        const applicantProfile = async () => {
            const data = await getApplicantProfile(authTokens);
            setFormData(prev => ({ ...prev, ...data }));
        };

        const getJobHiringDetails = async () => {
            const jobHiringData = await fetchJobDetails(authTokens?.access, id);
            setJobHiringTitle(jobHiringData.job_title);
            setCompanyName(jobHiringData.company_name);
        };

        applicantProfile();
        getJobHiringDetails();
    }, [authTokens, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);

        const fields = Object.keys(formData);
        const filledFields = fields.filter(
            (field) => formData[field] || updatedData[field]
        );
        setStep(Math.min(filledFields.length, fields.length));
    };

    const handleEdit = () => {
        alert("Edit button clicked - implement your logic here.");
    };

    // Save data and navigate to next step
    const handleNext = () => {

        const requiredFields = [
            { key: 'first_name', label: 'First Name' },
            { key: 'last_name', label: 'Last Name' },
            { key: 'email', label: 'Email' },
            { key: 'contact_number', label: 'Contact Number' },
            { key: 'sex', label: 'Sex' },
            { key: 'date_of_birth', label: 'Date of Birth' },
            { key: 'age', label: 'Age' },
            { key: 'present_address', label: 'Present Address' },
            { key: 'region', label: 'Region' },
            { key: 'province', label: 'Province' },
            { key: 'city', label: 'City' },
            { key: 'barangay', label: 'Barangay' }
        ];

        const missingFields = requiredFields.filter(
            field => !formData[field.key] || String(formData[field.key]).trim() === ''
        );

        if (missingFields.length > 0) {
            const missingFieldNames = missingFields.map(field => field.label).join(', ');
            alert(`Please complete your personal information first.`);
            return;
        }

        // Format full name for display
        const fullName = `${formData.first_name} ${formData.middle_mame || ''} ${formData.last_name}`.trim();

        // Save personal info to localStorage with formatted values
        saveSectionData('personalInfo', {
            ...formData,
            fullName: fullName
        });
        
        // Also save job details
        saveSectionData('jobDetails', {
            job_hiring_id: id,
            job_title: jobHiringTitle,
            company_name: companyName
        });
        
        // Navigate to next page
        router.push({
            pathname: "/APPLICANT/ApplicantDocuments",
            query: { id, jobHiringTitle, companyName },
        });
    };

    // if (loading) {
    //     return <p className="text-accent">Loading... (temporary) </p>;
    // }

    return (
        <div>
            <ApplicantHeader />
            <div className=" lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 xxsm:px-4 py-8 mx-auto">
                <p className="font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                    You are Applying for{" "}
                </p>
                <p className="font-semibold text-primary text-large pb-1">
                    {jobHiringTitle || ""}
                </p>
                <p className="font-thin lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1">
                    {companyName || ""}
                </p>
                <div className="relative">
                    <p
                        className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-8 font-bold underline cursor-pointer"
                        onClick={handleToggleDetails}
                    >
                        See job hiring details
                    </p>

                    {showJobDetails && (
                        <div className="flex items-center justify-center absolute inset-0 bg-background h-screen ">
                            <div className="relative w-full lg:w-6/12 mb:w-10/12 sm:w-full bg-background rounded ">
                                <button
                                    onClick={() => setShowJobDetails(false)}
                                    className="absolute -top-12 right-0  text-xl text-fontcolor hover:text-gray-700"
                                >
                                    {" "}
                                    ✖{" "}
                                </button>
                                <JobDetailsWrapper
                                    authToken={authTokens?.access}
                                    onJobClick={handleJobClick}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center ">
                    <div className="job-application-box rounded-xs px-8 py-5 mx-auto ">
                        <p className="font-semibold lg:text-large mb:text-large sm:text-large text-primary">
                            Personal Information
                        </p>

                        <div className="flex items-center pt-2">
                            <div className="w-full bg-background h-1. border-2 border-primary rounded-full ">
                                <div
                                    className={` h-1 rounded-full transition-all duration-300 bg-primary`}
                                    style={{ width: "25%" }}
                                ></div>
                            </div>
                        </div>

                        <div className="pt-8 pb-6">
                            <div className="w-full overflow-hidden rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
                                <table className="w-full border-collapse">
                                    <tbody>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                            <td className="p-2 ">
                                                <p className="pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                                    Full Name
                                                </p>
                                                <p
                                                    id=""
                                                    className=" pl-2 font-semibold lg:text-xsmall mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor"
                                                >
                                                    {formData.first_name}{" "}
                                                    {formData.middle_mame}{" "}
                                                    {formData.last_name}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                            <td className="p-2 ">
                                                <p className="pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                                    Email Address
                                                </p>
                                                <p
                                                    id=""
                                                    className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor"
                                                >
                                                    {formData.email}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                            <td className="p-2">
                                                <p className="pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                                    Contact No.
                                                </p>
                                                <p
                                                    id=""
                                                    className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor"
                                                >
                                                    {formData.contact_number}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                            <td className="p-2">
                                                <p className="pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                                    Sex
                                                </p>
                                                <p
                                                    id=""
                                                    className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor"
                                                >
                                                    {formData.sex}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                            <td className="p-2">
                                                <p className="pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                                    Date of Birth
                                                </p>
                                                <p
                                                    id=""
                                                    className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor"
                                                >
                                                    {formData.date_of_birth}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                            <td className="p-2">
                                                <p className="pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                                    Age
                                                </p>
                                                <p
                                                    id=""
                                                    className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor"
                                                >
                                                    {formData.age}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                            <td className="p-2">
                                                <p className="pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                                    Complete Address
                                                </p>
                                                <p
                                                    id=""
                                                    className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor"
                                                >
                                                    {formData.present_address},{" "}
                                                    {toTitleCase(
                                                        formData.region
                                                    )}
                                                    ,{" "}
                                                    {toTitleCase(
                                                        formData.province
                                                    )}
                                                    ,{" "}
                                                    {toTitleCase(formData.city)}
                                                    ,{" "}
                                                    {toTitleCase(
                                                        formData.barangay
                                                    )}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr className="px-2 border-b border-[#F5F5F5]">
                                            <td className="p-2">
                                                <p className="pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                                    LinkedIn Profile Link
                                                </p>
                                                <p
                                                    id=""
                                                    className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor"
                                                >
                                                    {formData.linkedin_profile}
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-between mt-1">
                            <button
                                type="button"
                                className="button2 flex items-center justify-center"
                            >
                                <Link
                                    href="/APPLICANT/ApplicantProfile"
                                    className="ml-auto"
                                >
                                    <div className="flex items-center space-x-2">
                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                            Edit{" "}
                                        </p>
                                    </div>
                                </Link>
                            </button>

                            <button
                                type="button"
                                className="button1 flex items-center justify-center"
                                onClick={handleNext}
                            >
                                <div className="flex items-center space-x-2">
                                    <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                        Continue
                                    </p>
                                    <Image
                                        src="/Arrow Right.svg"
                                        width={23}
                                        height={10}
                                        alt="Continue Icon"
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <GeneralFooter />
        </div>
    );
}
