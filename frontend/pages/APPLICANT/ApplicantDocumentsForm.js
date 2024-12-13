import { useState } from "react";
import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";

export default function ApplicantDocuments() {
    const [formData, setFormData] = useState({
        resume: { file: "", option: "upload" },
        diploma: { file: "", option: "upload" },
        transcript: { file: "", option: "upload" },
        certificate: { file: "", option: "upload" },
        seminarCertificate: { file: "", option: "upload" },
        additionalDocuments: { file: "", option: "upload" },
    });

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

    return (
        <div>
            <ApplicantHeader />
            <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 sm:px-20 xsm:px-20 lg:px-20 mx-auto">
                <h1 className="text-xl font-bold text-primary pb-5">Job Title</h1>

                     <div className="px-4 max-w-md mx-auto">
                       <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 mt-4 p-4 space-y-6"> 
                        
                        {/* Title and instructions */}
                        <div className="space-y-2">
                            <h1 className="text-xl font-bold text-primary">Applicant Documents</h1>
                            <p className="text-gray-600 text-sm">
                                Please upload your documents in one of the following formats: PDF, PNG, JPEG, or DOCX.
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative w-full bg-gray-200 rounded-full h-2 mt-4">
                            <div className="absolute bg-[var(--primary)] h-2 rounded-full" style={{ width: "50%" }}></div>
                        </div>

                        {/* Resume */}
                        <div>
                         <h2 className="text-md font-semibold text-primary mt-4">Resume</h2>
                           <div className="mt-2">
                             <label className="flex items-center">
                         <input
                                 type="radio"
                                 name="resumeOption"
                                 value="upload"
                                 className="text-[var(--primary)] focus:ring-[var(--primary)] mr-4 h-6 w-3" 
                                 checked={formData.resume.option === "upload"}
                             onChange={(e) => handleOptionChange(e, "resume")}
                             />
                           <span className="text-sm text-black">Upload Resume</span>
                        </label>

                                <input
                                    type="file"
                                    name="resume"
                                    onChange={(e) => handleFileUpload(e, "resume")}
                                    className="mt-2 block w-full px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                    disabled={formData.resume.option !== "upload"}
                                />

                                <label className="flex items-center space-x-2 mt-2">
                                    <input
                                        type="radio"
                                        name="resumeOption"
                                        value="select"
                                        className="text-[var(--primary)] focus:ring-[var(--primary)] mr-3 h-6 w-3"
                                        checked={formData.resume.option === "select"}
                                        onChange={(e) => handleOptionChange(e, "resume")}
                                    />
                                    <span className="text-sm text-black text-left">Select a Resume</span>
                                </label>
                                <select
                                    name="resume"
                                    onChange={(e) => handleDropdownChange(e, "resume")}
                                    className="block w-full mt-2 rounded-md border py-1 px-2 text-sm focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                    disabled={formData.resume.option !== "select"}
                                    value={formData.resume.file}
                                >
                                    <option value="">Please select a Resume</option>
                                    <option value="resume1.pdf">Resume 1</option>
                                    <option value="resume2.pdf">Resume 2</option>
                                </select>
                            </div>
                        </div>

                        {/* Educational Documents Section */}
                        <div>
                            <h2 className="text-md font-semibold text-primary mt-4">Educational Documents</h2>

                            {/* Diploma */}
                            <div className="mt-2">
                                <h3 className="text-sm font-bold">1. Diploma</h3>
                                <div className="mt-2 space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="diplomaOption"
                                            value="upload"
                                            className="text-[var(--primary)] focus:ring-[var(--primary)] mr-3 h-6 w-3"
                                            checked={formData.diploma.option === "upload"}
                                            onChange={(e) => handleOptionChange(e, "diploma")}
                                        />
                                        <span className="text-sm text-black text-left">Upload Diploma</span>
                                    </label>
                                    <input
                                        type="file"
                                        name="diploma"
                                        onChange={(e) => handleFileUpload(e, "diploma")}
                                        className="block w-full px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                        disabled={formData.diploma.option !== "upload"}
                                    />
                                    <label className="flex items-center space-x-2 mt-2">
                                        <input
                                            type="radio"
                                            name="diplomaOption"
                                            value="select"
                                            className="text-[var(--primary)] focus:ring-[var(--primary)] mr-3 h-6 w-3"
                                            checked={formData.diploma.option === "select"}
                                            onChange={(e) => handleOptionChange(e, "diploma")}
                                        />
                                        <span className="text-sm text-black text-left">Select Diploma</span>
                                    </label>
                                    <select
                                        name="diploma"
                                        onChange={(e) => handleDropdownChange(e, "diploma")}
                                        className="block w-full mt-2 rounded-md border py-1 px-2 text-sm focus:ring-2 focus:ring-[var(--primary)] focus:outline-none "
                                        disabled={formData.diploma.option !== "select"}
                                        value={formData.diploma.file}
                                    >
                                        <option value="">Please select a Diploma</option>
                                        <option value="diploma1.pdf">Diploma 1</option>
                                        <option value="diploma2.pdf">Diploma 2</option>
                                    </select>
                                </div>
                            </div>

                            {/* Transcript of Records */}
                            <div className="mt-4">
                                <h3 className="text-sm font-bold">2. Transcript of Records</h3>
                                <div className="mt-2 space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="transcriptOption"
                                            value="upload"
                                            className="text-[var(--primary)] focus:ring-[var(--primary)] mr-2 h-6 w-3"
                                            checked={formData.transcript.option === "upload"}
                                            onChange={(e) => handleOptionChange(e, "transcript")}
                                        />
                                        <span className="text-sm text-black text-left">Upload Transcript of Records</span>
                                    </label>
                                    <input
                                        type="file"
                                        name="transcript"
                                        onChange={(e) => handleFileUpload(e, "transcript")}
                                        className="block w-full px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                        disabled={formData.transcript.option !== "upload"}
                                    />
                                    <label className="flex items-center space-x-2 mt-2">
                                        <input
                                            type="radio"
                                            name="transcriptOption"
                                            value="select"
                                            className="text-[var(--primary)] focus:ring-[var(--primary)] mr-2 h-6 w-3"
                                            checked={formData.transcript.option === "select"}
                                            onChange={(e) => handleOptionChange(e, "transcript")}
                                        />
                                        <span className="text-sm text-black text-left">Select Transcript</span>
                                    </label>
                                    <select
                                        name="transcript"
                                        onChange={(e) => handleDropdownChange(e, "transcript")}
                                        className="block w-full mt-2 rounded-md border py-1 px-2 text-sm focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                        disabled={formData.transcript.option !== "select"}
                                        value={formData.transcript.file}
                                    >
                                        <option value="">Please select a Transcript</option>
                                        <option value="transcript1.pdf">Transcript 1</option>
                                        <option value="transcript2.pdf">Transcript 2</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Certificate Section */}
                        <div>
                            <h2 className="text-md font-semibold text-primary mt-4">Work Experience Documents</h2>

                            {/* Certificate */}
                            <div className="mt-3">
                                <h3 className="text-sm font-bold">1. Certificate of Employment</h3>
                                <div className="mt-2 space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="certificateOption"
                                            value="upload"
                                            className="text-[var(--primary)] focus:ring-[var(--primary)] mr-3 h-6 w-3"
                                            checked={formData.certificate.option === "upload"}
                                            onChange={(e) => handleOptionChange(e, "certificate")}
                                        />
                                        <span className="text-sm text-black text-left">Upload Certificate of Employment</span>
                                    </label>
                                    <input
                                        type="file"
                                        name="certificate"
                                        onChange={(e) => handleFileUpload(e, "certificate")}
                                        className="block w-full px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                        disabled={formData.certificate.option !== "upload"}
                                    />
                                    <label className="flex items-center space-x-2 mt-2">
                                        <input
                                            type="radio"
                                            name="certificateOption"
                                            value="select"
                                            className="text-[var(--primary)] focus:ring-[var(--primary)] mr-3 h-6 w-3"
                                            checked={formData.certificate.option === "select"}
                                            onChange={(e) => handleOptionChange(e, "certificate")}
                                        />
                                        <span className="text-sm text-black text-left">Select Certificate of Employment</span>
                                    </label>
                                    <select
                                        name="certificate"
                                        onChange={(e) => handleDropdownChange(e, "certificate")}
                                        className="block w-full mt-2 rounded-md border py-1 px-2 text-sm focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                        disabled={formData.certificate.option !== "select"}
                                        value={formData.certificate.file}
                                    >
                                        <option value="">Please select a Certificate</option>
                                        <option value="certificate1.pdf">Certificate 1</option>
                                        <option value="certificate2.pdf">Certificate 2</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Seminar Certificate */}
                        <div>
                            <h2 className="text-md font-semibold text-primary mt-4">Certification</h2>
                            <div className="mt-2 space-y-2">
                            <h3 className="text-sm font-bold">1. Seminar/Skills Certification</h3>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="seminarCertificateOption"
                                        value="upload"
                                        className="text-[var(--primary)] focus:ring-[var(--primary)] mr-3 h-6 w-3"
                                        checked={formData.seminarCertificate.option === "upload"}
                                        onChange={(e) => handleOptionChange(e, "seminarCertificate")}
                                    />
                                    <span className="text-sm text-black text-left">Upload Seminar/Skills Certificate</span>
                                </label>
                                <input
                                    type="file"
                                    name="seminarCertificate"
                                    onChange={(e) => handleFileUpload(e, "seminarCertificate")}
                                    className="block w-full px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                    disabled={formData.seminarCertificate.option !== "upload"}
                                />

                                <label className="flex items-center space-x-2 mt-2">
                                    <input
                                        type="radio"
                                        name="seminarCertificateOption"
                                        value="select"
                                        className="text-[var(--primary)] focus:ring-[var(--primary)] mr-3 h-6 w-3"
                                        checked={formData.seminarCertificate.option === "select"}
                                        onChange={(e) => handleOptionChange(e, "seminarCertificate")}
                                    />
                                    <span className="text-sm text-black text-left">Select Seminar/Skills Certificate</span>
                                </label>
                                <select
                                    name="seminarCertificate"
                                    onChange={(e) => handleDropdownChange(e, "seminarCertificate")}
                                    className="block w-full mt-2 rounded-md border py-1 px-2 text-sm focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                    disabled={formData.seminarCertificate.option !== "select"}
                                    value={formData.seminarCertificate.file}
                                >
                                    <option value="">Please select a Seminar Certificate</option>
                                    <option value="seminar1.pdf">Seminar 1</option>
                                    <option value="seminar2.pdf">Seminar 2</option>
                                </select>
                            </div>
                        </div>

                        {/* Additional Documents Section */}
                        <div>
                            <h2 className="text-md font-semibold text-primary mt-4">Additional Documents</h2>
                            <div className="mt-2 space-y-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="additionalDocumentsOption"
                                        value="upload"
                                        className="text-[var(--primary)] focus:ring-[var(--primary)] mr-3 h-6 w-3"
                                        checked={formData.additionalDocuments.option === "upload"}
                                        onChange={(e) => handleOptionChange(e, "additionalDocuments")}
                                    />
                                    <span className="text-sm text-black text-left">Upload Additional Documents</span>
                                </label>
                                <input
                                    type="file"
                                    name="additionalDocuments"
                                    onChange={(e) => handleFileUpload(e, "additionalDocuments")}
                                    className="block w-full px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                    disabled={formData.additionalDocuments.option !== "upload"}
                                />
                            </div>
                        </div>

                       {/* Submit and Back Buttons */}
                        <div className="flex justify-between">
                          <button
                              type="button"
                              onClick={() => window.history.back()}
                              className="rounded-lg py-2 px-6 bg-[var(--secondary)] text-[var(--fontcolor)] text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 hover:shadow-md hover:shadow-gray-400"
                        >
                         Back
                     </button>
                         <button
                             type="submit"
                             className="rounded-lg py-2 px-6 bg-[var(--primary)] text-[var(--foreground)] text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 hover:shadow-md hover:shadow-gray-400"
                        >
                        Submit
                      </button>
                        </div>
                    </form>
                </div>

                <GeneralFooter />
            </div>
        </div>
    );
}
