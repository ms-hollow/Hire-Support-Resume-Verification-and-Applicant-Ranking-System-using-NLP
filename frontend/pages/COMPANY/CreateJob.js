import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Image from "next/image";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/router";

const getCompany = async (authTokens) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/company/profile/view", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authTokens.access}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch company data");
    return await res.json();
  } catch (error) {
    console.error("Error fetching company details:", error);
    return null;
  }
};

export default function CreateJob() {
  const { authTokens } = useContext(AuthContext);
  const router = useRouter();
  const [company_name, setCompanyName] = useState(null);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    company: "",
    job_title: "",
    job_industry: "",
    job_description: "",
    company_name: "",
    region: "",
    city: "",
    province: "",
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
    creation_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { region, province, city } = formData;

  const fetchData = async (url, setter, errorMsg) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setter(data);
    } catch (err) {
      console.error(errorMsg, err);
    }
  };

  useEffect(() => {
    fetchData(
      "https://psgc.gitlab.io/api/regions/",
      setRegions,
      "Error fetching regions:"
    );
  }, []);

  useEffect(() => {
    if (!region) {
      setProvinces([]);
      setCities([]);
      return;
    }

    const resetLocation = { province: "", city: "" };
    setFormData((prev) => ({ ...prev, ...resetLocation }));

    if (region === "130000000") {
      setProvinces([]);
      fetchData(
        `https://psgc.gitlab.io/api/regions/${region}/cities-municipalities/`,
        setCities,
        "Error fetching cities for NCR:"
      );
    } else {
      fetchData(
        `https://psgc.gitlab.io/api/regions/${region}/provinces/`,
        setProvinces,
        "Error fetching provinces:"
      );
      setCities([]);
    }
  }, [region]);

  useEffect(() => {
    if (province && region !== "130000000") {
      fetchData(
        `https://psgc.gitlab.io/api/provinces/${province}/cities-municipalities/`,
        setCities,
        "Error fetching cities:"
      );
    } else if (region !== "130000000") {
      setCities([]);
    }
  }, [province, region]);

  const formatDate = (date) => {
    const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedMonth}-${formattedDay}-${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!authTokens) {
        router.push("/GENERAL/Login");
        return;
      }

      const companyData = await getCompany(authTokens);
      // console.log(companyData);
      const company_key = companyData.company_key;
      // console.log(company_key);
      const tempHolder = companyData.profile_data.company_name;
      // console.log(tempHolder);
      setCompanyName(tempHolder);

      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);

      setFormData((prev) => ({
        ...prev,
        company: company_key,
        company_name: tempHolder,
        creation_date: formattedDate,
      }));
    };

    fetchData();
  }, [authTokens, router]);

  const validateForm = () => {
    let errors = {};

    const requiredFields = Object.keys(formData).filter(
      (key) => !formData[key]
    );

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = `${field.replace("_", " ")} is required.`;
      }
    });

    // Salary validation
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

    // Experience level validation
    if (formData.experience_level < 0 || formData.experience_level > 30) {
      errors.experience_level = "Experience level must be between 0 and 30.";
    }

    // Dropdown selections validation
    if (!regions.some((r) => r.code === formData.region)) {
      errors.region = "Invalid region selection.";
    }

    if (
      formData.province &&
      !provinces.some((p) => p.code === formData.province)
    ) {
      errors.province = "Invalid province selection.";
    }

    if (formData.city && !cities.some((c) => c.code === formData.city)) {
      errors.city = "Invalid city selection.";
    }

    // Ensure no validation errors
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors).join("\n");
      alert(`Please fix the following errors:\n\n${errorMessages}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = authTokens?.access;
    if (!token) return;

    console.log(formData);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/job/hirings/create/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Job created successfully:", data);
        const id = data.job_hiring_id;

        alert("Job created successfully!");
        router.push(`/COMPANY/CompanySettings?id=${id}`);
      } else {
        const errorData = await response.json();
        console.error("Failed to create job:", errorData);
        alert("Failed to create job.");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      alert("An error occurred. Please try again later.");
    }
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

            <form>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="job_title"
                    placeholder="Job Title"
                    className="h-medium rounded-xs border-2 border-fontcolor"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                    Job Industry
                  </label>
                  <input
                    type="text"
                    name="job_industry"
                    placeholder="Job Industry"
                    className="h-medium rounded-xs border-2 border-fontcolor"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2 gap-3">
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                    Job Description
                  </label>
                  <textarea
                    name="job_description"
                    placeholder="Job Description"
                    className="w-full p-1 rounded-xs border-2 border-fontcolor text-fontcolor h-20"
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="col-span-2 gap-3">
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder="Company Name"
                    className="h-medium rounded-xs border-2 border-fontcolor"
                    value={company_name}
                    disabled
                  />
                </div>

                {/* Region */}
                <div className="flex space-x-3 col-span-2">
                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      Region{" "}
                    </label>
                    <select
                      className="valid:text-fontcolor invalid:text-placeholder mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall border-2 border-black h-medium rounded-xs w-full text-sm text-gray-500"
                      id="region"
                      name="region"
                      value={region}
                      onChange={handleChange}
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

                  {/* City/Municipality */}
                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      City/Municipality
                    </label>
                    <select
                      className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall border-2 border-black h-medium rounded-xs w-full"
                      id="province"
                      name="province"
                      value={province}
                      onChange={handleChange}
                      required={region !== "130000000"}
                      disabled={region === "130000000"}
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

                  {/* City */}
                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      City
                    </label>
                    <select
                      className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall border-2 border-black h-medium rounded-xs w-full"
                      id="city"
                      name="city"
                      required
                      value={city}
                      onChange={handleChange}
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
                      className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"
                      onChange={handleChange}
                    >
                      <option value="workSetup">Work Setup</option>
                      <option value="onsite">Onsite</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="w-1/2">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      Employment Type
                    </label>
                    <select
                      name="employment_type"
                      className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"
                      onChange={handleChange}
                    >
                      <option value="employmentType">Employment Type</option>
                      <option value="fullTime">Full-Time</option>
                      <option value="partTime">Part-Time</option>
                      <option value="contract">Contract</option>
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
                    className="w-full p-1 rounded-xs border-2 border-fontcolor text-fontcolor h-20"
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="py-1">
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
                      onClick={() =>
                        handleChange({
                          target: { name: "schedule", value: shift },
                        })
                      }
                      className={`border-2 border-black p-1 rounded-full text-center text-sm ${
                        formData.schedule === shift
                          ? "bg-primary text-background"
                          : "text-black hover:bg-primary hover:text-background"
                      }`}
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
                  className="w-full p-1 rounded-xs border-2 border-fontcolor text-fontcolor h-15"
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                    Experience Level
                  </label>
                  <select
                    name="experience_level"
                    className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"
                    onChange={handleChange}
                  >
                    <option value="">Experience Level</option>
                    <option value="internship">Internship</option>
                    <option value="entry">Entry</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>

                <div>
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                    No. of Positions
                  </label>
                  <input
                    type="number"
                    name="num_positions"
                    placeholder="No. of Positions"
                    className="h-medium rounded-xs border-2 border-fontcolor"
                    onChange={handleChange}
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
                      placeholder="Salary Minimum"
                      className="h-medium rounded-xs border-2 border-fontcolor"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      Salary Maximum
                    </label>
                    <input
                      type="number"
                      name="salary_max"
                      placeholder="Salary Maximum"
                      className="h-medium rounded-xs border-2 border-fontcolor"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">
                      Salary Frequency
                    </label>
                    <select
                      name="salary_frequency"
                      className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"
                      onChange={handleChange}
                    >
                      <option value="Salary Frequency">Salary Frequency</option>
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="hourly">Hourly</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSubmit}
                  type="button"
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
