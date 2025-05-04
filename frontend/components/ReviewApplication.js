import { useEffect, useState } from "react";
import Link from "next/link";
import Image from 'next/image';
<<<<<<< HEAD
import { getSectionData } from "../pages/utils/jobApplicationStates";

=======
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import ToastWrapper from "./ToastWrapper";
>>>>>>> origin/main

    
const ReviewApplication = ({ showEditButtons = true }) => {
   
    // State for personal information
    const [formData, setFormData] = useState({
        first_name: "",
        middle_mame: "",
        last_name: "",
        email: "",
        contact_number: "",
        complete: "",
        linkedin_profile: "",
        // Add other personal fields as needed
    });

    // State for documents
    const [documents, setDocuments] = useState({
        resume: { files: [] },
        educationalDocuments: { files: [] },
        workcertificate: { files: [] },
        seminarCertificate: { files: [] },
        additionalDocuments: { files: [] },
    });

    // State for job details
    const [jobDetails, setJobDetails] = useState({
        job_title: "",
        company_name: "",
        job_hiring_id: ""
    });

    // Fetch all application data when component mounts
    useEffect(() => {
        // Get personal info
        const personalInfo = getSectionData('personalInfo');
        if (personalInfo) {
            setFormData(personalInfo);
        }

        // Get document metadata
        const documentMetadata = getSectionData('documentMetadata');
        if (documentMetadata) {
            setDocuments((prev) => ({
                ...prev,
                ...Object.keys(documentMetadata).reduce((acc, key) => {
                    acc[key] = {
                        files: documentMetadata[key].files || [],
                    };
                    return acc;
                }, {}),
            }));
        }

        // Get job details
        const jobDetailsData = getSectionData('jobDetails');
        if (jobDetailsData) {
            setJobDetails(jobDetailsData);
        }
    }, []);

    // Format the full name from first, middle, and last name
    const getFullName = () => {
        return `${formData.first_name || ''} ${formData.middle_mame || ''} ${formData.last_name || ''}`.trim();
    };

    // Get file name from document info
    const getFileName = (docInfo) => {
        if (!docInfo) return "No file selected";
        return docInfo.fileName || "No file selected";
    };

    const [step, setStep] = useState(1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);

        const fields = Object.keys(formData);
        const filledFields = fields.filter((field) => formData[field] || updatedData[field]);
        setStep(Math.min(filledFields.length, fields.length));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("/api/submit-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        toast.error(result.message);
    };

    const handleEdit = () => {
        toast.success("Edit button clicked");
    };

    // Add this helper function to display multiple files
    const renderDocumentFiles = (docInfo) => {
        if (!docInfo || !docInfo.files || docInfo.files.length === 0) {
            return <span className="pl-2 font-semibold text-fontcolor">No files uploaded</span>;
        }
    
        return (
            <div className="pl-2">
                {docInfo.files.map((file, index) => (
                    <div key={index} className="font-semibold text-fontcolor">
                        {file.fileName || `File ${index + 1}`}
                    </div>
                ))}
            </div>
        );
    };

    return ( 
        <div className="job-application-box rounded-xs px-8 py-5 mx-auto">
<<<<<<< HEAD
            {/* Job Information Section */}
            <section className="pb-6">
                <div className="flex flex-row justify-between items-center pt-3 mb-2">
                    <p className="font-semibold lg:text-large mb:text-medium sm:text-medium xsm:text-medium text-primary pb-1">
                        Job Information
                    </p>
                </div>
                <div className="w-full rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="px-2 border-b border-[#F5F5F5]">
                                <td className="p-2">
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Job Title: 
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {jobDetails.job_title}
                                        </span>
                                    </p>
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Company: 
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {jobDetails.company_name}
                                        </span>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Personal Information Section */}
            <section className="pb-6">
                <div className="flex flex-row justify-between items-center pt-3 mb-2">
=======
            <ToastWrapper/>
            <section className=" pb-6">
                 <div className="flex flex-row justify-between items-center pt-3 mb-2">
>>>>>>> origin/main
                    <p className="font-semibold lg:text-large mb:text-medium sm:text-medium xsm:text-medium text-primary pb-1">Personal Information</p>
                    {showEditButtons && (
                        <button className="flex items-center focus:outline-none">
                            <Link href="/APPLICANT/JobApplication">
                                <Image
                                    src="/Edit Icon.svg"
                                    width={25}
                                    height={11}
                                    alt="Edit Icon"
                                />
                            </Link>
                        </button>
                    )}
                </div>
                <div className="w-full rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="px-2 border-b border-[#F5F5F5]">
                                <td className="p-2">
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Full Name:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {getFullName()}
                                        </span>
                                    </p>
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Email Address:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {formData.email}
                                        </span>
                                    </p>
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Contact No.:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {formData.contact_number}
                                        </span>
                                    </p>
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Complete Address:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {formData.complete || formData.present_address}
                                        </span>
                                    </p>
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        LinkedIn Profile Link:
                                        <span className="pl-2 font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                            {formData.linkedin_profile}
                                        </span>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Uploaded Documents Section */}
            <section className="pb-6">
                <div className="flex flex-row justify-between items-center pt-3 mb-2">
                    <p className="font-semibold lg:text-large mb:text-medium sm:text-medium xsm:text-medium text-primary pb-1">Uploaded Documents</p>
                    {showEditButtons && (
                        <button className="flex items-center focus:outline-none">
                            <Link href="/APPLICANT/ApplicantDocuments">
                                <Image
                                    src="/Edit Icon.svg"
                                    width={25}
                                    height={11}
                                    alt="Edit Icon"
                                />
                            </Link>
                        </button>
                    )}
                </div>
                <div className="w-full rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="px-2 border-b border-[#F5F5F5]">
                                <td className="p-2">
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Resume:
                                        {renderDocumentFiles(documents.resume)}
                                    </p>
                                </td>
                            </tr>
                            <tr className="px-2 border-b border-[#F5F5F5]">
                                <td className="p-2">
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Educational Documents:
                                        {renderDocumentFiles(documents.educationalDocuments)}
                                    </p>
                                </td>
                            </tr>
                            <tr className="px-2 border-b border-[#F5F5F5]">
                                <td className="p-2">
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Work Experience - Certificate of Employment:
                                        {renderDocumentFiles(documents.workcertificate)}
                                    </p>
                                </td>
                            </tr>
                            <tr className="px-2 border-b border-[#F5F5F5]">
                                <td className="p-2">
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Certifications - Seminar/Workshop/Skills Certificates:
                                        {renderDocumentFiles(documents.seminarCertificate)}
                                    </p>
                                </td>
                            </tr>
                            {/* Check if there are additional documents */}
                            <tr className="px-2 border-b border-[#F5F5F5]">
                                <td className="p-2">
                                    <p className="flex items-center pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-1">
                                        Additional Documents:
                                        {renderDocumentFiles(documents.additionalDocuments)}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default ReviewApplication;