import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import ReviewApplication from "@/components/ReviewApplication";
import { getSectionData, clearJobApplicationDraft } from "../utils/jobApplicationStates";
import { submitJobApplication } from "../api/applicantJobApi";
import { useRouter } from "next/router";
import JobDetailsWrapper from "@/components/JobDetails";
import AuthContext from "../context/AuthContext";
// ...existing code...

export default function ApplicationConfirmation({ handleJobClick }) {
    const [isChecked, setIsChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { id, jobHiringTitle, companyName } = router.query;
    const [showJobDetails, setShowJobDetails] = useState(false);
    const [submitResult, setSubmitResult] = useState({ success: null, message: "" });
    const { authTokens } = useContext(AuthContext);
    
    const handleToggleDetails = () => {
        setShowJobDetails((prev) => !prev); // Toggle visibility
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleSubmit = async () => {
        if (!isChecked) {
            alert("Please agree to the terms before submitting.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Get all necessary data from localStorage
            const personalInfo = getSectionData('personalInfo');
            const documents = getSectionData('documents');
            const jobDetails = getSectionData('jobDetails');

            // Prepare application data for submission
            const applicationData = {
                job_hiring: jobDetails.job_hiring_id,
                fullName: `${personalInfo.first_name} ${personalInfo.middle_mame} ${personalInfo.last_name}`,
                email: personalInfo.email,
                contact_number: personalInfo.contact_number,
                address: personalInfo.complete || personalInfo.present_address,
                linkedin_profile: personalInfo.linkedin_profile,
                application_date: new Date().toISOString().split('T')[0],
                application_status: "PENDING"
            };

            // Extract document files and types
            const documentFiles = [];
            const documentTypes = [];

            // Add resume
            if (documents.resume?.file instanceof File) {
                documentFiles.push(documents.resume.file);
                documentTypes.push("RESUME");
            }

            // Add educational documents
            if (documents.educationaldocs?.file instanceof File) {
                documentFiles.push(documents.educationaldocs.file);
                documentTypes.push("EDUCATION");
            }

            // Add work certificate
            if (documents.workcertificate?.file instanceof File) {
                documentFiles.push(documents.workcertificate.file);
                documentTypes.push("WORK_EXPERIENCE");
            }

            // Add seminar certificate
            if (documents.seminarCertificate?.file instanceof File) {
                documentFiles.push(documents.seminarCertificate.file);
                documentTypes.push("SEMINAR");
            }

            // Add additional documents
            if (documents.additionalDocs?.files && documents.additionalDocs.files.length > 0) {
                documents.additionalDocs.files.forEach(file => {
                    if (file instanceof File) {
                        documentFiles.push(file);
                        documentTypes.push("ADDITIONAL");
                    }
                });
            }

            const result = await submitJobApplication(
                authTokens.access, 
                applicationData, 
                documentFiles, 
                documentTypes
            );

            if (result.success) {
                setSubmitResult({ 
                    success: true, 
                    message: "Application submitted successfully!" 
                });
                // Clear application draft from localStorage
                clearJobApplicationDraft();
                
                // Redirect to success page after short delay
                setTimeout(() => {
                    router.push("/APPLICANT/ApplicationSuccess");
                }, 2000);
            } else {
                setSubmitResult({ 
                    success: false, 
                    message: "Failed to submit application. Please try again." 
                });
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            setSubmitResult({ 
                success: false, 
                message: "An error occurred. Please try again." 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const goBack = () => {
        router.push({
            pathname: "/APPLICANT/ApplicantDocuments",
            query: { id, jobHiringTitle, companyName },
        });
    };

    //TODO 1. Retrieve yung job application id then display it

    return (
        <div>
            <ApplicantHeader/>
            <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-4 xxsm:px-4 mx-auto">
                <p className="font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall   text-fontcolor pb-1">
                    You are Applying for{" "}
                </p>
                <p className="font-semibold text-primary text-large pb-1">
                    {jobHiringTitle}
                </p>
                <p className="font-thin lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1">
                    {companyName}
                </p>
                <div className="relative">
                    <p
                        className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall  text-fontcolor pb-8 font-bold underline cursor-pointer"
                        onClick={handleToggleDetails}
                    >
                        See job hiring details
                    </p>
                    {showJobDetails && (
                        <div className="flex items-center justify-center absolute inset-0 bg-background h-screen ">
                            <div className="relative w-full lg:w-6/12 mb:w-10/12 sm:w-full z-10 bg-background rounded ">
                                <button
                                    onClick={() => setShowJobDetails(false)}
                                    className="absolute -top-12 right-0  text-xl text-fontcolor hover:text-gray-700"
                                >
                                    {" "}
                                    ✖{" "}
                                </button>
                                <JobDetailsWrapper
                                    /*authToken={authTokens?.access}*/
                                    onJobClick={handleJobClick}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-center pb-8">
                    <div className="job-application-box rounded-xs px-8 py-5 mx-auto">
                        <p className="font-semibold lg:text-large mb:text-medium sm:text-medium xsm:text-medium text-primary">
                            Please review your application
                        </p>

                        <div className="flex items-center pt-2 pb-2">
                            <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                                <div
                                    className={`relative h-1 rounded-full transition-all duration-300 bg-primary`}
                                    style={{ width: "75%" }}
                                ></div>
                            </div>
                        </div>

                        <p className="font-medium lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">
                            Please review that all the information and documents
                            are correct
                        </p>

                        <div className="pt-2">
                            <ReviewApplication />
                        </div>

                        {/* Checkbox Section */}
                        <section className="mt-2 mb-6">
                            <label className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                />
                                <span className="text-fontcolor text-justify lg:text-xxsmall mb:text-xxsmall sm:text-xxsmall xsm:text-xxsmall">
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Amet tincidunt et turpis
                                    habitasse ultrices condimentum velit.
                                    <br />
                                    Consectetur pellentesque non eget nisl,
                                    pretium, ultrices. Tortor dignissim pretium
                                    aliquet nunc, pulvinar.
                                </span>
                            </label>
                        </section>

                        <div className="flex justify-between mt-1">
                            <button
                                onClick={goBack}
                                type="button"
                                className="button2 flex items-center justify-center"
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
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                className={`button1 flex items-center justify-center ${
                                    !isChecked && "opacity-50"
                                }`}
                                disabled={!isChecked}
                            >
                                <Link
                                    href="/APPLICANT/ApplicationSubmit"
                                    className="flex items-center space-x-2 ml-auto"
                                >
                                    <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                        Submit Application
                                    </p>
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <GeneralFooter />
        </div>
    );
}