import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import ReviewApplication from "@/components/ReviewApplication";
import {
    getSectionData,
    clearJobApplicationDraft,
} from "../utils/jobApplicationStates";
import { submitJobApplication } from "../api/applicantJobApi";
import { getApplicantProfile } from "../api/applicantApi";
import { useRouter } from "next/router";
import JobDetailsWrapper from "@/components/JobDetails";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import ToastWrapper from "@/components/ToastWrapper";

export default function ApplicationConfirmation({ handleJobClick }) {
    const [isChecked, setIsChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { id, jobHiringTitle, companyName } = router.query;
    const [showJobDetails, setShowJobDetails] = useState(false);
    const [submitResult, setSubmitResult] = useState({
        success: null,
        message: "",
    });
    const { authTokens, user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

    // Check for console debugging
    useEffect(() => {
        // Log what we have from context for debugging
        console.log(
            "Auth tokens from context:",
            authTokens
                ? "Present (first 10 chars): " +
                      (authTokens.access
                          ? authTokens.access.substring(0, 10) + "..."
                          : "No access token")
                : "No auth tokens"
        );
        console.log("User from context:", user);
        
        if (!authTokens || !authTokens.access) {
            console.error("No auth tokens available");
            setSubmitResult({
                success: false,
                message: "You need to be logged in to submit an application.",
            });
        }
        
        setIsLoading(false);
    }, [authTokens, user]);

    const handleToggleDetails = () => {
        setShowJobDetails((prev) => !prev);
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleSubmit = async () => {
        if (!isChecked) {
            toast.error("Please agree to the terms before submitting.");
            return;
        }
        
        if (!authTokens || !authTokens.access) {
            console.error("No auth tokens available for submission");
            setSubmitResult({
                success: false,
                message: "Authentication required. Please log in again.",
            });
            alert("Authentication required. Please log in again.");
            return;
        }

        setIsSubmitting(true);

        try {
            // First get the applicant profile to get the applicant ID
            const profileData = await getApplicantProfile(authTokens);
            console.log("Retrieved profile data:", profileData);

            if (!profileData?.applicant_id) {
                throw new Error("Could not determine applicant ID from profile");
            }

            // Get all necessary data from localStorage
            const personalInfo = getSectionData('personalInfo');
            const documentMetadata = getSectionData('documentMetadata');
            const jobDetails = getSectionData('jobDetails');
            
            console.log("Retrieved jobDetails:", jobDetails);
            console.log("Retrieved documentMetadata:", documentMetadata);
            
            if (!jobDetails || !jobDetails.job_hiring_id) {
                throw new Error(
                    "Missing job hiring information. Please restart your application."
                );
            }
    
            // Prepare application data for submission
            const applicationData = {
                job_hiring: jobDetails.job_hiring_id,
                applicant: profileData.applicant_id,
                fullName: `${personalInfo.first_name} ${personalInfo.middle_name || ''} ${personalInfo.last_name}`.trim(),
                email: personalInfo.email,
                contact_number: personalInfo.contact_number,
                address:
                    personalInfo.complete_address ||
                    personalInfo.present_address,
                linkedin_profile: personalInfo.linkedin_profile,
                application_date: new Date().toISOString().split("T")[0],
                application_status: "draft",
            };

            console.log("Submitting with applicant ID:", profileData.applicant_id);
    
            // Extract document files and types using the stored metadata
            const documentFiles = [];
            const documentTypes = [];
    
            // Get temp files from window object
            const tempFiles = getTempUploadedFiles();
            console.log("Retrieved temp files:", Object.keys(tempFiles).length);
            
            // Document type mapping
            const documentTypeMapping = {
                'resume': 'RESUME',
                'educationalDocuments': 'EDUCATION',
                'workcertificate': 'WORK_EXPERIENCE',
                'seminarCertificate': 'CERTIFICATION',
                'additionalDocuments': 'ADDITIONAL'
            };

            // Process each document category
            if (documentMetadata) {
                Object.keys(documentMetadata).forEach(category => {
                    const categoryData = documentMetadata[category];
                    const docType = documentTypeMapping[category] || 'ADDITIONAL';
                    
                    // Process main file if exists
                    if (categoryData.files && Array.isArray(categoryData.files)) {
                        categoryData.files.forEach(fileInfo => {
                            if (fileInfo && fileInfo.fileId) {
                                const file = tempFiles[fileInfo.fileId];
                                if (file instanceof File) {
                                    documentFiles.push(file);
                                    documentTypes.push(docType);
                                    console.log(`Adding ${docType} file: ${file.name}`);
                                }
                            }
                        });
                    }
                });
            }
    
            console.log("Submitting application with data:", applicationData);
            console.log(
                "Document files:",
                documentFiles.map((f) => f.name)
            );
            console.log("Document types:", documentTypes);
            
            // Submit application with all files
            const result = await submitJobApplication(
                authTokens.access,
                applicationData,
                documentFiles,
                documentTypes
            );
    
            if (result.success) {
                setSubmitResult({
                    success: true,
                    message: "Application submitted successfully!",
                });
                alert("Application submitted successfully!");

                // Clear application draft from localStorage
                clearJobApplicationDraft();
                
                // Clear temp files from memory
                clearTempFiles();
                
                // Redirect to success page after short delay
                setTimeout(() => {
                    router.push("/APPLICANT/ApplicationSubmit");
                }, 2000);

            } else {
                console.error("Submission error:", result.error);
                setSubmitResult({
                    success: false,
                    message: `Failed to submit application: ${
                        result.error || "Please try again"
                    }`,
                });
                alert(
                    `Failed to submit application: ${
                        result.error || "Please try again"
                    }`
                );
            }
            
        } catch (error) {
            console.error("Error submitting application:", error);
            setSubmitResult({
                success: false,
                message: `An error occurred: ${error.message}. Please try again.`,
            });
            alert(`An error occurred: ${error.message}. Please try again.`);
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

    return (
        <div>
            <ApplicantHeader />
            <ToastWrapper />
            <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-4 xxsm:px-4 mx-auto">
                <p className="font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall   text-fontcolor pb-1">
                    You are Applying for{" "}
                </p>
                <p className="font-semibold text-primary text-large pb-1">
                    {getTitleFromLocalStorage() || "No Job Title Available"}
                </p>
                <p className="font-thin lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1">
                    {getCompanyFromLocalStorage() || "No Job Company Available"}
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

                        {/* Show loading/error/success message if applicable */}
                        {isLoading && (
                            <p className="text-gray-500 text-center mb-4">
                                Loading your profile data...
                            </p>
                        )}
                        {submitResult.message && (
                            <p
                                className={`text-center mb-4 ${
                                    submitResult.success
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {submitResult.message}
                            </p>
                        )}

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
                                    (!isChecked || isSubmitting) && "opacity-50"
                                }`}
                                disabled={
                                    !isChecked || isSubmitting || isLoading
                                }
                            >
                                <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                    {isSubmitting
                                        ? "Submitting..."
                                        : "Submit Application"}
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
