import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Image from 'next/image';
import { useState, useEffect, useContext, useCallback } from "react";
import AuthContext from '../context/AuthContext';
import { useRouter } from 'next/router';
import { FaChevronDown } from 'react-icons/fa';
import { FaPlus } from "react-icons/fa";
import JobDetailsWrapper from "@/components/JobDetails";

//TODO TODO TODO TODO

export default function ApplicantDocument ({handleJobClick }) {

    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const [isEducationalOpen, setIsEducationalOpen] = useState(false);
    const [isWorkExpOpen, setIsWorkExpOpen] = useState(false);
    const [isSeminarOpen, setIsSeminarOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const [showJobDetails, setShowJobDetails] = useState(false);

    const handleToggleDetails = () => {
        setShowJobDetails((prev) => !prev); // Toggle visibility
    };


    const router = useRouter();
    const { jobId } = router.query;
    let {authTokens} = useContext(AuthContext);

    const [draftJobApplication, setdraftJobApplication] = useState({
        job_hiring: '',
        job_application_id: '',
        applicant: '',
        fullName: '',
        email: '',
        contact_number: '',
        address: '',
        linkedin_profile: '',
        application_date: '',
        application_status: '',
        documents: '',
    });

    const [formData, setFormData] = useState({
        resume: { file: "", option: "upload" },
        educationaldocs: { file: "", option: "upload" },
        workcertificate: { file: "", option: "upload" },
        seminarCertificate: { file: "", option: "upload" },
        additionalDocuments: { file: "", option: "upload" },
        additionalDocs: { files: [] }, // Keep additional documents as an array
    });

    const getTitle = () => {
        const jobTitle = sessionStorage.getItem('job_title');
        return jobTitle ? jobTitle : null; 
    };
    
    const getCompany = () => {
        const company = sessionStorage.getItem('company');
        return company ? company : null; 
    };

    const goBack = () => {
        router.push({
            pathname: '/APPLICANT/JobApplication',
            query: { jobId }, 
        });
    };

    const handleOptionChange = (e, document) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [document]: {
                ...prevState[document],
                option: value,
                file: value === "upload" ? "" : prevState[document].file, // Clear file if 'select' option is chosen
            },
        }));
    };

    const handleDropdownChange = (e, document) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [document]: {
                ...prevState[document],
                file: value,
            },
        }));
    };

    useEffect(() => {
        // Retrieve the draft job application data from localStorage
        const savedDraft = sessionStorage.getItem('draftJobApplication'); // use session storage

        if (savedDraft) {
            const parsedDraft = JSON.parse(savedDraft);
            console.log('Draft Loaded:', parsedDraft);
            console.log(parsedDraft.job_hiring);
            // console.log(typeof(parsedDraft.job_hiring))
            setdraftJobApplication(parsedDraft);
        }

        console.log(draftJobApplication);
    }, []);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
    
        const applicationData = {
            ...draftJobApplication,
            documents: Object.keys(formData).map((key) => ({
                document_type: key,
                document_file: formData[key].file, // <- This is the actual File object
            })),
        };

        console.log(applicationData);
    
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('job_hiring', applicationData.job_hiring);
        formDataToSubmit.append('applicant', applicationData.applicant);
        formDataToSubmit.append('fullName', applicationData.fullName);
        formDataToSubmit.append('email', applicationData.email);
        formDataToSubmit.append('contact_number', applicationData.contact_number);
        formDataToSubmit.append('address', applicationData.address);
        formDataToSubmit.append('linkedin_profile', applicationData.linkedin_profile);
        formDataToSubmit.append('application_date', applicationData.application_date);
        formDataToSubmit.append('application_status', applicationData.application_status);
    
        // Append each document file and its type to FormData
        applicationData.documents.forEach((doc) => {
            if (doc.document_file) {
                formDataToSubmit.append('document_type', doc.document_type); // Matches 'document_type' in your backend
                formDataToSubmit.append('document_file', doc.document_file); // Matches 'document_file' in your backend
            }
        });
    
        // Debugging: See what's being sent
        for (let pair of formDataToSubmit.entries()) {
            console.log(pair[0], pair[1]);
        }
    
        try {
            const res = await fetch('http://127.0.0.1:8000/job/applications/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authTokens.access}`, // Keep headers minimal for FormData
                },
                body: formDataToSubmit,
            });
    
            if (res.ok) {
                alert('Job application submitted successfully!');
                localStorage.removeItem('draftJobApplication');
                router.push({
                    pathname: '/APPLICANT/ApplicationConfirmation',
                    query: { jobId },
                });
            } else {
                const errorData = await res.json();
                console.error('Submission error:', errorData);
                alert('Failed to submit job application.');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('An error occurred. Please try again later.');
        }
    };
    
    
    const addAdditionalFile = (category) => {
        setFormData((prevState) => {
            const updatedFiles = [...(prevState[category]?.files || [])];
            updatedFiles.push(""); // Add an empty placeholder for the new file
            return {
                ...prevState,
                [category]: {
                    ...prevState[category],
                    files: updatedFiles,
                },
            };
        });
    };
    
    // Remove additional file input for a specific category
    const removeAdditionalFile = (category, index) => {
        setFormData((prevState) => {
            const updatedFiles = (prevState[category]?.files || []).filter((_, i) => i !== index);
            return {
                ...prevState,
                [category]: {
                    ...prevState[category],
                    files: updatedFiles,
                },
            };
        });
    };
    
    // Handle file input change for additional files
    const handleAdditionalFileChange = (e, category, index) => {
        const { files } = e.target;
        setFormData((prevState) => {
            const updatedFiles = [...(prevState[category]?.files || [])];
            updatedFiles[index] = files[0]; // Store the file object, not just the filename
            return {
                ...prevState,
                [category]: {
                    ...prevState[category],
                    files: updatedFiles,
                },
            };
        });
    };
    
    return ( 
        <div>
            <ApplicantHeader/>
                <div className=" lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 xxsm:px-4  py-8 mx-auto">
                    <p className="font-thin lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall  text-fontcolor pb-1">You are Applying for </p>
                    <p className="font-semibold text-primary text-large pb-1">{getTitleFromLocalStorage() || 'No Job Title Available'}</p>
                    <p className="font-thin lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1">{getCompanyFromLocalStorage() || 'No Job Company Available'}</p>
                    <div className="relative">
                        <p className="lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor pb-8 font-bold underline cursor-pointer" onClick={handleToggleDetails} >See job hiring details</p>
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
                    <div className="flex items-center justify-center ">
                        <div className="job-application-box rounded-xs px-8 py-5 mx-auto">
                            <p className="font-semibold lg:text-large mb:text-medium sm:text-medium xsm:text-medium  text-primary"> Applicant Documents</p>
                            
                            <div className="flex items-center pt-2 pb-2">
                                <div className="w-full bg-background h-1. border-2 border-primary rounded-full ">
                                    <div className={` h-1 rounded-full transition-all duration-300 bg-primary`} style={{ width: "50%" }}></div>
                                </div>
                            </div>

                            <p className="font-medium lg:text-xsmall mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall text-fontcolor">Please upload your documents in one of the following formats: PDF, PNG, JPEG, or DOCX.</p>
                            
                            {/* Resume */}
                            <div>
                                {/* Resume Header (Clickable)*/}
                                <div className="flex justify-between items-center" onClick={() => setIsResumeOpen(!isResumeOpen)}>
                                    <h2 className="lg:text-large mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall font-semibold text-fontcolor mt-4 cursor-pointer" > 1. Resume</h2>
                                    <FaChevronDown className={`text-fontcolor transform ${isResumeOpen ? "rotate-180" : "rotate-0"} transition-transform`} />
                                </div>

                                {/* Accordion Content */}
                                {isResumeOpen && (
                                    <div className="mt-2 ml-4">
                                   {formData.resume.files?.map((file, index) => (
                                        <div key={index} className="flex items-center space-x-4 mb-2">
                                            <input
                                                type="file"
                                                onChange={(e) => handleAdditionalFileChange(e, "resume", index)}
                                                className="block w-full px-2 py-1 text-medium border focus:ring-2 rounded-xs focus:outline-none"
                                            />
                                            <button type="button" onClick={() => removeAdditionalFile("resume", index)} className="text-accent lg:text-large mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall">
                                                Remove
                                            </button>
                                        </div>
                                    ))}

                                    <button type="button"   onClick={() => addAdditionalFile("resume")} className="flex items-center space-x-2 text-primary font-semibold" >
                                        <FaPlus className="text-lg" />
                                        <span className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall">Add Resume</span>
                                    </button>
                                    </div>
                                )}
                            </div>

                             {/* Educational Documents */}
                             <div>

                                <div className="flex flex-col justify-between items-start">
                                    <div className="flex justify-between items-center w-full" onClick={() => setIsEducationalOpen(!isEducationalOpen)}>
                                        <h2 className="lg:text-large mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall font-semibold text-fontcolor mt-3 cursor-pointer"> 2. Upload Educational Documents </h2>
                                        <FaChevronDown className={`text-fontcolor transform ${isEducationalOpen ? "rotate-180" : "rotate-0"} transition-transform`}/>
                                    </div>

                                    <p className="mt-auto font-medium text-xs text-fontcolor ml-4">
                                        Upload a document that includes the applicant's name, course/program, and school, such as Diploma, Transcript of Records, or Certificate of Registration.
                                    </p>
                                </div>

                                {isEducationalOpen && (   
                                    <div className="mt-2 ml-4">
                                    {formData.educationaldocs.files?.map((file, index) => (
                                        <div key={index} className="flex items-center space-x-4 mb-2">
                                            <input
                                                type="file"
                                                onChange={(e) => handleAdditionalFileChange(e, "resume", index)}
                                                className="block w-full px-2 py-1 text-medium border focus:ring-2 rounded-xs focus:outline-none"
                                            />
                                            <button type="button" onClick={() => removeAdditionalFile("educationaldocs", index)} className="text-accent lg:text-medium mb:text-medium sm:text-medium xsm:text-medium">
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addAdditionalFile("educationaldocs")} className="flex items-center space-x-2 text-primary font-semibold" >
                                        <FaPlus className="text-lg" />
                                        <span className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall">Add Educational Documents</span>
                                    </button>
                                    </div>
                                )}
                            </div>

                            {/* Work Experience Documents */}
                            <div>
                                <div className="flex flex-col justify-between items-start">
                                    <div className="flex justify-between items-center w-full" onClick={() => setIsWorkExpOpen(!isWorkExpOpen)} >
                                        <h2 className="lg:text-large mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall font-semibold text-fontcolor mt-3 cursor-pointer" > 3. Upload Work Experience Documents </h2>
                                        <FaChevronDown className={`text-fontcolor transform ${isWorkExpOpen ? "rotate-180" : "rotate-0"} transition-transform`}/>
                                    </div>

                                    <p className="mt-auto font-medium text-xs text-fontcolor ml-4">
                                        Upload a document that includes the applicant's name, job title, and company, such as Certificate of Employment or Employment Contract.
                                    </p>
                                </div>

                                {isWorkExpOpen && (
                                    <div className="mt-2 ml-4">
                                    {formData.workcertificate.files?.map((file, index) => (
                                        <div key={index} className="flex items-center space-x-4 mb-2">
                                            <input
                                                type="file"
                                                onChange={(e) => handleAdditionalFileChange(e, "workcertificate", index)}
                                                className="block w-full px-2 py-1 text-medium border focus:ring-2 rounded-xs focus:outline-none"
                                            />
                                            <button type="button" onClick={() => removeAdditionalFile("workcertificate", index)} className="text-accent lg:text-medium mb:text-medium sm:text-medium xsm:text-medium">
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addAdditionalFile("workcertificate")} className="flex items-center space-x-2 text-primary font-semibold" >
                                        <FaPlus className="text-lg" />
                                        <span className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall">Add Work Experience Documents</span>
                                    </button>
                                    </div>
                                )}
                            </div>

                            {/* Certifications */}
                            <div>
                                {/* Certifications (Clickable)*/}
                                <div className="flex flex-col justify-between items-start">
                                    <div className="flex justify-between items-center w-full" onClick={() => setIsSeminarOpen(!isSeminarOpen)}>
                                        <h2 className="lg:text-large mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall font-semibold text-fontcolor mt-3 cursor-pointer"  > 4. Upload Certification Documents </h2>
                                        <FaChevronDown className={`text-fontcolor transform ${isSeminarOpen ? "rotate-180" : "rotate-0"} transition-transform`}/>
                                    </div>

                                    <p className="mt-auto font-medium text-xs text-fontcolor ml-4">
                                        Upload a document that includes the applicant's name, certificate title, and Certificate provider, such as a Completion Certificate, such as Certificate of Employment or Employment Contract.
                                    </p>
                                </div>
                               
                                {isSeminarOpen && (
                                    <div className="mt-2 ml-4">
                                    {formData.seminarCertificate.files?.map((file, index) => (
                                        <div key={index} className="flex items-center space-x-4 mb-2">
                                            <input
                                                type="file"
                                                onChange={(e) => handleAdditionalFileChange(e, "seminarCertificate", index)}
                                                className="block w-full px-2 py-1 text-medium border focus:ring-2 rounded-xs focus:outline-none"
                                            />
                                            <button type="button" onClick={() => removeAdditionalFile("seminarCertificate", index)} className="text-accent lg:text-medium mb:text-medium sm:text-medium xsm:text-medium">
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button"  onClick={() => addAdditionalFile("seminarCertificate")}  className="flex items-center space-x-2 text-primary font-semibold" >
                                        <FaPlus className="text-lg" />
                                        <span className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall">Add More</span>
                                    </button>
                                    </div>
                                    )}
                            </div>

                            {/* Additional Documents */}
                            <div>
                                <div className="flex flex-col justify-between items-start">
                                    <div className="flex justify-between items-center w-full" onClick={() => setIsAddOpen(!isAddOpen)}>
                                        <h2 className="lg:text-large mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall font-semibold text-fontcolor mt-3 cursor-pointer">
                                            5. Additional Documents
                                        </h2>
                                        <FaChevronDown className={`text-fontcolor transform ${isAddOpen ? "rotate-180" : "rotate-0"} transition-transform`} />
                                    </div>
                                    <p className="mt-auto font-medium text-xs text-fontcolor ml-4">
                                        Upload additional documents.
                                    </p>
                                </div>

                                {/* Accordion Content */}
                                {isAddOpen && (
                                    <div className="mt-2 ml-4">
                                      {formData.additionalDocuments.files?.map((file, index) => (
                                        <div key={index} className="flex items-center space-x-4 mb-2">
                                            <input
                                                type="file"
                                                onChange={(e) => handleAdditionalFileChange(e, "additionalDocuments", index)}
                                                className="block w-full px-2 py-1 text-medium border focus:ring-2 rounded-xs focus:outline-none"
                                            />
                                            <button type="button" onClick={() => removeAdditionalFile("additionalDocuments", index)} className="text-accent lg:text-medium mb:text-medium sm:text-medium xsm:text-medium">
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                        <button type="button" onClick={() => addAdditionalFile("additionalDocuments")} className="flex items-center space-x-2 text-primary font-semibold" >
                                            <FaPlus className="text-lg" />
                                            <span className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall">Add Additional Documents</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between mt-8">  
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
                                

                                <button onClick={handleSubmit} type="button" className="button1 flex items-center justify-center">
                                    <div className="flex items-center space-x-2">
                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Continue</p>
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
            <GeneralFooter/>
        </div>
     );
}