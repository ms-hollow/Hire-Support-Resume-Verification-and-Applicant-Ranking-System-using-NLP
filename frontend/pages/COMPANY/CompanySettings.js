import { useState, useEffect } from "react";
import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import { saveJobDetails } from "@/pages/utils/JobUtils";
import Link from "next/link";
import Image from "next/image";
import { FaChevronDown } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function CompanySettings() {
  const [options, setOptions] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dummyJobDetails, setDummyJobDetails] = useState([]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    requiredDocuments: [],
    application_deadline: "",
    weightOfCriteria: '',  
    verification_option: "",
    criteria: {
      workExperience: {
        directlyRelevant: [],
        highlyRelevant:[],
        moderatelyRelevant:[],
        weight: "",
        selectedOptions: [],
      },
      skills: {
        primarySkills: [],
        secondarySkills: [],
        additionalSkills: [],
        weight: "",
        selectedOptions: [],
      },
      education: {
        weight: "",
        firstChoice: [],
        secondChoice:[],
        thirdChoice: [],
        selectedOptions: [],
      },
      schools: {
        selectedOptions: [],
      },
      additionalPoints: { honor: "", multipleDegrees: "" },
      certificates: {
        preferred: [],
        weight: "",
        selectedOptions: [],
         },
    },
    required_documents: [],
    criteria_weights: {
        work_experience: 100,
        skills: 100,
        education: 100,
        additional_points: 100,
        certifications: 100
    }
  });
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch options
        const optionsResponse = await fetch("/placeHolder/dummy_options.json");
        const optionsData = await optionsResponse.json();
        setOptions(optionsData);
  
        if (!options) {
          return <div>Loading...</div>;
        }
  
        // Fetch job details
        const jobDetailsResponse = await fetch("/placeHolder/dummy_JobDetails.json");
        if (!jobDetailsResponse.ok) throw new Error("Failed to fetch dummy_JobDetails.json");
  
        const jobDetailsData = await jobDetailsResponse.json();
        console.log("Fetched dummy_JobDetails:", jobDetailsData);
        setDummyJobDetails(jobDetailsData);
  
        // Initialize localStorage only if empty
        if (!localStorage.getItem("dummy_JobDetails")) {
          localStorage.setItem("dummy_JobDetails", JSON.stringify(jobDetailsData));
        }
  
        // Load draft from localStorage if it exists
        const draftJob = localStorage.getItem("draft_job");
        if (draftJob) {
          console.log("Draft job loaded:", JSON.parse(draftJob));
          setFormData(JSON.parse(draftJob));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
  
    // Retrieve existing jobs
    const existingJobs = JSON.parse(localStorage.getItem("dummy_JobDetails")) || [];
    const jobToSave = {
      ...formData,
    };
  
    // Save new job details
    const updatedJobs = saveJobDetails(jobToSave, existingJobs);
  
    // Update localStorage with the new jobs
    localStorage.setItem("dummy_JobDetails", JSON.stringify(updatedJobs));
    router.push("/COMPANY/JobSummary");
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);
  
    // Save draft to localStorage
    localStorage.setItem("draft_job", JSON.stringify(updatedFormData));
  };
  
