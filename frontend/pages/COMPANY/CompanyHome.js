import { useEffect, useRef, useState } from "react";
import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from "next/image";


// Function to dynamically determine className based on status
const getStatusClassName = (status) => {
  switch (status) {
    case "Complete":
      return "text-complete";
    case "Open":
      return "text-fontcolor";
    case "Draft":
      return "text-primary";
    case "Closed":
      return "text-accent";
    default:
      return "text-default";
  }
};

export default function CompanyHome() {
  const [jobs, setJobDetails] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const isSyncing = useRef(false); // Prevent infinite loop

  const syncScroll = (event, source) => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    if (source === "header" && bodyRef.current) {
      bodyRef.current.scrollLeft = event.target.scrollLeft;
    } else if (source === "body" && headerRef.current) {
      headerRef.current.scrollLeft = event.target.scrollLeft;
    }

    isSyncing.current = false;
  };

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, []);

  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
    localStorage.setItem('selectedJobId', jobId);
  };

  return (
    <div>
      <CompanyHeader />
      <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 xxsm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 xxsm:px-8 mx-auto pb-8">
        <div>
          <p className="text-fontcolor text-large pb-8">Hi, Name</p>
        </div>

        <div className="overflow-x-auto w-full">
          {/* Wrapper to ensure alignment */}
          <div className="relative w-full">
            {/* Header Table */}
            <div ref={headerRef} className="overflow-x-auto w-full" onScroll={(e) => syncScroll(e, "header")}>
              <table className="table-fixed min-w-[800px] w-full border-b-2 border-[#D9D9D9]">
                <thead className="font-semibold lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall xxsm:text-xxsmall text-primary bg-white">
                  <tr>
                    <th className="w-[200px] text-center p-5">Job Title</th>
                    <th className="w-[150px] text-center">Status</th>
                    <th className="w-[200px] text-center">No. of Applications</th>
                    <th className="w-[200px] text-center">Deadline</th>
                    <th className="w-[250px] text-center">Job Hiring Details</th>
                  </tr>
                </thead>
              </table>
            </div>


            <div ref={bodyRef} className="overflow-x-auto w-full" onScroll={(e) => syncScroll(e, "body")}>
              <table className="table-fixed min-w-[800px] w-full border-collapse text-center">
                <tbody>
                  {jobs.length > 0 ? (
                    jobs.map((job, index) => (
                      <tr key={index} className="hover:bg-[#F1F1F1] hover:border-primary border-b-2 border-[#D9D9D9]">
                        <td className="w-[200px] p-5 font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall  xxsm:text-xxsmall text-fontcolor">
                          {job.job_title}
                        </td>
                        <td className={`w-[150px] font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall  xxsm:text-xxsmall ${getStatusClassName(job.status)}`}>
                          {job.status}
                        </td>
                        <td className="w-[200px] font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall  xxsm:text-xxsmall text-fontcolor">
                          {job.num_applicants}
                        </td>
                        <td className="w-[200px] font-thin lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall  xxsm:text-xxsmall text-fontcolor">
                          {job.application_deadline}
                        </td>
                        <td className="w-[250px]">
                          <div className="flex justify-center gap-5 px-5">
                            <button type="button" onClick={() => handleJobSelect(job.Id)}>
                              <Link href="/COMPANY/ApplicantsSummary">
                                <Image src="/Eye Icon.svg" width={30} height={15} alt="Eye Icon" />
                              </Link>
                            </button>
                            <button type="button" onClick={() => handleJobSelect(job.Id)}>
                              <Link href="/COMPANY/EditJobHiring">
                                <Image src="/Edit Icon.svg" width={30} height={15} alt="Edit Icon" />
                              </Link>
                            </button>
                            <Image src="/Delete.svg" width={30} height={15} alt="Delete Icon" />
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
        </div>
      </div>

      <GeneralFooter />
    </div>
  );
}
