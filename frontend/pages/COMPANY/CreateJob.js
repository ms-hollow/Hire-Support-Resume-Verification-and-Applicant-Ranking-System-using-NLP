import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from "next/image";

export default function CreateJob() {
  const regions = ["North", "South", "East", "West"]; // Example regions
  const cities = ["City A", "City B", "City C", "City D"]; // Example cities

  return (
    <div>
      <CompanyHeader />
      <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto">
        <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-12">
          Create Job Hiring
        </h1>

        <div className="flex items-center justify-center">
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

            <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor">
              Fill out all required job hiring details.
            </p>

            <form>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-fontcolor mb-1">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    className="border border-black p-1 rounded-md w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-fontcolor mb-1">Job Industry</label>
                  <input
                    type="text"
                    name="jobIndustry"
                    placeholder="Job Industry"
                    className="border border-black p-1 rounded-md w-full"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-fontcolor mb-1">Job Description</label>
                  <textarea
                    name="jobDescription"
                    placeholder="Job Description"
                    className="border border-black p-1 rounded-md w-full h-20"
                  ></textarea>
                </div>

                <div className="flex space-x-4 col-span-2">
                  <div className="w-1/3">
                    <label className="block text-sm font-semibold text-fontcolor mb-1">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Company Name"
                      className="border border-black p-1 rounded-md w-full"
                    />
                  </div>

                  <div className="w-1/3">
                    <label className="block text-sm font-semibold text-fontcolor mb-1">Region</label>
                    <select
                      name="region"
                      className="border border-black p-2 rounded-md w-full text-sm text-gray-500"
                    >
                      <option value="">Select Region</option>
                      {regions.map((region, index) => (
                        <option key={index} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-1/3">
                    <label className="block text-sm font-semibold text-fontcolor mb-1">City</label>
                    <select
                      name="city"
                      className="border border-black p-2 rounded-md w-full text-sm text-gray-500"
                    >
                      <option value="">Select City</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex space-x-6 mt-4 col-span-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold text-fontcolor mb-1">Work Setup</label>
                    <select
                      name="workSetup"
                      className="border border-black p-2 rounded-md w-full text-sm text-gray-500"
                    >
                      <option value="workSetup">Work Setup</option>
                      <option value="onsite">Onsite</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm font-semibold text-fontcolor mb-1">Employment Type</label>
                    <select
                      name="employmentType"
                      className="border border-black p-2 rounded-md w-full text-sm text-gray-500"
                    >
                      <option value="employmentType">Employment Type</option>
                      <option value="fullTime">Full-Time</option>
                      <option value="partTime">Part-Time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-fontcolor mb-1">Qualifications</label>
                  <textarea
                    name="qualifications"
                    placeholder="Qualifications"
                    className="border border-black p-1 rounded-md w-full h-20"
                  ></textarea>
                </div>
              </div>

              <div className="py-4">
                <p className="text-sm text-gray-600 pb-2">Schedule</p>
                <div className="grid grid-cols-3 gap-4">
                  {["8 hrs shift", "12 hrs shift", "14 hrs shift", "Day shift", "Night shift", "Graveyard shift"].map(
                    (shift) => (
                      <button
                        key={shift}
                        type="button"
                        className="border border-black p-1 rounded-full text-center text-sm text-black hover:bg-gray-200"
                      >
                        {shift}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="py-4">
                <label className="block text-sm font-semibold text-fontcolor mb-1">Benefits</label>
                <textarea
                  name="benefits"
                  placeholder="Benefits"
                  className="border border-black p-1 rounded-md w-full h-15"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-fontcolor mb-1">Experience Level</label>
                  <select
                    name="experienceLevel"
                    className="border border-black p-2 rounded-md w-full text-sm text-gray-500"
                  >
                    <option value="">Experience Level</option>
                    <option value="internship">Internship</option>
                    <option value="entry">Entry</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-fontcolor mb-1">No. of Positions</label>
                  <input
                    type="number"
                    name="numPositions"
                    placeholder="No. of Positions"
                    className="border border-black p-1 rounded-md w-full"
                  />
                </div>

                <div className="flex space-x-4 mt-4 col-span-2">
                  <div className="w-1/3">
                    <label className="block text-sm font-semibold text-fontcolor mb-1">Salary Minimum</label>
                    <input
                      type="number"
                      name="salaryMin"
                      placeholder="Salary Minimum"
                      className="border border-black p-1 rounded-md w-full"
                    />
                  </div>

                  <div className="w-1/3">
                    <label className="block text-sm font-semibold text-fontcolor mb-1">Salary Maximum</label>
                    <input
                      type="number"
                      name="salaryMax"
                      placeholder="Salary Maximum"
                      className="border border-black p-1 rounded-md w-full"
                    />
                  </div>

                  <div className="w-1/3">
                    <label className="block text-sm font-semibold text-fontcolor mb-1">Salary Frequency</label>
                    <select
                      name="salaryFrequency"
                      className="border border-black p-2 rounded-md w-full text-sm text-gray-500"
                    >
                      <option value="">Salary Frequency</option>
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="hourly">Hourly</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
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
