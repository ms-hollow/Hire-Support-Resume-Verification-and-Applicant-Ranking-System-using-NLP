import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from 'next/image';
import { useEffect, useState } from "react";
import ReviewApplication from "@/components/ReviewApplication";
import { useRouter } from 'next/router';
import JobDetailsWrapper from "@/components/JobDetails";

export default function ApplicationConfirmation ({handleJobClick}) {

    const [isChecked, setIsChecked] = useState(false);
    const router = useRouter();
    const { jobId } = router.query;

    const [showJobDetails, setShowJobDetails] = useState(false);

    const handleToggleDetails = () => {
        setShowJobDetails((prev) => !prev); // Toggle visibility
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleSubmit = () => {
        if (!isChecked) {
        alert("Please agree to the terms before submitting.");
        return;
        }
        alert("Application submitted successfully!");
        localStorage.removeItem('job_application_draft');
    };    

    const getTitleFromLocalStorage = () => {
        const jobTitle = localStorage.getItem('job_title');
        return jobTitle ? jobTitle : null; 
    };

    const getCompanyFromLocalStorage = () => {
        const company = localStorage.getItem('company');
        return company ? company : null; 
    };

    const goBack = () => {
        router.push({
            pathname: '/APPLICANT/ApplicantDocuments',
            query: { jobId }, 
        });
    };

    //TODO 1. Retrieve yung job application id then display it

    return ( 
        <div>
            <ApplicantHeader/>
                <div className=" lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 sm:px-8 xsm:px-8 lg:px-20 py-8 mx-auto">
                    <p className="font-thin lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall  text-fontcolor pb-1">You are Applying for </p>
                    <p className="font-semibold text-primary text-large pb-1">{getTitleFromLocalStorage() || 'No Job Title Available'}</p>
                    <p className="font-thin lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1">{getCompanyFromLocalStorage() || 'No Job Company Available'}</p>
                    <div className="relative">
                        <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-8 font-bold underline cursor-pointer" onClick={handleToggleDetails} >See job hiring details</p>
                        {showJobDetails && (
                            <div className="flex items-center justify-center absolute inset-0 bg-background h-screen ">
                                <div className="relative w-full lg:w-6/12 mb:w-10/12 sm:w-full z-10 bg-background rounded ">
                                    <button onClick={() => setShowJobDetails(false)} className="absolute -top-12 right-0  text-xl text-fontcolor hover:text-gray-700" > ✖ </button>
                                    <JobDetailsWrapper
                                    /*authToken={authTokens?.access}*/
                                    onJobClick={handleJobClick}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="box-container px-8 py-5 mx-auto">
                            <p className="font-semibold lg:text-large mb:text-medium sm:text-medium xsm:text-medium text-primary">Please review your application</p>

                            <div className="flex items-center pt-2 pb-2">
                                <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                                    <div className={`relative h-1 rounded-full transition-all duration-300 bg-primary`} style={{ width: "75%" }}></div>
                                </div>
                            </div>

                            <p className="font-medium lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall text-fontcolor">Please review that all the information and documents are correct</p>
                            
                            <div className="pt-2">
                                <ReviewApplication/>
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
                                <span className="text-fontcolor lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
                                tincidunt et turpis habitasse ultrices condimentum velit.
                                <br />
                                Consectetur pellentesque non eget nisl, pretium, ultrices. Tortor
                                dignissim pretium aliquet nunc, pulvinar.
                                </span>
                            </label>
                            </section>


                            <div className="flex justify-between mt-1">
                                
                                <button onClick={goBack} type="button" className="button2 flex items-center justify-center">
                                    <div className="flex items-center space-x-2">
                                        <Image 
                                            src="/Arrow Left.svg" 
                                            width={23} 
                                            height={10} 
                                            alt="Back Icon" 
                                        />
                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Back</p>
                                    </div>
                                </button>
                                

                                <button type="button" onClick={handleSubmit}  className={`button1 flex items-center justify-center ${!isChecked && "opacity-50"}`} disabled={!isChecked}>
                                    <Link href="/APPLICANT/ApplicationSubmit" className="flex items-center space-x-2 ml-auto">
                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Submit Application</p>
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