import Link from "next/link";
import Image from "next/image";
import CompanyHeader from "@/components/CompanyHeader";
import CompanyJobDetailsWrapper from "@/components/CompanyJobDetails";
import GeneralFooter from "@/components/GeneralFooter";
import { useState, useEffect } from "react";

//* PAGE STATUS
// TODO Get the job hiring id
// TODO

export default function EditJobHiring({ jobId }) {
  const [jobDetails, setJobDetails] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(jobId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentJobId = jobId || localStorage.getItem("selectedJobId");
        if (!currentJobId) {
          console.error("No job ID provided");
          return;
        }

        const res = await fetch("/placeHolder/dummy_JobDetails.json");
        const json = await res.json();
        const item = json.find((item) => item.Id === parseInt(currentJobId));

        if (item) {
          setJobDetails(item);
        } else {
          console.error("Job not found");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchData();
  }, [jobId]);

  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
    localStorage.setItem("selectedJobId", jobId);
  };

  return (
    <div>
      <CompanyHeader />
      <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto pb-8">
        <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary pb-5">
          Job Hiring Details{" "}
        </h1>

        {jobDetails ? (
          <div className="flex flex-row justify-end px-5">
            <button
              type="button"
              className="button1 flex flex-col items-center justify-center mr-10"
              onClick={() => handleJobSelect(jobDetails.Id)}
            >
              <Link
                href="/COMPANY/ApplicantsSummary"
                className="flex items-center space-x-2"
              >
                <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                  {" "}
                  View Applicants Summary{" "}
                </p>
              </Link>
            </button>
            <Image src="/Delete.png" width={30} height={15} alt="Delete Icon" />
          </div>
        ) : (
          <p className="p-5 text-center">No job details available.</p>
        )}

        <div className="flex flex-row gap-5">
          <CompanyJobDetailsWrapper />
          <div className="w-4/6 flex flex-col">
            <p>Add settings here</p>
          </div>
        </div>
      </div>
      <GeneralFooter />
    </div>
  );
}
