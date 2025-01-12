import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from 'next/image';
import { useState, useEffect, useContext, useCallback } from "react";
import AuthContext from '../context/AuthContext';
import { useRouter } from 'next/router';

//TODO Connect frontend to backend

export default function ApplicantDocument () {

    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const [isEducationalOpen, setIsEducationalOpen] = useState(false);
    const [isDiplomaOpen, setIsDiplomaOpen] = useState(false);
    const [isTOROpen, setIsTOROpen] = useState(false);
    const [isWorkExpOpen, setIsWorkExpOpen] = useState(false);
    const [isSeminarOpen, setIsSeminarOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const router = useRouter();
    const { jobId } = router.query;
    let {authTokens} = useContext(AuthContext);

    const [formData, setFormData] = useState({
        resume: { file: "", option: "upload" },
        diploma: { file: "", option: "upload" },
        transcript: { file: "", option: "upload" },
        workcertificate: { file: "", option: "upload" },
        seminarCertificate: { file: "", option: "upload" },
        additionalDocuments: { file: "", option: "upload" },
    });

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
            pathname: '/APPLICANT/JobApplication',
            query: { jobId }, 
        });
    };

    const handleFileUpload = (e, document) => {
        const { files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [document]: {
                ...prevState[document],
                file: files[0] ? files[0].name : "",
            },
        }));
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

    //TODO 1. Retrieve the job application id 
    //TODO 2. Map yon sa may database 
    //TODO 3. Get yung uploaded documents
    //TODO 4. Gamit yung retrieved job application, send ng PATCH request sa backend para iedit and isave ang documents sa may job application na yon

    //TODO Note: Lagi dapat icheck if may changes kasi kapag nag edit sa APPLICATION CONFIRMATION, bumabalik lang sa page kung saan siya nag fill-up

    const handleSubmit = (e) => {
        e.preventDefault();

        // Optional: Validate to ensure that at least one document is selected/uploaded
        const allDocumentsUploaded = Object.values(formData).every(doc => doc.option === "select" && doc.file);

        if (!allDocumentsUploaded) {
            alert("Please select or upload all required documents.");
            return;
        }

        alert("Documents submitted successfully!");
    };

    const navigateToApplicantConfirmation = () => {
        router.push({
            pathname: '/APPLICANT/ApplicationConfirmation',
            query: { jobId },
        });
    };

    return ( 
        <div>
            <ApplicantHeader/>
                <div className=" lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 sm:px-8 xsm:px-8 lg:px-20 py-8 mx-auto">
                    <p className="font-thin lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall  text-fontcolor pb-1">You are Applying for </p>
                    <p className="font-semibold text-primary text-large pb-1">{getTitleFromLocalStorage() || 'No Job Title Available'}</p>
                    <p className="font-thin lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-1">{getCompanyFromLocalStorage() || 'No Job Company Available'}</p>
                    <p className="lg:text-medium  mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-8 font-bold underline"> See job hiring details</p>
                    
                    <div className="flex items-center justify-center ">
                        <div className="box-container px-8 py-5 mx-auto">
                            <p className="font-semibold lg:text-large mb:text-medium sm:text-medium xsm:text-medium text-primary"> Applicant Documents</p>
                            
                            <div className="flex items-center pt-2 pb-2">
                                <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                                    <div className={`relative h-1 rounded-full transition-all duration-300 bg-primary`} style={{ width: "50%" }}></div>
                                </div>
                            </div>

                            <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor">Please upload your documents in one of the following formats: PDF, PNG, JPEG, or DOCX.</p>
                            
                            {/* Resume */}
                            <div>
                                {/* Resume Header (Clickable)*/}
                                <h2 className="lg:text-large mb:text-medium sm:text-medium xsm:text-medium font-semibold text-primary mt-4 cursor-pointer" onClick={() => setIsResumeOpen(!isResumeOpen)}> 1. Resume </h2>

                                {/* Accordion Content */}
                                {isResumeOpen && (
                                    <div className="mt-2">
                                        <label className="flex items-center">
                                            <input type="radio" name="resumeOption" value="upload" className="text-primary h-medium rounded-xs border-2 border-fontcolor mr-4 w-3" checked={formData.resume.option === "upload"} onChange={(e) => handleOptionChange(e, "resume")} />
                                                <span className="lg:text-medium mb:text-medium sm:text-medium xsm:text-medium text-fontcolor">
                                                    Upload Resume
                                                </span>
                                        </label>
                                            <input type="file" name="resume" onChange={(e) => handleFileUpload(e, "resume")} className="block w-full px-2 py-1 text-medium border focus:ring-2 rounded-xs focus:outline-none" disabled={formData.resume.option !== "upload"} />

                                        <label className="flex items-center space-x-2 mt-2">
                                            <input type="radio" name="resumeOption" value="select" className="text-primary h-medium rounded-xs border-2 border-fontcolor mr-3 w-3" checked={formData.resume.option === "select"} onChange={(e) => handleOptionChange(e, "resume")} />
                                                <span className="lg:text-medium mb:text-medium sm:text-medium xsm:text-medium text-fontcolor text-left">
                                                    Select a Resume
                                                </span>
                                        </label>

                                        <select name="resume" onChange={(e) => handleDropdownChange(e, "resume")} className="h-medium block w-full rounded-xs border-2 py-1 px-2 text-medium focus:ring-primary focus:outline-none" disabled={formData.resume.option !== "select"} value={formData.resume.file} >
                                            <option value="">Please select Resume</option>
                                            <option value="resume1.pdf">Resume 1</option>
                                            <option value="resume2.pdf">Resume 2</option>
                                        </select>
                                     </div>
                                    )}
                            </div>

                             {/* Educational Documents */}
                             <div>
                                <h2 className="lg:text-large mb:text-medium sm:text-medium xsm:text-medium font-semibold text-primary mt-2 cursor-pointer" onClick={() => setIsEducationalOpen(!isEducationalOpen)}>  2. Educational Documents</h2>

                                {/* Nested Accordions: Diploma and TOR */}
                                {isEducationalOpen && (
                                    <div className="ml-4 mt-2">
                                    {/* Diploma */}
                                    <h2 className="text-medium font-semibold text-primary cursor-pointer"onClick={() => setIsDiplomaOpen(!isDiplomaOpen)}> 1. Diploma</h2>
                                    {isDiplomaOpen && (
                                        <div className=" ml-4">
                                            <label className="flex items-center">
                                                <input type="radio" name="diplomaOption" value="upload" className="text-primary h-medium rounded-xs border-2 border-fontcolor mr-4 w-3"  checked={formData.diploma.option === "upload"}  onChange={(e) => handleOptionChange(e, "diploma")}/>
                                                <span className="text-medium text-fontcolor">Upload Diploma</span>
                                            </label>
                                            <input type="file" name="diploma" onChange={(e) => handleFileUpload(e, "diploma")} className="block w-full px-2 py-1 text-medium border focus:ring-2 rounded-xs focus:outline-none" disabled={formData.diploma.option !== "upload"}  />

                                            <label className="flex items-center space-x-2 mt-2">
                                                <input type="radio" name="diplomaOption"value="select" className="text-primary h-medium rounded-xs border-2 border-fontcolor mr-3 w-3" checked={formData.diploma.option === "select"} onChange={(e) => handleOptionChange(e, "diploma")} />
                                                <span className="text-sm text-fontcolor text-left">Select a Diploma</span>
                                            </label>

                                            <select name="diploma"onChange={(e) => handleDropdownChange(e, "diploma")}className="h-medium block w-full rounded-xs border-2 py-1 px-2 text-medium focus:ring-primary focus:outline-none" disabled={formData.diploma.option !== "select"} value={formData.diploma.file} >
                                                <option value="">Please select Diploma</option>
                                                <option value="Diploma1.pdf">Diploma 1</option>
                                                <option value="Diploma2.pdf">Diploma 2</option>
                                            </select>
                                        </div>
                                )}

                                        {/*TOR*/}
                                        <h2 className="text-medium font-semibold text-primary cursor-pointer mt-2" onClick={() => setIsTOROpen(!isTOROpen)}> 2. Transcript of Records (TOR)  </h2>
                                        {isTOROpen && (
                                            <div className=" ml-4">
                                            <label className="flex items-center">
                                                <input type="radio"name="transcriptOption" value="upload" className="text-primary h-medium rounded-xs border-2 border-fontcolor mr-4 w-3" checked={formData.transcript.option === "upload"} onChange={(e) => handleOptionChange(e, "transcript")}/>
                                                <span className="text-medium text-fontcolor">Upload Transcript of Records (TOR)</span>
                                            </label>

                                            <input type="file" name="transcript" onChange={(e) => handleFileUpload(e, "transcript")} className="block w-full px-2 py-1 text-medium border focus:ring-2 rounded-xs focus:outline-none" disabled={formData.transcript.option !== "upload"} />

                                            <label className="flex items-center space-x-2 mt-2">
                                                <input type="radio" name="transcriptOption" value="select" className="text-primary h-medium rounded-xs border-2 border-fontcolor mr-3 w-3" checked={formData.transcript.option === "select"} onChange={(e) => handleOptionChange(e, "transcript")} />
                                                <span className="text-sm text-fontcolor text-left"> Select a transcript </span>
                                            </label>

                                            <select
                                                name="transcript" onChange={(e) => handleDropdownChange(e, "transcript")} className="h-medium block w-full rounded-xs border-2 py-1 px-2 text-medium focus:ring-primary focus:outline-none" disabled={formData.transcript.option !== "select"} value={formData.transcript.file} >
                                                <option value="">Please select Transcript of Records (TOR)</option>
                                                <option value="transcript1.pdf">Transcript of Records (TOR) 1</option>
                                                <option value="transcript2.pdf">Transcript of Records (TOR) 2</option>
                                            </select>
                                            </div>
                                        )}
                                        </div>
                                )}
                            </div>

                            {/* Work Experience Documents */}
                            <div>
                                {/* Resume Header (Clickable)*/}
                                <h2 className="lg:text-large mb:text-medium sm:text-medium xsm:text-medium font-semibold text-primary mt-2 cursor-pointer" onClick={() => setIsWorkExpOpen(!isWorkExpOpen)}> 3. Work Experience Documents </h2>
                                
                                {/* Accordion Content */}
                                {isWorkExpOpen && (
                                    
                                    <div className="mt-2 ml-8">
                                         <h2 className="text-medium font-semibold text-primary cursor-pointer -ml-3"onClick={() => setIsWorkExpOpen(!isWorkExpOpen)}> 1. Certificate of Employment</h2>
                                        <label className="flex items-center">
                                            <input type="radio" name="workcertificateOption" value="upload" className="text-primary h-medium rounded-xs border-2 border-fontcolor mr-4 w-3" checked={formData.workcertificate.option === "upload"} onChange={(e) => handleOptionChange(e, "seminarCertificate")} />
                                                <span className="text-medium text-fontcolor">
                                                    Upload Certificate of Employment
                                                </span>
                                        </label>
                                            <input type="file" name="workcertificate" onChange={(e) => handleFileUpload(e, "seminarCertificate")} className="block w-full px-2 py-1 text-medium border focus:ring-2 rounded-xs focus:outline-none" disabled={formData.seminarCertificate.option !== "upload"} />

                                        <label className="flex items-center space-x-2 mt-2">
                                            <input type="radio" name="workcertificateOption" value="select" className="text-primary h-medium rounded-xs border-2 border-fontcolor mr-3 w-3" checked={formData.workcertificate.option === "select"} onChange={(e) => handleOptionChange(e, "seminarCertificate")} />
                                                <span className="text-sm text-fontcolor text-left">
                                                    Select a Certificate of Employment
                                                </span>
                                        </label>

                                        <select name="seminarCertificate" onChange={(e) => handleDropdownChange(e, "seminarCertificate")} className="h-medium block w-full rounded-xs border-2 py-1 px-2 text-medium focus:ring-primary focus:outline-none" disabled={formData.seminarCertificate.option !== "select"} value={formData.seminarCertificate.file} >
                                            <option value="">Please select Certificate of Employment</option>
                                            <option value="Certificate of Employment1.pdf">Certificate of Employment 1</option>
                                            <option value="Certificate of Employment2.pdf">Certificate of Employment 2</option>
                                        </select>
                                     </div>
                                    )}
                            </div>

                            {/* Certifications */}
                            <div>
                                {/* Certifications (Clickable)*/}
                                <h2 className="lg:text-large mb:text-medium sm:text-medium xsm:text-medium font-semibold text-primary mt-2 cursor-pointer" onClick={() => setIsSeminarOpen(!isSeminarOpen)}> 4. Certifications </h2>
                                
                                {/* Accordion Content */}
                                {isSeminarOpen && (
                                    
                                    <div className="mt-2 ml-8">
                                         <h2 className="text-medium font-semibold text-primary cursor-pointer -ml-3"onClick={() => setIsSeminarOpen(!isSeminarOpen)}> 1. Seminar/Skills Certificates</h2>
                                        <label className="flex items-center">
                                            <input type="radio" name="seminarCertificateOption" value="upload" className="text-primary h-medium rounded-xs border-2 border-fontcolor mr-4 w-3" checked={formData.seminarCertificate.option === "upload"} onChange={(e) => handleOptionChange(e, "seminarCertificate")} />
                                                <span className="text-medium text-fontcolor">
                                                    Upload Seminar/Skills Certificates
                                                </span>
                                        </label>
                                            <input type="file" name="seminarCertificate" onChange={(e) => handleFileUpload(e, "seminarCertificate")} className="block w-full px-2 py-1 text-medium border focus:ring-2 rounded-xs focus:outline-none" disabled={formData.seminarCertificate.option !== "upload"} />

                                        <label className="flex items-center space-x-2 mt-2">
                                            <input type="radio" name="seminarCertificateOption" value="select" className="text-primary h-medium rounded-xs border-2 border-fontcolor mr-3 w-3" checked={formData.seminarCertificate.option === "select"} onChange={(e) => handleOptionChange(e, "seminarCertificate")} />
                                                <span className="text-sm text-fontcolor text-left">
                                                    Select Seminar/Skills Certificates
                                                </span>
                                        </label>

                                        <select name="resume" onChange={(e) => handleDropdownChange(e, "resume")} className="h-medium block w-full rounded-xs border-2 py-1 px-2 text-medium focus:ring-primary focus:outline-none" disabled={formData.seminarCertificate.option !== "select"} value={formData.seminarCertificate.file} >
                                            <option value="">Please select Seminar/Skills Certificates</option>
                                            <option value="Seminar/Skills Certificates1.pdf">Seminar/Skills Certificates 1</option>
                                            <option value="Seminar/Skills Certificates2.pdf">Seminar/Skills Certificates 2</option>
                                        </select>
                                     </div>
                                    )}
                            </div>

                             {/* additional Documents */}
                            <div>
                                {/* additional Documents Header (Clickable)*/}
                                <h2 className="lg:text-large mb:text-medium sm:text-medium xsm:text-medium font-semibold text-primary mt-2 cursor-pointer" onClick={() => setIsAddOpen(!isAddOpen)}> 5. Additional Documents </h2>

                                {/* Accordion Content */}
                                {isAddOpen && (
                                    <div className="mt-2">
                                        <label className="flex items-center">
                                            <input type="radio" name="additionalDocumentsOption" value="upload" className="text-primary h-medium rounded-xs border-2 border-fontcolor mr-4 w-3" checked={formData.additionalDocuments.option === "upload"} onChange={(e) => handleOptionChange(e, "additionalDocuments")} />
                                                <span className="text-medium text-fontcolor">
                                                    Additional Documents
                                                </span>
                                        </label>
                                            <input type="file" name="additionalDocuments" onChange={(e) => handleFileUpload(e, "additionalDocuments")} className="block w-full px-2 py-1 text-medium border focus:ring-2 rounded-xs focus:outline-none" disabled={formData.additionalDocuments.option !== "upload"} />

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
                                

                                <button onClick={navigateToApplicantConfirmation} type="button" className="button1 flex items-center justify-center">
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