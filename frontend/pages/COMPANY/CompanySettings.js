import { useState, useEffect } from "react";
import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from "next/image";
import { FaChevronDown } from 'react-icons/fa';


export default function CompanySettings() {
    const [options, setOptions] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    const [formData, setFormData] = useState({
    requiredDocuments: [],
    dateOfDeadline: "",
    criteria: {
        workExperience: {
            weight: "",
            selectedOptions: [],
        },
        skills: {
            primary: [],
            secondary: [],
            additional: [],
            weight: "",
        },
        education: {
            firstChoice: [],
            secondChoice: [],
            thirdChoice: [],
            weight: "",
        },
        additionalPoints: { location: "", multipleDegrees: "" },
        certificates: { preferred: "", weight: "" },
    },
    weightOfCriteria: "Custom",
    });

    useEffect(() => {
        fetch("/placeHolder/dummy_options.json")
        .then((response) => response.json())
        .then((data) => setOptions(data))
        .catch((error) => console.error("Error fetching options:", error));
    }, []);
        
    if (!options) {
            return <div>Loading...</div>;
    }


    const handleInputChange = (e) => {
    const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
        };
    
        const handleCriteriaChange = (field, subField, value) => {
        setFormData((prev) => ({
        ...prev,
        criteria: {
            ...prev.criteria,
            [field]: { ...prev.criteria[field], [subField]: value },
        },
        }));
    };

    const handleMultiSelectChange = (field, subField, value) => {
        setFormData((prev) => {
            const updatedOptions = prev.criteria[field][subField].includes(value)
                ? prev.criteria[field][subField].filter((item) => item !== value)
                : [...prev.criteria[field][subField], value];
            return {
                ...prev,
                criteria: {
                    ...prev.criteria,
                    [field]: { ...prev.criteria[field], [subField]: updatedOptions },
                },
            };
        });
    };

    return (
        <div>
        <CompanyHeader/>
            <div className=" lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto">
            <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary "> Settings </h1>
            <div className="pb-8">
            <div className="flex pt-2 pb-2">
                <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                <div className="relative h-1 rounded-full transition-all duration-300 bg-primary" style={{ width: "66.66%" }}></div>
                </div>
            </div>
            <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-5">Fill out all required job hiring details.</p>
            <form className="flex gap-6">
                {/*  Required Docu */}
                <div className=" w-1/3 flex flex-col gap-6 sticky top-20 h-max">
                    <div className="bg-white shadow-md rounded-lg p-6 ">
                        <h2 className="text-lg font-semibold text-primary mb-2">Required Documents</h2>
                        <p className="text-sm text-fontcolor mt-1 mb-4">Please make sure to upload all the required documents before the deadline.</p> 
                        {["Resume", "Transcript of Records (TOR)", "Certificate of Employment", "Good Moral/Behavior Certificate",].map((doc, index) => (
                            <label key={index} className="flex items-center space-x-2 mb-2">
                            <input type="checkbox" value={doc} onChange={(e) => {  const docs = [...formData.requiredDocuments]; if (e.target.checked) docs.push(doc);  else docs.splice(docs.indexOf(doc), 1);setFormData((prev) => ({ ...prev, requiredDocuments: docs, })); }}
                                className="w-4 h-4 border border-gray-300 rounded text-black"/> <span className="text-fontcolor text-sm">{doc}</span>
                            </label>
                        ))}
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-primary mb-2">Date of Deadline</h2> 
                        <p className="text-sm text-fontcolor mt-1 mb-4">Select the deadline date for submitting the required documents.</p> 
                        <input type="date" name="dateOfDeadline" value={formData.dateOfDeadline} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-fontcolor"/>
                    </div>
                </div>
             
                
                 {/* Settings */}
                <div className="w-2/3 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-primary mb-4">Criteria of Scoring</h2>

                    <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded text-fontcolor"/>
                        <label className="ml-2 block text-sm font-semibold text-primary">  Work Experience </label>
                        </div>
                        <div className="flex items-center">
                        <span className="text-sm font-semibold text-fontcolor mr-2">Weight</span>
                        <input type="text"  value={formData.criteria.workExperience.weight || ""}onChange={(e) => handleCriteriaChange("workExperience", "weight", e.target.value) } className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-fontcolor text-center"/>
                        </div>
                    </div>

                   {/* Work Experience Multi-Select */}
                   <div className="mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-fontcolor mb-1">Directly Relevant <span className="font-medium text-xsmall">(Put roles that are exactly alike or have equal importance for the position)</span> </label>
                            <div className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between"  onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <span>
                                    {formData.criteria.workExperience.selectedOptions.length > 0
                                    ? formData.criteria.workExperience.selectedOptions.join(", ")
                                    : "Select Directly Relevant"}
                                </span>
                                <FaChevronDown className={`ml-2 transform ${ dropdownOpen ? "rotate-180" : "rotate-0"  } transition-transform`} />
                            </div>

                            {dropdownOpen && (
                            <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                {/* Search Input */}
                                <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                    <input type="text" placeholder="Search options..." value={searchTerm}   onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                </div>
                                {/* Filtered Options */}
                                {options.workExperience .filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase())) .map((option, index) => (
                                    <label key={index}  className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer" >
                                        <input  type="checkbox" value={option} checked={formData.criteria.workExperience.selectedOptions.includes( option )} onChange={() => handleMultiSelectChange("workExperience", "selectedOptions", option) } className="ml-5 w-5 h-5"/>
                                        <span className="text-medium ml-5">{option}</span>
                                    </label>
                                ))}
                            </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-fontcolor mb-1">
                        Highly Relevant<span className="font-medium text-xsmall"> (Put roles with significant overlap in core responsibilities)</span>
                        </label>
                        <select value={formData.criteria.workExperience.highlyRelevant || ""} onChange={(e) => handleCriteriaChange("workExperience", "highlyRelevant", e.target.value) }className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black">
                        <option value="" disabled></option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-fontcolor mb-1"> Moderately Relevant
                        <span className="font-medium text-xsmall"> (Put roles in the same domain with some transferable skills)</span>
                        </label>
                        <select value={formData.criteria.workExperience.moderatelyRelevant || ""}onChange={(e) => handleCriteriaChange("workExperience", "moderatelyRelevant", e.target.value) }className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black" >
                        <option value="" disabled></option>
                        </select>
                    </div>
                    </div>

                    <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded text-fontcolor" />
                        <label className="ml-2 block text-sm font-semibold text-primary">Skills</label>
                        </div>
                        <div className="flex items-center">
                        <span className="text-sm font-semibold text-fontcolor mr-2">Weight</span>
                        <input type="text" value={formData.criteria.skills.weight || ""} onChange={(e) => handleCriteriaChange("skills", "weight", e.target.value)} className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-fontcolor text-center"/>
                        </div>
                    </div>
                        {[ 
                        { label: "Primary Skills (Put essential skills that are crucial for the job)", key: "primary" },
                        { label: "Secondary Skills (Put important skills that are frequently used but not absolutely essential)", key: "secondary" },
                        { label: "Additional Skills (Nice-to-have skills that would give a candidate an edge but aren’t necessary for the core job functions)", key: "additional" },
                        ].map((skill, index) => (
                        <div key={index} className="mb-4">
                        <label className="block text-sm font-semibold text-fontcolor mb-1">{skill.label.split('(')[0]}<span className="font-medium text-xsmall">({skill.label.split('(')[1]}</span></label>
                        <select value={formData.criteria.skills[skill.key] || ""} onChange={(e) => handleCriteriaChange("skills", skill.key, e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black">
                            <option value="" disabled></option>
                        </select>
                        </div>
                    ))}
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <input type="checkbox"  className="w-4 h-4 border border-gray-300 rounded text-fontcolor" />
                                <label className="ml-2 block text-sm font-semibold text-primary">Education </label>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm font-semibold text-fontcolor mr-2">Weight</span>
                                <input type="text" value={formData.criteria.education.weight || ""} onChange={(e) => handleCriteriaChange("education", "weight", e.target.value)} className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-black text-center"/>
                            </div>
                        </div>
                        {[{
                            label: "1st Choice Field of Study (Put the most directly relevant fields of study for the position)",
                            key: "firstChoice"
                        }, {
                            label: "2nd Choice Field of Study (Put closely related fields that have significant overlap with the job requirements)",
                            key: "secondChoice"
                        }, {
                            label: "3rd Choice Field of Study (Put fields that have some relevance or provide useful background knowledge)",
                            key: "thirdChoice"
                        }].map((edu, index) => (
                        <div key={index} className="mb-4">
                            <label className="block text-sm font-semibold text-fontcolor mb-1">
                                {edu.label.split('(')[0]}<span className="font-medium text-xsmall">({edu.label.split('(')[1]}</span>
                            </label>
                            <select value={formData.criteria.education[edu.key] || ""}  onChange={(e) => handleCriteriaChange("education", edu.key, e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black"></select>
                        </div>
                        ))}

                        <label className="block text-sm font-semibold text-primary mb-2"> Additional Points</label>
                        <div className="flex items-center mb-4">
                            <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded text-black mr-2"/>
                            <label className="text-sm text-fontcolor font-semibold">School Preference <span className="font-medium text-xsmall"> (Put any preferred institutions, if applicable)</span></label> 
                        </div>
                        <select value={formData.criteria.education.schoolPreference || ""}onChange={(e) => handleCriteriaChange("education", "schoolPreference", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black mb-4" >
                        </select>

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
                                <input type="text" value={formData.criteria.certificates.weight || ""} onChange={(e) => handleCriteriaChange("certificates", "weight", e.target.value)} className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-black text-center"/>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-fontcolor mb-1"> Institution Preference Bonus{" "}<span className="font-medium text-xsmall"> (Put any preferred certification provider, if applicable)</span></label>
                            <select value={formData.criteria.certificates.preferred || ""} onChange={(e) => handleCriteriaChange("certificates", "preferred", e.target.value)}className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black" >
                                <option value="" disabled></option>
                            </select>
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
                                <input type="radio" name="criteria-weight" id={`criteria-${index}`}className="h-4 w-4 text-black focus:ring focus:ring-primary rounded-full"/>
                                <label htmlFor={`criteria-${index}`} className="text-sm text-fontcolor font-medium">
                                {item}
                                </label>
                            </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="verification-option"className="block text-sm font-semibold text-primary mb-2" > Verification Option</label>
                        <select id="verification-option"  className="w- border border-gray-300 rounded-lg px-4 py-2 text-sm text-fontcolor"value={formData.criteria.verification || ""} onChange={(e) => handleCriteriaChange("criteria", "verification", e.target.value)} >
                            <option value="" disabled></option>
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

                        <button type="button"  className="button1 flex items-center justify-center">
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
