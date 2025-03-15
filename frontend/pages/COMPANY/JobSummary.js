import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";
import JobDetailsWrapper from "@/components/JobDetails";
import CompanyJobDetailsWrapper from "@/components/CompanyJobDetails";

export default function JobSummary() {
    const [formData, setFormData] = useState({
        requiredDocuments: [],
    });

    return (
        <div>
            <CompanyHeader />
            <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto">
                <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary"> Job Hiring Summary </h1>
                <div className="pb-8">
                    <div className="flex pt-2 pb-2">
                        <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                            <div className={`relative h-1 rounded-full transition-all duration-300 bg-primary`} style={{ width: "100%" }}></div>
                        </div>
                    </div>

                    <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-5 ">Please take a moment to carefully review all of your Job Hiring Information to ensure everything is accurate and complete, then click 'Publish Job Hiring' to proceed.</p>

                    <form className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
                        {/* Job Title Section */}
                        <div className="sticky top-20 h-max">
                           <CompanyJobDetailsWrapper/>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-primary mb-4">Settings</h2>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Left Side - Required Documents */}
                                <div>
                                    <h3 className="text-sm font-semibold text-primary mb-2">Required Documents</h3>
                                    {[
                                    "Resume",
                                    "Diploma",
                                    "Transcript of Records (TOR)",
                                    "Certificate of Employment",
                                    "Seminar/Workshop/Skills Certificates"
                                    ].map((doc, index) => (
                                    <label key={index} className="flex items-center space-x-2 mb-2">
                                        <input
                                        type="checkbox"
                                        value={doc}
                                        onChange={(e) => {
                                            // Handle checkbox logic here
                                        }}
                                        className="w-4 h-4 border border-gray-300 rounded text-black"
                                        />
                                        <span className="text-fontcolor text-sm">{doc}</span>
                                    </label>
                                    ))}
                                </div>

                                {/* Right Side - Other Settings */}
                                <div>
                                    <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-primary">Deadline</h3>
                                    <p className="text-fontcolor text-sm">10/10/2024</p>
                                    </div>

                                    <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-primary">Weight of Criteria</h3>
                                    <p className="text-fontcolor text-sm">Customize Criteria Weight Percentage</p>
                                    </div>

                                    <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-primary">Verification Option</h3>
                                    <p className="text-fontcolor text-sm">Ignore Unverified Credentials</p>
                                    </div>
                                </div>
                            </div>

                            {/* Criteria Scoring Section */}
                            <div className="mt-6">
                                <h3 className="text-xm font-semibold text-primary mb-4">Criteria Scoring</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold text-primary">Work Experience</h4>
                                        <span className="text-fontcolor text-sm">Weight: 100%</span>
                                    </div>
                                    <ul className="pl-5 mt-2 space-y-1">
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Directly Relevant</li>
                                            <li className="text-semibold text-sm">Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, </li> 
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Highly Relevant</li>
                                            <li className="text-semibold text-sm">Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, </li>   
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-sm">Moderately Relevant</li>
                                            <li className="text-semibold text-sm">Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, </li>   
                                        </div>
                                    </ul>

                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold text-primary">Skills</h4>
                                        <span className="text-fontcolor text-sm">Weight: 100%</span>
                                    </div>
                                    <ul className="pl-5 mt-2 space-y-1">
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Primary Skills</li>
                                            <li className="text-semibold text-sm">Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, </li> 
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Secondary Skillst</li>
                                            <li className="text-semibold text-sm">Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, </li>   
                                        </div>
                                            <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Additional Skills</li>
                                            <li className="text-semibold text-sm">Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, </li>   
                                        </div>
                                    </ul>

                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold text-primary">Education</h4>
                                        <span className="text-fontcolor text-sm">Weight: 100%</span>
                                    </div>

                                    <ul className="pl-5 mt-2 space-y-1">
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">1st Choice Field Study</li>
                                            <li className="text-semibold text-sm">Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, </li> 
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">2nd Choice Field Study</li>
                                            <li className="text-semibold text-sm">Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, </li>   
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">2nd Choice Field Study</li>
                                            <li className="text-semibold text-sm">Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, </li>   
                                        </div>
                                    </ul>
                        
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold text-primary">Additional Points</h4>
                                        <span className="text-fontcolor text-sm">Weight: 100%</span>  
                                    </div>

                                    <ul className="pl-5 mt-2 space-y-1">
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">School Preference</li>
                                            <li className="text-semibold text-sm">Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, </li> 
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Honorsy</li>
                                            <li className="text-semibold text-sm">Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, </li>   
                                        </div>
                                        <div className="border-b pb-1">
                                            <li className="text-fontcolor text-xs">Multiple Degrees</li>
                                            <li className="text-semibold text-sm">Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, </li>   
                                        </div>
                                    </ul>
                                    <div>
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-semibold text-primary">Certifications</h4>
                                            <span className="text-fontcolor text-sm">Weight: 100%</span>
                                        </div>
                                        <ul className="pl-5 mt-2 space-y-1">
                                            <li className="text-fontcolor text-xs">Institutional Preference Bonus</li>
                                            <li className="text-semibold text-sm">Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, </li> 
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                 </form>
                 <div className="flex justify-between">          
                            <button type="button" className="button2 flex items-center justify-center">
                                <Link href="/COMPANY/CompanySettings" className="ml-auto">
                                    <div className="flex items-center space-x-2">
                                        <Image 
                                        src="/Arrow Left.svg" 
                                        width={23} 
                                        height={10} 
                                        alt="Back Icon" 
                                        />
                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Back</p>
                                    </div>
                                    </Link>
                            </button>
                        <div className="flex gap-4">
                            <button type="button"  className="button2 flex items-center justify-center">
                                <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center"> Save as Draft</p>
                            </button>

                            <button type="button"  className="button1 flex items-center justify-center">
                                <Link href="/COMPANY/CompanyHome" className="flex items-center space-x-2 ml-auto">
                                <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Publish Job Hiring</p>
                                </Link>
                            </button>
                        </div>
                    </div>   
                </div>
           </div>
            <GeneralFooter/>
        </div>
    );
}
