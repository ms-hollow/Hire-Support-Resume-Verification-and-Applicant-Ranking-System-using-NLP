import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import phLocations from "@/public/placeHolder/philippines.json";
import { getCompany } from "../api/companyApi";
import AuthContext from "../context/AuthContext";
import {
    deleteJobHiring,
    getJobHiringDetails,
    updateJobHiring,
} from "../api/companyJobApi";
import { validateJobForm } from "../utils/JobHelpers";

export default function EditJobHiring() {
    let { authTokens } = useContext(AuthContext);
    const router = useRouter();
    const { id } = router.query;
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [options, setOptions] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [companyName, setCompanyName] = useState("");

    const [formData, setFormData] = useState({
        job_title: "",
        job_industry: "",
        specialization: [],
        job_description: "",
        company_name: "",
        region: "",
        province: "",
        city: "",
        work_setup: "",
        employment_type: "",
        qualifications: "",
        schedule: "",
        benefits: "",
        experience_level: "",
        num_positions: "",
        salary_min: "",
        salary_max: "",
        salary_frequency: "",

        required_documents: [],
        application_deadline: "",
        weight_of_criteria: "",
        verification_option: "",
        additional_notes: "",
        criteria: {
            workExperience: {
                directlyRelevant: [],
                highlyRelevant: [],
                moderatelyRelevant: [],
                weight: "",
            },
            skills: {
                primarySkills: [],
                secondarySkills: [],
                additionalSkills: [],
                weight: "",
            },
            education: {
                weight: "",
                firstChoice: [],
                secondChoice: [],
                thirdChoice: [],
            },
            schools: {
                schoolPreference: [],
            },
            additionalPoints: { honor: "", multipleDegrees: "" },
            certificates: {
                preferred: [],
                weight: "",
            },
        },
        criteria_weights: {
            work_experience: 100,
            skills: 100,
            education: 100,
            additional_points: 100,
            certifications: 100,
        },
    });

    const getValue = (value, fallback = "") => value ?? fallback;

    const parseSalary = (salary) =>
        typeof salary === "string"
            ? salary.replace(/,/g, "")
            : salary?.toString().replace(/,/g, "") || "";

    //* Set ang formdata
    useEffect(() => {
        const fetchData = async () => {
            const jobHiringDetails = await getJobHiringDetails(id, authTokens);
            if (!jobHiringDetails)
                return console.error("No job hiring details found.");

            const parsedData =
                typeof jobHiringDetails === "string"
                    ? JSON.parse(jobHiringDetails)
                    : jobHiringDetails;

            const scoring = parsedData.scoring_criteria || [];

            setFormData((prev) => ({
                ...prev,
                job_title: getValue(parsedData.job_title),
                job_industry: getValue(parsedData.job_industry),
                specialization: getValue(parsedData.specialization, []),
                job_description: getValue(parsedData.job_description),
                company_name: getValue(parsedData.company_name),
                work_setup: getValue(parsedData.work_setup),
                employment_type: getValue(parsedData.employment_type),
                qualifications: getValue(parsedData.qualifications),
                schedule: getValue(parsedData.schedule),
                benefits: getValue(parsedData.benefits),
                experience_level: getValue(parsedData.experience_level),
                num_positions: getValue(parsedData.num_positions),
                salary_min: parseSalary(parsedData.salary_min),
                salary_max: parseSalary(parsedData.salary_max),
                salary_frequency: getValue(parsedData.salary_frequency),
                required_documents: getValue(parsedData.required_documents, []),
                application_deadline: getValue(parsedData.application_deadline),
                verification_option: getValue(parsedData.verification_option),
                weight_of_criteria: getValue(parsedData.weight_of_criteria),
                additional_notes: getValue(parsedData.additional_notes),
                region: getValue(parsedData.region),
                province: getValue(parsedData.province),
                city: getValue(parsedData.city),
                criteria: {
                    workExperience: {
                        directlyRelevant:
                            scoring[0]?.preference?.directlyRelevant || [],
                        highlyRelevant:
                            scoring[0]?.preference?.highlyRelevant || [],
                        moderatelyRelevant:
                            scoring[0]?.preference?.moderatelyRelevant || [],
                        weight: scoring[0]?.weight_percentage || "",
                    },
                    skills: {
                        primarySkills:
                            scoring[1]?.preference?.primarySkills || [],
                        secondarySkills:
                            scoring[1]?.preference?.secondarySkills || [],
                        additionalSkills:
                            scoring[1]?.preference?.additionalSkills || [],
                        weight: scoring[1]?.weight_percentage || "",
                    },
                    education: {
                        firstChoice: scoring[2]?.preference?.firstChoice || [],
                        secondChoice:
                            scoring[2]?.preference?.secondChoice || [],
                        thirdChoice: scoring[2]?.preference?.thirdChoice || [],
                        weight: scoring[2]?.weight_percentage || "",
                    },
                    schools: {
                        schoolPreference:
                            scoring[3]?.preference?.schoolPreference || [],
                    },
                    additionalPoints: {
                        honor: parsedData.honor || "0",
                        multipleDegrees:
                            scoring[4]?.preference?.multipleDegrees || "0",
                    },
                    certificates: {
                        preferred: scoring[5]?.preference?.preferred || [],
                        weight: scoring[5]?.weight_percentage || "",
                    },
                },
            }));

            // Load provinces and cities
            if (parsedData.region) {
                const selectedRegion = phLocations.find(
                    (r) => r.id === parsedData.region
                );
                const provincesList = selectedRegion?.p || [];
                setProvinces(provincesList);

                if (parsedData.province) {
                    const selectedProvince = provincesList.find(
                        (p) => p.n === parsedData.province
                    );
                    setCities(selectedProvince?.c || []);
                }
            }
        };

        if (id && authTokens) {
            fetchData();
        }
    }, [id, authTokens]);

    const formatDate = (date) => {
        const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
        const day = date.getDate();
        const year = date.getFullYear();

        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;

        return `${formattedMonth}-${formattedDay}-${year}`;
    };

    useEffect(() => {
        if (!authTokens) {
            router.push("/GENERAL/Login");
            return;
        }

        const fetchCompanyData = async () => {
            try {
                const companyData = await getCompany(authTokens);
                const company_key = companyData.company_key;
                const fetchedCompanyName =
                    companyData?.profile_data?.company_name ||
                    "Unknown Company";
                setCompanyName(fetchedCompanyName);

                const currentDate = new Date();
                const formattedDate = formatDate(currentDate);

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    company: company_key,
                    company_name: fetchedCompanyName,
                    creation_date: formattedDate,
                }));
            } catch (error) {
                console.error("Error fetching company data:", error);
                setCompanyName("Unknown Company");

                // Set default company name in formData
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    company_name: "Unknown Company",
                }));
            }
        };

        fetchCompanyData();
    }, [authTokens, router]);

    //* Import list of specialization
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch options data
                const optionsResponse = await fetch(
                    "/placeHolder/dummy_options.json"
                );
                if (!optionsResponse.ok) {
                    throw new Error("Failed to fetch dummy_options.json");
                }
                const optionsData = await optionsResponse.json();
                setOptions(optionsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: value,
        };
        setFormData(updatedFormData);
    };

    const handleScheduleSelect = (schedule) => {
        const updatedFormData = {
            ...formData,
            schedule,
        };
        setFormData(updatedFormData);
    };

    useEffect(() => {
        setRegions(phLocations);
    }, []);

    // Load provinces when a region is selected
    useEffect(() => {
        if (formData.region) {
            // Find the selected region
            const selectedRegion = phLocations.find(
                (region) => region.id === formData.region
            );

            // Update provinces
            const provincesList = selectedRegion ? selectedRegion.p : [];
            setProvinces(provincesList);

            // Reset province and city if not in new list
            if (!provincesList.find((p) => p.n === formData.province)) {
                setFormData((prev) => ({ ...prev, province: "", city: "" }));
                setCities([]); // Reset cities
            }
        }
    }, [formData.region]);

    useEffect(() => {
        if (formData.province) {
            // Find the selected province and update cities
            const selectedProvince = provinces.find(
                (province) => province.n === formData.province
            );
            const cityList = selectedProvince ? selectedProvince.c : [];
            setCities(cityList);

            // Reset city if not in new list
            if (!cityList.find((c) => c.n === formData.city)) {
                setFormData((prev) => ({ ...prev, city: "" }));
            }
        }
    }, [formData.province, provinces]);

    const handleMultiSelectChange = (option) => {
        setFormData((prev) => {
            // Toggle selection: If selected, remove it. If not, add it.
            const updatedSpecialization = prev.specialization.includes(option)
                ? prev.specialization.filter((item) => item !== option)
                : [...prev.specialization, option];

            return {
                ...prev,
                specialization: updatedSpecialization,
            };
        });
    };

    const handleRemoveSelectedOption = (option) => {
        handleMultiSelectChange(option);
    };

    const handleViewApplicantSummary = () => {
        console.log("selectedJobId", id);
        router.push({
            pathname: "/COMPANY/ApplicantsSummary",
            query: { id },
        });
    };

    const handleDelete = async () => {
        const success = await deleteJobHiring(id, authTokens);
        if (success) {
            alert("Job successfully deleted");
            router.push("/COMPANY/CompanyHome");
        } else {
            alert("Failed to delete job.");
        }
    };

    const getFilteredOptions = (currentCategory, currentField) => {
        const allSelectedOptions = new Set([
            ...formData.criteria.workExperience.directlyRelevant,
            ...formData.criteria.workExperience.highlyRelevant,
            ...formData.criteria.workExperience.moderatelyRelevant,
            ...formData.criteria.skills.primarySkills,
            ...formData.criteria.skills.secondarySkills,
            ...formData.criteria.skills.additionalSkills,
            ...(formData.criteria.education.firstChoice
                ? [formData.criteria.education.firstChoice]
                : []),
            ...(formData.criteria.education.secondChoice
                ? [formData.criteria.education.secondChoice]
                : []),
            ...(formData.criteria.education.thirdChoice
                ? [formData.criteria.education.thirdChoice]
                : []),
            ...formData.criteria.schools.schoolPreference,
            ...formData.criteria.certificates.preferred,
        ]);

        return options[currentCategory].filter((option) => {
            return (
                !allSelectedOptions.has(option) ||
                formData.criteria[currentCategory][currentField]?.includes(
                    option
                )
            );
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch options
                const optionsResponse = await fetch(
                    "/placeHolder/dummy_options.json"
                );
                const optionsData = await optionsResponse.json();
                setOptions(optionsData);

                if (!options) {
                    return <div>Loading...</div>;
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateJobForm()) {
            return;
        }

        const serializedData = {
            ...formData,
            required_documents: formData.required_documents,
            application_deadline: formData.application_deadline,
            weight_of_criteria: formData.weight_of_criteria,
            verification_option: formData.verification_option,
            additional_notes: formData.additional_notes,
            scoring_criteria: [
                {
                    criteria_name: "Work Experience",
                    weight_percentage: formData.criteria.workExperience.weight,
                    preference: {
                        directlyRelevant:
                            formData.criteria.workExperience.directlyRelevant,
                        highlyRelevant:
                            formData.criteria.workExperience.highlyRelevant,
                        moderatelyRelevant:
                            formData.criteria.workExperience.moderatelyRelevant,
                    },
                },
                {
                    criteria_name: "Skills",
                    weight_percentage: formData.criteria.skills.weight,
                    preference: {
                        primarySkills: formData.criteria.skills.primarySkills,
                        secondarySkills:
                            formData.criteria.skills.secondarySkills,
                        additionalSkills:
                            formData.criteria.skills.additionalSkills,
                    },
                },
                {
                    criteria_name: "Education",
                    weight_percentage: formData.criteria.education.weight,
                    preference: {
                        firstChoice: formData.criteria.education.firstChoice,
                        secondChoice: formData.criteria.education.secondChoice,
                        thirdChoice: formData.criteria.education.thirdChoice,
                    },
                },
                {
                    criteria_name: "Schools",
                    weight_percentage: formData.criteria.schools.weight,
                    preference: {
                        schoolPreference:
                            formData.criteria.schools.schoolPreference,
                    },
                },
                {
                    criteria_name: "Additional Points",
                    weight_percentage:
                        formData.criteria.additionalPoints.weight,
                    preference: {
                        honor: formData.criteria.additionalPoints.honor,
                        multipleDegrees:
                            formData.criteria.additionalPoints.multipleDegrees,
                    },
                },
                {
                    criteria_name: "Certifications",
                    weight_percentage: formData.criteria.certificates.weight,
                    preference: {
                        preferred: formData.criteria.certificates.preferred,
                    },
                },
            ],
        };

        const res = await updateJobHiring(id, serializedData, authTokens);

        if (res) {
            alert("Job successfully updated");
            router.push("/COMPANY/CompanyHome");
        } else {
            alert("Failed to delete job.");
        }
    };

    const handleSettingsInputChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: value,
        };
        setFormData(updatedFormData);
    };

    const handleSettingsMultiSelect = (category, field, option) => {
        setFormData((prev) => {
            const selectedOptions = prev.criteria[category][field] || [];
            const isSelected = selectedOptions.includes(option);
            const updatedOptions = isSelected
                ? selectedOptions.filter((item) => item !== option)
                : [...selectedOptions, option];

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

    const handleAddCustomOption = (category, field, customOption) => {
        if (!customOption.trim()) return; // Prevent empty input

        setOptions((prev) => ({
            ...prev,
            [category]: prev[category]?.includes(customOption)
                ? prev[category]
                : [...(prev[category] || []), customOption], // Add only if not exists
        }));

        handleSettingsMultiSelect(category, field, customOption);

        setSearchTerm((prev) => ({ ...prev, [field]: "" })); // Reset only the relevant search field
    };

    const handleSettingsRemoveSelectedOption = (category, field, option) => {
        setFormData((prev) => ({
            ...prev,
            criteria: {
                ...prev.criteria,
                [category]: {
                    ...prev.criteria[category],
                    [field]: prev.criteria[category][field].filter(
                        (item) => item !== option
                    ),
                },
            },
        }));
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

    // Get today's date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split("T")[0];

    return (
        <div>
            <CompanyHeader />
            <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-4 xxsm:px-4 mx-auto">
                <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-5">
                    Job Hiring Details{" "}
                </h1>

                <div className="flex flex-row justify-end px-5 pb-5">
                    <button
                        type="button"
                        className="button1 flex flex-col items-center justify-center mr-10"
                        onClick={handleViewApplicantSummary}
                    >
                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                            {" "}
                            View Applicants Summary{" "}
                        </p>
                    </button>
                    <div onClick={handleDelete} className="cursor-pointer">
                        <Image
                            src="/Delete.png"
                            width={30}
                            height={15}
                            alt="Delete Icon"
                        />
                    </div>
                </div>
                <form>
                    <div className="flex lg:flex-row mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col gap-5 pb-8">
                        <div className="job-application-box px-8 py-5 mx-auto self-start lg:sticky mb:sticky top-20">
                            <p className="font-semibold lg:text-large mb:text-large sm:text-large text-primary">
                                Edit Job Hiring Information
                            </p>

                            <div className="flex items-center pt-2 pb-2">
                                <div className="w-full bg-background h-.5 border-2 border-primary rounded-full relative">
                                    <div
                                        className="relative h-.5 rounded-full transition-all duration-300 bg-primary"
                                        style={{ width: "100%" }}
                                    ></div>
                                </div>
                            </div>

                            <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-5">
                                Edit or update all required job hiring details.
                            </p>
                            {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                        Job Title
                                    </label>
                                    <input
                                        name="job_title"
                                        value={formData.job_title}
                                        onChange={handleInputChange}
                                        placeholder="Job Title"
                                        className="h-medium rounded-xs border-2 border-fontcolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall"
                                    />
                                </div>

                                <div>
                                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall  text-fontcolor font-semibold mb-1">
                                        Job Industry
                                    </label>
                                    <input
                                        type="text"
                                        name="job_industry"
                                        value={formData.job_industry}
                                        onChange={handleInputChange}
                                        placeholder="Job Industry"
                                        className="h-medium rounded-xs border-2  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall border-fontcolor"
                                    />
                                </div>

                                <div className="col-span-2 gap-3">
                                    <div className="mb-4">
                                        <div>
                                            <label className="block  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall font-semibold text-fontcolor mb-1">
                                                Specialization
                                            </label>
                                            <div
                                                className="w-full border-2 border-black rounded-lg px-4 py-2  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                onClick={() =>
                                                    setDropdownOpen({
                                                        ...dropdownOpen,
                                                        specoption:
                                                            !dropdownOpen.specoption,
                                                    })
                                                }
                                            >
                                                {formData.specialization
                                                    .length > 0 ? (
                                                    formData.specialization.map(
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
                                                    <span className="text-fontcolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall">
                                                        Select Specialization
                                                    </span>
                                                )}
                                                <FaChevronDown
                                                    className={`ml-auto transform ${
                                                        dropdownOpen.specoption
                                                            ? "rotate-180"
                                                            : "rotate-0"
                                                    } transition-transform`}
                                                />
                                            </div>

                                            {dropdownOpen.specoption && (
                                                <div className="top-full mt-1 w-full border border-gray-300 rounded-xs bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                                    {/* Search Box */}
                                                    <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                        <input
                                                            type="text"
                                                            placeholder="Search options..."
                                                            value={
                                                                searchTerm.specoption ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setSearchTerm({
                                                                    ...searchTerm,
                                                                    specoption:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                        />
                                                    </div>

                                                    {/* Specialization Options */}
                                                    {options.specialization
                                                        .filter((option) =>
                                                            option
                                                                .toLowerCase()
                                                                .includes(
                                                                    (
                                                                        searchTerm.specoption ||
                                                                        ""
                                                                    ).toLowerCase()
                                                                )
                                                        )
                                                        .map(
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
                                                                        checked={formData.specialization.includes(
                                                                            option
                                                                        )}
                                                                        onChange={() =>
                                                                            handleMultiSelectChange(
                                                                                option
                                                                            )
                                                                        }
                                                                        className="ml-5 w-5 h-5"
                                                                    />
                                                                    <span className=" lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall ml-5">
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

                                <div className="col-span-2 gap-3">
                                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                        Job Description
                                    </label>
                                    <textarea
                                        type="text"
                                        name="job_description"
                                        value={formData.job_description}
                                        onChange={handleInputChange}
                                        placeholder="Job Description"
                                        className="w-full p-1 rounded-xs border-2 border-fontcolor  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor h-20"
                                    ></textarea>
                                </div>

                                <div className="col-span-2 gap-3">
                                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        value={companyName}
                                        onChange={handleInputChange}
                                        placeholder="Company Name"
                                        className="h-medium rounded-xs border-2  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall border-fontcolor"
                                        disabled
                                    />
                                </div>

                                <div className="flex space-x-2 col-span-2">
                                    <div className="w-1/2">
                                        <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                            Region{" "}
                                        </label>
                                        <select
                                            className="valid:text-fontcolor invalid:text-placeholder mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall border-2 border-black h-medium rounded-xs w-full text-sm text-gray-500"
                                            id="region"
                                            name="region"
                                            value={formData.region}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option
                                                value=""
                                                disabled
                                                selected
                                                hidden
                                            >
                                                Select Region
                                            </option>
                                            {regions.map((region) => (
                                                <option
                                                    key={region.id}
                                                    value={region.id}
                                                >
                                                    {region.n}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-1/2">
                                        <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                            City/Municipality
                                        </label>
                                        <select
                                            className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall border-2 border-black h-medium rounded-xs w-full"
                                            id="province"
                                            name="province"
                                            value={formData.province}
                                            onChange={handleInputChange}
                                        >
                                            <option
                                                value=""
                                                disabled
                                                selected
                                                hidden
                                            >
                                                Select Province
                                            </option>
                                            {provinces.map(
                                                (province, index) => (
                                                    <option
                                                        key={index}
                                                        value={province.n}
                                                    >
                                                        {province.n}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-span-2 gap-3">
                                    <div className="w-full">
                                        <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                            City
                                        </label>
                                        <select
                                            className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall border-2 border-black h-medium rounded-xs w-full"
                                            id="city"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                        >
                                            <option
                                                value=""
                                                disabled
                                                selected
                                                hidden
                                            >
                                                Select City
                                            </option>
                                            {cities.map((city, index) => (
                                                <option
                                                    key={index}
                                                    value={city.n}
                                                >
                                                    {city.n}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex space-x-6 mt-1 col-span-2">
                                    <div className="w-1/2">
                                        <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                            Work Setup
                                        </label>
                                        <select
                                            name="work_setup"
                                            value={formData.work_setup}
                                            onChange={handleInputChange}
                                            className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall"
                                        >
                                            <option value="" disabled selected>
                                                Work Setup
                                            </option>
                                            <option value="On-Site">
                                                Onsite
                                            </option>
                                            <option value="Remote">
                                                Remote
                                            </option>
                                            <option value="Hybrid">
                                                Hybrid
                                            </option>
                                        </select>
                                    </div>

                                    <div className="w-1/2">
                                        <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                            Employment Type
                                        </label>
                                        <select
                                            name="employment_type"
                                            value={formData.employment_type}
                                            onChange={handleInputChange}
                                            className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall"
                                        >
                                            <option value="" disabled>
                                                {" "}
                                                Employment Type
                                            </option>
                                            <option value="Full-Time">
                                                Full-Time
                                            </option>
                                            <option value="Part-Time">
                                                Part-Time
                                            </option>
                                            <option value="Contract">
                                                Contract
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                        Qualifications
                                    </label>
                                    <textarea
                                        name="qualifications"
                                        placeholder="Qualifications"
                                        value={formData.qualifications}
                                        onChange={handleInputChange}
                                        className="w-full p-1 rounded-xs border-2 border-fontcolor  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor h-20"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="py-1">
                                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold pb-2 ">
                                    Schedule
                                </p>
                                <div className="grid grid-cols-3 gap-1  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall">
                                    {[
                                        "8 hrs shift",
                                        "12 hrs shift",
                                        "14 hrs shift",
                                        "Day shift",
                                        "Night shift",
                                        "Graveyard shift",
                                    ].map((shift) => (
                                        <button
                                            key={shift}
                                            type="button"
                                            name="schedule"
                                            className={`border-2 border-black p-1 text-fontcolor rounded-xs ${
                                                formData.schedule === shift
                                                    ? "bg-primary text-white"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleScheduleSelect(shift)
                                            }
                                        >
                                            {shift}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="py-1">
                                <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                    Benefits
                                </label>
                                <textarea
                                    name="benefits"
                                    placeholder="Benefits"
                                    value={formData.benefits}
                                    onChange={handleInputChange}
                                    className="w-full p-1 rounded-xs border-2 border-fontcolor  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor h-15"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                        Experience Level
                                    </label>
                                    <select
                                        name="experience_level"
                                        value={formData.experience_level}
                                        onChange={handleInputChange}
                                        className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall"
                                    >
                                        <option value="">
                                            Experience Level
                                        </option>
                                        <option value="Internship">
                                            Internship
                                        </option>
                                        <option value="Entry Level">
                                            Entry
                                        </option>
                                        <option value="Mid-Level">Mid</option>
                                        <option value="Senior Level">
                                            Senior
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                        No. of Positions
                                    </label>
                                    <input
                                        type="number"
                                        name="num_positions"
                                        value={formData.num_positions}
                                        onChange={handleInputChange}
                                        placeholder="No. of Positions"
                                        className="h-medium rounded-xs border-2  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall border-fontcolor"
                                    />
                                </div>

                                <div className="flex space-x-4 mt-4 col-span-2">
                                    <div className="w-1/2">
                                        <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                            Salary Minimum
                                        </label>
                                        <input
                                            type="number"
                                            name="salary_min"
                                            value={formData.salary_min}
                                            onChange={handleInputChange}
                                            placeholder="Salary Minimum"
                                            className="h-medium rounded-xs border-2  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall border-fontcolor"
                                        />
                                    </div>

                                    <div className="w-1/2">
                                        <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor font-semibold mb-1">
                                            Salary Maximum
                                        </label>
                                        <input
                                            type="number"
                                            name="salary_max"
                                            value={formData.salary_max}
                                            onChange={handleInputChange}
                                            placeholder="Salary Maximum"
                                            className="h-medium rounded-xs border-2  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall border-fontcolor"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 mt-3">
                                <div className="w-full">
                                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                                        Salary Frequency
                                    </label>
                                    <select
                                        name="salary_frequency"
                                        value={formData.salary_frequency}
                                        onChange={handleInputChange}
                                        className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"
                                    >
                                        <option value="">
                                            Select Frequency
                                        </option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Hourly">Hourly</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex flex-col">
                            <div className="pb-8">
                                <div className="flex gap-6">
                                    <div className="flex lg:flex-row mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col">
                                        {/* Settings */}
                                        <div className=" bg-white border-[2px] border-[#D9D9D9] shadow-[0_0_5px_2px_rgba(0,0,0,0.1)] rounded-lg p-6">
                                            {/* Required Documents */}
                                            <div className="w-full flex flex-col gap-6 h-max">
                                                <div className="">
                                                    <h2 className="text-lg font-semibold text-primary mb-2">
                                                        Required Documents
                                                    </h2>
                                                    <p className="text-sm text-fontcolor mt-1 mb-4">
                                                        Please make sure to
                                                        upload all the required
                                                        documents before the
                                                        deadline.
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
                                                                    handleDocumentChange(
                                                                        e,
                                                                        doc
                                                                    )
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
                                                <div className="mb-5">
                                                    <h2 className="text-lg font-semibold text-primary mb-2">
                                                        Date of Deadline
                                                    </h2>
                                                    <p className="text-sm text-fontcolor mt-1 mb-4">
                                                        Select the deadline date
                                                        for submitting the
                                                        required documents.
                                                    </p>
                                                    <input
                                                        type="date"
                                                        name="application_deadline"
                                                        value={
                                                            formData.application_deadline
                                                        }
                                                        onChange={
                                                            handleSettingsInputChange
                                                        }
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-fontcolor"
                                                        min={currentDate}
                                                    />
                                                </div>
                                            </div>
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
                                                                formData
                                                                    .criteria
                                                                    ?.workExperience
                                                                    ?.weight ||
                                                                ""
                                                            }
                                                            onChange={(e) => {
                                                                const value =
                                                                    e.target
                                                                        .value;
                                                                if (
                                                                    /^\d*$/.test(
                                                                        value
                                                                    ) &&
                                                                    Number(
                                                                        value
                                                                    ) <= 100
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
                                                                (Put roles that
                                                                are exactly
                                                                alike or have
                                                                equal importance
                                                                for the
                                                                position)
                                                            </span>
                                                        </label>

                                                        <div
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                            onClick={() =>
                                                                setDropdownOpen(
                                                                    {
                                                                        ...dropdownOpen,
                                                                        directly:
                                                                            !dropdownOpen.directly,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            {formData.criteria
                                                                .workExperience
                                                                .directlyRelevant
                                                                ?.length > 0 ? (
                                                                formData.criteria.workExperience.directlyRelevant.map(
                                                                    (
                                                                        selected,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
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
                                                                                    handleSettingsRemoveSelectedOption(
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
                                                                    Select
                                                                    Directly
                                                                    Relevant
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
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setSearchTerm(
                                                                                {
                                                                                    ...searchTerm,
                                                                                    directly:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                }
                                                                            )
                                                                        }
                                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                        onKeyDown={(
                                                                            e
                                                                        ) => {
                                                                            if (
                                                                                e.key ===
                                                                                "Enter"
                                                                            ) {
                                                                                handleAddCustomOption(
                                                                                    "workExperience",
                                                                                    "directlyRelevant",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                    {searchTerm.directly &&
                                                                        !options.workExperience.includes(
                                                                            searchTerm.directly
                                                                        ) && (
                                                                            <button
                                                                                className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                                onClick={() =>
                                                                                    handleAddCustomOption(
                                                                                        "workExperience",
                                                                                        "directlyRelevant",
                                                                                        searchTerm.directly
                                                                                    )
                                                                                }
                                                                            >
                                                                                Add
                                                                                "
                                                                                {
                                                                                    searchTerm.directly
                                                                                }

                                                                                "
                                                                            </button>
                                                                        )}
                                                                </div>

                                                                {/* Available Options List */}
                                                                {getFilteredOptions(
                                                                    "workExperience",
                                                                    "directlyRelevant"
                                                                ).map(
                                                                    (
                                                                        option,
                                                                        index
                                                                    ) => (
                                                                        <label
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                value={
                                                                                    option
                                                                                }
                                                                                checked={formData.criteria.workExperience.directlyRelevant.includes(
                                                                                    option
                                                                                )}
                                                                                onChange={() =>
                                                                                    handleSettingsMultiSelect(
                                                                                        "workExperience",
                                                                                        "directlyRelevant",
                                                                                        option
                                                                                    )
                                                                                }
                                                                                className="ml-5 w-5 h-5"
                                                                            />
                                                                            <span className="text-medium ml-5">
                                                                                {
                                                                                    option
                                                                                }
                                                                            </span>
                                                                        </label>
                                                                    )
                                                                )}
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
                                                                (Put roles with
                                                                significant
                                                                overlap in core
                                                                responsibilities)
                                                            </span>
                                                        </label>

                                                        <div
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                            onClick={() =>
                                                                setDropdownOpen(
                                                                    {
                                                                        ...dropdownOpen,
                                                                        highly: !dropdownOpen.highly,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            {/* Show selected options inside the input */}
                                                            {formData.criteria
                                                                .workExperience
                                                                .highlyRelevant
                                                                ?.length > 0 ? (
                                                                formData.criteria.workExperience.highlyRelevant.map(
                                                                    (
                                                                        selected,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
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
                                                                                    handleSettingsRemoveSelectedOption(
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
                                                                    Select
                                                                    Highly
                                                                    Relevant
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
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setSearchTerm(
                                                                                {
                                                                                    ...searchTerm,
                                                                                    highly: e
                                                                                        .target
                                                                                        .value,
                                                                                }
                                                                            )
                                                                        }
                                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                        onKeyDown={(
                                                                            e
                                                                        ) => {
                                                                            if (
                                                                                e.key ===
                                                                                "Enter"
                                                                            ) {
                                                                                handleAddCustomOption(
                                                                                    "workExperience",
                                                                                    "highlyRelevant",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                    {searchTerm.highly &&
                                                                        !options.workExperience.includes(
                                                                            searchTerm.highly
                                                                        ) && (
                                                                            <button
                                                                                className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                                onClick={() =>
                                                                                    handleAddCustomOption(
                                                                                        "workExperience",
                                                                                        "highlyRelevant",
                                                                                        searchTerm.highly
                                                                                    )
                                                                                }
                                                                            >
                                                                                Add
                                                                                "
                                                                                {
                                                                                    searchTerm.highly
                                                                                }

                                                                                "
                                                                            </button>
                                                                        )}
                                                                </div>

                                                                {/* Available Options List */}
                                                                {getFilteredOptions(
                                                                    "workExperience",
                                                                    "highlyRelevant"
                                                                ).map(
                                                                    (
                                                                        option,
                                                                        index
                                                                    ) => (
                                                                        <label
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                value={
                                                                                    option
                                                                                }
                                                                                checked={formData.criteria.workExperience.highlyRelevant.includes(
                                                                                    option
                                                                                )}
                                                                                onChange={() =>
                                                                                    handleSettingsMultiSelect(
                                                                                        "workExperience",
                                                                                        "highlyRelevant",
                                                                                        option
                                                                                    )
                                                                                }
                                                                                className="ml-5 w-5 h-5"
                                                                            />
                                                                            <span className="text-medium ml-5">
                                                                                {
                                                                                    option
                                                                                }
                                                                            </span>
                                                                        </label>
                                                                    )
                                                                )}
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
                                                                (Put roles in
                                                                the same domain
                                                                with some
                                                                transferable
                                                                skills)
                                                            </span>
                                                        </label>

                                                        <div
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                            onClick={() =>
                                                                setDropdownOpen(
                                                                    {
                                                                        ...dropdownOpen,
                                                                        moderately:
                                                                            !dropdownOpen.moderately,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            {/* Show selected options inside the input */}
                                                            {formData.criteria
                                                                .workExperience
                                                                .moderatelyRelevant
                                                                ?.length > 0 ? (
                                                                formData.criteria.workExperience.moderatelyRelevant.map(
                                                                    (
                                                                        selected,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
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
                                                                                    handleSettingsRemoveSelectedOption(
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
                                                                    Select
                                                                    Moderately
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
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setSearchTerm(
                                                                                {
                                                                                    ...searchTerm,
                                                                                    moderately:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                }
                                                                            )
                                                                        }
                                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                        onKeyDown={(
                                                                            e
                                                                        ) => {
                                                                            if (
                                                                                e.key ===
                                                                                "Enter"
                                                                            ) {
                                                                                handleAddCustomOption(
                                                                                    "workExperience",
                                                                                    "moderatelyRelevant",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                    {searchTerm.moderately &&
                                                                        !options.workExperience.includes(
                                                                            searchTerm.moderately
                                                                        ) && (
                                                                            <button
                                                                                className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                                onClick={() =>
                                                                                    handleAddCustomOption(
                                                                                        "workExperience",
                                                                                        "moderatelyRelevant",
                                                                                        searchTerm.moderately
                                                                                    )
                                                                                }
                                                                            >
                                                                                Add
                                                                                "
                                                                                {
                                                                                    searchTerm.moderately
                                                                                }

                                                                                "
                                                                            </button>
                                                                        )}
                                                                </div>

                                                                {/* Available Options List */}
                                                                {getFilteredOptions(
                                                                    "workExperience",
                                                                    "moderatelyRelevant"
                                                                ).map(
                                                                    (
                                                                        option,
                                                                        index
                                                                    ) => (
                                                                        <label
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                value={
                                                                                    option
                                                                                }
                                                                                checked={formData.criteria.workExperience.moderatelyRelevant.includes(
                                                                                    option
                                                                                )}
                                                                                onChange={() =>
                                                                                    handleSettingsMultiSelect(
                                                                                        "workExperience",
                                                                                        "moderatelyRelevant",
                                                                                        option
                                                                                    )
                                                                                }
                                                                                className="ml-5 w-5 h-5"
                                                                            />
                                                                            <span className="text-medium ml-5">
                                                                                {
                                                                                    option
                                                                                }
                                                                            </span>
                                                                        </label>
                                                                    )
                                                                )}
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
                                                                    formData
                                                                        .criteria
                                                                        .skills
                                                                        .weight ||
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const value =
                                                                        e.target
                                                                            .value;
                                                                    if (
                                                                        /^\d*$/.test(
                                                                            value
                                                                        ) &&
                                                                        Number(
                                                                            value
                                                                        ) <= 100
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
                                                                    (Put roles
                                                                    with the
                                                                    most
                                                                    relevant
                                                                    skills and
                                                                    experience){" "}
                                                                </span>
                                                            </label>

                                                            <div
                                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                                onClick={() =>
                                                                    setDropdownOpen(
                                                                        {
                                                                            ...dropdownOpen,
                                                                            primary:
                                                                                !dropdownOpen.primary,
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                {/* Show selected options inside the input */}
                                                                {formData
                                                                    .criteria
                                                                    .skills
                                                                    .primarySkills
                                                                    ?.length >
                                                                0 ? (
                                                                    formData.criteria.skills.primarySkills.map(
                                                                        (
                                                                            selected,
                                                                            index
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
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
                                                                                        handleSettingsRemoveSelectedOption(
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
                                                                        Select
                                                                        Primary
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
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setSearchTerm(
                                                                                    {
                                                                                        ...searchTerm,
                                                                                        primary:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                            onKeyDown={(
                                                                                e
                                                                            ) => {
                                                                                if (
                                                                                    e.key ===
                                                                                    "Enter"
                                                                                ) {
                                                                                    handleAddCustomOption(
                                                                                        "skills",
                                                                                        "primarySkills",
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                        {searchTerm.primary &&
                                                                            !options.skills.includes(
                                                                                searchTerm.primary
                                                                            ) && (
                                                                                <button
                                                                                    className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                                    onClick={() =>
                                                                                        handleAddCustomOption(
                                                                                            "skills",
                                                                                            "primarySkills",
                                                                                            searchTerm.primary
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Add
                                                                                    "
                                                                                    {
                                                                                        searchTerm.primary
                                                                                    }

                                                                                    "
                                                                                </button>
                                                                            )}
                                                                    </div>

                                                                    {/* Available Options List */}
                                                                    {getFilteredOptions(
                                                                        "skills",
                                                                        "primarySkills"
                                                                    ).map(
                                                                        (
                                                                            option,
                                                                            index
                                                                        ) => (
                                                                            <label
                                                                                key={
                                                                                    index
                                                                                }
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
                                                                                        handleSettingsMultiSelect(
                                                                                            "skills",
                                                                                            "primarySkills",
                                                                                            option
                                                                                        )
                                                                                    }
                                                                                    className="ml-5 w-5 h-5"
                                                                                />
                                                                                <span className="text-medium ml-5">
                                                                                    {
                                                                                        option
                                                                                    }
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
                                                                    (Put
                                                                    important
                                                                    skills that
                                                                    are
                                                                    frequently
                                                                    used but not
                                                                    absolutely
                                                                    essential){" "}
                                                                </span>
                                                            </label>

                                                            <div
                                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                                onClick={() =>
                                                                    setDropdownOpen(
                                                                        {
                                                                            ...dropdownOpen,
                                                                            secondary:
                                                                                !dropdownOpen.secondary,
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                {/* Show selected options inside the input */}
                                                                {formData
                                                                    .criteria
                                                                    .skills
                                                                    .secondarySkills
                                                                    ?.length >
                                                                0 ? (
                                                                    formData.criteria.skills.secondarySkills.map(
                                                                        (
                                                                            selected,
                                                                            index
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
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
                                                                                        handleSettingsRemoveSelectedOption(
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
                                                                        Select
                                                                        Secondary
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
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setSearchTerm(
                                                                                    {
                                                                                        ...searchTerm,
                                                                                        secondary:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                            onKeyDown={(
                                                                                e
                                                                            ) => {
                                                                                if (
                                                                                    e.key ===
                                                                                    "Enter"
                                                                                ) {
                                                                                    handleAddCustomOption(
                                                                                        "skills",
                                                                                        "secondarySkills",
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                        {searchTerm.secondary &&
                                                                            !options.skills.includes(
                                                                                searchTerm.secondary
                                                                            ) && (
                                                                                <button
                                                                                    className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                                    onClick={() =>
                                                                                        handleAddCustomOption(
                                                                                            "skills",
                                                                                            "secondarySkills",
                                                                                            searchTerm.secondary
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Add
                                                                                    "
                                                                                    {
                                                                                        searchTerm.secondary
                                                                                    }

                                                                                    "
                                                                                </button>
                                                                            )}
                                                                    </div>

                                                                    {/* Available Options List */}
                                                                    {getFilteredOptions(
                                                                        "skills",
                                                                        "secondarySkills"
                                                                    ).map(
                                                                        (
                                                                            option,
                                                                            index
                                                                        ) => (
                                                                            <label
                                                                                key={
                                                                                    index
                                                                                }
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
                                                                                        handleSettingsMultiSelect(
                                                                                            "skills",
                                                                                            "secondarySkills",
                                                                                            option
                                                                                        )
                                                                                    }
                                                                                    className="ml-5 w-5 h-5"
                                                                                />
                                                                                <span className="text-medium ml-5">
                                                                                    {
                                                                                        option
                                                                                    }
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
                                                                Additional
                                                                Skills{" "}
                                                                <span className="font-medium text-xsmall">
                                                                    {" "}
                                                                    (nice-to-have
                                                                    skills that
                                                                    would give a
                                                                    candidate an
                                                                    edge but
                                                                    aren't
                                                                    necessary
                                                                    for the core
                                                                    job
                                                                    functions)
                                                                </span>
                                                            </label>

                                                            <div
                                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                                onClick={() =>
                                                                    setDropdownOpen(
                                                                        {
                                                                            ...dropdownOpen,
                                                                            additional:
                                                                                !dropdownOpen.additional,
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                {/* Show selected options inside the input */}
                                                                {formData
                                                                    .criteria
                                                                    .skills
                                                                    .additionalSkills
                                                                    ?.length >
                                                                0 ? (
                                                                    formData.criteria.skills.additionalSkills.map(
                                                                        (
                                                                            selected,
                                                                            index
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
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
                                                                                        handleSettingsRemoveSelectedOption(
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
                                                                        Select
                                                                        Additional
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
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setSearchTerm(
                                                                                    {
                                                                                        ...searchTerm,
                                                                                        additional:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                            onKeyDown={(
                                                                                e
                                                                            ) => {
                                                                                if (
                                                                                    e.key ===
                                                                                    "Enter"
                                                                                ) {
                                                                                    handleAddCustomOption(
                                                                                        "skills",
                                                                                        "additionalSkills",
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                        {searchTerm.additional &&
                                                                            !options.skills.includes(
                                                                                searchTerm.additional
                                                                            ) && (
                                                                                <button
                                                                                    className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                                    onClick={() =>
                                                                                        handleAddCustomOption(
                                                                                            "skills",
                                                                                            "additionalSkills",
                                                                                            searchTerm.additional
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Add
                                                                                    "
                                                                                    {
                                                                                        searchTerm.additional
                                                                                    }

                                                                                    "
                                                                                </button>
                                                                            )}
                                                                    </div>

                                                                    {/* Available Options List */}
                                                                    {getFilteredOptions(
                                                                        "skills",
                                                                        "additionalSkills"
                                                                    ).map(
                                                                        (
                                                                            option,
                                                                            index
                                                                        ) => (
                                                                            <label
                                                                                key={
                                                                                    index
                                                                                }
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
                                                                                        handleSettingsMultiSelect(
                                                                                            "skills",
                                                                                            "additionalSkills",
                                                                                            option
                                                                                        )
                                                                                    }
                                                                                    className="ml-5 w-5 h-5"
                                                                                />
                                                                                <span className="text-medium ml-5">
                                                                                    {
                                                                                        option
                                                                                    }
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
                                                                        formData
                                                                            .criteria
                                                                            .education
                                                                            .weight ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const value =
                                                                            e
                                                                                .target
                                                                                .value;
                                                                        // Allow only numbers and validate the range
                                                                        if (
                                                                            /^\d*$/.test(
                                                                                value
                                                                            ) &&
                                                                            Number(
                                                                                value
                                                                            ) <=
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

                                                        {/* 1st Choice Field of Study */}
                                                        <div className="mb-4">
                                                            <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                                1st Choice Field
                                                                of Study{" "}
                                                                <span className="font-medium text-xsmall">
                                                                    (Put the
                                                                    most
                                                                    directly
                                                                    relevant
                                                                    fields of
                                                                    study for
                                                                    the
                                                                    position)
                                                                </span>
                                                            </label>

                                                            <div
                                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between"
                                                                onClick={() =>
                                                                    setDropdownOpen(
                                                                        {
                                                                            ...dropdownOpen,
                                                                            firstChoice:
                                                                                !dropdownOpen.firstChoice,
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                <span>
                                                                    {formData
                                                                        .criteria
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
                                                                            placeholder="Search options..."
                                                                            value={
                                                                                searchTerm.firstChoice ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setSearchTerm(
                                                                                    {
                                                                                        ...searchTerm,
                                                                                        firstChoice:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                        />
                                                                    </div>

                                                                    {getFilteredOptions(
                                                                        "education",
                                                                        "firstChoice"
                                                                    ).map(
                                                                        (
                                                                            option,
                                                                            index
                                                                        ) => (
                                                                            <label
                                                                                key={
                                                                                    index
                                                                                }
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
                                                                                    {
                                                                                        option
                                                                                    }
                                                                                </span>
                                                                            </label>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* 2nd Choice Field of Study */}
                                                        <div className="mb-4">
                                                            <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                                2nd Choice Field
                                                                of Study
                                                                <span className="font-medium text-xsmall">
                                                                    (Put closely
                                                                    related
                                                                    fields that
                                                                    have
                                                                    significant
                                                                    overlap with
                                                                    the job
                                                                    requirements)
                                                                </span>
                                                            </label>
                                                            <div
                                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between"
                                                                onClick={() =>
                                                                    setDropdownOpen(
                                                                        {
                                                                            ...dropdownOpen,
                                                                            secondChoice:
                                                                                !dropdownOpen.secondChoice,
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                <span>
                                                                    {formData
                                                                        .criteria
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
                                                                            placeholder="Search options..."
                                                                            value={
                                                                                searchTerm.secondChoice ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setSearchTerm(
                                                                                    {
                                                                                        ...searchTerm,
                                                                                        secondChoice:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                        />
                                                                    </div>

                                                                    {getFilteredOptions(
                                                                        "education",
                                                                        "secondChoice"
                                                                    ).map(
                                                                        (
                                                                            option,
                                                                            index
                                                                        ) => (
                                                                            <label
                                                                                key={
                                                                                    index
                                                                                }
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
                                                                                    {
                                                                                        option
                                                                                    }
                                                                                </span>
                                                                            </label>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* 3rd Choice Field of Study */}
                                                        <div className="mb-4">
                                                            <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                                3rd Choice Field
                                                                of Study
                                                                <span className="font-medium text-xsmall">
                                                                    (Put fields
                                                                    that have
                                                                    some
                                                                    relevance or
                                                                    provide
                                                                    useful
                                                                    background
                                                                    knowledge)
                                                                </span>
                                                            </label>
                                                            <div
                                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex items-center justify-between"
                                                                onClick={() =>
                                                                    setDropdownOpen(
                                                                        {
                                                                            ...dropdownOpen,
                                                                            thirdChoice:
                                                                                !dropdownOpen.thirdChoice,
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                <span>
                                                                    {formData
                                                                        .criteria
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
                                                                            placeholder="Search options..."
                                                                            value={
                                                                                searchTerm.thirdChoice ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setSearchTerm(
                                                                                    {
                                                                                        ...searchTerm,
                                                                                        thirdChoice:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                        />
                                                                    </div>

                                                                    {getFilteredOptions(
                                                                        "education",
                                                                        "secondChoice"
                                                                    ).map(
                                                                        (
                                                                            option,
                                                                            index
                                                                        ) => (
                                                                            <label
                                                                                key={
                                                                                    index
                                                                                }
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
                                                                                    {
                                                                                        option
                                                                                    }
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
                                                                (Put any
                                                                preferred
                                                                institutions, if
                                                                applicable){" "}
                                                            </span>
                                                        </label>

                                                        <div
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                            onClick={() =>
                                                                setDropdownOpen(
                                                                    {
                                                                        ...dropdownOpen,
                                                                        school: !dropdownOpen.school,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            {/* Show selected options inside the input */}
                                                            {formData.criteria
                                                                .schools
                                                                .schoolPreference
                                                                ?.length > 0 ? (
                                                                formData.criteria.schools.schoolPreference.map(
                                                                    (
                                                                        selected,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
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
                                                                                    handleSettingsRemoveSelectedOption(
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
                                                                    Select
                                                                    Preferred
                                                                    School
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
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setSearchTerm(
                                                                                {
                                                                                    ...searchTerm,
                                                                                    school: e
                                                                                        .target
                                                                                        .value,
                                                                                }
                                                                            )
                                                                        }
                                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                        onKeyDown={(
                                                                            e
                                                                        ) => {
                                                                            if (
                                                                                e.key ===
                                                                                "Enter"
                                                                            ) {
                                                                                handleAddCustomOption(
                                                                                    "schools",
                                                                                    "schoolPreference",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                    {searchTerm.school &&
                                                                        !options.schools.includes(
                                                                            searchTerm.school
                                                                        ) && (
                                                                            <button
                                                                                className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                                onClick={() =>
                                                                                    handleAddCustomOption(
                                                                                        "schools",
                                                                                        "schoolPreference",
                                                                                        searchTerm.school
                                                                                    )
                                                                                }
                                                                            >
                                                                                Add
                                                                                "
                                                                                {
                                                                                    searchTerm.school
                                                                                }

                                                                                "
                                                                            </button>
                                                                        )}
                                                                </div>

                                                                {/* Available Options List */}
                                                                {getFilteredOptions(
                                                                    "schools",
                                                                    "schoolPreference"
                                                                ).map(
                                                                    (
                                                                        option,
                                                                        index
                                                                    ) => (
                                                                        <label
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                value={
                                                                                    option
                                                                                }
                                                                                checked={formData.criteria.schools.schoolPreference?.includes(
                                                                                    option
                                                                                )}
                                                                                onChange={() =>
                                                                                    handleSettingsMultiSelect(
                                                                                        "schools",
                                                                                        "schoolPreference",
                                                                                        option
                                                                                    )
                                                                                }
                                                                                className="ml-5 w-5 h-5"
                                                                            />
                                                                            <span className="text-medium ml-5">
                                                                                {
                                                                                    option
                                                                                }
                                                                            </span>
                                                                        </label>
                                                                    )
                                                                )}
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
                                                                .additionalPoints
                                                                .honor === "1"
                                                        }
                                                        onChange={(e) =>
                                                            setFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    criteria: {
                                                                        ...prev.criteria,
                                                                        additionalPoints:
                                                                            {
                                                                                ...prev
                                                                                    .criteria
                                                                                    .additionalPoints,
                                                                                honor: e
                                                                                    .target
                                                                                    .checked
                                                                                    ? "1"
                                                                                    : "0",
                                                                            },
                                                                    },
                                                                })
                                                            )
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
                                                                .multipleDegrees ===
                                                            "1"
                                                        }
                                                        onChange={(e) =>
                                                            setFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    criteria: {
                                                                        ...prev.criteria,
                                                                        additionalPoints:
                                                                            {
                                                                                ...prev
                                                                                    .criteria
                                                                                    .additionalPoints,
                                                                                multipleDegrees:
                                                                                    e
                                                                                        .target
                                                                                        .checked
                                                                                        ? "1"
                                                                                        : "0",
                                                                            },
                                                                    },
                                                                })
                                                            )
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
                                                                formData
                                                                    .criteria
                                                                    .certificates
                                                                    .weight ||
                                                                ""
                                                            }
                                                            onChange={(e) => {
                                                                const value =
                                                                    e.target
                                                                        .value;
                                                                // Allow only numbers and validate the range
                                                                if (
                                                                    /^\d*$/.test(
                                                                        value
                                                                    ) &&
                                                                    Number(
                                                                        value
                                                                    ) <= 100
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

                                                <div className="mb-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-fontcolor mb-1">
                                                            Certificate
                                                            Preference{" "}
                                                            <span className="font-medium text-xsmall">
                                                                (Select any
                                                                preferred
                                                                certificates, if
                                                                applicable)
                                                            </span>
                                                        </label>

                                                        <div
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                            onClick={() =>
                                                                setDropdownOpen(
                                                                    {
                                                                        ...dropdownOpen,
                                                                        certicatePrefered:
                                                                            !dropdownOpen.certicatePrefered,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            {/* Show selected options inside the input */}
                                                            {formData.criteria
                                                                .certificates
                                                                .preferred
                                                                ?.length > 0 ? (
                                                                formData.criteria.certificates.preferred.map(
                                                                    (
                                                                        selected,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
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
                                                                                    handleSettingsRemoveSelectedOption(
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
                                                                    Select
                                                                    Preferred
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
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setSearchTerm(
                                                                                {
                                                                                    ...searchTerm,
                                                                                    certicatePrefered:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                }
                                                                            )
                                                                        }
                                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                        onKeyDown={(
                                                                            e
                                                                        ) => {
                                                                            if (
                                                                                e.key ===
                                                                                "Enter"
                                                                            ) {
                                                                                handleAddCustomOption(
                                                                                    "certificates",
                                                                                    "preferred",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                    {searchTerm.certicatePrefered &&
                                                                        !options.certificates.includes(
                                                                            searchTerm.certicatePrefered
                                                                        ) && (
                                                                            <button
                                                                                className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-md"
                                                                                onClick={() =>
                                                                                    handleAddCustomOption(
                                                                                        "certificates",
                                                                                        "preferred",
                                                                                        searchTerm.certicatePrefered
                                                                                    )
                                                                                }
                                                                            >
                                                                                Add
                                                                                "
                                                                                {
                                                                                    searchTerm.certicatePrefered
                                                                                }

                                                                                "
                                                                            </button>
                                                                        )}
                                                                </div>

                                                                {/* Available Options List */}
                                                                {getFilteredOptions(
                                                                    "certificates",
                                                                    "preferred"
                                                                ).map(
                                                                    (
                                                                        option,
                                                                        index
                                                                    ) => (
                                                                        <label
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                value={
                                                                                    option
                                                                                }
                                                                                checked={formData.criteria.certificates.preferred?.includes(
                                                                                    option
                                                                                )}
                                                                                onChange={() =>
                                                                                    handleSettingsMultiSelect(
                                                                                        "certificates",
                                                                                        "preferred",
                                                                                        option
                                                                                    )
                                                                                }
                                                                                className="ml-5 w-5 h-5"
                                                                            />
                                                                            <span className="text-medium ml-5">
                                                                                {
                                                                                    option
                                                                                }
                                                                            </span>
                                                                        </label>
                                                                    )
                                                                )}
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
                                                                onChange={
                                                                    handleSettingsInputChange
                                                                }
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
                                                    className=" border border-gray-300 rounded-lg px-4 py-2 text-sm text-fontcolor"
                                                    name="verification_option"
                                                    value={
                                                        formData.verification_option
                                                    }
                                                    onChange={
                                                        handleSettingsInputChange
                                                    }
                                                >
                                                    <option value="Score Unverified Credential Fully">
                                                        Score Unverified
                                                        Credential Fully
                                                    </option>
                                                    <option value="Score Unverified Credential 50%">
                                                        Score Unverified
                                                        Credential 50%
                                                    </option>
                                                    <option value="Ignore Unverified Credentials">
                                                        Ignore Unverified
                                                        Credentials
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
                                                    value={
                                                        formData.additional_notes
                                                    }
                                                    onChange={
                                                        handleSettingsInputChange
                                                    }
                                                    className="w-full p-1 rounded-xs border-2 border-fontcolor text-fontcolor h-20"
                                                ></textarea>
                                            </div>

                                            <div className="flex justify-end mt-8">
                                                <button
                                                    type="button"
                                                    onClick={handleSubmit}
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
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <GeneralFooter />
        </div>
    );
}
