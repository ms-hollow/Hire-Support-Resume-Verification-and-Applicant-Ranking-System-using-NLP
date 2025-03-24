import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  fetchRegions,
  fetchProvinces,
  fetchCities,
} from "@/pages/api/locationApi";

// TODO TODO TODO

export default function CreateJob() {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [dummyJobDetails, setDummyJobDetails] = useState([]);
  const [options, setOptions] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  //* Import list of specialization
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch options data
        const optionsResponse = await fetch("/placeHolder/dummy_options.json");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  useEffect(() => {
    const loadRegions = async () => {
      const data = await fetchRegions();
      setRegions(data);
    };
    loadRegions();
  }, []);

  useEffect(() => {
    const loadProvinces = async () => {
      setProvinces([]);
      setCities([]);

      if (formData.region) {
        const data = await fetchProvinces(formData.region);
        setProvinces(data);
      }
    };
    loadProvinces();
  }, [formData.region]);

  useEffect(() => {
    const loadCities = async () => {
      setCities([]);

      if (formData.province || formData.region === "130000000") {
        const data = await fetchCities(formData.province, formData.region);
        setCities(data);
      }
    };
    loadCities();
  }, [formData.province, formData.region]);

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

  return (
    <div>
      <CompanyHeader />
      <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto">
        <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-5">
          Create Job Hiring
        </h1>

        <div className="flex items-center justify-center pb-8">
          <div className="box-container px-8 py-5 mx-auto">
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

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                    Job Title
                  </label>
                  <input
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    placeholder="Job Title"
                    className="h-medium rounded-xs border-2 border-fontcolor"
                  />
                </div>

                <div>
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                    Job Industry
                  </label>
                  <input
                    type="text"
                    name="job_industry"
                    value={formData.job_industry}
                    onChange={handleInputChange}
                    placeholder="Job Industry"
                    className="h-medium rounded-xs border-2 border-fontcolor"
                  />
                </div>

                <div className="col-span-2 gap-3">
                  <div className="mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-fontcolor mb-1">
                        Specialization
                      </label>
                      <div
                        className="w-full border-2 border-black rounded-lg px-4 py-2 text-medium text-fontcolor cursor-pointer flex flex-wrap gap-2 items-center"
                        onClick={() =>
                          setDropdownOpen({
                            ...dropdownOpen,
                            specoption: !dropdownOpen.specoption,
                          })
                        }
                      >
                        {formData.specialization.length > 0 ? (
                          formData.specialization.map((selected, index) => (
                            <div
                              key={index}
                              className="bg-gray-200 px-3 py-1 rounded-md flex items-center"
                            >
                              <span className="text-sm">{selected}</span>
                              <button
                                className="ml-2 text-red-600 font-extrabold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveSelectedOption(selected);
                                }}
                              >
                                X
                              </button>
                            </div>
                          ))
                        ) : (
                          <span className="text-fontcolor">
                            Select Specialization
                          </span>
                        )}
                        <FaChevronDown
                          className={`ml-auto transform ${
                            dropdownOpen.specoption ? "rotate-180" : "rotate-0"
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
                              value={searchTerm.specoption || ""}
                              onChange={(e) =>
                                setSearchTerm({
                                  ...searchTerm,
                                  specoption: e.target.value,
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
                                  (searchTerm.specoption || "").toLowerCase()
                                )
                            )
                            .map((option, index) => (
                              <label
                                key={index}
                                className="flex items-center gap-1 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  value={option}
                                  checked={formData.specialization.includes(
                                    option
                                  )}
                                  onChange={() =>
                                    handleMultiSelectChange(option)
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

                <div className="col-span-2 gap-3">
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                    Job Description
                  </label>
                  <textarea
                    type="text"
                    name="job_description"
                    value={formData.job_description}
                    onChange={handleInputChange}
                    placeholder="Job Description"
                    className="w-full p-1 rounded-xs border-2 border-fontcolor text-fontcolor h-20"
                  ></textarea>
                </div>

                <div className="col-span-2 gap-3">
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="Company Name"
                    className="h-medium rounded-xs border-2 border-fontcolor"
                  />
                </div>

                <div className="flex space-x-3 col-span-2">
                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      Region{" "}
                    </label>
                    <select
                      className="valid:text-fontcolor invalid:text-placeholder mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall border-2 border-black h-medium rounded-xs w-full text-sm text-gray-500"
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled selected hidden>
                        Select Region
                      </option>
                      {regions.map((region) => (
                        <option key={region.code} value={region.code}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      City/Municipality
                    </label>
                    <select
                      className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall border-2 border-black h-medium rounded-xs w-full"
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      required={formData.region !== "130000000"}
                      disabled={formData.region === "130000000"}
                    >
                      <option value="province" disabled selected hidden>
                        Select Province
                      </option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      City
                    </label>
                    <select
                      className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall border-2 border-black h-medium rounded-xs w-full"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                    >
                      <option value="city" disabled selected hidden>
                        Select City
                      </option>
                      {cities.map((city) => (
                        <option key={city.code} value={city.code}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex space-x-6 mt-1 col-span-2">
                  <div className="w-1/2">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      Work Setup
                    </label>
                    <select
                      name="work_setup"
                      value={formData.work_setup}
                      onChange={handleInputChange}
                      className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"
                    >
                      <option value="workSetup" disabled>
                        Work Setup
                      </option>
                      <option value="On-Site">Onsite</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="w-1/2">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      Employment Type
                    </label>
                    <select
                      name="employment_type"
                      value={formData.employment_type}
                      onChange={handleInputChange}
                      className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"
                    >
                      <option value="" disabled>
                        {" "}
                        Employment Type
                      </option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                    Qualifications
                  </label>
                  <textarea
                    name="qualifications"
                    placeholder="Qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    className="w-full p-1 rounded-xs border-2 border-fontcolor text-fontcolor h-20"
                  ></textarea>
                </div>
              </div>

              <div className="py-1">
                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold pb-2 ">
                  Schedule
                </p>
                <div className="grid grid-cols-3 gap-1">
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
                      onClick={() => handleScheduleSelect(shift)}
                    >
                      {shift}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-1">
                <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                  Benefits
                </label>
                <textarea
                  name="benefits"
                  placeholder="Benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  className="w-full p-1 rounded-xs border-2 border-fontcolor text-fontcolor h-15"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                    Experience Level
                  </label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleInputChange}
                    className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"
                  >
                    <option value="">Experience Level</option>
                    <option value="Internship">Internship</option>
                    <option value="Entry Level">Entry</option>
                    <option value="Mid-Level">Mid</option>
                    <option value="Senior Level">Senior</option>
                  </select>
                </div>

                <div>
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                    No. of Positions
                  </label>
                  <input
                    type="number"
                    name="num_positions"
                    value={formData.num_positions}
                    onChange={handleInputChange}
                    placeholder="No. of Positions"
                    className="h-medium rounded-xs border-2 border-fontcolor"
                  />
                </div>

                <div className="flex space-x-4 mt-4 col-span-2">
                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      Salary Minimum
                    </label>
                    <input
                      type="number"
                      name="salary_min"
                      value={formData.salary_min}
                      onChange={handleInputChange}
                      placeholder="Salary Minimum"
                      className="h-medium rounded-xs border-2 border-fontcolor"
                    />
                  </div>

                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      Salary Maximum
                    </label>
                    <input
                      type="number"
                      name="salary_max"
                      value={formData.salary_max}
                      onChange={handleInputChange}
                      placeholder="Salary Maximum"
                      className="h-medium rounded-xs border-2 border-fontcolor"
                    />
                  </div>

                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      Salary Frequency
                    </label>
                    <select
                      name="salary_frequency"
                      value={formData.salary_frequency}
                      onChange={handleInputChange}
                      className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"
                    >
                      <option value="">Select Frequency</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Hourly">Hourly</option>
                    </select>
                  </div>
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

      <GeneralFooter />
    </div>
  );
}