const handleMultiSelectChange = (category, field, option) => {
  setFormData((prev) => {
    const selectedOptions = prev.criteria[category][field] || [];
    const isSelected = selectedOptions.includes(option);
    const updatedOptions = isSelected
      ? selectedOptions.filter((item) => item !== option) // Remove if already selected
      : [...selectedOptions, option]; // Add if not selected

    return {
      ...prev,
      criteria: {
        ...prev.criteria,
        [category]: {
          ...prev.criteria[category],
          [field]: updatedOptions,
        },
      },
    };
  });
};

  const handleCriteriaChange = (field, subField, value) => {
    setFormData((prev) => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [field]: {
          ...prev.criteria[field],
          [subField]: value,
        },
      },
    }));
  };
  

  const handleDocumentChange = (e, doc) => {
    const isChecked = e.target.checked;
  
    setFormData((prevFormData) => {
      const updatedDocuments = isChecked
        ? [...prevFormData.required_documents, doc] // Add document if checked
        : prevFormData.required_documents.filter((item) => item !== doc); // Remove document if unchecked
  
      return {
        ...prevFormData,
        required_documents: updatedDocuments,
      };
    });
  };
  

  // Get today's date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div>
      <CompanyHeader />
      <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto">
        <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary">Settings</h1>
        <div className="pb-8">
          <div className="flex pt-2 pb-2">
            <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
              <div className="relative h-1 rounded-full transition-all duration-300 bg-primary" style={{ width: "66.66%" }}></div>
            </div>
          </div>
          <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-5">
            Fill out all required job hiring details.
          </p>
          <form onSubmit={handleSettingsSubmit} className="flex gap-6">
            {/* Required Documents */}
            <div className="w-1/3 flex flex-col gap-6 sticky top-20 h-max">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold text-primary mb-2">Required Documents</h2>
                <p className="text-sm text-fontcolor mt-1 mb-4">Please make sure to upload all the required documents before the deadline.</p>
                {["Resume", "Educational Documents", "Work Experience Documents", "Certification Documents"].map((doc, index) => (
                  <label key={index} className="flex items-center space-x-2 mb-2">
                    <input type="checkbox" name="required_documents" value={doc} onChange={(e) => handleDocumentChange(e, doc)} className="w-4 h-4 border border-gray-300 rounded text-black"/>
                    <span className="text-fontcolor text-sm">{doc}</span>
                  </label>
                ))}
              </div>

              {/* Date of Deadline */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold text-primary mb-2">Date of Deadline</h2>
                <p className="text-sm text-fontcolor mt-1 mb-4">Select the deadline date for submitting the required documents.</p>
                <input type="date" name="application_deadline" value={formData.application_deadline} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-fontcolor"min={currentDate}/>
              </div>
            </div>
            
                 {/* Settings */}
                <div className="w-2/3 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-primary mb-4">Criteria of Scoring</h2>
                    <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded text-fontcolor" />
                      <label className="ml-2 block text-sm font-semibold text-primary">Work Experience</label>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-fontcolor mr-2">Weight</span>
                      <input
                        type="text"
                        value={formData.criteria?.workExperience?.weight || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value) && Number(value) <= 100) {
                            handleCriteriaChange("workExperience", "weight", value); // Pass the actual value
                          }
                        }}
                        className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-fontcolor text-center"
                      />
                    </div>
                  </div>


                {/* Work Experience Multi-Select */}
                <div className="mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-fontcolor mb-1">
                      Directly Relevant <span className="font-medium text-xsmall"> (Put roles that are exactly alike or have equal importance for the position)
                      </span>
                    </label>
                    <div 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between" 
                      onClick={() => setDropdownOpen({ ...dropdownOpen, directly: !dropdownOpen.directly })}
                    >
                      <span>
                        {formData.criteria.workExperience.directlyRelevant?.length > 0
                          ? formData.criteria.workExperience.directlyRelevant.join(", ")
                          : "Select Directly Relevant"}
                      </span>
                      <FaChevronDown className={`ml-2 transform ${dropdownOpen.directly ? "rotate-180" : "rotate-0"} transition-transform`} />
                    </div>

                    {dropdownOpen.directly && (
                      <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                        <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                          <input type="text"  placeholder="Search options..." value={searchTerm.directly || ""} onChange={(e) => setSearchTerm({ ...searchTerm, directly: e.target.value })}  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"/>
                        </div>
                        {options.workExperience
                          .filter((option) => option.toLowerCase().includes((searchTerm.directly || "").toLowerCase()))
                          .map((option, index) => (
                            <label key={index} className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                value={option}
                                checked={formData.criteria.workExperience.directlyRelevant?.includes(option)}
                                onChange={() => handleMultiSelectChange("workExperience", "directlyRelevant", option)}
                                className="ml-5 w-5 h-5"
                              />
                              <span className="text-medium ml-5">{option}</span>
                            </label>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Highly Relevant Multi-Select */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-fontcolor mb-1">
                    Highly Relevant <span className="font-medium text-xsmall">  (Put roles with significant overlap in core responsibilities)
                    </span>
                  </label>
                  <div 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between" 
                    onClick={() => setDropdownOpen({ ...dropdownOpen, highly: !dropdownOpen.highly })}
                  >
                    <span>
                      {formData.criteria.workExperience.highlyRelevant?.length > 0
                        ? formData.criteria.workExperience.highlyRelevant.join(", ")
                        : "Select Highly Relevant"}
                    </span>
                    <FaChevronDown className={`ml-2 transform ${dropdownOpen.highly ? "rotate-180" : "rotate-0"} transition-transform`} />
                  </div>

                  {dropdownOpen.highly && (
                    <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                      <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                        <input 
                          type="text" 
                          placeholder="Search options..." 
                          value={searchTerm.highly || ""} 
                          onChange={(e) => setSearchTerm({ ...searchTerm, highly: e.target.value })} 
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                      {options.workExperience
                        .filter((option) => option.toLowerCase().includes((searchTerm.highly || "").toLowerCase()))
                        .map((option, index) => (
                          <label key={index} className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer">
                            <input
                              type="checkbox"
                              value={option}
                              checked={formData.criteria.workExperience.highlyRelevant?.includes(option)}
                              onChange={() => handleMultiSelectChange("workExperience", "highlyRelevant", option)}
                              className="ml-5 w-5 h-5"
                            />
                            <span className="text-medium ml-5">{option}</span>
                          </label>
                        ))}
                    </div>
                  )}
                </div>

                {/* Moderately Relevant Multi-Select */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-fontcolor mb-1">
                    Moderately Relevant
                    <span className="font-medium text-xsmall">
                      (Put roles in the same domain with some transferable skills)
                    </span>
                  </label>
                  <div 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between" 
                    onClick={() => setDropdownOpen({ ...dropdownOpen, moderately: !dropdownOpen.moderately })}
                  >
                    <span>
                      {formData.criteria.workExperience.moderatelyRelevant?.length > 0
                        ? formData.criteria.workExperience.moderatelyRelevant.join(", ")
                        : "Select Moderately Relevant"}
                    </span>
                    <FaChevronDown className={`ml-2 transform ${dropdownOpen.moderately ? "rotate-180" : "rotate-0"} transition-transform`} />
                  </div>

                  {dropdownOpen.moderately && (
                    <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                      <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                        <input 
                          type="text" 
                          placeholder="Search options..." 
                          value={searchTerm.moderately || ""} 
                          onChange={(e) => setSearchTerm({ ...searchTerm, moderately: e.target.value })} 
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                      {options.workExperience
                        .filter((option) => option.toLowerCase().includes((searchTerm.moderately || "").toLowerCase()))
                        .map((option, index) => (
                          <label key={index} className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer">
                            <input
                              type="checkbox"
                              value={option}
                              checked={formData.criteria.workExperience.moderatelyRelevant?.includes(option)}
                              onChange={() => handleMultiSelectChange("workExperience", "moderatelyRelevant", option)}
                              className="ml-5 w-5 h-5"
                            />
                            <span className="text-medium ml-5">{option}</span>
                          </label>
                        ))}
                    </div>
                  )}
                </div>

                    {/* Skills Section */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 border border-gray-300 rounded text-fontcolor"
                            checked={formData.criteria.skills.enabled} // Ensuring checkbox state is controlled
                            onChange={() => handleCriteriaChange("skills", "enabled", !formData.criteria.skills.enabled)} // Toggle the checkbox state
                          />
                          <label className="ml-2 block text-sm font-semibold text-primary">Skills</label>
                        </div>
                        <div className="flex items-center">                                
                        <span className="text-sm font-semibold text-fontcolor mr-2">Weight</span>
                        <input
                          type="text" 
                          value={formData.criteria.skills.weight || ""} 
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && Number(value) <= 100) {
                              handleCriteriaChange("skills", "weight", value);
                            }
                          }}
                          className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-fontcolor text-center"
                        />
                      </div>

                      </div>
                    {/* Primary Skills Multi-Select */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-fontcolor mb-1">
                        Primary Skills
                        <span className="font-medium text-xsmall">
                           (Put roles with the most relevant skills and experience)
                        </span>
                      </label>
                      <div 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between" 
                        onClick={() => setDropdownOpen({ ...dropdownOpen, primary: !dropdownOpen.primary })}
                      >
                        <span>
                          {formData.criteria.skills.primarySkills?.length > 0
                            ? formData.criteria.skills.primarySkills.join(", ")
                            : "Select Primary Skills"}
                        </span>
                        <FaChevronDown className={`ml-2 transform ${dropdownOpen.primary ? "rotate-180" : "rotate-0"} transition-transform`} />
                      </div>

                      {dropdownOpen.primary && (
                        <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                          <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                            <input 
                              type="text" 
                              placeholder="Search options..." 
                              value={searchTerm.primary || ""} 
                              onChange={(e) => setSearchTerm({ ...searchTerm, primary: e.target.value })} 
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                          </div>
                          {options.skills
                            .filter((option) => option.toLowerCase().includes((searchTerm.primary || "").toLowerCase()))
                            .map((option, index) => (
                              <label key={index} className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={option}
                                  checked={formData.criteria.skills.primarySkills?.includes(option)}
                                  onChange={() => handleMultiSelectChange("skills", "primarySkills", option)}
                                  className="ml-5 w-5 h-5"
                                />
                                <span className="text-medium ml-5">{option}</span>
                              </label>
                            ))}
                        </div>
                      )}
                    </div>


                    {/* Secondary Skills Multi-Select */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-fontcolor mb-1">
                        Secondary Skills
                        <span className="font-medium text-xsmall">
                         (Put important skills that are frequently used but not absolutely essential)
                        </span>
                      </label>
                      <div 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between" 
                        onClick={() => setDropdownOpen({ ...dropdownOpen, secondary: !dropdownOpen.secondary })}
                      >
                        <span>
                          {formData.criteria.skills.secondarySkills?.length > 0
                            ? formData.criteria.skills.secondarySkills.join(", ")
                            : "Select Secondary Skills"}
                        </span>
                        <FaChevronDown className={`ml-2 transform ${dropdownOpen.secondary ? "rotate-180" : "rotate-0"} transition-transform`} />
                      </div>

                      {dropdownOpen.secondary && (
                        <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                          <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                            <input 
                              type="text" 
                              placeholder="Search options..." 
                              value={searchTerm.secondary || ""} 
                              onChange={(e) => setSearchTerm({ ...searchTerm, secondary: e.target.value })} 
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                          </div>
                          {options.skills
                            .filter((option) => option.toLowerCase().includes((searchTerm.secondary || "").toLowerCase()))
                            .map((option, index) => (
                              <label key={index} className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={option}
                                  checked={formData.criteria.skills.secondarySkills?.includes(option)}
                                  onChange={() => handleMultiSelectChange("skills", "secondarySkills", option)}
                                  className="ml-5 w-5 h-5"
                                />
                                <span className="text-medium ml-5">{option}</span>
                              </label>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Additional Skills Multi-Select */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-fontcolor mb-1">
                        Additional Skills
                        <span className="font-medium text-xsmall">
                         (nice-to-have skills that would give a candidate an edge but aren't necessary for the core job functions)
                        </span>
                      </label>
                      <div 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between" 
                        onClick={() => setDropdownOpen({ ...dropdownOpen, additional: !dropdownOpen.additional })}
                      >
                        <span>
                          {formData.criteria.skills.additionalSkills?.length > 0
                            ? formData.criteria.skills.additionalSkills.join(", ")
                            : "Select Additional Skills"}
                        </span>
                        <FaChevronDown className={`ml-2 transform ${dropdownOpen.additional ? "rotate-180" : "rotate-0"} transition-transform`} />
                      </div>

                      {dropdownOpen.additional && (
                        <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                          <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                            <input 
                              type="text" 
                              placeholder="Search options..." 
                              value={searchTerm.additional || ""} 
                              onChange={(e) => setSearchTerm({ ...searchTerm, additional: e.target.value })} 
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                          </div>
                          {options.skills
                            .filter((option) => option.toLowerCase().includes((searchTerm.additional || "").toLowerCase()))
                            .map((option, index) => (
                              <label key={index} className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={option}
                                  checked={formData.criteria.skills.additionalSkills?.includes(option)}
                                  onChange={() => handleMultiSelectChange("skills", "additionalSkills", option)}
                                  className="ml-5 w-5 h-5"
                                />
                                <span className="text-medium ml-5">{option}</span>
                              </label>
                            ))}
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 border border-gray-300 rounded text-fontcolor"
                          />
                          <label className="ml-2 block text-sm font-semibold text-primary">Education</label>
                        </div>
                        <div className="flex items-center">
                        <span className="text-sm font-semibold text-fontcolor mr-2">Weight</span>
                        <input
                          type="text"
                          value={formData.criteria.education.weight || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only numbers and validate the range
                            if (/^\d*$/.test(value) && Number(value) <= 100) {
                              handleCriteriaChange("education", "weight", value);
                            }
                          }}
                          className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-black text-center"
                        />
                      </div>
                      </div>
                      {/* 1st Choice Field of Study */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-fontcolor mb-1">
                          1st Choice Field of Study
                          <span className="font-medium text-xsmall">
                            (Put the most directly relevant fields of study for the position)
                          </span>
                        </label>
                        <div
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between"
                          onClick={() => setDropdownOpen({ ...dropdownOpen, firstChoice: !dropdownOpen.firstChoice })}
                        >
                          <span>
                            {formData.criteria.education.firstChoice || "Select 1st Choice Field of Study"}
                          </span>
                          <FaChevronDown
                            className={`ml-2 transform ${dropdownOpen.firstChoice ? "rotate-180" : "rotate-0"} transition-transform`}
                          />
                        </div>

                        {dropdownOpen.firstChoice && (
                          <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                            <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                              <input
                                type="text"
                                placeholder="Search options..."
                                value={searchTerm.firstChoice || ""}
                                onChange={(e) => setSearchTerm({ ...searchTerm, firstChoice: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                              />
                            </div>
                            {options.education
                              .filter((option) => option.toLowerCase().includes((searchTerm.firstChoice || "").toLowerCase()))
                              .map((option, index) => (
                                <label key={index} className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer">
                                  <input
                                    type="radio"
                                    value={option}
                                    checked={formData.criteria.education.firstChoice === option}
                                    onChange={() => handleCriteriaChange("education", "firstChoice", option)}
                                    className="ml-5 w-5 h-5"
                                  />
                                  <span className="text-medium ml-5">{option}</span>
                                </label>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* 2nd Choice Field of Study */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-fontcolor mb-1">
                          2nd Choice Field of Study
                          <span className="font-medium text-xsmall">
                            (Put closely related fields that have significant overlap with the job requirements)
                          </span>
                        </label>
                        <div
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between"
                          onClick={() => setDropdownOpen({ ...dropdownOpen, secondChoice: !dropdownOpen.secondChoice })}
                        >
                          <span>
                            {formData.criteria.education.secondChoice || "Select 2nd Choice Field of Study"}
                          </span>
                          <FaChevronDown
                            className={`ml-2 transform ${dropdownOpen.secondChoice ? "rotate-180" : "rotate-0"} transition-transform`}
                          />
                        </div>

                        {dropdownOpen.secondChoice && (
                          <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                            <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                              <input
                                type="text"
                                placeholder="Search options..."
                                value={searchTerm.secondChoice || ""}
                                onChange={(e) => setSearchTerm({ ...searchTerm, secondChoice: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                              />
                            </div>
                            {options.education
                              .filter((option) => option.toLowerCase().includes((searchTerm.secondChoice || "").toLowerCase()))
                              .map((option, index) => (
                                <label key={index} className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer">
                                  <input
                                    type="radio"
                                    value={option}
                                    checked={formData.criteria.education.secondChoice === option}
                                    onChange={() => handleCriteriaChange("education", "secondChoice", option)}
                                    className="ml-5 w-5 h-5"
                                  />
                                  <span className="text-medium ml-5">{option}</span>
                                </label>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* 3rd Choice Field of Study */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-fontcolor mb-1">
                          3rd Choice Field of Study
                          <span className="font-medium text-xsmall">
                            (Put fields that have some relevance or provide useful background knowledge)
                          </span>
                        </label>
                        <div
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between"
                          onClick={() => setDropdownOpen({ ...dropdownOpen, thirdChoice: !dropdownOpen.thirdChoice })}
                        >
                          <span>
                            {formData.criteria.education.thirdChoice || "Select 3rd Choice Field of Study"}
                          </span>
                          <FaChevronDown
                            className={`ml-2 transform ${dropdownOpen.thirdChoice ? "rotate-180" : "rotate-0"} transition-transform`}
                          />
                        </div>

                        {dropdownOpen.thirdChoice && (
                          <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                            <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                              <input
                                type="text"
                                placeholder="Search options..."
                                value={searchTerm.thirdChoice || ""}
                                onChange={(e) => setSearchTerm({ ...searchTerm, thirdChoice: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                              />
                            </div>
                            {options.education
                              .filter((option) => option.toLowerCase().includes((searchTerm.thirdChoice || "").toLowerCase()))
                              .map((option, index) => (
                                <label key={index} className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer">
                                  <input
                                    type="radio"
                                    value={option}
                                    checked={formData.criteria.education.thirdChoice === option}
                                    onChange={() => handleCriteriaChange("education", "thirdChoice", option)}
                                    className="ml-5 w-5 h-5"
                                  />
                                  <span className="text-medium ml-5">{option}</span>
                                </label>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                    </div>

                    <label className="block text-sm font-semibold text-primary mb-2">Additional Points</label>
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded text-black mr-2"
                      />
                      <label className="text-sm text-fontcolor font-semibold">
                        School Preference
                      </label>
                    </div>

                    {/* School Preference */}
                    <div className="mb-4">
                    <label className="block text-sm font-semibold text-fontcolor mb-1">
                      School Preference
                      <span className="font-medium text-xsmall">
                        (Put any preferred institutions, if applicable)
                      </span>
                    </label>
                    <div
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between"
                      onClick={() =>
                        setDropdownOpen({
                          ...dropdownOpen,
                          schoolPreference: !dropdownOpen.schoolPreference,
                        })
                      }
                    >
                      <span>
                        {formData.criteria.schools.selectedOptions.join(", ") || "Select School Preference"}
                      </span>
                      <FaChevronDown
                        className={`ml-2 transform ${
                          dropdownOpen.schoolPreference ? "rotate-180" : "rotate-0"
                        } transition-transform`}
                      />
                    </div>
                    {dropdownOpen.schoolPreference && (
                      <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                        <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                          <input
                            type="text"
                            placeholder="Search options..."
                            value={searchTerm.schoolPreference || ""}
                            onChange={(e) => setSearchTerm({ ...searchTerm, schoolPreference: e.target.value })} 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          />
                        </div>
                        {(
                          options.schools
                          .filter((option) => option.toLowerCase().includes((searchTerm.schoolPreference || "").toLowerCase()))
                            .map((school, index) => (
                              <label
                                key={index}
                                className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  value={school}
                                  checked={formData.criteria.schools.selectedOptions.includes(
                                    school
                                  )}
                                  onChange={(e) => {
                                    const updatedSchools = e.target.checked
                                      ? [...formData.criteria.schools.selectedOptions, school]
                                      : formData.schools.schools.selectedOptions.filter(
                                          (s) => s !== school
                                        );
                                    setFormData((prev) => ({
                                      ...prev,
                                      criteria: {
                                        ...prev.criteria,
                                        schools: {
                                          ...prev.criteria.schools,
                                          selectedOptions: updatedSchools,
                                        },
                                      },
                                    }));
                                  }}
                                  className="ml-5 w-5 h-5"
                                />
                                <span className="text-medium ml-5">{school}</span>
                              </label>
                            ))
                        )}
                      </div>
                    )}
                  </div>

                        <div className="flex items-center mb-4">
                            <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded text-black mr-2" />
                            <label className="text-sm text-fontcolor">Honors</label>
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded text-black mr-2" />
                            <label className="text-sm text-fontcolor">Multiple Degrees</label>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded text-black" />
                                <label className="ml-2 block text-sm font-semibold text-primary"> Certificates</label>
                            </div>  
                            <div className="flex items-center">
                            <span className="text-sm font-semibold text-fontcolor mr-2">Weight</span>
                            <input
                              type="text"
                              value={formData.criteria.certificates.weight || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow only numbers and validate the range
                                if (/^\d*$/.test(value) && Number(value) <= 100) {
                                  handleCriteriaChange("certificates", "weight", value);
                                }
                              }}
                              className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-black text-center"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                        <label className="block text-sm font-semibold text-fontcolor mb-1">
                          Certificate Preference
                          <span className="font-medium text-xsmall">
                          (Select any preferred certificates, if applicable)</span>
                        </label>
                      <div 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between" 
                        onClick={() => setDropdownOpen({ ...dropdownOpen, certificatePreference: !dropdownOpen.certificatePreference })}
                      >
                        <span>
                          {formData.criteria.certificates.preferred?.length > 0
                            ? formData.criteria.certificates.preferred.join(", ")
                            : "Select Certificate Preference"}
                        </span>
                        <FaChevronDown className={`ml-2 transform ${dropdownOpen.secondary ? "rotate-180" : "rotate-0"} transition-transform`} />
                      </div>

                      {dropdownOpen.certificatePreference  && (
                        <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                          <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                            <input 
                              type="text" 
                              placeholder="Search options..." 
                              value={searchTerm.certificatePreference  || ""} 
                              onChange={(e) => setSearchTerm({ ...searchTerm, certificatePreference: e.target.value })} 
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                          </div>
                          {options.certs
                            .filter((option) => option.toLowerCase().includes((searchTerm.certificatePreference || "").toLowerCase()))
                            .map((option, index) => (
                              <label key={index} className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={option}
                                  checked={formData.criteria.certificates.preferred?.includes(option)}
                                  onChange={() => handleMultiSelectChange("certificates", "preferred", option)}
                                  className="ml-5 w-5 h-5"
                                />
                                <span className="text-medium ml-5">{option}</span>
                              </label>
                            ))}
                        </div>
                      )}
                    </div>
                 
                </div>
                <div className="mb-6">
                  <p className="text-sm font-semibold text-primary mb-2">Weight of Criteria</p>
                  <div className="space-y-3">
                    {[
                      "Customize Criteria Weight Percentage",
                      "Default Weight Percentage",
                      "Experienced-Focused",
                      "Education-Focused",
                      "Skills-Focused",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input type="radio" name="weightOfCriteria" value={item} checked={formData.weightOfCriteria === item} onChange={handleInputChange}className="h-4 w-4 text-black focus:ring focus:ring-primary rounded-full" />
                        <label htmlFor={`criteria-${index}`} className="text-sm text-fontcolor font-medium">
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                    <div className="mb-6">
                        <label htmlFor="verification-option"className="block text-sm font-semibold text-primary mb-2" > Verification Option</label>
                        <select  className=" border border-gray-300 rounded-lg px-4 py-2 text-sm text-fontcolor" name="verification_option" value={formData.verification_option} onChange={handleInputChange}>
                            <option value="Score Unverified Credential Fully" >Score Unverified Credential Fully</option>
                            <option value="Score Unverified Credential 50%" >Score Unverified Credential 50%</option>
                            <option value="Ignore Unverified Credentials" >Ignore Unverified Credentials</option>
                        </select>
                    </div>
                    <div className="flex justify-between mt-8">          
                        <button type="button" className="button2 flex items-center justify-center">
                            <Link href="/COMPANY/CreateJob" className="ml-auto">
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

                        <button type="button" onClick={(e) => handleSettingsSubmit(e, 'draft')}  className="button1 flex items-center justify-center">
                            <Link href="/COMPANY/JobSummary" className="flex items-center space-x-2 ml-auto">
                                <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Continue</p>
                                <Image 
                                src="/Arrow Right.svg" 
                                width={23} 
                                height={10} 
                                alt="Continue Icon" 
                                />
                            </Link>
                        </button>
                    </div>
                </div>
            </form>
            </div>
            </div>
        <GeneralFooter/>
    </div>
    );
}