import ApplicantHeader from '@/components/ApplicantHeader';
import GeneralFooter from '@/components/GeneralFooter';
import JobDetails from '@/components/JobDetails';
import JobListings from '@/components/JobListings';
import Image from 'next/image';
import { useState, useEffect, useContext } from "react";
import AuthContext from '../context/AuthContext';
import { useRouter } from 'next/router';

//TODO Search

export default function ApplicantHome() {

  let {authTokens} = useContext(AuthContext);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [isSalaryOpen, setIsSalaryOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("Annually");
  const [range, setRange] = useState(0);


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

  const getApplicant = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/applicant/profile/view/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const profileData = data?.profile_data;
        if (profileData) {
          setApplicantName(profileData.first_name);
        } else {
          console.error('Profile data not found in response.');
        }
      } else {
        console.error('Failed to fetch applicant profile:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching applicant profile:', error);
    }
  };

  const handleJobClick = () => {
    setIsJobDetailsOpen(true);
  };

  // Handle closing job details
  const handleCloseJobDetails = () => {
    setIsJobDetailsOpen(false);
  };

  const salaryRanges = {
    Hourly: [ 5, 10, 20, 50, 100, 500, 700, 1000, 1500],
    Monthly: [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 70000, 80000, 100000],
    Annually: [ 60000, 70000, 80000, 90000, 100000, 120000, 180000, 240000, 300000, 360000, 480000, 600000, ]
  };

  const formatSalary = (value) => {
    const amount = salaryRanges[paymentType][value];
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleRangeChange = (e) => {
    setRange(Number(e.target.value));
  };


  // Fetch applicant data after mounting
  useEffect(() => {
    if (authTokens) {
      getApplicant();
    }
  }, [authTokens]);

  // Render nothing if not mounted or no authTokens
  if (!isMounted || !authTokens) {
    return null;
  }

  

  return (
    <div>
      <ApplicantHeader />
      <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-4 xxsm:px-4 mx-auto">
        <div>
          <p className="text-fontcolor">Hi, {applicantName}</p>
        </div>

        {/* Search */}
        <div className="pt-5 flex-wrap w-full">
          <div className="flex lg:flex-row gap-5 pb-5 mb:flex-row sm:flex-col xsm:flex-col xxsm:flex-col">
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
     
            <div className="relative">
              <div className="flex flex-col justify-center h-medium rounded-xs bg-secondary flex-grow min-w-[200px] cursor-pointer"onClick={() => setIsSalaryOpen(!isSalaryOpen)} >
                <div className="flex text-fontcolor items-center text-sm px-3">
                    {isSalaryOpen ? "" : ` ${paymentType || "Select Salary Type"}`}
                </div>
              </div>

              {isSalaryOpen && (
                <div className="bg-white mt-2 w-full p-4 rounded-md shadow-lg">
                  <div className="flex space-x-4 border-b">
                    {["Annually", "Monthly", "Hourly"].map((type) => (
                      <button key={type} className={`pb-2 text-sm ${ paymentType === type
                            ? "text-primary border-b-2 border-blue-500"
                            : "text-gray-500"
                        }`}
                        onClick={() => setPaymentType(type)}>
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Label */}
                  <div className="text-gray-500 text-medium mt-4">Salary Range (PHP)</div>
                  <div className="mt-4 space-y-2 max-h-20 overflow-y-auto">
                    {paymentType && salaryRanges[paymentType].map((value, index) => (
                        <label key={index}className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                          <input type="radio" name="salaryRange" value={index} checked={range === index} onChange={() => { setRange(index); setIsSalaryOpen(false);}} className=" ml-5 w-5 h-5" />
                            <span className='text-medium'>{formatSalary(index)}</span>
                        </label>
                      ))}
                  </div>
                </div>
              )}
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

        {/* Job Listings and Details */}
      
        <div className="flex flex-col w-full pt-4 gap-2 pb-16">
          {/* Job Listings */}
          <div className="flex flex-row gap-2">
            <JobListings
              authToken={authTokens?.access} 
              onJobClick={handleJobClick}// Trigger to open job details
            />
            {/* Job Details for Desktop */}
            <div className="hidden md:block flex-grow">
              <JobDetails authToken={authTokens?.access} />
            </div>
          </div>

          {/* Job Details for Mobile (Animated Drawer) */}
          <div 
            className={`fixed inset-0 bg-background transition-transform duration-300 md:hidden z-20 ${
              isJobDetailsOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <div className="relative h-full w-full pt-28 px-4">
              <button
                onClick={handleCloseJobDetails}
                className="absolute top-16 right-4 p-2 text-xl text-fontcolor hover:text-gray-700"
              >
                ✖
              </button>
              <JobDetails authToken={authTokens?.access} />
            </div>
          </div>
        </div>

         

      </div>
      </div>
  );
}