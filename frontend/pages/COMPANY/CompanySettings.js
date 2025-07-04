import { useState, useEffect } from "react";
import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";
import { initialFormData, mergeData } from "@/constants/companySettingForm";
import {
    validateFormData,
    handleInputChange,
} from "../utils/companySettingsUtils";
import { getCookie } from "../utils/cookieUtils";
import useFetchOptions from "@/hooks/companySettingsHooks";
import { useFormData } from "@/hooks/companySettingsHooks";
import { toast } from 'react-toastify';
import ToastWrapper from "@/components/ToastWrapper";

export default function CompanySettings() {
    const [options, setOptions] = useFetchOptions();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
    const [formData, setFormData] = useState(initialFormData);

    const getFilteredOptions = (currentCategory, currentField, term = "") => {
        const search = term.toLowerCase();
    
        const allSelectedOptions = new Set([
            ...formData.criteria.workExperience.directlyRelevant,
            ...formData.criteria.workExperience.highlyRelevant,
            ...formData.criteria.workExperience.moderatelyRelevant,
            ...formData.criteria.skills.primarySkills,
            ...formData.criteria.skills.secondarySkills,
            ...formData.criteria.skills.additionalSkills,
            ...(formData.criteria.education.firstChoice ? [formData.criteria.education.firstChoice] : []),
            ...(formData.criteria.education.secondChoice ? [formData.criteria.education.secondChoice] : []),
            ...(formData.criteria.education.thirdChoice ? [formData.criteria.education.thirdChoice] : []),
            ...formData.criteria.schools.schoolPreference,
            ...formData.criteria.certificates.preferred,
        ]);
    
        return options[currentCategory]
            .filter((option) => option.toLowerCase().includes(search))
            .filter((option) => 
                !allSelectedOptions.has(option) ||
                formData.criteria[currentCategory][currentField]?.includes(option)
            );
    };

    useFormData(setFormData);

    const handleSettingsSubmit = (e) => {
        if (!validateFormData(formData)) return;

        const storedData = getCookie("DRAFT_DATA");

        if (!storedData) {
            console.error("No stored data found.");
            return;
        }

        let parsedStoredData;

        try {
            parsedStoredData = JSON.parse(storedData);
        } catch (error) {
            console.error("Error parsing stored data:", error);
            return;
        }

        const mergedData = mergeData(formData, parsedStoredData);

        Cookies.set("SERIALIZED_DATA", JSON.stringify(mergedData), {
            expires: 1,
        });

        router.push("/COMPANY/JobSummary");
    };

    const onInputChange = (e) => {
        handleInputChange(e, formData, setFormData);
    };

    const handleMultiSelectChange = (category, field, option) => {
        setFormData((prev) => {
            const selectedOptions = prev.criteria[category][field] || [];
            const isSelected = selectedOptions.includes(option);
            const updatedOptions = isSelected
                ? selectedOptions.filter((item) => item !== option)
                : [...selectedOptions, option];

            const updatedFormData = {
                ...prev,
                criteria: {
                    ...prev.criteria,
                    [category]: {
                        ...prev.criteria[category],
                        [field]: updatedOptions,
                    },
                },
            };
            
            if (category === 'workExperience' && 
                (field === 'directlyRelevant' || 
                 field === 'highlyRelevant' || 
                 field === 'moderatelyRelevant')) {
                
                const relevantRoles = {
                    directly_relevant: updatedFormData.criteria.workExperience.directlyRelevant || [],
                    highly_relevant: updatedFormData.criteria.workExperience.highlyRelevant || [],
                    moderately_relevant: updatedFormData.criteria.workExperience.moderatelyRelevant || []
                };
                
                Cookies.set('RELEVANT_ROLES', JSON.stringify(relevantRoles), { expires: 7 });
            }
    
            return updatedFormData;
        });
    };

    const handleAddCustomOption = (category, field, customOption) => {
        if (!customOption.trim()) return; 
        setOptions((prev) => ({
            ...prev,
            [category]: prev[category]?.includes(customOption)
                ? prev[category]
                : [...(prev[category] || []), customOption], 
        }));
    
        handleMultiSelectChange(category, field, customOption);
    
        setSearchTerm(prev => {
            const updated = { ...prev };
            updated[field] = "";
            return updated;
        });
        
    };
    
    const handleRemoveSelectedOption = (category, field, option) => {
        setFormData((prev) => {
            const updatedOptions = prev.criteria[category][field].filter(
                (item) => item !== option
            );
            
            const updatedFormData = {
                ...prev,
                criteria: {
                    ...prev.criteria,
                    [category]: {
                        ...prev.criteria[category],
                        [field]: updatedOptions,
                    },
                },
            };
            
            if (category === 'workExperience' && 
                (field === 'directlyRelevant' || 
                 field === 'highlyRelevant' || 
                 field === 'moderatelyRelevant')) {
                
                const relevantRoles = {
                    directly_relevant: updatedFormData.criteria.workExperience.directlyRelevant || [],
                    highly_relevant: updatedFormData.criteria.workExperience.highlyRelevant || [],
                    moderately_relevant: updatedFormData.criteria.workExperience.moderatelyRelevant || []
                };
                
                Cookies.set('RELEVANT_ROLES', JSON.stringify(relevantRoles), { expires: 7 });
            }
    
            return updatedFormData;
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
                ? [...prevFormData.required_documents, doc]
                : prevFormData.required_documents.filter(
                      (item) => item !== doc
                  );

            return { ...prevFormData, required_documents: updatedDocuments };
        });
    };

    useEffect(() => {
        const relevantRolesCookie = Cookies.get("RELEVANT_ROLES");
        if (relevantRolesCookie) {
            try {
                const parsedRelevance = JSON.parse(relevantRolesCookie);
                setFormData((prev) => ({
                    ...prev,
                    criteria: {
                        ...prev.criteria,
                        workExperience: {
                            ...prev.criteria.workExperience,
                            directlyRelevant: parsedRelevance.directly_relevant || [],
                            highlyRelevant: parsedRelevance.highly_relevant || [],
                            moderatelyRelevant: parsedRelevance.moderately_relevant || [],
                        },
                    },
                }));
            } catch (err) {
                console.error("Failed to parse RELEVANT_ROLES", err);
            }
        }
    }, []);
    


    // Get today's date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split("T")[0];

    return (
        <div>
            <CompanyHeader />
            <div className="lg:pt-28 mb:pt-24 sm:pt-24 xsm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 xxsm:px-4 mx-auto">
                <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary">
                    Settings
                </h1>
                <div className="pb-8">
                    <div className="flex pt-2 pb-2">
                        <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                            <div
                                className="relative h-1 rounded-full transition-all duration-300 bg-primary"
                                style={{ width: "66.66%" }}
                            ></div>
                        </div>
                    </div>
                    <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-5">
                        Fill out all required job hiring details.
                    </p>
                    <form
                        onSubmit={handleSettingsSubmit}
                        className="flex gap-6"
                    >
                        <div className="flex lg:flex-row mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col gap-5">
                            {/* Required Documents */}
                            <div className="lg:w-1/3 md:w-1/3 sm:w-full flex flex-col gap-6 lg:sticky mb:sticky top-20 h-max">
                                <div className="bg-white shadow-md rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-primary mb-2">
                                        Required Documents
                                    </h2>
                                    <p className="text-sm text-fontcolor mt-1 mb-4">
                                        Please make sure to upload all the
                                        required documents before the deadline.
                                    </p>
                                    {[
                                        "Resume",
                                        "Educational Documents",
                                        "Work Experience Documents",
                                        "Certification Documents",
                                    ].map((doc, index) => (
                                        <label
                                            key={index}
                                            className="flex items-center space-x-2 mb-2 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                name="required_documents"
                                                value={doc}
                                                checked={formData.required_documents.includes(
                                                    doc
                                                )}
                                                onChange={(e) =>
                                                    handleDocumentChange(e, doc)
                                                }
                                                className="w-4 h-4 border border-gray-300 rounded text-black focus:ring-0 focus:outline-none"
                                            />
                                            <span className="text-fontcolor text-sm">
                                                {doc}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {/* Date of Deadline */}
                                <div className="bg-white shadow-md rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-primary mb-2">
                                        Date of Deadline
                                    </h2>
                                    <p className="text-sm text-fontcolor mt-1 mb-4">
                                        Select the deadline date for submitting
                                        the required documents.
                                    </p>
                                    <input
                                        type="date"
                                        name="application_deadline"
                                        value={formData.application_deadline}
                                        onChange={onInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-fontcolor"
                                        min={currentDate}
                                    />
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="lg:w-2/3 mb:w-2/3 sm:w-full bg-white shadow-md rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-primary mb-4">
                                    Criteria of Scoring
                                </h2>
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            {/* <input
                                            type="checkbox"
                                            className="w-4 h-4 border border-gray-300 rounded text-fontcolor"
                                        /> */}
                                            <label className="ml-2 block text-sm font-semibold text-primary">
                                                Work Experience
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-sm font-semibold text-fontcolor mr-2">
                                                Weight
                                            </span>
                                            <input
                                                type="text"
                                                value={
                                                    formData.criteria
                                                        ?.workExperience
                                                        ?.weight || ""
                                                }
                                                disabled={
                                                    formData.weight_of_criteria !==
                                                    "Customize Criteria Weight Percentage"
                                                }
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    if (
                                                        /^\d*$/.test(value) &&
                                                        Number(value) <= 100
                                                    ) {
                                                        handleCriteriaChange(
                                                            "workExperience",
                                                            "weight",
                                                            value
                                                        ); // Pass the actual value
                                                    }
                                                }}
                                                className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-fontcolor text-center"
                                            />
                                        </div>
                                    </div>

                                    {/* Work Experience Directly Relevant */}
                                    <div className="mb-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                {" "}
                                                Directly Relevant{" "}
                                                <span className="font-medium text-xsmall">
                                                    {" "}
                                                    (Put roles that are exactly
                                                    alike or have equal
                                                    importance for the position)
                                                </span>
                                            </label>

                                            <div
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                onClick={() =>
                                                    setDropdownOpen({
                                                        ...dropdownOpen,
                                                        directly:
                                                            !dropdownOpen.directly,
                                                    })
                                                }
                                            >
                                                {formData.criteria
                                                    .workExperience
                                                    .directlyRelevant?.length >
                                                0 ? (
                                                    formData.criteria.workExperience.directlyRelevant.map(
                                                        (selected, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-gray-200 px-3 py-1 rounded-md flex items-center"
                                                            >
                                                                <span className="text-sm">
                                                                    {selected}
                                                                </span>
                                                                <button
                                                                    type="button" 
                                                                    className="ml-2 text-red-600 font-extrabold"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        e.preventDefault(); 
                                                                        handleRemoveSelectedOption(
                                                                            "workExperience",
                                                                            "directlyRelevant",
                                                                            selected
                                                                        );
                                                                    }}
                                                                >
                                                                    X
                                                                </button>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <span className="text-fontcolor">
                                                        Select Directly Relevant
                                                    </span>
                                                )}
                                                <FaChevronDown
                                                    className={`ml-auto transform ${
                                                        dropdownOpen.directly
                                                            ? "rotate-180"
                                                            : "rotate-0"
                                                    } transition-transform`}
                                                />
                                            </div>

                                            {dropdownOpen.directly && (
                                                <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                                    {/* Search & Add Custom Option */}
                                                    <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                        <input
                                                            type="text"
                                                            placeholder="Search or add a new option..."
                                                            value={
                                                                searchTerm.directly ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setSearchTerm({
                                                                    ...searchTerm,
                                                                    directly:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    const input = e.target.value.trim();
                                                                    const lowerInput = input.toLowerCase();
                                                                    const existingOptions = options.workExperience.map(opt => opt.toLowerCase());
                                                            
                                                                    if (!existingOptions.includes(lowerInput) && input !== "") {
                                                                        handleAddCustomOption("workExperience", "directlyRelevant", input);
                                                                    }
                                                                }
                                                            }} 
                                                        />
                                                        {searchTerm.directly &&
                                                            getFilteredOptions("workExperience", "directlyRelevant", searchTerm.directly).length === 0 && (
                                                                <button
                                                                    className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                    onClick={() =>
                                                                        handleAddCustomOption("workExperience", "directlyRelevant", searchTerm.directly)
                                                                    }
                                                                >
                                                                    Add "{searchTerm.directly}"
                                                                </button>
                                                            )}
                                                    </div>

                                                    {/* Available Options List */}
                                                    {getFilteredOptions(
                                                        "workExperience",
                                                        "directlyRelevant", 
                                                        searchTerm.directly
                                                    ).map((option, index) => (
                                                        <label
                                                            key={index}
                                                            className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={option}
                                                                checked={formData.criteria.workExperience.directlyRelevant.includes(
                                                                    option
                                                                )}
                                                                onChange={() =>
                                                                    handleMultiSelectChange(
                                                                        "workExperience",
                                                                        "directlyRelevant",
                                                                        option
                                                                    )
                                                                }
                                                                className="ml-5 w-5 h-5"
                                                            />
                                                            <span className="text-medium ml-5">
                                                                {option}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Work Experience Highly Relevant */}
                                    <div className="mb-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                {" "}
                                                Highly Relevant{" "}
                                                <span className="font-medium text-xsmall">
                                                    {" "}
                                                    (Put roles with significant
                                                    overlap in core
                                                    responsibilities)
                                                </span>
                                            </label>

                                            <div
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                onClick={() =>
                                                    setDropdownOpen({
                                                        ...dropdownOpen,
                                                        highly: !dropdownOpen.highly,
                                                    })
                                                }
                                            >
                                                {/* Show selected options inside the input */}
                                                {formData.criteria
                                                    .workExperience
                                                    .highlyRelevant?.length >
                                                0 ? (
                                                    formData.criteria.workExperience.highlyRelevant.map(
                                                        (selected, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-gray-200 px-3 py-1 rounded-md flex items-center"
                                                            >
                                                                <span className="text-sm">
                                                                    {selected}
                                                                </span>
                                                                <button
                                                                    type="button"  
                                                                    className="ml-2 text-red-600 font-extrabold"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        e.preventDefault();
                                                                        handleRemoveSelectedOption(
                                                                            "workExperience",
                                                                            "highlyRelevant",
                                                                            selected
                                                                        );
                                                                    }}
                                                                >
                                                                    X
                                                                </button>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <span className="text-fontcolor">
                                                        Select Highly Relevant
                                                    </span>
                                                )}
                                                <FaChevronDown
                                                    className={`ml-auto transform ${
                                                        dropdownOpen.highly
                                                            ? "rotate-180"
                                                            : "rotate-0"
                                                    } transition-transform`}
                                                />
                                            </div>

                                            {dropdownOpen.highly && (
                                                <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                                    {/* Search & Add Custom Option */}
                                                    <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                        <input
                                                            type="text"
                                                            placeholder="Search or add a new option..."
                                                            value={
                                                                searchTerm.highly ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setSearchTerm({
                                                                    ...searchTerm,
                                                                    highly:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    const input = e.target.value.trim();
                                                                    const lowerInput = input.toLowerCase();
                                                                    const existingOptions = options.workExperience.map(opt => opt.toLowerCase());
                                                            
                                                                    if (!existingOptions.includes(lowerInput) && input !== "") {
                                                                        handleAddCustomOption("workExperience", "highlyRelevant", input);
                                                                    }
                                                                }
                                                            }} 
                                                        />
                                                        {searchTerm.directly &&
                                                            getFilteredOptions("workExperience", "highlyRelevant", searchTerm.highly).length === 0 && (
                                                                <button
                                                                    className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                    onClick={() =>
                                                                        handleAddCustomOption("workExperience", "highlyRelevant", searchTerm.highly)
                                                                    }
                                                                >
                                                                    Add "{searchTerm.highly}"
                                                                </button>
                                                            )}
                                                    </div>

                                                    {/* Available Options List */}
                                                    {getFilteredOptions(
                                                        "workExperience",
                                                        "highlyRelevant",
                                                        searchTerm.highly
                                                    ).map((option, index) => (
                                                        <label
                                                            key={index}
                                                            className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={option}
                                                                checked={formData.criteria.workExperience.highlyRelevant.includes(
                                                                    option
                                                                )}
                                                                onChange={() =>
                                                                    handleMultiSelectChange(
                                                                        "workExperience",
                                                                        "highlyRelevant",
                                                                        option
                                                                    )
                                                                }
                                                                className="ml-5 w-5 h-5"
                                                            />
                                                            <span className="text-medium ml-5">
                                                                {option}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Work Experience Moderately Relevant */}
                                    <div className="mb-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                {" "}
                                                Moderately Relevant{" "}
                                                <span className="font-medium text-xsmall">
                                                    {" "}
                                                    (Put roles in the same
                                                    domain with some
                                                    transferable skills)
                                                </span>
                                            </label>

                                            <div
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                onClick={() =>
                                                    setDropdownOpen({
                                                        ...dropdownOpen,
                                                        moderately:
                                                            !dropdownOpen.moderately,
                                                    })
                                                }
                                            >
                                                {/* Show selected options inside the input */}
                                                {formData.criteria
                                                    .workExperience
                                                    .moderatelyRelevant
                                                    ?.length > 0 ? (
                                                    formData.criteria.workExperience.moderatelyRelevant.map(
                                                        (selected, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-gray-200 px-3 py-1 rounded-md flex items-center"
                                                            >
                                                                <span className="text-sm">
                                                                    {selected}
                                                                </span>
                                                                <button
                                                                    type="button" 
                                                                    className="ml-2 text-red-600 font-extrabold"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        e.preventDefault(); 
                                                                        handleRemoveSelectedOption(
                                                                            "workExperience",
                                                                            "moderatelyRelevant",
                                                                            selected
                                                                        );
                                                                    }}
                                                                >
                                                                    X
                                                                </button>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <span className="text-fontcolor">
                                                        Select Moderately
                                                        Relevant
                                                    </span>
                                                )}
                                                <FaChevronDown
                                                    className={`ml-auto transform ${
                                                        dropdownOpen.moderately
                                                            ? "rotate-180"
                                                            : "rotate-0"
                                                    } transition-transform`}
                                                />
                                            </div>

                                            {dropdownOpen.moderately && (
                                                <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                                    {/* Search & Add Custom Option */}
                                                    <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                    <input
                                                            type="text"
                                                            placeholder="Search or add a new option..."
                                                            value={
                                                                searchTerm.moderately ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setSearchTerm({
                                                                    ...searchTerm,
                                                                    moderately:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    const input = e.target.value.trim();
                                                                    const lowerInput = input.toLowerCase();
                                                                    const existingOptions = options.workExperience.map(opt => opt.toLowerCase());
                                                            
                                                                    if (!existingOptions.includes(lowerInput) && input !== "") {
                                                                        handleAddCustomOption("workExperience", "moderatelyRelevant", input);
                                                                    }
                                                                }
                                                            }} 
                                                        />
                                                        {searchTerm.moderately &&
                                                            getFilteredOptions("workExperience", "moderatelyRelevant", searchTerm.moderately).length === 0 && (
                                                                <button
                                                                    className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                    onClick={() =>
                                                                        handleAddCustomOption("workExperience", "moderatelyRelevant", searchTerm.moderately)
                                                                    }
                                                                >
                                                                    Add "{searchTerm.moderately}"
                                                                </button>
                                                            )}
                                                    </div>

                                                    {/* Available Options List */}
                                                    {getFilteredOptions(
                                                        "workExperience",
                                                        "moderatelyRelevant",
                                                        searchTerm.moderately
                                                    ).map((option, index) => (
                                                        <label
                                                            key={index}
                                                            className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={option}
                                                                checked={formData.criteria.workExperience.moderatelyRelevant.includes(
                                                                    option
                                                                )}
                                                                onChange={() =>
                                                                    handleMultiSelectChange(
                                                                        "workExperience",
                                                                        "moderatelyRelevant",
                                                                        option
                                                                    )
                                                                }
                                                                className="ml-5 w-5 h-5"
                                                            />
                                                            <span className="text-medium ml-5">
                                                                {option}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Skills Section */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                {/* <input
                                                type="checkbox"
                                                className="w-4 h-4 border border-gray-300 rounded text-fontcolor"
                                                checked={
                                                    formData.criteria.skills
                                                        .enabled
                                                } // Ensuring checkbox state is controlled
                                                onChange={() =>
                                                    handleCriteriaChange(
                                                        "skills",
                                                        "enabled",
                                                        !formData.criteria
                                                            .skills.enabled
                                                    )
                                                } // Toggle the checkbox state
                                            /> */}
                                                <label className="ml-2 block text-sm font-semibold text-primary">
                                                    Skills
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-sm font-semibold text-fontcolor mr-2">
                                                    Weight
                                                </span>
                                                <input
                                                    type="text"
                                                    value={
                                                        formData.criteria.skills
                                                            .weight || ""
                                                    }
                                                    disabled={
                                                        formData.weight_of_criteria !==
                                                        "Customize Criteria Weight Percentage"
                                                    }
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        if (
                                                            /^\d*$/.test(
                                                                value
                                                            ) &&
                                                            Number(value) <= 100
                                                        ) {
                                                            handleCriteriaChange(
                                                                "skills",
                                                                "weight",
                                                                value
                                                            );
                                                        }
                                                    }}
                                                    className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-fontcolor text-center"
                                                />
                                            </div>
                                        </div>

                                        {/* Primary Skills Multi-Select */}
                                        <div className="mb-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                    Primary Skills{" "}
                                                    <span className="font-medium text-xsmall">
                                                        (Put roles with the most
                                                        relevant skills and
                                                        experience){" "}
                                                    </span>
                                                </label>

                                                <div
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                    onClick={() =>
                                                        setDropdownOpen({
                                                            ...dropdownOpen,
                                                            primary:
                                                                !dropdownOpen.primary,
                                                        })
                                                    }
                                                >
                                                    {/* Show selected options inside the input */}
                                                    {formData.criteria.skills
                                                        .primarySkills?.length >
                                                    0 ? (
                                                        formData.criteria.skills.primarySkills.map(
                                                            (
                                                                selected,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="bg-gray-200 px-3 py-1 rounded-md flex items-center"
                                                                >
                                                                    <span className="text-sm">
                                                                        {
                                                                            selected
                                                                        }
                                                                    </span>
                                                                    <button
                                                                        className="ml-2 text-red-600 font-extrabold"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleRemoveSelectedOption(
                                                                                "skills",
                                                                                "primarySkills",
                                                                                selected
                                                                            );
                                                                        }}
                                                                    >
                                                                        X
                                                                    </button>
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <span className="text-fontcolor">
                                                            Select Primary
                                                            Skills
                                                        </span>
                                                    )}
                                                    <FaChevronDown
                                                        className={`ml-auto transform ${
                                                            dropdownOpen.primary
                                                                ? "rotate-180"
                                                                : "rotate-0"
                                                        } transition-transform`}
                                                    />
                                                </div>

                                                {dropdownOpen.primary && (
                                                    <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                                        {/* Search & Add Custom Option */}
                                                        <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                            <input
                                                                type="text"
                                                                placeholder="Search or add a new option..."
                                                                value={
                                                                    searchTerm.primary ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    setSearchTerm({
                                                                        ...searchTerm,
                                                                        primary:
                                                                            e.target
                                                                                .value,
                                                                    })
                                                                }
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        e.preventDefault();
                                                                        const input = e.target.value.trim();
                                                                        const lowerInput = input.toLowerCase();
                                                                        const existingOptions = options.skills.map(opt => opt.toLowerCase());
                                                                
                                                                        if (!existingOptions.includes(lowerInput) && input !== "") {
                                                                            handleAddCustomOption("skills", "primarySkills", input);
                                                                        }
                                                                    }
                                                                }} 
                                                            />
                                                            {searchTerm.primary &&
                                                            getFilteredOptions("skills", "primarySkills", searchTerm.primary).length === 0 && (
                                                                <button
                                                                    className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                    onClick={() =>
                                                                        handleAddCustomOption("skills", "primarySkills", searchTerm.primary)
                                                                    }
                                                                >
                                                                    Add "{searchTerm.primary}"
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Available Options List */}
                                                        {getFilteredOptions(
                                                            "skills",
                                                            "primarySkills",
                                                            searchTerm.primary
                                                        ).map(
                                                            (option, index) => (
                                                                <label
                                                                    key={index}
                                                                    className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        value={
                                                                            option
                                                                        }
                                                                        checked={formData.criteria.skills.primarySkills.includes(
                                                                            option
                                                                        )}
                                                                        onChange={() =>
                                                                            handleMultiSelectChange(
                                                                                "skills",
                                                                                "primarySkills",
                                                                                option
                                                                            )
                                                                        }
                                                                        className="ml-5 w-5 h-5"
                                                                    />
                                                                    <span className="text-medium ml-5">
                                                                        {option}
                                                                    </span>
                                                                </label>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Secondary Skills Multi-Select */}
                                        <div className="mb-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                    Secondary Skills
                                                    <span className="font-medium text-xsmall">
                                                        {" "}
                                                        (Put important skills
                                                        that are frequently used
                                                        but not absolutely
                                                        essential){" "}
                                                    </span>
                                                </label>

                                                <div
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                    onClick={() =>
                                                        setDropdownOpen({
                                                            ...dropdownOpen,
                                                            secondary:
                                                                !dropdownOpen.secondary,
                                                        })
                                                    }
                                                >
                                                    {/* Show selected options inside the input */}
                                                    {formData.criteria.skills
                                                        .secondarySkills
                                                        ?.length > 0 ? (
                                                        formData.criteria.skills.secondarySkills.map(
                                                            (
                                                                selected,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="bg-gray-200 px-3 py-1 rounded-md flex items-center"
                                                                >
                                                                    <span className="text-sm">
                                                                        {
                                                                            selected
                                                                        }
                                                                    </span>
                                                                    <button
                                                                        className="ml-2 text-red-600 font-extrabold"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleRemoveSelectedOption(
                                                                                "skills",
                                                                                "secondarySkills",
                                                                                selected
                                                                            );
                                                                        }}
                                                                    >
                                                                        X
                                                                    </button>
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <span className="text-fontcolor">
                                                            Select Secondary
                                                            Skills
                                                        </span>
                                                    )}
                                                    <FaChevronDown
                                                        className={`ml-auto transform ${
                                                            dropdownOpen.secondary
                                                                ? "rotate-180"
                                                                : "rotate-0"
                                                        } transition-transform`}
                                                    />
                                                </div>

                                                {dropdownOpen.secondary && (
                                                    <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                                        {/* Search & Add Custom Option */}
                                                        <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                            <input
                                                                type="text"
                                                                placeholder="Search or add a new option..."
                                                                value={
                                                                    searchTerm.secondary ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    setSearchTerm({
                                                                        ...searchTerm,
                                                                        secondary:
                                                                            e.target
                                                                                .value,
                                                                    })
                                                                }
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        e.preventDefault();
                                                                        const input = e.target.value.trim();
                                                                        const lowerInput = input.toLowerCase();
                                                                        const existingOptions = options.skills.map(opt => opt.toLowerCase());
                                                                
                                                                        if (!existingOptions.includes(lowerInput) && input !== "") {
                                                                            handleAddCustomOption("skills", "secondarySkills", input);
                                                                        }
                                                                    }
                                                                }} 
                                                            />
                                                            {searchTerm.secondary &&
                                                            getFilteredOptions("skills", "secondarySkills", searchTerm.secondary).length === 0 && (
                                                                <button
                                                                    className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                    onClick={() =>
                                                                        handleAddCustomOption("skills", "secondarySkills", searchTerm.secondary)
                                                                    }
                                                                >
                                                                    Add "{searchTerm.secondary}"
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Available Options List */}
                                                        {getFilteredOptions(
                                                            "skills",
                                                            "secondarySkills",
                                                            searchTerm.secondary
                                                        ).map(
                                                            (option, index) => (
                                                                <label
                                                                    key={index}
                                                                    className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        value={
                                                                            option
                                                                        }
                                                                        checked={formData.criteria.skills.secondarySkills.includes(
                                                                            option
                                                                        )}
                                                                        onChange={() =>
                                                                            handleMultiSelectChange(
                                                                                "skills",
                                                                                "secondarySkills",
                                                                                option
                                                                            )
                                                                        }
                                                                        className="ml-5 w-5 h-5"
                                                                    />
                                                                    <span className="text-medium ml-5">
                                                                        {option}
                                                                    </span>
                                                                </label>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Additional Skills Multi-Select */}
                                        <div className="mb-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                    Additional Skills{" "}
                                                    <span className="font-medium text-xsmall">
                                                        {" "}
                                                        (nice-to-have skills
                                                        that would give a
                                                        candidate an edge but
                                                        aren't necessary for the
                                                        core job functions)
                                                    </span>
                                                </label>

                                                <div
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                    onClick={() =>
                                                        setDropdownOpen({
                                                            ...dropdownOpen,
                                                            additional:
                                                                !dropdownOpen.additional,
                                                        })
                                                    }
                                                >
                                                    {/* Show selected options inside the input */}
                                                    {formData.criteria.skills
                                                        .additionalSkills
                                                        ?.length > 0 ? (
                                                        formData.criteria.skills.additionalSkills.map(
                                                            (
                                                                selected,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="bg-gray-200 px-3 py-1 rounded-md flex items-center"
                                                                >
                                                                    <span className="text-sm">
                                                                        {
                                                                            selected
                                                                        }
                                                                    </span>
                                                                    <button
                                                                        className="ml-2 text-red-600 font-extrabold"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleRemoveSelectedOption(
                                                                                "skills",
                                                                                "additionalSkills",
                                                                                selected
                                                                            );
                                                                        }}
                                                                    >
                                                                        X
                                                                    </button>
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <span className="text-fontcolor">
                                                            Select Additional
                                                            Skills
                                                        </span>
                                                    )}
                                                    <FaChevronDown
                                                        className={`ml-auto transform ${
                                                            dropdownOpen.additional
                                                                ? "rotate-180"
                                                                : "rotate-0"
                                                        } transition-transform`}
                                                    />
                                                </div>

                                                {dropdownOpen.additional && (
                                                    <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                                        {/* Search & Add Custom Option */}
                                                        <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                            <input
                                                                type="text"
                                                                placeholder="Search or add a new option..."
                                                                value={
                                                                    searchTerm.additional ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    setSearchTerm({
                                                                        ...searchTerm,
                                                                        additional:
                                                                            e.target
                                                                                .value,
                                                                    })
                                                                }
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        e.preventDefault();
                                                                        const input = e.target.value.trim();
                                                                        const lowerInput = input.toLowerCase();
                                                                        const existingOptions = options.skills.map(opt => opt.toLowerCase());
                                                                
                                                                        if (!existingOptions.includes(lowerInput) && input !== "") {
                                                                            handleAddCustomOption("skills", "additionalSkills", input);
                                                                        }
                                                                    }
                                                                }} 
                                                            />
                                                            {searchTerm.additional &&
                                                            getFilteredOptions("skills", "additionalSkills", searchTerm.additional).length === 0 && (
                                                                <button
                                                                    className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                    onClick={() =>
                                                                        handleAddCustomOption("skills", "additionalSkills", searchTerm.additional)
                                                                    }
                                                                >
                                                                    Add "{searchTerm.additional}"
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Available Options List */}
                                                        {getFilteredOptions(
                                                            "skills",
                                                            "additionalSkills",
                                                            searchTerm.additional
                                                        ).map(
                                                            (option, index) => (
                                                                <label
                                                                    key={index}
                                                                    className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        value={
                                                                            option
                                                                        }
                                                                        checked={formData.criteria.skills.additionalSkills.includes(
                                                                            option
                                                                        )}
                                                                        onChange={() =>
                                                                            handleMultiSelectChange(
                                                                                "skills",
                                                                                "additionalSkills",
                                                                                option
                                                                            )
                                                                        }
                                                                        className="ml-5 w-5 h-5"
                                                                    />
                                                                    <span className="text-medium ml-5">
                                                                        {option}
                                                                    </span>
                                                                </label>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Education Multi-Select */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    {/* <input
                                                    type="checkbox"
                                                    className="w-4 h-4 border border-gray-300 rounded text-fontcolor"
                                                /> */}
                                                    <label className="ml-2 block text-sm font-semibold text-primary">
                                                        Education
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-sm font-semibold text-fontcolor mr-2">
                                                        Weight
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={
                                                            formData.criteria
                                                                .education
                                                                .weight || ""
                                                        }
                                                        disabled={
                                                            formData.weight_of_criteria !==
                                                            "Customize Criteria Weight Percentage"
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value;
                                                            // Allow only numbers and validate the range
                                                            if (
                                                                /^\d*$/.test(
                                                                    value
                                                                ) &&
                                                                Number(value) <=
                                                                    100
                                                            ) {
                                                                handleCriteriaChange(
                                                                    "education",
                                                                    "weight",
                                                                    value
                                                                );
                                                            }
                                                        }}
                                                        className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-black text-center"
                                                    />
                                                </div>
                                            </div>

                                            {/* 1st Preference Field of Study */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                    1st Preference Field of Study{" "}
                                                    <span className="font-medium text-xsmall">
                                                        (Put the most directly
                                                        relevant fields of study
                                                        for the position)
                                                    </span>
                                                </label>

                                                <div
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between"
                                                    onClick={() =>
                                                        setDropdownOpen({
                                                            ...dropdownOpen,
                                                            firstChoice:
                                                                !dropdownOpen.firstChoice,
                                                        })
                                                    }
                                                >
                                                    <span>
                                                        {formData.criteria
                                                            .education
                                                            .firstChoice ||
                                                            "Select 1st Choice Field of Study"}
                                                    </span>
                                                    <FaChevronDown
                                                        className={`ml-2 transform ${
                                                            dropdownOpen.firstChoice
                                                                ? "rotate-180"
                                                                : "rotate-0"
                                                        } transition-transform`}
                                                    />
                                                </div>

                                                {dropdownOpen.firstChoice && (
                                                    <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                                        <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                            <input
                                                                type="text"
                                                                placeholder="Search or add a new option..."
                                                                value={
                                                                    searchTerm.firstChoice ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    setSearchTerm({
                                                                        ...searchTerm,
                                                                        firstChoice:
                                                                            e.target
                                                                                .value,
                                                                    })
                                                                }
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        e.preventDefault();
                                                                        const input = e.target.value.trim();
                                                                        const lowerInput = input.toLowerCase();
                                                                        const existingOptions = options.education.map(opt => opt.toLowerCase());
                                                                
                                                                        if (!existingOptions.includes(lowerInput) && input !== "") {
                                                                            handleAddCustomOption("education", "firstChoice", input);
                                                                        }
                                                                    }
                                                                }} 
                                                            />
                                                            {searchTerm.firstChoice &&
                                                            getFilteredOptions("education", "firstChoice", searchTerm.firstChoice).length === 0 && (
                                                                <button
                                                                    className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                    onClick={() =>
                                                                        handleAddCustomOption("education", "firstChoice", searchTerm.firstChoice)
                                                                    }
                                                                >
                                                                    Add "{searchTerm.firstChoice}"
                                                                </button>
                                                            )}
                                                        </div>

                                                        {getFilteredOptions(
                                                            "education",
                                                            "firstChoice",
                                                            searchTerm.firstChoice
                                                        ).map(
                                                            (option, index) => (
                                                                <label
                                                                    key={index}
                                                                    className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        value={
                                                                            option
                                                                        }
                                                                        checked={
                                                                            formData
                                                                                .criteria
                                                                                .education
                                                                                .firstChoice ===
                                                                            option
                                                                        }
                                                                        onChange={() =>
                                                                            handleCriteriaChange(
                                                                                "education",
                                                                                "firstChoice",
                                                                                option
                                                                            )
                                                                        }
                                                                        className="ml-5 w-5 h-5"
                                                                    />
                                                                    <span className="text-medium ml-5">
                                                                        {option}
                                                                    </span>
                                                                </label>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* 2nd Preference Field of Study */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                    2nd Preference Field of Study{" "}
                                                        <span className="font-medium text-xsmall">
                                                            (Put closely related
                                                            fields that have
                                                            significant overlap with
                                                            the job requirements)
                                                        </span>
                                                </label>
                                                <div
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between"
                                                    onClick={() =>
                                                        setDropdownOpen({
                                                            ...dropdownOpen,
                                                            secondChoice:
                                                                !dropdownOpen.secondChoice,
                                                        })
                                                    }
                                                >
                                                    <span>
                                                        {formData.criteria
                                                            .education
                                                            .secondChoice ||
                                                            "Select 2nd Choice Field of Study"}
                                                    </span>
                                                    <FaChevronDown
                                                        className={`ml-2 transform ${
                                                            dropdownOpen.secondChoice
                                                                ? "rotate-180"
                                                                : "rotate-0"
                                                        } transition-transform`}
                                                    />
                                                </div>

                                                {dropdownOpen.secondChoice && (
                                                    <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                                        <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                            <input
                                                                type="text"
                                                                placeholder="Search or add a new option..."
                                                                value={
                                                                    searchTerm.secondChoice ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    setSearchTerm({
                                                                        ...searchTerm,
                                                                        secondChoice:
                                                                            e.target
                                                                                .value,
                                                                    })
                                                                }
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        e.preventDefault();
                                                                        const input = e.target.value.trim();
                                                                        const lowerInput = input.toLowerCase();
                                                                        const existingOptions = options.education.map(opt => opt.toLowerCase());
                                                                
                                                                        if (!existingOptions.includes(lowerInput) && input !== "") {
                                                                            handleAddCustomOption("education", "secondChoice", input);
                                                                        }
                                                                    }
                                                                }} 
                                                            />
                                                            {searchTerm.secondChoice &&
                                                            getFilteredOptions("education", "secondChoice", searchTerm.secondChoice).length === 0 && (
                                                                <button
                                                                    className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                    onClick={() =>
                                                                        handleAddCustomOption("education", "secondChoice", searchTerm.secondChoice)
                                                                    }
                                                                >
                                                                    Add "{searchTerm.secondChoice}"
                                                                </button>
                                                            )}
                                                        </div>

                                                        {getFilteredOptions(
                                                            "education",
                                                            "secondChoice",
                                                            searchTerm.secondChoice 
                                                        ).map(
                                                            (option, index) => (
                                                                <label
                                                                    key={index}
                                                                    className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        value={
                                                                            option
                                                                        }
                                                                        checked={
                                                                            formData
                                                                                .criteria
                                                                                .education
                                                                                .secondChoice ===
                                                                            option
                                                                        }
                                                                        onChange={() =>
                                                                            handleCriteriaChange(
                                                                                "education",
                                                                                "secondChoice",
                                                                                option
                                                                            )
                                                                        }
                                                                        className="ml-5 w-5 h-5"
                                                                    />
                                                                    <span className="text-medium ml-5">
                                                                        {option}
                                                                    </span>
                                                                </label>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* 3rd Preference Field of Study */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                    3rd Preference Field of Study {" "}
                                                    <span className="font-medium text-xsmall">
                                                        (Put fields that have
                                                        some relevance or
                                                        provide useful
                                                        background knowledge)
                                                    </span>
                                                </label>
                                                <div
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between"
                                                    onClick={() =>
                                                        setDropdownOpen({
                                                            ...dropdownOpen,
                                                            thirdChoice:
                                                                !dropdownOpen.thirdChoice,
                                                        })
                                                    }
                                                >
                                                    <span>
                                                        {formData.criteria
                                                            .education
                                                            .thirdChoice ||
                                                            "Select 3rd Choice Field of Study"}
                                                    </span>
                                                    <FaChevronDown
                                                        className={`ml-2 transform ${
                                                            dropdownOpen.thirdChoice
                                                                ? "rotate-180"
                                                                : "rotate-0"
                                                        } transition-transform`}
                                                    />
                                                </div>

                                                {dropdownOpen.thirdChoice && (
                                                    <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                                        <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                            <input
                                                                type="text"
                                                                placeholder="Search or add a new option..."
                                                                value={
                                                                    searchTerm.thirdChoice ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    setSearchTerm({
                                                                        ...searchTerm,
                                                                        thirdChoice:
                                                                            e.target
                                                                                .value,
                                                                    })
                                                                }
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        e.preventDefault();
                                                                        const input = e.target.value.trim();
                                                                        const lowerInput = input.toLowerCase();
                                                                        const existingOptions = options.education.map(opt => opt.toLowerCase());
                                                                
                                                                        if (!existingOptions.includes(lowerInput) && input !== "") {
                                                                            handleAddCustomOption("education", "thirdChoice", input);
                                                                        }
                                                                    }
                                                                }} 
                                                            />
                                                            {searchTerm.thirdChoice &&
                                                            getFilteredOptions("education", "thirdChoice", searchTerm.thirdChoice).length === 0 && (
                                                                <button
                                                                    className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                    onClick={() =>
                                                                        handleAddCustomOption("education", "thirdChoice", searchTerm.thirdChoice)
                                                                    }
                                                                >
                                                                    Add "{searchTerm.thirdChoice}"
                                                                </button>
                                                            )}
                                                        </div>

                                                        {getFilteredOptions(
                                                            "education",
                                                            "secondChoice",
                                                            searchTerm.thirdChoice
                                                        ).map(
                                                            (option, index) => (
                                                                <label
                                                                    key={index}
                                                                    className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        value={
                                                                            option
                                                                        }
                                                                        checked={
                                                                            formData
                                                                                .criteria
                                                                                .education
                                                                                .thirdChoice ===
                                                                            option
                                                                        }
                                                                        onChange={() =>
                                                                            handleCriteriaChange(
                                                                                "education",
                                                                                "thirdChoice",
                                                                                option
                                                                            )
                                                                        }
                                                                        className="ml-5 w-5 h-5"
                                                                    />
                                                                    <span className="text-medium ml-5">
                                                                        {option}
                                                                    </span>
                                                                </label>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <label className="block text-sm font-semibold text-primary mb-2">
                                        Additional Points
                                    </label>

                                    {/* School Preference */}
                                    <div className="mb-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                School Preference{" "}
                                                <span className="font-medium text-xsmall">
                                                    {" "}
                                                    (Put any preferred
                                                    institutions, if applicable){" "}
                                                </span>
                                            </label>

                                            <div
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                onClick={() =>
                                                    setDropdownOpen({
                                                        ...dropdownOpen,
                                                        school: !dropdownOpen.school,
                                                    })
                                                }
                                            >
                                                {/* Show selected options inside the input */}
                                                {formData.criteria.schools
                                                    .schoolPreference?.length >
                                                0 ? (
                                                    formData.criteria.schools.schoolPreference.map(
                                                        (selected, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-gray-200 px-3 py-1 rounded-md flex items-center"
                                                            >
                                                                <span className="text-sm">
                                                                    {selected}
                                                                </span>
                                                                <button
                                                                    className="ml-2 text-red-600 font-extrabold"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        handleRemoveSelectedOption(
                                                                            "schools",
                                                                            "schoolPreference",
                                                                            selected
                                                                        );
                                                                    }}
                                                                >
                                                                    X
                                                                </button>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <span className="text-fontcolor">
                                                        Select Preferred School
                                                    </span>
                                                )}
                                                <FaChevronDown
                                                    className={`ml-auto transform ${
                                                        dropdownOpen.school
                                                            ? "rotate-180"
                                                            : "rotate-0"
                                                    } transition-transform`}
                                                />
                                            </div>

                                            {dropdownOpen.school && (
                                                <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                                    {/* Search & Add Custom Option */}
                                                    <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                        <input
                                                            type="text"
                                                            placeholder="Search or add a new option..."
                                                            value={
                                                                searchTerm.school ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setSearchTerm({
                                                                    ...searchTerm,
                                                                    school:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    const input = e.target.value.trim();
                                                                    const lowerInput = input.toLowerCase();
                                                                    const existingOptions = options.schools.map(opt => opt.toLowerCase());
                                                            
                                                                    if (!existingOptions.includes(lowerInput) && input !== "") {
                                                                        handleAddCustomOption("schools", "schoolPreference", input);
                                                                    }
                                                                }
                                                            }} 
                                                        />
                                                        {searchTerm.school &&
                                                        getFilteredOptions("schools", "schoolPreference", searchTerm.school).length === 0 && (
                                                            <button
                                                                className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                onClick={() =>
                                                                    handleAddCustomOption("schools", "schoolPreference", searchTerm.school)
                                                                }
                                                            >
                                                                Add "{searchTerm.school}"
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Available Options List */}
                                                    {getFilteredOptions(
                                                        "schools",
                                                        "schoolPreference",
                                                        searchTerm.school
                                                    ).map((option, index) => (
                                                        <label
                                                            key={index}
                                                            className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={option}
                                                                checked={formData.criteria.schools.schoolPreference?.includes(
                                                                    option
                                                                )}
                                                                onChange={() =>
                                                                    handleMultiSelectChange(
                                                                        "schools",
                                                                        "schoolPreference",
                                                                        option
                                                                    )
                                                                }
                                                                className="ml-5 w-5 h-5"
                                                            />
                                                            <span className="text-medium ml-5">
                                                                {option}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 border border-gray-300 rounded text-black mr-2"
                                            checked={
                                                formData.criteria
                                                    .additionalPoints.honor ===
                                                "1"
                                            }
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    criteria: {
                                                        ...prev.criteria,
                                                        additionalPoints: {
                                                            ...prev.criteria
                                                                .additionalPoints,
                                                            honor: e.target
                                                                .checked
                                                                ? "1"
                                                                : "0",
                                                        },
                                                    },
                                                }))
                                            }
                                        />
                                        <label className="text-sm text-fontcolor">
                                            Honors
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 border border-gray-300 rounded text-black mr-2"
                                            checked={
                                                formData.criteria
                                                    .additionalPoints
                                                    .multipleDegrees === "1"
                                            }
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    criteria: {
                                                        ...prev.criteria,
                                                        additionalPoints: {
                                                            ...prev.criteria
                                                                .additionalPoints,
                                                            multipleDegrees: e
                                                                .target.checked
                                                                ? "1"
                                                                : "0",
                                                        },
                                                    },
                                                }))
                                            }
                                        />
                                        <label className="text-sm text-fontcolor">
                                            Multiple Degrees
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            {/* <input
                                            type="checkbox"
                                            className="w-4 h-4 border border-gray-300 rounded text-black"
                                        /> */}
                                            <label className="ml-2 block text-sm font-semibold text-primary">
                                                {" "}
                                                Certificates
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-sm font-semibold text-fontcolor mr-2">
                                                Weight
                                            </span>
                                            <input
                                                type="text"
                                                value={
                                                    formData.criteria
                                                        .certificates.weight ||
                                                    ""
                                                }
                                                disabled={
                                                    formData.weight_of_criteria !==
                                                    "Customize Criteria Weight Percentage"
                                                }
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    // Allow only numbers and validate the range
                                                    if (
                                                        /^\d*$/.test(value) &&
                                                        Number(value) <= 100
                                                    ) {
                                                        handleCriteriaChange(
                                                            "certificates",
                                                            "weight",
                                                            value
                                                        );
                                                    }
                                                }}
                                                className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-black text-center"
                                            />
                                        </div>
                                    </div>

                                     {/* School Preference */}
                                    <div className="mb-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                Certificate Preference{" "}
                                                <span className="font-medium text-xsmall">
                                                    (Select any preferred
                                                    certificates, if applicable)
                                                </span>
                                            </label>

                                            <div
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                onClick={() =>
                                                    setDropdownOpen({
                                                        ...dropdownOpen,
                                                        certicatePrefered:
                                                            !dropdownOpen.certicatePrefered,
                                                    })
                                                }
                                            >
                                                {/* Show selected options inside the input */}
                                                {formData.criteria.certificates
                                                    .preferred?.length > 0 ? (
                                                    formData.criteria.certificates.preferred.map(
                                                        (selected, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-gray-200 px-3 py-1 rounded-md flex items-center"
                                                            >
                                                                <span className="text-sm">
                                                                    {selected}
                                                                </span>
                                                                <button
                                                                    className="ml-2 text-red-600 font-extrabold"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        handleRemoveSelectedOption(
                                                                            "certificates",
                                                                            "preferred",
                                                                            selected
                                                                        );
                                                                    }}
                                                                >
                                                                    X
                                                                </button>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <span className="text-fontcolor">
                                                        Select Preferred
                                                        Certificate
                                                    </span>
                                                )}
                                                <FaChevronDown
                                                    className={`ml-auto transform ${
                                                        dropdownOpen.certicatePrefered
                                                            ? "rotate-180"
                                                            : "rotate-0"
                                                    } transition-transform`}
                                                />
                                            </div>

                                            {dropdownOpen.certicatePrefered && (
                                                <div className="top-full mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                                    {/* Search & Add Custom Option */}
                                                    <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                        <input
                                                            type="text"
                                                            placeholder="Search or add a new option..."
                                                            value={
                                                                searchTerm.certicatePrefered ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setSearchTerm({
                                                                    ...searchTerm,
                                                                    certicatePrefered:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    const input = e.target.value.trim();
                                                                    const lowerInput = input.toLowerCase();
                                                                    const existingOptions = options.certificates.map(opt => opt.toLowerCase());
                                                            
                                                                    if (!existingOptions.includes(lowerInput) && input !== "") {
                                                                        handleAddCustomOption("certificates", "preferred", input);
                                                                    }
                                                                }
                                                            }} 
                                                        />
                                                        {searchTerm.firstChoice &&
                                                            getFilteredOptions("certificates", "preferred", searchTerm.certicatePrefered).length === 0 && (
                                                                <button
                                                                    className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                    onClick={() =>
                                                                        handleAddCustomOption("certificates", "preferred", searchTerm.certicatePrefered)
                                                                    }
                                                                >
                                                                    Add "{searchTerm.certicatePrefered}"
                                                                </button>
                                                            )}
                                                    </div>

                                                    {/* Available Options List */}
                                                    {getFilteredOptions(
                                                        "certificates",
                                                        "preferred",
                                                        searchTerm.certicatePrefered
                                                    ).map((option, index) => (
                                                        <label
                                                            key={index}
                                                            className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={option}
                                                                checked={formData.criteria.certificates.preferred?.includes(
                                                                    option
                                                                )}
                                                                onChange={() =>
                                                                    handleMultiSelectChange(
                                                                        "certificates",
                                                                        "preferred",
                                                                        option
                                                                    )
                                                                }
                                                                className="ml-5 w-5 h-5"
                                                            />
                                                            <span className="text-medium ml-5">
                                                                {option}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-primary mb-2">
                                        Weight of Criteria
                                    </p>
                                    <div className="space-y-3">
                                        {[
                                            "Customize Criteria Weight Percentage",
                                            "Default Weight Percentage",
                                            "Experienced-Focused",
                                            "Education-Focused",
                                            "Skills-Focused",
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-3"
                                            >
                                                <input
                                                    type="radio"
                                                    id={`criteria-${index}`}
                                                    name="weight_of_criteria"
                                                    value={item}
                                                    checked={
                                                        formData.weight_of_criteria ===
                                                        item
                                                    }
                                                    onChange={onInputChange}
                                                    className="h-4 w-4 text-black rounded-full"
                                                />
                                                <label
                                                    htmlFor={`criteria-${index}`}
                                                    className="text-sm text-fontcolor font-medium cursor-pointer"
                                                >
                                                    {item}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="verification-option"
                                        className="block text-sm font-semibold text-primary mb-2"
                                    >
                                        {" "}
                                        Verification Option
                                    </label>
                                    <select
                                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-fontcolor"
                                        name="verification_option"
                                        value={formData.verification_option}
                                        onChange={onInputChange}
                                    >
                                        <option value="" disabled>
                                            Select a verification option
                                        </option>
                                        <option value="Score Unverified Credential Fully">
                                            Score Unverified Credential Fully
                                        </option>
                                        <option value="Score Unverified Credential 50%">
                                            Score Unverified Credential 50%
                                        </option>
                                        <option value="Ignore Unverified Credentials">
                                            Ignore Unverified Credentials
                                        </option>
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="verification-option"
                                        className="block text-sm font-semibold text-primary mb-2"
                                    >
                                        {" "}
                                        Additional Notes
                                    </label>

                                    <textarea
                                        name="additional_notes"
                                        placeholder="Additional Notes"
                                        value={formData.additional_notes}
                                        onChange={onInputChange}
                                        className="w-full p-1 rounded-xs border-2 border-fontcolor text-fontcolor h-20"
                                    ></textarea>
                                </div>

                                <div className="flex justify-between mt-8">
                                    <button
                                        type="button"
                                        className="button2 flex items-center justify-center"
                                    >
                                        <Link
                                            href="/COMPANY/CreateJob"
                                            className="ml-auto"
                                        >
                                            <div className="ml-auto">
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
                                            </div>
                                        </Link>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) =>
                                            handleSettingsSubmit(e, "draft")
                                        }
                                        className="button1 flex items-center justify-center"
                                    >
                                        <div className="flex items-center space-x-2 ml-auto">
                                            <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                                Continue
                                            </p>
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
                    </form>
                </div>
            </div>
            <ToastWrapper/>
            <GeneralFooter />
        </div>
    );
}
