import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from "next/image";
import { useState, useContext, useEffect } from "react";

export default function CreateJob() {
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [formData, setFormData] = useState({
        region: "",
        province: "",
        city: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const { region, province, city } = formData;

    useEffect(() => {
        fetch("https://psgc.gitlab.io/api/regions/")
            .then((res) => res.json())
            .then((data) => setRegions(data))
            .catch((err) => console.error("Error fetching regions:", err));
    }, []);

    useEffect(() => {
        if (region) {
            if (region === "130000000") {
                setProvinces([]);
                fetch(`https://psgc.gitlab.io/api/regions/${region}/cities-municipalities/`)
                    .then((res) => res.json())
                    .then((data) => setCities(data))
                    .catch((err) => console.error("Error fetching cities for NCR:", err));
                setFormData({ ...formData, province: "", city: "" });
            } else {
                fetch(`https://psgc.gitlab.io/api/regions/${region}/provinces/`)
                    .then((res) => res.json())
                    .then((data) => setProvinces(data))
                    .catch((err) => console.error("Error fetching provinces:", err));
                setCities([]);
            }
        } else {
            setProvinces([]);
            setCities([]);
        }
    }, [region]);

    useEffect(() => {
        if (province && region !== "130000000") {
            fetch(`https://psgc.gitlab.io/api/provinces/${province}/cities-municipalities/`)
                .then((res) => res.json())
                .then((data) => setCities(data))
                .catch((err) => console.error("Error fetching cities:", err));
        } else if (region !== "130000000") {
            setCities([]);
        }
    }, [province, region]);

    useEffect(() => {
        if (city) {
            fetch(`https://psgc.gitlab.io/api/cities-municipalities/${city}/barangays/`)
                .then((res) => res.json())
                .then((data) => setBarangays(data))
                .catch((err) => console.error("Error fetching barangays:", err));
        }
    }, [city]);

  return (
    <div>
      <CompanyHeader />
      <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto">
        <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-5">Create Job Hiring</h1>

        <div className="flex items-center justify-center pb-8">
          <div className="box-container px-8 py-5 mx-auto">
            <p className="font-semibold lg:text-large mb:text-large sm:text-large text-primary">Job Hiring Information</p>

            <div className="flex items-center pt-2 pb-2">
              <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                <div
                  className="relative h-1 rounded-full transition-all duration-300 bg-primary"
                  style={{ width: "33.33%" }}
                ></div>
              </div>
            </div>

            <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor pb-5">Fill out all required job hiring details.</p>

            <form>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">Job Title</label>
                  <input type="text" name="job_title"placeholder="Job Title" className="h-medium rounded-xs border-2 border-fontcolor"/>
                </div>

                <div>
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">Job Industry</label>
                  <input type="text" name="job_industry" placeholder="Job Industry"className="h-medium rounded-xs border-2 border-fontcolor"/>
                </div>

                <div className="col-span-2 gap-3">
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">Job Description</label>
                  <textarea name="job_description" placeholder="Job Description" className="w-full p-1 rounded-xs border-2 border-fontcolor text-fontcolor h-20" ></textarea>
                </div>

                
                  <div className="col-span-2 gap-3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">Company Name</label>
                    <input type="text" name="company_name" placeholder="Company Name" className="h-medium rounded-xs border-2 border-fontcolor"/>
                  </div>

                  <div className="flex space-x-3 col-span-2">
                    <div className="w-1/3">
                        <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">Region </label>
                        <select className="valid:text-fontcolor invalid:text-placeholder mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall border-2 border-black h-medium rounded-xs w-full text-sm text-gray-500" id="region" name="region" value={region}  onChange={handleChange}  required>
                            <option value="" disabled selected hidden>Select Region</option>
                                {regions.map((region) => (
                                    <option key={region.code} value={region.code}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                    </div>

                    <div className="w-1/3">
                        <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">City/Municipality</label>
                        <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall border-2 border-black h-medium rounded-xs w-full" id="province" name="province" value={province}  onChange={handleChange}   required={region !== '130000000'}  disabled={region === '130000000'} >
                            <option value="province" disabled selected hidden>Select Province</option>
                                {provinces.map((province) => (
                                    <option key={province.code} value={province.code}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                    </div>

                    <div className="w-1/3">
                        <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">City</label>
                        <select className="valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall border-2 border-black h-medium rounded-xs w-full" id="city" name="city" required value={city}  onChange={handleChange}>
                            <option value="city" disabled selected hidden>Select City</option>
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
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">Work Setup</label>
                    <select name="work_setup" className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall" >
                      <option value="workSetup">Work Setup</option>
                      <option value="onsite">Onsite</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="w-1/2">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">Employment Type</label>
                    <select name="employmentType" className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall">
                      <option value="employmentType">Employment Type</option>
                      <option value="fullTime">Full-Time</option>
                      <option value="partTime">Part-Time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">Qualifications</label>
                  <textarea
                    name="qualifications"
                    placeholder="Qualifications"
                    className="w-full p-1 rounded-xs border-2 border-fontcolor text-fontcolor h-20"
                  ></textarea>
                </div>
              </div>

              <div className="py-1">
                <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold pb-2">Schedule</p>
                <div className="grid grid-cols-3 gap-1">
                  {["8 hrs shift", "12 hrs shift", "14 hrs shift", "Day shift", "Night shift", "Graveyard shift"].map(
                    (shift) => (<button key={shift}type="button" className="border-2 border-black p-1 rounded-full text-center text-sm text-black hover:bg-primary hover:text-background" > {shift} </button>)
                  )}
                </div>
              </div>

              <div className="py-1">
                <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">Benefits</label>
                <textarea
                  name="benefits"
                  placeholder="Benefits"
                  className="w-full p-1 rounded-xs border-2 border-fontcolor text-fontcolor h-15"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">Experience Level</label>
                  <select name="experienceLevel" className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall" >
                    <option value="">Experience Level</option>
                    <option value="internship">Internship</option>
                    <option value="entry">Entry</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>

                <div>
                  <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">No. of Positions</label>
                  <input  type="number"  name="num_positions" placeholder="No. of Positions"  className="h-medium rounded-xs border-2 border-fontcolor"  />
                </div>

                <div className="flex space-x-4 mt-4 col-span-2">
                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">Salary Minimum</label>
                    <input type="number" name="salaryMin" placeholder="Salary Minimum" className="h-medium rounded-xs border-2 border-fontcolor" />
                  </div>

                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">Salary Maximum</label>
                    <input type="number" name="salaryMax" placeholder="Salary Maximum"className="h-medium rounded-xs border-2 border-fontcolor" />
                  </div>

                  <div className="w-1/3">
                    <label className="block lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor font-semibold mb-1">Salary Frequency</label>
                    <select name="salaryFrequency" className="h-medium rounded-xs border-2 border-fontcolor valid:text-fontcolor invalid:text-placeholder lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall" >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="hourly">Hourly</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button type="button" className="button1 flex items-center justify-center">
                  <Link href="/COMPANY/CompanySettings" className="ml-auto">
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
                  </Link>
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
