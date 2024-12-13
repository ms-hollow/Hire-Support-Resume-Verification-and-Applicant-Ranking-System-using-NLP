import React, { useState } from "react";
import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";

const EditIcon = ({ onClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="var(--accent)" // Always red
    className="w-5 h-5 cursor-pointer"
    onClick={onClick}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.73 18.983a4.5 4.5 0 01-1.691 1.064l-3.175.93a.75.75 0 01-.93-.93l.93-3.175a4.5 4.5 0 011.064-1.691L16.862 3.487z"
    />
  </svg>
);

export default function ReviewApplicationForm() {
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [isEditingDocuments, setIsEditingDocuments] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Lorem ipsum dolor sit amet",
    email: "someone@gmail.com",
    contactNo: "+123456789",
    address: "123 Main St, City, Country",
    linkedin: "https://linkedin.com/in/someone",
  });

  const [documents, setDocuments] = useState({
    resume: "Resume.pdf",
    diploma: "Diploma.pdf",
    transcript: "Transcript.pdf",
    certificate: "Certificate.pdf",
    seminarCertificate: "SeminarCertificate.pdf",
    additional: "AdditionalDocument.pdf",
  });

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentsChange = (e) => {
    const { name, value } = e.target;
    setDocuments((prev) => ({ ...prev, [name]: value }));
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
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <ApplicantHeader />
        <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 sm:px-20 xsm:px-20 lg:px-20 text-left">
          <h1 className="text-xl font-bold text-primary pb-5">Job Title</h1>

        <main className="flex-grow flex justify-center items-center p-6">
          <div className="box-container w-full max-w-3xl bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <h1 className="text-xl font-bold text-primary">Applicant Documents</h1>

            {/* Progress Bar */}
            <div className="relative w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="absolute bg-primary h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-600">
               Please review that all the information and documents are correct.
          </p>

            {/* Personal Information */}
            <section className="mb-6 mt-5">
              <header className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-primary">
                  Personal Information
                </h2>
                <EditIcon
                  onClick={() => setIsEditingPersonalInfo(!isEditingPersonalInfo)}
                />
              </header>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                {isEditingPersonalInfo ? (
                  <>
                    {Object.keys(personalInfo).map((key) => (
                      <div className="mb-4" key={key}>
                        <label
                          htmlFor={key}
                          className="block text-sm font-medium text-gray-700 capitalize"
                        >
                          {key.replace(/([A-Z])/g, " $1")}
                        </label>
                        <input
                          id={key}
                          type="text"
                          name={key}
                          value={personalInfo[key] || ""}
                          onChange={handlePersonalInfoChange}
                          className="input"
                          placeholder={`Enter your ${key}`}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => setIsEditingPersonalInfo(false)}
                      className="button1 w-auto"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  Object.keys(personalInfo).map((key) => (
                    <p
                      key={key}
                      className="mb-2 text-black" 
                    >
                      <span className="font-semibold capitalize">
                        {key.replace(/([A-Z])/g, " $1")}:{" "}
                      </span>
                      {personalInfo[key]}
                    </p>
                  ))
                )}
              </div>
            </section>

            {/* Attached Documents */}
            <section className="mb-6">
              <header className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-primary">
                  Attached Documents
                </h2>
                <EditIcon
                  onClick={() => setIsEditingDocuments(!isEditingDocuments)}
                />
              </header>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                {isEditingDocuments ? (
                  <>
                    {Object.keys(documents).map((key) => (
                      <div className="mb-4" key={key}>
                        <label
                          htmlFor={key}
                          className="block text-sm font-medium text-gray-700 capitalize"
                        >
                          {key.replace(/([A-Z])/g, " $1")}
                        </label>
                        <input
                          id={key}
                          type="text"
                          name={key}
                          value={documents[key] || ""}
                          onChange={handleDocumentsChange}
                          className="input"
                          placeholder={`Enter document for ${key}`}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => setIsEditingDocuments(false)}
                      className="button1 w-auto"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  Object.keys(documents).map((key) => (
                    <p
                      key={key}
                      className="mb-2 text-black" 
                    >
                      <span className="font-semibold capitalize">
                        {key.replace(/([A-Z])/g, " $1")}:{" "}
                      </span>
                      {documents[key]}
                    </p>
                  ))
                )}
              </div>
            </section>

            {/* Checkbox Section */}
            <section className="mt-6">
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <span className="text-gray-700 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
                  tincidunt et turpis habitasse ultrices condimentum velit.
                  <br />
                  Consectetur pellentesque non eget nisl, pretium, ultrices. Tortor
                  dignissim pretium aliquet nunc, pulvinar.
                </span>
              </label>
            </section>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="button2"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className={`button1 ${!isChecked && "opacity-50"}`}
                disabled={!isChecked}
              >
                Submit Application
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <GeneralFooter />
    </div>
  );
}
