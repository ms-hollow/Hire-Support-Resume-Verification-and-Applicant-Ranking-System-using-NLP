import ApplicantHeader from "@/components/ApplicantHeader";
import GeneralFooter from "@/components/GeneralFooter";
import JobDetails from "@/components/JobDetails";
import JobListings from "@/components/JobListings";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/router";
import { getApplicantProfile } from "../api/applicantApi";
import phLocation from "../../public/placeHolder/location.json";
import jobIndustry from "../../public/placeHolder/dummy_options.json";
import { fetchJobListings } from "@/pages/api/applicantJobApi";
import JobListingsWrapper from "@/components/JobListings";
import JobDetailsWrapper from "@/components/JobDetails";

export default function ApplicantHome({ onJobClick }) {
    let { authTokens } = useContext(AuthContext);
    const router = useRouter();
    const [jobListings, setJobListings] = useState([]);
    const [filteredJobListings, setFilteredJobListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [applicantName, setApplicantName] = useState("");
    const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
    const [isSalaryOpen, setIsSalaryOpen] = useState(false);
    const [paymentType, setPaymentType] = useState("Annually");
    const [range, setRange] = useState(0);
    const [classificationInput, setClassificationInput] = useState("");
    const [showClassificationDropdown, setShowClassificationDropdown] = useState(false);
    const [locationInput, setLocationInput] = useState("");
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);

    const [filters, setFilters] = useState({
        keyword: "",
        classification: "",
        location: "",
        datePosted: "",
        salaryRange: "",
        workSetup: "",
        employmentType: "",
    });

    const loadJobListings = async () => {
        const jobData = await fetchJobListings(authTokens?.access);
        setJobListings(jobData);
    };

    useEffect(() => {
        if (authTokens?.access) {
            loadJobListings();
        }
    }, [authTokens?.access]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !authTokens) {
            router.push("/GENERAL/Login");
        }
    }, [authTokens, isMounted, router]);

    useEffect(() => {
        const fetchApplicantData = async () => {
            if (authTokens?.access) {
                const profileData = await getApplicantProfile(authTokens);
                setApplicantName(profileData?.first_name || "Applicant");
            }
        };

        fetchApplicantData();
    }, [authTokens]);

    const handleJobClick = () => {
        setIsJobDetailsOpen(true);
    };

    const handleFilterChange = (filterName, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: value,
        }));
        // console.log("Filter changed:", filterName, value);
    };

    const applyFilters = () => {
        // console.log("Filters applied:", filters);

        const filtered = jobListings.filter((job) => {
            const jobCreationDate = new Date(job.creation_date);
            const currentDate = new Date();
            let isDatePostedValid = false;

            if (filters.datePosted === "") {
                isDatePostedValid = true;
            } else if (filters.datePosted === "Today") {
                isDatePostedValid =
                    jobCreationDate.getFullYear() ===
                        currentDate.getFullYear() &&
                    jobCreationDate.getMonth() === currentDate.getMonth() &&
                    jobCreationDate.getDate() === currentDate.getDate();
            } else if (filters.datePosted === "Last Hour") {
                const oneHourAgo = new Date(
                    currentDate.getTime() - 60 * 60 * 1000
                );
                isDatePostedValid = jobCreationDate >= oneHourAgo;
            } else if (filters.datePosted === "Last Week") {
                const oneWeekAgo = new Date(
                    currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
                );
                isDatePostedValid = jobCreationDate >= oneWeekAgo;
            }

            let isSalaryValid = true;

            if (filters.salaryRange && filters.salaryFrequency) {
                const jobSalaryMax = parseInt(job.salary_max.replace(/,/g, ""));

                let [minRange, maxRange] = filters.salaryRange.split("-");

                if (minRange === "below") {
                    // For "below-X" ranges, check if salary is below the maximum
                    const maxValue = parseInt(maxRange);
                    isSalaryValid = jobSalaryMax <= maxValue;
                } else if (maxRange === "above") {
                    // For "X-above" ranges, check if salary is above the minimum
                    const minValue = parseInt(minRange);
                    isSalaryValid = jobSalaryMax >= minValue;
                } else {
                    // For standard ranges "X-Y", check if salary is between min and max
                    const minValue = parseInt(minRange);
                    const maxValue = parseInt(maxRange);
                    isSalaryValid =
                        jobSalaryMax >= minValue && jobSalaryMax <= maxValue;
                }
            }

            const locationParts = filters.location
                .toLowerCase()
                .split(",")
                .map((part) => part.trim());

            const isLocationValid = locationParts.every((part) =>
                job.location?.toLowerCase().includes(part)
            );

            const isValid =
                (filters.keyword === "" ||
                    job.job_title
                        .toLowerCase()
                        .includes(filters.keyword.toLowerCase())) &&
                (filters.classification === "" ||
                    job.job_industry
                        ?.toLowerCase()
                        .includes(filters.classification.toLowerCase())) &&
                isLocationValid &&
                (filters.workSetup === "" ||
                    job.work_setup
                        ?.toLowerCase()
                        .includes(filters.workSetup.toLowerCase())) &&
                (filters.employmentType === "" ||
                    job.employment_type
                        ?.toLowerCase()
                        .includes(filters.employmentType.toLowerCase()));

            return isDatePostedValid && isSalaryValid && isValid;
        });

        // console.log("Filtered jobs:", filtered);
        setFilteredJobListings(filtered);
    };

    useEffect(() => {
        applyFilters();
        // console.log(filteredJobListings);
    }, [filters, jobListings]);

    const isAnyFilterApplied = Object.values(filters).some(
        (val) => val !== "" && val !== null && val !== undefined
    );

    // Handle closing job details
    const handleCloseJobDetails = () => {
        setIsJobDetailsOpen(false);
    };

    const salaryRanges = {
        Hourly: [5, 10, 20, 50, 100, 500, 700, 1000, 1500],
        Monthly: [
            5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 70000,
            80000, 100000,
        ],
        Annually: [
            60000, 70000, 80000, 90000, 100000, 120000, 180000, 240000, 300000,
            360000, 480000, 600000,
        ],
    };

    const formatSalary = (value) => {
        const amount = salaryRanges[paymentType][value];
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleSalaryTypeSelect = (type) => {
        setPaymentType(type);
        setFilters((prev) => ({
            ...prev,
            salaryFrequency: type,
        }));
    };

    // Fetch applicant data after mounting
    useEffect(() => {
        if (authTokens) {
            getApplicantProfile();
        }
    }, [authTokens]);

    // Render nothing if not mounted or no authTokens
    if (!isMounted || !authTokens) {
        return null;
    }

    const filteredClassifications = jobIndustry.jobIndustries.filter((item) =>
        item.industry.toLowerCase().includes(classificationInput.toLowerCase())
      );
    
    const allCities = Object.values(phLocation).flat();
    const filteredLocations = allCities.filter((city) =>
        city.toLowerCase().includes(locationInput.toLowerCase())
      );

    return (
        <div>
            <ApplicantHeader />

            {loading ? (
                <p>Loading job listings...</p>
            ) : jobListings.length > 0 ? (
                // When there are job listings, either show filtered or unfiltered job listings
                <JobListingsWrapper
                    jobListings={
                        filteredJobListings.length > 0
                            ? filteredJobListings
                            : jobListings
                    }
                    onJobClick={onJobClick}
                    loading={loading}
                />
            ) : (
                // When there are no job listings available
                <p className="flex flex-col text-fontcolor">
                    No job listings available.
                </p>
            )}

            <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-4 xxsm:px-4 mx-auto pb-8">
                <div>
                    <p className="text-fontcolor text-large ">
                        Hi, {applicantName}
                    </p>
                </div>

                {/* Search */}
                <div className="pt-5 flex-wrap w-full">
                    <div className="flex lg:flex-row gap-5 pb-5 mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col">
                        <div className="relative h-medium rounded-xs border-2 border-[#A5A5A5] justify-center flex flex-grow items-center">
                            <div className="absolute left-3">
                                <Image
                                    src="/Search Icon.svg"
                                    width={26}
                                    height={24}
                                    alt="Search Icon"
                                />
                            </div>
                            <input
                                type="text"
                                id="keyword"
                                name="keyword"
                                placeholder="Enter Keyword"
                                value={filters.keyword}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "keyword",
                                        e.target.value
                                    )
                                }
                                required
                                className="w-full h-full border-primarycolor lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall pl-12"
                            />
                        </div>

                        <div className="relative flex flex-grow">
                            <input
                                type="text"
                                value={classificationInput}
                                onChange={(e) => {
                                const value = e.target.value;
                                setClassificationInput(value);
                                setShowClassificationDropdown(value.trim().length > 0);
                                }}
                                onFocus={() => {
                                if (classificationInput.trim()) setShowClassificationDropdown(true);
                                }}
                                onBlur={() => {
                                setTimeout(() => setShowClassificationDropdown(false), 150);
                                }}
                                placeholder="Search Classification"
                                className="w-full h-medium rounded-xs border-2 border-[#A5A5A5] px-3 lg:text-medium mb:text-xsmall sm:text-xxsmall"
                            />

                            {classificationInput && (
                                <button type="button" onClick={() => { setClassificationInput(""); setShowClassificationDropdown(false);handleFilterChange("classification", ""); }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 text-sm">
                                    ×
                                </button>
                            )}

                            {showClassificationDropdown && (
                                <div className="absolute left-0 top-full mt-1 w-full bg-white border border-black shadow overflow-y-auto z-50">
                                {filteredClassifications.length > 0 ? (
                                    filteredClassifications.map((item, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-1 hover:bg-gray-100 cursor-pointer text-fontcolor"
                                        onMouseDown={() => {
                                        handleFilterChange("classification", item.industry);
                                        setClassificationInput(item.industry);
                                        setShowClassificationDropdown(false);
                                        }}
                                    >
                                        {item.industry}
                                    </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-500">No match found</div>
                                )}
                                </div>
                            )}
                         </div>

                         <div className="relative flex flex-grow">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Image
                                src="/Location Icon.svg"
                                width={26}
                                height={24}
                                alt="Location Icon"
                                />
                            </div>

                            {/* Input field with left padding for icon */}
                            <input
                                type="text"
                                value={locationInput}
                                onChange={(e) => {
                                const value = e.target.value;
                                setLocationInput(value);
                                setShowLocationDropdown(value.trim().length > 0);
                                }}
                                onFocus={() => {
                                if (locationInput.trim()) setShowLocationDropdown(true);
                                }}
                                onBlur={() => {
                                setTimeout(() => setShowLocationDropdown(false), 150);
                                }}
                                placeholder="Search Location"
                                className="w-full h-medium rounded-xs border-2 border-[#A5A5A5] pl-12 pr-10 lg:text-medium mb:text-xsmall sm:text-xxsmall"
                            />

                            {locationInput && (
                                <button type="button" onClick={() => {setLocationInput(""); setShowLocationDropdown(false); handleFilterChange("location", "");}}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 text-sm">
                                    ×
                                </button>
                            )}

                            {showLocationDropdown && (
                                <div className="absolute z-50 left-0 top-full mt-1 w-full bg-white border border-black shadow max-h-60 overflow-y-auto">
                                {filteredLocations.length > 0 ? (
                                    filteredLocations.map((city, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-1 hover:bg-gray-100 cursor-pointer text-fontcolor"
                                        onMouseDown={() => {
                                        handleFilterChange("location", city);
                                        setLocationInput(city);
                                        setShowLocationDropdown(false);
                                        }}
                                    >
                                        {city}
                                    </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-500">No location found</div>
                                )}
                                </div>
                            )}
                        </div>

                        <button className="button1 items-center flex justify-center flex-shrink-0 p-5" onClick={applyFilters}>
                            <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-center">
                                Find Job
                            </p>
                        </button>
                    </div>
                </div>

                {/* Filter */}
                <div className="pt-5 w-full">
                    <div className="flex gap-5 pb-5 overflow-x-auto">
                        <div className="h-medium rounded-xs bg-secondary flex flex-grow min-w-[200px]">
                            <select
                                className="bg-secondary valid:text-fontcolor invalid:text-fontcolor flex-grow lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall"
                                id="date-posted"
                                name="DatePosted"
                                value={filters.datePosted} // Bind to state
                                onChange={(e) =>
                                    handleFilterChange(
                                        "datePosted",
                                        e.target.value
                                    )
                                }
                                required
                            >
                                <option value="" disabled selected hidden>
                                    Date Posted
                                </option>
                                <option value="Last Hour">Last Hour</option>
                                <option value="Today">Today</option>
                                <option value="Last Week">Last Week</option>
                            </select>
                        </div>

                        <div className="h-medium rounded-xs bg-secondary flex flex-grow min-w-[200px]">
                            <select
                                className="bg-secondary valid:text-fontcolor invalid:text-fontcolor flex-grow lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall"
                                id="work-setup"
                                name="WorkSetup"
                                value={filters.workSetup} // Binding the value to state
                                onChange={
                                    (e) =>
                                        handleFilterChange(
                                            "workSetup",
                                            e.target.value
                                        ) // Updating state on change
                                }
                                required
                            >
                                <option value="" disabled hidden>
                                    Work Setup
                                </option>
                                <option value="Remote">Remote</option>
                                <option value="On-site">On-site</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className="h-medium rounded-xs bg-secondary flex flex-grow min-w-[200px]">
                            <select
                                className="bg-secondary valid:text-fontcolor invalid:text-fontcolor flex-grow lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall"
                                id="employ-type"
                                name="EmployType"
                                value={filters.employmentType}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "employmentType",
                                        e.target.value
                                    )
                                }
                                required
                            >
                                <option value="" disabled selected hidden>
                                    Employment Type
                                </option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>

                        <div className="relative">
                            <div
                                className="flex flex-col justify-center h-medium rounded-xs bg-secondary flex-grow min-w-[200px] cursor-pointer"
                                onClick={() => setIsSalaryOpen(!isSalaryOpen)}
                            >
                                <div className="flex text-fontcolor items-center lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall px-3">
                                    {isSalaryOpen
                                        ? ""
                                        : `${
                                              paymentType ||
                                              "Select Salary Type"
                                          }`}
                                </div>
                            </div>

                            {isSalaryOpen && (
                                <div className="bg-white mt-2 w-full p-4 rounded-md shadow-lg">
                                    <div className="flex space-x-4 border-b lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall">
                                        {["Annually", "Monthly", "Hourly"].map(
                                            (type) => (
                                                <button
                                                    key={type}
                                                    className={`pb-2 lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall ${
                                                        paymentType === type
                                                            ? "text-primary border-b-2 border-blue-500"
                                                            : "text-gray-500"
                                                    }`}
                                                    onClick={() =>
                                                        handleSalaryTypeSelect(
                                                            type
                                                        )
                                                    }
                                                >
                                                    {type}
                                                </button>
                                            )
                                        )}
                                    </div>

                                    {/* Label */}
                                    <div className="text-gray-500 lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall mt-4">
                                        Salary Range (PHP)
                                    </div>
                                    <div className="mt-4 space-y-2 max-h-20 overflow-y-auto">
                                        {paymentType &&
                                            salaryRanges[paymentType].map(
                                                (value, index) => (
                                                    <label
                                                        key={index}
                                                        className="flex items-center space-x-2 text-gray-700 cursor-pointer"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="salaryRange"
                                                            value={index}
                                                            checked={
                                                                range === index
                                                            }
                                                            onChange={() => {
                                                                const min =
                                                                    index === 0
                                                                        ? "below"
                                                                        : salaryRanges[
                                                                              paymentType
                                                                          ][
                                                                              index -
                                                                                  1
                                                                          ];

                                                                const max =
                                                                    index ===
                                                                    salaryRanges[
                                                                        paymentType
                                                                    ].length
                                                                        ? "above"
                                                                        : salaryRanges[
                                                                              paymentType
                                                                          ][
                                                                              index
                                                                          ];

                                                                const rangeValue =
                                                                    min ===
                                                                    "below"
                                                                        ? `below-${max}`
                                                                        : max ===
                                                                          "above"
                                                                        ? `${min}-above`
                                                                        : `${min}-${max}`;
                                                                setRange(index);
                                                                setFilters(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        salaryRange:
                                                                            rangeValue,
                                                                        salaryFrequency:
                                                                            paymentType,
                                                                    })
                                                                );
                                                                setIsSalaryOpen(
                                                                    false
                                                                );
                                                            }}
                                                            className=" ml-5 w-5 h-5"
                                                        />
                                                        <span className="lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall">
                                                            {formatSalary(
                                                                index
                                                            )}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-medium rounded-xs bg-secondary flex flex-grow min-w-[200px]">
                            <select
                                className="bg-secondary valid:text-fontcolor invalid:text-fontcolor flex-grow lg:text-medium mb:text-xsmall sm:text-xxsmall xsm:text-xxsmall xxsm:text-xxsmall"
                                id="exp-level"
                                name="ExperienceLevel"
                                value={filters.experienceLevel}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "experienceLevel",
                                        e.target.value
                                    )
                                }
                                required
                            >
                                <option value="" disabled selected hidden>
                                    Experience Level
                                </option>
                                <option value="Entry-Level">Entry-Level</option>
                                <option value="Intermediate">
                                    Intermediate
                                </option>
                                <option value="Senior Level">
                                    Senior Level
                                </option>
                                <option value="Mid-Level">Mid-Level</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Job Listings and Details */}
                <div className="flex flex-col w-full pt-4 ">
                    <div className="flex flex-row gap-4 pb-8 w-full">
                        {isAnyFilterApplied && filteredJobListings.length === 0 ? (
                            <div className="flex justify-center items-center w-full h-full py-12">
                            <p className="text-center text-gray-500 text-lg">
                                No jobs match your filters.
                            </p>
                            </div>
                        ) : (
                            <>
                            {/* Job Listings */}
                            <JobListings
                                authToken={authTokens?.access}
                                onJobClick={handleJobClick}
                                jobListings={
                                isAnyFilterApplied ? filteredJobListings : jobListings
                                }
                            />

                            {/* Job Details Panel (Desktop Only) */}
                            <div className="hidden md:block flex-grow pb-8">
                                <JobDetailsWrapper
                                authToken={authTokens?.access}
                                applicantName={applicantName}
                                />
                            </div>
                            </>
                        )}
                    </div>


                    {/* Job Details for Mobile (Animated Drawer) */}
                    <div
                        className={`fixed inset-0 bg-background transition-transform duration-300 md:hidden z-20 ${
                            isJobDetailsOpen
                                ? "translate-y-0"
                                : "translate-y-full"
                        }`}
                    >
                        <div className="relative h-full w-full pt-28 px-4">
                            <button
                                onClick={handleCloseJobDetails}
                                className="absolute top-16 right-4 p-2 text-xl text-fontcolor hover:text-gray-700"
                            >
                                ✖
                            </button>
                            <JobDetailsWrapper
                                authToken={authTokens?.access}
                                applicantName={applicantName}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
