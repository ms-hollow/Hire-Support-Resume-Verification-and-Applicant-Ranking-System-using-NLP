import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import phLocations from "@/public/placeHolder/philippines.json";
import { getCompany } from "../api/companyApi";
import AuthContext from "../context/AuthContext";
import Cookies from "js-cookie";
import { getCookie } from "../utils/cookieUtils";
import { toast } from 'react-toastify';
import ToastWrapper from "@/components/ToastWrapper";



export default function CreateJob() {
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [options, setOptions] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [companyName, setCompanyName] = useState("");
    let { authTokens } = useContext(AuthContext);
    const router = useRouter();


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
    });

    //* Set ang formdata
    useEffect(() => {
        const storedData = getCookie("DRAFT_DATA");

        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setFormData(parsedData);

            // Load provinces and cities based on stored region and province
            if (parsedData.region) {
                const selectedRegion = phLocations.find(
                    (region) => region.id === parsedData.region
                );
                const provincesList = selectedRegion ? selectedRegion.p : [];
                setProvinces(provincesList);

                if (parsedData.province) {
                    const selectedProvince = provincesList.find(
                        (province) => province.n === parsedData.province
                    );
                    setCities(selectedProvince ? selectedProvince.c : []);
                }
            }
        }
    }, []);

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

                //* Remove this if you don't want to alert the user once mount
                if (companyData?.profile_data?.company_name === null) {
                    toast.error("Please complete your company profile.");
                }

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
    const validateForm = () => {
        let errors = {};

        if (!formData.job_title) errors.job_title = "Job title is required.";
        if (!formData.job_industry)
            errors.job_industry = "Job industry is required.";
        if (!formData.specialization.length)
            errors.specialization = "Specialization is required.";
        if (!formData.schedule) errors.schedule = "Schedule is required.";
        if (!formData.job_description)
            errors.job_description = "Job description is required.";
        if (!formData.region) errors.region = "Region is required.";
        if (!formData.province) errors.province = "Province is required.";
        if (!formData.city) errors.city = "City is required.";

        if (formData.salary_min < 0 || formData.salary_max < 0) {
            errors.salary = "Salary cannot be negative.";
        }

        if (formData.salary_min < 20) {
            errors.salary_min = "Minimum salary must not be less than 20.";
        }

        if (formData.salary_max > 1000000) {
            errors.salary_max = "Maximum salary must not exceed 1,000,000.";
        }

        if (Number(formData.salary_min) >= Number(formData.salary_max)) {
            errors.salary = "Minimum salary must be less than maximum salary.";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (companyName === "Unknown Company") {
            toast.error("Please complete your company profile.");
            return;
        }

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            toast.error(
                `Please fix the following errors:\n\n${Object.values(
                    errors
                ).join("\n")}`
            );
            return;
        }

        Cookies.set("DRAFT_DATA", JSON.stringify(formData), {
            expires: 1,
        });
        router.push(`/COMPANY/CompanySettings`);
    };

    //* Pressing the browser's back button will delete the draft data stored in local storage.
    useEffect(() => {
        const handleBackButton = () => {
            Cookies.remove("DRAFT_DATA");
        };

        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, []);

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

    const handleSingleSelectChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    
        if (field === "job_title") {
            const foundIndustry = options?.jobIndustries?.find((industry) =>
                industry.roles?.some((role) =>
                    typeof role === "object"
                        ? role.title === value
                        : role === value
                )
            );
    
            const selectedRole = foundIndustry?.roles?.find((role) =>
                typeof role === "object" ? role.title === value : role === value
            );
    
            // Set Job Industry
            if (foundIndustry) {
                setFormData((prev) => ({
                    ...prev,
                    job_industry: foundIndustry.industry,
                }));
            }
    
            // Save relevant roles to cookies or local storage for use in CompanySettings
            if (typeof selectedRole === "object" && selectedRole.relevance) {
                const relevanceData = selectedRole.relevance;
                Cookies.set("RELEVANT_ROLES", JSON.stringify(relevanceData), { expires: 1 });
            } else {
                Cookies.remove("RELEVANT_ROLES");
            }
        }
    
        setDropdownOpen((prev) => ({
            ...prev,
            [field]: false,
        }));
    };
    

    const allJobTitles = (options?.jobIndustries || []).flatMap((industryObj) =>
        industryObj.roles.map((role) => ({
          title: role.title || role,
          industry: industryObj.industry,
        }))
      );
      
    return (
        <div>
            <CompanyHeader />
            <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-4 xxsm:px-4 mx-auto">
                <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-5">
                    Create Job Hiring
                </h1>

                <div className="flex items-center justify-center pb-8">
                    <div className="job-application-box px-8 py-5 mx-auto">
                        <p className="font-semibold lg:text-large mb:text-large sm:text-large text-primary">
                            Job Hiring Information
                        </p>

                        <div className="flex items-center pt-2 pb-2">
                            <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                                <div
                                    className="relative h-1 rounded-full transition-all duration-300 bg-primary"
                                    style={{ width: "33.33%" }}
                                ></div>
                            </div>
                        </div>

                        <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-5">
                            Fill out all required job hiring details.
                        </p>
                        {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2 gap-3">
                                <div>
                                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall font-semibold text-fontcolor mb-1">
                                        Job Title
                                    </label>
                                    <div className="w-full border-2 border-black rounded-lg px-4 py-2 lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor cursor-pointer flex items-center justify-between"
                                        onClick={() => setDropdownOpen({ ...dropdownOpen, jobTitle: !dropdownOpen.jobTitle })}>
                                            <span>{formData.job_title || "Select Job Title"}</span>
                                        <FaChevronDown className={`ml-2 transform ${dropdownOpen.jobTitle ? "rotate-180" : "rotate-0"} transition-transform`}/>
                                    </div>

                                    {dropdownOpen.jobTitle && (
                                        <div className="top-full mt-1 w-full border border-gray-300 rounded-xs bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                        {/* Search Box */}
                                        <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                            <input type="text" placeholder="Search job titles..." value={searchTerm.jobTitle || ""}
                                            onChange={(e) => setSearchTerm({ ...searchTerm, jobTitle: e.target.value })}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"/>
                                        </div>

                                        {/* Filtered Titles */}
                                        {allJobTitles
                                            .filter((item) => item.title.toLowerCase().includes((searchTerm.jobTitle || "").toLowerCase()))
                                            .map((item, index) => (
                                                <div key={index}
                                                    onClick={() => {handleSingleSelectChange("job_title", item.title);handleSingleSelectChange("job_industry", item.industry);setDropdownOpen({ ...dropdownOpen, jobTitle: false });}}
                                                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                                                    {item.title}
                                                </div>
                                            ))}
                                        </div>
                                       )}
                                    </div>
                                </div>

                                <div className="col-span-2 gap-3">
                                    <div>
                                        <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall font-semibold text-fontcolor mb-1">
                                            Job Industry
                                        </label>
                                        <div className="w-full border-2 border-black rounded-lg px-4 py-2 lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor cursor-pointer flex items-center justify-between"
                                            onClick={() => setDropdownOpen({...dropdownOpen, jobIndustry: !dropdownOpen.jobIndustry,})}>
                                            <span>{formData.job_industry || "Select Job Industry"}</span>
                                            <FaChevronDown className={`ml-2 transform ${ dropdownOpen.jobIndustry ? "rotate-180" : "rotate-0"} transition-transform`}/>
                                        </div>

                                        {dropdownOpen.jobIndustry && (
                                            <div className="top-full mt-1 w-full border border-gray-300 rounded-xs bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                            {/* Search Box */}
                                            <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                <input type="text"placeholder="Search job industries..." value={searchTerm.jobIndustry || ""}
                                                onChange={(e) => setSearchTerm({ ...searchTerm, jobIndustry: e.target.value,})}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                />
                                            </div>

                                            {/* Job Industry Options */}
                                            {options.jobIndustries?.map((ind) => ind.industry)
                                                .filter((industry) => industry.toLowerCase().includes((searchTerm.jobIndustry || "").toLowerCase()))
                                                .map((industry, index) => (
                                                    <div key={index} onClick={() => {handleSingleSelectChange("job_industry", industry);setDropdownOpen({ ...dropdownOpen, jobIndustry: false }); }}
                                                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                                                    {industry}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-2 gap-3">
                                    <div className="mb-4">
                                        <div>
                                            <label className="block  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall font-semibold text-fontcolor mb-1">
                                                Specialization
                                            </label>
                                            <div className="w-full border-2 border-black rounded-lg px-4 py-2  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                                                onClick={() => setDropdownOpen({...dropdownOpen,specoption:!dropdownOpen.specoption,})}>
                                                {formData.specialization.length > 0 ? (
                                                    formData.specialization.map((selected, index) => (
                                                        <div key={index} className="bg-gray-200 px-3 py-1 rounded-md flex items-center">
                                                            <span className="text-sm"> {selected}</span>
                                                            <button className="ml-2 text-red-600 font-extrabold"onClick={(e) => {e.stopPropagation();handleRemoveSelectedOption(selected);}}>
                                                                X
                                                            </button>
                                                        </div>
                                                    ))) : (<span className="text-fontcolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall"> Select Specialization </span>
                                                   )}
                                                <FaChevronDown className={`ml-auto transform ${dropdownOpen.specoption? "rotate-180" : "rotate-0"} transition-transform`}/>
                                            </div>

                                            {dropdownOpen.specoption && (
                                                <div className="top-full mt-1 w-full border border-gray-300 rounded-xs bg-white shadow-lg text-fontcolor z-10 max-h-60 overflow-y-auto">
                                                    {/* Search Box */}
                                                    <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                                                        <input type="text" placeholder="Search options..."
                                                            value={ searchTerm.specoption || ""}
                                                            onChange={(e) => setSearchTerm({...searchTerm, specoption: e.target.value,})}
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                        />
                                                    </div>

                                                    {/* Specialization Options */}
                                                    {options.specialization.filter((option) =>
                                                            option.toLowerCase().includes(
                                                                (searchTerm.specoption || "" ).toLowerCase()))
                                                                .map((option, index) => (
                                                                <label key={index} className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer">
                                                                    <input type="checkbox" value={option}
                                                                        checked={formData.specialization.includes(option)}
                                                                        onChange={() => handleMultiSelectChange(option)}
                                                                        className="ml-5 w-5 h-5"/>
                                                                    <span className=" lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall ml-5">{option}</span>
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

                            <div className="flex justify-end mt-8">
                                <button
                                    type="submit"
                                    onClick={(e) => handleSubmit(e, "draft")}
                                    className="button1 flex items-center justify-center"
                                >
                                    <div className="ml-auto">
                                        <div className="flex items-center space-x-2">
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
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastWrapper/>
            <GeneralFooter />
        </div>
    );
}
