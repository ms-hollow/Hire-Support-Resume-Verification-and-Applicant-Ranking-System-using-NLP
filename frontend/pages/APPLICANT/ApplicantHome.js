import ApplicantHeader from '@/components/ApplicantHeader';
import GeneralFooter from '@/components/GeneralFooter';
import JobDetails from '@/components/JobDetails';
import JobListings from '@/components/JobListings';
import Image from 'next/image';
import { useState, useEffect, useContext } from "react";
import jwt from 'jsonwebtoken';
import AuthContext from '../context/AuthContext';
import { useRouter } from 'next/router';

//TODO Search
<<<<<<< HEAD

export default function ApplicantHome() {

  let {authTokens} = useContext(AuthContext);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Only run this after component is mounted to avoid mismatch between server/client render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if authToken is not available, but do it only after mounting
  useEffect(() => {
    if (isMounted && !authTokens) {
      router.push("/GENERAL/Login");
    }
  }, [authTokens, isMounted, router]);

  if (!isMounted) {
    return null; 
  }

  if (!authTokens) {
    return null; 
  }

  return (
    <>
    <div>
      <ApplicantHeader />
      <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto">
        <div>
          <p className="text-fontcolor">Hi, Name</p>
        </div>

        {/* Search */}
        <div className="pt-5 flex-wrap w-full">
          <div className="flex lg:flex-row gap-5 pb-5 mb:flex-row sm:flex-col xsm:flex-col">
            <div className="relative h-medium rounded-xs border-2 border-fontcolor justify-center flex flex-grow items-center">
              <div className="absolute left-3">
                <Image src="/Search Icon.svg" width={26} height={24} alt="Search Icon" />
              </div>
              <input
                type="text"
                id="keyword"
                name="keyword"
                placeholder="Enter Keyword"
                required
                className="w-full h-full border-primarycolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall pl-12"
              />
            </div>

            <div className="h-medium rounded-xs border-2 border-fontcolor flex flex-grow">
              <select
                className="valid:text-fontcolor invalid:text-placeholder lg:flex-grow mb:flex-grow sm:flex-grow xsm:flex-grow lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"
                id="classification"
                name="classification"
                required
              >
                <option value="" disabled selected hidden>
                  Classification
                </option>
                <option value="Science and Technology">Science and Technology</option>
                <option value="Engineering">Engineering</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div className="relative h-medium rounded-xs border-2 border-fontcolor justify-center flex flex-grow items-center">
              <div className="absolute left-3">
                <Image src="/Location Icon.svg" width={24} height={24} alt="Search Icon" />
              </div>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Metro Manila"
                required
                className="w-full h-full border-primarycolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall pl-12"
              />
            </div>

            <button className="button1 items-center flex justify-center flex-shrink-0 p-5">
              <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-center">Find Job</p>
            </button>
          </div>
        </div>

=======
//TODO Hindi pa gumagana yung CLOSE button sa mobile view ng Job Details

export default function ApplicantHome() {

  let {authTokens} = useContext(AuthContext);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Only run this after component is mounted to avoid mismatch between server/client render
  useEffect(() => {
    setIsMounted(true);
  }, []);
  

  // Redirect if authToken is not available, but do it only after mounting
  useEffect(() => {
    if (isMounted && !authTokens) {
      router.push("/GENERAL/Login");
    }
  }, [authTokens, isMounted, router]);

  if (!isMounted) {
    return null; 
  }

  if (!authTokens) {
    return null; 
  }

  return (
    <div>
      <ApplicantHeader />
      <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto">
        <div>
          <p className="text-fontcolor">Hi, Name</p>
        </div>

        {/* Search */}
        <div className="pt-5 flex-wrap w-full">
          <div className="flex lg:flex-row gap-5 pb-5 mb:flex-row sm:flex-col xsm:flex-col">
            <div className="relative h-medium rounded-xs border-2 border-fontcolor justify-center flex flex-grow items-center">
              <div className="absolute left-3">
                <Image src="/Search Icon.svg" width={26} height={24} alt="Search Icon" />
              </div>
              <input
                type="text"
                id="keyword"
                name="keyword"
                placeholder="Enter Keyword"
                required
                className="w-full h-full border-primarycolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall pl-12"
              />
            </div>

            <div className="h-medium rounded-xs border-2 border-fontcolor flex flex-grow">
              <select
                className="valid:text-fontcolor invalid:text-placeholder lg:flex-grow mb:flex-grow sm:flex-grow xsm:flex-grow lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"
                id="classification"
                name="classification"
                required
              >
                <option value="" disabled selected hidden>
                  Classification
                </option>
                <option value="Science and Technology">Science and Technology</option>
                <option value="Engineering">Engineering</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div className="relative h-medium rounded-xs border-2 border-fontcolor justify-center flex flex-grow items-center">
              <div className="absolute left-3">
                <Image src="/Location Icon.svg" width={24} height={24} alt="Search Icon" />
              </div>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Metro Manila"
                required
                className="w-full h-full border-primarycolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall pl-12"
              />
            </div>

            <button className="button1 items-center flex justify-center flex-shrink-0 p-5">
              <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-center">Find Job</p>
            </button>
          </div>
        </div>

>>>>>>> laica
        {/* Filter */}
        <div className="pt-5 w-full">
          <div className="flex gap-5 pb-5 overflow-x-auto">
            <div className="h-medium rounded-xs bg-secondary flex flex-grow min-w-[200px]">
              <select className="bg-secondary valid:text-fontcolor invalid:text-fontcolor flex-grow text-medium" id="date-posted" name="DatePosted" required>
                <option value="" disabled selected hidden>
                  Date Posted
                </option>
                <option value="Last Hour">Last Hour</option>
                <option value="Today">Today</option>
                <option value="Last Week">Last Week</option>
              </select>
            </div>

            <div className="h-medium rounded-xs bg-secondary flex flex-grow min-w-[200px]">
              <select className="bg-secondary valid:text-fontcolor invalid:text-fontcolor flex-grow text-medium" id="work-setup" name="WorkSetup" required>
                <option value="" disabled selected hidden>
                  Work Setup
                </option>
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="h-medium rounded-xs bg-secondary flex flex-grow min-w-[200px]">
              <select className="bg-secondary valid:text-fontcolor invalid:text-fontcolor flex-grow text-medium" id="employ-type" name="EmployType" required>
                <option value="" disabled selected hidden>
                  Employment Type
                </option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="h-medium rounded-xs bg-secondary flex flex-grow min-w-[200px]">
              <select className="bg-secondary valid:text-fontcolor invalid:text-fontcolor flex-grow text-medium" id="salary" name="salary" required>
                <option value="" disabled selected hidden>
                  Salary
                </option>
                <option value="Annually">Annually</option>
                <option value="Monthly">Monthly</option>
                <option value="Hourly">Hourly</option>
              </select>
            </div>

            <div className="h-medium rounded-xs bg-secondary flex flex-grow min-w-[200px]">
              <select className="bg-secondary valid:text-fontcolor invalid:text-fontcolor flex-grow text-medium" id="exp-level" name="ExperienceLevel" required>
                <option value="" disabled selected hidden>
                  Experience Level
                </option>
                <option value="Entry-Level">Entry-Level</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Mid-Level">Mid-Level</option>
              </select>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="flex flex-row pt-4 gap-2 pb-16">
          <JobListings authToken={authTokens.access} />
          <JobDetails authToken={authTokens.access} /> 
        </div>
      </div>
    </div>
    </>
=======
        {/* Job Listings and Details */}
      
        <div className="flex flex-col w-full pt-4 gap-2 pb-16">
          {/* Job Listings */}
          <div className="flex flex-row gap-2">
            <JobListings
              authToken={authTokens?.access} // Trigger to open job details
            />
            {/* Job Details for Desktop */}
            <div className="hidden md:block flex-grow">
              <JobDetails authToken={authTokens?.access} />
            </div>
          </div>

          {/* Job Details for Mobile (Animated Drawer) */}
          <div className={`fixed top-24 w-full h-full bg-background transition-transform duration-300 pr-16 z-20 mb:hidden flex items-start overscroll-x-none`}>
             <button
              onClick={() => {
              }}
              className="absolute -top-8 right-16 text-xl text-fontcolor"
            >
              ✖
            </button>
            {/* Job Details */}
            <JobDetails authToken={authTokens?.access} />
          </div>
        </div>

         

      </div>
      </div>
>>>>>>> laica
  );
}
