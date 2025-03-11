import { useEffect, useState, useContext, useCallback } from "react";
import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from "next/image";
import AuthContext from '../context/AuthContext';
import { useRouter } from 'next/router';

// Function to dynamically determine className based on status
const getStatusClassName = (status) => {
  const statusClasses = {
    Complete: "text-complete",
    Open: "text-fontcolor",
    Draft: "text-primary",
    Closed: "text-accent"
  };
  return statusClasses[status] || "text-default";
};


const getCompany = async (authTokens) => {
  try {
    const res = await fetch('http://127.0.0.1:8000/company/profile/view', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authTokens.access}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error("Failed to fetch company data");
    return await res.json();
  } catch (error) {
    console.error("Error fetching company details:", error);
    return null;
  }
};

export default function CompanyHome() {
  const [jobs, setJobDetails] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const router = useRouter();

  let {authTokens} = useContext(AuthContext);

  const fetchJobDetails = useCallback(async () => {
    try {
      const res = await fetch("/placeHolder/dummy_JobDetails.json"); 
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const json = await res.json();
      setJobDetails(json); 
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!authTokens) {
        router.push("/GENERAL/Login");
        return;
      }
  
      const companyData = await getCompany(authTokens);
      setCompanyName(companyData.profile_data.company_name);
      // console.log("Company data:", companyData);
  
      fetchJobDetails();
    };
  
    fetchData();
  }, [authTokens, router, fetchJobDetails]);
  
  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
    localStorage.setItem('selectedJobId', jobId);
  };

  return (
    <div>
      <>
        <CompanyHeader />
        <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto pb-8">
          <div>
            <p className="text-fontcolor pb-8">Hi, {companyName}</p>
          </div>

          <div className="flex items-center justify-center pb-5">
            <table className="table-fixed w-full">
              <thead className="font-semibold lg:text-medium mb:text-medium sm:text-medium text-primary">
                <tr>
                  <th className="w-2/6 text-center">Job Title</th>
                  <th className="w-1/12 text-center">Status</th>
                  <th className="w-1/6 text-center">No. of Applications</th>
                  <th className="w-1/12 text-center">Deadline</th>
                  <th className="w-2/6 text-center">Job Hiring Details</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="flex items-center justify-center overflow-hidden rounded-t-lg rounded-b-lg border border-[#F5F5F5]">
            <table className="table-fixed w-full border-collapse text-center">
              <tbody>
                {jobs.length > 0 ? (
                  jobs.map((job, index) => (
                    <tr key={index} className="px-2 hover:shadow-md border-b border-[#F5F5F5]">
                      <td className="w-2/6 p-5 font-thin text-medium text-fontcolor truncate">
                        {job.job_title}
                      </td>
                      <td className={`w-1/12 font-thin text-medium truncate ${getStatusClassName(job.status)}`}>
                        {job.status}
                      </td>
                      <td className="w-1/6 font-thin text-medium text-fontcolor truncate">
                        {job.num_applicants}
                      </td>
                      <td className="w-1/12 font-thin text-medium text-fontcolor truncate">
                        {job.application_deadline}
                      </td>
                      <td className="w-2/6">
                        <div className="flex flex-row justify-between px-5">
                          <button type="button" className="button1 flex flex-col items-center justify-center" onClick={() => handleJobSelect(job.Id)}>
                            <Link href="/COMPANY/ApplicantsSummary" className="flex items-center space-x-2">
                              <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                View Applicants
                              </p>
                            </Link>
                          </button>
                          <button type="button" className="button2 flex items-center justify-center" onClick={() => handleJobSelect(job.Id)}>
                            <Link href="/COMPANY/EditJobHiring" className="flex items-center space-x-2">
                              <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                                Edit Job Hiring
                              </p>
                            </Link>
                          </button>
                          <Image src="/Delete.png" width={25} height={15} alt="Delete Icon" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-5 text-center">
                      No job details available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <GeneralFooter />
      </>
    </div>
  );
}
